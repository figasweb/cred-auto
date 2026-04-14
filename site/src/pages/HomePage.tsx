import { useState } from 'react';
import { motion } from 'framer-motion';
import { Loader2, AlertCircle } from 'lucide-react';
import type { VehicleType } from '../data/instituicoes';
import { useInstituicoes } from '../hooks/useInstituicoes';
import Hero from '../components/Hero';
import SimuladorForm from '../components/SimuladorForm';
import ResultsList from '../components/ResultsList';
import AdPlaceholder from '../components/AdPlaceholder';
import AboutSection from '../components/AboutSection';
import HowItWorksSection from '../components/HowItWorksSection';
import FaqSection from '../components/FaqSection';

export default function HomePage() {
  const [tipo, setTipo] = useState<VehicleType>('novo');
  const [montante, setMontante] = useState(15000);
  const [prazo, setPrazo] = useState(60);
  const { data, loading, error } = useInstituicoes();

  return (
    <>
      <Hero />
      <SimuladorForm
        tipo={tipo}
        montante={montante}
        prazo={prazo}
        onTipoChange={setTipo}
        onMontanteChange={setMontante}
        onPrazoChange={setPrazo}
      />

      <AdPlaceholder label="Anuncio — Topo dos resultados" />

      {loading && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex items-center justify-center py-16 gap-3 text-slate-400"
        >
          <Loader2 size={24} className="animate-spin" />
          <span>A carregar dados...</span>
        </motion.div>
      )}

      {error && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="max-w-5xl mx-auto px-4 pb-16"
        >
          <div className="text-center py-16 bg-red-500/5 rounded-2xl border border-red-500/10">
            <AlertCircle size={40} className="mx-auto text-red-400 mb-3" />
            <p className="text-red-400 text-lg font-medium">Erro ao carregar dados</p>
            <p className="text-slate-500 text-sm mt-1">{error}</p>
          </div>
        </motion.div>
      )}

      {data && (
        <ResultsList tipo={tipo} montante={montante} prazo={prazo} instituicoes={data} />
      )}

      <AboutSection />
      <HowItWorksSection />
      <FaqSection />
    </>
  );
}
