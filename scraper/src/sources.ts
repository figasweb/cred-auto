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

export interface BankSource {
  id: string;
  nome: string;
  domain: string;
  /** URLs per vehicle type. If a type is missing, that bank doesn't offer it. */
  urls: Partial<Record<'novo' | 'usado' | 'eletrico', string>>;
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
    urls: {
      novo: 'https://www.bancomontepio.pt/particulares/credito/credito-automovel',
      usado: 'https://www.bancomontepio.pt/particulares/credito/credito-automovel',
      eletrico: 'https://www.bancomontepio.pt/particulares/credito/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: 'Seguro vida incluído' },
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
    id: 'bpi',
    nome: 'BPI',
    domain: 'bancobpi.pt',
    urls: {
      novo: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
      usado: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
      eletrico: 'https://www.bancobpi.pt/particulares/credito/credito-automovel',
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
    id: 'credibom',
    nome: 'Credibom',
    domain: 'credibom.pt',
    urls: {
      novo: 'https://www.credibom.pt/credito/automovel',
      usado: 'https://www.credibom.pt/credito/automovel',
      eletrico: 'https://www.credibom.pt/credito/automovel',
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
      novo: 'https://www.millenniumbcp.pt/particulares/credito/credito-automovel',
      usado: 'https://www.millenniumbcp.pt/particulares/credito/credito-automovel',
      eletrico: 'https://www.millenniumbcp.pt/particulares/credito/credito-automovel',
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
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: '300€' },
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
    id: 'credito-agricola',
    nome: 'Crédito Agrícola',
    domain: 'creditoagricola.pt',
    urls: {
      novo: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel',
      usado: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel',
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
    id: 'bankinter',
    nome: 'Bankinter',
    domain: 'bankinter.pt',
    urls: {
      novo: 'https://www.bankinter.pt/credito-pessoal/credito-automovel',
      usado: 'https://www.bankinter.pt/credito-pessoal/credito-automovel',
    },
    patterns: {
      tan: /TAN[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      taeg: /TAEG[^0-9]*(\d{1,2}[,.]\d{1,2})\s*%/i,
      minMontante: /(?:montante|valor)\s*m[ií]nimo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      maxMontante: /(?:montante|valor)\s*m[áa]ximo[^0-9]*(?:€\s*)?(\d[\d.]*)/i,
      minPrazo: /prazo\s*m[ií]nimo[^0-9]*(\d+)/i,
      maxPrazo: /prazo\s*m[áa]ximo[^0-9]*(\d+)/i,
    },
    staticFields: { comissaoAbertura: '3%' },
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
