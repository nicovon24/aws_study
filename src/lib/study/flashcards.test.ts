import { describe, expect, it } from "vitest";
import { buildDeck, nodesInScope } from "./flashcards";

describe("nodesInScope", () => {
  it("returns no duplicate nodes for the whole exam scope", () => {
    const nodes = nodesInScope({ kind: "all" });
    const ids = nodes.map((n) => n.id);
    expect(new Set(ids).size).toBe(ids.length);
    expect(nodes.length).toBeGreaterThan(0);
  });
});

describe("buildDeck", () => {
  it("builds one card per node in scope, each with 4 unique options including the correct one", () => {
    const deck = buildDeck({ kind: "all" }, "guess-description", 10);
    expect(deck.length).toBe(10);
    for (const card of deck) {
      expect(card.options.length).toBe(4);
      expect(new Set(card.options.map((o) => o.id)).size).toBe(4);
      expect(card.options.map((o) => o.id)).toContain(card.correct.id);
    }
  });
});
