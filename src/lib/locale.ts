export type Locale = "es" | "en";

export const LOCALE_KEY = "aws-map:locale";

export function pick<T>(loc: Locale, v: { es: T; en: T }): T {
  return v[loc];
}
