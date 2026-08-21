import DATA from "@/data/services";
import RELATIONS from "@/data/relations";
import type { Node } from "./types";

/** Every service flattened, indexed by `${categoryIndex}-${serviceIndex}`. */
export const byId: Record<string, Node> = {};
const byName: Record<string, Node> = {};

DATA.forEach((cat, ci) =>
  cat.items.forEach((svc, si) => {
    const id = `${ci}-${si}`;
    const node: Node = { id, ci, si, cat: cat.cat, accent: cat.accent, ...svc };
    byId[id] = node;
    byName[svc.name] = node;
  }),
);

export const totalServices = Object.keys(byId).length;

/** Relations resolved to ids; pairs naming a service that does not exist are dropped. */
export const relPairs: [string, string][] = RELATIONS.filter(
  ([a, b]) => byName[a] && byName[b],
).map(([a, b]) => [byName[a].id, byName[b].id]);

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
