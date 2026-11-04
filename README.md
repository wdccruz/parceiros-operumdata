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
| Parceiros internacionais autorizados (lista; um link `?p=slug` para cada) | `src/config/parceiros.mjs` |
| Dados institucionais da OperumData (razão social, CNPJ, responsável, região, WhatsApp, e-mail) | `src/config/operumdata.mjs` |
| URL pública, modo demonstração, endpoint do formulário, política de privacidade | `src/config/site.mjs` |
| Textos das seções | `src/page.mjs` |
| Estilos e comportamento | `src/assets/site.css`, `src/assets/site.js` |

Campos `null` aparecem na página como **Pendente**. Nunca preencha com dados fictícios.

## Regras de conteúdo

- A página padrão fala de "programas internacionais" e não cita nenhuma empresa.
- Um parceiro só aparece pelo link `?p=<slug>` (ex.: `.../parceiros-operumdata/?p=nome-curto`),
  depois de entrar na lista de `src/config/parceiros.mjs` com a autorização escrita registrada.
  Slug desconhecido mantém a página genérica. Não há uma página por parceiro.
- Tudo na lista fica público no código da página: só dados autorizados.
- Sem depoimentos, números, clientes, projetos concluídos, logotipos oficiais ou promessas de ganho.
- Não afirmar que a OperumData já realizou coleta de dados para IA.
- Nenhum nome de organização em negociação no código, metadados ou commits.
  `npm run check` procura esses nomes (guardados apenas como hash).

## Google e assistentes de IA

O build gera, além das páginas:

- `robots.txt` (libera buscadores e robôs de IA, aponta o sitemap) e `sitemap.xml`;
- `llms.txt`: resumo em Markdown para assistentes de IA (padrão llmstxt.org);
- `404.html` (não indexada);
- metatags de busca e compartilhamento (título, descrição, canonical, Open Graph com
  `assets/og-image.png` 1200×630) e dados estruturados schema.org (Organization,
  WebSite, WebPage, Service, FAQPage) gerados a partir do texto da página.

`site.indexar` controla a indexação. `NOINDEX=1 npm run build` gera uma cópia que pede
para não ser indexada (útil quando o domínio próprio entrar no ar e o GitHub Pages
virar apenas cópia). Depois de publicar no domínio final, cadastre o site no
[Google Search Console](https://search.google.com/search-console) e no
[Bing Webmaster Tools](https://www.bing.com/webmasters) e envie o `sitemap.xml`.

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

### HostGator (ou outra hospedagem Apache / cPanel)

```bash
npm run package:hostgator                                   # para https://parceiros.operumdata.com/
SITE_URL=https://outro.dominio/ npm run package:hostgator   # outro endereço
```

Gera `hosting/parceiros-operumdata-hostgator.zip` (site + `.htaccess` com HTTPS,
cache e compressão). Para subir:

1. cPanel → **Domínios**: crie o subdomínio `parceiros` (a pasta dele aparece, ex.: `public_html/parceiros`).
2. cPanel → **SSL/TLS Status**: ative o certificado gratuito do subdomínio.
3. **Gerenciador de arquivos** → abra a pasta do subdomínio → **Carregar** o zip → clique com o botão direito → **Extrair** → apague o zip.
4. Ative "Mostrar arquivos ocultos" e confira que o `.htaccess` está lá.

### Redes sociais

Preencha `redes.linkedin` e `redes.facebook` em `src/config/operumdata.mjs`.
Cada link preenchido vira um botão no rodapé das duas páginas.

### Migrar para parceiros.operumdata.com

1. No DNS de `operumdata.com`, crie um registro `CNAME` de `parceiros` para `wdccruz.github.io`.
2. Crie `src/assets/CNAME` contendo `parceiros.operumdata.com` (o build copia para a raiz).
3. Em `src/config/site.mjs`, troque `url` para `https://parceiros.operumdata.com/`.
4. Em *Settings → Pages*, informe o domínio e ative *Enforce HTTPS*.
