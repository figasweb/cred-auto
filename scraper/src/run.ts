import { chromium, type Browser, type Page } from 'playwright';
import { bankSources, validationRules, type BankSource, type PageInteraction, type FieldPatterns } from './sources.js';

const ANTHROPIC_API_KEY = process.env.ANTHROPIC_API_KEY || '';
const CF_API_TOKEN = process.env.CLOUDFLARE_API_TOKEN || '';
const CF_ACCOUNT_ID = process.env.CLOUDFLARE_ACCOUNT_ID || '';
const CF_KV_NAMESPACE_ID = process.env.CLOUDFLARE_KV_NAMESPACE_ID || '';
const TELEGRAM_BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN || '';
const TELEGRAM_CHAT_ID = process.env.TELEGRAM_CHAT_ID || '';
const DRY_RUN = process.argv.includes('--dry-run');
const USE_CHROME = process.argv.includes('--use-chrome');
const CHROME_CDP_PORT = 9222;
const MANUAL_MODE = !ANTHROPIC_API_KEY;
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
  fonteUrl?: string;
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
  let cleaned = raw.replace(/\s/g, '');
  const hasDot = cleaned.includes('.');
  const hasComma = cleaned.includes(',');
  if (hasDot && hasComma) {
    // "5.000,50" → dot is thousands, comma is decimal
    cleaned = cleaned.replace(/\./g, '').replace(',', '.');
  } else if (hasComma) {
    // "5,50" → comma is decimal
    cleaned = cleaned.replace(',', '.');
  } else if (hasDot) {
    // "11.0" or "75.000" or "9.500" — check if dot is decimal or thousands
    const parts = cleaned.split('.');
    if (parts.length === 2 && parts[1].length === 3 && parts[0].length >= 2 && parseInt(parts[0]) >= 10) {
      // "75.000" → thousands separator (only when integer part >= 10)
      cleaned = cleaned.replace('.', '');
    }
    // else "9.500", "11.0", "8.000" → dot is decimal, keep as is
  }
  return parseFloat(cleaned);
}

function log(msg: string) {
  const ts = new Date().toISOString().substring(11, 19);
  console.log(`[${ts}] ${msg}`);
}

// ─── Browser management ───

let browser: Browser | null = null;
let chromeBrowser: Browser | null = null;

async function getBrowser(): Promise<Browser> {
  if (!browser) {
    browser = await chromium.launch({ headless: true });
  }
  return browser;
}

/** Connect to user's real Chrome via CDP (for anti-bot sites) */
async function getChromeBrowser(): Promise<Browser> {
  if (!chromeBrowser) {
    try {
      chromeBrowser = await chromium.connectOverCDP(`http://localhost:${CHROME_CDP_PORT}`);
      log('Connected to Chrome via CDP on port ' + CHROME_CDP_PORT);
    } catch (err) {
      throw new Error(
        `Cannot connect to Chrome on port ${CHROME_CDP_PORT}. ` +
        `Start Chrome with: chrome.exe --remote-debugging-port=${CHROME_CDP_PORT}`
      );
    }
  }
  return chromeBrowser;
}

interface RenderedPage {
  html: string;
  page: Page;
}

/** Dismiss cookie banners, GDPR popups, and other overlays */
async function dismissOverlays(page: Page) {
  // Common cookie/consent selectors across Portuguese bank sites
  const selectors = [
    '#onetrust-accept-btn-handler',
    '#CybotCookiebotDialogBodyLevelButtonLevelOptinAllowAll',
    'button[id*="accept"]',
    'button[id*="cookie"]',
    'button[class*="accept"]',
    'a[id*="accept"]',
    '.cookie-accept',
    '.accept-cookies',
    '[data-testid="cookie-accept"]',
    'button:has-text("Aceitar")',
    'button:has-text("Aceitar todos")',
    'button:has-text("Aceitar todos os cookies")',
    'button:has-text("Accept")',
    'button:has-text("Accept all")',
    'button:has-text("Permitir todos")',
  ];

  for (const sel of selectors) {
    try {
      const btn = page.locator(sel).first();
      if (await btn.isVisible({ timeout: 500 })) {
        await btn.click({ timeout: 2000 });
        await page.waitForTimeout(500);
        return;
      }
    } catch { /* try next */ }
  }

  // Fallback: remove overlay elements via JS
  await page.evaluate(() => {
    document.querySelectorAll('[id*="onetrust"], [id*="cookie"], [class*="cookie-banner"], [class*="consent"], [id*="consent"]')
      .forEach(el => el.remove());
    // Remove any fixed/sticky overlays blocking content
    document.querySelectorAll('div').forEach(el => {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky') && s.zIndex && parseInt(s.zIndex) > 999 && el.offsetHeight < 400) {
        el.remove();
      }
    });
  }).catch(() => {});
}

async function getRenderedPage(url: string, interactions?: PageInteraction[], useChrome?: boolean): Promise<RenderedPage> {
  const b = useChrome ? await getChromeBrowser() : await getBrowser();
  const ctx = useChrome ? b.contexts()[0] || await b.newContext() : await b.newContext();
  const page = await ctx.newPage();

  await page.goto(url, { waitUntil: 'networkidle', timeout: 30000 });
  await page.waitForTimeout(2000);

  // Dismiss cookie/GDPR overlays before interactions and screenshots
  await dismissOverlays(page);

  if (interactions) {
    for (const action of interactions) {
      if (action.click) {
        log(`    clicking: ${action.click}`);
        await page.click(action.click, { timeout: 5000 }).catch(() => {
          log(`    click failed: ${action.click}`);
        });
      }
      if (action.waitFor) {
        await page.waitForSelector(action.waitFor, { timeout: 5000 }).catch(() => {});
      }
      await page.waitForTimeout(action.delay ?? 1000);
    }
  }

  const html = await page.content();
  return { html, page };
}

async function closeBrowser() {
  if (browser) {
    await browser.close();
    browser = null;
  }
  if (chromeBrowser) {
    await chromeBrowser.close();
    chromeBrowser = null;
  }
}

// ─── Helpers ───

/** Merge default patterns with per-type overrides */
function resolvePatterns(bank: BankSource, vehicleType: VehicleType): FieldPatterns {
  const base = { ...bank.patterns };
  const overrides = bank.patternsPerType?.[vehicleType];
  if (overrides) {
    if (overrides.tan) base.tan = overrides.tan;
    if (overrides.taeg) base.taeg = overrides.taeg;
    if (overrides.minMontante) base.minMontante = overrides.minMontante;
    if (overrides.maxMontante) base.maxMontante = overrides.maxMontante;
    if (overrides.minPrazo) base.minPrazo = overrides.minPrazo;
    if (overrides.maxPrazo) base.maxPrazo = overrides.maxPrazo;
  }
  return base;
}

// ─── Regex extraction ───

function extractWithRegex(
  html: string,
  patterns: FieldPatterns,
): { data: Record<string, number | null>; missing: string[] } {
  const data: Record<string, number | null> = {};
  const missing: string[] = [];

  for (const [field, regex] of Object.entries(patterns)) {
    if (!regex) { missing.push(field); continue; }
    const match = html.match(regex);
    if (match?.[1]) {
      const val = parsePortugueseNumber(match[1]);
      // Round percentages to 2 decimal places (some hidden inputs have extra precision)
      data[field] = (field === 'tan' || field === 'taeg') ? Math.round(val * 100) / 100 : val;
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

// ─── Failure reports (manual mode) ───

async function saveFailureReport(
  bank: BankSource,
  vehicleType: VehicleType,
  url: string,
  html: string,
  missing: string[],
) {
  const fs = await import('fs');
  const path = await import('path');
  const dir = path.join(import.meta.dirname, '..', 'failures');
  fs.mkdirSync(dir, { recursive: true });

  // Save HTML
  const htmlDir = path.join(dir, 'html');
  fs.mkdirSync(htmlDir, { recursive: true });
  const htmlFile = `${bank.id}_${vehicleType}.html`;
  fs.writeFileSync(path.join(htmlDir, htmlFile), html);

  // Save failure report as .md (ready to paste into LLM)
  const reportFile = `${bank.id}_${vehicleType}.md`;
  const snippet = html.substring(0, 5000);
  const currentPatterns = missing.map(f => {
    const pat = bank.patterns[f as keyof typeof bank.patterns];
    return `- ${f}: \`${pat?.source || 'none'}\``;
  }).join('\n');

  const report = `# Extraction Failure: ${bank.nome} / ${vehicleType}

## URL: ${url}
## Failed fields: ${missing.join(', ')}

## Current patterns
${currentPatterns}

## HTML snippet
\`\`\`html
${snippet}
\`\`\`

## Full HTML saved at: failures/html/${htmlFile}

## Task
Analyze the HTML and provide corrected regex patterns for the failed fields.
Return JSON: { "fieldName": "new_regex_pattern" }
`;

  fs.writeFileSync(path.join(dir, reportFile), report);
  log(`  [MANUAL] Failure report saved: failures/${reportFile}`);
}

// ─── LLM fallback ───

let anthropic: any = null;

async function extractWithLlm(
  html: string,
  bankName: string,
  url: string,
  vehicleType: VehicleType,
): Promise<Record<string, number | null>> {
  if (!anthropic) {
    if (!ANTHROPIC_API_KEY) throw new Error('LLM_API_KEY not set');
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
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
    if (!ANTHROPIC_API_KEY) throw new Error('LLM_API_KEY not set');
    const { default: Anthropic } = await import('@anthropic-ai/sdk');
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

  // Skip anti-bot banks unless --use-chrome is active
  if (bank.requiresChrome && !USE_CHROME) {
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: false, errors: ['Requires --use-chrome (anti-bot site)'], usedLlm: false };
  }

  // 1. Fetch rendered HTML via Playwright
  let html: string;
  let page: Page | null = null;
  try {
    const interactions = bank.interactions?.[vehicleType];
    const useChrome = bank.requiresChrome && USE_CHROME;
    log(`  Opening ${url}${useChrome ? ' (Chrome CDP)' : ''}...${interactions ? ` (${interactions.length} interactions)` : ''}`);
    const rendered = await getRenderedPage(url, interactions, useChrome);
    html = rendered.html;
    page = rendered.page;
    log(`  Got ${html.length} chars of rendered HTML`);
  } catch (err) {
    if (page) await page.close().catch(() => {});
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: false, errors: [`Browser fetch failed: ${err}`], usedLlm: false };
  }

  // 2. Regex extraction (with per-type pattern overrides)
  const patterns = resolvePatterns(bank, vehicleType);
  const { data: regexData, missing } = extractWithRegex(html, patterns);

  // 3. Screenshot evidence — one per field per vehicle type
  const fs = await import('fs');
  const pathMod = await import('path');
  const evidDir = pathMod.join(import.meta.dirname, '..', 'evidences');
  fs.mkdirSync(evidDir, { recursive: true });

  // Remove overlays once before all screenshots
  await page.evaluate(() => {
    document.querySelectorAll('[id*="onetrust"], [id*="cookie"], [class*="consent"], [id*="consent"]').forEach(el => el.remove());
    document.querySelectorAll('div').forEach(el => {
      const s = getComputedStyle(el);
      if ((s.position === 'fixed' || s.position === 'sticky') && parseInt(s.zIndex || '0') > 100) el.remove();
    });
  }).catch(() => {});

  for (const field of ['tan', 'taeg'] as const) {
    const ssPath = pathMod.join(evidDir, `${bank.id}_${field}_${vehicleType}.png`);
    if (fs.existsSync(ssPath)) continue;

    const extractedValue = regexData[field];
    if (extractedValue == null) continue;

    try {
      // Format the value in multiple ways it might appear on the page
      const val = extractedValue;
      const valComma = String(val).replace('.', ',');
      const searches = [
        `${valComma}%`,                                      // "8,1%"
        `${val}%`,                                           // "8.1%"
        `${val.toFixed(3).replace('.', ',')}%`,              // "8,100%"
        `${val.toFixed(2).replace('.', ',')}%`,              // "8,10%"
        `${val.toFixed(3)}%`,                                // "8.100%"
        `${val.toFixed(2)}%`,                                // "8.10%"
        `${valComma} %`,                                     // "8,1 %"
        `${val} %`,                                          // "8.1 %"
        // Without % (for cases where % is in <sup> tag)
        `${valComma}`,                                       // "8,1"
        `${val.toFixed(3).replace('.', ',')}`,               // "8,100"
        `${val.toFixed(2).replace('.', ',')}`,               // "8,10"
      ];

      let highlighted = false;

      for (const search of searches) {
        if (highlighted) break;

        const loc = page.getByText(search, { exact: false }).first();
        try {
          // Try visible first
          if (await loc.isVisible({ timeout: 300 })) {
            await loc.evaluate((el) => {
              el.style.outline = '4px solid #ff0000';
              el.style.outlineOffset = '2px';
              el.style.backgroundColor = '#ffe600';
            });
            await loc.scrollIntoViewIfNeeded();
            await page.waitForTimeout(200);
            highlighted = true;
          }
        } catch {
          // Element exists but not "visible" (tiny font, overflow hidden, etc.)
          // Force show it anyway
          try {
            const count = await loc.count();
            if (count > 0) {
              await loc.evaluate((el) => {
                el.style.outline = '4px solid #ff0000';
                el.style.outlineOffset = '2px';
                el.style.backgroundColor = '#ffe600';
                el.style.fontSize = '14px';
                el.style.display = 'block';
                el.scrollIntoView({ block: 'center' });
              });
              await page.waitForTimeout(200);
              highlighted = true;
            }
          } catch { /* try next format */ }
        }
      }

      // Last resort: if no highlight via locator, try JS innerHTML search
      if (!highlighted) {
        try {
          highlighted = await page.evaluate((searchTerms) => {
            for (const term of searchTerms) {
              const els = Array.from(document.querySelectorAll('p, span, div, td, li, strong, b'));
              const el = els.find(e => e.textContent?.includes(term) && e.children.length < 3);
              if (el) {
                (el as HTMLElement).style.outline = '4px solid #ff0000';
                (el as HTMLElement).style.outlineOffset = '2px';
                (el as HTMLElement).style.backgroundColor = '#ffe600';
                el.scrollIntoView({ block: 'center' });
                return true;
              }
            }
            return false;
          }, searches.slice(0, 6));
        } catch {}
      }

      await page.waitForTimeout(300);
      await page.screenshot({ path: ssPath, fullPage: false });

      // Remove highlight for next screenshot
      if (highlighted) {
        await page.evaluate(() => {
          document.querySelectorAll('*').forEach(el => {
            if ((el as HTMLElement).style?.outline?.includes('#ff0000')) {
              (el as HTMLElement).style.outline = '';
              (el as HTMLElement).style.outlineOffset = '';
              (el as HTMLElement).style.backgroundColor = '';
            }
          });
        }).catch(() => {});
      }

      log(`  Evidence: ${bank.id}_${field}_${vehicleType}.png${highlighted ? '' : ' (no highlight found)'}`);
    } catch (err: any) {
      try {
        await page.screenshot({ path: ssPath, fullPage: false });
        log(`  Evidence (fallback): ${bank.id}_${field}_${vehicleType}.png`);
      } catch { /* give up */ }
    }
  }

  await page.close().catch(() => {});

  // Build entry with static fallbacks applied
  const entry = buildEntry(bank, vehicleType, regexData, url);

  // Check if final entry has TAN+TAEG (from regex or static fields)
  const hasTanTaeg = entry.tan !== undefined && entry.taeg !== undefined;
  const entryForValidation: Record<string, number | null> = {
    tan: entry.tan ?? null,
    taeg: entry.taeg ?? null,
    minMontante: entry.minMontante ?? null,
    maxMontante: entry.maxMontante ?? null,
    minPrazo: entry.minPrazo ?? null,
    maxPrazo: entry.maxPrazo ?? null,
  };
  const validationErrors = validate(entryForValidation);

  if (hasTanTaeg && validationErrors.length === 0) {
    if (missing.length > 0) {
      log(`  Regex missed [${missing.join(',')}] but static fields cover it`);
    }
    return { bankId: bank.id, bankName: bank.nome, vehicleType, success: true, data: entry, usedLlm: false };
  }

  // 3. LLM fallback (or manual mode)
  log(`  Incomplete for ${bank.nome}/${vehicleType}: missing=[${missing.join(',')}] errors=[${validationErrors.join(',')}] hasTanTaeg=${hasTanTaeg}`);

  if (MANUAL_MODE) {
    await saveFailureReport(bank, vehicleType, url, html, missing);
    return {
      bankId: bank.id, bankName: bank.nome, vehicleType, success: false,
      errors: [`Manual mode: missing=[${missing.join(',')}]. Check failures/ for report.`], usedLlm: false,
    };
  }

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
  // Scraped values (only non-null)
  const scraped: Partial<BankEntry> = {};
  if (data.tan != null) scraped.tan = data.tan;
  if (data.taeg != null) scraped.taeg = data.taeg;
  if (data.minMontante != null) scraped.minMontante = data.minMontante;
  if (data.maxMontante != null) scraped.maxMontante = data.maxMontante;
  if (data.minPrazo != null) scraped.minPrazo = data.minPrazo;
  if (data.maxPrazo != null) scraped.maxPrazo = data.maxPrazo;

  // Merge: base static → per-type static → scraped (highest priority)
  const perTypeStatic = bank.staticFieldsPerType?.[vehicleType] as Partial<BankEntry> | undefined;

  return {
    id: bank.id,
    nome: bank.nome,
    url,
    logo: logoUrl(bank.domain),
    fonteUrl: url,
    ...(bank.staticFields as Partial<BankEntry>),
    ...(perTypeStatic || {}),
    ...scraped,
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
  log('Starting scrape run (Playwright)...');
  if (MANUAL_MODE) log('MANUAL MODE — no LLM API key, failures saved to failures/');
  if (DRY_RUN) log('DRY RUN — will not update KV');

  const vehicleTypes: VehicleType[] = ['novo', 'usado', 'eletrico'];
  const allResults: ScrapeResult[] = [];

  try {
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
  } finally {
    await closeBrowser();
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

  // Save results to file for inspection
  const fs = await import('fs');
  fs.writeFileSync('scrape-results.json', JSON.stringify(finalData, null, 2));
  log('Results saved to scrape-results.json');

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
