import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown } from 'lucide-react';

const faqs = [
  {
    q: 'Qual a diferenca entre TAN e TAEG?',
    a: 'A TAN (Taxa Anual Nominal) e a taxa de juro pura aplicada ao emprestimo, sem considerar outros custos. O TAEG (Taxa Anual Efetiva Global) inclui TODOS os custos obrigatorios do credito — comissoes de abertura, imposto de selo, seguros exigidos pelo banco, etc. Para comparar ofertas de forma justa, olha sempre para o TAEG, nunca so para a TAN.',
  },
  {
    q: 'O que e o MTIC?',
    a: 'MTIC significa "Montante Total Imputado ao Consumidor" e representa o valor total que vais pagar ao longo de todo o credito (capital + juros + encargos). E a melhor forma de entender o custo real do financiamento: se pedes 15.000 EUR emprestados e o MTIC e 17.500 EUR, significa que no fim terias pago 2.500 EUR a mais que o valor inicial.',
  },
  {
    q: 'Os valores apresentados sao vinculativos?',
    a: 'Nao. Todos os valores mostrados no Comparas.pt sao indicativos, calculados com base nas TANs de referencia publicadas oficialmente por cada instituicao. A prestacao real que te sera proposta depende da analise individual de credito feita pelo banco, que considera o teu perfil financeiro, historial de credito, rendimento e outros fatores. Para uma proposta vinculativa, deves sempre contactar diretamente a instituicao.',
  },
  {
    q: 'Porque e que algumas instituicoes aparecem como "excluidas"?',
    a: 'Cada banco define limites minimos e maximos para montante e prazo do credito. Se o valor que indicaste esta fora desses limites (por exemplo, pedes 80.000 EUR mas o banco so financia ate 50.000 EUR), a instituicao aparece na lista de excluidas com a explicacao do motivo. Ajusta o montante ou o prazo para voltar a veres todas as instituicoes.',
  },
  {
    q: 'Como sao obtidas as taxas de juro?',
    a: 'As taxas sao recolhidas automaticamente das paginas oficiais de cada instituicao financeira — tabelas de preco, simuladores publicos e PDFs regulamentares. A recolha e feita periodicamente e cada valor tem uma fonte identificada (URL da pagina de origem). Nao recebemos dados diretamente dos bancos nem temos acordos comerciais que possam influenciar o ranking.',
  },
  {
    q: 'O Comparas.pt cobra alguma comissao?',
    a: 'Nao. O Comparas.pt e um servico totalmente gratuito para o utilizador. Nao cobramos por usar a ferramenta, nao pedimos dados pessoais, e nao vendemos leads. O site pode ter anuncios (Google AdSense) ou eventuais acordos de afiliacao claramente identificados, mas isso nao influencia a ordem dos resultados — a lista e sempre ordenada pela menor prestacao.',
  },
  {
    q: 'Qual o credito automovel mais barato em Portugal?',
    a: 'Depende do tipo de veiculo, montante e prazo que pretendes. Os veiculos eletricos costumam ter as taxas mais baixas do mercado devido aos incentivos ambientais. Para encontrares o mais barato para o teu caso especifico, usa o simulador acima — o primeiro resultado na lista e sempre o mais barato com base nos criterios que escolheste.',
  },
  {
    q: 'Posso pagar o credito automovel antecipadamente?',
    a: 'Sim. A lei portuguesa (Decreto-Lei n.o 133/2009) garante o direito ao reembolso antecipado do credito ao consumo, incluindo o credito automovel. O banco pode cobrar uma comissao maxima de 0,5% sobre o capital reembolsado (0,25% se faltar menos de um ano para o fim do contrato), mas nao pode recusar o pagamento antecipado.',
  },
];

export default function FaqSection() {
  const [open, setOpen] = useState<number | null>(0);

  return (
    <section id="faq" className="max-w-5xl mx-auto px-4 py-16 border-t border-white/5">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.5 }}
      >
        <h2 className="text-3xl md:text-4xl font-extrabold text-white mb-4">
          Perguntas <span className="text-primary-light">frequentes</span>
        </h2>
        <p className="text-slate-400 text-lg leading-relaxed mb-10 max-w-3xl">
          As duvidas mais comuns sobre credito automovel em Portugal e o
          funcionamento do Comparas.pt.
        </p>

        <div className="flex flex-col gap-3">
          {faqs.map((item, i) => {
            const isOpen = open === i;
            return (
              <div
                key={i}
                className="bg-surface-2/40 border border-white/5 rounded-2xl overflow-hidden"
              >
                <button
                  onClick={() => setOpen(isOpen ? null : i)}
                  className="w-full flex items-center justify-between gap-4 p-5 text-left cursor-pointer hover:bg-white/[0.02] transition-colors"
                >
                  <h3 className="text-white font-semibold text-base md:text-lg">
                    {item.q}
                  </h3>
                  <ChevronDown
                    size={20}
                    className={`shrink-0 text-slate-400 transition-transform duration-300 ${
                      isOpen ? 'rotate-180' : ''
                    }`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-slate-400 text-sm md:text-base leading-relaxed">
                        {item.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </motion.div>
    </section>
  );
}
