# FXN Europe — Synth preview

Production source for the FXN Europe Synth redesign. Cloudflare Pages project: `fxneurope-eu`; production branch: `migrate/cloudflare-pages`. The `preview/synth-redesign` branch and local port 8790 are used for preview work.

- Theme source: https://github.com/xmpcross/xoco-synth
- Preview: http://51.161.208.188:8790/en/
- Main layout: `src/layouts/EuropeLayout.astro`
- Theme adaptation: `src/styles/europe.css`
- Public content snapshot: `src/data/pages.json` (existing documents, portfolio routes and legacy redirects)
- Synth's original fonts, tokens and dither engine remain in use.
- Preview builds carry `noindex, nofollow`; production builds enable indexing and canonical URLs on fxneurope.eu. The local preview server always adds a noindex header.
- Use `npm run build:production` for a manual release. Cloudflare builds automatically select production settings on `migrate/cloudflare-pages`.

Run `npm ci`, `npm run check`, and `npm run build`. Run `npm run preview:server` to serve `dist/` and the contact endpoint on port 8790. The systemd service `fxneurope-synth-preview` maintains the preview independently of the terminal session.

Content now presents FXN Europe as a builder and operator of its own websites, across five languages. Portfolio facts live in `src/config/portfolio.ts`; translated editorial copy is in `src/data/portfolio-copy.json`. The About and Contact compositions adapt the original Synth templates. The contact form posts to `/api/contact`. Google Workspace sends from `kritin@fxnholdings.com` to the fixed recipient `contact@fxneurope.eu`, with the visitor as Reply-To. Success is shown only after SMTP acceptance.

Fur Fun Shop is the confirmed portfolio entry. Its public storefront, footer and generator metadata were inspected on 23 October 2026 (Australia/Perth): WordPress, WooCommerce and Elementor; footer identifies FXN Europe OÜ. No other group websites have been attributed to FXN Europe without confirmation. Its screenshot is stored locally in `public/img/portfolio/`.

To refresh retained public source documents, run `python3 scripts/import-site.py`, then `python3 scripts/rewrite-portfolio.py` to reapply the portfolio editorial layer. Both require BeautifulSoup and write only to this preview directory. The source import alone would restore old marketing copy. Legal pages are retained, former service routes redirect to Portfolio or Technology, and each locale has a refreshed HTML sitemap.

The inherited theme demo components remain available as reference but their demo page routes are removed.

## Contact mail configuration

Set `SMTP_PASS` to a Google app password for `kritin@fxnholdings.com` in the ignored `.dev.vars` file (mode 600). Defaults are shown in `.dev.vars.example`. Never commit credentials. The preview server reads this file for each submission, so a credential update does not require a rebuild or restart. Cloudflare secrets from FXN Holdings are not readable by this preview.

`server/contact.mjs` shares the handler between the local Node server and the Pages Function in `functions/api/contact.js`. The sender and recipient are restricted in server code. The website/reference field accepts order references as well as URLs. Required fields, body size, same-origin submissions, honeypot and per-instance rate limiting are checked server-side. Errors keep entered values and include a diagnostic reference; logs contain allowlisted protocol codes only.

Run `npm run test:contact`, `npm run release:check` and `npm run check:pages`. Tests mock delivery and send no emails. Production requires SMTP_USER and SMTP_PASS as Cloudflare Pages secrets, with nodejs_compat enabled. These are configured separately from the local preview.

## Technology logos

The Technology page reuses the 12 technology names and SVG logos from the FXN Holdings homepage’s “Technologies we use” section (https://fxnholdings.com/#technologies). Assets are copied locally to `public/img/technologies/`; `src/data/technologies.json` retains their Simple Icons source URLs. Brand colors are preserved. Per-site implementation details remain separate from the broader technology list.
