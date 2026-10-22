// @ts-check
import { defineConfig } from "astro/config";
import mdx from "@astrojs/mdx";
import sitemap from "@astrojs/sitemap";
import tailwindcss from "@tailwindcss/vite";
import { siteConfig } from "./src/config/site.ts";

export default defineConfig({
  site: siteConfig.siteUrl,
  trailingSlash: "always",
  /* Class scoping lets a component's styles reach child components it passes `class` to. */
  scopedStyleStrategy: "class",
  integrations: [
    mdx(),
    sitemap({
      filter: (page) =>
        !page.includes("/blog/search/") &&
        !page.endsWith("rss.xml") &&
        !page.endsWith("search-index.json"),
    }),
  ],
  markdown: {
    shikiConfig: { theme: "github-light" },
  },
  vite: {
    plugins: [tailwindcss()],
  },
});
