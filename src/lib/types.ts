import type { DomainNumber } from "./domains";
import type { Locale } from "./locale";

export type Localized = { es: string; en: string };

export type Concept = { t: Localized; d: Localized };

export type Service = {
  /**
   * Stable identifier for relations/architectures — independent of the display name and
   * distinct from `Node.id` (the `${ci}-${si}` positional id used by the map/detail panel).
   */
  key: string;
  name: Localized;
  d: Localized;
  link: string;
  long?: Localized;
  list?: Concept[];
  use?: Localized[];
  avoid?: Localized[];
  concepts?: Concept[];
};

export type Category = {
  /** Stable identifier for URLs/filters/comparisons — independent of the display label. */
  slug: string;
  cat: Localized;
  accent: string;
  items: Service[];
};

/** A service flattened with its category context and a stable `${ci}-${si}` id. */
export type Node = Service & {
  id: string;
  ci: number;
  si: number;
  cat: Localized;
  catSlug: string;
  accent: string;
};

export type { Locale };

export type View = "dashboard" | "map" | "catalog" | "practice" | "architectures";

/**
 * What the Map (and Catalog, and Practice scope picker) currently shows:
 * every category, every category within one exam domain, or a single category.
 */
export type MapFocus =
  | { kind: "all" }
  | { kind: "domain"; n: DomainNumber }
  | { kind: "category"; slug: string };

/** World-space position. `ang` is only set by the circle layouts. */
export type Point = { x: number; y: number; ang?: number };

export type Layout = {
  /** id -> position */
  pos: Record<string, Point>;
  /** category index -> position */
  catPos: Record<number, Point>;
};

export type Transform = { tx: number; ty: number; scale: number };
