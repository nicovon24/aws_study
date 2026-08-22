/**
 * CLF-C02 exam domains, layered on top of the existing category dataset without
 * touching `data/services.ts`. Category names below must match `DATA[].cat` exactly.
 */

export type DomainNumber = 1 | 2 | 3 | 4;

export type DomainMeta = {
  n: DomainNumber;
  name: string;
  weight: number;
  color: string;
};

export const DOMAIN_META: Record<DomainNumber, DomainMeta> = {
  1: { n: 1, name: "Conceptos de la nube", weight: 24, color: "#9aa7c0" },
  2: { n: 2, name: "Seguridad y cumplimiento", weight: 30, color: "#ff6b6b" },
  3: { n: 3, name: "Tecnología y servicios", weight: 34, color: "#5b9eff" },
  4: { n: 4, name: "Facturación y soporte", weight: 12, color: "#9aa7c0" },
};

export const CATEGORY_DOMAIN: Record<string, DomainNumber> = {
  Fundamentos: 1,
  "Seguridad e identidad": 2,
  "Seguridad y detección": 2,
  Cómputo: 3,
  Contenedores: 3,
  Almacenamiento: 3,
  "Migración y transferencia": 3,
  "Bases de datos": 3,
  "Redes y CDN": 3,
  Administración: 3,
  Analítica: 3,
  "Machine Learning": 3,
  Integración: 3,
  "Herramientas dev": 3,
  "Costos y soporte": 4,
};

export function domainOf(categoryName: string): DomainNumber {
  return CATEGORY_DOMAIN[categoryName] ?? 3;
}
