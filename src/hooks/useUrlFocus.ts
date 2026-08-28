"use client";

import { usePathname, useRouter, useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo } from "react";
import { categoryBelongsToExam, domainIdFromNumber, getExamDomain } from "@/data/exams";
import type { MapFocus } from "@/lib/types";
import { useExam } from "./useExam";

function parseFocus(params: URLSearchParams, examId: string): MapFocus {
  const domain = params.get("domain");
  if (domain) {
    if (getExamDomain(examId, domain)) return { kind: "domain", domainId: domain };
    const legacyNumber = Number(domain);
    const domainId = Number.isInteger(legacyNumber) ? domainIdFromNumber(examId, legacyNumber) : null;
    if (domainId) return { kind: "domain", domainId };
  }
  const cat = params.get("cat");
  if (cat && categoryBelongsToExam(examId, cat)) return { kind: "category", slug: cat };
  return { kind: "all" };
}

export function focusToParams(focus: MapFocus, params: URLSearchParams) {
  params.delete("domain");
  params.delete("cat");
  if (focus.kind === "domain") params.set("domain", focus.domainId);
  else if (focus.kind === "category") params.set("cat", focus.slug);
}

/**
 * Keeps `focus` (category/domain scope) and `selectedId` (picked service) in
 * the URL's query string, so a refresh on /mapa, /catalogo or /practicar lands
 * back on the same filter and selection instead of resetting to "all".
 * Uses router.replace (not push) so filter clicks don't pile up browser history.
 */
export function useUrlFocus() {
  const { exam } = useExam();
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();

  const domainParam = searchParams.get("domain");
  const catParam = searchParams.get("cat");
  // Memoize on the individual params (not the searchParams object), so
  // selecting a service — which only touches ?service= — doesn't produce a
  // new `focus` reference and re-trigger the mind map's layout recompute.
  const focus = useMemo(() => {
    const focusParams = new URLSearchParams();
    if (domainParam) focusParams.set("domain", domainParam);
    if (catParam) focusParams.set("cat", catParam);
    return parseFocus(focusParams, exam.id);
  }, [domainParam, catParam, exam.id]);
  const selectedId = searchParams.get("service");

  useEffect(() => {
    const invalidDomain = domainParam && focus.kind !== "domain";
    const invalidCategory = catParam && focus.kind !== "category";
    if (!invalidDomain && !invalidCategory) return;
    const params = new URLSearchParams(searchParams.toString());
    if (invalidDomain) params.delete("domain");
    if (invalidCategory) params.delete("cat");
    params.delete("service");
    const query = params.toString();
    router.replace(query ? `${pathname}?${query}` : pathname, { scroll: false });
  }, [catParam, domainParam, focus.kind, pathname, router, searchParams]);

  const setFocus = useCallback(
    (f: MapFocus) => {
      const params = new URLSearchParams(searchParams.toString());
      focusToParams(f, params);
      params.delete("service");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  const setSelectedId = useCallback(
    (id: string | null) => {
      const params = new URLSearchParams(searchParams.toString());
      if (id) params.set("service", id);
      else params.delete("service");
      const qs = params.toString();
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    },
    [pathname, router, searchParams],
  );

  return { focus, setFocus, selectedId, setSelectedId };
}
