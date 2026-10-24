// ============================================================================
// PARCEIRO INTERNACIONAL — ponto único de configuração
// ============================================================================
//
// Tudo o que a página mostra sobre a organização internacional responsável
// pelo programa vem deste arquivo: nome, identidade visual, textos e dados
// verificáveis. Para trocar o parceiro, edite apenas aqui.
//
// SITUAÇÃO ATUAL: "Exemplo.com" é um nome FICTÍCIO usado só para
// desenvolvimento e demonstração. Não é uma empresa confirmada e não
// representa parceria contratada.
//
// Para usar dados reais (somente com autorização escrita do parceiro):
//   1. troque `nome`, `descricaoCurta` e `apresentacao`;
//   2. aponte `logotipo` para um arquivo em src/assets/ (ex.: "assets/parceiro.svg")
//      fornecido oficialmente pelo parceiro;
//   3. preencha `verificacao` com dados públicos e verificáveis;
//   4. mude `provisorio` para false e registre a autorização em `autorizacao`.
// ============================================================================

export const parceiroInternacional = {
  // true = identidade ilustrativa. Mantém os avisos de demonstração visíveis.
  provisorio: true,

  nome: "Exemplo.com",
  // Usado no monograma provisório quando não há logotipo oficial.
  sigla: "E",
  descricaoCurta: "Programa internacional de coleta de dados",

  // Logotipo oficial (caminho relativo dentro de src/assets). null = monograma provisório.
  logotipo: null,

  // Texto conceitual: descreve o papel, sem afirmar contrato ou parceria formal.
  apresentacao: [
    "Organização internacional responsável pelo programa de coleta de dados de atividades profissionais reais.",
    "Define a finalidade técnica dos dados, os requisitos de captação, os critérios de elegibilidade e as condições contratuais aplicáveis a cada participante.",
  ],

  responsabilidades: [
    "Finalidade técnica e uso previsto dos dados",
    "Requisitos de captação, equipamentos e qualidade",
    "Critérios de elegibilidade das atividades",
    "Condições contratuais e critérios de remuneração",
  ],

  // Dados verificáveis do parceiro. null = ainda não autorizado/informado.
  verificacao: {
    razaoSocial: null,
    paisSede: null,
    siteOficial: null,
    registro: null,
  },

  // Referência interna da autorização de uso do nome (não publicar documentos aqui).
  autorizacao: null,
};
