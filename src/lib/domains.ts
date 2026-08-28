/**
 * CLF-C02 exam domains, layered on top of the existing category dataset without
 * touching `data/services.ts`. Keys below must match `DATA[].slug` exactly.
 */

import type { Localized } from "./types";

export type DomainNumber = 1 | 2 | 3 | 4;

export type DomainMeta = {
  n: DomainNumber;
  name: Localized;
  weight: number;
  color: string;
};

export const DOMAIN_META: Record<DomainNumber, DomainMeta> = {
  1: { n: 1, name: { es: "Conceptos de la nube", en: "Cloud concepts" }, weight: 24, color: "#9aa7c0" },
  2: { n: 2, name: { es: "Seguridad y cumplimiento", en: "Security and compliance" }, weight: 30, color: "#ff6b6b" },
  3: { n: 3, name: { es: "Tecnología y servicios", en: "Technology and services" }, weight: 34, color: "#5b9eff" },
  4: { n: 4, name: { es: "Facturación y soporte", en: "Billing and support" }, weight: 12, color: "#9aa7c0" },
};

export const CATEGORY_DOMAIN: Record<string, DomainNumber> = {
  fundamentals: 1,
  "security-identity": 2,
  "security-detection": 2,
  compute: 3,
  containers: 3,
  storage: 3,
  "migration-transfer": 3,
  database: 3,
  "networking-cdn": 3,
  administration: 3,
  analytics: 3,
  "machine-learning": 3,
  integration: 3,
  "dev-tools": 3,
  "end-user-computing": 3,
  "cost-support": 4,
};

export function domainOf(categorySlug: string): DomainNumber {
  return CATEGORY_DOMAIN[categorySlug] ?? 3;
}
