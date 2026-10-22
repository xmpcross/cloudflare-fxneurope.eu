/**
 * Brightness fields for the dither renderer. Shared by the live canvases
 * (`dither.ts`) and the share-card script (`scripts/og-image.mjs`), so this file
 * must stay import-free and use only erasable TypeScript syntax.
 */

export type SceneName = "silk" | "smoke" | "glow" | "bands";

export interface SceneState {
  /** Width / height of the drawing surface. */
  aspect: number;
  /** Pointer, 0-1 across the surface. Rests at the centre. */
  px: number;
  py: number;
  seed: number;
}

/** Returns 0-1 for a point where x and y run 0-1 and t is seconds. */
export type Scene = (x: number, y: number, t: number, s: SceneState) => number;

function hash(ix: number, iy: number, seed: number): number {
  let h = (Math.imul(ix, 374761393) + Math.imul(iy, 668265263) + Math.imul(seed, 982451653)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h ^= h >>> 16;
  return (h >>> 0) / 4294967295;
}

function noise(x: number, y: number, seed: number): number {
  const xi = Math.floor(x);
  const yi = Math.floor(y);
  const xf = x - xi;
  const yf = y - yi;
  const u = xf * xf * (3 - 2 * xf);
  const v = yf * yf * (3 - 2 * yf);
  const a = hash(xi, yi, seed);
  const b = hash(xi + 1, yi, seed);
  const c = hash(xi, yi + 1, seed);
  const d = hash(xi + 1, yi + 1, seed);
  return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
}

function fbm(x: number, y: number, seed: number, octaves = 3): number {
  let sum = 0;
  let amp = 0.5;
  let norm = 0;
  for (let i = 0; i < octaves; i++) {
    sum += noise(x, y, seed + i * 31) * amp;
    norm += amp;
    amp *= 0.5;
    x *= 2.03;
    y *= 2.03;
  }
  return sum / norm;
}

const clamp = (v: number): number => (v < 0 ? 0 : v > 1 ? 1 : v);
const smooth = (a: number, b: number, v: number): number => {
  const k = clamp((v - a) / (b - a));
  return k * k * (3 - 2 * k);
};

/** Broad, slow folds of colour. The default background field. */
const silk: Scene = (x, y, t, s) => {
  const X = x * s.aspect * 1.1;
  const Y = y * 1.1;
  const wx = fbm(X * 0.8 + t * 0.03, Y * 0.8, s.seed) * 1.8;
  const wy = fbm(X * 0.8, Y * 0.8 - t * 0.025, s.seed + 7) * 1.8;
  const n = fbm(X + wx + (s.px - 0.5) * 0.3, Y + wy + (s.py - 0.5) * 0.3, s.seed + 13);
  return smooth(0.3, 0.72, n);
};

/** Dark ground with bright plumes rising through it. */
const smoke: Scene = (x, y, t, s) => {
  const X = x * s.aspect * 1.4;
  const Y = y * 1.4;
  const warp = fbm(X * 0.7 - t * 0.02, Y * 0.7 + t * 0.03, s.seed) * 2.2;
  const n = fbm(X + warp, Y * 0.6 + warp * 0.5, s.seed + 5, 4);
  return clamp(smooth(0.32, 0.74, n) * (0.55 + 0.7 * y));
};

/** A soft light that drifts toward the pointer. */
const glow: Scene = (x, y, t, s) => {
  const cx = 0.5 + (s.px - 0.5) * 0.35 + Math.sin(t * 0.15) * 0.08;
  const cy = 0.45 + (s.py - 0.5) * 0.25 + Math.cos(t * 0.12) * 0.06;
  const d = Math.hypot((x - cx) * s.aspect, y - cy);
  const grain = fbm(x * s.aspect * 2 + t * 0.04, y * 2, s.seed) * 0.25;
  return clamp(1 - smooth(0.05, 0.85, d) + grain - 0.1);
};

/** Wide diagonal bands, gently shifting. */
const bands: Scene = (x, y, t, s) => {
  const X = x * s.aspect;
  const n = fbm(X * 0.6 + t * 0.02, y * 0.6, s.seed) * 1.4;
  const v = Math.sin((X * 1.3 + y * 0.9) * 2.4 + n * 2.2 - t * 0.12);
  return smooth(-0.6, 0.9, v);
};

export const scenes: Record<SceneName, Scene> = { silk, smoke, glow, bands };

export const bayer8 = (() => {
  const m = [0, 2, 3, 1];
  const out = new Float32Array(64);
  for (let y = 0; y < 8; y++) {
    for (let x = 0; x < 8; x++) {
      let v = 0;
      let size = 1;
      for (let bit = 2; bit >= 0; bit--) {
        v += m[((y >> bit) & 1) * 2 + ((x >> bit) & 1)] * size;
        size *= 4;
      }
      out[y * 8 + x] = (v + 0.5) / 64;
    }
  }
  return out;
})();

/**
 * Ordered dither of a brightness into one of `levels` palette slots. Only the
 * two slots either side of a value ever mix, so a palette of close shades reads
 * as fine grain rather than pixel art.
 */
export function ditherLevel(lum: number, cx: number, cy: number, levels: number): number {
  const scaled = clamp(lum) * (levels - 1);
  const low = Math.floor(scaled);
  return scaled - low > bayer8[(cy & 7) * 8 + (cx & 7)] ? Math.min(levels - 1, low + 1) : low;
}
