import type { Locale } from "./locale";

export type Localized = { es: string; en: string };

export type Concept = { t: Localized; d: Localized };

export type ExamId = string;
export type ExamDomainId = string;
export type StudyPriority = 1 | 2 | 3;
export type StudyItemKind = "service" | "concept" | "comparison" | "scenario";
export type ContentSourceStatus = "staged" | "reviewed" | "published" | "stale";

export type ContentSource = {
  id: string;
  provider: "aws-knowledge-mcp" | "aws-docs" | "manual";
  url: string;
  title: string;
  fetchedAt: string;
  reviewedAt?: string;
  status: ContentSourceStatus;
  examIds?: ExamId[];
  query?: string;
  topics?: string[];
  checksum?: string;
  notes?: string;
};

export type QuestionType = "single-choice" | "multiple-choice" | "ordering" | "matching";
export type PracticeSkill = "recall" | "compare" | "scenario" | "troubleshoot" | "choose-best";
export type PracticeDifficulty = "basic" | "intermediate" | "exam-like";

export type PracticeOption = { id: string; label: Localized; itemKey?: string };

export type PracticeQuestion = {
  id: string;
  examId: ExamId;
  domainId: ExamDomainId;
  objectiveIds: string[];
  type: "single-choice" | "multiple-choice";
  prompt: Localized;
  explanation: Localized;
  sourceItemKeys: string[];
  relatedItemKeys?: string[];
  distractorGroupIds: string[];
  skill: PracticeSkill;
  difficulty: PracticeDifficulty;
  options: PracticeOption[];
  correctOptionIds: string[];
};

export type PracticeSessionResult = {
  sessionId: string;
  examId: ExamId;
  mode: "practice" | "mock";
  startedAt: string;
  completedAt: string;
  bankVersion: string;
  answers: { questionId: string; selectedOptionIds: string[]; correct: boolean }[];
};

export type ExamDomain = {
  id: ExamDomainId;
  number: number;
  name: Localized;
  weight: number;
  color: string;
  objectives?: { id: string; name: Localized }[];
};

export type ExamItem = {
  itemKey: string;
  domainId: ExamDomainId;
  priority: StudyPriority;
  objectiveIds?: string[];
};

export type ExamDefinition = {
  id: ExamId;
  code: string;
  name: Localized;
  shortName: Localized;
  description: Localized;
  domains: ExamDomain[];
  items: ExamItem[];
};

export type CatalogScope = { kind: "all-aws" } | { kind: "exam"; examId: ExamId };

export type StudyItemMetadata = {
  topicIds: string[];
  familyIds: string[];
  similarTo: string[];
  distractorGroupIds: string[];
};

export type Service = {
  /**
   * Stable identifier for relations/architectures — independent of the display name and
   * distinct from `Node.id` (the `${ci}-${si}` positional id used by the map/detail panel).
   */
  key: string;
  name: Localized;
  d: Localized;
  link: string;
  long?: Localized;
  list?: Concept[];
  use?: Localized[];
  avoid?: Localized[];
  concepts?: Concept[];
  /** @deprecated V2 reads priority from ExamItem. Kept temporarily as a rollback fallback. */
  priority?: StudyPriority;
  kind?: StudyItemKind;
  topicIds?: string[];
  familyIds?: string[];
  similarTo?: string[];
  distractorGroupIds?: string[];
  sourceIds?: string[];
};

export type Category = {
  /** Stable identifier for URLs/filters/comparisons — independent of the display label. */
  slug: string;
  cat: Localized;
  accent: string;
  items: Service[];
};

/** A service flattened with its category context and a stable `${ci}-${si}` id. */
export type Node = Service & {
  id: string;
  ci: number;
  si: number;
  cat: Localized;
  catSlug: string;
  accent: string;
};

export type { Locale };

export type View = "dashboard" | "map" | "catalog" | "practice" | "progress" | "architectures" | "favorites";

/**
 * What the Map (and Catalog, and Practice scope picker) currently shows:
 * every category, every category within one exam domain, or a single category.
 */
export type MapFocus =
  | { kind: "all" }
  | { kind: "domain"; domainId: ExamDomainId }
  | { kind: "category"; slug: string };

/** World-space position. `ang` is only set by the circle layouts. */
export type Point = { x: number; y: number; ang?: number };

export type Layout = {
  /** id -> position */
  pos: Record<string, Point>;
  /** category index -> position */
  catPos: Record<number, Point>;
};

export type Transform = { tx: number; ty: number; scale: number };
