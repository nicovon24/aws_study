/**
 * Compatibility facade for the CLF-C02 domain model during the V2 migration.
 * New readers use stable domain ids; numeric exports remain temporarily for
 * older callers and rollback safety.
 */

import DATA from "@/data/services";
import { CLF_C02_CATEGORY_DOMAINS } from "@/data/exams/clf-c02";
import { CLF_C02, DEFAULT_EXAM_ID, domainIdFromNumber, getExamDomain } from "@/data/exams";
import type { ExamDomain, Localized } from "./types";

export const DEFAULT_EXAM = CLF_C02;
export const EXAM_DOMAINS = DEFAULT_EXAM.domains;

export function domainIdOf(categorySlug: string): string {
  return CLF_C02_CATEGORY_DOMAINS[categorySlug] ?? domainIdFromNumber(DEFAULT_EXAM_ID, 3)!;
}

export function domainById(domainId: string): ExamDomain | null {
  return getExamDomain(DEFAULT_EXAM_ID, domainId);
}

export function categoriesInDomain(domainId: string) {
  return DATA.filter((category) => domainIdOf(category.slug) === domainId);
}

/** @deprecated Use a stable domain id through `domainIdOf`. */
export type DomainNumber = number;

/** @deprecated Compatibility shape for V1 readers. */
export type DomainMeta = {
  n: DomainNumber;
  name: Localized;
  weight: number;
  color: string;
};

/** @deprecated Use `EXAM_DOMAINS`. */
export const DOMAIN_META: Record<number, DomainMeta> = Object.fromEntries(
  EXAM_DOMAINS.map((domain) => [
    domain.number,
    { n: domain.number, name: domain.name, weight: domain.weight, color: domain.color },
  ]),
);

/** @deprecated Use `domainIdOf`. */
export const CATEGORY_DOMAIN: Record<string, DomainNumber> = Object.fromEntries(
  DATA.map((category) => [category.slug, domainById(domainIdOf(category.slug))?.number ?? 3]),
);

/** @deprecated Use `domainIdOf`. */
export function domainOf(categorySlug: string): DomainNumber {
  return CATEGORY_DOMAIN[categorySlug] ?? 3;
}
