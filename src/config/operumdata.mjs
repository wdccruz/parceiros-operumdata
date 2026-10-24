// ============================================================================
// DADOS INSTITUCIONAIS DA OPERUMDATA
// ============================================================================
//
// Campos com valor null aparecem na página como "Pendente" e NUNCA são
// substituídos por dados fictícios. Preencha somente com informações reais,
// conferidas e que possam ser publicadas.
// ============================================================================

export const operumdata = {
  nome: "OperumData",
  papel: "Coordenação e relacionamento no Brasil",

  // Experiência informada pelo fundador. Não afirmar projetos de coleta para IA.
  experienciaDesde: 2015,

  institucional: {
    // Entidade efetivamente responsável pelo atendimento.
    razaoSocial: null,
    cnpj: null,
    responsavelAtendimento: null,
    regiaoAtuacao: null,
  },

  // Canal oficial. Só aparece como botão quando preenchido.
  contato: {
    // Somente dígitos com DDI e DDD, ex.: "5511999999999"
    whatsapp: null,
    // Mensagem que já aparece escrita ao abrir o WhatsApp pelo botão flutuante.
    whatsappMensagem: "Olá! Vim pela página Parceiros OperumData e quero conhecer a oportunidade para minha empresa.",
    email: null,
  },
};
