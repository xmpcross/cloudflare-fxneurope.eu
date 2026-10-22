// Renders each post's cover.png: a large white line icon on the dithered field
// the site uses. Posts choose the icon and tone in frontmatter (`coverArt`, any
// file name from src/icons/lucide; `coverTone`, ember or smoke). The cover
// doubles as the post's share image. Needs Node 22.18+ (type stripping).
//
//   npm run covers              covers for posts that have none
//   npm run covers -- --force   every cover again

import { existsSync, readdirSync, readFileSync } from "node:fs";
import path from "node:path";
import sharp from "sharp";
import { ditherLevel, scenes } from "../src/lib/dither-scenes.ts";

const root = path.resolve(import.meta.dirname, "..");
const postsDir = path.join(root, "src/content/blog");
const iconsDir = path.join(root, "src/icons/lucide");
const force = process.argv.includes("--force");

const W = 1600;
const H = 1000;
const CELL = 3;
const ICON = 380;
const STROKE = 1.1;

const tones = {
  ember: ["#ff5a1a", "#ff733a", "#ff925f", "#ffb48d", "#ffd5bd", "#fff0e6"],
  smoke: ["#100f0e", "#1d130e", "#36190b", "#66270b", "#b0410f", "#ff6a1f"],
};

const hex = (value) => [1, 3, 5].map((i) => parseInt(value.slice(i, i + 2), 16));

function field(tone, seed) {
  const palette = tones[tone].map(hex);
  const cols = Math.ceil(W / CELL);
  const rows = Math.ceil(H / CELL);
  const state = { aspect: W / H, px: 0.62, py: 0.42, seed };
  const pixels = Buffer.alloc(W * H * 3);
  for (let cy = 0; cy < rows; cy++) {
    for (let cx = 0; cx < cols; cx++) {
      let lum = scenes.silk(cx / cols, cy / rows, 8, state);
      /* On the orange field, pale folds would swallow a white icon: keep the
         middle deep and let the light fall toward the edges. */
      if (tone === "ember") {
        const d = Math.hypot((cx / cols - 0.5) * (W / H), cy / rows - 0.5);
        lum *= Math.min(1, 0.15 + d * 1.4);
      }
      const [r, g, b] = palette[ditherLevel(lum, cx, cy, palette.length)];
      for (let y = cy * CELL; y < Math.min(H, (cy + 1) * CELL); y++) {
        for (let x = cx * CELL; x < Math.min(W, (cx + 1) * CELL); x++) {
          const i = (y * W + x) * 3;
          pixels[i] = r;
          pixels[i + 1] = g;
          pixels[i + 2] = b;
        }
      }
    }
  }
  return pixels;
}

/* The icon's inner markup, drawn in white at cover scale with a soft shadow so
   it holds up on the pale parts of the field. */
function iconSvg(name) {
  const source = readFileSync(path.join(iconsDir, `${name}.svg`), "utf8");
  const inner = source
    .replace(/<!--[\s\S]*?-->/, "")
    .replace(/^[\s\S]*?<svg[^>]*>/, "")
    .replace(/<\/svg>\s*$/, "");
  const scale = ICON / 24;
  const x = (W - ICON) / 2;
  const y = (H - ICON) / 2;
  const group = (stroke) =>
    `<g transform="translate(${x} ${y}) scale(${scale})" fill="none" stroke="${stroke}" stroke-width="${STROKE}" stroke-linecap="round" stroke-linejoin="round">${inner}</g>`;
  return `<svg xmlns="http://www.w3.org/2000/svg" width="${W}" height="${H}" viewBox="0 0 ${W} ${H}">
    <defs><filter id="shadow" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="18"/></filter></defs>
    <g filter="url(#shadow)" opacity="0.28">${group("#000")}</g>
    ${group("#ffffff")}
  </svg>`;
}

function frontmatter(file) {
  const block = readFileSync(file, "utf8").match(/^---\n([\s\S]*?)\n---/)?.[1] ?? "";
  const get = (key) => block.match(new RegExp(`^${key}:\\s*"?([^"\\n]+)"?`, "m"))?.[1]?.trim();
  return { cover: get("cover"), art: get("coverArt"), tone: get("coverTone") };
}

for (const [n, slug] of readdirSync(postsDir).entries()) {
  const dir = path.join(postsDir, slug);
  const source = ["index.md", "index.mdx"].map((f) => path.join(dir, f)).find(existsSync);
  if (!source) continue;
  const out = path.join(dir, "cover.png");
  if (existsSync(out) && !force) continue;

  const meta = frontmatter(source);
  if (meta.cover && !meta.cover.endsWith("cover.png")) continue;
  const icon =
    meta.art && existsSync(path.join(iconsDir, `${meta.art}.svg`)) ? meta.art : "sparkles";
  const tone = tones[meta.tone] ? meta.tone : n % 2 ? "smoke" : "ember";
  const art = await sharp(Buffer.from(iconSvg(icon)))
    .png()
    .toBuffer();
  await sharp(field(tone, n * 7 + 3), { raw: { width: W, height: H, channels: 3 } })
    .composite([{ input: art }])
    .png({ compressionLevel: 9, palette: true, colours: 128 })
    .toFile(out);
  console.log(`${slug}  ${icon} / ${tone}`);
}
