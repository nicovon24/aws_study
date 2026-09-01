import { describe, expect, it } from "vitest";
import { pick } from "./locale";

describe("pick", () => {
  it("returns the value for the given locale", () => {
    const value = { es: "hola", en: "hello" };
    expect(pick("es", value)).toBe("hola");
    expect(pick("en", value)).toBe("hello");
  });
});
