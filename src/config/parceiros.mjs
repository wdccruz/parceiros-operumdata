// ============================================================================
// PARCEIROS INTERNACIONAIS — lista única, sem página por parceiro
// ============================================================================
//
// A página padrão fala de "programas internacionais", sem citar empresa.
// Para apresentar um parceiro, adicione-o a esta lista e envie o link
// com o parâmetro p:
//
//   https://wdccruz.github.io/parceiros-operumdata/?p=<slug>
//
// Com um slug desconhecido (ou sem parâmetro), a página continua genérica.
//
// REGRAS
// - Inclua somente parceiros com autorização ESCRITA para uso do nome.
//   `autorizacao` precisa estar preenchido, senão o build falha.
// - Tudo aqui fica público no código da página. Não coloque valores
//   comerciais, margens, contatos internos nem nomes em negociação.
// - `logotipo`: arquivo oficial do parceiro em src/assets/parceiros/.
//
// MODELO (copie, preencha e tire os comentários):
//
//   {
//     slug: "nome-curto",                     // letras minúsculas, números e hífens
//     nome: "Nome oficial do parceiro",
//     descricaoCurta: "Programa internacional de coleta de dados",
//     logotipo: null,                         // ex.: "assets/parceiros/nome-curto.svg"
//     paisSede: "País",
//     siteOficial: "https://...",
//     razaoSocial: "Razão social registrada",
//     autorizacao: "Referência interna da autorização (ex.: e-mail de 2026-11-03)",
//   },
// ============================================================================

export const parceiros = [];
