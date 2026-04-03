import { useState, useCallback, createContext, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';

interface EvidenceState {
  open: (bankId: string, bankName: string, field: string, vehicleType: string) => void;
}

const EvidenceContext = createContext<EvidenceState | null>(null);

export function useEvidence() {
  return useContext(EvidenceContext);
}

export function EvidenceProvider({ children }: { children: React.ReactNode }) {
  const [visible, setVisible] = useState(false);
  const [bankId, setBankId] = useState('');
  const [bankName, setBankName] = useState('');
  const [field, setField] = useState('');
  const [vehicleType, setVehicleType] = useState('');

  const open = useCallback((id: string, name: string, f: string, vt: string) => {
    setBankId(id);
    setBankName(name);
    setField(f);
    setVehicleType(vt);
    setVisible(true);
  }, []);

  const apiUrl = import.meta.env.VITE_API_URL || '';
  // New naming: {bankId}_{field}_{vehicleType}.png
  const imgSrc = `${apiUrl}/api/evidence/${bankId}_${field.toLowerCase()}_${vehicleType}.png`;

  const tipoLabel: Record<string, string> = { novo: 'Novo', usado: 'Usado', eletrico: 'Elétrico' };

  return (
    <EvidenceContext.Provider value={{ open }}>
      {children}
      <AnimatePresence>
        {visible && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-4"
            onClick={() => setVisible(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              className="relative max-w-4xl w-full max-h-[90vh] bg-surface-2 rounded-2xl border border-white/10 overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between px-5 py-3 border-b border-white/5">
                <div>
                  <span className="text-white font-semibold">{bankName}</span>
                  <span className="text-slate-500 text-sm ml-2">
                    — {field.toUpperCase()} ({tipoLabel[vehicleType] || vehicleType})
                  </span>
                </div>
                <button
                  onClick={() => setVisible(false)}
                  className="text-slate-500 hover:text-white transition-colors cursor-pointer"
                >
                  <X size={20} />
                </button>
              </div>

              <div className="overflow-auto max-h-[80vh] p-2">
                <img
                  src={imgSrc}
                  alt={`Evidência ${bankName} ${field} ${vehicleType}`}
                  className="w-full h-auto"
                  onError={(e) => {
                    (e.target as HTMLImageElement).style.display = 'none';
                    (e.target as HTMLImageElement).parentElement!.innerHTML =
                      '<p class="text-slate-500 text-center py-12">Screenshot não disponível</p>';
                  }}
                />
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </EvidenceContext.Provider>
  );
}
