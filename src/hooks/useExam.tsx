"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from "react";
import Loader from "@/components/skeletons/Loader";
import { DEFAULT_EXAM_ID, findExam, getExam } from "@/data/exams";
import type { ExamDefinition, ExamId } from "@/lib/types";

const EXAM_STORAGE_KEY = "aws-prep:exam";

type ExamContextValue = {
  exam: ExamDefinition;
  setExam: (examId: ExamId) => void;
  urlFor: (pathname: string, params?: URLSearchParams) => string;
};

const ExamContext = createContext<ExamContextValue | null>(null);

export function ExamProvider({ children }: { children: ReactNode }) {
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const rawExamId = searchParams.get("exam");
  const [resolvedExamId, setResolvedExamId] = useState<ExamId>(DEFAULT_EXAM_ID);
  const [ready, setReady] = useState(false);

  useEffect(() => {
    const urlExam = rawExamId ? findExam(rawExamId) : null;
    const savedExamId = localStorage.getItem(EXAM_STORAGE_KEY);
    const savedExam = savedExamId ? findExam(savedExamId) : null;
    const nextExamId = urlExam?.id ?? (!rawExamId ? savedExam?.id : null) ?? DEFAULT_EXAM_ID;

    setResolvedExamId(nextExamId);
    localStorage.setItem(EXAM_STORAGE_KEY, nextExamId);
    setReady(true);

    if (rawExamId !== nextExamId) {
      const params = new URLSearchParams(searchParams.toString());
      params.set("exam", nextExamId);
      params.delete("domain");
      params.delete("cat");
      params.delete("service");
      params.delete("id");
      router.replace(`${pathname}?${params.toString()}`, { scroll: false });
    }
  }, [pathname, rawExamId, router, searchParams]);

  const exam = getExam(resolvedExamId);

  useEffect(() => {
    document.title = `AWS Prep — ${exam.code}`;
    const description = document.querySelector<HTMLMetaElement>('meta[name="description"]');
    if (description) description.content = exam.description.es;
  }, [exam]);

  const urlFor = useCallback(
    (targetPathname: string, params = new URLSearchParams()) => {
      const next = new URLSearchParams(params.toString());
      next.set("exam", resolvedExamId);
      const query = next.toString();
      return query ? `${targetPathname}?${query}` : targetPathname;
    },
    [resolvedExamId],
  );

  const setExam = useCallback(
    (examId: ExamId) => {
      const nextExam = findExam(examId);
      if (!nextExam || nextExam.id === resolvedExamId) return;
      setResolvedExamId(nextExam.id);
      localStorage.setItem(EXAM_STORAGE_KEY, nextExam.id);
      const params = new URLSearchParams(searchParams.toString());
      params.set("exam", nextExam.id);
      params.delete("domain");
      params.delete("cat");
      params.delete("service");
      params.delete("id");
      router.push(`${pathname}?${params.toString()}`, { scroll: false });
    },
    [pathname, resolvedExamId, router, searchParams],
  );

  const value = useMemo(() => ({ exam, setExam, urlFor }), [exam, setExam, urlFor]);

  if (!ready) return <Loader label="AWS PREP" />;
  return <ExamContext.Provider value={value}>{children}</ExamContext.Provider>;
}

export function useExam() {
  const context = useContext(ExamContext);
  if (!context) throw new Error("useExam must be used within ExamProvider");
  return context;
}
