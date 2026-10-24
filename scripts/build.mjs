// Gera o site estático em dist/ sem dependências externas.
import { cpSync, existsSync, mkdirSync, rmSync, writeFileSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";
import { renderIndex, renderPrivacy } from "../src/page.mjs";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const out = join(root, "dist");

rmSync(out, { recursive: true, force: true });
mkdirSync(join(out, "privacidade"), { recursive: true });

cpSync(join(root, "src/assets"), join(out, "assets"), {
  recursive: true,
  filter: (src) => !src.endsWith("CNAME"),
});

writeFileSync(join(out, "index.html"), renderIndex());
writeFileSync(join(out, "privacidade/index.html"), renderPrivacy());
writeFileSync(join(out, ".nojekyll"), "");

// Domínio próprio: crie src/assets/CNAME com "parceiros.operumdata.com".
const cname = join(root, "src/assets/CNAME");
if (existsSync(cname)) cpSync(cname, join(out, "CNAME"));

console.log("Site gerado em dist/");
