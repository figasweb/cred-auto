import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function TermsPage() {
  return (
    <div className="max-w-3xl mx-auto px-4 py-16">
      <Link
        to="/"
        className="inline-flex items-center gap-2 text-slate-400 hover:text-primary-light text-sm mb-8 no-underline"
      >
        <ArrowLeft size={16} />
        Voltar ao inicio
      </Link>

      <h1 className="text-4xl md:text-5xl font-extrabold text-white mb-4">
        Termos de <span className="text-primary-light">Utilizacao</span>
      </h1>
      <p className="text-slate-500 text-sm mb-10">Ultima atualizacao: abril de 2026</p>

      <div className="space-y-6 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">1. Aceitacao dos termos</h2>
          <p>
            Ao aceder e utilizar o website Comparas.pt (&quot;o site&quot;),
            concordas em ficar vinculado aos presentes Termos de Utilizacao. Se
            nao concordares com algum destes termos, nao deves utilizar o site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            2. Natureza do servico
          </h2>
          <p>
            O Comparas.pt e uma ferramenta informativa de comparacao de credito
            automovel que agrega e apresenta, de forma organizada, as condicoes
            publicas de varias instituicoes financeiras a operar em Portugal.
          </p>
          <p>
            <strong className="text-white">O Comparas.pt nao e um intermediario de credito,
            nao comercializa produtos financeiros, nao concede creditos, nem
            representa qualquer banco ou instituicao financeira.</strong> Nao
            estamos registados no Banco de Portugal como intermediario de credito.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            3. Valor informativo dos resultados
          </h2>
          <p>
            Todos os valores apresentados no simulador (prestacao mensal, TAN,
            TAEG, MTIC, total de juros) sao{' '}
            <strong className="text-white">meramente indicativos</strong> e
            baseiam-se nas taxas de referencia publicadas pelas instituicoes
            financeiras a data da ultima atualizacao.
          </p>
          <p>
            A prestacao efetiva que te sera proposta por qualquer banco depende
            de uma analise individual de credito, que tem em conta fatores como
            o teu rendimento, historial creditico, tipo de veiculo, valor de
            entrada, entre outros. Os valores definitivos sao apenas os que
            constam da proposta escrita vinculativa emitida pela instituicao.
          </p>
          <p>
            <strong className="text-white">
              O Comparas.pt nao se responsabiliza por decisoes financeiras tomadas
              com base nas informacoes apresentadas no site.
            </strong>{' '}
            Recomendamos vivamente que consultes sempre o simulador oficial da
            instituicao escolhida e leses atentamente a ficha de informacao
            normalizada europeia (FINE) antes de contratares qualquer credito.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            4. Precisao e atualizacao dos dados
          </h2>
          <p>
            Esforcamo-nos para manter as taxas e condicoes atualizadas, mas nao
            garantimos que a informacao apresentada esteja sempre correta,
            completa ou atualizada em relacao a oferta oficial de cada
            instituicao. Podem existir alteracoes comerciais pontuais que ainda
            nao estejam refletidas no site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            5. Propriedade intelectual
          </h2>
          <p>
            Todo o conteudo original do site (texto, design, logotipo, estrutura,
            codigo) e propriedade do Comparas.pt. Os logotipos e nomes das
            instituicoes financeiras sao propriedade dos respetivos titulares e
            sao utilizados exclusivamente para fins informativos e identificativos.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            6. Publicidade
          </h2>
          <p>
            O Comparas.pt pode conter anuncios publicitarios fornecidos pelo
            Google AdSense ou outras redes de publicidade. Estes anuncios sao
            claramente identificados como tal e nao influenciam a ordenacao dos
            resultados do comparador, que e feita exclusivamente pelo valor da
            prestacao mensal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            7. Ligacoes externas
          </h2>
          <p>
            O site contem ligacoes para sites de terceiros, nomeadamente
            simuladores oficiais de instituicoes financeiras. O Comparas.pt nao
            controla o conteudo nem as praticas desses sites e nao e responsavel
            pelas informacoes ou servicos neles apresentados.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            8. Limitacao de responsabilidade
          </h2>
          <p>
            O Comparas.pt disponibiliza o servico &quot;tal como esta&quot;, sem
            garantias de qualquer tipo, expressas ou implicitas. Na maxima
            extensao permitida por lei, o Comparas.pt nao sera responsavel por
            quaisquer danos diretos, indiretos, incidentais, consequenciais ou
            punitivos decorrentes do uso ou impossibilidade de uso do site.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            9. Lei aplicavel
          </h2>
          <p>
            Estes Termos de Utilizacao sao regidos pela lei portuguesa. Qualquer
            litigio emergente da sua interpretacao ou execucao sera submetido aos
            tribunais competentes em Portugal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            10. Alteracoes aos termos
          </h2>
          <p>
            Reservamos o direito de modificar estes Termos de Utilizacao a
            qualquer momento. As alteracoes entram em vigor a partir da data da
            sua publicacao nesta pagina. E da tua responsabilidade consultar
            periodicamente este documento.
          </p>
        </section>
      </div>
    </div>
  );
}
