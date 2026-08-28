"use client";

import { PanelLeftClose, PanelLeftOpen, Star } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DATA from "@/data/services";
import { useFavorites, useLocale } from "@/hooks";
import { DOMAIN_META, domainOf } from "@/lib/domains";
import { byId, catBySlug } from "@/lib/graph";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { MapFocus } from "@/lib/types";
import { AnimatedFilterSidebar, DetailPanel, FavoriteStar, PriorityFilter } from "@/components/shared";
import { CatalogSkeleton } from "@/components/skeletons";
import { IconButton, Input, Pill, PriorityBadge } from "@/components/ui";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function catMatchesFocus(focus: MapFocus, catSlug: string): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return domainOf(catSlug) === focus.n;
  return catSlug === focus.slug;
}

export default function CatalogView({ focus, onFocusChange, selectedId, onSelect }: Props) {
  const { locale } = useLocale();
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const [onlyFavorites, setOnlyFavorites] = useState(false);
  const [priorities, setPriorities] = useState<Set<1 | 2 | 3>>(new Set([1, 2, 3]));
  const query = q.trim().toLowerCase();
  const { isFavorite, signedIn: favSignedIn } = useFavorites();

  useEffect(() => {
    if (!favSignedIn) setOnlyFavorites(false);
  }, [favSignedIn]);

  // Filtering is actually instant here, but a brief skeleton keeps the same
  // loading language as the mind map when switching category/domain focus.
  const [isFiltering, setIsFiltering] = useState(false);
  useEffect(() => {
    setIsFiltering(true);
    const id = setTimeout(() => setIsFiltering(false), 220);
    return () => clearTimeout(id);
  }, [focus]);

  const columns = useMemo(() => {
    let shown = 0;
    const cols = DATA.filter((cat) => catMatchesFocus(focus, cat.slug))
      .map((cat) => {
        const ci = DATA.indexOf(cat);
        const items = cat.items
          .map((svc, si) => ({ id: `${ci}-${si}`, svc }))
          .filter(
            ({ svc }) =>
              !query ||
              svc.name.es.toLowerCase().includes(query) ||
              svc.name.en.toLowerCase().includes(query) ||
              pick(locale, svc.d).toLowerCase().includes(query),
          )
          .filter(({ svc }) => !onlyFavorites || isFavorite(svc.key))
          .filter(({ svc }) => priorities.has(svc.priority ?? 2))
          .sort((a, b) => (a.svc.priority ?? 2) - (b.svc.priority ?? 2));
        shown += items.length;
        return { cat, items };
      })
      .filter((col) => col.items.length > 0);
    return { cols, shown };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [query, focus, locale, onlyFavorites, isFavorite, priorities]);

  const focusLabel =
    focus.kind === "domain"
      ? pick(locale, DOMAIN_META[focus.n].name)
      : focus.kind === "category"
        ? (catBySlug[focus.slug] && pick(locale, catBySlug[focus.slug].cat))
        : null;

  return (
    <main className="flex min-h-0 flex-1">
      <AnimatedFilterSidebar focus={focus} onFocusChange={onFocusChange} show={showFilters} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-3.5 border-b border-line bg-panel px-4 py-3.5 sm:px-6">
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
            className="w-full sm:w-70"
          />
          {favSignedIn && (
            <Pill
              active={onlyFavorites}
              color="#e0c341"
              title={pick(locale, UI.onlyFavoritesTooltip)}
              onClick={() => setOnlyFavorites((v) => !v)}
              className="flex items-center gap-1.5"
            >
              <Star size={11} fill={onlyFavorites ? "#e0c341" : "none"} />
              {pick(locale, UI.onlyFavorites)}
            </Pill>
          )}
          <PriorityFilter value={priorities} onChange={setPriorities} />
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

        {isFiltering ? (
          <CatalogSkeleton />
        ) : (
          <div className="flex-1 overflow-auto px-4 pb-10 pt-4 sm:px-6 sm:pt-5.5">
            <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-start">
              {columns.cols.map(({ cat, items }) => (
                <div key={cat.slug} className="flex flex-col gap-1.5 sm:w-53 sm:shrink-0">
                  <div
                    className="mb-0.5 rounded border px-1.5 py-1.75 text-center font-mono text-[11px] uppercase tracking-[.08em]"
                    style={{ color: cat.accent, borderColor: `${cat.accent}55`, background: `${cat.accent}12` }}
                  >
                    {pick(locale, cat.cat)}
                  </div>
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
                        title={d}
                        style={{
                          borderLeftColor: active ? cat.accent : `${cat.accent}88`,
                          background: active ? `${cat.accent}14` : undefined,
                          boxShadow: active ? `0 0 0 1px ${cat.accent}66` : undefined,
                        }}
                        className={`flex w-full cursor-pointer flex-col gap-1 rounded border border-l-[3px] px-2.75 py-2.25 text-left font-sans transition-all duration-150 hover:border-muted-2/60 hover:bg-[#1b2740] ${
                          active ? "border-transparent" : "border-line bg-panel-2"
                        }`}
                      >
                        <span className="flex items-center gap-1.5">
                          <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{pick(locale, svc.name)}</span>
                          <FavoriteStar serviceKey={svc.key} />
                        </span>
                        <span className="text-[11.5px] leading-[1.45] text-muted-2">
                          {d.length > 74 ? `${d.slice(0, 74)}…` : d}
                        </span>
                        <PriorityBadge priority={svc.priority ?? 2} />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      <DetailPanel node={selectedId ? byId[selectedId] : null} onSelect={onSelect} onClose={() => onSelect(null)} />
    </main>
  );
}
