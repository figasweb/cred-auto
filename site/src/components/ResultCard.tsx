import { motion } from 'framer-motion';
import { ExternalLink, Trophy, TrendingDown, TrendingUp } from 'lucide-react';
import { formatarEuro, formatarPercentagem } from '../utils/calculo';
import { useEvidence } from './EvidenceModal';
import { Analytics } from '../lib/analytics';

const IS_DEV = import.meta.env.DEV;

interface Props {
  rank: number;
  id: string;
  nome: string;
  prestacao: number;
  tan: number;
  taeg: number;
  mtic: number;
  totalJuros: number;
  montante: number;
  prazo: number;
  url: string;
  logo: string;
  comissaoAbertura?: string;
  vehicleType: string;
  isBest: boolean;
}

export default function ResultCard({
  rank, id, nome, prestacao, tan, taeg, mtic, totalJuros, montante, prazo, url, logo, comissaoAbertura, vehicleType, isBest,
}: Props) {
  const evidence = useEvidence();

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: rank * 0.08 }}
      className={`group relative backdrop-blur-xl rounded-2xl border p-5 md:p-6 transition-all duration-300 hover:scale-[1.01]
        ${isBest
          ? 'bg-gradient-to-br from-success/10 via-surface-2/80 to-surface-2/80 border-success/30 shadow-xl shadow-success/10'
          : 'bg-surface-2/60 border-white/5 hover:border-white/10'
        }`}
    >
      {isBest && (
        <div className="absolute -top-3 left-5 flex items-center gap-1.5 px-3 py-1 bg-success rounded-full text-xs font-bold text-surface">
          <Trophy size={12} />
          Melhor oferta
        </div>
      )}

      <div className="flex flex-col md:flex-row md:items-center gap-4 md:gap-6">
        {/* Rank + Nome + Prestação (mobile: same row) */}
        <div className="flex items-center gap-3 md:min-w-[200px]">
          <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white/5
            ${isBest ? 'ring-2 ring-success/30' : 'ring-1 ring-white/10'}`}>
            <img src={logo} alt={nome} className="w-7 h-7 object-contain" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-extrabold
              ${isBest ? 'bg-success text-surface' : 'bg-surface-3 text-slate-400 ring-1 ring-white/10'}`}>
              {rank}
            </span>
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-bold text-white text-base">{nome}</div>
            {comissaoAbertura && (
              <div className="text-[11px] text-slate-500 mt-0.5">{comissaoAbertura}</div>
            )}
          </div>
          {/* Prestação inline on mobile */}
          <div className="md:hidden text-right shrink-0">
            <div className="text-[10px] text-slate-500 uppercase tracking-wider">Prestação</div>
            <div className={`text-xl font-extrabold ${isBest ? 'text-success' : 'text-white'}`}>
              {formatarEuro(prestacao)}
            </div>
          </div>
        </div>

        {/* Prestação - desktop only (centered) */}
        <div className="hidden md:block flex-1 text-center">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-0.5">Prestação mensal</div>
          <div className={`text-2xl md:text-3xl font-extrabold ${isBest ? 'text-success' : 'text-white'}`}>
            {formatarEuro(prestacao)}
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          <MetricBox
            label="TAN"
            value={formatarPercentagem(tan)}
            clickable={IS_DEV}
            onClick={() => evidence?.open(id, nome, 'tan', vehicleType)}
          />
          <MetricBox
            label="TAEG"
            value={formatarPercentagem(taeg)}
            clickable={IS_DEV}
            onClick={() => evidence?.open(id, nome, 'taeg', vehicleType)}
          />
          <MetricBox label="Total (MTIC)" value={formatarEuro(mtic)} />
          <MetricBox
            label="Juros"
            value={formatarEuro(totalJuros)}
            icon={totalJuros / montante > 0.3 ? <TrendingUp size={10} className="text-red-400" /> : <TrendingDown size={10} className="text-success" />}
          />
        </div>

        {/* Links */}
        <div className="shrink-0 flex flex-col items-center gap-1.5">
          <a
            href={url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={() => Analytics.clickBanco({ banco: nome, rank, tipo: vehicleType, montante, prazo })}
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 no-underline
              ${isBest
                ? 'bg-success text-surface hover:bg-success/90 shadow-lg shadow-success/20'
                : 'bg-white/5 text-slate-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20'
              }`}
          >
            Simular
            <ExternalLink size={14} />
          </a>
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({ label, value, icon, clickable, onClick }: {
  label: string;
  value: string;
  icon?: React.ReactNode;
  clickable?: boolean;
  onClick?: () => void;
}) {
  const content = (
    <>
      <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {label} {icon}
      </div>
      <div className="text-sm font-semibold text-slate-300">{value}</div>
    </>
  );

  if (clickable) {
    return (
      <button
        onClick={onClick}
        className="text-center md:text-left cursor-pointer hover:bg-white/5 rounded-lg p-1 -m-1 transition-colors border border-dashed border-transparent hover:border-amber-500/30"
        title="Ver evidência"
      >
        {content}
      </button>
    );
  }

  return <div className="text-center md:text-left">{content}</div>;
}
