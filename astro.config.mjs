// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";
import pages from "./src/data/pages.json" with { type: "json" };
const indexable = new Set(
  pages
    .filter((p) => !p.redirect && ["en", "et", "de", "es", "fr"].includes(p.path.split("/")[0]))
    .map((p) => `/${p.path}/`),
);

export default defineConfig({
  site: siteConfig.siteUrl,
  trailingSlash: "always",
  /* Class scoping lets a component's styles reach child components it passes `class` to. */
  scopedStyleStrategy: "class",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) => indexable.has(new URL(page).pathname),
    }),
  ],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
