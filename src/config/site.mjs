// ============================================================================
// CONFIGURAÇÃO DE PUBLICAÇÃO E DO FORMULÁRIO
// ============================================================================

export const site = {
  // Endereço público usado em canonical e Open Graph.
  // Ao migrar para o subdomínio, troque para "https://parceiros.operumdata.com/"
  // e crie o arquivo src/assets/CNAME (veja o README).
  // O pacote da HostGator define SITE_URL (veja o README).
  url: process.env.SITE_URL || "https://wdccruz.github.io/parceiros-operumdata/",

  // Site institucional internacional da OperumData (dados estruturados e rodapé).
  siteInstitucional:
    process.env.MAIN_SITE_URL ||
    (/operumdata\.com\/$/.test(process.env.SITE_URL || "") ? "https://operumdata.com/" : "https://wdccruz.github.io/operumdata-site/"),

  // Versão de demonstração: mostra a faixa de aviso de que o cadastro ainda
  // não envia dados.
  demonstracao: !process.env.OFICIAL,

  // Indexação por Google e assistentes de IA (robots, sitemap, llms.txt).
  // NOINDEX=1 no build gera uma cópia que pede para não ser indexada.
  indexar: !process.env.NOINDEX,

  // Tags oficiais do Google e da Meta. Só entram no pacote da HostGator
  // (endereço oficial). A cópia do GitHub Pages nunca carrega tags.
  // Carregam somente depois do "Aceitar" na barra de cookies (LGPD).
  rastreamento: {
    oficial: Boolean(process.env.OFICIAL),
    ga4: "G-JLCZT1CL46", // Google Analytics 4, ex.: "G-XXXXXXXXXX"
    metaPixel: null, // Meta Pixel, só números, ex.: "1234567890"
    googleVerificacao: null, // opcional: conteúdo da metatag google-site-verification
  },

  formulario: {
    // URL que recebe o cadastro via POST (JSON). null = envio desativado.
    // Nunca coloque tokens ou segredos aqui: este arquivo é público.
    // Pacote da HostGator: enviar.php (hosting/enviar.php) manda o cadastro por e-mail.
    // O GitHub Pages não roda PHP, então lá o envio fica desativado.
    endpoint: process.env.OFICIAL ? "enviar.php" : null,
  },

  // Política de privacidade. Enquanto `publicada` for false, a página
  // privacidade/ mostra apenas o que será exigido antes da ativação.
  privacidade: {
    publicada: Boolean(process.env.OFICIAL),
  },
};
