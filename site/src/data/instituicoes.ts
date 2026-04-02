export type VehicleType = 'novo' | 'usado' | 'eletrico';

export interface Instituicao {
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
