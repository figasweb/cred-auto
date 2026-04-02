/**
 * Bank scraping source definitions.
 * Each source has:
 * - URL to scrape
 * - Regex patterns for each field (with 1 capture group)
 * - Validation rules
 *
 * Vehicle types: novo, usado, eletrico
 * Some banks have the same page for all types, others have separate pages.
 */

export interface PageInteraction {
  /** CSS selector to click */
  click?: string;
  /** CSS selector to wait for before continuing */
  waitFor?: string;
  /** Milliseconds to wait */
  delay?: number;
}

export interface BankSource {
  id: string;
  nome: string;
  domain: string;
  /** URLs per vehicle type. If a type is missing, that bank doesn't offer it. */
  urls: Partial<Record<'novo' | 'usado' | 'eletrico', string>>;
  /** Actions to perform after page load, per vehicle type (e.g. click a tab) */
  interactions?: Partial<Record<'novo' | 'usado' | 'eletrico', PageInteraction[]>>;
  /** Regex patterns to extract fields. Each regex must have exactly 1 capture group. */
  patterns: {
    tan: RegExp;
    taeg: RegExp;
    minMontante?: RegExp;
    maxMontante?: RegExp;
    minPrazo?: RegExp;
    maxPrazo?: RegExp;
  };
  /** Static values for fields that don't change or can't be scraped */
  staticFields?: Partial<Record<string, unknown>>;
}

/** Validation rules applied to all scraped values */
export const validationRules = {
  tan: { type: 'number' as const, min: 0, max: 30, required: true },
  taeg: { type: 'number' as const, min: 0, max: 30, required: true },
  minMontante: { type: 'number' as const, min: 500, max: 100000 },
  maxMontante: { type: 'number' as const, min: 1000, max: 200000 },
  minPrazo: { type: 'number' as const, min: 6, max: 120 },
  maxPrazo: { type: 'number' as const, min: 12, max: 240 },
};

/**
 * Portuguese bank sources.
 *
 * Regex strategy:
 * - Look for TAN/TAEG patterns near percentage values
 * - Common patterns: "TAN: 5,00%", "TAN de 5%", "TAN fixa de 5,00%"
 * - Portuguese uses comma for decimals: 5,00% not 5.00%
 */
export const bankSources: BankSource[] = [
  {
    id: 'montepio',
    nome: 'Montepio',
    domain: 'bancomontepio.pt',
    // Simulator is inside iframe at montepiocredito.pt — scrape iframe URL directly
    urls: {
      novo: 'https://www.montepiocredito.pt/bm/simulador-embed',
      usado: 'https://www.montepiocredito.pt/bm/simulador-embed',
      eletrico: 'https://www.montepiocredito.pt/bm/simulador-embed',
    },
    interactions: {
      // Default view is "Crédito Pessoal", need to click tabs
      novo: [
        { click: 'text="Crédito auto"', delay: 2000 },
      ],
      usado: [
        { click: 'text="Crédito auto"', delay: 2000 },
      ],
      eletrico: [
        { click: 'text="Crédito auto elétrico"', delay: 2000 },
      ],
    },
    patterns: {
      // Simulator shows "TAN" <span>7,000%</span> and "TAEG" <span>10,5%</span>
      tan: /TAN\s*(?:<[^>]*>\s*)*(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s*(?:<[^>]*>\s*)*(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    staticFields: {
      comissaoAbertura: 'Seguro vida incluído',
      minMontante: 5000, maxMontante: 75000, minPrazo: 48, maxPrazo: 120,
    },
  },
  {
    id: 'cgd',
    nome: 'CGD',
    domain: 'cgd.pt',
    urls: {
      novo: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx',
      usado: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx',
      eletrico: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Com reserva propriedade' },
  },
  {
    id: 'cgd-auto-expresso',
    nome: 'CGD Auto Expresso',
    domain: 'cgd.pt',
    urls: {
      novo: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx',
      usado: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Sem reserva propriedade' },
  },
  {
    id: 'bpi',
    nome: 'BPI',
    domain: 'bancobpi.pt',
    urls: {
      novo: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
      usado: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
      eletrico: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
    },
    patterns: {
      // Page only shows "TAEG desde 7,2%" in span, no TAN published
      tan: /TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s+desde\s+(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    staticFields: {
      tan: 6.0, // Known from public pricing tables
      minMontante: 2500, maxMontante: 30000, minPrazo: 24, maxPrazo: 120,
    },
  },
  {
    id: 'credibom',
    nome: 'Credibom',
    domain: 'credibom.pt',
    urls: {
      novo: 'https://www.credibom.pt/credito/automovel',
      usado: 'https://www.credibom.pt/credito/automovel',
      eletrico: 'https://www.credibom.pt/credito/automovel',
    },
    patterns: {
      tan: /TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    // Cloudflare anti-bot; full static fallback
    staticFields: {
      tan: 6.25, taeg: 7.98,
      minMontante: 7500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120,
    },
  },
  {
    id: '321credito',
    nome: '321 Crédito',
    domain: '321credito.pt',
    urls: {
      novo: 'https://www.321credito.pt/credito-automovel',
      usado: 'https://www.321credito.pt/credito-automovel',
      eletrico: 'https://www.321credito.pt/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Comissão única' },
  },
  {
    id: 'cetelem',
    nome: 'Cetelem',
    domain: 'cetelem.pt',
    urls: {
      novo: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos',
      usado: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos',
      eletrico: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Sem comissão' },
  },
  {
    id: 'banco-ctt',
    nome: 'Banco CTT',
    domain: 'bancoctt.pt',
    urls: {
      novo: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel',
      usado: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel',
      eletrico: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Sem comissão' },
  },
  {
    id: 'millennium',
    nome: 'Millennium BCP',
    domain: 'millenniumbcp.pt',
    urls: {
      novo: 'https://www.millenniumbcp.pt/en/loans/car-loan',
      usado: 'https://www.millenniumbcp.pt/en/loans/car-loan',
      eletrico: 'https://www.millenniumbcp.pt/en/loans/car-loan',
    },
    patterns: {
      // English page: shows "TAEG 9.2%" in <strong>, no TAN published
      tan: /TAN\s+(?:from\s+|de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s+(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    staticFields: {
      tan: 7.5, // Known from public pricing
      minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120,
    },
  },
  {
    id: 'santander',
    nome: 'Santander',
    domain: 'santander.pt',
    urls: {
      novo: 'https://www.santander.pt/credito-automovel',
      usado: 'https://www.santander.pt/credito-automovel',
      eletrico: 'https://www.santander.pt/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
  },
  {
    id: 'ca-autobank',
    nome: 'CA Auto Bank',
    domain: 'ca-autobank.pt',
    urls: {
      novo: 'https://www.ca-autobank.pt/financiamento-veiculos/automoveis/',
      eletrico: 'https://www.ca-autobank.pt/financiamento-veiculos/automoveis/',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
  },
  {
    id: 'novobanco',
    nome: 'Novo Banco',
    domain: 'novobanco.pt',
    urls: {
      novo: 'https://www.novobanco.pt/particulares/credito/credito-automovel',
      usado: 'https://www.novobanco.pt/particulares/credito/credito-automovel',
      eletrico: 'https://www.novobanco.pt/particulares/credito/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
  },
  {
    id: 'activobank',
    nome: 'ActivoBank',
    domain: 'activobank.pt',
    urls: {
      novo: 'https://www.activobank.pt/credito-automovel',
      usado: 'https://www.activobank.pt/credito-automovel',
      eletrico: 'https://www.activobank.pt/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: '2.5% (máx. 500€)' },
  },
  {
    id: 'bbva',
    nome: 'BBVA',
    domain: 'bbva.pt',
    urls: {
      novo: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html',
      usado: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html',
      eletrico: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html',
    },
    patterns: {
      tan: /TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    // Site frequently returns error page; full static fallback
    staticFields: {
      tan: 8.10, taeg: 9.60, comissaoAbertura: '300€',
      minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120,
    },
  },
  {
    id: 'cofidis',
    nome: 'Cofidis',
    domain: 'cofidis.pt',
    urls: {
      novo: 'https://www.cofidis.pt/produtos/credito-automovel',
      usado: 'https://www.cofidis.pt/produtos/credito-automovel',
      eletrico: 'https://www.cofidis.pt/produtos/credito-automovel',
    },
    patterns: {
      // "TAEG desde 10,5% | TAN desde 7,95%"
      tan: /TAN\s+desde\s+(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG\s+desde\s+(\d{1,2}[,.]\d{1,2})\s*%/i,
      // JSON-LD: "minValue": 5000, "maxValue": 50000
      minMontante: /"minValue":\s*(\d+)/,
      maxMontante: /"maxValue":\s*(\d+)/,
      // JSON-LD: "loanTerm": "24-96 months"
      minPrazo: /"loanTerm":\s*"(\d+)-/,
      maxPrazo: /"loanTerm":\s*"\d+-(\d+)/,
    },
    staticFields: { comissaoAbertura: 'Sem comissão' },
  },
  {
    id: 'credito-agricola',
    nome: 'Crédito Agrícola',
    domain: 'creditoagricola.pt',
    urls: {
      novo: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel',
      usado: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel',
    },
    patterns: {
      // "TAN fixa de 8,050%" in example text
      tan: /TAN\s+fixa\s+de\s+(\d{1,2}[,.]\d{1,3})\s*%/i,
      // "TAEG de 9,7%"
      taeg: /TAEG\s+de\s+(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    staticFields: {
      minMontante: 3000, maxMontante: 75000, minPrazo: 36, maxPrazo: 96,
    },
  },
  {
    id: 'bankinter',
    nome: 'Bankinter',
    domain: 'bankinter.pt',
    urls: {
      novo: 'https://www.bankinter.pt/credito-pessoal/credito-automovel',
      usado: 'https://www.bankinter.pt/credito-pessoal/credito-automovel',
    },
    patterns: {
      tan: /TAN\s+(?:fixa\s+)?(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /TAEG\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    // Cloudflare anti-bot; full static fallback
    staticFields: {
      tan: 8.30, taeg: 10.80, comissaoAbertura: '3%',
      minMontante: 6000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120,
    },
  },
  {
    id: 'younited',
    nome: 'Younited Credit',
    domain: 'younited-credit.com',
    urls: {
      novo: 'https://pt.younited-credit.com/projetos/credito-automovel',
      usado: 'https://pt.younited-credit.com/projetos/credito-automovel',
      eletrico: 'https://pt.younited-credit.com/projetos/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Sem comissão' },
  },
  {
    id: 'abanca',
    nome: 'Abanca',
    domain: 'abanca.pt',
    urls: {
      novo: 'https://www.abanca.pt/pt/credito/credito-auto/',
      usado: 'https://www.abanca.pt/pt/credito/credito-auto/',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
  },
  {
    id: 'banco-primus',
    nome: 'Banco Primus',
    domain: 'bancoprimus.pt',
    urls: {
      novo: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/',
      usado: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/',
      eletrico: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Via concessionário' },
  },
];
