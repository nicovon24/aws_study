import manifest from "../../content/sources/manifest.json";
import type { ContentSource } from "@/lib/types";

export const CONTENT_SOURCES = manifest.sources as ContentSource[];

export function getContentSource(sourceId: string): ContentSource | null {
  return CONTENT_SOURCES.find((source) => source.id === sourceId) ?? null;
}

export function getContentSourcesForExam(examId: string): ContentSource[] {
  return CONTENT_SOURCES.filter((source) => source.examIds?.includes(examId));
}
