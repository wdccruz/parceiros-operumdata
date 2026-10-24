// Servidor local que imita o GitHub Pages: o site responde em /parceiros-operumdata/.
// Uso: npm run build && npm run preview  →  http://localhost:4173/parceiros-operumdata/
import { createServer } from "node:http";
import { existsSync, readFileSync, statSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const dist = fileURLToPath(new URL("../dist/", import.meta.url));
const BASE = "/parceiros-operumdata/";
const PORT = Number(process.env.PORT) || 4173;
const TYPES = { ".html": "text/html; charset=utf-8", ".css": "text/css", ".js": "text/javascript", ".svg": "image/svg+xml", ".otf": "font/otf", ".png": "image/png", ".jpg": "image/jpeg", ".webp": "image/webp" };

createServer((req, res) => {
  const url = decodeURIComponent(req.url.split("?")[0]);
  if (url === "/" || url === BASE.slice(0, -1)) { res.writeHead(302, { Location: BASE }); return res.end(); }
  if (!url.startsWith(BASE)) { res.writeHead(404); return res.end("404"); }
  let file = normalize(join(dist, url.slice(BASE.length)));
  if (!file.startsWith(dist)) { res.writeHead(403); return res.end(); }
  if (existsSync(file) && statSync(file).isDirectory()) file = join(file, "index.html");
  if (!existsSync(file)) { res.writeHead(404); return res.end("404"); }
  res.writeHead(200, { "Content-Type": TYPES[extname(file)] || "application/octet-stream" });
  res.end(readFileSync(file));
}).listen(PORT, () => console.log(`http://localhost:${PORT}${BASE}`));
