import type { ExamDefinition } from "@/lib/types";

export const AIF_C01: ExamDefinition = {
  id: "aif-c01",
  code: "AIF-C01",
  name: { es: "AWS Certified AI Practitioner", en: "AWS Certified AI Practitioner" },
  shortName: { es: "AI Practitioner", en: "AI Practitioner" },
  description: {
    es: "Fundamentos de IA, IA generativa, modelos fundacionales, IA responsable y seguridad.",
    en: "AI, generative AI, foundation models, responsible AI, and security fundamentals.",
  },
  domains: [
    { id: "aif-c01-domain-1", number: 1, name: { es: "Fundamentos de IA y ML", en: "Fundamentals of AI and ML" }, weight: 20, color: "#8b9cf7" },
    { id: "aif-c01-domain-2", number: 2, name: { es: "Fundamentos de IA generativa", en: "Fundamentals of Generative AI" }, weight: 24, color: "#c084fc" },
    { id: "aif-c01-domain-3", number: 3, name: { es: "Aplicaciones de modelos fundacionales", en: "Applications of Foundation Models" }, weight: 28, color: "#5b9eff" },
    { id: "aif-c01-domain-4", number: 4, name: { es: "Lineamientos para IA responsable", en: "Guidelines for Responsible AI" }, weight: 14, color: "#2ee6a8" },
    { id: "aif-c01-domain-5", number: 5, name: { es: "Seguridad y gobernanza de IA", en: "Security and Governance for AI" }, weight: 14, color: "#ff8a65" },
  ],
  items: [],
};
