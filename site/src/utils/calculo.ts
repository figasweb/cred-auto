export function calcularPrestacao(capital: number, tanAnual: number, prazoMeses: number): number {
  const taxaMensal = tanAnual / 100 / 12;
  if (taxaMensal === 0) return capital / prazoMeses;
  const fator = Math.pow(1 + taxaMensal, prazoMeses);
  return capital * (taxaMensal * fator) / (fator - 1);
}

export function calcularMTIC(prestacao: number, prazoMeses: number): number {
  return prestacao * prazoMeses;
}

export function calcularTotalJuros(capital: number, prestacao: number, prazoMeses: number): number {
  return (prestacao * prazoMeses) - capital;
}

export function formatarEuro(valor: number): string {
  return new Intl.NumberFormat('pt-PT', {
    style: 'currency',
    currency: 'EUR',
    minimumFractionDigits: 2,
  }).format(valor);
}

export function formatarPercentagem(valor: number): string {
  return valor.toFixed(2).replace('.', ',') + '%';
}
