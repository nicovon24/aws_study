import { byKey } from "@/lib/study/graph";
import type { StudyItemMetadata } from "@/lib/types";

const EMPTY_METADATA: StudyItemMetadata = {
  topicIds: [],
  familyIds: [],
  similarTo: [],
  distractorGroupIds: [],
};

const GROUPS = {
  "storage-object-file-block": ["s3", "ebs", "efs", "fsx", "s3-glacier", "storage-gateway"],
  "databases-purpose-built": ["rds", "aurora", "dynamodb", "redshift", "elasticache", "documentdb"],
  "identity-access-governance": ["iam", "organizations", "control-tower", "config", "cloudtrail", "security-hub"],
  "ai-ml-managed-services": [
    "bedrock",
    "sagemaker",
    "amazon-q",
    "comprehend",
    "lex",
    "textract",
    "transcribe",
    "rekognition",
    "polly",
    "translate",
  ],
  "ai-core-concepts": [
    "ai-ml-genai",
    "supervised-unsupervised-reinforcement",
    "ml-lifecycle",
    "tokens-embeddings-vectors",
    "foundation-models",
    "genai-limitations",
    "rag-vs-fine-tuning",
    "prompt-engineering",
    "fm-evaluation",
    "responsible-ai",
    "bias-and-fairness",
    "ai-security-governance",
    "bedrock-guardrails",
  ],
  "ai-security-controls": ["iam", "kms", "cloudtrail", "macie", "bedrock-guardrails", "ai-security-governance"],
} as const;

function groupMetadata(
  groupId: keyof typeof GROUPS,
  familyId: string,
  topicId: string,
): Record<string, StudyItemMetadata> {
  const keys = GROUPS[groupId];
  return Object.fromEntries(
    keys.map((key) => [
      key,
      {
        topicIds: [topicId],
        familyIds: [familyId],
        similarTo: keys.filter((candidate) => candidate !== key),
        distractorGroupIds: [groupId],
      },
    ]),
  );
}

export const STUDY_METADATA: Record<string, StudyItemMetadata> = {
  ...groupMetadata("storage-object-file-block", "storage", "storage-options"),
  ...groupMetadata("databases-purpose-built", "database", "purpose-built-databases"),
  ...groupMetadata("identity-access-governance", "security", "identity-and-governance"),
  ...groupMetadata("ai-ml-managed-services", "ai-ml", "managed-ai-services"),
  ...groupMetadata("ai-core-concepts", "ai-concepts", "ai-practitioner-concepts"),
  ...groupMetadata("ai-security-controls", "ai-security", "ai-security-and-governance"),
};

export function studyMetadataFor(itemKey: string): StudyItemMetadata {
  const service = byKey[itemKey];
  const overlay = STUDY_METADATA[itemKey];
  return {
    topicIds: service?.topicIds ?? overlay?.topicIds ?? EMPTY_METADATA.topicIds,
    familyIds: service?.familyIds ?? overlay?.familyIds ?? EMPTY_METADATA.familyIds,
    similarTo: service?.similarTo ?? overlay?.similarTo ?? EMPTY_METADATA.similarTo,
    distractorGroupIds:
      service?.distractorGroupIds ?? overlay?.distractorGroupIds ?? EMPTY_METADATA.distractorGroupIds,
  };
}

export function similarItemKeys(itemKey: string): string[] {
  return studyMetadataFor(itemKey).similarTo.filter((key) => Boolean(byKey[key]));
}

export function itemKeysByFamily(familyId: string): string[] {
  return Object.keys(byKey).filter((key) => studyMetadataFor(key).familyIds.includes(familyId));
}

export function distractorCandidates(groupId: string): string[] {
  return Object.keys(byKey).filter((key) => studyMetadataFor(key).distractorGroupIds.includes(groupId));
}

export function validateStudyMetadata(): string[] {
  const issues: string[] = [];
  for (const [itemKey, metadata] of Object.entries(STUDY_METADATA)) {
    if (!byKey[itemKey]) issues.push(`Missing metadata item: ${itemKey}`);
    for (const similarKey of metadata.similarTo) {
      if (similarKey === itemKey) issues.push(`${itemKey}: similarTo cannot reference itself`);
      if (!byKey[similarKey]) issues.push(`${itemKey}: missing similarTo item ${similarKey}`);
    }
  }
  return issues;
}

const metadataIssues = validateStudyMetadata();
if (metadataIssues.length > 0) throw new Error(`Invalid study metadata:\n${metadataIssues.join("\n")}`);
