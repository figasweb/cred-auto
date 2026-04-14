import { motion } from 'framer-motion';

const steps = [
  {
    n: 1,
    title: 'Escolhe o tipo de veiculo',
    desc: 'Novo, usado ou eletrico. Cada categoria tem taxas especificas publicadas por cada banco — os veiculos eletricos, por exemplo, costumam ter condicoes mais vantajosas devido a incentivos ambientais.',
  },
  {
    n: 2,
    title: 'Define montante e prazo',
    desc: 'Indica quanto precisas de financiar (entre 1.000 EUR e 75.000 EUR) e em quantos meses pretendes pagar (12 a 120 meses). O simulador calcula automaticamente a prestacao para cada instituicao.',
  },
  {
    n: 3,
    title: 'Compara os resultados',
    desc: 'Mostramos uma lista ordenada pela menor prestacao. Cada cartao inclui TAN, TAEG, custo total (MTIC) e total de juros. As instituicoes que nao aceitam os teus criterios aparecem separadas com a explicacao.',
  },
  {
    n: 4,
    title: 'Simula no site oficial',
    desc: 'Encontraste a melhor oferta? Clica em "Simular" para ires diretamente ao simulador oficial do banco. Os valores apresentados aqui sao indicativos — a proposta vinculativa depende sempre da analise de credito do banco.',
  },
];

export default function HowItWorksSection() {
  return (
    <section id="como-funciona" className="max-w-5xl mx-auto px-4 py-16 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Como <span className="text-primary-light">funciona</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-3xl">
          Comparar credito automovel em Portugal sempre foi uma dor de cabeca:
          muitos bancos, simuladores diferentes, dezenas de formularios. O
          Comparas.pt resolve isso em quatro passos simples.
        </p>

        <div className="grid md:grid-cols-2 gap-5">
          {steps.map((s) => (
            <div
              key={s.n}
              className="bg-surface-2/40 border border-white/5 rounded-2xl p-6 flex gap-4"
            >
              <div className="shrink-0 w-10 h-10 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center text-primary-light font-bold">
                {s.n}
              </div>
              <div>
                <h3 className="text-white font-bold text-lg mb-1.5">{s.title}</h3>
                <p className="text-slate-500 text-sm leading-relaxed">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>

        <div className="mt-8 p-5 bg-primary/5 border border-primary/10 rounded-2xl">
          <p className="text-slate-400 text-sm leading-relaxed">
            <strong className="text-white">Metodologia:</strong> as prestacoes mensais
            sao calculadas usando a formula Price, com a TAN de referencia publicada por
            cada instituicao. O TAEG, quando disponivel, inclui os encargos obrigatorios
            como comissoes e imposto de selo, sendo o indicador mais fiavel para comparar
            ofertas de credito em Portugal.
          </p>
        </div>
      </motion.div>
    </section>
  );
}
