import { useMemo } from 'react';
import { motion } from 'framer-motion';
import { BarChart3, AlertCircle } from 'lucide-react';
import type { VehicleType, Instituicao } from '../data/instituicoes';
import { calcularPrestacao, calcularMTIC, calcularTotalJuros, formatarEuro } from '../utils/calculo';
import ResultCard from './ResultCard';
import ExcludedList from './ExcludedList';

interface Props {
  tipo: VehicleType;
  montante: number;
  prazo: number;
  instituicoes: Record<VehicleType, Instituicao[]>;
}

export default function ResultsList({ tipo, montante, prazo, instituicoes }: Props) {
  const { resultados, excluidos } = useMemo(() => {
    const lista = instituicoes[tipo];
    const inc: (Instituicao & { prestacao: number; mtic: number; totalJuros: number })[] = [];
    const exc: { nome: string; url: string; logo: string; motivos: string[]; minMontante: number; maxMontante: number; minPrazo: number; maxPrazo: number }[] = [];

    lista.forEach((inst) => {
      const montanteAbaixo = montante < inst.minMontante;
      const montanteAcima = montante > inst.maxMontante;
      const prazoAbaixo = prazo < inst.minPrazo;
      const prazoAcima = prazo > inst.maxPrazo;
      const montanteOk = !montanteAbaixo && !montanteAcima;
      const prazoOk = !prazoAbaixo && !prazoAcima;

      if (montanteOk && prazoOk) {
        const prestacao = calcularPrestacao(montante, inst.tan, prazo);
        const mtic = calcularMTIC(prestacao, prazo);
        const totalJuros = calcularTotalJuros(montante, prestacao, prazo);
        inc.push({ ...inst, prestacao, mtic, totalJuros });
      } else {
        const motivos: string[] = [];
        if (montanteAbaixo) motivos.push(`Montante mínimo: ${formatarEuro(inst.minMontante)}`);
        if (montanteAcima) motivos.push(`Montante máximo: ${formatarEuro(inst.maxMontante)}`);
        if (prazoAbaixo) motivos.push(`Prazo mínimo: ${inst.minPrazo} meses`);
        if (prazoAcima) motivos.push(`Prazo máximo: ${inst.maxPrazo} meses`);
        exc.push({
          nome: inst.nome,
          url: inst.url,
          logo: inst.logo,
          motivos,
          minMontante: inst.minMontante,
          maxMontante: inst.maxMontante,
          minPrazo: inst.minPrazo,
          maxPrazo: inst.maxPrazo,
        });
      }
    });

    inc.sort((a, b) => a.prestacao - b.prestacao);
    return { resultados: inc, excluidos: exc };
  }, [tipo, montante, prazo, instituicoes]);

  const tipoLabel = { novo: 'Novo', usado: 'Usado', eletrico: 'Elétrico' };

  if (resultados.length === 0) {
    return (
      <div className="max-w-5xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 bg-surface-2/40 rounded-2xl border border-white/5"
        >
          <AlertCircle size={40} className="mx-auto text-slate-600 mb-3" />
          <p className="text-slate-400 text-lg font-medium">Nenhuma instituição disponível</p>
          <p className="text-slate-600 text-sm mt-1">Tente ajustar o montante ou prazo.</p>
        </motion.div>

        {excluidos.length > 0 && (
          <ExcludedList excluidos={excluidos} montante={montante} prazo={prazo} />
        )}
      </div>
    );
  }

  const poupanca = resultados.length > 1
    ? (resultados[resultados.length - 1].prestacao - resultados[0].prestacao)
    : 0;

  return (
    <section className="max-w-5xl mx-auto px-4 pb-16">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
            <BarChart3 size={20} className="text-primary-light" />
          </div>
          <div>
            <h2 className="text-xl font-bold text-white">Resultados</h2>
            <p className="text-sm text-slate-500">
              {resultados.length} instituições &middot; {tipoLabel[tipo]} &middot; {formatarEuro(montante)} &middot; {prazo} meses
            </p>
          </div>
        </div>

        {poupanca > 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-success/10 border border-success/20 rounded-full text-success text-sm font-semibold"
          >
            Pode poupar até {formatarEuro(poupanca)}/mês escolhendo bem
          </motion.div>
        )}
      </div>

      {/* Cards */}
      <div className="flex flex-col gap-4">
        {resultados.map((r, i) => (
          <ResultCard
            key={r.id || r.nome}
            rank={i + 1}
            id={r.id || r.nome.toLowerCase().replace(/\s+/g, '-')}
            nome={r.nome}
            prestacao={r.prestacao}
            tan={r.tan}
            taeg={r.taeg}
            mtic={r.mtic}
            totalJuros={r.totalJuros}
            montante={montante}
            prazo={prazo}
            url={r.url}
            logo={r.logo}
            comissaoAbertura={r.comissaoAbertura}
            vehicleType={tipo}
            isBest={i === 0}
          />
        ))}
      </div>

      {/* Excluded */}
      {excluidos.length > 0 && (
        <ExcludedList excluidos={excluidos} montante={montante} prazo={prazo} />
      )}

      {/* Disclaimer */}
      <motion.p
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        className="text-[11px] text-slate-600 mt-6 leading-relaxed max-w-3xl"
      >
        * Prestações calculadas com a fórmula Price usando a TAN de referência publicada por cada instituição (Abril 2026).
        Valores indicativos — a prestação real depende da análise de crédito, seguros e comissões.
        Consulte sempre o simulador oficial para valores vinculativos.
      </motion.p>
    </section>
  );
}
