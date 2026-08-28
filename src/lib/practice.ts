import { getExam, getExamItem, getExamItems } from "@/data/exams";
import { distractorCandidates, similarItemKeys, studyMetadataFor } from "@/data/studyMetadata";
import { byKey } from "@/lib/graph";
import type { ExamId, PracticeQuestion } from "@/lib/types";

export const QUESTION_BANK_VERSION = "2026-08-28.1";

function hashSeed(seed: string): () => number {
  let value = 2166136261;
  for (const char of seed) value = Math.imul(value ^ char.charCodeAt(0), 16777619);
  return () => ((value = Math.imul(value ^ (value >>> 15), 2246822519)) >>> 0) / 4294967296;
}

export function seededShuffle<T>(items: readonly T[], seed: string): T[] {
  const random = hashSeed(seed);
  const output = [...items];
  for (let index = output.length - 1; index > 0; index--) {
    const other = Math.floor(random() * (index + 1));
    [output[index], output[other]] = [output[other], output[index]];
  }
  return output;
}

function candidateKeys(answerKey: string, examId: ExamId): string[] {
  const examKeys = new Set(getExamItems(examId).map((item) => item.itemKey));
  const metadata = studyMetadataFor(answerKey);
  const related = [
    ...similarItemKeys(answerKey),
    ...metadata.distractorGroupIds.flatMap(distractorCandidates),
    ...metadata.familyIds.flatMap((family) =>
      Object.keys(byKey).filter((key) => studyMetadataFor(key).familyIds.includes(family)),
    ),
  ];
  const plausible = [...new Set(related)].filter((key) => key !== answerKey && examKeys.has(key) && Boolean(byKey[key]));
  if (plausible.length >= 3) return plausible;
  return [...new Set([...plausible, ...examKeys])].filter((key) => key !== answerKey && Boolean(byKey[key]));
}

export function buildQuestionBank(examId: ExamId): PracticeQuestion[] {
  return getExamItems(examId).flatMap((examItem) => {
    const item = byKey[examItem.itemKey];
    if (!item) return [];
    const distractors = seededShuffle(candidateKeys(item.key, examId), `${examId}:${item.key}`).slice(0, 3);
    if (distractors.length < 3) return [];
    const optionKeys = seededShuffle([item.key, ...distractors], `options:${examId}:${item.key}`);
    return [{
      id: `${examId}-recall-${item.key}`,
      examId,
      domainId: examItem.domainId,
      objectiveIds: examItem.objectiveIds ?? [],
      type: "single-choice",
      prompt: {
        es: `¿Qué elemento corresponde a esta descripción? ${item.d.es}`,
        en: `Which item matches this description? ${item.d.en}`,
      },
      explanation: {
        es: `${item.name.es}: ${item.d.es}`,
        en: `${item.name.en}: ${item.d.en}`,
      },
      sourceItemKeys: [item.key],
      relatedItemKeys: distractors,
      distractorGroupIds: studyMetadataFor(item.key).distractorGroupIds,
      skill: item.kind === "comparison" ? "compare" : "choose-best",
      difficulty: item.priority === 1 ? "intermediate" : "basic",
      options: optionKeys.map((key) => ({ id: key, itemKey: key, label: byKey[key].name })),
      correctOptionIds: [item.key],
    } satisfies PracticeQuestion];
  });
}

export function validateQuestionBank(examId: ExamId): string[] {
  const exam = getExam(examId);
  const questions = buildQuestionBank(examId);
  const issues: string[] = [];
  const ids = new Set<string>();
  for (const question of questions) {
    if (ids.has(question.id)) issues.push(`${examId}: duplicate question ${question.id}`);
    ids.add(question.id);
    if (!exam.domains.some((domain) => domain.id === question.domainId)) issues.push(`${question.id}: invalid domain`);
    if (question.options.length < 4) issues.push(`${question.id}: fewer than four plausible options`);
    if (question.correctOptionIds.length !== 1) issues.push(`${question.id}: single choice needs one answer`);
    if (!question.options.some((option) => question.correctOptionIds.includes(option.id))) issues.push(`${question.id}: answer missing from options`);
  }
  for (const domain of exam.domains) {
    if (!questions.some((question) => question.domainId === domain.id)) issues.push(`${examId}: no questions for ${domain.id}`);
  }
  return issues;
}

export function allocateWeightedQuestions(examId: ExamId, count: number): Record<string, number> {
  const domains = getExam(examId).domains;
  const exact = domains.map((domain) => ({ domain, exact: (count * domain.weight) / 100 }));
  const allocation = Object.fromEntries(exact.map(({ domain, exact: value }) => [domain.id, Math.floor(value)]));
  let remaining = count - Object.values(allocation).reduce((sum, value) => sum + value, 0);
  for (const { domain } of [...exact].sort((a, b) => (b.exact % 1) - (a.exact % 1) || a.domain.number - b.domain.number)) {
    if (remaining-- <= 0) break;
    allocation[domain.id] += 1;
  }
  return allocation;
}

export function buildMockExam(examId: ExamId, count: number, seed: string): PracticeQuestion[] {
  const bank = buildQuestionBank(examId);
  const allocation = allocateWeightedQuestions(examId, Math.min(count, bank.length));
  return Object.entries(allocation).flatMap(([domainId, domainCount]) =>
    seededShuffle(bank.filter((question) => question.domainId === domainId), `${seed}:${domainId}`).slice(0, domainCount),
  );
}
