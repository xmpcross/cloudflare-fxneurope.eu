// Renders public/og-image.png, the default share card, from the same dither
// field the site animates. Needs Node 22.18+ (type stripping).
//
//   npm run og

import path from "node:path";
import sharp from "sharp";
import { ditherLevel, scenes } from "../src/lib/dither-scenes.ts";

const root = path.resolve(import.meta.dirname, "..");
const width = 1200;
const height = 630;
const cell = 3;
const palette = ["#ff5a1a", "#ff733a", "#ff925f", "#ffb48d", "#ffd5bd", "#fff0e6"].map((hex) =>
  [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16)),
);
const ink = [17, 17, 16];
const paper = [250, 250, 248];

const pixels = Buffer.alloc(width * height * 3);
const paint = (x0, y0, w, h, [r, g, b]) => {
  for (let y = Math.max(0, y0); y < Math.min(height, y0 + h); y++) {
    for (let x = Math.max(0, x0); x < Math.min(width, x0 + w); x++) {
      const i = (y * width + x) * 3;
      pixels[i] = r;
      pixels[i + 1] = g;
      pixels[i + 2] = b;
    }
  }
};

const cols = Math.ceil(width / cell);
const rows = Math.ceil(height / cell);
const state = { aspect: width / height, px: 0.7, py: 0.4, seed: 4 };
for (let cy = 0; cy < rows; cy++) {
  for (let cx = 0; cx < cols; cx++) {
    const lum = scenes.silk(cx / cols, cy / rows, 8, state);
    paint(cx * cell, cy * cell, cell, cell, palette[ditherLevel(lum, cx, cy, palette.length)]);
  }
}

// "SYNTH" in 5x7 pixel type, on a paper plate.
const glyphs = {
  S: "01111100001000001110000010000111110",
  Y: "10001100010101000100001000010000100",
  N: "10001110011010110011100011000110001",
  T: "11111001000010000100001000010000100",
  H: "10001100011000111111100011000110001",
};
const size = 14;
const word = "SYNTH";
const wx = 80;
const wy = height - 80 - 7 * size;
paint(wx - 24, wy - 24, word.length * 6 * size + 48 - size, 7 * size + 48, paper);
[...word].forEach((letter, index) => {
  [...glyphs[letter]].forEach((bit, i) => {
    if (bit === "1") {
      paint(
        wx + (index * 6 + (i % 5)) * size,
        wy + Math.floor(i / 5) * size,
        size - 2,
        size - 2,
        ink,
      );
    }
  });
});

await sharp(pixels, { raw: { width, height, channels: 3 } })
  .png({ compressionLevel: 9 })
  .toFile(path.join(root, "public/og-image.png"));
console.log("public/og-image.png");
