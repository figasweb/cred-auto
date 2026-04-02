/**
 * Bank scraping source definitions.
 *
 * Each bank's regex was verified against actual HTML (html-dump/).
 * Regex strategy: use unique selectors (IDs, classes, specific text) to avoid
 * matching wrong values (e.g. "importante" containing "tan").
 */

export interface PageInteraction {
  click?: string;
  waitFor?: string;
  delay?: number;
}

export interface FieldPatterns {
  tan: RegExp;
  taeg: RegExp;
  minMontante?: RegExp;
  maxMontante?: RegExp;
  minPrazo?: RegExp;
  maxPrazo?: RegExp;
}

export interface BankSource {
  id: string;
  nome: string;
  domain: string;
  urls: Partial<Record<'novo' | 'usado' | 'eletrico', string>>;
  interactions?: Partial<Record<'novo' | 'usado' | 'eletrico', PageInteraction[]>>;
  patterns: FieldPatterns;
  patternsPerType?: Partial<Record<'novo' | 'usado' | 'eletrico', Partial<FieldPatterns>>>;
  staticFields?: Partial<Record<string, unknown>>;
  staticFieldsPerType?: Partial<Record<'novo' | 'usado' | 'eletrico', Partial<Record<string, unknown>>>>;
  /** Use real Chrome via CDP instead of headless Chromium (for anti-bot sites). Requires --use-chrome flag. */
  requiresChrome?: boolean;
}

export const validationRules = {
  tan: { type: 'number' as const, min: 0, max: 30, required: true },
  taeg: { type: 'number' as const, min: 0, max: 30, required: true },
  minMontante: { type: 'number' as const, min: 500, max: 100000 },
  maxMontante: { type: 'number' as const, min: 1000, max: 200000 },
  minPrazo: { type: 'number' as const, min: 6, max: 120 },
  maxPrazo: { type: 'number' as const, min: 12, max: 240 },
};

export const bankSources: BankSource[] = [
  // ─── Montepio ───
  // Iframe simulator. Hidden inputs: id="tanValue" value="10", id="taegValue" value="15.514"
  // Rates differ per tab: auto (novo/usado same tab), auto elétrico
  {
    id: 'montepio',
    nome: 'Montepio',
    domain: 'bancomontepio.pt',
    urls: {
      novo: 'https://www.montepiocredito.pt/bm/simulador-embed',
      usado: 'https://www.montepiocredito.pt/bm/simulador-embed',
      eletrico: 'https://www.montepiocredito.pt/bm/simulador-embed',
    },
    interactions: {
      novo: [{ click: 'text="Crédito auto"', delay: 2000 }],
      usado: [{ click: 'text="Crédito auto"', delay: 2000 }],
      eletrico: [{ click: 'text="Crédito auto elétrico"', delay: 2000 }],
    },
    patterns: {
      tan: /id="tanValue"[^>]*value="([0-9.]+)"/,
      // Use display text instead of hidden input (hidden has too much precision: 10.4505)
      taeg: /id="taegText">(\d{1,2}[,.]\d{1,2})%/,
    },
    staticFields: {
      comissaoAbertura: 'Seguro vida incluído',
      minMontante: 5000, maxMontante: 75000, minPrazo: 48, maxPrazo: 120,
    },
  },

  // ─── CGD (Reserva Propriedade) ───
  // Same TAN (6,550%), different TAEG: novo 7,9% / usado 8,1%
  // Legal text: "Viaturas novas: TAEG de 7,9% | com base numa TAN de 6,550%"
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
      tan: /\bTAN de (\d{1,2}[,.]\d{1,3})\s*%/,
      taeg: /Viaturas novas.*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/s,
    },
    patternsPerType: {
      usado: { taeg: /Viaturas usadas.*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/s },
    },
    staticFields: {
      comissaoAbertura: 'Com reserva propriedade',
      minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 60,
    },
  },

  // ─── CGD Auto Expresso ───
  // Novo: TAN 7,500% TAEG 9,8% | Usado: TAN 9,000% TAEG 11,5%
  {
    id: 'cgd-auto-expresso',
    nome: 'CGD Auto Expresso',
    domain: 'cgd.pt',
    urls: {
      novo: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx',
      usado: 'https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx',
    },
    patterns: {
      tan: /Novo.*?TAN de (\d{1,2}[,.]\d{1,3})\s*%/s,
      taeg: /Novo.*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/s,
    },
    patternsPerType: {
      usado: {
        tan: /Usados.*?TAN de (\d{1,2}[,.]\d{1,3})\s*%/s,
        taeg: /Usados.*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/s,
      },
    },
    staticFields: {
      comissaoAbertura: 'Sem reserva propriedade',
      minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 108,
    },
  },

  // BPI excluído — site não publica TAN, só TAEG, e não tem simulador de crédito auto

  // ─── Credibom ───
  // Cloudflare blocks headless. Requires --use-chrome (real Chrome via CDP).
  {
    id: 'credibom',
    nome: 'Credibom',
    domain: 'credibom.pt',
    requiresChrome: true,
    urls: { novo: 'https://www.credibom.pt/credito/automovel', usado: 'https://www.credibom.pt/credito/automovel', eletrico: 'https://www.credibom.pt/credito/automovel' },
    patterns: {
      tan: /\bTAN\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,3})\s*%/,
      taeg: /\bTAEG\s+(?:de(?:sde)?\s+)?(\d{1,2}[,.]\d{1,2})\s*%/,
    },
    staticFields: { minMontante: 7500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── 321 Crédito ───
  // Same page. Novo: "TAN 6,65% e TAEG 8,50%", Usado: "TAN 7,95 e TAEG 10,20%"
  {
    id: '321credito',
    nome: '321 Crédito',
    domain: '321credito.pt',
    urls: { novo: 'https://www.321credito.pt/credito-automovel', usado: 'https://www.321credito.pt/credito-automovel', eletrico: 'https://www.321credito.pt/credito-automovel' },
    patterns: {
      tan: /TAN (\d{1,2}[,.]\d{1,2})%?\s+e\s+TAEG/,
      taeg: /TAN \d{1,2}[,.]\d{1,2}%?\s+e\s+TAEG (\d{1,2}[,.]\d{1,2})%/,
    },
    patternsPerType: {
      usado: {
        tan: /TAN (7[,.]\d{1,2})\s+e\s+TAEG 10/,
        taeg: /TAN 7[,.]\d{1,2}\s+e\s+TAEG (\d{1,2}[,.]\d{1,2})%/,
      },
    },
    staticFields: { comissaoAbertura: 'Comissão única', minMontante: 1000, maxMontante: 75000, minPrazo: 12, maxPrazo: 96 },
  },

  // ─── Cetelem ───
  // Simulator: <span class="tanValue">9,50%</span>, <span class="taegValue">14,1%</span>
  {
    id: 'cetelem',
    nome: 'Cetelem',
    domain: 'cetelem.pt',
    urls: { novo: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos', usado: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos', eletrico: 'https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos' },
    patterns: {
      tan: /class="tanValue">(\d{1,2}[,.]\d{1,2})%/,
      taeg: /class="taegValue">(\d{1,2}[,.]\d{1,2})%/,
    },
    staticFields: { comissaoAbertura: 'Sem comissão', minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── Banco CTT ───
  // Same page. "TAN desde 7,25%" (novo) and "TAN desde 9,60%" (usado)
  {
    id: 'banco-ctt',
    nome: 'Banco CTT',
    domain: 'bancoctt.pt',
    urls: { novo: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel', usado: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel', eletrico: 'https://www.bancoctt.pt/o-seu-credito/credito-automovel' },
    patterns: {
      // First "TAN desde" = novo
      tan: /TAN desde (\d{1,2}[,.]\d{1,2})\s*%/,
      taeg: /TAEG desde (\d{1,2}[,.]\d{1,2})\s*%/,
    },
    patternsPerType: {
      usado: {
        // Usado section: "TAN desde 9,60%" / "TAEG desde 11,6%"
        tan: /TAN desde (9[,.]\d{1,2})\s*%/,
        taeg: /TAEG desde (11[,.]\d{1,2})\s*%/,
      },
    },
    staticFields: { comissaoAbertura: 'Sem comissão', minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120 },
  },

  // ─── Millennium BCP ───
  // Simulator pages: "9.2% TAEG and 8.000% TAN" (EN, dot decimal)
  {
    id: 'millennium',
    nome: 'Millennium BCP',
    domain: 'millenniumbcp.pt',
    urls: {
      novo: 'https://www.millenniumbcp.pt/en/loans/car-loan/new/calculator#/cl-public-simulator/simulator',
      usado: 'https://www.millenniumbcp.pt/en/loans/car-loan/used-online/calculator#/cl-public-simulator/simulator',
      eletrico: 'https://www.millenniumbcp.pt/en/loans/car-loan/new/calculator#/cl-public-simulator/simulator',
    },
    patterns: {
      // "9.2% TAEG and 8.000% TAN" — EN page, dot decimal
      // Extract TAN: match "X.XXX%" before " TAN"
      tan: /(\d{1,2}\.\d{3})%\s*TAN/,
      // Extract TAEG: match "X.X%" before " TAEG"
      taeg: /(\d{1,2}\.\d)%\s*TAEG/,
    },
    staticFields: { minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── Santander ───
  // Simulator: <span id="tan">7,50</span>, <span id="taeg">10,9</span>
  {
    id: 'santander',
    nome: 'Santander',
    domain: 'santander.pt',
    urls: { novo: 'https://www.santander.pt/credito-automovel', usado: 'https://www.santander.pt/credito-automovel', eletrico: 'https://www.santander.pt/credito-automovel' },
    patterns: {
      tan: /id="tan"[^>]*>(\d{1,2}[,.]\d{1,2})/,
      taeg: /id="taeg"[^>]*>(\d{1,2}[,.]\d{1,2})/,
    },
    staticFields: { minMontante: 1500, maxMontante: 75000, minPrazo: 24, maxPrazo: 96 },
  },

  // ─── CA Auto Bank ───
  // Legal example: "TAEG 8,7%. ... TAN 7,5%." Same for novo/usado.
  {
    id: 'ca-autobank',
    nome: 'CA Auto Bank',
    domain: 'ca-autobank.pt',
    urls: { novo: 'https://www.ca-autobank.pt/financiamento-veiculos/automoveis/', eletrico: 'https://www.ca-autobank.pt/financiamento-veiculos/automoveis/' },
    patterns: {
      tan: /\bTAN (\d{1,2}[,.]\d{1,2})\s*%/,
      taeg: /\bTAEG (\d{1,2}[,.]\d{1,2})\s*%/,
    },
    staticFields: { minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── Novo Banco ───
  // Legal text: Novo "TAN fixa de 7,250% ... TAEG de 9,3%", Usado "TAN fixa de 8,700% ... TAEG de 10,9%"
  // Verde example: "TAN: 7,400% ... TAEG: 9,4%"
  {
    id: 'novobanco',
    nome: 'Novo Banco',
    domain: 'novobanco.pt',
    urls: { novo: 'https://www.novobanco.pt/particulares/credito/credito-automovel', usado: 'https://www.novobanco.pt/particulares/credito/credito-automovel', eletrico: 'https://www.novobanco.pt/particulares/credito/credito-automovel' },
    patterns: {
      // Default (novo): first "TAN fixa de" match
      tan: /\bTAN fixa de (\d{1,2}[,.]\d{1,3})\s*%/,
      taeg: /\bTAEG de (\d{1,2}[,.]\d{1,2})\s*%/,
    },
    patternsPerType: {
      usado: {
        // "TAN fixa de 8,700%" — match the higher TAN directly
        tan: /\bTAN fixa de (8[,.]\d{1,3})\s*%/,
        taeg: /\bTAEG de (10[,.]\d{1,2})\s*%/,
      },
      eletrico: {
        // Verde example: "TAN: 7,400%" and "TAEG: 9,4%"
        tan: /\bTAN:\s*(\d{1,2}[,.]\d{1,3})\s*%/,
        taeg: /\bTAEG:\s*(\d{1,2}[,.]\d{1,2})\s*%/,
      },
    },
    staticFields: { minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── ActivoBank ───
  // "TAEG 9,8% | TAN 7,700%" (promo), electric: "TAEG 8,5% | TAN 6,500%"
  {
    id: 'activobank',
    nome: 'ActivoBank',
    domain: 'activobank.pt',
    urls: { novo: 'https://www.activobank.pt/credito-automovel', usado: 'https://www.activobank.pt/credito-automovel', eletrico: 'https://www.activobank.pt/credito-automovel' },
    patterns: {
      // Promo rate: "TAEG 9,8% | TAN 7,700%" (2nd occurrence on page)
      tan: /TAEG 9[,.]\d% \| TAN (\d{1,2}[,.]\d{1,3})%/,
      taeg: /TAEG (9[,.]\d)% \| TAN 7[,.]\d{1,3}%/,
    },
    staticFieldsPerType: {
      eletrico: { tan: 6.5, taeg: 8.5 },
    },
    staticFields: { comissaoAbertura: '2.5% (max. 500€)', minMontante: 1500, maxMontante: 75000, minPrazo: 18, maxPrazo: 84 },
  },

  // ─── BBVA ───
  // Anti-bot blocks headless. Requires --use-chrome.
  // HTML: "<b>TAN </b>de <b>8,100%</b>" — tags between TAN and value
  {
    id: 'bbva',
    nome: 'BBVA',
    domain: 'bbva.pt',
    requiresChrome: true,
    urls: { novo: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html', usado: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html', eletrico: 'https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html' },
    patterns: {
      // "<b>TAN </b>de <b>8,100%</b>" — strip tags with [\s\S]*?
      tan: /TAN\s*<\/b>\s*de\s*<b>\s*(\d{1,2}[,.]\d{1,3})%/,
      taeg: /TAEG\s*<\/b>\s*de\s*<b>\s*(\d{1,2}[,.]\d{1,2})%/,
    },
    staticFields: { comissaoAbertura: '300€', minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120 },
  },

  // ─── Cofidis ───
  // Novo: "TAEG de 10,5% | TAN desde 7,95%", Usado: "TAEG desde 10,2% | TAN desde 8,00%"
  // JSON-LD has montante/prazo
  {
    id: 'cofidis',
    nome: 'Cofidis',
    domain: 'cofidis.pt',
    urls: { novo: 'https://www.cofidis.pt/produtos/credito-automovel', usado: 'https://www.cofidis.pt/produtos/credito-automovel', eletrico: 'https://www.cofidis.pt/produtos/credito-automovel' },
    patterns: {
      // Novo headline: "TAEG de 10,5% | TAN desde 7,95%"
      tan: /TAN desde (\d{1,2}[,.]\d{1,2})\s*%/,
      taeg: /TAEG de (\d{1,2}[,.]\d{1,2})\s*%/,
      minMontante: /"minValue":\s*(\d+)/,
      maxMontante: /"maxValue":\s*(\d+)/,
      minPrazo: /"loanTerm":\s*"(\d+)-/,
      maxPrazo: /"loanTerm":\s*"\d+-(\d+)/,
    },
    patternsPerType: {
      usado: {
        // "TAEG desde 10,2% | TAN desde 8,00%" — exact match for usado
        tan: /TAEG desde 10,2% \| TAN desde (\d{1,2}[,.]\d{1,2})/,
        taeg: /TAEG desde (10,2)% \| TAN desde 8/,
      },
    },
    staticFields: { comissaoAbertura: 'Sem comissão' },
  },

  // ─── Crédito Agrícola ───
  // Novo (taxa fixa): TAN 8,050% TAEG 9,7% | Usado: TAN 10,350% TAEG 13,6%
  // Values inside "Exemplos Representativos" accordion — need to expand it
  {
    id: 'credito-agricola',
    nome: 'Crédito Agrícola',
    domain: 'creditoagricola.pt',
    urls: { novo: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel', usado: 'https://www.creditoagricola.pt/para-mim/financiar/credito-automovel' },
    interactions: {
      novo: [{ click: 'text="Exemplos Representativos"', delay: 1000 }],
      usado: [{ click: 'text="Exemplos Representativos"', delay: 1000 }],
    },
    patterns: {
      // First "TAN fixa de" = novo example
      tan: /novos[\s\S]*?TAN fixa de (\d{1,2}[,.]\d{1,3})\s*%/i,
      taeg: /novos[\s\S]*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/i,
    },
    patternsPerType: {
      usado: {
        // "TAN fixa de 10,350%" — match the higher TAN directly
        tan: /\bTAN fixa de (10[,.]\d{1,3})\s*%/,
        taeg: /\bTAEG de (13[,.]\d{1,2})\s*%/,
      },
    },
    staticFields: { minMontante: 3000, maxMontante: 75000, minPrazo: 36, maxPrazo: 96 },
    staticFieldsPerType: { usado: { maxMontante: 50000, maxPrazo: 60 } },
  },


  // ─── Bankinter ───
  // Cloudflare blocks headless. Requires --use-chrome.
  // HTML: "TAN <br> </p><p ...><b>8,80<sup>%</sup></b>" — tags + sup for %
  {
    id: 'bankinter',
    nome: 'Bankinter',
    domain: 'bankinter.pt',
    requiresChrome: true,
    urls: { novo: 'https://www.bankinter.pt/credito-pessoal/credito-automovel', usado: 'https://www.bankinter.pt/credito-pessoal/credito-automovel' },
    patterns: {
      // "TAN <br> </p><p><b>8,80<sup>%</sup></b>"
      tan: /TAN\s*<br>\s*<\/p><p[^>]*><b>(\d{1,2}[,.]\d{1,2})<sup>/,
      // "TAEG* <br> </p><p><b>10,8<sup>%</sup></b>"
      taeg: /TAEG\*\s*<br>\s*<\/p><p[^>]*>\s*<b>(\d{1,2}[,.]\d{1,2})<sup>/,
    },
    staticFields: { comissaoAbertura: '3%', minMontante: 6000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120 },
  },

  // ─── Younited Credit ───
  // Site only shows ranges. Real rates come from FIN PDF API:
  // https://acquisition-public.services.younited-credit.com/api/documents/pt/YOUNITED/YounitedConsumerCredit/secci/from-request-average-price-offer?businessProvider=YUC&projectTypeCode=USEDCAR&requestedAmount=15000&requestedMaturityInMonths=60
  // For 15000€/60m: TAN 4.900%, TAEG 5.99% (average offer, used car)
  // Only offers "Automóvel Usado" — no novo or elétrico distinction
  {
    id: 'younited',
    nome: 'Younited Credit',
    domain: 'younited-credit.com',
    urls: { usado: 'https://pt.younited-credit.com/projetos/credito-automovel' },
    patterns: {
      // Site only shows ranges — use dummy regex so static fields take priority
      tan: /YOUNITED_FIN_TAN_(\d+)/,
      taeg: /YOUNITED_FIN_TAEG_(\d+)/,
    },
    // Values from FIN PDF API (average price offer, USEDCAR, 15000€, 60 months)
    staticFields: {
      tan: 4.9, taeg: 5.99,
      comissaoAbertura: 'Sem comissão', minMontante: 1000, maxMontante: 50000, minPrazo: 24, maxPrazo: 84,
    },
  },

  // ─── Abanca ───
  // Taxa mista: Novo TAN 8,650% TAEG 9,8% | Usado TAN 11,450% TAEG 12,9%
  {
    id: 'abanca',
    nome: 'Abanca',
    domain: 'abanca.pt',
    urls: { novo: 'https://www.abanca.pt/pt/credito/credito-auto/', usado: 'https://www.abanca.pt/pt/credito/credito-auto/' },
    patterns: {
      // Taxa mista Novos: "TAEG de 9,8% ... TAN fixa de 8,650%"
      tan: /Auto Novos[\s\S]*?TAN fixa de (\d{1,2}[,.]\d{1,3})\s*%/,
      taeg: /Auto Novos[\s\S]*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/,
    },
    patternsPerType: {
      usado: {
        tan: /Auto Usados[\s\S]*?TAN fixa de (\d{1,2}[,.]\d{1,3})\s*%/,
        taeg: /Auto Usados[\s\S]*?TAEG de (\d{1,2}[,.]\d{1,2})\s*%/,
      },
    },
    staticFields: { minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120 },
  },

  // ─── Banco Primus ───
  // Only usado example on page: "TAN de 11,40% ... TAEG de 14,2%"
  {
    id: 'banco-primus',
    nome: 'Banco Primus',
    domain: 'bancoprimus.pt',
    urls: { novo: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/', usado: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/', eletrico: 'https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/' },
    patterns: {
      tan: /Taxa Anual Nominal \(TAN\) de (\d{1,2}[,.]\d{1,3})\s*%/,
      taeg: /Taxa Anual Efetiva de Encargos Global \(TAEG\) de (\d{1,2}[,.]\d{1,2})\s*%/,
    },
    staticFields: { comissaoAbertura: 'Via concessionário', minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120 },
  },
];
