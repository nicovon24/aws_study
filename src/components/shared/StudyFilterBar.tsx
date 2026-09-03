"use client";

import { CircleDashed, RotateCcw, SlidersHorizontal, Star } from "lucide-react";
import { useLocale } from "@/hooks";
import type { StudyFilters } from "@/hooks/useStudyFilters";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import { FilterToggle } from "@/components/ui";
import PriorityFilter from "./PriorityFilter";

/** The favorites/reviewed/priority filter group, shared by the catalog and the map. */
export default function StudyFilterBar({ filters, className = "" }: { filters: StudyFilters; className?: string }) {
  const { locale } = useLocale();

  return (
    <div className={`flex items-center gap-2 rounded-lg border border-line bg-panel-2 px-2.5 py-1.5 ${className}`}>
      <span className="flex items-center gap-1.5 font-mono text-[10.5px] uppercase tracking-[.06em] text-muted-2">
        <SlidersHorizontal size={12} />
        <span className="hidden sm:inline">{pick(locale, UI.filtersLabel)}</span>
      </span>
      {filters.favSignedIn && (
        <FilterToggle
          active={filters.onlyFavorites}
          color="#e0c341"
          title={`${pick(locale, UI.onlyFavorites)} — ${pick(locale, UI.onlyFavoritesTooltip)}`}
          onClick={() => filters.setOnlyFavorites((v) => !v)}
        >
          <Star size={14} fill={filters.onlyFavorites ? "#e0c341" : "none"} />
        </FilterToggle>
      )}
      {filters.revSignedIn && (
        <FilterToggle
          active={filters.onlyUnreviewed}
          color="#2ee6a8"
          title={`${pick(locale, UI.onlyUnreviewed)} — ${pick(locale, UI.onlyUnreviewedTooltip)}`}
          onClick={() => filters.setOnlyUnreviewed((v) => !v)}
        >
          <CircleDashed size={14} />
        </FilterToggle>
      )}
      <span className="h-5 w-px bg-line" aria-hidden />
      <PriorityFilter value={filters.priorities} onChange={filters.setPriorities} />
      {filters.anyActive && (
        <button
          type="button"
          onClick={filters.reset}
          title={pick(locale, UI.clearFilters)}
          className="flex h-7 w-7 shrink-0 items-center justify-center rounded-md border border-line text-muted-2 transition-colors hover:border-accent/60 hover:text-accent"
        >
          <RotateCcw size={13} />
        </button>
      )}
    </div>
  );
}
