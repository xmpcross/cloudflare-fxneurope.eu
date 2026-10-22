# fxneurope.eu — Cloudflare Pages

Live at **https://fxneurope.eu**. Both apex and www custom domains are active.
Cloudflare Pages serves 89 exported HTML documents and local assets without
Payload, Next.js or a database. The original server also serves the static build
as a fallback. Production Payload is stopped and disabled.

## Edit, verify and publish

- `content/`: editable HTML documents, including metadata.
- `public/`: CSS, browser JavaScript, images and fonts.
- `routes.json`: public routes and expected HTTP statuses.
- `scripts/build.py`: builds `dist/`, sitemap and hosting rules.

Requirements: Python 3; Node 22+ and npm for development tooling.

```sh
npm ci
npm run build
npm test
npm run dev
python3 scripts/check-deployment.py https://fxneurope.eu
```

Edit sources, commit and push **`migrate/cloudflare-pages`** to
https://github.com/xmpcross/fxneurope.eu. Cloudflare automatically builds and deploys
that branch. Project: `fxneurope-eu`; build command: `npm run build`; output: `dist`;
repository root: `/`. Other branches produce previews. The `main` branch remains
the historical source. Generated `dist/` and credentials must not be committed.
`deploy.sh` is available for manual Wrangler uploads; prefer Git deployments.

Preview URL: https://fxneurope-eu.pages.dev

## Redirects and hosting

HTTP redirects to HTTPS. The shared `fxn-sites-www-redirect` Cloudflare Worker
redirects only `www.fxneurope.eu/*` and `www.fxnstudio.com/*` to their respective
apex domains, preserving path and query string. Certificate-validation requests
pass through. Apex content is served as static Pages assets. Its tracked source
and deployment config are in `ops/`; update the Worker explicitly with:

```sh
npx wrangler deploy --config ops/wrangler.jsonc
```

That Worker is shared by both sites; keep the source copies synchronized.
Europe also preserves the `/` to `/en/` redirect and explicit 404 routes.
Unknown pages, `/admin` and CMS API URLs return 404.

## Contact behavior and retained services

The published contact pages use contact details and mailto links. The legacy
`/netlify-forms.html` and `/__forms.html` POST endpoints have a Pages Function,
but authenticated SMTP secrets are not configured on Pages. It returns 503
instead of pretending delivery succeeded. Configure settings from
`.dev.vars.example` before adding a form that uses it. The origin fallback
continues to use `fxneurope-forms.service` for these legacy endpoints.

Europe's Payload app, PostgreSQL service and backup timer are stopped and
disabled. A final database dump is in the cutover backup directory.

## Verification and rollback

All 89 published routes passed status/title checks on the Pages URL and
public domain, along with 404s, headers, sitemap and robots. Source/build fidelity
and local asset/link checks pass. HTTPS and www redirects are verified. Mail and
all unrelated DNS records were preserved.

Local operational records: `../migration/cloudflare-cutover.json` and
`../migration/static-status.json`. Cutover backups (DNS, nginx, service states)
are in `../backups/cloudflare-cutover/`. Original exported content and database
backups are in the earlier `../backups/static-migration-*/` directory.

To move hosting back to the server, restore only the apex/www DNS records from
`dns-before.json`, leaving email records untouched. The origin already serves
`static/dist/` via `../config/nginx-static.conf`. To restore Payload specifically,
start its database and app services, restore `origin-nginx-before.conf`, run
`nginx -t`, and reload nginx. Europe additionally needs its backup timer enabled.
Keep backups and the old app directories until rollback is no longer needed.
