// Pre-build: cut every photograph in public/img/{looks,products} to the widths the pages ask for, so a phone
// never downloads a 1100px file for a 250px frame. Sources are the plain `<name>.webp` files; variants are written
// beside them as `<name>-<width>.webp` and listed in src/data/images.json for `srcset`. Run by `npm run build`.
import sharp from "sharp";
import { readdirSync, writeFileSync, existsSync, statSync } from "node:fs";
import { join } from "node:path";

const root = new URL("../public/img/", import.meta.url).pathname;
const WIDTHS = [320, 480, 640, 800];
const out = {};
for (const dir of ["looks", "products"]) {
  for (const f of readdirSync(join(root, dir)).sort()) {
    if (!f.endsWith(".webp") || /-(\d+|sm)\.webp$/.test(f)) continue;
    const src = join(root, dir, f), name = f.replace(/\.webp$/, "");
    const { width, height } = await sharp(src).metadata();
    const widths = [];
    // The widest frame on the site is 390px, so 800px covers a 2x screen. The source itself is kept for social cards.
    for (const w of WIDTHS.filter((x) => x < width)) {
      const dst = join(root, dir, `${name}-${w}.webp`);
      if (!existsSync(dst) || statSync(dst).mtimeMs < statSync(src).mtimeMs) await sharp(src).resize({ width: w, withoutEnlargement: true }).webp({ quality: 74, effort: 6 }).toFile(dst);
      widths.push(w);
    }
    out[`${dir}/${name}`] = { width, height, widths };
  }
}
writeFileSync(new URL("../src/data/images.json", import.meta.url), JSON.stringify(out, null, 2) + "\n");
console.log(`images: ${Object.keys(out).length} photographs, variants at ${WIDTHS.join(", ")}px`);
