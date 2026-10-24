# OperumData — Parceiros Brasil

Landing page em português para proprietários e gestores de empresas brasileiras.
Apresenta a OperumData (coordenação e relacionamento no Brasil), o programa
internacional de coleta de dados e o cadastro de interesse.

- Publicação provisória: https://wdccruz.github.io/parceiros-operumdata/
- Domínio planejado: `parceiros.operumdata.com`

Identidade visual herdada do site internacional (`operumdata-site`): fontes,
paleta (`#050506`, `#F7F4EF`, `#FF5A1F`, cinzas frios), grade, botões e marca.

## Onde editar

| O quê | Arquivo |
| --- | --- |
| Parceiro internacional (nome, logotipo, textos, dados verificáveis) | `src/config/parceiro-internacional.mjs` |
| Dados institucionais da OperumData (razão social, CNPJ, responsável, região, WhatsApp, e-mail) | `src/config/operumdata.mjs` |
| URL pública, modo demonstração, endpoint do formulário, política de privacidade | `src/config/site.mjs` |
| Textos das seções | `src/page.mjs` |
| Estilos e comportamento | `src/assets/site.css`, `src/assets/site.js` |

Campos `null` aparecem na página como **Pendente**. Nunca preencha com dados fictícios.

## Regras de conteúdo

- "Exemplo.com" é um nome fictício de desenvolvimento. Enquanto `provisorio: true`,
  a página mostra avisos de identidade ilustrativa e pede `noindex` aos buscadores.
- Sem depoimentos, números, clientes, projetos concluídos, logotipos oficiais ou promessas de ganho.
- Não afirmar que a OperumData já realizou coleta de dados para IA.
- Nenhum nome de organização em negociação no código, metadados ou commits.
  `npm run check` procura esses nomes (guardados apenas como hash).

## Formulário

Sem `formulario.endpoint`, o envio fica **desativado** e a página avisa que nada é enviado.
Para ativar, informe uma URL que receba `POST` com JSON (por exemplo, um serviço de
formulários ou uma função própria). A mensagem de sucesso só aparece quando o servidor
responde com sucesso. Não coloque tokens ou segredos no repositório: ele é público.
Antes de ativar, publique a política de privacidade completa (`privacidade.publicada: true`).

## Comandos

Requer Node.js 20+. Sem dependências externas.

```bash
npm run build     # gera dist/
npm run check     # verifica links, assets, SEO, formulário e nomes confidenciais
npm test          # build + check
npm run preview   # http://localhost:4173/parceiros-operumdata/
```

## Publicação

Cada push em `main` executa `.github/workflows/pages.yml`: build, verificação e deploy no
GitHub Pages. Em *Settings → Pages*, a origem deve ser **GitHub Actions**.

Todos os caminhos internos são relativos, então o mesmo build funciona em
`/parceiros-operumdata/` e na raiz de um subdomínio.

### Migrar para parceiros.operumdata.com

1. No DNS de `operumdata.com`, crie um registro `CNAME` de `parceiros` para `wdccruz.github.io`.
2. Crie `src/assets/CNAME` contendo `parceiros.operumdata.com` (o build copia para a raiz).
3. Em `src/config/site.mjs`, troque `url` para `https://parceiros.operumdata.com/`.
4. Em *Settings → Pages*, informe o domínio e ative *Enforce HTTPS*.
