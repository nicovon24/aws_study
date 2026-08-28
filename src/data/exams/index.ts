import DATA from "@/data/services";
import "@/data/studyMetadata";
import type { ExamDefinition, ExamDomain, ExamId, ExamItem, StudyPriority } from "@/lib/types";
import { AIF_C01 } from "./aif-c01";
import { CLF_C02 } from "./clf-c02";

export const DEFAULT_EXAM_ID = "clf-c02";
export const EXAMS = [CLF_C02, AIF_C01] as const satisfies readonly ExamDefinition[];

const EXAM_BY_ID = new Map<ExamId, ExamDefinition>(EXAMS.map((exam) => [exam.id, exam]));
const DOMAIN_BY_EXAM = new Map(
  EXAMS.map((exam) => [exam.id, new Map(exam.domains.map((domain) => [domain.id, domain]))]),
);
const ITEM_BY_EXAM = new Map(
  EXAMS.map((exam) => [exam.id, new Map(exam.items.map((item) => [item.itemKey, item]))]),
);

export function findExam(examId: ExamId): ExamDefinition | null {
  return EXAM_BY_ID.get(examId) ?? null;
}

export function getExam(examId: ExamId): ExamDefinition {
  const exam = findExam(examId);
  if (!exam) throw new Error(`Unknown exam id: ${examId}`);
  return exam;
}

export function getExamDomain(examId: ExamId, domainId: string): ExamDomain | null {
  getExam(examId);
  return DOMAIN_BY_EXAM.get(examId)?.get(domainId) ?? null;
}

export function domainIdFromNumber(examId: ExamId, number: number): string | null {
  return getExam(examId).domains.find((domain) => domain.number === number)?.id ?? null;
}

export function getExamItems(examId: ExamId): ExamItem[] {
  return getExam(examId).items;
}

export function getExamItemKeys(examId: ExamId): Set<string> {
  getExam(examId);
  return new Set(ITEM_BY_EXAM.get(examId)?.keys() ?? []);
}

export function getExamItem(examId: ExamId, itemKey: string): ExamItem | null {
  getExam(examId);
  return ITEM_BY_EXAM.get(examId)?.get(itemKey) ?? null;
}

export function getExamItemsForDomain(examId: ExamId, domainId: string): ExamItem[] {
  return getExam(examId).items.filter((item) => item.domainId === domainId);
}

export function getCategoryItemsForExam(examId: ExamId, categorySlug: string) {
  const category = DATA.find((candidate) => candidate.slug === categorySlug);
  if (!category) return [];
  const examKeys = getExamItemKeys(examId);
  return category.items.filter((item) => examKeys.has(item.key));
}

export function getCategoryItemsForDomain(examId: ExamId, categorySlug: string, domainId: string) {
  const category = DATA.find((candidate) => candidate.slug === categorySlug);
  if (!category) return [];
  return category.items.filter((item) => getExamItem(examId, item.key)?.domainId === domainId);
}

export function categoryBelongsToExam(examId: ExamId, categorySlug: string): boolean {
  return getCategoryItemsForExam(examId, categorySlug).length > 0;
}

export function getCategoriesForExam(examId: ExamId) {
  return DATA.map((category) => ({ ...category, items: getCategoryItemsForExam(examId, category.slug) })).filter(
    (category) => category.items.length > 0,
  );
}

export function getCategoriesForDomain(examId: ExamId, domainId: string) {
  return DATA.map((category) => ({
    ...category,
    items: getCategoryItemsForDomain(examId, category.slug, domainId),
  })).filter((category) => category.items.length > 0);
}

export function getItemPriority(examId: ExamId, itemKey: string): StudyPriority | null {
  return getExamItem(examId, itemKey)?.priority ?? null;
}

export function validateExamRegistry(): string[] {
  const issues: string[] = [];
  const catalogKeys = new Set(DATA.flatMap((category) => category.items.map((item) => item.key)));
  const examIds = new Set<string>();

  for (const exam of EXAMS) {
    if (examIds.has(exam.id)) issues.push(`Duplicate exam id: ${exam.id}`);
    examIds.add(exam.id);

    const domainIds = new Set<string>();
    const objectiveIds = new Set<string>();
    const domainNumbers = new Set<number>();
    for (const domain of exam.domains) {
      if (domainIds.has(domain.id)) issues.push(`${exam.id}: duplicate domain id ${domain.id}`);
      if (domainNumbers.has(domain.number)) issues.push(`${exam.id}: duplicate domain number ${domain.number}`);
      domainIds.add(domain.id);
      domainNumbers.add(domain.number);
      for (const objective of domain.objectives ?? []) {
        if (objectiveIds.has(objective.id)) issues.push(`${exam.id}: duplicate objective ${objective.id}`);
        objectiveIds.add(objective.id);
      }
    }

    const weight = exam.domains.reduce((total, domain) => total + domain.weight, 0);
    if (weight !== 100) issues.push(`${exam.id}: domain weights total ${weight}, expected 100`);

    const itemKeys = new Set<string>();
    for (const item of exam.items) {
      if (itemKeys.has(item.itemKey)) issues.push(`${exam.id}: duplicate item ${item.itemKey}`);
      if (!catalogKeys.has(item.itemKey)) issues.push(`${exam.id}: missing catalog item ${item.itemKey}`);
      if (!domainIds.has(item.domainId)) issues.push(`${exam.id}: unknown domain ${item.domainId}`);
      for (const objectiveId of item.objectiveIds ?? []) {
        if (!objectiveIds.has(objectiveId)) issues.push(`${exam.id}: unknown objective ${objectiveId}`);
      }
      itemKeys.add(item.itemKey);
    }
    for (const objectiveId of objectiveIds) {
      if (!exam.items.some((item) => item.objectiveIds?.includes(objectiveId))) {
        issues.push(`${exam.id}: objective ${objectiveId} has no study item`);
      }
    }
  }

  return issues;
}

const registryIssues = validateExamRegistry();
if (registryIssues.length > 0) throw new Error(`Invalid exam registry:\n${registryIssues.join("\n")}`);

export { AIF_C01, CLF_C02 };
