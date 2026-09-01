import DATA from "@/data/services";
import RELATIONS from "@/data/relations";
import type { Category, Node } from "@/lib/types";

/** Every service flattened, indexed by `${categoryIndex}-${serviceIndex}`. */
export const byId: Record<string, Node> = {};
export const byKey: Record<string, Node> = {};

/** Category lookup by its stable slug — resolves a `MapFocus` category slug back to its display data. */
export const catBySlug: Record<string, Category> = {};

DATA.forEach((cat, ci) => {
  catBySlug[cat.slug] = cat;
  cat.items.forEach((svc, si) => {
    const id = `${ci}-${si}`;
    const node: Node = { id, ci, si, cat: cat.cat, catSlug: cat.slug, accent: cat.accent, ...svc };
    byId[id] = node;
    byKey[svc.key] = node;
  });
});

export const totalServices = Object.keys(byId).length;

/** Relations resolved to ids; pairs naming a service that does not exist are dropped. */
export const relPairs: [string, string][] = RELATIONS.filter(
  ([a, b]) => byKey[a] && byKey[b],
).map(([a, b]) => [byKey[a].id, byKey[b].id]);

export function relatedIds(id: string): string[] {
  const out = new Set<string>();
  relPairs.forEach(([a, b]) => {
    if (a === id) out.add(b);
    if (b === id) out.add(a);
  });
  return [...out];
}

/** Selected node plus everything it connects to, or null when nothing is selected. */
export function highlightSet(selectedId: string | null): Set<string> | null {
  if (!selectedId) return null;
  return new Set([selectedId, ...relatedIds(selectedId)]);
}
