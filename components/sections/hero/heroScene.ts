import { clamp, lerp, mapRange } from "@/lib/utils";

/**
 * Procedural cinematic hero renderer.
 *
 * Instead of shipping a heavy video file, we render a "scroll-controlled
 * film": an architectural space that CONSTRUCTS itself as scroll progress
 * moves 0 → 1. The camera travels through depth, lines draw on, a monolith
 * assembles, and light passes across the scene. Cursor adds parallax; scroll
 * velocity adds subtle energy. Every frame is a function of (progress, pointer,
 * velocity) — the visitor literally controls time.
 */

export type HeroInput = {
  progress: number; // 0..1 scroll through hero
  px: number; // pointer -1..1
  py: number;
  velocity: number; // -1..1 smoothed scroll velocity
  time: number; // ms
};

const ACCENT = "192, 139, 92"; // champagne copper rgb
const LINE = "196, 187, 172";

function grid(
  ctx: CanvasRenderingContext2D,
  w: number,
  h: number,
  cx: number,
  cy: number,
  progress: number,
  depth: number,
  alpha: number
) {
  const spacing = 90 * depth;
  const cols = Math.ceil(w / spacing) + 4;
  const rows = Math.ceil(h / spacing) + 4;
  ctx.save();
  ctx.strokeStyle = `rgba(${LINE}, ${alpha})`;
  ctx.lineWidth = 1;
  ctx.beginPath();
  const offX = (cx * 0.4) % spacing;
  const offY = (cy * 0.4) % spacing;
  for (let i = -2; i < cols; i++) {
    const x = i * spacing + offX;
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
  }
  for (let j = -2; j < rows; j++) {
    const y = j * spacing + offY;
    ctx.moveTo(0, y);
    ctx.lineTo(w, y);
  }
  ctx.stroke();
  ctx.restore();
}

/** Draw a partially-constructed rectangle: a fraction 0..1 of its perimeter. */
function drawAssemble(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  w: number,
  h: number,
  frac: number,
  color: string,
  lw = 1.5
) {
  const perim = 2 * (w + h);
  const target = perim * clamp(frac);
  ctx.save();
  ctx.strokeStyle = color;
  ctx.lineWidth = lw;
  ctx.beginPath();
  ctx.setLineDash([perim]);
  ctx.lineDashOffset = perim - target;
  ctx.rect(x, y, w, h);
  ctx.stroke();
  ctx.restore();
}

export function renderHero(ctx: CanvasRenderingContext2D, w: number, h: number, input: HeroInput) {
  const { progress, px, py, velocity, time } = input;
  const cx = w / 2;
  const cy = h / 2;

  ctx.clearRect(0, 0, w, h);

  // Background vignette + warm depth
  const bg = ctx.createRadialGradient(cx + px * 120, cy + py * 80, 0, cx, cy, Math.max(w, h) * 0.8);
  bg.addColorStop(0, "#171310");
  bg.addColorStop(0.55, "#0e0c09");
  bg.addColorStop(1, "#080706");
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, w, h);

  // Camera travel: zoom in through the space as we progress
  const zoom = lerp(1, 2.4, progress);
  const rot = lerp(0, 0.06, progress) + velocity * 0.01;
  const parX = px * lerp(20, 70, progress);
  const parY = py * lerp(14, 50, progress);

  // ---- Far layer: awakening grid (phase 1) ----
  const gridAlpha = mapRange(clamp(progress, 0, 0.55), 0, 0.55, 0, 0.12) * (1 - progress * 0.4);
  if (gridAlpha > 0.002) {
    grid(ctx, w, h, cx + parX * 0.3, cy + parY * 0.3, progress, lerp(1, 1.8, progress), gridAlpha);
  }

  ctx.save();
  ctx.translate(cx + parX, cy + parY);
  ctx.rotate(rot);
  ctx.scale(zoom, zoom);
  ctx.translate(-cx, -cy);

  // ---- Depth planes converging to center (the "corridor") ----
  const planes = 6;
  for (let i = 0; i < planes; i++) {
    const t = i / planes;
    const appear = clamp(mapRange(progress, 0.05 + t * 0.1, 0.35 + t * 0.12, 0, 1));
    if (appear <= 0) continue;
    const scale = lerp(0.16, 1.15, t) * lerp(1, 1.3, progress);
    const pw = w * scale;
    const ph = h * scale;
    const alpha = appear * lerp(0.5, 0.06, t);
    drawAssemble(
      ctx,
      cx - pw / 2,
      cy - ph / 2,
      pw,
      ph,
      appear,
      `rgba(${LINE}, ${alpha})`,
      lerp(1.4, 0.6, t)
    );
  }

  // ---- Central monolith constructing (phase 4) ----
  const mFrac = clamp(mapRange(progress, 0.32, 0.72, 0, 1));
  if (mFrac > 0) {
    const mw = w * 0.16;
    const mh = h * 0.5;
    const mx = cx - mw / 2;
    const my = cy - mh / 2;
    // slab fill grows from base
    const fillH = mh * clamp(mapRange(progress, 0.45, 0.8, 0, 1));
    const grad = ctx.createLinearGradient(mx, my, mx + mw, my + mh);
    grad.addColorStop(0, `rgba(${ACCENT}, ${0.1 * mFrac})`);
    grad.addColorStop(1, `rgba(${LINE}, ${0.02 * mFrac})`);
    ctx.fillStyle = grad;
    ctx.fillRect(mx, my + (mh - fillH), mw, fillH);
    drawAssemble(ctx, mx, my, mw, mh, mFrac, `rgba(${LINE}, ${0.6 * mFrac})`, 1.5);
    // horizontal registration lines
    ctx.save();
    ctx.strokeStyle = `rgba(${LINE}, ${0.18 * mFrac})`;
    ctx.lineWidth = 1;
    for (let k = 1; k < 6; k++) {
      const yy = my + (mh / 6) * k;
      ctx.beginPath();
      ctx.moveTo(mx, yy);
      ctx.lineTo(mx + mw, yy);
      ctx.stroke();
    }
    ctx.restore();
  }

  // ---- Emerging structure nodes (phase 4: projects/AI/brand emerging) ----
  const nodeProg = clamp(mapRange(progress, 0.5, 0.92, 0, 1));
  if (nodeProg > 0) {
    const N = 5;
    ctx.save();
    for (let i = 0; i < N; i++) {
      const ang = (i / N) * Math.PI * 2 + time * 0.00006 + progress * 1.2;
      const rad = lerp(w * 0.08, w * 0.34, nodeProg) * (0.7 + 0.3 * Math.sin(i * 2.1));
      const nx = cx + Math.cos(ang) * rad;
      const ny = cy + Math.sin(ang) * rad * 0.6;
      const r = 2.5 + Math.sin(time * 0.002 + i) * 0.8;
      // connecting line to core
      ctx.strokeStyle = `rgba(${ACCENT}, ${0.16 * nodeProg})`;
      ctx.lineWidth = 0.8;
      ctx.beginPath();
      ctx.moveTo(cx, cy);
      ctx.lineTo(nx, ny);
      ctx.stroke();
      // node
      ctx.fillStyle = `rgba(${ACCENT}, ${0.9 * nodeProg})`;
      ctx.beginPath();
      ctx.arc(nx, ny, r, 0, Math.PI * 2);
      ctx.fill();
    }
    ctx.restore();
  }

  ctx.restore();

  // ---- Sound-wave motion strip (phase 1 visual, upper area) ----
  const waveAlpha = mapRange(clamp(progress, 0, 0.4), 0, 0.4, 0, 1) * (1 - clamp(mapRange(progress, 0.4, 0.7, 0, 1)));
  if (waveAlpha > 0.01) {
    ctx.save();
    ctx.strokeStyle = `rgba(${ACCENT}, ${0.5 * waveAlpha})`;
    ctx.lineWidth = 1.2;
    ctx.beginPath();
    const baseY = h * 0.5;
    const amp = 20 + Math.abs(velocity) * 60;
    for (let x = 0; x <= w; x += 6) {
      const n =
        Math.sin(x * 0.012 + time * 0.0022) * 0.6 +
        Math.sin(x * 0.037 - time * 0.0031) * 0.4;
      const env = Math.sin((x / w) * Math.PI); // fade at edges
      const y = baseY + n * amp * env;
      if (x === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
    }
    ctx.stroke();
    ctx.restore();
  }

  // ---- Light sweep across the scene ----
  const sweep = (progress * 1.4 + time * 0.00004) % 1;
  const sx = sweep * (w + 400) - 200;
  const lg = ctx.createLinearGradient(sx - 160, 0, sx + 160, 0);
  lg.addColorStop(0, "rgba(255,255,255,0)");
  lg.addColorStop(0.5, `rgba(255, 246, 235, ${0.04 + progress * 0.03})`);
  lg.addColorStop(1, "rgba(255,255,255,0)");
  ctx.fillStyle = lg;
  ctx.fillRect(0, 0, w, h);

  // ---- Final dissolve: warm wash rises as we approach the statement ----
  const dissolve = clamp(mapRange(progress, 0.86, 1, 0, 1));
  if (dissolve > 0) {
    ctx.fillStyle = `rgba(14, 12, 9, ${dissolve * 0.6})`;
    ctx.fillRect(0, 0, w, h);
  }
}
