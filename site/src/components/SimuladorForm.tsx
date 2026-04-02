import { motion } from 'framer-motion';
import { Car, Zap, Clock } from 'lucide-react';
import type { VehicleType } from '../data/instituicoes';
import { formatarEuro } from '../utils/calculo';

interface Props {
  tipo: VehicleType;
  montante: number;
  prazo: number;
  onTipoChange: (tipo: VehicleType) => void;
  onMontanteChange: (valor: number) => void;
  onPrazoChange: (valor: number) => void;
}

const tipos: { key: VehicleType; label: string; icon: React.ReactNode; desc: string }[] = [
  { key: 'novo', label: 'Novo', icon: <Car size={20} />, desc: 'Veículo 0 km' },
  { key: 'usado', label: 'Usado', icon: <Clock size={20} />, desc: 'Segunda mão' },
  { key: 'eletrico', label: 'Elétrico', icon: <Zap size={20} />, desc: 'Taxas reduzidas' },
];

const prazosDisponiveis = [12, 18, 24, 36, 48, 60, 72, 84, 96, 108, 120];

export default function SimuladorForm({ tipo, montante, prazo, onTipoChange, onMontanteChange, onPrazoChange }: Props) {
  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3 }}
      className="max-w-4xl mx-auto px-4 mb-12"
    >
      <div className="backdrop-blur-xl bg-surface-2/80 border border-white/5 rounded-2xl p-6 md:p-8 shadow-2xl">
        {/* Tipo de veículo */}
        <div className="mb-8">
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Tipo de veículo
          </label>
          <div className="grid grid-cols-3 gap-3">
            {tipos.map((t) => (
              <button
                key={t.key}
                onClick={() => onTipoChange(t.key)}
                className={`relative flex flex-col items-center gap-1.5 py-4 px-3 rounded-xl border-2 transition-all duration-300 cursor-pointer
                  ${tipo === t.key
                    ? 'border-primary bg-primary/10 text-white shadow-lg shadow-primary/20'
                    : 'border-white/5 bg-white/[0.02] text-slate-400 hover:border-white/10 hover:bg-white/[0.04]'
                  }`}
              >
                <span className={tipo === t.key ? 'text-primary-light' : ''}>{t.icon}</span>
                <span className="font-semibold text-sm">{t.label}</span>
                <span className="text-[11px] text-slate-500">{t.desc}</span>
                {tipo === t.key && (
                  <motion.div
                    layoutId="type-indicator"
                    className="absolute -bottom-px left-4 right-4 h-0.5 bg-gradient-to-r from-primary to-accent rounded-full"
                  />
                )}
              </button>
            ))}
          </div>
        </div>

        {/* Montante */}
        <div className="mb-8">
          <div className="flex justify-between items-baseline mb-3">
            <label className="text-xs font-semibold text-slate-500 uppercase tracking-wider">
              Montante a financiar
            </label>
            <span className="text-2xl font-bold text-white">{formatarEuro(montante)}</span>
          </div>
          <input
            type="range"
            min={1000}
            max={75000}
            step={500}
            value={montante}
            onChange={(e) => onMontanteChange(Number(e.target.value))}
            className="w-full mb-2"
          />
          <div className="flex justify-between text-xs text-slate-600">
            <span>1.000 €</span>
            <span>75.000 €</span>
          </div>
        </div>

        {/* Prazo */}
        <div>
          <label className="block text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3">
            Prazo de pagamento
          </label>
          <div className="flex flex-wrap gap-2">
            {prazosDisponiveis.map((p) => (
              <button
                key={p}
                onClick={() => onPrazoChange(p)}
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-all duration-200 cursor-pointer
                  ${prazo === p
                    ? 'bg-primary text-white shadow-lg shadow-primary/30'
                    : 'bg-white/5 text-slate-400 hover:bg-white/10 hover:text-slate-300'
                  }`}
              >
                {p} <span className="text-[11px] opacity-70">meses</span>
              </button>
            ))}
          </div>
        </div>
      </div>
    </motion.section>
  );
}
