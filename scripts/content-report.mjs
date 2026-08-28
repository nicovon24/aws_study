import { readFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const manifestPath = path.join(root, "content", "sources", "manifest.json");
const allowedProviders = new Set(["aws-knowledge-mcp", "aws-docs", "manual"]);
const allowedStatuses = new Set(["staged", "reviewed", "published", "stale"]);
const knownExams = new Set(["clf-c02", "aif-c01"]);

const manifest = JSON.parse(await readFile(manifestPath, "utf8"));
const issues = [];
const ids = new Set();

if (manifest.schemaVersion !== 1) issues.push("schemaVersion must be 1");
if (!Array.isArray(manifest.sources)) issues.push("sources must be an array");

for (const [index, source] of (manifest.sources ?? []).entries()) {
  const label = source.id || `source[${index}]`;
  for (const field of ["id", "provider", "url", "title", "fetchedAt", "status"]) {
    if (!source[field]) issues.push(`${label}: missing ${field}`);
  }
  if (ids.has(source.id)) issues.push(`${label}: duplicate id`);
  ids.add(source.id);
  if (!allowedProviders.has(source.provider)) issues.push(`${label}: invalid provider ${source.provider}`);
  if (!allowedStatuses.has(source.status)) issues.push(`${label}: invalid status ${source.status}`);
  if (source.url && !source.url.startsWith("https://")) issues.push(`${label}: URL must use HTTPS`);
  if (source.fetchedAt && Number.isNaN(Date.parse(source.fetchedAt))) issues.push(`${label}: invalid fetchedAt`);
  if (source.reviewedAt && Number.isNaN(Date.parse(source.reviewedAt))) issues.push(`${label}: invalid reviewedAt`);
  if (source.status === "published" && !source.reviewedAt) issues.push(`${label}: published source needs reviewedAt`);
  for (const examId of source.examIds ?? []) {
    if (!knownExams.has(examId)) issues.push(`${label}: unknown exam ${examId}`);
  }
  if (!source.query || !Array.isArray(source.topics) || source.topics.length === 0) {
    issues.push(`${label}: reproducible query and topics are required`);
  }
}

const counts = (manifest.sources ?? []).reduce((result, source) => {
  result[source.status] = (result[source.status] ?? 0) + 1;
  return result;
}, {});

console.log(`Content sources: ${manifest.sources?.length ?? 0}`);
for (const status of allowedStatuses) console.log(`- ${status}: ${counts[status] ?? 0}`);

if (issues.length) {
  console.error("\nContent manifest validation failed:");
  for (const issue of issues) console.error(`- ${issue}`);
  process.exitCode = 1;
} else {
  console.log("\nContent manifest validation passed.");
}
