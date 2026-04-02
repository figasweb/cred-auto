import { motion } from 'framer-motion';
import { ExternalLink, Trophy, TrendingDown, TrendingUp } from 'lucide-react';
import { formatarEuro, formatarPercentagem } from '../utils/calculo';

interface Props {
  rank: number;
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
  fonteUrl?: string;
  isBest: boolean;
}

export default function ResultCard({
  rank, nome, prestacao, tan, taeg, mtic, totalJuros, montante, url, logo, comissaoAbertura, fonteUrl, isBest,
}: Props) {
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
        {/* Rank + Nome */}
        <div className="flex items-center gap-3 md:min-w-[200px]">
          <div className={`relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0 overflow-hidden bg-white/5
            ${isBest ? 'ring-2 ring-success/30' : 'ring-1 ring-white/10'}`}>
            <img src={logo} alt={nome} className="w-7 h-7 object-contain" />
            <span className={`absolute -bottom-0.5 -right-0.5 w-[18px] h-[18px] rounded-full flex items-center justify-center text-[9px] font-extrabold
              ${isBest ? 'bg-success text-surface' : 'bg-surface-3 text-slate-400 ring-1 ring-white/10'}`}>
              {rank}
            </span>
          </div>
          <div>
            <div className="font-bold text-white text-base">{nome}</div>
            {comissaoAbertura && (
              <div className="text-[11px] text-slate-500 mt-0.5">{comissaoAbertura}</div>
            )}
          </div>
        </div>

        {/* Prestação - destaque */}
        <div className="flex-1 md:text-center">
          <div className="text-[11px] text-slate-500 uppercase tracking-wider mb-0.5">Prestação mensal</div>
          <div className={`text-2xl md:text-3xl font-extrabold ${isBest ? 'text-success' : 'text-white'}`}>
            {formatarEuro(prestacao)}
          </div>
        </div>

        {/* Métricas */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-5">
          <MetricBox label="TAN" value={formatarPercentagem(tan)} />
          <MetricBox label="TAEG" value={formatarPercentagem(taeg)} />
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
            className={`inline-flex items-center justify-center gap-2 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 no-underline
              ${isBest
                ? 'bg-success text-surface hover:bg-success/90 shadow-lg shadow-success/20'
                : 'bg-white/5 text-slate-300 hover:bg-primary hover:text-white hover:shadow-lg hover:shadow-primary/20'
              }`}
          >
            Simular
            <ExternalLink size={14} />
          </a>
          {fonteUrl && (
            <a
              href={fonteUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="text-[10px] text-slate-600 hover:text-slate-400 transition-colors no-underline"
            >
              Ver fonte
            </a>
          )}
        </div>
      </div>
    </motion.div>
  );
}

function MetricBox({ label, value, icon }: { label: string; value: string; icon?: React.ReactNode }) {
  return (
    <div className="text-center md:text-left">
      <div className="text-[10px] text-slate-500 uppercase tracking-wider flex items-center gap-1">
        {label} {icon}
      </div>
      <div className="text-sm font-semibold text-slate-300">{value}</div>
    </div>
  );
}
