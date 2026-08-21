import DATA from "@/data/services";
import type { Layout, Mode, Point, VisualStyle } from "./types";

export const CARD_W = 168;
export const CARD_H = 54;

/** Orbit look: categories on an inner ring, their services fanned out beyond it. */
function layoutRadialCircle(): Layout {
  const pos: Record<string, Point> = {};
  const catPos: Record<number, Point> = {};
  const N = DATA.length;
  const R1 = 300;
  const R2base = 560;
  DATA.forEach((cat, ci) => {
    const a = (ci / N) * Math.PI * 2 - Math.PI / 2;
    catPos[ci] = { x: Math.cos(a) * R1, y: Math.sin(a) * R1, ang: a };
    const k = cat.items.length;
    const slice = ((Math.PI * 2) / N) * 0.82;
    cat.items.forEach((_svc, si) => {
      const off = k === 1 ? 0 : (si - (k - 1) / 2) * (slice / k);
      const aa = a + off;
      const r = R2base + (si % 2) * 46; // stagger to reduce overlap
      pos[`${ci}-${si}`] = { x: Math.cos(aa) * r, y: Math.sin(aa) * r, ang: aa };
    });
  });
  return { pos, catPos };
}

/** All services on one big circle, grouped by category contiguously. */
function layoutGraphCircle(): Layout {
  const pos: Record<string, Point> = {};
  const R = 520;
  const ids: string[] = [];
  DATA.forEach((cat, ci) => cat.items.forEach((_svc, si) => ids.push(`${ci}-${si}`)));
  const M = ids.length;
  ids.forEach((id, i) => {
    const a = (i / M) * Math.PI * 2 - Math.PI / 2;
    pos[id] = { x: Math.cos(a) * R, y: Math.sin(a) * R, ang: a };
  });
  return { pos, catPos: {} };
}

/** One column per category, cards stacked vertically — compact and non-overlapping. */
function layoutRadialCards(): Layout {
  const pos: Record<string, Point> = {};
  const catPos: Record<number, Point> = {};
  const N = DATA.length;
  const COLW = CARD_W + 64;
  const totalW = (N - 1) * COLW;
  const startX = -totalW / 2;
  DATA.forEach((cat, ci) => {
    const cx = startX + ci * COLW;
    const headerY = 0;
    catPos[ci] = { x: cx, y: headerY };
    const rowGap = CARD_H + 14;
    const startY = headerY + 55;
    cat.items.forEach((_svc, si) => {
      pos[`${ci}-${si}`] = { x: cx, y: startY + si * rowGap };
    });
  });
  return { pos, catPos };
}

/** Grid layout: wrap cards into rows, grouped by category contiguously. */
function layoutGraphCards(): Layout {
  const pos: Record<string, Point> = {};
  const COLS = 8;
  const COLW = CARD_W + 40;
  const ROWH = CARD_H + 34;
  const ids: string[] = [];
  DATA.forEach((cat, ci) => cat.items.forEach((_svc, si) => ids.push(`${ci}-${si}`)));
  const rows = Math.ceil(ids.length / COLS);
  const totalW = (COLS - 1) * COLW;
  const totalH = (rows - 1) * ROWH;
  ids.forEach((id, i) => {
    const col = i % COLS;
    const row = Math.floor(i / COLS);
    pos[id] = { x: -totalW / 2 + col * COLW, y: -totalH / 2 + row * ROWH };
  });
  return { pos, catPos: {} };
}

export function computeLayout(mode: Mode, style: VisualStyle): Layout {
  if (style === "cards") {
    return mode === "radial" ? layoutRadialCards() : layoutGraphCards();
  }
  return mode === "radial" ? layoutRadialCircle() : layoutGraphCircle();
}

/** Quadratic path between two points. `pull` scales the control point toward the origin. */
export function curve(x1: number, y1: number, x2: number, y2: number, pull?: number): string {
  if (pull == null) {
    const mx = (x1 + x2) / 2;
    const my = (y1 + y2) / 2;
    return `M ${x1} ${y1} Q ${mx} ${my} ${x2} ${y2}`;
  }
  const cx = ((x1 + x2) / 2) * pull;
  const cy = ((y1 + y2) / 2) * pull;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

/** Connect from a card's left/right edge instead of its center, for cleaner routing. */
export function edgeAnchor(p: Point, side: "left" | "right" | "bottom"): Point {
  if (side === "right") return { x: p.x + CARD_W / 2, y: p.y };
  if (side === "left") return { x: p.x - CARD_W / 2, y: p.y };
  return { x: p.x, y: p.y + CARD_H / 2 };
}

/** Transform that centers the current layout in a stage of the given size. */
export function fitTransform(
  layout: Layout,
  style: VisualStyle,
  mode: Mode,
  w: number,
  h: number,
) {
  if (style === "cards") {
    // Measure the real bounding box so the scale matches the grid, not a hardcoded guess.
    let minX = Infinity;
    let maxX = -Infinity;
    let minY = Infinity;
    let maxY = -Infinity;
    Object.values(layout.pos).forEach((p) => {
      minX = Math.min(minX, p.x - CARD_W / 2);
      maxX = Math.max(maxX, p.x + CARD_W / 2);
      minY = Math.min(minY, p.y - CARD_H / 2 - 40);
      maxY = Math.max(maxY, p.y + CARD_H / 2);
    });
    const contentW = maxX - minX || 1;
    const contentH = maxY - minY || 1;
    let scale = Math.min(w / contentW, h / contentH) * 0.9;
    scale = Math.max(0.25, Math.min(scale, 1.4));
    return {
      scale,
      tx: w / 2 - ((minX + maxX) / 2) * scale,
      ty: h / 2 - ((minY + maxY) / 2) * scale,
    };
  }
  // Circle style: reference sizes calibrated to the orbit layout radii.
  let scale = Math.min(w, h) / (mode === "radial" ? 1500 : 1300);
  scale = Math.max(0.35, Math.min(scale, 1));
  return { scale, tx: w / 2, ty: h / 2 };
}
