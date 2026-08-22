import DATA from "@/data/services";
import { domainOf, type DomainNumber } from "./domains";
import type { Layout, MapFocus, Point } from "./types";

/**
 * Pill box, in world px: ~168 wide, ~28 tall. Spacing uses a deliberately
 * smaller width than the real pill, trading a little clipping between long
 * neighbouring labels for a ring compact enough to stay readable at fit zoom.
 */
const PILL_W = 118;
const PILL_H = 40;
/** Two short radial lanes are enough once the angular spacing accounts for pill width. */
const RSTEP = PILL_H;

/**
 * Fans `k` items across `slice` radians centred on `a`, pushing the whole fan
 * outward when `slice` at the base radius is too narrow to hold them apart.
 * Neighbours alternate between two short radial lanes, so each only has to
 * clear half a pill width — which is what sets the minimum angle between them.
 */
function fanBranch(
  pos: Record<string, Point>,
  ci: number,
  k: number,
  a: number,
  slice: number,
  rBase: number,
) {
  const rBranch = k < 2 ? rBase : Math.max(rBase, ((k - 1) * PILL_W) / slice);
  const step = k < 2 ? 0 : slice / (k - 1);
  for (let si = 0; si < k; si++) {
    const aa = a + (k === 1 ? 0 : (si - (k - 1) / 2) * step);
    const r = rBranch + (si % 2) * RSTEP;
    pos[`${ci}-${si}`] = { x: Math.cos(aa) * r, y: Math.sin(aa) * r, ang: aa };
  }
}

/** Orbit look: all 15 categories on an inner ring, their services fanned out beyond it. */
export function layoutAllCategories(): Layout {
  const pos: Record<string, Point> = {};
  const catPos: Record<number, Point> = {};
  const N = DATA.length;
  const R1 = 300;
  const R2base = 560;
  DATA.forEach((cat, ci) => {
    const a = (ci / N) * Math.PI * 2 - Math.PI / 2;
    catPos[ci] = { x: Math.cos(a) * R1, y: Math.sin(a) * R1, ang: a };
    // A branch may only use its own share of the ring, or fans would grow into
    // their neighbours; a crowded one is pushed outward by `fanBranch` instead.
    fanBranch(pos, ci, cat.items.length, a, ((Math.PI * 2) / N) * 1.2, R2base);
  });
  return { pos, catPos };
}

/**
 * Drill-down look: every category keeps its slot on the same ring used by
 * "all" (dim, clickable), but only the active category's services are fanned
 * out — at the same radii as "all" so the branch reads at the same scale as
 * the full tree instead of shrinking toward the center.
 */
export function layoutCategoryBranch(activeCat: string): Layout {
  const pos: Record<string, Point> = {};
  const catPos: Record<number, Point> = {};
  const N = DATA.length;
  const R1 = 300;
  const R2base = 560;
  const ai = Math.max(
    0,
    DATA.findIndex((c) => c.cat === activeCat),
  );
  DATA.forEach((cat, ci) => {
    const a = (ci / N) * Math.PI * 2 - Math.PI / 2;
    catPos[ci] = { x: Math.cos(a) * R1, y: Math.sin(a) * R1, ang: a };
  });
  const active = DATA[ai];
  const m = active.items.length;
  // Wider spread than the "all" layout since the active branch has the whole ring to itself.
  fanBranch(pos, ai, m, catPos[ai].ang!, Math.min(2.2, m * 0.42 + 0.3), R2base);
  return { pos, catPos };
}

/**
 * Every category keeps its ring slot (dim, clickable) like the branch layout,
 * but every category in the given domain gets its services fanned out — each
 * branch narrower than a lone drill-down since they share the ring with siblings.
 */
export function layoutDomainCategories(domain: DomainNumber): Layout {
  const pos: Record<string, Point> = {};
  const catPos: Record<number, Point> = {};
  const N = DATA.length;
  const R1 = 300;
  const R2base = 560;
  DATA.forEach((cat, ci) => {
    const a = (ci / N) * Math.PI * 2 - Math.PI / 2;
    catPos[ci] = { x: Math.cos(a) * R1, y: Math.sin(a) * R1, ang: a };
  });
  // Sibling branches share the ring, so give each its own corona: alternating
  // base radii keep a crowded branch's fan clear of its neighbours' fans.
  const inDomain = DATA.map((_c, ci) => ci).filter((ci) => domainOf(DATA[ci].cat) === domain);
  inDomain.forEach((ci, seen) => {
    const m = DATA[ci].items.length;
    const slice = ((Math.PI * 2) / N) * 1.2;
    fanBranch(pos, ci, m, catPos[ci].ang!, slice, R2base + (seen % 2) * PILL_W);
  });
  return { pos, catPos };
}

export function computeLayout(focus: MapFocus): Layout {
  if (focus.kind === "all") return layoutAllCategories();
  if (focus.kind === "domain") return layoutDomainCategories(focus.n);
  return layoutCategoryBranch(focus.name);
}

/**
 * Quadratic path between two points, bulging perpendicular to the segment
 * itself (not toward the map origin) so every curve reads as an even, symmetric
 * arc regardless of where the two points sit relative to the center.
 */
export function curve(x1: number, y1: number, x2: number, y2: number, bulge = 0.18): string {
  const mx = (x1 + x2) / 2;
  const my = (y1 + y2) / 2;
  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.hypot(dx, dy) || 1;
  // Perpendicular unit vector, scaled by segment length so short and long twigs curve proportionally.
  const nx = -dy / len;
  const ny = dx / len;
  const cx = mx + nx * len * bulge;
  const cy = my + ny * len * bulge;
  return `M ${x1} ${y1} Q ${cx} ${cy} ${x2} ${y2}`;
}

/**
 * Transform that centers a layout in a stage of the given size. Branch radii
 * now vary with how many services a category holds, so the extent is measured
 * from the layout itself rather than assumed.
 */
export function fitTransform(layout: Layout, w: number, h: number) {
  let reach = 0;
  for (const p of Object.values(layout.pos)) {
    reach = Math.max(reach, Math.hypot(p.x, p.y));
  }
  for (const p of Object.values(layout.catPos)) {
    reach = Math.max(reach, Math.hypot(p.x, p.y));
  }
  // Half a real pill (168px wide) sticks out past the node's own point.
  const extent = (reach + 84) * 2 * 1.06;
  const scale = Math.max(0.2, Math.min(Math.min(w, h) / extent, 1));
  return { scale, tx: w / 2, ty: h / 2 };
}
