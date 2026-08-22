import type { DomainNumber } from "./domains";

export type Concept = { t: string; d: string };

export type Service = {
  name: string;
  d: string;
  link: string;
  long?: string;
  use?: string[];
  avoid?: string[];
  concepts?: Concept[];
};

export type Category = {
  cat: string;
  accent: string;
  items: Service[];
};

/** A service flattened with its category context and a stable `${ci}-${si}` id. */
export type Node = Service & {
  id: string;
  ci: number;
  si: number;
  cat: string;
  accent: string;
};

export type View = "dashboard" | "map" | "catalog" | "practice";

/**
 * What the Map (and Catalog, and Practice scope picker) currently shows:
 * every category, every category within one exam domain, or a single category.
 */
export type MapFocus =
  | { kind: "all" }
  | { kind: "domain"; n: DomainNumber }
  | { kind: "category"; name: string };

/** World-space position. `ang` is only set by the circle layouts. */
export type Point = { x: number; y: number; ang?: number };

export type Layout = {
  /** id -> position */
  pos: Record<string, Point>;
  /** category index -> position */
  catPos: Record<number, Point>;
};

export type Transform = { tx: number; ty: number; scale: number };
