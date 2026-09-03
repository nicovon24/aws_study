"use client";

import { PanelLeftClose, PanelLeftOpen, Workflow } from "lucide-react";
import { useMemo } from "react";
import { getExamDomain, getExamItem, getItemPriority } from "@/data/exams";
import DATA from "@/data/services";
import { useExam, useLocale, usePersistedState, useStudyFilters } from "@/hooks";
import { byId, catBySlug } from "@/lib/study/graph";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import type { MapFocus } from "@/lib/types";
import {
  AnimatedFilterSidebar,
  DetailPanel,
  FavoriteStar,
  ReviewedCheck,
  StudyFilterBar,
} from "@/components/shared";
import { IconButton, Input, PriorityBadge } from "@/components/ui";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function itemMatchesFocus(focus: MapFocus, examId: string, catSlug: string, itemKey: string): boolean {
  const examItem = getExamItem(examId, itemKey);
  if (!examItem) return false;
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return examItem.domainId === focus.domainId;
  return catSlug === focus.slug;
}

export default function CatalogView({ focus, onFocusChange, selectedId, onSelect }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  const [q, setQ] = usePersistedState("filters:catalog:query", "");
  const [showFilters, setShowFilters] = usePersistedState("filters:catalog:sidebar", true);
  const filters = useStudyFilters("catalog");
  const query = q.trim().toLowerCase();
  const { matches } = filters;

  const columns = useMemo(() => {
    let shown = 0;
    const cols = DATA.map((cat) => {
      const ci = DATA.indexOf(cat);
      const items = cat.items
        .map((svc, si) => ({ id: `${ci}-${si}`, svc }))
        .filter(({ svc }) => itemMatchesFocus(focus, exam.id, cat.slug, svc.key))
        .filter(
          ({ svc }) =>
            !query ||
            svc.name.es.toLowerCase().includes(query) ||
            svc.name.en.toLowerCase().includes(query) ||
            pick(locale, svc.d).toLowerCase().includes(query),
        )
        .filter(({ svc }) => matches(svc.key, getItemPriority(exam.id, svc.key) ?? svc.priority ?? 2))
        .sort(
          (a, b) =>
            (getItemPriority(exam.id, a.svc.key) ?? a.svc.priority ?? 2) -
            (getItemPriority(exam.id, b.svc.key) ?? b.svc.priority ?? 2),
        );
      shown += items.length;
      return { cat, items };
    }).filter((col) => col.items.length > 0);
    return { cols, shown };
  }, [query, focus, exam.id, locale, matches]);

  const focusLabel =
    focus.kind === "domain"
      ? pick(locale, getExamDomain(exam.id, focus.domainId)?.name ?? { es: "", en: "" })
      : focus.kind === "category"
        ? catBySlug[focus.slug] && pick(locale, catBySlug[focus.slug].cat)
        : null;

  return (
    <main className="flex min-h-0 flex-1">
      <AnimatedFilterSidebar focus={focus} onFocusChange={onFocusChange} show={showFilters} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-3 border-b border-line bg-panel px-4 py-3.5 sm:px-6">
          <IconButton
            size="sm"
            onClick={() => setShowFilters((v) => !v)}
            title={showFilters ? pick(locale, UI.hideCategories) : pick(locale, UI.showCategories)}
            className="hidden rounded-lg md:flex"
          >
            {showFilters ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </IconButton>
          <Input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder={pick(locale, UI.searchServiceOrConcept)}
            className="w-full sm:w-64"
          />
          <StudyFilterBar filters={filters} />
          {focusLabel && (
            <button
              type="button"
              onClick={() => onFocusChange({ kind: "all" })}
              className="flex items-center gap-2 rounded border border-accent/50 bg-accent/10 px-3 py-1.75 font-mono text-xs text-accent transition-colors hover:border-accent hover:bg-accent/20"
            >
              {focusLabel}
              <span aria-hidden>✕</span>
            </button>
          )}
          <div className="hidden flex-1 sm:block" />
          <div className="font-mono text-xs text-muted-2">
            {columns.shown} {pick(locale, UI.itemsVisible)}
          </div>
        </div>

        {exam.items.length === 0 ? (
          <div className="m-4 rounded-xl border border-accent/30 bg-accent/8 p-5 text-sm text-muted-1 sm:m-6">
            <p className="font-semibold text-white">{pick(locale, UI.examContentPreparing)}</p>
            <p className="mt-1 text-muted-2">{pick(locale, UI.examContentPreparingDetail)}</p>
          </div>
        ) : columns.shown === 0 ? (
          <div className="m-4 rounded-xl border border-line bg-panel-2 p-6 text-center text-sm text-muted-2 sm:m-6">
            <p>{pick(locale, UI.noResults)}</p>
            {filters.anyActive && (
              <button
                type="button"
                onClick={filters.reset}
                className="mt-3 rounded-md border border-accent/50 bg-accent/10 px-3 py-1.5 font-mono text-xs text-accent hover:border-accent"
              >
                {pick(locale, UI.clearFilters)}
              </button>
            )}
          </div>
        ) : (
          <div className="flex-1 overflow-auto px-4 pb-10 pt-4 sm:px-6 sm:pt-6">
            <div className="flex flex-col gap-7">
              {columns.cols.map(({ cat, items }) => (
                <section key={cat.slug}>
                  <div className="mb-2.5 flex items-center gap-2.5">
                    <h2
                      className="font-mono text-[11.5px] uppercase tracking-[.1em]"
                      style={{ color: cat.accent }}
                    >
                      {pick(locale, cat.cat)}
                    </h2>
                    <span className="h-px flex-1" style={{ background: `${cat.accent}33` }} />
                    <span className="font-mono text-[10.5px] text-muted-2">{items.length}</span>
                  </div>

                  <div className="grid grid-cols-[repeat(auto-fill,minmax(260px,1fr))] gap-2.5">
                    {items.map(({ id, svc }) => {
                      const active = id === selectedId;
                      const d = pick(locale, svc.d);
                      return (
                        <div
                          key={id}
                          role="button"
                          tabIndex={0}
                          onClick={() => onSelect(id)}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(id)}
                          style={{
                            borderLeftColor: active ? cat.accent : `${cat.accent}88`,
                            background: active ? `${cat.accent}14` : undefined,
                            boxShadow: active ? `0 0 0 1px ${cat.accent}66` : undefined,
                          }}
                          className={`flex cursor-pointer flex-col gap-2 rounded-lg border border-l-[3px] px-3.5 py-3 text-left font-sans transition-all duration-150 hover:border-muted-2/60 hover:bg-[#1b2740] ${
                            active ? "border-transparent" : "border-line bg-panel-2"
                          }`}
                        >
                          <span className="flex items-start gap-1.5">
                            <span className="min-w-0 flex-1 text-sm font-bold leading-snug text-white">
                              {pick(locale, svc.name)}
                            </span>
                            {svc.diagram && (
                              <Workflow
                                size={13}
                                className="mt-0.5 shrink-0 text-muted-2"
                                aria-label={pick(locale, UI.hasDiagram)}
                              />
                            )}
                            <ReviewedCheck itemKey={svc.key} />
                            <FavoriteStar serviceKey={svc.key} />
                          </span>
                          <span className="text-[12px] leading-[1.5] text-muted-2">{d}</span>
                          <PriorityBadge priority={getItemPriority(exam.id, svc.key) ?? svc.priority ?? 2} />
                        </div>
                      );
                    })}
                  </div>
                </section>
              ))}
            </div>
          </div>
        )}
      </div>

      <DetailPanel node={selectedId ? byId[selectedId] : null} onSelect={onSelect} onClose={() => onSelect(null)} />
    </main>
  );
}
