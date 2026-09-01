import { describe, expect, it } from "vitest";
import { byId, byKey, highlightSet, relatedIds, relPairs, totalServices } from "./graph";

describe("graph index", () => {
  it("indexes every node under both its id and its key", () => {
    expect(Object.keys(byId).length).toBe(totalServices);
    expect(Object.keys(byKey).length).toBe(totalServices);
    for (const node of Object.values(byId)) {
      expect(byKey[node.key]).toBe(node);
    }
  });

  it("keeps relPairs symmetric", () => {
    for (const [a, b] of relPairs) {
      expect(relatedIds(a)).toContain(b);
      expect(relatedIds(b)).toContain(a);
    }
  });
});

describe("highlightSet", () => {
  it("is null when nothing is selected", () => {
    expect(highlightSet(null)).toBeNull();
  });

  it("includes the selected id plus its relations", () => {
    const [id] = Object.keys(byId);
    const set = highlightSet(id);
    expect(set).not.toBeNull();
    expect(set!.has(id)).toBe(true);
    for (const relatedId of relatedIds(id)) {
      expect(set!.has(relatedId)).toBe(true);
    }
  });
});
