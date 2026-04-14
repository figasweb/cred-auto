import { motion } from 'framer-motion';
import { Shield, Target, Zap } from 'lucide-react';

export default function AboutSection() {
  return (
    <section className="max-w-5xl mx-auto px-4 py-16 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Sobre o <span className="text-primary-light">Comparas.pt</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-3xl">
          O Comparas.pt e um comparador independente de credito automovel em Portugal.
          Reunimos numa unica pagina as ofertas publicas das principais instituicoes
          financeiras, permitindo-te poupar tempo e dinheiro ao simular e comparar
          prestacoes, TAN, TAEG e custo total do credito em segundos.
        </p>

        <div className="grid md:grid-cols-3 gap-6">
          <div className="bg-surface-2/40 border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center mb-4">
              <Target size={22} className="text-primary-light" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Independente</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Nao representamos nenhum banco. Os dados sao recolhidos das paginas
              oficiais de cada instituicao, sem influencia comercial.
            </p>
          </div>

          <div className="bg-surface-2/40 border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-accent/10 flex items-center justify-center mb-4">
              <Zap size={22} className="text-accent" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Rapido</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Compara todas as instituicoes num so clique. Sem formularios longos,
              sem partilha de dados pessoais, sem spam.
            </p>
          </div>

          <div className="bg-surface-2/40 border border-white/5 rounded-2xl p-6">
            <div className="w-12 h-12 rounded-xl bg-success/10 flex items-center justify-center mb-4">
              <Shield size={22} className="text-success" />
            </div>
            <h3 className="text-white font-bold text-lg mb-2">Transparente</h3>
            <p className="text-slate-500 text-sm leading-relaxed">
              Cada taxa tem a fonte publicada visivel. Vais ao site do banco quando
              quiseres validar os valores.
            </p>
          </div>
        </div>
      </motion.div>
    </section>
  );
}
