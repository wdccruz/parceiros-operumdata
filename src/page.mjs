// Renderiza as páginas estáticas a partir dos arquivos de configuração.
// Todo o texto é português. Links internos e assets usam caminhos RELATIVOS,
// para funcionar tanto em /parceiros-operumdata/ quanto em um subdomínio próprio.

import { operumdata } from "./config/operumdata.mjs";
import { parceiroInternacional as parceiro } from "./config/parceiro-internacional.mjs";
import { site } from "./config/site.mjs";

const esc = (value) =>
  String(value)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;");

const PENDENTE = "Pendente";

// ---------------------------------------------------------------------------
// Marcas
// ---------------------------------------------------------------------------

const operumMark = (cls = "") => `
  <svg class="operum-mark ${cls}" viewBox="0 0 32 32" aria-hidden="true" focusable="false">
    <rect x="1.5" y="1.5" width="29" height="29" />
    <circle cx="16" cy="16" r="6.5" />
    <path class="operum-mark__tick" d="M16 1.5v7M16 23.5v7" />
    <circle class="operum-mark__dot" cx="16" cy="16" r="2.4" />
  </svg>`;

// Identidade do parceiro: logotipo oficial quando configurado; senão, monograma
// provisório tracejado, que nunca imita uma marca real.
const partnerMark = (cls = "") =>
  parceiro.logotipo
    ? `<img class="partner-mark partner-mark--logo ${cls}" src="${esc(parceiro.logotipo)}" alt="" width="40" height="40" />`
    : `<span class="partner-mark ${cls}" aria-hidden="true"><span>${esc(parceiro.sigla)}</span></span>`;

const provisionalTag = () =>
  parceiro.provisorio
    ? `<span class="tag tag--provisional" title="Nome e identidade ilustrativos, usados apenas nesta demonstração">Identidade provisória · demonstração</span>`
    : "";

const wordmark = () => `
  <a class="wordmark" href="./" aria-label="OperumData — início">
    ${operumMark()}
    <span class="wordmark__text"><strong>OperumData</strong><small>Parceiros Brasil</small></span>
  </a>`;

// ---------------------------------------------------------------------------
// Ícones de linha (SVG simples, sem dependências)
// ---------------------------------------------------------------------------

const icon = (paths) =>
  `<svg class="glyph" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${paths}</svg>`;

const glyphs = {
  construcao: icon('<path d="M6 40h36"/><path d="M10 40V22l14-10 14 10v18"/><path class="hot" d="M19 40V28h10v12"/><path d="M24 12V6"/>'),
  oficina: icon('<circle cx="24" cy="24" r="7"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/><circle class="hot" cx="24" cy="24" r="2.5"/>'),
  marcenaria: icon('<path d="M6 34h36v6H6z"/><path d="M12 34V22h24v12"/><path class="hot" d="M18 22l6-12 6 12"/>'),
  energia: icon('<path class="hot" d="M26 6L12 27h11l-3 15 16-22H25z"/>'),
  cozinha: icon('<path d="M8 22h32v6a12 12 0 0 1-12 12h-8A12 12 0 0 1 8 28z"/><path class="hot" d="M17 8c-2 3 2 5 0 8M24 6c-2 3 2 5 0 8M31 8c-2 3 2 5 0 8"/>'),
  outros: icon('<rect x="8" y="8" width="13" height="13"/><rect x="27" y="8" width="13" height="13"/><rect x="8" y="27" width="13" height="13"/><path class="hot" d="M33.5 28v11M28 33.5h11"/>'),
  consentimento: icon('<circle cx="24" cy="15" r="7"/><path d="M10 41c1-8 7-13 14-13s13 5 14 13"/><path class="hot" d="M30 34l4 4 8-9"/>'),
  autorizacao: icon('<rect x="10" y="6" width="28" height="36"/><path d="M16 15h16M16 21h16M16 27h9"/><path class="hot" d="M27 35l3 3 6-7"/>'),
  seguranca: icon('<path d="M10 28a14 14 0 0 1 28 0"/><path d="M6 28h36v5H6z"/><path class="hot" d="M24 14v-4M20 15l2 6M28 15l-2 6"/>'),
  finalidade: icon('<circle cx="24" cy="24" r="16"/><circle cx="24" cy="24" r="9"/><circle class="hot" cx="24" cy="24" r="2.5"/>'),
  contrato: icon('<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8"/><path class="hot" d="M18 26h14M18 32h10"/>'),
  interesse: icon('<path d="M8 10h32v22H22l-8 7v-7H8z"/><path class="hot" d="M17 21h14"/>'),
};

// ---------------------------------------------------------------------------
// Conteúdo
// ---------------------------------------------------------------------------

const nav = [
  ["oportunidade", "Oportunidade"],
  ["como-funciona", "Como funciona"],
  ["quem-conduz", "Quem conduz"],
  ["transparencia", "Transparência"],
  ["perguntas", "Perguntas"],
];

const etapas = [
  {
    fase: "Interesse",
    titulo: "Contato e apresentação da oportunidade",
    texto: "Você envia seu interesse ou recebe nosso contato. Explicamos o programa, o que ele busca e o que se espera de uma empresa participante.",
  },
  {
    fase: "Interesse",
    titulo: "Qualificação preliminar",
    texto: "Conversamos sobre sua empresa, suas atividades, o ambiente de trabalho e a equipe, para entender se há compatibilidade com os requisitos do programa.",
  },
  {
    fase: "Aprovação e contratação",
    titulo: "Requisitos, autorizações e condições comerciais",
    texto: "Se houver perfil, avaliamos em conjunto os requisitos técnicos, as autorizações necessárias e as condições comerciais. Nada é assinado sem que tudo esteja claro.",
  },
  {
    fase: "Preparação",
    titulo: "Preparação para eventual participação",
    texto: "Com a contratação formalizada, planejamos acesso, adequação do ambiente, disponibilidade dos profissionais, segurança e logística.",
  },
  {
    fase: "Início efetivo",
    titulo: "Execução das atividades autorizadas",
    texto: "A captação acontece somente nas atividades autorizadas, conforme o programa contratado, com acompanhamento da coordenação local.",
  },
];

const marcos = [
  ["Interesse inicial", "Você quer conhecer a oportunidade. Não gera obrigação para nenhuma das partes."],
  ["Aprovação", "A empresa e as atividades atendem aos requisitos do programa."],
  ["Contratação", "As condições são aceitas e formalizadas por escrito."],
  ["Início da coleta", "Só depois da contratação e das autorizações necessárias."],
];

const setores = [
  ["construcao", "Construção e manutenção técnica", "Obras, reformas, manutenção predial e serviços técnicos em campo."],
  ["oficina", "Oficinas e reparos", "Mecânica, funilaria, assistência técnica e reparo de equipamentos."],
  ["marcenaria", "Marcenaria e fabricação", "Marcenarias, serralherias, montagem e pequenas linhas de produção."],
  ["energia", "Energia e instalações", "Instalações elétricas, solares, hidráulicas e de climatização."],
  ["cozinha", "Cozinhas e operações profissionais", "Cozinhas industriais, restaurantes, padarias e preparo de alimentos."],
  ["outros", "Outros ambientes compatíveis", "Outras atividades manuais e técnicas, conforme as necessidades específicas de cada programa."],
];

const transparencia = [
  ["consentimento", "Consentimento dos profissionais", "Cada profissional que aparecer em uma gravação precisa concordar de forma apropriada, informada e registrada. Ninguém participa sem saber."],
  ["autorizacao", "Autorização para gravar no local", "A gravação no estabelecimento depende das autorizações cabíveis do responsável pelo local e, quando for o caso, de terceiros."],
  ["seguranca", "Segurança e EPIs", "A operação deve respeitar as normas de segurança da atividade e o uso dos EPIs exigidos. A captação não pode criar risco adicional."],
  ["finalidade", "Finalidade dos dados informada antes", "Para que os dados serão usados e como serão tratados precisa ser informado antes de qualquer participação."],
  ["contrato", "Condições claras antes do compromisso", "Informações contratuais e critérios de remuneração precisam ser esclarecidos antes de qualquer compromisso."],
  ["interesse", "Interesse não é contratação", "Enviar seu interesse não significa aprovação, contratação nem início de qualquer coleta."],
];

const perguntas = [
  [
    "Minha empresa precisa mudar a atividade que realiza?",
    "Não. A proposta envolve atividades que sua empresa já executa. Dependendo dos requisitos do programa, podem ser necessários ajustes pontuais, como organização do espaço, horários combinados ou uso de equipamento de captação. Qualquer ajuste é apresentado e combinado antes de você assumir compromisso.",
  ],
  [
    "Como funciona a remuneração?",
    "Os critérios de remuneração são definidos nas condições de cada programa e apresentados antes de qualquer compromisso. Não há valor fixo divulgado, remuneração automática ou garantia de ganhos: tudo depende da aprovação, da contratação e das atividades efetivamente realizadas.",
  ],
  [
    "Quem autoriza as gravações?",
    "O responsável pelo estabelecimento autoriza a gravação no local, dentro das condições contratadas. Quando a atividade envolve terceiros, como clientes ou espaços de outras empresas, outras autorizações podem ser necessárias.",
  ],
  [
    "Os profissionais precisam concordar?",
    "Sim. A participação de cada profissional exige consentimento apropriado, depois de entender a finalidade e as condições. Um profissional que não concordar não participa da captação.",
  ],
  [
    "A empresa precisa comprar equipamentos?",
    "O que for necessário para a captação é definido pelos requisitos de cada programa e apresentado na fase de avaliação, antes de qualquer compromisso. Nesta etapa, nenhuma compra é necessária.",
  ],
  [
    "O que acontece depois que manifesto interesse?",
    "A OperumData analisa as informações enviadas e, se houver possível compatibilidade, entra em contato para uma conversa de qualificação. Manifestar interesse não gera obrigação, aprovação ou contratação.",
  ],
];

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

// ---------------------------------------------------------------------------
// Blocos
// ---------------------------------------------------------------------------

const sectionHeading = ({ index, label, title, lead = [] }) => `
  <header class="section-heading reveal">
    <div class="section-heading__meta"><span class="section-heading__index">${index}</span><span>${label}</span></div>
    <div>
      <h2>${title}</h2>
      ${lead.map((p) => `<p>${p}</p>`).join("")}
    </div>
  </header>`;

const demoBanner = () =>
  site.demonstracao || parceiro.provisorio
    ? `<div class="demo-banner" role="note">
        <div class="shell demo-banner__inner">
          <span class="demo-banner__label">Versão de demonstração</span>
          <span>${parceiro.provisorio ? `“${esc(parceiro.nome)}” é um nome ilustrativo, não uma empresa confirmada. ` : ""}O cadastro ainda não envia dados.</span>
        </div>
      </div>`
    : "";

const header = () => `
  <header class="site-header">
    <div class="shell site-header__inner">
      ${wordmark()}
      <nav class="desktop-nav" aria-label="Seções da página">
        ${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
      </nav>
      <div class="site-header__actions">
        <a class="btn btn--primary btn--sm header-cta" href="#cadastro">Cadastrar interesse</a>
        <details class="mobile-nav">
          <summary aria-label="Abrir menu"><span class="mobile-nav__bars" aria-hidden="true"><i></i><i></i></span>Menu</summary>
          <nav aria-label="Menu">
            ${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
            <a class="mobile-nav__cta" href="#cadastro">Cadastrar interesse</a>
          </nav>
        </details>
      </div>
    </div>
  </header>`;

const hero = () => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__grid-bg" aria-hidden="true"></div>
    <div class="shell hero__inner">
      <div class="hero__content">
        <p class="eyebrow"><span class="signal-dot" aria-hidden="true"></span>Programa internacional · Empresas brasileiras</p>
        <h1 id="hero-title">O trabalho que sua empresa já realiza pode gerar <em>uma nova fonte de receita.</em></h1>
        <ul class="hero__orgs-inline" aria-label="Organizações">
          <li>${operumMark("hero__orgs-mark")}<span><strong>OperumData</strong>Coordenação e relacionamento no Brasil</span></li>
          <li class="${parceiro.provisorio ? "is-provisional" : ""}">${partnerMark("hero__orgs-mark")}<span><strong>${esc(parceiro.nome)}${parceiro.provisorio ? " <em>(nome ilustrativo)</em>" : ""}</strong>${esc(parceiro.descricaoCurta)}</span></li>
        </ul>
        <p class="hero__lead">A OperumData aproxima empresas brasileiras de oportunidades de participação em programas internacionais de coleta de dados de atividades profissionais reais.</p>
        <p class="hero__lead hero__lead--soft">Conheça as condições de participação e descubra se sua empresa possui o perfil necessário.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="#cadastro">Quero conhecer a oportunidade <span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost btn--lg" href="#como-funciona">Entenda como funciona</a>
        </div>
        <ul class="hero__principles" aria-label="Princípios">
          <li>Atividades reais do seu negócio</li>
          <li>Somente com autorização</li>
          <li>Interesse sem compromisso</li>
        </ul>
      </div>

      <aside class="orgs" aria-label="Quem conduz o programa" data-anim>
        <p class="orgs__title">Quem conduz o programa</p>

        <div class="orgs__node orgs__node--company">
          <span class="orgs__icon" aria-hidden="true">${glyphs.construcao}</span>
          <div><strong>Sua empresa</strong><span>Atividades profissionais reais</span></div>
        </div>

        <div class="orgs__link" aria-hidden="true"><i></i></div>

        <div class="org org--operum">
          ${operumMark("org__mark")}
          <div class="org__body">
            <strong class="org__name">OperumData</strong>
            <span class="org__role">Coordenação e relacionamento no Brasil</span>
          </div>
        </div>

        <div class="orgs__link" aria-hidden="true"><i></i></div>

        <div class="org org--partner${parceiro.provisorio ? " is-provisional" : ""}">
          ${partnerMark("org__mark")}
          <div class="org__body">
            <strong class="org__name">${esc(parceiro.nome)}</strong>
            <span class="org__role">${esc(parceiro.descricaoCurta)}</span>
            ${provisionalTag()}
          </div>
        </div>

        <p class="orgs__caption">Modelo conceitual de responsabilidades. Não representa contrato firmado.</p>
      </aside>
    </div>
  </section>`;

const oportunidade = () => `
  <section class="section" id="oportunidade" aria-labelledby="oportunidade-title">
    <div class="shell">
      ${sectionHeading({
        index: "A",
        label: "A oportunidade",
        title: `<span id="oportunidade-title">Sua operação pode ter valor além dos serviços que já presta.</span>`,
        lead: [
          "Sistemas de inteligência artificial e robótica precisam aprender com trabalho de verdade: mãos, ferramentas, materiais e ambientes reais. Por isso, determinadas atividades profissionais podem ser registradas, mediante autorização, para projetos de desenvolvimento desses sistemas.",
        ],
      })}
      <div class="cards cards--3">
        <article class="card reveal" style="--i:0">
          <span class="card__code">01</span>
          <h3>Atividades que já existem</h3>
          <p>A proposta envolve o trabalho que seu estabelecimento já executa no dia a dia. Não se trata de criar um serviço novo.</p>
        </article>
        <article class="card reveal" style="--i:1">
          <span class="card__code">02</span>
          <h3>Sempre mediante autorização</h3>
          <p>Nada é registrado sem a autorização da empresa e o consentimento dos profissionais envolvidos.</p>
        </article>
        <article class="card reveal" style="--i:2">
          <span class="card__code">03</span>
          <h3>Depende de compatibilidade</h3>
          <p>A participação depende do ambiente, dos profissionais e dos requisitos de cada programa. Nem toda empresa ou atividade será elegível.</p>
        </article>
      </div>
      <p class="note reveal"><strong>Sem promessas automáticas.</strong> Não há remuneração automática nem garantia de aprovação. A captação também pode exigir ajustes pontuais na rotina, que são apresentados e combinados antes de qualquer compromisso.</p>
    </div>
  </section>`;

const comoFunciona = () => `
  <section class="section section--alt" id="como-funciona" aria-labelledby="como-title">
    <div class="shell">
      ${sectionHeading({
        index: "B",
        label: "Como funciona",
        title: `<span id="como-title">Cinco etapas, cada uma com sua decisão.</span>`,
        lead: ["Você avança apenas quando a etapa anterior estiver clara. Manifestar interesse é só o começo da conversa."],
      })}
      <ol class="steps" data-anim>
        ${etapas
          .map(
            (e, i) => `
          <li class="step reveal" style="--i:${i}">
            <div class="step__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</div>
            <div class="step__body">
              <span class="step__phase">${e.fase}</span>
              <h3><span class="sr-only">Etapa ${i + 1}: </span>${e.titulo}</h3>
              <p>${e.texto}</p>
            </div>
          </li>`,
          )
          .join("")}
      </ol>
      <div class="milestones reveal">
        <p class="milestones__title">Quatro momentos diferentes</p>
        <dl class="milestones__list">
          ${marcos.map(([t, d]) => `<div class="milestone"><dt>${t}</dt><dd>${d}</dd></div>`).join("")}
        </dl>
      </div>
    </div>
  </section>`;

const respRows = [
  ["Relacionamento com empresas brasileiras e apresentação da oportunidade", "operum"],
  ["Qualificação preliminar e coordenação operacional local", "operum"],
  ["Acesso, adequação dos ambientes, disponibilidade e logística", "operum"],
  ["Finalidade técnica dos dados e requisitos de captação", "partner"],
  ["Condições contratuais e critérios de remuneração", "partner"],
  ["Autorização no local, consentimento da equipe e segurança da rotina", "company"],
];

const quemConduz = () => {
  const who = { operum: "OperumData", partner: esc(parceiro.nome), company: "Sua empresa" };
  return `
  <section class="section" id="quem-conduz" aria-labelledby="quem-title">
    <div class="shell">
      ${sectionHeading({
        index: "C",
        label: "Quem está por trás do programa",
        title: `<span id="quem-title">Uma coordenação no Brasil. Um programa internacional.</span>`,
        lead: ["Cada organização tem um papel definido. Você sabe com quem fala, quem define as regras e quem acompanha a operação."],
      })}
      <div class="org-panels">
        <article class="org-panel org-panel--operum reveal">
          <header class="org-panel__head">
            ${operumMark("org-panel__mark")}
            <div><span class="org-panel__kicker">Presença local</span><h3>OperumData</h3></div>
          </header>
          <p>Responsável pelo relacionamento com empresas brasileiras, pela apresentação da oportunidade, pela qualificação preliminar e pela preparação e coordenação operacional local.</p>
          <p>Nossa atuação considera acesso aos estabelecimentos, adequação dos ambientes, disponibilidade dos profissionais, autorizações e logística, conforme as exigências de cada programa.</p>
          <p class="org-panel__fact"><span>Base de experiência</span>Experiência operacional por meio do fundador, que atua na coordenação de serviços técnicos e trabalhos de campo desde ${operumdata.experienciaDesde}.</p>
        </article>
        <article class="org-panel org-panel--partner${parceiro.provisorio ? " is-provisional" : ""} reveal" data-parceiro>
          <header class="org-panel__head">
            ${partnerMark("org-panel__mark")}
            <div><span class="org-panel__kicker">Programa internacional</span><h3>${esc(parceiro.nome)}</h3></div>
          </header>
          ${parceiro.apresentacao.map((p) => `<p>${esc(p)}</p>`).join("")}
          ${
            parceiro.provisorio
              ? `<p class="org-panel__notice"><strong>Identidade ilustrativa.</strong> “${esc(parceiro.nome)}” representa, nesta demonstração, a organização responsável pelo programa. Não é uma empresa confirmada e não indica vínculo contratual formalizado. Nome e informações oficiais só serão publicados com autorização e dados verificáveis.</p>`
              : ""
          }
        </article>
      </div>
      <div class="resp reveal">
        <p class="resp__title">Como as responsabilidades se distribuem</p>
        <table class="resp__table">
          <caption class="sr-only">Distribuição de responsabilidades entre sua empresa, OperumData e ${esc(parceiro.nome)}</caption>
          <thead><tr><th scope="col">Responsabilidade</th><th scope="col">Quem responde</th></tr></thead>
          <tbody>
            ${respRows.map(([t, k]) => `<tr><th scope="row">${t}</th><td><span class="who who--${k}">${who[k]}</span></td></tr>`).join("")}
          </tbody>
        </table>
        <p class="resp__note">Referência geral. A divisão definitiva é estabelecida nas condições de cada programa.</p>
      </div>
    </div>
  </section>`;
};

const atividades = () => `
  <section class="section section--alt" id="atividades" aria-labelledby="atividades-title">
    <div class="shell">
      ${sectionHeading({
        index: "D",
        label: "Empresas e atividades",
        title: `<span id="atividades-title">Ambientes profissionais reais, de vários setores.</span>`,
        lead: ["Programas de coleta buscam atividades manuais e técnicas executadas por profissionais em seu ambiente de trabalho."],
      })}
      <ul class="sectors">
        ${setores
          .map(
            ([g, t, d], i) => `
          <li class="sector reveal" style="--i:${i}">
            ${glyphs[g]}
            <h3>${t}</h3>
            <p>${d}</p>
            <span class="sector__bar" aria-hidden="true"></span>
          </li>`,
          )
          .join("")}
      </ul>
      <p class="note reveal">Os setores acima são <strong>exemplos</strong>, não uma lista permanente de elegibilidade. Cada programa define as atividades que procura, e essas necessidades mudam com o tempo.</p>
    </div>
  </section>`;

const transparenciaSec = () => `
  <section class="section" id="transparencia" aria-labelledby="transp-title">
    <div class="shell">
      ${sectionHeading({
        index: "E",
        label: "Segurança, autorização e transparência",
        title: `<span id="transp-title">Regras claras antes de qualquer gravação.</span>`,
        lead: ["Estes são os princípios que orientam a participação. Os procedimentos detalhados de cada programa são apresentados por escrito antes do compromisso."],
      })}
      <ul class="principles">
        ${transparencia
          .map(
            ([g, t, d], i) => `
          <li class="principle reveal" style="--i:${i}">
            ${glyphs[g]}
            <div><h3>${t}</h3><p>${d}</p></div>
          </li>`,
          )
          .join("")}
      </ul>
    </div>
  </section>`;

const field = (label, value, hint) => `
  <div class="cred__row${value ? "" : " is-pending"}">
    <dt>${label}</dt>
    <dd>${value ? esc(value) : `<span class="pending">${PENDENTE}</span>${hint ? `<small>${hint}</small>` : ""}`}</dd>
  </div>`;

const credibilidade = () => {
  const inst = operumdata.institucional;
  const canal = operumdata.contato.whatsapp
    ? `WhatsApp +${operumdata.contato.whatsapp}`
    : operumdata.contato.email || null;
  const v = parceiro.verificacao;
  const partnerVerified = !parceiro.provisorio && v.razaoSocial;
  return `
  <section class="section section--alt" id="credibilidade" aria-labelledby="cred-title">
    <div class="shell">
      ${sectionHeading({
        index: "F",
        label: "Credibilidade institucional",
        title: `<span id="cred-title">Saiba exatamente com quem está falando.</span>`,
        lead: [
          "Antes de qualquer compromisso, você deve poder verificar quem é responsável pelo atendimento e pelo programa. Os dados abaixo são publicados somente quando reais e conferidos.",
        ],
      })}
      <div class="cred">
        <section class="cred__card reveal" aria-labelledby="cred-op">
          <header class="cred__head">${operumMark("cred__mark")}<h3 id="cred-op">OperumData</h3></header>
          <dl>
            ${field("Razão social", inst.razaoSocial, "Entidade efetivamente responsável")}
            ${field("CNPJ", inst.cnpj)}
            ${field("Responsável pelo atendimento", inst.responsavelAtendimento)}
            ${field("Região de atuação no Brasil", inst.regiaoAtuacao)}
            ${field("Canal oficial de comunicação", canal)}
            <div class="cred__row${site.privacidade.publicada ? "" : " is-pending"}">
              <dt>Política de privacidade</dt>
              <dd>${site.privacidade.publicada ? `<a href="privacidade/">Ler a política</a>` : `<span class="pending">${PENDENTE}</span><small><a href="privacidade/">Veja o que ela vai conter</a></small>`}</dd>
            </div>
          </dl>
        </section>
        <section class="cred__card cred__card--partner reveal" aria-labelledby="cred-pt">
          <header class="cred__head">${partnerMark("cred__mark")}<h3 id="cred-pt">${esc(parceiro.nome)}</h3>${provisionalTag()}</header>
          <dl>
            ${field("Identificação verificável", partnerVerified ? v.razaoSocial : null, "Publicada somente com autorização do parceiro")}
            ${field("País de sede", parceiro.provisorio ? null : v.paisSede)}
            ${field("Site oficial", parceiro.provisorio ? null : v.siteOficial)}
            ${field("Registro", parceiro.provisorio ? null : v.registro)}
          </dl>
        </section>
      </div>
      <p class="note reveal"><strong>Por que há campos pendentes?</strong> Preferimos mostrar um campo vazio a publicar uma informação que ainda não foi confirmada. Peça estes dados na conversa de qualificação e confira antes de assinar qualquer documento.</p>
    </div>
  </section>`;
};

const formulario = () => {
  const enabled = Boolean(site.formulario.endpoint);
  const wa = operumdata.contato.whatsapp;
  const email = operumdata.contato.email;
  const alt =
    wa || email
      ? `<p class="form-alt">Prefere falar direto? ${
          wa ? `<a class="btn btn--ghost btn--sm" href="https://wa.me/${esc(wa)}" rel="noopener" target="_blank">Falar pelo WhatsApp</a>` : ""
        } ${email ? `<a class="btn-link" href="mailto:${esc(email)}">${esc(email)}</a>` : ""}</p>`
      : "";
  return `
  <section class="section" id="cadastro" aria-labelledby="cadastro-title">
    <div class="shell form-layout">
      <div class="form-intro reveal">
        <div class="section-heading__meta"><span class="section-heading__index">G</span><span>Cadastro de interesse</span></div>
        <h2 id="cadastro-title">Conte um pouco sobre sua empresa.</h2>
        <p>Com essas informações, a OperumData avalia se há possível compatibilidade e, se houver, entra em contato para uma conversa de qualificação.</p>
        <ul class="form-facts">
          <li>Enviar interesse não significa aprovação ou contratação.</li>
          <li>Nesta etapa não pedimos CPF, documentos de funcionários ou dados bancários.</li>
          <li>Leva cerca de dois minutos.</li>
        </ul>
        ${alt}
      </div>

      <form class="lead-form reveal" id="lead-form" novalidate
        data-endpoint="${enabled ? esc(site.formulario.endpoint) : ""}"
        ${enabled ? `action="${esc(site.formulario.endpoint)}" method="post"` : `aria-describedby="form-status"`}>
        ${
          enabled
            ? ""
            : `<div class="form-status form-status--off" id="form-status" role="note">
                <strong>Envio desativado nesta versão.</strong>
                O recebimento de cadastros ainda não foi configurado. Você pode conferir os campos, mas nenhum dado digitado aqui é enviado ou armazenado.
              </div>`
        }
        <div class="form-grid">
          <div class="fld">
            <label for="f-nome">Nome do responsável <span class="req" aria-hidden="true">*</span></label>
            <input id="f-nome" name="nome" type="text" autocomplete="name" required minlength="3" maxlength="120" aria-describedby="e-nome" />
            <p class="fld__error" id="e-nome" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-empresa">Nome da empresa <span class="req" aria-hidden="true">*</span></label>
            <input id="f-empresa" name="empresa" type="text" autocomplete="organization" required minlength="2" maxlength="160" aria-describedby="e-empresa" />
            <p class="fld__error" id="e-empresa" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-cidade">Cidade <span class="req" aria-hidden="true">*</span></label>
            <input id="f-cidade" name="cidade" type="text" autocomplete="address-level2" required minlength="2" maxlength="80" aria-describedby="e-cidade" />
            <p class="fld__error" id="e-cidade" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-uf">Estado <span class="req" aria-hidden="true">*</span></label>
            <select id="f-uf" name="uf" autocomplete="address-level1" required aria-describedby="e-uf">
              <option value="">Selecione</option>
              ${UFS.map((uf) => `<option value="${uf}">${uf}</option>`).join("")}
            </select>
            <p class="fld__error" id="e-uf" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-ramo">Ramo de atividade <span class="req" aria-hidden="true">*</span></label>
            <select id="f-ramo" name="ramo" required aria-describedby="e-ramo">
              <option value="">Selecione</option>
              ${setores.map(([, t]) => `<option>${t.replace("Outros ambientes compatíveis", "Outro ramo")}</option>`).join("")}
            </select>
            <p class="fld__error" id="e-ramo" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-equipe">Nº aproximado de profissionais <span class="req" aria-hidden="true">*</span></label>
            <select id="f-equipe" name="profissionais" required aria-describedby="e-equipe">
              <option value="">Selecione</option>
              <option>1 a 5</option><option>6 a 20</option><option>21 a 50</option><option>51 a 200</option><option>Mais de 200</option>
            </select>
            <p class="fld__error" id="e-equipe" aria-live="polite"></p>
          </div>
          <div class="fld fld--wide">
            <label for="f-whats">WhatsApp comercial <span class="req" aria-hidden="true">*</span></label>
            <input id="f-whats" name="whatsapp" type="tel" inputmode="tel" autocomplete="tel-national" required placeholder="(11) 91234-5678" aria-describedby="h-whats e-whats" />
            <p class="fld__hint" id="h-whats">Com DDD. Usado apenas para o contato sobre esta oportunidade.</p>
            <p class="fld__error" id="e-whats" aria-live="polite"></p>
          </div>
          <div class="fld fld--wide">
            <label for="f-obs">Observações <span class="opt">(opcional)</span></label>
            <textarea id="f-obs" name="observacoes" rows="4" maxlength="600" aria-describedby="h-obs"></textarea>
            <p class="fld__hint" id="h-obs">Ex.: atividades principais, horários de operação, dúvidas. Não inclua dados pessoais de funcionários.</p>
          </div>
          <div class="fld fld--wide fld--check">
            <input id="f-consent" name="consentimento" type="checkbox" required aria-describedby="e-consent" />
            <label for="f-consent">Autorizo a OperumData a entrar em contato comercial pelo WhatsApp informado para tratar desta oportunidade, e declaro que li a <a href="privacidade/">política de privacidade</a>. <span class="req" aria-hidden="true">*</span></label>
            <p class="fld__error" id="e-consent" aria-live="polite"></p>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--primary btn--lg" type="submit" ${enabled ? "" : `disabled aria-disabled="true"`}>${enabled ? "Enviar interesse" : "Envio indisponível nesta versão"}</button>
          <p class="form-actions__note">Campos com <span class="req">*</span> são obrigatórios.</p>
        </div>
        <div class="form-result" id="form-result" role="status" aria-live="polite" hidden></div>
      </form>
    </div>
  </section>`;
};

const faq = () => `
  <section class="section section--alt" id="perguntas" aria-labelledby="faq-title">
    <div class="shell faq-layout">
      ${sectionHeading({
        index: "H",
        label: "Perguntas frequentes",
        title: `<span id="faq-title">Dúvidas comuns de quem tem uma empresa.</span>`,
      })}
      <div class="faq">
        ${perguntas
          .map(
            ([q, a]) => `
          <details class="faq__item reveal">
            <summary><span>${q}</span><i aria-hidden="true"></i></summary>
            <p>${a}</p>
          </details>`,
          )
          .join("")}
      </div>
    </div>
  </section>`;

const ctaFinal = () => `
  <section class="cta-final" aria-labelledby="cta-title">
    <div class="shell cta-final__inner reveal">
      <p class="eyebrow"><span class="signal-dot" aria-hidden="true"></span>Próximo passo</p>
      <h2 id="cta-title">Sua empresa pode fazer parte de novas oportunidades.</h2>
      <p>Converse com a OperumData para entender se o seu negócio tem o perfil do programa. Uma conversa de qualificação, sem pressão comercial e sem promessa de ganhos.</p>
      <div class="hero__actions">
        <a class="btn btn--primary btn--lg" href="#cadastro">Quero conhecer a oportunidade <span class="btn__arrow" aria-hidden="true">→</span></a>
        <a class="btn btn--ghost btn--lg" href="#perguntas">Ver perguntas frequentes</a>
      </div>
    </div>
  </section>`;

const footer = (prefix = "") => `
  <footer class="site-footer">
    <div class="shell site-footer__inner">
      <div class="site-footer__brand">
        <a class="wordmark" href="${prefix || "./"}" aria-label="OperumData — início">${operumMark()}<span class="wordmark__text"><strong>OperumData</strong><small>Parceiros Brasil</small></span></a>
        <p>${esc(operumdata.papel)}.</p>
      </div>
      <nav aria-label="Rodapé">
        ${nav.map(([id, label]) => `<a href="${prefix}#${id}">${label}</a>`).join("")}
        <a href="${prefix}privacidade/">Privacidade</a>
      </nav>
      <div class="site-footer__legal">
        ${parceiro.provisorio ? `<p>“${esc(parceiro.nome)}” é um nome ilustrativo usado nesta demonstração. Não representa empresa confirmada nem parceria contratada.</p>` : ""}
        <p>Diagramas e ícones são ilustrativos. Esta página não usa cookies nem recursos de terceiros.</p>
        <p>© ${new Date().getFullYear()} OperumData.</p>
      </div>
    </div>
  </footer>`;

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

const TITLE = "OperumData | Parceiros Brasil — receita adicional com o trabalho que sua empresa já realiza";
const DESCRIPTION =
  "A OperumData aproxima empresas brasileiras de programas internacionais de coleta de dados de atividades profissionais reais. Conheça as condições e veja se sua empresa tem o perfil.";

const doc = ({ base, title, description, canonical, body }) => `<!doctype html>
<html lang="pt-BR">
<head>
<meta charset="utf-8" />
<meta name="viewport" content="width=device-width, initial-scale=1" />
<title>${esc(title)}</title>
<meta name="description" content="${esc(description)}" />
${site.demonstracao || parceiro.provisorio ? `<meta name="robots" content="noindex, nofollow" />` : ""}
<link rel="canonical" href="${esc(canonical)}" />
<meta name="theme-color" content="#050506" />
<meta property="og:type" content="website" />
<meta property="og:locale" content="pt_BR" />
<meta property="og:site_name" content="OperumData" />
<meta property="og:title" content="${esc(title)}" />
<meta property="og:description" content="${esc(description)}" />
<meta property="og:url" content="${esc(canonical)}" />
<link rel="icon" href="${base}assets/favicon.svg" type="image/svg+xml" />
<link rel="preload" href="${base}assets/fonts/urw-gothic-demi.otf" as="font" type="font/otf" crossorigin />
<link rel="stylesheet" href="${base}assets/site.css" />
<script>document.documentElement.classList.add("js");setTimeout(function(){if(!window.__operum)document.documentElement.classList.remove("js")},2500)</script>
</head>
<body>
<a class="skip-link" href="#conteudo">Ir para o conteúdo</a>
<div class="site">
${body}
</div>
<script src="${base}assets/site.js" defer></script>
</body>
</html>
`;

export function renderIndex() {
  return doc({
    base: "",
    title: TITLE,
    description: DESCRIPTION,
    canonical: site.url,
    body: `${demoBanner()}
${header()}
<main id="conteudo">
${hero()}
${oportunidade()}
${comoFunciona()}
${quemConduz()}
${atividades()}
${transparenciaSec()}
${credibilidade()}
${formulario()}
${faq()}
${ctaFinal()}
</main>
${footer()}`,
  });
}

export function renderPrivacy() {
  const inst = operumdata.institucional;
  const responsavel = inst.razaoSocial && inst.cnpj ? `${esc(inst.razaoSocial)}, CNPJ ${esc(inst.cnpj)}` : null;
  return doc({
    base: "../",
    title: "Política de privacidade | OperumData Parceiros Brasil",
    description: "Situação da política de privacidade da página OperumData Parceiros Brasil.",
    canonical: `${site.url}privacidade/`,
    body: `${demoBanner()}
<header class="site-header">
  <div class="shell site-header__inner site-header__inner--simple">
    <a class="wordmark" href="../" aria-label="OperumData — início">${operumMark()}<span class="wordmark__text"><strong>OperumData</strong><small>Parceiros Brasil</small></span></a>
    <a class="btn btn--ghost btn--sm" href="../">← Voltar à página</a>
  </div>
</header>
<main id="conteudo" class="legal">
  <div class="shell legal__inner">
    <p class="eyebrow"><span class="signal-dot" aria-hidden="true"></span>Privacidade</p>
    <h1>Política de privacidade</h1>
    <div class="form-status form-status--off" role="note">
      <strong>Política em preparação.</strong> A política completa será publicada antes da ativação do cadastro de interesse.
    </div>

    <h2>O que acontece hoje</h2>
    <p>Nesta versão de demonstração, o formulário de cadastro está desativado: nenhum dado digitado é enviado ou armazenado. A página não usa cookies, ferramentas de análise nem recursos de terceiros, e não guarda informações no seu navegador.</p>

    <h2>O que a política vai informar</h2>
    <p>Antes de qualquer coleta de dados de contato, esta página vai identificar, conforme a Lei Geral de Proteção de Dados (Lei nº 13.709/2018):</p>
    <ul>
      <li>o controlador dos dados: ${responsavel || `<span class="pending">Pendente</span> (razão social e CNPJ da entidade responsável)`};</li>
      <li>quais dados são coletados no cadastro e por quê;</li>
      <li>a finalidade do uso, limitada ao contato comercial sobre esta oportunidade;</li>
      <li>a base legal do tratamento;</li>
      <li>com quem os dados podem ser compartilhados, incluindo a organização responsável pelo programa internacional, quando aplicável;</li>
      <li>por quanto tempo os dados ficam guardados;</li>
      <li>como exercer seus direitos de acesso, correção e exclusão;</li>
      <li>o canal de contato do encarregado pelo tratamento de dados.</li>
    </ul>

    <h2>O que não coletamos nesta etapa</h2>
    <p>O cadastro de interesse não pede CPF, documentos de funcionários ou dados bancários.</p>

    <h2>Dados de gravações</h2>
    <p>Gravações de atividades profissionais não fazem parte deste cadastro. A finalidade e as condições de tratamento desses dados são informadas separadamente, antes de qualquer participação, e dependem do consentimento dos profissionais envolvidos.</p>
  </div>
</main>
${footer("../")}`,
  });
}
