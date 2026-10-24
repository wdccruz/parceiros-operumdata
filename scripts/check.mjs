// Verificações da exportação estática e do repositório.
// Falha (exit 1) se algo impedir a publicação.
import { createHash } from "node:crypto";
import { execSync } from "node:child_process";
import { existsSync, readFileSync, readdirSync, statSync } from "node:fs";
import { dirname, join, relative, resolve } from "node:path";
import { fileURLToPath } from "node:url";
import { parceiroInternacional } from "../src/config/parceiro-internacional.mjs";
import { site } from "../src/config/site.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const dist = join(root, "dist");
const errors = [];
const fail = (msg) => errors.push(msg);

// Nomes confidenciais guardados apenas como hash SHA-256 (minúsculas),
// para que a própria verificação não exponha os nomes.
const FORBIDDEN_HASHES = new Set([
  "d5007cc3f96992ad0c10be2fda2a18bc06d8fa1a5a1672e2f131682f47e28039",
  "3ee6783c6639761baa54e442245b9778c274d82a3acbd8f5ff8c7c8ffab3de78",
  "1f3dad8f4dfc6f24c09c00351f72d686303c7905c7d265530b3effcde67f21f5",
]);
const sha = (s) => createHash("sha256").update(s).digest("hex");

function scanForbidden(text, where) {
  const words = text.toLowerCase().normalize("NFD").replace(/[̀-ͯ]/g, "").match(/[a-z0-9]+/g) || [];
  for (let i = 0; i < words.length; i++) {
    const one = words[i];
    const two = i + 1 < words.length ? `${one} ${words[i + 1]}` : null;
    if (FORBIDDEN_HASHES.has(sha(one)) || (two && FORBIDDEN_HASHES.has(sha(two))) || (two && FORBIDDEN_HASHES.has(sha(one + words[i + 1])))) {
      fail(`Nome confidencial encontrado em ${where}`);
      return;
    }
  }
}

function walk(dir) {
  return readdirSync(dir).flatMap((name) => {
    const p = join(dir, name);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

const TEXT = /\.(html|css|js|mjs|json|md|yml|yaml|svg|txt)$|CNAME$|\.nojekyll$/;

// 1. Arquivos essenciais
for (const f of ["index.html", "privacidade/index.html", "assets/site.css", "assets/site.js", "assets/favicon.svg", ".nojekyll"]) {
  if (!existsSync(join(dist, f))) fail(`Arquivo ausente: dist/${f}`);
}
if (errors.length) finish();

// 2. Páginas HTML
for (const file of walk(dist).filter((f) => f.endsWith(".html"))) {
  const rel = relative(dist, file);
  const html = readFileSync(file, "utf8");

  if (!html.includes('<html lang="pt-BR">')) fail(`${rel}: lang="pt-BR" ausente`);
  if ((html.match(/<h1[\s>]/g) || []).length !== 1) fail(`${rel}: deve ter exatamente um <h1>`);
  if (!/<title>[^<]{10,}<\/title>/.test(html)) fail(`${rel}: <title> ausente`);
  if (!/<meta name="description" content="[^"]{50,}"/.test(html)) fail(`${rel}: meta description ausente`);
  if (!html.includes('name="viewport"')) fail(`${rel}: viewport ausente`);

  const ids = new Set([...html.matchAll(/\sid="([^"]+)"/g)].map((m) => m[1]));
  for (const m of html.matchAll(/\s(?:href|src)="([^"]*)"/g)) {
    const url = m[1];
    if (/^(https?:|mailto:|tel:)/.test(url)) {
      if (/^https?:/.test(url) && !url.startsWith(site.url) && !url.startsWith("https://wa.me/")) fail(`${rel}: recurso externo não esperado: ${url}`);
      continue;
    }
    if (url.startsWith("/")) { fail(`${rel}: caminho absoluto impede a migração de domínio: ${url}`); continue; }
    const [path, hash] = url.split("#");
    if (!path) { if (hash && !ids.has(hash)) fail(`${rel}: âncora inexistente #${hash}`); continue; }
    let target = resolve(dirname(file), path);
    if (path.endsWith("/") || path === "./" || path === "../") target = join(target, "index.html");
    if (!target.startsWith(dist)) fail(`${rel}: link sai do site: ${url}`);
    else if (!existsSync(target)) fail(`${rel}: link quebrado: ${url}`);
  }

  for (const img of html.matchAll(/<img\b[^>]*>/g)) if (!/\salt="/.test(img[0])) fail(`${rel}: imagem sem alt`);
}

// 3. Regras do conteúdo da página principal
const index = readFileSync(join(dist, "index.html"), "utf8");
for (const id of ["oportunidade", "como-funciona", "quem-conduz", "atividades", "transparencia", "credibilidade", "cadastro", "perguntas"]) {
  if (!index.includes(`id="${id}"`)) fail(`Seção ausente: #${id}`);
}
if (!index.includes(parceiroInternacional.nome)) fail("Nome do parceiro internacional não aparece na página");
if (parceiroInternacional.provisorio) {
  if (!index.includes("Identidade provisória")) fail("Parceiro provisório sem a etiqueta de identidade provisória");
  if (!index.includes("nome ilustrativo")) fail("Parceiro provisório sem aviso de nome ilustrativo");
  if (!index.includes('name="robots" content="noindex')) fail("Demonstração deve pedir noindex");
}
if (!site.formulario.endpoint) {
  const button = index.match(/<button[^>]*type="submit"[^>]*>/);
  if (!button || !/\sdisabled/.test(button[0])) fail("Sem endpoint configurado, o botão de envio deve estar desabilitado");
  if (!index.includes("Envio desativado nesta versão")) fail("Sem endpoint configurado, o aviso de envio desativado deve aparecer");
}
for (const banned of ['name="cpf"', 'name="banco"', 'name="agencia"']) if (index.includes(banned)) fail(`Campo proibido no formulário: ${banned}`);

// 4. Nomes confidenciais e segredos (repositório + saída)
const tracked = execSync("git ls-files --cached --others --exclude-standard", { cwd: root }).toString().split("\n").filter(Boolean).map((f) => join(root, f));
const files = [...new Set([...tracked, ...walk(dist)])].filter((f) => TEXT.test(f) && existsSync(f));
const SECRET = /(ghp_[A-Za-z0-9]{20,}|github_pat_[A-Za-z0-9_]{20,}|AKIA[0-9A-Z]{16}|sk-[A-Za-z0-9]{20,}|xox[bp]-[A-Za-z0-9-]{10,})/;
for (const f of files) {
  if (f.endsWith("check.mjs")) continue;
  const text = readFileSync(f, "utf8");
  scanForbidden(text, relative(root, f));
  if (SECRET.test(text)) fail(`Possível segredo em ${relative(root, f)}`);
}
try {
  scanForbidden(execSync("git log --format=%an%n%ae%n%B", { cwd: root }).toString(), "mensagens de commit");
} catch { /* sem histórico */ }

finish();

function finish() {
  if (errors.length) {
    console.error(`✗ ${errors.length} problema(s):\n  - ${errors.join("\n  - ")}`);
    process.exit(1);
  }
  console.log(`✓ Verificação concluída (${files.length} arquivos analisados).`);
  process.exit(0);
}
