import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';

export default function PrivacyPage() {
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
        Politica de <span className="text-primary-light">Privacidade</span>
      </h1>
      <p className="text-slate-500 text-sm mb-10">Ultima atualizacao: abril de 2026</p>

      <div className="prose prose-invert max-w-none space-y-6 text-slate-300 leading-relaxed">
        <section>
          <h2 className="text-2xl font-bold text-white mb-3">1. Introducao</h2>
          <p>
            A presente Politica de Privacidade descreve como o Comparas.pt
            (&quot;nos&quot;) recolhe, utiliza e protege os dados dos visitantes
            (&quot;utilizador&quot; ou &quot;tu&quot;) do website acessivel em{' '}
            <code className="text-primary-light">https://comparas.pt</code>. Ao
            utilizares o Comparas.pt, concordas com as praticas descritas neste
            documento.
          </p>
          <p>
            O Comparas.pt esta comprometido com a protecao dos dados pessoais e
            cumpre o Regulamento Geral de Protecao de Dados (RGPD, Regulamento
            UE 2016/679) e a Lei n.o 58/2019 que o executa em Portugal.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            2. Dados que recolhemos
          </h2>
          <p>
            <strong>Nao recolhemos dados pessoais identificaveis.</strong> O
            Comparas.pt nao tem formularios de registo, nao pede nome, email,
            telefone, NIF ou qualquer outra informacao que permita identificar
            pessoalmente o utilizador.
          </p>
          <p>Recolhemos apenas dados agregados e anonimos, nomeadamente:</p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Dados de utilizacao:</strong> paginas visitadas, tempo de
              sessao, tipo de dispositivo, navegador, sistema operativo, pais de
              origem (ao nivel do pais, nao da cidade).
            </li>
            <li>
              <strong>Interacoes com o simulador:</strong> tipo de veiculo
              escolhido, montante e prazo simulados, instituicoes clicadas. Estes
              dados sao totalmente anonimos e servem para melhorarmos o produto e
              gerar estatisticas agregadas.
            </li>
            <li>
              <strong>Dados tecnicos:</strong> endereco IP (usado apenas para
              geolocalizacao por pais, nao armazenado de forma permanente).
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            3. Cookies e tecnologias similares
          </h2>
          <p>
            O Comparas.pt utiliza cookies e tecnologias similares, tanto proprios
            como de terceiros, para as seguintes finalidades:
          </p>
          <ul className="list-disc pl-6 space-y-2">
            <li>
              <strong>Cookies essenciais:</strong> necessarios para o
              funcionamento do site (p. ex., cache local de dados para evitar
              pedidos repetidos ao servidor).
            </li>
            <li>
              <strong>Google Analytics 4 (Firebase):</strong> cookies de terceiros
              usados para medir o desempenho do site e compreender como os
              visitantes interagem com ele. Os dados sao tratados de forma
              agregada.
            </li>
            <li>
              <strong>Google AdSense:</strong> cookies de terceiros usados para
              apresentar anuncios. Estes cookies podem ser usados pelo Google
              para personalizar anuncios com base nas tuas visitas a este e a
              outros sites.
            </li>
          </ul>
          <p>
            Podes gerir ou desativar cookies diretamente nas definicoes do teu
            navegador.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            4. Publicidade e Google AdSense
          </h2>
          <p>
            Utilizamos o Google AdSense como fornecedor externo para apresentar
            anuncios. O Google, enquanto fornecedor externo, utiliza cookies
            para apresentar anuncios com base nas visitas anteriores deste e de
            outros sites.
          </p>
          <p>
            A utilizacao de cookies de publicidade pelo Google permite-lhe, bem
            como aos seus parceiros, apresentar anuncios aos utilizadores com
            base nas suas visitas aos sites. Podes optar por desativar a
            publicidade personalizada acedendo a{' '}
            <a
              href="https://www.google.com/settings/ads"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:underline"
            >
              definicoes de anuncios da Google
            </a>
            .
          </p>
          <p>
            Para mais informacoes sobre como o Google utiliza os dados, consulta
            a{' '}
            <a
              href="https://policies.google.com/technologies/partner-sites"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary-light hover:underline"
            >
              politica do Google para parceiros
            </a>
            .
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            5. Ligacoes para outros sites
          </h2>
          <p>
            O Comparas.pt contem ligacoes para sites de terceiros, nomeadamente
            para as paginas oficiais dos bancos e instituicoes financeiras. Nao
            somos responsaveis pelas praticas de privacidade desses sites. Ao
            clicares numa ligacao externa, aconselhamos-te a ler a politica de
            privacidade do site de destino.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            6. Os teus direitos
          </h2>
          <p>
            Ao abrigo do RGPD, tens direito a aceder, retificar ou eliminar os
            teus dados pessoais. Como o Comparas.pt nao recolhe dados
            identificaveis, estes direitos sao exercidos diretamente atraves dos
            servicos de terceiros usados pelo site (Google Analytics, Google
            AdSense).
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">
            7. Alteracoes a esta politica
          </h2>
          <p>
            Podemos atualizar esta Politica de Privacidade periodicamente.
            Qualquer alteracao sera publicada nesta pagina com a respetiva data
            de atualizacao.
          </p>
        </section>

        <section>
          <h2 className="text-2xl font-bold text-white mb-3">8. Contacto</h2>
          <p>
            Para qualquer questao relacionada com esta Politica de Privacidade,
            podes contactar-nos atraves do email indicado nos Termos de
            Utilizacao.
          </p>
        </section>
      </div>
    </div>
  );
}
