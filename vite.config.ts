import { defineConfig, type Plugin } from "vite";
import react from "@vitejs/plugin-react";
import tailwindcss from "@tailwindcss/vite";

// The two faces the first screen is set in (the capitals and the reading serif) are fetched with the page,
// not after the stylesheet has been read. The files are self-hosted; see the @font-face rules in src/index.css.
const PRELOAD = ["marcellus-latin-400-normal", "libre-caslon-text-latin-400-normal"];
const preloadFonts = (): Plugin => ({
  name: "preload-fonts",
  apply: "build",
  transformIndexHtml: {
    order: "post",
    handler(_html, ctx) {
      const files = Object.keys(ctx.bundle ?? {}).filter((f) => f.endsWith(".woff2") && PRELOAD.some((p) => f.includes(p)));
      const base = process.env.VITE_BASE ?? "/iana-tailoring/";
      return files.sort((a, b) => PRELOAD.findIndex((p) => a.includes(p)) - PRELOAD.findIndex((p) => b.includes(p)))
        .map((f) => ({ tag: "link", attrs: { rel: "preload", as: "font", type: "font/woff2", href: base + f, crossorigin: "" }, injectTo: "head" as const }));
    },
  },
});

// GitHub Pages serves the site at /<repo>/ — set VITE_BASE=/ for a custom domain.
export default defineConfig({
  plugins: [react(), tailwindcss(), preloadFonts()],
  base: process.env.VITE_BASE ?? "/iana-tailoring/",
});
