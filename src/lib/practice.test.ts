import { describe, expect, it } from "vitest";
import { EXAMS, validateExamRegistry } from "@/data/exams";
import { allocateWeightedQuestions, buildMockExam, buildQuestionBank, seededShuffle, validateQuestionBank } from "@/lib/practice";
import { distractorCandidates, studyMetadataFor } from "@/data/studyMetadata";

describe("exam content", () => {
  it("keeps registry references and objective coverage valid", () => {
    expect(validateExamRegistry()).toEqual([]);
  });

  it.each(EXAMS.map((exam) => [exam.id]))("builds a valid bank for %s", (examId) => {
    expect(validateQuestionBank(examId)).toEqual([]);
    expect(buildQuestionBank(examId).length).toBeGreaterThan(0);
  });
});

describe("practice selection", () => {
  it("shuffles deterministically with a fixed seed", () => {
    expect(seededShuffle([1, 2, 3, 4, 5], "same")).toEqual(seededShuffle([1, 2, 3, 4, 5], "same"));
  });

  it("allocates exactly the requested weighted total", () => {
    const allocation = allocateWeightedQuestions("aif-c01", 20);
    expect(Object.values(allocation).reduce((sum, value) => sum + value, 0)).toBe(20);
    expect(allocation).toEqual({ "aif-c01-domain-1": 4, "aif-c01-domain-2": 5, "aif-c01-domain-3": 5, "aif-c01-domain-4": 3, "aif-c01-domain-5": 3 });
  });

  it("does not repeat questions in a mock session", () => {
    const questions = buildMockExam("aif-c01", 10, "test-seed");
    expect(new Set(questions.map((question) => question.id)).size).toBe(questions.length);
  });

  it("keeps AI security distractors within a plausible group", () => {
    expect(distractorCandidates("ai-security-controls").sort()).toEqual(["ai-security-governance", "bedrock-guardrails", "cloudtrail", "iam", "kms", "macie"].sort());
    expect(studyMetadataFor("ai-security-governance").distractorGroupIds).toContain("ai-security-controls");
    const question = buildQuestionBank("aif-c01").find((item) => item.sourceItemKeys.includes("ai-security-governance"));
    const allowed = new Set(distractorCandidates("ai-security-controls"));
    expect(question?.options.every((option) => allowed.has(option.id))).toBe(true);
  });
});
