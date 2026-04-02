/**
 * Seed script — populates Cloudflare KV with the current bank data.
 *
 * Usage:
 *   npx wrangler kv key put --namespace-id YOUR_ID "instituicoes" "$(cat data.json)"
 *
 * Or run: npx tsx src/seed.ts > data.json
 * Then:   npx wrangler kv key put --namespace-id YOUR_ID "instituicoes" --path data.json
 */

function logoUrl(domain: string): string {
  return `https://www.google.com/s2/favicons?domain=${domain}&sz=64`;
}

const data = {
  novo: [
    { id: "montepio", nome: "Montepio", tan: 5.00, taeg: 6.70, minMontante: 5000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120, url: "https://www.bancomontepio.pt/particulares/credito/credito-automovel", logo: logoUrl("bancomontepio.pt"), comissaoAbertura: "Seguro vida incluído" },
    { id: "cgd", nome: "CGD", tan: 4.39, taeg: 7.60, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 60, url: "https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx", logo: logoUrl("cgd.pt"), comissaoAbertura: "Com reserva propriedade" },
    { id: "cgd-expresso", nome: "CGD Auto Expresso", tan: 7.50, taeg: 9.50, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 108, url: "https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx", logo: logoUrl("cgd.pt"), comissaoAbertura: "Sem reserva propriedade" },
    { id: "bpi", nome: "BPI", tan: 6.00, taeg: 7.20, minMontante: 2500, maxMontante: 30000, minPrazo: 24, maxPrazo: 120, url: "https://www.bancobpi.pt/particulares/credito/credito-automovel", logo: logoUrl("bancobpi.pt") },
    { id: "credibom", nome: "Credibom", tan: 6.25, taeg: 7.98, minMontante: 7500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.credibom.pt/credito/automovel", logo: logoUrl("credibom.pt") },
    { id: "321credito", nome: "321 Crédito", tan: 6.65, taeg: 8.50, minMontante: 1000, maxMontante: 75000, minPrazo: 12, maxPrazo: 96, url: "https://www.321credito.pt/credito-automovel", logo: logoUrl("321credito.pt"), comissaoAbertura: "Comissão única" },
    { id: "cetelem", nome: "Cetelem", tan: 7.25, taeg: 9.10, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos", logo: logoUrl("cetelem.pt"), comissaoAbertura: "Sem comissão" },
    { id: "banco-ctt", nome: "Banco CTT", tan: 7.25, taeg: 9.10, minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.bancoctt.pt/o-seu-credito/credito-automovel", logo: logoUrl("bancoctt.pt"), comissaoAbertura: "Sem comissão" },
    { id: "millennium", nome: "Millennium BCP", tan: 7.50, taeg: 8.70, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.millenniumbcp.pt/particulares/credito/credito-automovel", logo: logoUrl("millenniumbcp.pt") },
    { id: "santander", nome: "Santander", tan: 5.50, taeg: 9.10, minMontante: 1500, maxMontante: 75000, minPrazo: 24, maxPrazo: 96, url: "https://www.santander.pt/credito-automovel", logo: logoUrl("santander.pt") },
    { id: "ca-autobank", nome: "CA Auto Bank", tan: 7.50, taeg: 8.70, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.ca-autobank.pt/financiamento-veiculos/automoveis/", logo: logoUrl("ca-autobank.pt") },
    { id: "novobanco", nome: "Novo Banco", tan: 5.75, taeg: 8.30, minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.novobanco.pt/particulares/credito/credito-automovel", logo: logoUrl("novobanco.pt") },
    { id: "activobank", nome: "ActivoBank", tan: 7.70, taeg: 9.80, minMontante: 1500, maxMontante: 75000, minPrazo: 18, maxPrazo: 84, url: "https://www.activobank.pt/credito-automovel", logo: logoUrl("activobank.pt"), comissaoAbertura: "2.5% (máx. 500€)" },
    { id: "bbva", nome: "BBVA", tan: 8.10, taeg: 9.60, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html", logo: logoUrl("bbva.pt"), comissaoAbertura: "300€" },
    { id: "cofidis", nome: "Cofidis", tan: 7.95, taeg: 10.50, minMontante: 1500, maxMontante: 50000, minPrazo: 24, maxPrazo: 96, url: "https://www.cofidis.pt/produtos/credito-automovel", logo: logoUrl("cofidis.pt"), comissaoAbertura: "Sem comissão" },
    { id: "credito-agricola", nome: "Crédito Agrícola", tan: 8.05, taeg: 9.70, minMontante: 3000, maxMontante: 75000, minPrazo: 36, maxPrazo: 96, url: "https://www.creditoagricola.pt/para-mim/financiar/credito-automovel", logo: logoUrl("creditoagricola.pt") },
    { id: "bankinter", nome: "Bankinter", tan: 8.30, taeg: 10.80, minMontante: 6000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120, url: "https://www.bankinter.pt/credito-pessoal/credito-automovel", logo: logoUrl("bankinter.pt"), comissaoAbertura: "3%" },
    { id: "younited", nome: "Younited Credit", tan: 6.44, taeg: 8.80, minMontante: 1000, maxMontante: 50000, minPrazo: 24, maxPrazo: 96, url: "https://pt.younited-credit.com/projetos/credito-automovel", logo: logoUrl("younited-credit.com"), comissaoAbertura: "Sem comissão" },
    { id: "abanca", nome: "Abanca", tan: 8.65, taeg: 9.80, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.abanca.pt/pt/credito/credito-auto/", logo: logoUrl("abanca.pt") },
    { id: "banco-primus", nome: "Banco Primus", tan: 11.40, taeg: 14.20, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/", logo: logoUrl("bancoprimus.pt"), comissaoAbertura: "Via concessionário" },
  ],
  usado: [
    { id: "montepio", nome: "Montepio", tan: 5.50, taeg: 6.70, minMontante: 5000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120, url: "https://www.bancomontepio.pt/particulares/credito/credito-automovel", logo: logoUrl("bancomontepio.pt"), comissaoAbertura: "Seguro vida incluído" },
    { id: "cgd", nome: "CGD", tan: 4.64, taeg: 7.60, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 60, url: "https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx", logo: logoUrl("cgd.pt"), comissaoAbertura: "Com reserva propriedade" },
    { id: "cgd-expresso", nome: "CGD Auto Expresso", tan: 9.00, taeg: 11.40, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 108, url: "https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Auto-Expresso.aspx", logo: logoUrl("cgd.pt"), comissaoAbertura: "Sem reserva propriedade" },
    { id: "santander", nome: "Santander", tan: 7.50, taeg: 11.50, minMontante: 1500, maxMontante: 75000, minPrazo: 24, maxPrazo: 96, url: "https://www.santander.pt/credito-automovel", logo: logoUrl("santander.pt") },
    { id: "bpi", nome: "BPI", tan: 7.00, taeg: 8.40, minMontante: 2500, maxMontante: 30000, minPrazo: 24, maxPrazo: 120, url: "https://www.bancobpi.pt/particulares/credito/credito-automovel", logo: logoUrl("bancobpi.pt") },
    { id: "321credito", nome: "321 Crédito", tan: 7.95, taeg: 10.20, minMontante: 1000, maxMontante: 75000, minPrazo: 12, maxPrazo: 96, url: "https://www.321credito.pt/credito-automovel", logo: logoUrl("321credito.pt"), comissaoAbertura: "Comissão única" },
    { id: "activobank", nome: "ActivoBank", tan: 7.70, taeg: 9.80, minMontante: 1500, maxMontante: 75000, minPrazo: 18, maxPrazo: 84, url: "https://www.activobank.pt/credito-automovel", logo: logoUrl("activobank.pt"), comissaoAbertura: "2.5% (máx. 500€)" },
    { id: "millennium", nome: "Millennium BCP", tan: 8.00, taeg: 10.20, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.millenniumbcp.pt/particulares/credito/credito-automovel", logo: logoUrl("millenniumbcp.pt") },
    { id: "cofidis", nome: "Cofidis", tan: 8.00, taeg: 10.20, minMontante: 1500, maxMontante: 50000, minPrazo: 24, maxPrazo: 120, url: "https://www.cofidis.pt/produtos/credito-automovel", logo: logoUrl("cofidis.pt"), comissaoAbertura: "Sem comissão" },
    { id: "credibom", nome: "Credibom", tan: 8.90, taeg: 10.28, minMontante: 7500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.credibom.pt/credito/automovel", logo: logoUrl("credibom.pt") },
    { id: "novobanco", nome: "Novo Banco", tan: 8.70, taeg: 10.90, minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.novobanco.pt/particulares/credito/credito-automovel", logo: logoUrl("novobanco.pt") },
    { id: "cetelem", nome: "Cetelem", tan: 9.50, taeg: 11.50, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos", logo: logoUrl("cetelem.pt"), comissaoAbertura: "Sem comissão" },
    { id: "banco-ctt", nome: "Banco CTT", tan: 9.60, taeg: 11.60, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bancoctt.pt/o-seu-credito/credito-automovel", logo: logoUrl("bancoctt.pt"), comissaoAbertura: "Sem comissão" },
    { id: "bbva", nome: "BBVA", tan: 8.10, taeg: 9.60, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html", logo: logoUrl("bbva.pt"), comissaoAbertura: "300€" },
    { id: "credito-agricola", nome: "Crédito Agrícola", tan: 10.35, taeg: 13.60, minMontante: 3000, maxMontante: 50000, minPrazo: 36, maxPrazo: 60, url: "https://www.creditoagricola.pt/para-mim/financiar/credito-automovel", logo: logoUrl("creditoagricola.pt") },
    { id: "bankinter", nome: "Bankinter", tan: 11.50, taeg: 14.00, minMontante: 6000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120, url: "https://www.bankinter.pt/credito-pessoal/credito-automovel", logo: logoUrl("bankinter.pt"), comissaoAbertura: "3%" },
    { id: "younited", nome: "Younited Credit", tan: 6.44, taeg: 8.80, minMontante: 1000, maxMontante: 50000, minPrazo: 24, maxPrazo: 96, url: "https://pt.younited-credit.com/projetos/credito-automovel", logo: logoUrl("younited-credit.com"), comissaoAbertura: "Sem comissão" },
    { id: "abanca", nome: "Abanca", tan: 11.45, taeg: 12.90, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.abanca.pt/pt/credito/credito-auto/", logo: logoUrl("abanca.pt") },
    { id: "banco-primus", nome: "Banco Primus", tan: 11.40, taeg: 14.20, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/", logo: logoUrl("bancoprimus.pt"), comissaoAbertura: "Via concessionário" },
  ],
  eletrico: [
    { id: "montepio", nome: "Montepio", tan: 5.00, taeg: 6.10, minMontante: 5000, maxMontante: 75000, minPrazo: 36, maxPrazo: 120, url: "https://www.bancomontepio.pt/particulares/credito/credito-automovel", logo: logoUrl("bancomontepio.pt"), comissaoAbertura: "Seguro vida incluído" },
    { id: "novobanco", nome: "Novo Banco", tan: 4.75, taeg: 7.30, minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.novobanco.pt/particulares/credito/credito-automovel", logo: logoUrl("novobanco.pt"), comissaoAbertura: "Bónus 1% TAN veíc. verde" },
    { id: "activobank", nome: "ActivoBank", tan: 6.50, taeg: 8.50, minMontante: 1500, maxMontante: 75000, minPrazo: 18, maxPrazo: 84, url: "https://www.activobank.pt/credito-automovel", logo: logoUrl("activobank.pt"), comissaoAbertura: "2.5% (máx. 500€)" },
    { id: "bpi", nome: "BPI", tan: 6.00, taeg: 7.20, minMontante: 2500, maxMontante: 30000, minPrazo: 24, maxPrazo: 120, url: "https://www.bancobpi.pt/particulares/credito/credito-automovel", logo: logoUrl("bancobpi.pt") },
    { id: "cgd", nome: "CGD", tan: 4.39, taeg: 7.60, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 60, url: "https://www.cgd.pt/Particulares/Credito/Automovel/Pages/Credito-Automovel-Reserva-Propriedade.aspx", logo: logoUrl("cgd.pt"), comissaoAbertura: "Com reserva propriedade" },
    { id: "321credito", nome: "321 Crédito", tan: 6.65, taeg: 8.50, minMontante: 1000, maxMontante: 75000, minPrazo: 12, maxPrazo: 96, url: "https://www.321credito.pt/credito-automovel", logo: logoUrl("321credito.pt"), comissaoAbertura: "Comissão única" },
    { id: "credibom", nome: "Credibom", tan: 6.25, taeg: 7.98, minMontante: 7500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.credibom.pt/credito/automovel", logo: logoUrl("credibom.pt") },
    { id: "cetelem", nome: "Cetelem", tan: 7.25, taeg: 8.20, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.cetelem.pt/creditos/credito-automovel-outros-veiculos", logo: logoUrl("cetelem.pt"), comissaoAbertura: "Sem comissão" },
    { id: "banco-ctt", nome: "Banco CTT", tan: 7.25, taeg: 9.10, minMontante: 5000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.bancoctt.pt/o-seu-credito/credito-automovel", logo: logoUrl("bancoctt.pt"), comissaoAbertura: "Sem comissão" },
    { id: "millennium", nome: "Millennium BCP", tan: 7.50, taeg: 8.70, minMontante: 1000, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.millenniumbcp.pt/particulares/credito/credito-automovel", logo: logoUrl("millenniumbcp.pt") },
    { id: "santander", nome: "Santander", tan: 5.50, taeg: 9.10, minMontante: 1500, maxMontante: 75000, minPrazo: 24, maxPrazo: 96, url: "https://www.santander.pt/credito-automovel", logo: logoUrl("santander.pt") },
    { id: "ca-autobank", nome: "CA Auto Bank", tan: 7.50, taeg: 8.70, minMontante: 2500, maxMontante: 75000, minPrazo: 24, maxPrazo: 120, url: "https://www.ca-autobank.pt/financiamento-veiculos/automoveis/", logo: logoUrl("ca-autobank.pt") },
    { id: "cofidis", nome: "Cofidis", tan: 7.95, taeg: 10.50, minMontante: 1500, maxMontante: 50000, minPrazo: 24, maxPrazo: 96, url: "https://www.cofidis.pt/produtos/credito-automovel", logo: logoUrl("cofidis.pt"), comissaoAbertura: "Sem comissão" },
    { id: "younited", nome: "Younited Credit", tan: 6.44, taeg: 8.80, minMontante: 1000, maxMontante: 50000, minPrazo: 24, maxPrazo: 96, url: "https://pt.younited-credit.com/projetos/credito-automovel", logo: logoUrl("younited-credit.com"), comissaoAbertura: "Sem comissão" },
    { id: "bbva", nome: "BBVA", tan: 8.10, taeg: 9.60, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bbva.pt/pessoas/produtos/financiamento/credito-automovel.html", logo: logoUrl("bbva.pt"), comissaoAbertura: "300€" },
    { id: "banco-primus", nome: "Banco Primus", tan: 8.35, taeg: 10.70, minMontante: 2500, maxMontante: 75000, minPrazo: 12, maxPrazo: 120, url: "https://www.bancoprimus.pt/produtos/financiamento-auto/credito-auto/", logo: logoUrl("bancoprimus.pt"), comissaoAbertura: "Via concessionário" },
  ],
};

console.log(JSON.stringify(data, null, 2));
