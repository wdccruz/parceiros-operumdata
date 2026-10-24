// Renderiza as páginas estáticas a partir dos arquivos de configuração.
// Todo o texto é português. Links internos e assets usam caminhos RELATIVOS,
// para funcionar tanto em /parceiros-operumdata/ quanto em um subdomínio próprio.
//
// Direção editorial: peça comercial, curta e direta. Ressalvas concentradas
// na seção de confiança, no FAQ e no formulário. Visuais de captação sempre
// com equipamento dedicado (capacete, peito, suporte), nunca celular.

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

// Logotipo oficial quando configurado; senão, monograma provisório tracejado.
const partnerMark = (cls = "") =>
  parceiro.logotipo
    ? `<img class="partner-mark partner-mark--logo ${cls}" src="${esc(parceiro.logotipo)}" alt="" width="40" height="40" />`
    : `<span class="partner-mark ${cls}" aria-hidden="true"><span>${esc(parceiro.sigla)}</span></span>`;

const provisionalTag = (texto = "Nome ilustrativo") =>
  parceiro.provisorio
    ? `<span class="tag tag--provisional" title="Nome e identidade ilustrativos, usados apenas nesta demonstração">${texto}</span>`
    : "";

const wordmarkInner = () =>
  `${operumMark()}<span class="wordmark__text"><strong>OperumData</strong><small>Parceiros Brasil</small></span>`;

// ---------------------------------------------------------------------------
// Ícones de linha
// ---------------------------------------------------------------------------

const icon = (paths) =>
  `<svg class="glyph" viewBox="0 0 48 48" aria-hidden="true" focusable="false">${paths}</svg>`;

const glyphs = {
  construcao: icon('<path d="M6 40h36"/><path d="M10 40V22l14-10 14 10v18"/><path class="hot" d="M19 40V28h10v12"/>'),
  oficina: icon('<circle cx="24" cy="24" r="7"/><path d="M24 6v6M24 36v6M6 24h6M36 24h6M11.3 11.3l4.2 4.2M32.5 32.5l4.2 4.2M11.3 36.7l4.2-4.2M32.5 15.5l4.2-4.2"/><circle class="hot" cx="24" cy="24" r="2.5"/>'),
  marcenaria: icon('<path d="M6 34h36v6H6z"/><path d="M12 34V22h24v12"/><path class="hot" d="M18 22l6-12 6 12"/>'),
  energia: icon('<path class="hot" d="M26 6L12 27h11l-3 15 16-22H25z"/>'),
  cozinha: icon('<path d="M8 22h32v6a12 12 0 0 1-12 12h-8A12 12 0 0 1 8 28z"/><path class="hot" d="M17 8c-2 3 2 5 0 8M24 6c-2 3 2 5 0 8M31 8c-2 3 2 5 0 8"/>'),
  outros: icon('<rect x="8" y="8" width="13" height="13"/><rect x="27" y="8" width="13" height="13"/><rect x="8" y="27" width="13" height="13"/><path class="hot" d="M33.5 28v11M28 33.5h11"/>'),
  autorizacao: icon('<rect x="10" y="6" width="28" height="36"/><path d="M16 15h16M16 21h16M16 27h9"/><path class="hot" d="M27 35l3 3 6-7"/>'),
  consentimento: icon('<circle cx="24" cy="15" r="7"/><path d="M10 41c1-8 7-13 14-13s13 5 14 13"/><path class="hot" d="M30 34l4 4 8-9"/>'),
  seguranca: icon('<path d="M10 28a14 14 0 0 1 28 0"/><path d="M6 28h36v5H6z"/><path class="hot" d="M24 14v-4"/>'),
  contrato: icon('<path d="M12 6h18l8 8v28H12z"/><path d="M30 6v8h8"/><path class="hot" d="M18 26h14M18 32h10"/>'),
};

// ---------------------------------------------------------------------------
// Visual principal: console de captura (representação ilustrativa)
// Vista do ponto de vista de uma câmera de capacete sobre uma bancada,
// com marcação de mãos, ferramenta e peça (estruturação dos dados).
// ---------------------------------------------------------------------------

// Pontos de referência de uma mão (21 pontos, padrão de visão computacional).
const HAND = [
  [0, 0],
  [-16, -10], [-28, -22], [-36, -34], [-42, -44],
  [-10, -40], [-12, -58], [-13, -70], [-14, -80],
  [0, -42], [0, -62], [0, -75], [0, -86],
  [10, -40], [12, -57], [13, -69], [14, -78],
  [18, -34], [22, -47], [24, -57], [26, -65],
];
const HAND_LINKS = [
  [0, 1], [1, 2], [2, 3], [3, 4],
  [0, 5], [5, 6], [6, 7], [7, 8],
  [9, 10], [10, 11], [11, 12],
  [13, 14], [14, 15], [15, 16],
  [0, 17], [17, 18], [18, 19], [19, 20],
  [5, 9], [9, 13], [13, 17],
];

function handSkeleton(cx, cy, deg, scale, mirror, cls) {
  const r = (deg * Math.PI) / 180;
  const pts = HAND.map(([x, y]) => {
    const mx = (mirror ? -x : x) * scale;
    const my = y * scale;
    return [cx + mx * Math.cos(r) - my * Math.sin(r), cy + mx * Math.sin(r) + my * Math.cos(r)].map((v) => Math.round(v * 10) / 10);
  });
  const lines = HAND_LINKS.map(([a, b]) => `M${pts[a][0]} ${pts[a][1]}L${pts[b][0]} ${pts[b][1]}`).join("");
  const dots = pts.map(([x, y], i) => `<circle cx="${x}" cy="${y}" r="${i === 0 ? 3.4 : 2.4}"/>`).join("");
  return `<g class="kp ${cls}"><path d="${lines}"/>${dots}</g>`;
}

const captureConsole = () => `
  <figure class="console" aria-labelledby="console-cap" data-anim>
    <div class="console__bar" aria-hidden="true">
      <span><i class="console__rec"></i>Cam 01 · Capacete</span>
      <span class="console__tc" data-timecode>00:14:32</span>
    </div>
    <div class="console__view">
      <svg class="console__scene" viewBox="0 0 560 380" role="img" aria-label="Vista de uma câmera de capacete sobre uma bancada de trabalho, com mãos, ferramenta e peça identificadas.">
        <defs>
          <linearGradient id="cs-bg" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="#17140f"/><stop offset="1" stop-color="#0b0a08"/></linearGradient>
          <linearGradient id="cs-wood" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#3a2a1a"/><stop offset="0.5" stop-color="#4a3522"/><stop offset="1" stop-color="#36271a"/></linearGradient>
          <linearGradient id="cs-metal" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#8d949e"/><stop offset="1" stop-color="#4a4f57"/></linearGradient>
          <radialGradient id="cs-vig" cx="0.5" cy="0.5" r="0.75"><stop offset="0.55" stop-color="#000" stop-opacity="0"/><stop offset="1" stop-color="#000" stop-opacity="0.75"/></radialGradient>
        </defs>
        <rect width="560" height="380" fill="url(#cs-bg)"/>
        <g opacity="0.9">
          <rect x="40" y="150" width="480" height="150" fill="url(#cs-wood)" transform="rotate(-4 280 225)"/>
          <path d="M44 190C180 184 330 178 516 166M46 222C190 214 330 208 518 196M48 258C200 250 340 242 520 232" stroke="#5a4229" stroke-width="2" fill="none" opacity="0.6" transform="rotate(-4 280 225)"/>
          <rect x="230" y="190" width="120" height="44" rx="3" fill="url(#cs-metal)" transform="rotate(-4 290 212)"/>
          <circle cx="262" cy="211" r="6" fill="#2a2d33"/><circle cx="318" cy="207" r="6" fill="#2a2d33"/>
          <rect x="372" y="118" width="26" height="120" rx="8" fill="#20232a" transform="rotate(32 385 178)"/>
          <rect x="378" y="96" width="14" height="40" rx="3" fill="#9aa1ab" transform="rotate(32 385 178)"/>
        </g>
        <rect width="560" height="380" fill="url(#cs-vig)"/>

        <g class="bbox bbox--part"><rect x="222" y="176" width="140" height="66"/><text x="222" y="170">PEÇA</text></g>
        <g class="bbox bbox--tool"><rect x="350" y="96" width="92" height="150"/><text x="350" y="90">FERRAMENTA</text></g>
        <g class="bbox bbox--hand"><rect x="150" y="178" width="100" height="116"/><text x="150" y="312">MÃO ESQUERDA</text></g>
        <g class="bbox bbox--hand"><rect x="318" y="150" width="110" height="122"/><text x="318" y="290">MÃO DIREITA</text></g>

        ${handSkeleton(198, 290, 28, 1.05, true, "kp--left")}
        ${handSkeleton(372, 262, -14, 1.05, false, "kp--right")}

        <g class="reticle" aria-hidden="true"><path d="M16 36V16h20M524 16h20v20M544 344v20h-20M36 364H16v-20"/></g>
      </svg>
      <ul class="console__tags" aria-hidden="true">
        <li>Ação: montagem</li>
        <li>Etapa 3 de 5</li>
      </ul>
    </div>
    <div class="console__timeline" aria-hidden="true">
      <div class="console__segments"><span>Preparo</span><span>Corte</span><span class="is-on">Montagem</span><span>Acabamento</span></div>
      <i class="console__head"></i>
    </div>
    <figcaption id="console-cap">Representação ilustrativa de captura com câmera de capacete e estruturação dos registros.</figcaption>
  </figure>`;

// Câmera de captura dedicada (render de produto, ilustrativo).
const cameraRender = () => `
  <svg class="cam-render" viewBox="0 0 320 260" role="img" aria-label="Câmera compacta de captura com suporte para capacete">
    <defs>
      <linearGradient id="cr-body" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#3a3e46"/><stop offset="0.45" stop-color="#1c1f24"/><stop offset="1" stop-color="#0d0e11"/></linearGradient>
      <linearGradient id="cr-edge" x1="0" y1="0" x2="1" y2="0"><stop offset="0" stop-color="#5a606b"/><stop offset="1" stop-color="#2a2e35"/></linearGradient>
      <radialGradient id="cr-glass" cx="0.38" cy="0.35" r="0.7"><stop offset="0" stop-color="#3b4a63"/><stop offset="0.45" stop-color="#121722"/><stop offset="1" stop-color="#05060a"/></radialGradient>
      <linearGradient id="cr-mount" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b2f36"/><stop offset="1" stop-color="#121418"/></linearGradient>
    </defs>
    <ellipse cx="160" cy="236" rx="120" ry="10" fill="#000" opacity="0.55"/>
    <path d="M128 176h64l10 44h-84z" fill="url(#cr-mount)" stroke="#3a3f49"/>
    <rect x="112" y="214" width="96" height="12" rx="3" fill="#1a1d22" stroke="#3a3f49"/>
    <circle cx="160" cy="194" r="7" fill="#0b0c0e" stroke="#5a606b"/>
    <rect x="60" y="56" width="200" height="128" rx="18" fill="url(#cr-edge)"/>
    <rect x="64" y="60" width="192" height="120" rx="15" fill="url(#cr-body)"/>
    <path d="M78 66h164" stroke="#ffffff" stroke-opacity="0.12" stroke-width="2" stroke-linecap="round"/>
    <rect x="76" y="78" width="46" height="18" rx="3" fill="#0a0b0d" stroke="#2f333b"/>
    <circle class="cam-render__led" cx="88" cy="87" r="4"/>
    <rect x="98" y="84" width="16" height="6" rx="1" fill="#2a2e35"/>
    <rect x="216" y="44" width="30" height="14" rx="3" fill="#2a2e35" stroke="#3a3f49"/>
    <circle cx="190" cy="120" r="50" fill="#0a0b0e" stroke="#3a3f49" stroke-width="2"/>
    <circle cx="190" cy="120" r="40" fill="#15181d" stroke="#ff5a1f" stroke-width="2"/>
    <circle cx="190" cy="120" r="30" fill="url(#cr-glass)"/>
    <circle cx="190" cy="120" r="12" fill="#04050a"/>
    <ellipse cx="178" cy="108" rx="9" ry="6" fill="#ffffff" opacity="0.18"/>
    <circle cx="198" cy="128" r="3" fill="#ffffff" opacity="0.08"/>
    <path d="M76 112v52M84 112v52M92 112v52M100 112v52" stroke="#2c3037" stroke-width="3" stroke-linecap="round"/>
    <circle cx="190" cy="120" r="45" fill="none" stroke="#5a606b" stroke-width="1" stroke-dasharray="1 5"/>
    <circle cx="246" cy="168" r="2.5" fill="#3a3f49"/><circle cx="74" cy="168" r="2.5" fill="#3a3f49"/>
  </svg>`;

// ---------------------------------------------------------------------------
// Conteúdo
// ---------------------------------------------------------------------------

const nav = [
  ["oportunidade", "Oportunidade"],
  ["como-acontece", "Como acontece"],
  ["quem-conduz", "Quem está por trás"],
  ["confianca", "Confiança"],
  ["perguntas", "Perguntas"],
];

const setores = [
  ["construcao", "Construção e manutenção"],
  ["oficina", "Oficinas e reparos"],
  ["marcenaria", "Marcenaria e fabricação"],
  ["energia", "Energia e instalações"],
  ["cozinha", "Cozinhas profissionais"],
  ["outros", "Outros ambientes"],
];

const fluxo = [
  ["Atividade real", "Sua equipe trabalha normalmente, no ambiente de sempre."],
  ["Captura dedicada", "Câmeras de capacete, peito ou suporte fixo. Não é celular."],
  ["Estruturação", "Os registros são organizados e rotulados conforme o protocolo."],
  ["Aplicação", "Os dados apoiam o desenvolvimento de sistemas de IA e robótica."],
];

const etapas = [
  ["Contato", "Apresentação da oportunidade"],
  ["Qualificação", "Perfil da empresa e das atividades"],
  ["Condições", "Requisitos, autorizações e proposta"],
  ["Preparação", "Ambiente, equipe e logística"],
  ["Início", "Captação das atividades autorizadas"],
];

const confianca = [
  ["autorizacao", "Autorização da empresa", "Nada é registrado sem a autorização do responsável pelo local."],
  ["consentimento", "Consentimento da equipe", "Cada profissional decide se participa, depois de entender a finalidade."],
  ["seguranca", "Segurança e EPIs", "A rotina segura e os EPIs exigidos vêm antes de qualquer captação."],
  ["contrato", "Tudo por escrito antes", "Finalidade dos dados, condições e remuneração apresentadas antes do compromisso."],
];

const perguntas = [
  [
    "Minha empresa precisa mudar a atividade que realiza?",
    "Não. A proposta envolve atividades que sua empresa já executa. Podem ser necessários ajustes pontuais, como organização do espaço ou horários combinados, sempre apresentados antes de qualquer compromisso.",
  ],
  [
    "Como funciona a remuneração?",
    "Os critérios são definidos nas condições de cada programa e apresentados por escrito antes do compromisso. Não há valor fixo divulgado nem remuneração automática.",
  ],
  [
    "Existe garantia de aprovação ou de ganhos?",
    "Não. A participação depende da compatibilidade do ambiente, dos profissionais e dos requisitos do programa. Por isso a primeira etapa é uma conversa de qualificação.",
  ],
  [
    "Quem autoriza as gravações?",
    "O responsável pelo estabelecimento, dentro das condições contratadas. Quando houver terceiros envolvidos, outras autorizações podem ser necessárias.",
  ],
  [
    "Os profissionais precisam concordar?",
    "Sim. Cada profissional precisa dar consentimento apropriado, depois de entender a finalidade e as condições. Quem não concordar não participa.",
  ],
  [
    "A empresa precisa comprar equipamentos?",
    "Não nesta etapa. O equipamento de captura e o protocolo são definidos pelos requisitos de cada programa e apresentados na fase de avaliação.",
  ],
  [
    "O que acontece depois que manifesto interesse?",
    "A OperumData analisa as informações e, se houver possível compatibilidade, entra em contato para uma conversa de qualificação. Manifestar interesse não gera obrigação, aprovação nem contratação.",
  ],
  [
    `${esc(parceiro.nome)} é a empresa responsável pelo programa?`,
    parceiro.provisorio
      ? `Nesta versão de demonstração, “${esc(parceiro.nome)}” é um nome ilustrativo que representa a organização internacional responsável pelo programa. Não é uma empresa confirmada e não indica contrato firmado. O nome oficial será informado com autorização e dados verificáveis.`
      : `Sim. ${esc(parceiro.nome)} é a organização internacional responsável pelo programa, pelos requisitos técnicos e pelas condições contratuais.`,
  ],
];

const UFS = "AC AL AP AM BA CE DF ES GO MA MT MS MG PA PB PR PE PI RJ RN RS RO RR SC SP SE TO".split(" ");

// ---------------------------------------------------------------------------
// Blocos
// ---------------------------------------------------------------------------

const heading = ({ kicker, title, id, lead }) => `
  <header class="heading reveal">
    <p class="kicker">${kicker}</p>
    <h2 id="${id}">${title}</h2>
    ${lead ? `<p class="heading__lead">${lead}</p>` : ""}
  </header>`;

const demoBanner = () =>
  site.demonstracao || parceiro.provisorio
    ? `<div class="demo-banner" role="note"><div class="shell demo-banner__inner"><span class="demo-banner__label">Demonstração</span><span>${
        parceiro.provisorio ? `“${esc(parceiro.nome)}” é um nome ilustrativo. ` : ""
      }O cadastro ainda não envia dados.</span></div></div>`
    : "";

const header = () => `
  <header class="site-header">
    <div class="shell site-header__inner">
      <a class="wordmark" href="./" aria-label="OperumData — início">${wordmarkInner()}</a>
      <nav class="desktop-nav" aria-label="Seções da página">
        ${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
      </nav>
      <div class="site-header__actions">
        <a class="btn btn--primary btn--sm header-cta" href="#cadastro">Quero conversar</a>
        <details class="mobile-nav">
          <summary aria-label="Abrir menu"><span class="mobile-nav__bars" aria-hidden="true"><i></i><i></i></span>Menu</summary>
          <nav aria-label="Menu">
            ${nav.map(([id, label]) => `<a href="#${id}">${label}</a>`).join("")}
            <a class="mobile-nav__cta" href="#cadastro">Quero conversar</a>
          </nav>
        </details>
      </div>
    </div>
  </header>`;

const hero = () => `
  <section class="hero" aria-labelledby="hero-title">
    <div class="hero__glow" aria-hidden="true"></div>
    <div class="shell hero__inner">
      <div class="hero__content">
        <p class="kicker"><span class="signal-dot" aria-hidden="true"></span>Programa internacional de coleta de dados</p>
        <h1 id="hero-title">O trabalho que sua empresa já realiza pode gerar <em>uma nova fonte de receita.</em></h1>
        <p class="hero__lead">A OperumData conecta empresas brasileiras a programas internacionais de coleta de dados de atividades profissionais reais.</p>
        <div class="hero__actions">
          <a class="btn btn--primary btn--lg" href="#cadastro">Quero conhecer a oportunidade <span class="btn__arrow" aria-hidden="true">→</span></a>
          <a class="btn btn--ghost btn--lg" href="#como-acontece">Entenda como funciona</a>
        </div>
        <div class="duo" aria-label="Organizações envolvidas">
          <div class="duo__item duo__item--operum">
            ${operumMark("duo__mark")}
            <div><strong>OperumData</strong><span>Coordenação e relacionamento no Brasil</span></div>
          </div>
          <div class="duo__item duo__item--partner${parceiro.provisorio ? " is-provisional" : ""}">
            ${partnerMark("duo__mark")}
            <div><strong>${esc(parceiro.nome)} ${provisionalTag()}</strong><span>${esc(parceiro.descricaoCurta)}</span></div>
          </div>
        </div>
      </div>
      <div class="hero__visual">${captureConsole()}</div>
    </div>
    <div class="shell">
      <ul class="pillars">
        <li><strong>Seu trabalho de sempre</strong><span>Atividades que sua equipe já executa</span></li>
        <li><strong>Captação profissional</strong><span>Equipamento dedicado e protocolo definido</span></li>
        <li><strong>Coordenação local</strong><span>A OperumData acompanha cada etapa</span></li>
      </ul>
    </div>
  </section>`;

const oportunidade = () => `
  <section class="section" id="oportunidade" aria-labelledby="oportunidade-title">
    <div class="shell split">
      ${heading({
        kicker: "A oportunidade",
        id: "oportunidade-title",
        title: "Trabalho real virou matéria-prima da tecnologia.",
        lead: "Sistemas de IA e robótica aprendem com profissionais em ação. Atividades que sua equipe já realiza podem ser registradas, com autorização, e gerar receita adicional para a empresa.",
      })}
      <div class="sectors reveal">
        <ul class="sectors__grid">
          ${setores.map(([g, t]) => `<li>${glyphs[g]}<span>${t}</span></li>`).join("")}
        </ul>
        <p class="sectors__note">Setores de exemplo. Outros ambientes podem ser avaliados.</p>
      </div>
    </div>
  </section>`;

const comoAcontece = () => `
  <section class="section section--alt" id="como-acontece" aria-labelledby="como-title">
    <div class="shell">
      ${heading({
        kicker: "Como acontece",
        id: "como-title",
        title: "Captação profissional, no seu ambiente.",
      })}
      <div class="capture">
        <div class="capture__device reveal">
          ${cameraRender()}
          <p class="capture__device-label">Equipamento de captura dedicado</p>
          <ul class="capture__mounts">
            <li>Capacete</li><li>Peito</li><li>Suporte fixo</li>
          </ul>
        </div>
        <ol class="flow" data-anim>
          ${fluxo
            .map(
              ([t, d], i) => `
            <li class="flow__step reveal" style="--i:${i}">
              <span class="flow__num" aria-hidden="true">${String(i + 1).padStart(2, "0")}</span>
              <div><h3>${t}</h3><p>${d}</p></div>
            </li>`,
            )
            .join("")}
        </ol>
      </div>
      <div class="journey reveal">
        <p class="journey__title">Do primeiro contato ao início</p>
        <ol class="journey__steps">
          ${etapas.map(([t, d], i) => `<li style="--i:${i}"><strong>${t}</strong><span>${d}</span></li>`).join("")}
        </ol>
      </div>
    </div>
  </section>`;

const quemConduz = () => `
  <section class="section" id="quem-conduz" aria-labelledby="quem-title">
    <div class="shell">
      ${heading({
        kicker: "Quem está por trás",
        id: "quem-title",
        title: "Coordenação no Brasil. Programa internacional.",
      })}
      <div class="org-panels">
        <article class="org-panel org-panel--operum reveal">
          <header class="org-panel__head">
            ${operumMark("org-panel__mark")}
            <div><span class="org-panel__kicker">Presença local</span><h3>OperumData</h3></div>
          </header>
          <ul class="org-panel__list">
            <li>Relacionamento com empresas brasileiras</li>
            <li>Qualificação e preparação de cada participação</li>
            <li>Coordenação de campo: acesso, equipe, autorizações e logística</li>
          </ul>
          <p class="org-panel__fact">Fundador atua na coordenação de serviços técnicos e trabalhos de campo desde ${operumdata.experienciaDesde}.</p>
        </article>
        <article class="org-panel org-panel--partner${parceiro.provisorio ? " is-provisional" : ""} reveal" data-parceiro>
          <header class="org-panel__head">
            ${partnerMark("org-panel__mark")}
            <div><span class="org-panel__kicker">Programa internacional</span><h3>${esc(parceiro.nome)}</h3></div>
            ${provisionalTag()}
          </header>
          <ul class="org-panel__list">
            ${parceiro.responsabilidades.map((r) => `<li>${esc(r)}</li>`).join("")}
          </ul>
          ${
            parceiro.provisorio
              ? `<p class="org-panel__notice">Identidade ilustrativa desta demonstração. Não indica empresa confirmada nem contrato firmado.</p>`
              : ""
          }
        </article>
      </div>
    </div>
  </section>`;

const field = (label, value) => `
  <div class="cred__row"><dt>${label}</dt><dd>${value ? esc(value) : `<span class="pending">${PENDENTE}</span>`}</dd></div>`;

const confiancaSec = () => {
  const inst = operumdata.institucional;
  const canal = operumdata.contato.whatsapp ? `WhatsApp +${operumdata.contato.whatsapp}` : operumdata.contato.email || null;
  const v = parceiro.verificacao;
  return `
  <section class="section section--alt" id="confianca" aria-labelledby="confianca-title">
    <div class="shell">
      ${heading({
        kicker: "Confiança",
        id: "confianca-title",
        title: "Regras claras antes de qualquer compromisso.",
      })}
      <div class="trust">
        <ul class="trust__grid">
          ${confianca
            .map(
              ([g, t, d], i) => `
            <li class="reveal" style="--i:${i}">${glyphs[g]}<h3>${t}</h3><p>${d}</p></li>`,
            )
            .join("")}
        </ul>
        <section class="cred reveal" id="credibilidade" aria-labelledby="cred-title">
          <header class="cred__head">${operumMark("cred__mark")}<h3 id="cred-title">Dados institucionais</h3></header>
          <dl>
            ${field("Razão social", inst.razaoSocial)}
            ${field("CNPJ", inst.cnpj)}
            ${field("Atendimento", inst.responsavelAtendimento)}
            ${field("Região de atuação", inst.regiaoAtuacao)}
            ${field("Canal oficial", canal)}
            <div class="cred__row"><dt>Privacidade</dt><dd><a href="privacidade/">${site.privacidade.publicada ? "Política de privacidade" : "Política em preparação"}</a></dd></div>
            ${field(`Programa internacional`, !parceiro.provisorio && v.razaoSocial ? v.razaoSocial : null)}
          </dl>
          <p class="cred__note">Campos pendentes são publicados somente com dados reais e conferidos.</p>
        </section>
      </div>
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
  <section class="section section--form" id="cadastro" aria-labelledby="cadastro-title">
    <div class="shell form-layout">
      <div class="form-intro reveal">
        <p class="kicker">Próximo passo</p>
        <h2 id="cadastro-title">Vamos conversar sobre a sua empresa.</h2>
        <p>Conte o básico. Se houver perfil, a OperumData entra em contato para uma conversa de qualificação.</p>
        <ul class="form-facts">
          <li>Sem compromisso</li>
          <li>Sem CPF, documentos ou dados bancários</li>
          <li>Cerca de dois minutos</li>
        </ul>
        ${alt}
      </div>

      <form class="lead-form reveal" id="lead-form" novalidate
        data-endpoint="${enabled ? esc(site.formulario.endpoint) : ""}"
        ${enabled ? `action="${esc(site.formulario.endpoint)}" method="post"` : `aria-describedby="form-status"`}>
        ${
          enabled
            ? ""
            : `<div class="form-status" id="form-status" role="note"><strong>Envio desativado nesta versão.</strong> O recebimento de cadastros ainda não foi configurado. Nenhum dado digitado aqui é enviado ou armazenado.</div>`
        }
        <div class="form-grid">
          <div class="fld">
            <label for="f-nome">Nome do responsável <span class="req" aria-hidden="true">*</span></label>
            <input id="f-nome" name="nome" type="text" autocomplete="name" required minlength="3" maxlength="120" aria-describedby="e-nome" />
            <p class="fld__error" id="e-nome" aria-live="polite"></p>
          </div>
          <div class="fld">
            <label for="f-empresa">Empresa <span class="req" aria-hidden="true">*</span></label>
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
              ${setores.map(([, t]) => `<option>${t.replace("Outros ambientes", "Outro ramo")}</option>`).join("")}
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
            <textarea id="f-obs" name="observacoes" rows="3" maxlength="600" aria-describedby="h-obs"></textarea>
            <p class="fld__hint" id="h-obs">Atividades principais, horários, dúvidas. Não inclua dados de funcionários.</p>
          </div>
          <div class="fld fld--wide fld--check">
            <input id="f-consent" name="consentimento" type="checkbox" required aria-describedby="e-consent" />
            <label for="f-consent">Autorizo a OperumData a me contatar pelo WhatsApp informado sobre esta oportunidade e li a <a href="privacidade/">política de privacidade</a>. <span class="req" aria-hidden="true">*</span></label>
            <p class="fld__error" id="e-consent" aria-live="polite"></p>
          </div>
        </div>
        <div class="form-actions">
          <button class="btn btn--primary btn--lg" type="submit" ${enabled ? "" : `disabled aria-disabled="true"`}>${enabled ? "Enviar interesse" : "Envio indisponível nesta versão"}</button>
          <p class="form-actions__note">Enviar interesse não significa aprovação ou contratação.</p>
        </div>
        <div class="form-result" id="form-result" role="status" aria-live="polite" hidden></div>
      </form>
    </div>
  </section>`;
};

const faq = () => `
  <section class="section" id="perguntas" aria-labelledby="faq-title">
    <div class="shell faq-layout">
      ${heading({ kicker: "Perguntas frequentes", id: "faq-title", title: "O que todo empresário pergunta." })}
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
      <h2 id="cta-title">Sua empresa pode fazer parte de novas oportunidades.</h2>
      <p>Uma conversa de qualificação, sem pressão e sem promessas.</p>
      <a class="btn btn--primary btn--lg" href="#cadastro">Quero conhecer a oportunidade <span class="btn__arrow" aria-hidden="true">→</span></a>
    </div>
  </section>`;

const footer = (prefix = "") => `
  <footer class="site-footer">
    <div class="shell site-footer__inner">
      <div class="site-footer__brand">
        <a class="wordmark" href="${prefix || "./"}" aria-label="OperumData — início">${wordmarkInner()}</a>
        <p>${esc(operumdata.papel)}.</p>
      </div>
      <nav aria-label="Rodapé">
        ${nav.map(([id, label]) => `<a href="${prefix}#${id}">${label}</a>`).join("")}
        <a href="${prefix}privacidade/">Privacidade</a>
      </nav>
      <div class="site-footer__legal">
        ${parceiro.provisorio ? `<p>“${esc(parceiro.nome)}” é um nome ilustrativo usado nesta demonstração. Não representa empresa confirmada nem parceria contratada.</p>` : ""}
        <p>Imagens e interfaces são representações ilustrativas. Esta página não usa cookies nem recursos de terceiros.</p>
        <p>© ${new Date().getFullYear()} OperumData.</p>
      </div>
    </div>
  </footer>`;

// ---------------------------------------------------------------------------
// Documento
// ---------------------------------------------------------------------------

const TITLE = "OperumData | Parceiros Brasil — nova fonte de receita com o trabalho que sua empresa já realiza";
const DESCRIPTION =
  "A OperumData conecta empresas brasileiras a programas internacionais de coleta de dados de atividades profissionais reais. Veja se sua empresa tem o perfil.";

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
${comoAcontece()}
${quemConduz()}
${confiancaSec()}
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
    description: "Situação da política de privacidade da página OperumData Parceiros Brasil e o que ela vai informar antes da ativação do cadastro.",
    canonical: `${site.url}privacidade/`,
    body: `${demoBanner()}
<header class="site-header">
  <div class="shell site-header__inner site-header__inner--simple">
    <a class="wordmark" href="../" aria-label="OperumData — início">${wordmarkInner()}</a>
    <a class="btn btn--ghost btn--sm" href="../">← Voltar à página</a>
  </div>
</header>
<main id="conteudo" class="legal">
  <div class="shell legal__inner">
    <p class="kicker"><span class="signal-dot" aria-hidden="true"></span>Privacidade</p>
    <h1>Política de privacidade</h1>
    <div class="form-status" role="note">
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
