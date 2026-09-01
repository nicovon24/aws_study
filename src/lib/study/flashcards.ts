import DATA from "@/data/services";
import { DEFAULT_EXAM_ID, getExamItem, getExamItems } from "@/data/exams";
import { byId } from "./graph";
import type { MapFocus, Node } from "@/lib/types";

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

function scopeMatches(focus: MapFocus, examId: string, node: Node): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return getExamItem(examId, node.key)?.domainId === focus.domainId;
  return node.catSlug === focus.slug;
}

/** Every service belonging to the chosen scope, as flashcard subjects. */
export function nodesInScope(focus: MapFocus, examId = DEFAULT_EXAM_ID): Node[] {
  const examItemKeys = new Set(getExamItems(examId).map((item) => item.itemKey));
  return DATA.flatMap((cat) => {
    const ci = DATA.indexOf(cat);
    return cat.items
      .map((_svc, si) => byId[`${ci}-${si}`])
      .filter((node) => examItemKeys.has(node.key) && scopeMatches(focus, examId, node));
  });
}

/**
 * Shuffled deck: one card per node in scope (capped at `count`, when given),
 * options drawn from the whole dataset.
 */
export function buildDeck(focus: MapFocus, mode: FlashcardMode, count?: number, examId = DEFAULT_EXAM_ID): Flashcard[] {
  const scoped = shuffle(nodesInScope(focus, examId));
  const picked = count != null ? scoped.slice(0, count) : scoped;
  const examKeys = new Set(getExamItems(examId).map((item) => item.itemKey));
  const allNodes = Object.values(byId).filter((node) => examKeys.has(node.key));
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
