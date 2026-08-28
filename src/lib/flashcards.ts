import DATA from "@/data/services";
import { DEFAULT_EXAM_ID, getExamItems } from "@/data/exams";
import { domainIdOf } from "./domains";
import { byId } from "./graph";
import type { MapFocus, Node } from "./types";

export type FlashcardMode = "guess-description" | "guess-service";

export type Flashcard = {
  correct: Node;
  /** 4 nodes in randomized order; exactly one is `correct`. */
  options: Node[];
};

function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

function scopeMatches(focus: MapFocus, catSlug: string): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return domainIdOf(catSlug) === focus.domainId;
  return catSlug === focus.slug;
}

/** Every service belonging to the chosen scope, as flashcard subjects. */
export function nodesInScope(focus: MapFocus): Node[] {
  const examItemKeys = new Set(getExamItems(DEFAULT_EXAM_ID).map((item) => item.itemKey));
  return DATA.filter((cat) => scopeMatches(focus, cat.slug)).flatMap((cat) => {
    const ci = DATA.indexOf(cat);
    return cat.items
      .map((_svc, si) => byId[`${ci}-${si}`])
      .filter((node) => examItemKeys.has(node.key));
  });
}

/**
 * Shuffled deck: one card per node in scope (capped at `count`, when given),
 * options drawn from the whole dataset.
 */
export function buildDeck(focus: MapFocus, mode: FlashcardMode, count?: number): Flashcard[] {
  const scoped = shuffle(nodesInScope(focus));
  const picked = count != null ? scoped.slice(0, count) : scoped;
  const allNodes = Object.values(byId);
  return picked.map((correct) => ({
    correct,
    options: buildOptions(correct, allNodes),
  }));
}

/** 1 correct node + 3 distractors from the full dataset, shuffled together. */
function buildOptions(correct: Node, pool: Node[]): Node[] {
  const distractors = shuffle(pool.filter((n) => n.id !== correct.id)).slice(0, 3);
  return shuffle([correct, ...distractors]);
}

export const FLASHCARD_MODE_LABEL: Record<FlashcardMode, string> = {
  "guess-description": "Adivinar descripción",
  "guess-service": "Adivinar servicio",
};
