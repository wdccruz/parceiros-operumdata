// ============================================================================
// CONFIGURAÇÃO DE PUBLICAÇÃO E DO FORMULÁRIO
// ============================================================================

export const site = {
  // Endereço público usado em canonical e Open Graph.
  // Ao migrar para o subdomínio, troque para "https://parceiros.operumdata.com/"
  // e crie o arquivo src/assets/CNAME (veja o README).
  url: "https://wdccruz.github.io/parceiros-operumdata/",

  // Versão de demonstração: mostra a faixa de aviso e pede aos buscadores
  // que não indexem a página enquanto o parceiro for ilustrativo.
  demonstracao: true,

  formulario: {
    // URL que recebe o cadastro via POST (JSON). null = envio desativado.
    // Nunca coloque tokens ou segredos aqui: este arquivo é público.
    endpoint: null,
  },

  // Política de privacidade. Enquanto `publicada` for false, a página
  // privacidade/ mostra apenas o que será exigido antes da ativação.
  privacidade: {
    publicada: false,
  },
};
