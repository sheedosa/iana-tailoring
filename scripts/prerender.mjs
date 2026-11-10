// Post-build: render every route to static HTML inside dist/ so GitHub Pages serves real pages
// (titles, meta, JSON-LD and content) to Google, social scrapers and AI crawlers. Also writes sitemap.xml and llms.txt.
import { chromium } from "playwright";
import { createServer } from "node:http";
import { readFileSync, writeFileSync, mkdirSync, existsSync, statSync } from "node:fs";
import { join, extname } from "node:path";

const BASE = "/iana-tailoring";
const SITE = "https://sheedosa.github.io" + BASE;
const dist = new URL("../dist/", import.meta.url).pathname;
const cat = JSON.parse(readFileSync(new URL("../src/data/catalogue.json", import.meta.url)));

const routes = ["/", "/find-my-sizes", "/made-to-measure", "/alterations", "/visit", "/delivery-returns", "/shop/all",
  ...cat.collections.map((c) => `/shop/${c.handle}`),
  ...cat.products.map((p) => `/products/${p.handle}`)];

const types = { ".html": "text/html", ".js": "text/javascript", ".css": "text/css", ".webp": "image/webp", ".svg": "image/svg+xml", ".png": "image/png", ".jpg": "image/jpeg", ".json": "application/json", ".ico": "image/x-icon", ".txt": "text/plain", ".xml": "application/xml", ".webmanifest": "application/manifest+json" };
const server = createServer((req, res) => {
  let p = decodeURIComponent(req.url.split("?")[0]).replace(BASE, "") || "/";
  let f = join(dist, p);
  if (!existsSync(f) || statSync(f).isDirectory()) f = join(dist, "index.html");
  res.setHeader("Content-Type", types[extname(f)] ?? "application/octet-stream");
  res.end(readFileSync(f));
}).listen(Number(process.env.PRERENDER_PORT ?? 0));
await new Promise((r) => server.once("listening", r));
const PORT = server.address().port;

const exe = process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE || (existsSync("/opt/pw-browsers/chromium") ? "/opt/pw-browsers/chromium" : undefined);
const browser = await chromium.launch(exe ? { executablePath: exe } : {});
const page = await browser.newPage({ viewport: { width: 1280, height: 900 } });
page.route(/fonts\.(googleapis|gstatic)\.com/, (r) => r.abort()); // fonts aren't needed for markup
let n = 0;
for (const r of routes) {
  await page.goto(`http://localhost:${PORT}${BASE}${r}`, { waitUntil: "networkidle" });
  await page.waitForFunction(() => document.querySelector("h1") && !document.body.innerText.includes("Loading"), null, { timeout: 10000 }).catch(() => {});
  let html = await page.content();
  html = html.replace("<html", '<html data-prerendered="1"'); // informational only
  const out = r === "/" ? join(dist, "index.html") : join(dist, r.slice(1), "index.html");
  mkdirSync(join(out, ".."), { recursive: true });
  writeFileSync(out, "<!doctype html>\n" + html.replace(/^<!doctype html>\s*/i, ""));
  n++;
}
await browser.close(); server.close();

const today = new Date().toISOString().slice(0, 10);
writeFileSync(join(dist, "sitemap.xml"), `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${routes.map((r) => `  <url><loc>${SITE}${r === "/" ? "/" : r}</loc><lastmod>${today}</lastmod><changefreq>${r.startsWith("/products") ? "weekly" : "monthly"}</changefreq><priority>${r === "/" ? "1.0" : r.startsWith("/shop/") ? "0.9" : "0.7"}</priority></url>`).join("\n")}\n</urlset>\n`);

const cols = cat.collections.map((c) => `- [${c.title}](${SITE}/shop/${c.handle}): ${c.blurb}`).join("\n");
writeFileSync(join(dist, "llms.txt"), `# I&A Formal

> Formal wear for men, women and kids from I & A Fashions Limited (trading as I & A Formal), a family business at 84 Mitcham Road, Tooting, London SW17 9NG, trading since 1993. Men's and women's suits, occasion and prom dresses, bridal, and kids' suits and dresses (ages 2 to 16). Men's suits are sold with the jacket (chest 36 to 50, S/R/L) and trousers (waist 28 to 44, leg 30/32/34) in different sizes. Made to measure from £250: 50% deposit, usually 4 to 6 weeks, two fittings. Alterations in the shop. Walk in, no appointment needed: open Monday to Sunday 9am to 6pm. Phone 020 8767 8613. Delivery: standard £4.95 (5 working days), express £7.95 (48 hours), free on orders of £100 and over, click and collect in Tooting. 28-day returns; suits, bridal dresses and prom dresses are not returnable. Sister shops: I&A Fashions, I&A Schoolwear.

Note: this site is a concept preview. Products are samples; ordering opens at launch.

## Collections
${cols}

## Help
- [Find my sizes](${SITE}/find-my-sizes): jacket and trouser sizes from height, chest and waist
- [Made to measure](${SITE}/made-to-measure): process, prices, deposit and timing
- [Alterations](${SITE}/alterations): what we alter and how to ask
- [Visit the shop](${SITE}/visit): address, hours, phone
- [Delivery and returns](${SITE}/delivery-returns): delivery options and returns policy
`);
console.log(`prerendered ${n} routes, sitemap + llms.txt written`);
