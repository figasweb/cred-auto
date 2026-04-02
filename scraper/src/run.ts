import Anthropic from '@anthropic-ai/sdk';
import { bankSources, validationRules, type BankSource } from './sources.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_KV_NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const DRY_RUN = process.argv.includes('--dry-run');
const USER_AGENT = 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/136.0.0.0 Safari/537.36';
const LLM_MODEL = 'claude-haiku-4-5-20251001';

type VehicleType = 'novo' | 'usado' | 'eletrico';

interface BankEntry {
  id: string;
  nome: string;
  tan: number;
  taeg: number;
  minMontante: number;
  maxMontante: number;
  minPrazo: number;
  maxPrazo: number;
  url: string;
  logo: string;
  comissaoAbertura?: string;
}

interface ScrapeResult {
  bankId: string;
  bankName: string;
  vehicleType: VehicleType;
  success: boolean;
  data?: Partial<BankEntry>;
  errors?: string[];
  usedLlm: boolean;
}

// ─── Helpers ───

function logoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

function parsePortugueseNumber(raw: string): number {
  // "5.000" → 5000, "5,50" → 5.5
  const cleaned = raw.replace(/\s/g, '').replace(/\./g, '').replace(',', '.');
  return parseFloat(cleaned);
}

function log(msg: string) {
  const ts = new Date().toISOString().substring(11, 19);
  console.log(`[${ts}] ${msg}`);
}

// ─── Fetch HTML ───

async function fetchHtml(url: string): Promise<string> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), 15000);
  try {
    const res = await fetch(url, {
      headers: { 'User-Agent': USER_AGENT },
      signal: controller.signal,
    });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    return await res.text();
  } finally {
    clearTimeout(timeout);
  }
}

// ─── Regex extraction ───

function extractWithRegex(
  html: string,
  patterns: BankSource['patterns'],
): { data: Record<string, number | null>; missing: string[] } {
  const data: Record<string, number | null> = {};
  const missing: string[] = [];

  for (const [field, regex] of Object.entries(patterns)) {
    if (!regex) { missing.push(field); continue; }
    const match = html.match(regex);
    if (match?.[1]) {
      data[field] = parsePortugueseNumber(match[1]);
    } else {
      missing.push(field);
      data[field] = null;
    }
  }
  return { data, missing };
}

// ─── Validation ───

function validate(data: Record<string, number | null>): string[] {
  const errors: string[] = [];
  for (const [field, rule] of Object.entries(validationRules)) {
    const val = data[field];
    if (rule.required && (val === null || val === undefined)) {
      errors.push(`${field}: required but missing`);
      continue;
    }
    if (val === null || val === undefined) continue;
    if (typeof val !== 'number' || isNaN(val)) {
      errors.push(`${field}: not a valid number`);
      continue;
    }
    if (rule.min !== undefined && val < rule.min) errors.push(`${field}: ${val} < ${rule.min}`);
    if (rule.max !== undefined && val > rule.max) errors.push(`${field}: ${val} > ${rule.max}`);
  }
  return errors;
}

// ─── LLM fallback ───

let anthropic: Anthropic | null = null;

async function extractWithLlm(
  html: string,
  bankName: string,
  url: string,
  vehicleType: VehicleType,
): Promise<Record<string, number | null>> {
  if (!anthropic) {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
    anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }

  const truncated = html.length > 30000 ? html.substring(0, 30000) : html;
  const tipoLabel = { novo: 'novo (0 km)', usado: 'usado (segunda mão)', eletrico: 'elétrico' };

  const response = await anthropic.messages.create({
    model: LLM_MODEL,
    max_tokens: 512,
    messages: [{
      role: 'user',
      content: `Extract car loan (crédito automóvel) conditions for vehicle type "${tipoLabel[vehicleType]}" from this Portuguese bank page: "${bankName}" (${url}).

Extract these fields:
- tan: Annual Nominal Rate (TAN) as a number (e.g., 5.5)
- taeg: Annual Percentage Rate (TAEG) as a number
- minMontante: Minimum loan amount in euros (e.g., 2500)
- maxMontante: Maximum loan amount in euros
- minPrazo: Minimum term in months
- maxPrazo: Maximum term in months

Return ONLY a JSON object with these fields. Use null for values not found.
Numbers only — no % signs, no € signs.

HTML:
${truncated}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) throw new Error('LLM returned no JSON');
  return JSON.parse(jsonMatch[0]);
}

async function fixRegexWithLlm(
  html: string,
  bankName: string,
  failedFields: string[],
  currentPatterns: Record<string, string>,
): Promise<Record<string, string>> {
  if (!anthropic) {
    if (!ANTHROPIC_API_KEY) throw new Error('ANTHROPIC_API_KEY not set');
    anthropic = new Anthropic({ apiKey: ANTHROPIC_API_KEY });
  }

  const truncated = html.length > 15000 ? html.substring(0, 15000) : html;

  const response = await anthropic.messages.create({
    model: LLM_MODEL,
    max_tokens: 1024,
    messages: [{
      role: 'user',
      content: `These JavaScript regex patterns FAILED to extract data from "${bankName}":

${failedFields.map(f => `- ${f}: /${currentPatterns[f] || 'none'}/i`).join('\n')}

Write improved regex patterns that would extract these fields from this Portuguese bank page.
Return ONLY a JSON object where keys are field names and values are regex strings (no / delimiters).
Each regex must have exactly ONE capture group for the value.

HTML:
${truncated}`,
    }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  const jsonMatch = text.match(/\{[\s\S]*\}/);
  if (!jsonMatch) return {};
  try { return JSON.parse(jsonMatch[0]); } catch { return {}; }
}

// ─── Scrape one bank for one vehicle type ───

async function scrapeBank(
  bank: BankSource,
  vehicleType: VehicleType,
): Promise<ScrapeResult> {
  const url = bank.urls[vehicleType];
  if (!url) {
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: false, errors: ['No URL for this type'], usedLlm: false };
  }

  // 1. Fetch
  let html: string;
  try {
    html = await fetchHtml(url);
  } catch (err) {
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: false, errors: [`Fetch failed: ${err}`], usedLlm: false };
  }

  // 2. Regex
  const { data: regexData, missing } = extractWithRegex(html, bank.patterns);
  const tanRequired = regexData.tan !== null && regexData.taeg !== null;
  const validationErrors = validate(regexData);

  if (missing.filter(f => f === 'tan' || f === 'taeg').length === 0 && validationErrors.length === 0) {
    // Regex succeeded for critical fields
    const entry = buildEntry(bank, vehicleType, regexData, url);
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: true, data: entry, usedLlm: false };
  }

  // 3. LLM fallback
  log(`  [LLM] Regex failed for ${bank.nome}/${vehicleType}: missing=[${missing.join(',')}] errors=[${validationErrors.join(',')}]`);

  try {
    const llmData = await extractWithLlm(html, bank.nome, url, vehicleType);
    const llmErrors = validate(llmData as Record<string, number | null>);

    if (llmErrors.length > 0) {
      return {
        bankId: bank.id, bankName: bank.nome, vehicleType, success: false,
        errors: [`LLM validation failed: ${llmErrors.join(', ')}`], usedLlm: true,
      };
    }

    // 4. Ask LLM to fix regex for next time
    if (missing.length > 0) {
      const currentPats: Record<string, string> = {};
      for (const f of missing) {
        const pat = bank.patterns[f as keyof typeof bank.patterns];
        currentPats[f] = pat?.source || 'none';
      }
      const fixedPatterns = await fixRegexWithLlm(html, bank.nome, missing, currentPats);
      if (Object.keys(fixedPatterns).length > 0) {
        log(`  [LLM] Suggested regex fixes for ${bank.nome}: ${JSON.stringify(fixedPatterns)}`);
      }
    }

    const entry = buildEntry(bank, vehicleType, llmData as Record<string, number | null>, url);
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: true, data: entry, usedLlm: true };
  } catch (err) {
    return {
      bankId: bank.id, bankName: bank.nome, vehicleType, success: false,
      errors: [`Regex: missing=[${missing}], LLM failed: ${err}`], usedLlm: true,
    };
  }
}

function buildEntry(
  bank: BankSource,
  vehicleType: VehicleType,
  data: Record<string, number | null>,
  url: string,
): Partial<BankEntry> {
  return {
    id: bank.id,
    nome: bank.nome,
    tan: data.tan ?? undefined,
    taeg: data.taeg ?? undefined,
    minMontante: data.minMontante ?? undefined,
    maxMontante: data.maxMontante ?? undefined,
    minPrazo: data.minPrazo ?? undefined,
    maxPrazo: data.maxPrazo ?? undefined,
    url,
    logo: logoUrl(bank.domain),
    ...(bank.staticFields as Partial<BankEntry>),
  };
}

// ─── Update Cloudflare KV ───

async function updateKV(data: Record<VehicleType, BankEntry[]>): Promise<void> {
  if (!CF_API_TOKEN || !CF_ACCOUNT_ID || !CF_KV_NAMESPACE_ID) {
    throw new Error('Missing Cloudflare credentials (CLOUDFLARE_API_TOKEN, CLOUDFLARE_ACCOUNT_ID, CLOUDFLARE_KV_NAMESPACE_ID)');
  }

  const kvUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/instituicoes`;

  const res = await fetch(kvUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(data),
  });

  if (!res.ok) {
    const body = await res.text();
    throw new Error(`KV update failed: ${res.status} ${body}`);
  }

  // Update metadata
  const metaUrl = `https://api.cloudflare.com/client/v4/accounts/${CF_ACCOUNT_ID}/storage/kv/namespaces/${CF_KV_NAMESPACE_ID}/values/instituicoes:meta`;
  await fetch(metaUrl, {
    method: 'PUT',
    headers: {
      'Authorization': `Bearer ${CF_API_TOKEN}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ lastUpdate: new Date().toISOString() }),
  });
}

// ─── Telegram notification ───

async function notifyTelegram(message: string): Promise<void> {
  if (!TELEGRAM_BOT_TOKEN || !TELEGRAM_CHAT_ID) return;

  await fetch(`https://api.telegram.org/bot${TELEGRAM_BOT_TOKEN}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      chat_id: TELEGRAM_CHAT_ID,
      text: message,
      parse_mode: 'Markdown',
    }),
  });
}

// ─── Main ───

async function main() {
  log('Starting scrape run...');
  if (DRY_RUN) log('DRY RUN — will not update KV');

  const vehicleTypes: VehicleType[] = ['novo', 'usado', 'eletrico'];
  const allResults: ScrapeResult[] = [];

  for (const bank of bankSources) {
    for (const vt of vehicleTypes) {
      if (!bank.urls[vt]) continue;
      log(`Scraping ${bank.nome} / ${vt}...`);
      const result = await scrapeBank(bank, vt);
      allResults.push(result);

      if (result.success) {
        log(`  OK ${result.usedLlm ? '(LLM)' : '(regex)'}`);
      } else {
        log(`  FAILED: ${result.errors?.join(', ')}`);
      }
    }
  }

  // Build final data
  const finalData: Record<VehicleType, BankEntry[]> = { novo: [], usado: [], eletrico: [] };

  for (const vt of vehicleTypes) {
    const vtResults = allResults.filter(r => r.vehicleType === vt && r.success && r.data);
    for (const r of vtResults) {
      const d = r.data!;
      if (d.tan !== undefined && d.taeg !== undefined) {
        finalData[vt].push(d as BankEntry);
      }
    }
  }

  // Summary
  const total = allResults.length;
  const success = allResults.filter(r => r.success).length;
  const failed = allResults.filter(r => !r.success).length;
  const llmUsed = allResults.filter(r => r.usedLlm).length;

  log(`\nSummary: ${success}/${total} OK, ${failed} failed, ${llmUsed} used LLM`);
  log(`Data: novo=${finalData.novo.length}, usado=${finalData.usado.length}, eletrico=${finalData.eletrico.length}`);

  if (!DRY_RUN && success > 0) {
    log('Updating Cloudflare KV...');
    try {
      await updateKV(finalData);
      log('KV updated successfully');
    } catch (err) {
      log(`KV update FAILED: ${err}`);
    }
  }

  // Telegram notification
  const failedBanks = allResults.filter(r => !r.success).map(r => `${r.bankName}/${r.vehicleType}`);
  const summary = [
    `*Scrape Report* ${DRY_RUN ? '(DRY RUN)' : ''}`,
    `OK: ${success}/${total}`,
    `Failed: ${failed}`,
    `LLM fallback: ${llmUsed}`,
    `Bancos: novo=${finalData.novo.length} usado=${finalData.usado.length} eletrico=${finalData.eletrico.length}`,
    failedBanks.length > 0 ? `\nFailed: ${failedBanks.join(', ')}` : '',
  ].join('\n');

  log(summary);
  await notifyTelegram(summary);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
