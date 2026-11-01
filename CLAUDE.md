# I&A Tailoring storefront — guidance for Claude Code

Static React storefront (Vite + Tailwind) on GitHub Pages; Shopify will be the commerce backend, as on iana-schoolwear and iana-fashions.

## Rules
1. **Facts come from `src/data/site.ts`; products from `src/data/catalogue.json`.** Never invent prices, policies, delivery terms, cloth claims, lead times or alteration terms. Unconfirmed items go in `SITE.toConfirm`. While `SITE.preview` is true, products are samples and must stay labelled as such.
2. **Commerce goes through `src/lib/store.ts` only.** Components never fetch product data directly.
3. **Every page sets `<Seo>`.** Add new routes to `scripts/prerender.mjs`.
4. **No AI-generated faces.** Models are shown from behind or cropped at the chin.
5. **Brand (I&A guide 2022, Tailoring variant):** Ochre #45353a is the ground for hero, panels and footer (#2a2326 deep); Sage #d8e2dc for product backdrops and bands; warm white #fbfbf9 for shop pages. No pink on this site. Cormorant Garamond Bold headings (sentence case); Agrandir body and 0.15em uppercase labels, Lexend until licensed (change `--font-sans` only). Corners 3px. No pills, gradients as decoration, or card grids for prose.
6. **Two sizes is the core idea:** suits are separates; jacket (chest + S/R/L) and trousers (waist + leg) are chosen apart, and the shopper's saved sizes from Find my sizes are pre-selected and flagged everywhere.
7. Tap targets ≥ 44px, no horizontal overflow at 375px, body text ≥ 16px, British English.
