# I&A Formal — formal wear storefront

Concept preview of the I&A Formal store: formal wear for men, women and kids (suits, occasion, prom and bridal), made to measure, alterations, and men's suits with the jacket and trousers in different sizes. The repo keeps the name `iana-tailoring`.
Built by Elconekt for IandA Group on the same stack as [I&A Schoolwear](https://github.com/sheedosa/iana-schoolwear).

**Live preview:** https://sheedosa.github.io/iana-tailoring/

## Stack
Vite + React 19 + TypeScript + Tailwind v4, react-router, deployed to GitHub Pages by `.github/workflows/deploy.yml`.
Every route is prerendered to static HTML (`scripts/prerender.mjs`) with titles, meta, Open Graph, JSON-LD, `sitemap.xml` and `llms.txt`.

## Commands
```bash
npm install
npm run dev          # http://localhost:5173/iana-tailoring/
npm run build        # typecheck + build + prerender (needs Chromium)
npm run build:spa    # without prerender
```

## What's real and what's sample
- **Real (confirmed by the client):** business name, address, phone, hours, company and VAT numbers; delivery (standard £4.95, 5 working days; express £7.95, 48 hours; free on orders of £100 and over; click and collect in Tooting); 28-day returns except suits, bridal and prom dresses; made to measure from £250, 50% deposit, usually 4 to 6 weeks, 2 fittings; walk-in appointments.
- **Sample:** every product in `src/data/catalogue.json`, product prices (`£[PRICE]`), the size thresholds in `src/data/site.ts`, the alterations price list. Ordering is switched off (`SITE.preview`).
- **Brand:** I & A Formal lockups in `public/img/logo/`, rebuilt from the brand guide 2022 lockup pattern (outlined Cormorant Garamond and Lexend).
- Open questions for the client are in `SITE.toConfirm`.

## Going live
1. Replace the catalogue with the client's range and photographs (one per product; `PhotoSlot` fills the gaps), or port `ShopifyStorefront` from the schoolwear repo into `src/lib/store.ts` (men's jacket and trousers as separate products linked by a "suit" metafield; Chest + Length and Waist + Leg as variant options).
2. Set `SITE.preview = false` and add basket and checkout (schoolwear's `CartDrawer` + Shopify cart).
3. Add `VITE_SHOPIFY_DOMAIN` and `VITE_SHOPIFY_STOREFRONT_TOKEN` as repository secrets.
4. Custom domain: `public/CNAME`, `VITE_BASE=/`, update `SITE.url`, `index.html`, `robots.txt`, `404.html` and `scripts/prerender.mjs`.
