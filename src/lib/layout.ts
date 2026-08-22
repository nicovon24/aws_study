import DATA from "@/data/services";
import { domainOf, type DomainNumber } from "./domains";
import type { Layout, MapFocus, Point } from "./types";

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
  const aA = catPos[ai].ang!;
  const m = active.items.length;
  // Wider spread than the "all" layout since the active branch has the whole ring to itself.
  const spread = Math.min(2.2, m * 0.42 + 0.3);
  active.items.forEach((_svc, si) => {
    const a2 = m === 1 ? aA : aA - spread / 2 + (si / (m - 1)) * spread;
    const r = R2base + (si % 2) * 74;
    pos[`${ai}-${si}`] = { x: Math.cos(a2) * r, y: Math.sin(a2) * r, ang: a2 };
  });
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
  DATA.forEach((cat, ci) => {
    if (domainOf(cat.cat) !== domain) return;
    const aA = catPos[ci].ang!;
    const m = cat.items.length;
    const spread = Math.min(1.1, m * 0.22 + 0.2);
    cat.items.forEach((_svc, si) => {
      const a2 = m === 1 ? aA : aA - spread / 2 + (si / (m - 1)) * spread;
      const r = R2base + (si % 2) * 74;
      pos[`${ci}-${si}`] = { x: Math.cos(a2) * r, y: Math.sin(a2) * r, ang: a2 };
    });
  });
  return { pos, catPos };
}

export function computeLayout(focus: MapFocus): Layout {
  if (focus.kind === "all") return layoutAllCategories();
  if (focus.kind === "domain") return layoutDomainCategories(focus.n);
  return layoutCategoryBranch(focus.name);
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

/** Transform that centers the current layout in a stage of the given size. */
export function fitTransform(focus: MapFocus, w: number, h: number) {
  void focus; // "all", a domain, and a branch all share the same ring radii.
  const scale = Math.max(0.35, Math.min(Math.min(w, h) / 1500, 1));
  return { scale, tx: w / 2, ty: h / 2 };
}
