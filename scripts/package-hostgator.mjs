// Gera o pacote para hospedagem Apache (HostGator / cPanel):
//   npm run package:hostgator                         → https://parceiros.operumdata.com/
//   SITE_URL=https://outro.dominio/ npm run package:hostgator
// Saída: hosting/parceiros-operumdata-hostgator.zip (conteúdo de dist/ + .htaccess)
import { execSync } from "node:child_process";
import { copyFileSync, rmSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const SITE_URL = process.env.SITE_URL || "https://parceiros.operumdata.com/";
if (!/^https:\/\/[^/]+\/$/.test(SITE_URL)) throw new Error(`SITE_URL deve ser https://dominio/ (com barra final): ${SITE_URL}`);
// O pacote da HostGator é o endereço oficial: sempre indexável.
const env = { ...process.env, NOINDEX: "", SITE_URL };

execSync("node scripts/build.mjs && node scripts/check.mjs", { cwd: root, stdio: "inherit", env });
copyFileSync(join(root, "hosting/htaccess"), join(root, "dist/.htaccess"));
rmSync(join(root, "dist/.nojekyll"), { force: true });
rmSync(join(root, "dist/CNAME"), { force: true });

const zip = join(root, "hosting/parceiros-operumdata-hostgator.zip");
rmSync(zip, { force: true });
execSync(`zip -qr "${zip}" .`, { cwd: join(root, "dist"), stdio: "inherit" });
console.log(`Pacote pronto para ${SITE_URL}: hosting/parceiros-operumdata-hostgator.zip`);
