import DATA from "@/data/services";
import type { ExamDefinition, ExamDomainId } from "@/lib/types";

const DOMAIN_IDS = {
  1: "clf-c02-domain-1",
  2: "clf-c02-domain-2",
  3: "clf-c02-domain-3",
  4: "clf-c02-domain-4",
} as const;

const CATEGORY_DOMAIN_NUMBER: Record<string, keyof typeof DOMAIN_IDS> = {
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

export const CLF_C02_CATEGORY_DOMAINS: Record<string, ExamDomainId> = Object.fromEntries(
  Object.entries(CATEGORY_DOMAIN_NUMBER).map(([slug, number]) => [slug, DOMAIN_IDS[number]]),
);

export const CLF_C02: ExamDefinition = {
  id: "clf-c02",
  code: "CLF-C02",
  name: { es: "AWS Certified Cloud Practitioner", en: "AWS Certified Cloud Practitioner" },
  shortName: { es: "Cloud Practitioner", en: "Cloud Practitioner" },
  description: {
    es: "Fundamentos de la nube, seguridad, servicios, facturación y soporte de AWS.",
    en: "AWS cloud fundamentals, security, services, billing, and support.",
  },
  domains: [
    { id: DOMAIN_IDS[1], number: 1, name: { es: "Conceptos de la nube", en: "Cloud concepts" }, weight: 24, color: "#9aa7c0" },
    { id: DOMAIN_IDS[2], number: 2, name: { es: "Seguridad y cumplimiento", en: "Security and compliance" }, weight: 30, color: "#ff6b6b" },
    { id: DOMAIN_IDS[3], number: 3, name: { es: "Tecnología y servicios", en: "Technology and services" }, weight: 34, color: "#5b9eff" },
    { id: DOMAIN_IDS[4], number: 4, name: { es: "Facturación y soporte", en: "Billing and support" }, weight: 12, color: "#9aa7c0" },
  ],
  items: DATA.flatMap((category) => {
    const domainId = CLF_C02_CATEGORY_DOMAINS[category.slug];
    if (!domainId) return [];
    return category.items.map((item) => ({ itemKey: item.key, domainId, priority: item.priority ?? 2 }));
  }),
};
