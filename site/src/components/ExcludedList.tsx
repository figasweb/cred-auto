import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Ban, ChevronDown, ChevronUp, ExternalLink, Info } from 'lucide-react';
import { formatarEuro } from '../utils/calculo';
import { Analytics } from '../lib/analytics';

interface ExcludedItem {
  nome: string;
  url: string;
  logo: string;
  motivos: string[];
  minMontante: number;
  maxMontante: number;
  minPrazo: number;
  maxPrazo: number;
}

interface Props {
  excluidos: ExcludedItem[];
  montante: number;
  prazo: number;
}

export default function ExcludedList({ excluidos, montante, prazo, tipo }: Props & { tipo?: string }) {
  const [aberto, setAberto] = useState(false);

  return (
    <div className="mt-8">
      <button
        onClick={() => { if (!aberto) Analytics.expandExcluded(excluidos.length); setAberto(!aberto); }}
        className="flex items-center gap-3 w-full text-left group cursor-pointer"
      >
        <div className="w-8 h-8 rounded-lg bg-amber-500/10 flex items-center justify-center shrink-0">
          <Ban size={16} className="text-amber-500" />
        </div>
        <div className="flex-1">
          <span className="text-sm font-semibold text-slate-400 group-hover:text-slate-300 transition-colors">
            {excluidos.length} {excluidos.length === 1 ? 'instituição excluída' : 'instituições excluídas'}
          </span>
          <span className="text-xs text-slate-600 ml-2">
            — não compatíveis com os critérios selecionados
          </span>
        </div>
        <div className="text-slate-500 group-hover:text-slate-400 transition-colors">
          {aberto ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>

      <AnimatePresence>
        {aberto && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="overflow-hidden"
          >
            <div className="mt-4 flex flex-col gap-3">
              {excluidos.map((item) => (
                <div
                  key={item.nome}
                  className="bg-surface-2/40 border border-white/5 rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-3"
                >
                  {/* Nome */}
                  <div className="flex items-center gap-2.5 md:min-w-[160px]">
                    <div className="w-8 h-8 rounded-lg bg-white/5 ring-1 ring-white/10 flex items-center justify-center shrink-0 overflow-hidden">
                      <img src={item.logo} alt={item.nome} className="w-5 h-5 object-contain" />
                    </div>
                    <div className="font-semibold text-slate-400 text-sm">{item.nome}</div>
                  </div>

                  {/* Motivos */}
                  <div className="flex-1 flex flex-wrap gap-2">
                    {item.motivos.map((motivo, i) => (
                      <span
                        key={i}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-amber-500/5 border border-amber-500/10 text-amber-400/80 text-xs font-medium"
                      >
                        <Info size={11} />
                        {motivo}
                      </span>
                    ))}
                  </div>

                  {/* Condições aceites */}
                  <div className="text-[11px] text-slate-600 md:text-right md:min-w-[200px] leading-relaxed">
                    <div>Montante: {formatarEuro(item.minMontante)} — {formatarEuro(item.maxMontante)}</div>
                    <div>Prazo: {item.minPrazo} — {item.maxPrazo} meses</div>
                  </div>

                  {/* Link */}
                  <a
                    href={item.url}
                    target="_blank"
                    rel="noopener noreferrer"
                    onClick={() => Analytics.clickBancoExcluded({ banco: item.nome, tipo: tipo || '', montante, prazo })}
                    className="shrink-0 inline-flex items-center gap-1.5 px-3 py-2 rounded-lg text-xs font-medium text-slate-500 hover:text-primary-light hover:bg-white/5 transition-all no-underline"
                  >
                    Ver site
                    <ExternalLink size={12} />
                  </a>
                </div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
