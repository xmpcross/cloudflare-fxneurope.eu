# Customization Guide

Use this guide when adapting Synth for a real product.

## Site Settings

Edit [src/config/site.ts](./src/config/site.ts) first. It controls the product name, tagline, default metadata, canonical domain, language and date locale, contact email, the header calls to action, the newsletter form, and social links.

Update `siteConfig.siteUrl` before building for production. Canonical URLs, social image URLs, RSS, robots, sitemap, and JSON-LD all depend on it.

`siteConfig.actions` holds the two calls to action used across the site:

- `primary` is the "Book a demo" button in the header, the hero, the mobile menu, and the closing band. It ships pointing at the contact page; point it at a booking page if you use one.
- `signIn` is the "Sign in" link in the header and the mobile menu. It ships pointing at `https://app.example.com/`; replace it with your app's login URL or remove it from `SiteHeader.astro`.

The logo and logomark are SVGs in [src/assets/brand](./src/assets/brand), inlined by [src/components/ui/Wordmark.astro](./src/components/ui/Wordmark.astro) in the header and footer and by [src/components/ui/Logomark.astro](./src/components/ui/Logomark.astro) in the chat headers. Both use `fill="currentColor"`, so they take the text colour of wherever they sit; replace the files with your own and keep that fill. Right-clicking the logo opens a small menu, [src/components/chrome/LogoMenu.astro](./src/components/chrome/LogoMenu.astro), to copy the logo as SVG or download it. The favicon, [public/favicon.svg](./public/favicon.svg), is the logomark in the accent orange on a transparent ground. `siteConfig.name` still names the product in page titles, the feed, the structured data, and the logo accessible label.

## Navigation and Mega Menu

The header, the mega menu, and the mobile menu all read `navigation` in [src/config/site.ts](./src/config/site.ts). Each entry is either a plain link or a menu:

```ts
{ label: "Pricing", href: "/pricing/" },
{
  label: "Platform",
  feature: "tour",
  columns: [
    {
      title: "Build",
      links: [{ label: "Agent Studio", href: "/#build", description: "Persona, tone and limits in one place" }],
    },
  ],
},
```

- `columns` takes two or three columns. Leave `title` off a column to continue the one before it without a heading.
- `description` is the line under each link. It is optional.
- `feature` picks the panel on the right of the menu: `tour` is a dithered panel linking to the product tour, `story` shows the first customer result from `src/config/home.ts`, and `latest` shows the newest blog post. Leave it off for no panel.

The header has a solid background and slides out of view as you scroll down, returning as soon as you scroll up; it always shows near the top of the page and while a menu is open. The menu opens on click and on hover with a short intent delay, `Arrow Down` on a trigger opens it and focuses the first link, and moving onto another link in the bar, `Escape`, a click outside, or tabbing away closes it. From `80rem` up the menu sits centred between the logo and the calls to action; below that it follows the logo. Below `64rem` the same entries render as a full-screen menu, with each menu as an expandable group.

The footer columns are `footerNavigation` in the same file.

The demo points menu links at homepage sections (`/#build`, `/#banking`), the retail industry page, blog topics, and the about, careers and contact pages. Linking to `#build`, `#run`, or `#grade` opens that tab of the product tour, and linking to an industry id such as `#banking` opens that industry panel. When you add real pages, point the links at them instead.

## Homepage

The homepage is assembled in [src/pages/index.astro](./src/pages/index.astro) from independent sections in [src/components/home](./src/components/home). Reorder or remove them freely. Every word of copy lives in [src/config/home.ts](./src/config/home.ts):

| Section      | Component            | Config key                   |
| ------------ | -------------------- | ---------------------------- |
| Hero         | `Hero.astro`         | `hero`                       |
| Logo wall    | `LogoWall.astro`     | `logoWall`, `hero.logosLine` |
| Stats        | `Stats.astro`        | `stats`                      |
| Product tour | `Tour.astro`         | `tour`                       |
| Trace        | `Trace.astro`        | `trace`                      |
| Integrations | `Integrations.astro` | `integrations`               |
| Industries   | `Industries.astro`   | `industries`                 |
| Customers    | `Testimonials.astro` | `testimonials`               |
| Security     | `Security.astro`     | `security`                   |
| Compliance   | `Compliance.astro`   | `compliance`                 |
| FAQ          | `Faq.astro`          | `faq`                        |
| Latest posts | `LatestPosts.astro`  | the three newest posts       |
| Closing band | `Closing.astro`      | `closing`                    |

A few sections are worth knowing in more detail:

- **Hero.** `hero.photo` is the photograph on the left of the stage and `hero.conversation` is the chat widget on the right. Each message has a `from` of `agent`, `customer`, or `receipt`, a `text`, and a `time`; a `receipt` renders as an action card and takes a `detail` line. Messages play out one at a time with a typing indicator before each agent reply, and the widget reserves their space so nothing below it moves.
- **Stats.** Each stat has a `value`, an optional `suffix`, and `decimals` for values such as `0.8`. They count up once as they enter the viewport.
- **Product tour.** Three tabs that advance every nine seconds while the section is on screen. Any click, arrow key, or focus inside a panel stops the rotation for good. Each tab has its own panel over the dithered backdrop. Build takes `cards`, status rows with an `icon`, a `title`, a `detail`, and a `status` of `done` or `pending`. Run takes a `call`, a phone `line` and a `transcript` of `customer` and `agent` lines that appear in turn, and `channels`, each with a `label` and a `live` count. Grade takes a `trend` of daily scores with its alert `threshold`, the `conversations` count, and a `rubric` of scores. Tab ids double as deep links.
- **Trace.** `trace.facts` are the three figures under the heading, each with a `value` and a `label`; they sit at the foot of the column so it lines up with the panel. `trace.steps` is the timeline under the conversation, which reuses the first question and answer from `hero.conversation`. Each step has a `label`, a `detail`, and `at`, its time in milliseconds. It plays once when it scrolls into view, and the Replay button runs it again.
- **Integrations.** `routes` is the model-routing table: each flow `step` has a `tier` and `options`, the models it can run on, each with a `model` name and a median latency in `ms` that sets the bar length. The first option shows on load and the table swaps them in turn while it is on screen. `systems` is the list beside it, each with a `label`, a short `detail` of what the agent does with that system, and a `calls` count that ticks up while the section is on screen.
- **Industries.** Each item has an `image`, its `imageAlt`, and a `credit`. An optional `href` adds a button to the open panel, linking to that industry's page. Collapsed panels show the photo darkened in greyscale; the open panel shows it in full colour. Panels open on hover on desktop and on tap everywhere else.
- **Customers.** Each testimonial has a `photo` and a `credit`, and uses a fictional company drawn in [src/components/ui/CompanyLogo.astro](./src/components/ui/CompanyLogo.astro). Replace them with real quotes from real customers, each with their permission, and swap the marks for their logos.
- **Compliance.** A grid of standards above the FAQ, one box each, with a `name`, an `icon` (a file name from [src/icons/lucide](./src/icons/lucide)), and a short `note`, and a `note` sentence underneath. Only list standards the product actually meets.

### Logo wall

The wall scrolls in two rows in opposite directions and pauses on hover. Logos render in one even colour and darken on hover. Under reduced motion the wall becomes a static wrapped grid.

The demo logos are real company wordmarks from Wikimedia Commons, in [src/assets/logos](./src/assets/logos). They are trademarks of their owners and are included as placeholders only. [src/components/ui/BrandLogo.astro](./src/components/ui/BrandLogo.astro) inlines each SVG and redraws it in one colour: coloured and dark fills become the ink, and near-white fills become the wall background, so knockouts stay cut out. To show your own customers, drop their SVG wordmarks into that folder and list their file names in `logoWall`. [src/components/ui/BrandLogo.astro](./src/components/ui/BrandLogo.astro) sizes each logo by area rather than height, so a long wordmark and a compact one carry the same visual weight.

## Pricing Page

[src/pages/pricing.astro](./src/pages/pricing.astro) shows the plan cards, the comparison table, an FAQ, and the closing band. Everything on it lives in [src/config/pricing.ts](./src/config/pricing.ts):

- **Plans.** Each plan has an `id`, a `name`, a `description`, `highlights` for its card, and a `cta`. Set `monthly` and `annual` to monthly amounts in dollars, or both to `null` for a "Custom" plan. `featured: true` inverts one card and highlights its column in the table. The billing toggle is two native radio buttons and updates the cards and the table together.
- **Comparison table.** `groups` are the sections of the table, each with a `name` and `rows`. A row has a `name`, an optional `hint` under it, and `values`, one per plan in plan order: `true` shows a check, `false` a dash, and a string is shown as written. The plan header stays pinned under the site header while the table scrolls. On phones the table shows one plan at a time, the featured one first, and a switcher above it picks another.
- **FAQ.** `faq` has its own `title` and `items`, rendered by the same `Faq.astro` as the homepage.

## Dither Engine

The textured backgrounds behind the hero, the stats, the tour, the trace, the model routing table, the closing band, the mega menu tour panel, and the about, careers and 404 pages are drawn by one engine in [src/lib/dither.ts](./src/lib/dither.ts), mounted through [src/components/ui/Dither.astro](./src/components/ui/Dither.astro):

```astro
<Dither scene="silk" tone="ember" seed={4} speed={0.6} interactive class="absolute! inset-0" />
```

- `scene` is the shape of the field: `silk` for broad folds, `smoke` for plumes rising through a dark ground, `glow` for a soft light, or `bands` for wide diagonal stripes. Scenes are plain functions in [src/lib/dither-scenes.ts](./src/lib/dither-scenes.ts) that return a brightness for a point and a time, so adding one means writing a function and registering it in `scenes`.
- `tone` is the palette: `ember` for the orange field, `smoke` for the dark one, and `haze` for a pale wash on light pages.
- `cell` is the grain size in CSS pixels, 2 by default.
- `seed` shifts the noise, so two blocks using the same scene still differ.
- `speed` scales the drift.
- `interactive` nudges the field toward the pointer across the nearest element with `data-dither-host`.

Each tone is a ramp of close shades, set as `--dither-0` to `--dither-5` in [src/styles/global.css](./src/styles/global.css), and the engine only ever mixes two neighbouring shades. That is what keeps the grain fine and the effect subtle. Each tone also sets a CSS gradient, which is what shows before the canvas fades in and wherever JavaScript is off.

The engine samples the field on a coarse grid and interpolates, draws at 24 frames per second, stops completely when a canvas leaves the viewport, and draws a single still frame under `prefers-reduced-motion`.

## Images

Photographs live in [src/assets/images](./src/assets/images) and are imported in the config for their page ([src/config/home.ts](./src/config/home.ts), [src/config/about.ts](./src/config/about.ts), [src/config/careers.ts](./src/config/careers.ts)), so Astro resizes them and serves responsive sources. Replace a file in place, or import a new one and point the config at it. Keep the `credit` and `photoCredit` fields up to date for anything that needs attribution.

## Blog

Posts live in [src/content/blog](./src/content/blog), one folder per post. The folder name is the URL. Frontmatter is validated by [src/content.config.ts](./src/content.config.ts):

```yaml
---
title: "Why our refund flow never asks the model for permission"
description: "Between 40 and 220 characters, used on cards, in search, and as the meta description."
date: 2026-09-16
updated: 2026-09-20 # optional
topic: Engineering
author: Tomasz Wrona
coauthors: [Ines Moreau] # optional, more names on the byline
cover: ./cover.png
coverAlt: "A white branching-flow icon on an orange dithered field"
coverArt: git-branch # optional, the icon npm run covers draws
coverTone: ember # optional, ember or smoke
tags: [flows, reliability]
cta: # optional, see below
  after: 2
featured: true # optional, pins the post to the lead slot
draft: false # optional
---
```

- `topic` must be one of the topics in [src/config/blog.ts](./src/config/blog.ts). Add, remove, or rename topics there, with a one-line description each; the topic pages, the topic filter, and the schema all follow.
- `author` is looked up in `authors` in the same file for a role and an optional `photo` with its `credit`. The portrait shows in greyscale, as a circle in the byline and in the author card at the foot of the post. A name with no entry still builds, with the logomark in place of a portrait.
- `coauthors` adds more names after `author`, each looked up the same way. The byline overlaps their portraits and joins the names ("Ines Moreau & Tomasz Wrona"), the author card gives each one a row, and search, the feed, and the structured data list every name.
- `draft: true` keeps a post out of every listing, feed, search index, and route in production. Drafts still show in `npm run dev`.
- `POSTS_PER_PAGE` in `src/config/blog.ts` sets the page size for the index and topic archives. The first page opens with the featured post, or the newest if none is flagged.

Every post carries a call-to-action band on the orange dither, [src/components/blog/PostCta.astro](./src/components/blog/PostCta.astro). Its copy is `postCta` in `src/config/blog.ts` and its button is `siteConfig.actions.primary`. By default it closes the post; a `cta` block in frontmatter moves it and changes its copy for that post:

```yaml
cta:
  after: 2 # below the second ## section
  eyebrow: Planning a launch
  title: Walk through the five weeks with our team
  body: We will map the plan onto your queue.
  label: Talk to us
  href: /pricing/
```

Every field is optional, and `cta: false` removes the band. The band is moved into place by a line of inline script as the page loads, so it works in `.md` and `.mdx` posts alike and stays at the end of the post without JavaScript. The component takes the same fields as props, so it can be reused anywhere else on the site.

On the post page, every `##` heading becomes an entry in the table of contents and every `###` nests under the `##` before it, on its own indented rail; the list tracks the reader's position. Code blocks get a language label and a copy button. Tables, blockquotes, and lists are styled in `.prose` in [src/styles/global.css](./src/styles/global.css).

## Blog Covers

Covers are a large white line icon on the same dithered field the homepage uses, drawn by [scripts/covers.mjs](./scripts/covers.mjs) into each post's folder as `cover.png`. The cover is also the post's share image, cropped to 1200x630 at build time.

```bash
npm run covers            # covers for posts that have none
npm run covers -- --force # every cover again
```

Each post picks its icon with `coverArt`, any file name from [src/icons/lucide](./src/icons/lucide) without the extension, and its field with `coverTone`: `ember` for orange or `smoke` for dark. The orange field is kept deep in the middle so the icon always sits on colour. To use an icon the theme does not ship, add its SVG from [Lucide](https://lucide.dev/) to that folder. Leave either field off and the script picks one. Remember to write a `coverAlt` that describes the picture. The script needs Node.js `22.18.0` or newer.

A photograph works as a cover too: drop a `cover.jpg` into the folder, point `cover` at it, and add a `coverCredit` with the photographer's `name` and `url`, which prints under the image.

## Sharing

Every post has a Share button beside the byline and in the sidebar. Both open one share sheet, [src/components/blog/ShareSheet.astro](./src/components/blog/ShareSheet.astro), a native `<dialog>` with X, LinkedIn, Facebook, email, WhatsApp, Telegram, and Threads, plus Bluesky, Mastodon, Reddit, and Pinterest behind "More", and the page link with a copy button. Every target is a plain link, so sharing works even where the clipboard is unavailable. Add or remove networks in the `targets` and `extraTargets` lists at the top of the file; each takes a label, a Bootstrap icon from [src/icons/bootstrap](./src/icons/bootstrap) addressed as `social-<file name>`, a brand colour, and a share URL.

## Search

Search covers the blog, so it only appears there: the "Search posts" button in the blog header, `Ctrl + K` or `Command + K`, or `/` outside a form field opens the palette in [src/components/chrome/SearchDialog.astro](./src/components/chrome/SearchDialog.astro), and `/blog/search/` is a full results page that lists every post without JavaScript and filters as you type. Both rank results with the same function in [src/lib/search.ts](./src/lib/search.ts): title matches first, then topic and tags, then everything else, matched on word starts.

The index is served from [src/pages/search-index.json.ts](./src/pages/search-index.json.ts) and fetched the first time search is opened, not on page load. It carries each post's title, description, topic, author, date, tags, and URL, but not its body. It is comfortable up to several hundred posts. For full-text search across a large archive, consider [Pagefind](https://pagefind.app/), which indexes the built HTML and needs no server.

## Industry Pages

[src/pages/industries/[slug].astro](./src/pages/industries/[slug].astro) builds one page per entry in `industryPages` in [src/config/industries.ts](./src/config/industries.ts). The demo ships Retail at `/industries/retail/` as a template. To add another industry, copy the retail entry, give it a new `slug`, and set `href` on its homepage panel and its menu link to `/industries/<slug>/`.

Each entry holds:

- **Header.** `name`, `title`, `lead`, a `photo` with `photoAlt` and `photoCredit`, and four `metrics` laid over the photo.
- **Intents.** `intents.items` is the table of the conversations that fill the queue. Each has an `intent`, an `example` quote, a `share` and a `resolved` percentage, and the `flow` that handles it. A `resolved` of `0` reads "To a person".
- **Flow.** `flow.photo` with its `photoAlt` and `photoCredit` sits beside the copy, with two cards over it: the customer’s `question` and the `result` of the flow, a `title` and a `detail`. `flow.points` are the checked lines beside it.
- **Peak.** `peak.days` is the line chart, one day each with a `date`, total `contacts`, and the `handedOff` part drawn as the lower line. `highlight` marks a day on the line. The headline shows the busiest day; a crosshair follows the pointer, a tap, or the arrow keys, and the headline follows it.
- **Systems.** `systems.items` lists each connected system with an `icon`, and what the agent `reads` and `writes`.
- **Story, FAQ and closing.** `story` is the `name` of a testimonial in [src/config/home.ts](./src/config/home.ts). `faq` has its own `title` and `items`, and `closing` is the `title` and `body` of the band at the foot of the page.

## Contact

The contact page is [src/pages/contact.astro](./src/pages/contact.astro), with its copy in [src/config/contact.ts](./src/config/contact.ts): the headline, the `topics` in the "I'd like to…" select at the top of the form, the `teamSizes` in the select, the `routes` beside the form under `routesTitle` (each with a `label`, a `detail`, and an `email`), and the `offices`, each with a `city` and an `address`.

Link to `/contact/?topic=<value>` to preselect a topic; the pricing plans do this. The form posts `topic`, `name`, `email`, `company`, `team_size`, and `message` to `siteConfig.contact`:

```ts
contact: {
  enabled: true,
  action: "https://example.com/contact",
  method: "post",
}
```

It only submits when `enabled` is `true` and `action` is set. Until then the fields can be filled in but the send button is disabled, and a note says so.

## About

The about page is [src/pages/about.astro](./src/pages/about.astro), with all its content in [src/config/about.ts](./src/config/about.ts): the headline, the team photo, the story, four facts, the milestones, the leadership portraits (each with a `photo` and `credit`, shown in greyscale), the team globe, and the closing call to careers. `team.places` are the pins on the globe in [src/components/about/TeamGlobe.astro](./src/components/about/TeamGlobe.astro): each has a `city`, a `country`, a `people` count, a `location` as `[latitude, longitude]`, and `hub: true` for the hubs. The globe spins on its own and can be dragged; each place types out its label as it turns to the front. The people, country and hub totals above it are counted from these entries. The closing band counts the open roles in [src/config/careers.ts](./src/config/careers.ts).

## Careers

The careers page is [src/pages/careers.astro](./src/pages/careers.astro), with all its content in [src/config/careers.ts](./src/config/careers.ts): the headline, the photo, three facts, the values, the benefits, the open roles, and the closing prompt.

Each role has a `title`, a `team`, a `location`, a `type`, and an `applyUrl`. Roles are grouped by team in the order they first appear, and a filter above the list shows one team at a time. `applyUrl` is where the row links; the demo leaves it empty, so rows render without a link until you point each one at its posting in Ashby, Greenhouse, Lever, or any other applicant tracking system.

## Feeds and Social Cards

`/rss.xml` carries the twenty newest posts. Posts share their own cover, cropped to 1200x630 at build time; every other page uses `public/og-image.png`. That card is rendered by [scripts/og-image.mjs](./scripts/og-image.mjs) from the same dither field the site uses, with the product name in pixel type. Run `npm run og` to regenerate it after renaming the product; it needs Node.js `22.18.0` or newer.

Structured data is built in [src/lib/schema.ts](./src/lib/schema.ts): `Organization` and `WebSite` on every page, and `BlogPosting` with a `BreadcrumbList` on posts.

## Newsletter

The footer signup is provider-neutral. Configure `siteConfig.newsletter`:

```ts
newsletter: {
  enabled: true,
  action: "https://example.com/subscribe",
  method: "post",
  emailFieldName: "email",
  title: "Product notes, once a month.",
  description: "What shipped, what we measured, and what we got wrong.",
}
```

The form only submits when `enabled` is `true` and `action` is set. Until then the field and button are disabled, and a note says so.

## Adding Pages

To add a page such as `/press/`, create `src/pages/press.astro`, wrap it in `BaseLayout`, and reuse the pieces already in the theme — `.shell` for the page width, `text-display-lg` and `text-lead` for headings and intros, `on-night` for dark sections, and `Dither` for textured backgrounds. [src/pages/about.astro](./src/pages/about.astro) and [src/pages/careers.astro](./src/pages/careers.astro) are good starting points. Then link to it from `navigation` or `footerNavigation`.

## Icons

Interface icons come from [Lucide](https://lucide.dev/) in [src/icons/lucide](./src/icons/lucide) and social and share marks from Bootstrap Icons in [src/icons/bootstrap](./src/icons/bootstrap), each folder with its license notice. [src/components/ui/Icon.astro](./src/components/ui/Icon.astro) loads both by file name: `<Icon name="arrow-up-right" />` for a Lucide outline, and `<Icon name="social-linkedin" />` for a Bootstrap mark. To add an icon, drop its SVG into the right folder and use its file name. Social links in the footer are mapped from their labels in [src/lib/socials.ts](./src/lib/socials.ts).

## Theme Tokens

Colours, type sizes, and the page width are custom properties at the top of [src/styles/global.css](./src/styles/global.css), exposed to Tailwind as utilities (`bg-page`, `text-muted`, `bg-accent`, `bg-night`, and so on).

- `--page`, `--surface`, and `--sunken` are the three light grounds. Cards sit on `--surface`, and alternating sections use `--sunken`.
- `--night` and `--night-raised` are the dark grounds for the security block and the footer, with `--night-ink` and `--night-muted` for their text.
- `--accent` is the only saturated colour. `--accent-ink` is a darker orange for text on light grounds, where the accent itself would fail contrast.
- `--measure` is the content width and `--gutter` the side padding, used by `.shell`.
- The `text-display-*`, `text-title`, and `text-lead` sizes are fluid, set in the `@theme` block.

There are no border radii anywhere in the theme; a base rule sets `border-radius: 0` on every element. Remove that rule if you want rounded corners back.

To change the accent, set `--accent` and `--accent-ink`, then update the `ember` and `smoke` ramps under `.tone-ember` and `.tone-smoke` so the textured fields follow, and the palette at the top of `scripts/og-image.mjs` before regenerating the share card.

## Fonts

Synth self-hosts two OFL-licensed variable fonts in [public/fonts/geist](./public/fonts/geist): **Geist** for everything and **Geist Mono** for meta lines, timestamps, code, and badges. Headings use a weight of 450 with tight tracking.

To swap typefaces, replace the `@font-face` rules and the `--font-sans` and `--font-mono` tokens at the top of `global.css`, and update the font preload in [src/layouts/BaseLayout.astro](./src/layouts/BaseLayout.astro).

## Motion

- Hero and page headers rise in once on load with a short stagger (the `rise` class, delayed by `--i`).
- Sections below the fold carry `reveal`, which animates on a CSS view timeline where supported and falls back to a small IntersectionObserver in `BaseLayout.astro` elsewhere.
- Buttons fill from left to right on hover, and their arrow nudges forward.
- The dither fields, the logo marquee, the tour rotation, the trace timeline, the stat counters, the model routing swaps, the chat, and the about-page globe all stop or settle into a final frame under `prefers-reduced-motion: reduce`.
