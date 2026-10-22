import { ditherLevel, scenes, type Scene, type SceneName } from "./dither-scenes";

type RGB = [number, number, number];

const FRAME_MS = 1000 / 24;
/* The field is smooth, so it is sampled every few cells and interpolated. */
const STEP = 6;
const mounted = new WeakSet<HTMLCanvasElement>();

let probe: CanvasRenderingContext2D | null = null;
function parseColor(value: string): RGB {
  probe ??= document.createElement("canvas").getContext("2d", { willReadFrequently: true });
  if (!probe) return [0, 0, 0];
  probe.fillStyle = "#000";
  probe.fillStyle = value.trim();
  probe.fillRect(0, 0, 1, 1);
  const [r, g, b] = probe.getImageData(0, 0, 1, 1).data;
  return [r, g, b];
}

class DitherCanvas {
  private ctx: CanvasRenderingContext2D;
  private image?: ImageData;
  private samples = new Float32Array(0);
  private palette: RGB[] = [];
  private field: Scene;
  private cols = 0;
  private rows = 0;
  private gridW = 0;
  private gridH = 0;
  private cell: number;
  private speed: number;
  private seed: number;
  private t: number;
  private last = 0;
  private raf = 0;
  private running = false;
  private pointer = { x: 0.5, y: 0.5, tx: 0.5, ty: 0.5 };

  constructor(private canvas: HTMLCanvasElement) {
    const ctx = canvas.getContext("2d", { alpha: false });
    if (!ctx) throw new Error("Canvas 2D is unavailable");
    this.ctx = ctx;

    const data = canvas.dataset;
    this.cell = Number(data.cell ?? 2);
    this.speed = Number(data.speed ?? 1);
    this.seed = Number(data.seed ?? 0);
    this.t = Number(data.time ?? 6);
    this.field = scenes[(data.scene ?? "silk") as SceneName] ?? scenes.silk;

    const style = getComputedStyle(canvas);
    this.palette = Array.from({ length: 8 }, (_, i) => style.getPropertyValue(`--dither-${i}`))
      .filter((value) => value.trim() !== "")
      .map(parseColor);

    this.measure();

    new ResizeObserver(() => {
      this.measure();
      this.draw();
    }).observe(canvas);

    new IntersectionObserver(([entry]) => (entry.isIntersecting ? this.start() : this.stop()), {
      rootMargin: "80px",
    }).observe(canvas);

    if (data.interactive === "true") {
      const host = canvas.closest<HTMLElement>("[data-dither-host]") ?? canvas;
      host.addEventListener(
        "pointermove",
        (event) => {
          const box = canvas.getBoundingClientRect();
          this.pointer.tx = (event.clientX - box.left) / box.width;
          this.pointer.ty = (event.clientY - box.top) / box.height;
        },
        { passive: true },
      );
      host.addEventListener("pointerleave", () => {
        this.pointer.tx = 0.5;
        this.pointer.ty = 0.5;
      });
    }
  }

  private measure() {
    const box = this.canvas.getBoundingClientRect();
    if (!box.width || !box.height) return;
    this.cols = Math.ceil(box.width / this.cell);
    this.rows = Math.ceil(box.height / this.cell);
    this.gridW = Math.ceil(this.cols / STEP) + 2;
    this.gridH = Math.ceil(this.rows / STEP) + 2;
    this.samples = new Float32Array(this.gridW * this.gridH);
    this.canvas.width = this.cols;
    this.canvas.height = this.rows;
    this.image = this.ctx.createImageData(this.cols, this.rows);
  }

  private start() {
    if (this.running) return;
    this.running = true;
    this.canvas.dataset.ready = "true";
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      this.draw();
      return;
    }
    this.last = performance.now();
    const loop = (now: number) => {
      if (!this.running) return;
      this.raf = requestAnimationFrame(loop);
      if (now - this.last < FRAME_MS) return;
      this.t += (Math.min(100, now - this.last) / 1000) * this.speed;
      this.last = now;
      this.pointer.x += (this.pointer.tx - this.pointer.x) * 0.04;
      this.pointer.y += (this.pointer.ty - this.pointer.y) * 0.04;
      this.draw();
    };
    this.raf = requestAnimationFrame(loop);
    this.draw();
  }

  private stop() {
    this.running = false;
    cancelAnimationFrame(this.raf);
  }

  draw() {
    const { image, cols, rows, gridW, gridH, samples, palette } = this;
    if (!image || palette.length < 2) return;
    const state = { aspect: cols / rows, px: this.pointer.x, py: this.pointer.y, seed: this.seed };

    for (let gy = 0; gy < gridH; gy++) {
      for (let gx = 0; gx < gridW; gx++) {
        samples[gy * gridW + gx] = this.field(
          (gx * STEP) / cols,
          (gy * STEP) / rows,
          this.t,
          state,
        );
      }
    }

    const data = image.data;
    const levels = palette.length;
    for (let y = 0; y < rows; y++) {
      const gy = Math.floor(y / STEP);
      const fy = (y % STEP) / STEP;
      for (let x = 0; x < cols; x++) {
        const gx = Math.floor(x / STEP);
        const fx = (x % STEP) / STEP;
        const i0 = gy * gridW + gx;
        const top = samples[i0] + (samples[i0 + 1] - samples[i0]) * fx;
        const bottom = samples[i0 + gridW] + (samples[i0 + gridW + 1] - samples[i0 + gridW]) * fx;
        const color = palette[ditherLevel(top + (bottom - top) * fy, x, y, levels)];
        const i = (y * cols + x) * 4;
        data[i] = color[0];
        data[i + 1] = color[1];
        data[i + 2] = color[2];
        data[i + 3] = 255;
      }
    }

    this.ctx.putImageData(image, 0, 0);
  }
}

export function mountDither(scope: ParentNode = document) {
  scope.querySelectorAll<HTMLCanvasElement>("canvas[data-dither]").forEach((canvas) => {
    if (mounted.has(canvas)) return;
    mounted.add(canvas);
    try {
      new DitherCanvas(canvas);
    } catch {
      /* The CSS gradient behind the canvas stays as the fallback. */
    }
  });
}
