import { writeFile, readFile } from "node:fs/promises";
const production =
  process.env.SITE_DEPLOYMENT === "production" ||
  process.env.CF_PAGES_BRANCH === "migrate/cloudflare-pages";
const pages = JSON.parse(
  await readFile(new URL("../src/data/pages.json", import.meta.url), "utf8"),
);
const write = (name, value) => writeFile(new URL(`../dist/${name}`, import.meta.url), value);
await write(
  "robots.txt",
  production
    ? "User-agent: *\nAllow: /\nSitemap: https://fxneurope.eu/sitemap-index.xml\n"
    : "User-agent: *\nDisallow: /\n",
);
await write(
  "_headers",
  "/*\n  X-Content-Type-Options: nosniff\n  Referrer-Policy: strict-origin-when-cross-origin\n  X-Frame-Options: SAMEORIGIN\n" +
    (production ? "" : "  X-Robots-Tag: noindex, nofollow\n"),
);
await write(
  "_redirects",
  "/ /en/ 302\n/index.html /en/ 302\n" +
    pages
      .filter((p) => p.redirect)
      .flatMap((p) => [`/${p.path} ${p.redirect} 301`, `/${p.path}/ ${p.redirect} 301`])
      .join("\n") +
    "\n",
);
await write(
  "_routes.json",
  JSON.stringify({
    version: 1,
    include: ["/api/contact", "/404", "/404/", "/404.html", "/_not-found", "/_not-found/"],
    exclude: [],
  }),
);
console.log(`Hosting output: ${production ? "production" : "preview"}`);
