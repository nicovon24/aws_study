// elkjs's default Node entry pulls in the optional `web-worker` package for a
// worker-thread build. `elk.bundled` embeds the layout engine directly and
// runs synchronously with no worker setup, which is fine at this graph size.
import ELK from "elkjs/lib/elk.bundled";
import type { ElkNode } from "elkjs/lib/elk-api";
import { getExamItem, getItemPriority } from "@/data/exams";
import DATA from "@/data/services";
import { byId } from "./graph";
import { pick, type Locale } from "@/lib/ui/locale";
import type { MapFocus, StudyPriority } from "@/lib/types";

/** Extra per-item predicate (favorites/reviewed/priority), applied on top of the focus. */
export type LayoutFilter = (itemKey: string, priority: StudyPriority) => boolean;

const elk = new ELK();

export const ROOT_ID = "__root";
export const ROOT_W = 96;
export const ROOT_H = 96;
const CAT_W = 190;
const CAT_H = 40;
const SVC_W = 168;
const SVC_H = 28;

export type MindNode = {
  id: string;
  kind: "root" | "category" | "service";
  label: string;
  /** Category slug — only set on `kind: "category"` nodes; used to build the focus on click. */
  slug?: string;
  x: number;
  y: number;
  width: number;
  height: number;
  ci: number;
  accent: string;
  side: "left" | "right";
};

export type MindEdge = {
  id: string;
  source: string;
  target: string;
  accent: string;
  /** Which side of the root the target branch is on; picks the matching handles. */
  side: "left" | "right";
};

export type MindLayout = {
  nodes: MindNode[];
  edges: MindEdge[];
};

type ActiveCategory = {
  ci: number;
  cat: (typeof DATA)[number];
  items: { si: number; svc: (typeof DATA)[number]["items"][number] }[];
};

/**
 * Builds an elk tree for one half of the mindmap: fake root -> categories -> services.
 * Categories and services are all flat siblings at this single level — elk.layered
 * derives the layers from the edges themselves, and a real parent/child nesting
 * (category node containing its services) triggers an UnsupportedGraphException
 * unless every level also sets hierarchyHandling, which is unnecessary here.
 */
function buildElkTree(cats: ActiveCategory[]): ElkNode {
  const children: ElkNode[] = [];
  const edges: NonNullable<ElkNode["edges"]> = [];
  for (const { ci, items } of cats) {
    children.push({ id: `cat-${ci}`, width: CAT_W, height: CAT_H });
    items.forEach(({ si }) => {
      children.push({ id: `${ci}-${si}`, width: SVC_W, height: SVC_H });
      edges.push({ id: `e-cat${ci}-${ci}-${si}`, sources: [`cat-${ci}`], targets: [`${ci}-${si}`] });
    });
  }
  return {
    id: "half",
    layoutOptions: {
      "elk.algorithm": "layered",
      "elk.direction": "RIGHT",
      "elk.layered.spacing.nodeNodeBetweenLayers": "72",
      "elk.spacing.nodeNode": "14",
      "elk.layered.spacing.edgeNodeBetweenLayers": "24",
    },
    children,
    edges,
  };
}

/**
 * Mind-map layout: the AWS root sits at the centre, active categories fan out
 * to the left and right (alternating), each with its services laid out by elk
 * in a horizontal tree, then the left half is mirrored back onto the root.
 */
export async function computeMindLayout(
  focus: MapFocus,
  locale: Locale,
  examId: string,
  matches?: LayoutFilter,
): Promise<MindLayout> {
  const activeCats = DATA.map((cat, ci) => ({
    ci,
    cat,
    items: cat.items
      .map((svc, si) => ({ svc, si }))
      .filter(({ svc }) => {
        const examItem = getExamItem(examId, svc.key);
        if (!examItem) return false;
        if (focus.kind === "domain" && examItem.domainId !== focus.domainId) return false;
        if (focus.kind === "category" && cat.slug !== focus.slug) return false;
        return !matches || matches(svc.key, getItemPriority(examId, svc.key) ?? svc.priority ?? 2);
      }),
  })).filter(({ items }) => items.length > 0);

  const left = activeCats.filter((_, i) => i % 2 === 0);
  const right = activeCats.filter((_, i) => i % 2 === 1);

  const [leftLayout, rightLayout] = await Promise.all([
    left.length ? elk.layout(buildElkTree(left)) : null,
    right.length ? elk.layout(buildElkTree(right)) : null,
  ]);

  const nodes: MindNode[] = [
    {
      id: ROOT_ID,
      kind: "root",
      label: "aws",
      x: -ROOT_W / 2,
      y: -ROOT_H / 2,
      width: ROOT_W,
      height: ROOT_H,
      ci: -1,
      accent: "#ef4444",
      side: "right",
    },
  ];
  const edges: MindEdge[] = [];

  function place(tree: ElkNode | null, side: "left" | "right") {
    if (!tree?.children) return;
    for (const n of tree.children) {
      const isCat = n.id!.startsWith("cat-");
      const ci = isCat ? Number(n.id!.replace("cat-", "")) : Number(n.id!.split("-")[0]);
      const cat = DATA[ci];
      const w = isCat ? CAT_W : SVC_W;
      const x = side === "left" ? -(n.x ?? 0) - w : (n.x ?? 0);
      const y = n.y ?? 0;
      nodes.push({
        id: n.id!,
        kind: isCat ? "category" : "service",
        label: isCat ? pick(locale, cat.cat) : (byId[n.id!] ? pick(locale, byId[n.id!].name) : n.id!),
        slug: isCat ? cat.slug : undefined,
        x,
        y,
        width: w,
        height: isCat ? CAT_H : SVC_H,
        ci,
        accent: cat.accent,
        side,
      });
      if (isCat) {
        edges.push({ id: `e-root-${n.id}`, source: ROOT_ID, target: n.id!, accent: cat.accent, side });
      } else {
        edges.push({ id: `e-cat${ci}-${n.id}`, source: `cat-${ci}`, target: n.id!, accent: cat.accent, side });
      }
    }
  }

  place(leftLayout, "left");
  place(rightLayout, "right");

  // Re-centre vertically: elk lays out each half from y=0 downward, so shift
  // both halves so the tree is vertically centred on the root.
  const rest = nodes.filter((n) => n.kind !== "root");
  if (rest.length) {
    const minY = Math.min(...rest.map((n) => n.y));
    const maxY = Math.max(...rest.map((n) => n.y + n.height));
    const centerShift = (minY + maxY) / 2;
    for (const n of nodes) {
      if (n.kind === "root") continue;
      n.y -= centerShift;
    }
  }

  return { nodes, edges };
}
