import { motion } from 'framer-motion';
import { Car } from 'lucide-react';

export default function Hero() {
  return (
    <section className="relative overflow-hidden pt-16 pb-8 px-4">
      {/* Background gradient orbs */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/20 rounded-full blur-[128px] pointer-events-none" />
      <div className="absolute top-20 right-1/4 w-72 h-72 bg-accent/15 rounded-full blur-[100px] pointer-events-none" />

      <div className="relative max-w-4xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary-light text-sm font-medium mb-6"
        >
          <Car size={16} />
          Comparador de Crédito Automóvel
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl md:text-6xl font-extrabold tracking-tight mb-4"
        >
          <span className="text-white">Compare crédito auto</span>
          <br />
          <span className="bg-gradient-to-r from-primary-light via-accent to-success bg-clip-text text-transparent">
            num só lugar
          </span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-slate-400 text-lg md:text-xl max-w-2xl mx-auto mb-2"
        >
          Simule e compare prestações de financiamento automóvel nas principais instituições em Portugal.
        </motion.p>
      </div>
    </section>
  );
}
