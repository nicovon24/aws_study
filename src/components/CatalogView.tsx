"use client";

import { PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useEffect, useMemo, useState } from "react";
import DATA from "@/data/services";
import { DOMAIN_META, domainOf } from "@/lib/domains";
import { byId } from "@/lib/graph";
import type { MapFocus } from "@/lib/types";
import AnimatedFilterSidebar from "./AnimatedFilterSidebar";
import CatalogSkeleton from "./CatalogSkeleton";
import DetailPanel from "./DetailPanel";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

function catMatchesFocus(focus: MapFocus, catName: string): boolean {
  if (focus.kind === "all") return true;
  if (focus.kind === "domain") return domainOf(catName) === focus.n;
  return catName === focus.name;
}

export default function CatalogView({ focus, onFocusChange, selectedId, onSelect }: Props) {
  const [q, setQ] = useState("");
  const [showFilters, setShowFilters] = useState(true);
  const query = q.trim().toLowerCase();

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
    const cols = DATA.filter((cat) => catMatchesFocus(focus, cat.cat))
      .map((cat) => {
        const ci = DATA.indexOf(cat);
        const items = cat.items
          .map((svc, si) => ({ id: `${ci}-${si}`, svc }))
          .filter(
            ({ svc }) =>
              !query || svc.name.toLowerCase().includes(query) || svc.d.toLowerCase().includes(query),
          );
        shown += items.length;
        return { cat, items };
      })
      .filter((col) => col.items.length > 0);
    return { cols, shown };
  }, [query, focus]);

  const focusLabel =
    focus.kind === "domain" ? DOMAIN_META[focus.n].name : focus.kind === "category" ? focus.name : null;

  return (
    <main className="flex min-h-0 flex-1">
      <AnimatedFilterSidebar focus={focus} onFocusChange={onFocusChange} show={showFilters} />

      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-3.5 border-b border-line bg-panel px-4 py-3.5 sm:px-6">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            title={showFilters ? "ocultar categorías" : "mostrar categorías"}
            className="hidden h-8 w-9 shrink-0 items-center justify-center rounded-lg border border-line bg-panel-2 text-muted-2 hover:text-ink md:flex"
          >
            {showFilters ? <PanelLeftClose size={17} /> : <PanelLeftOpen size={17} />}
          </button>
          <input
            value={q}
            onChange={(e) => setQ(e.target.value)}
            placeholder="Buscar servicio o concepto…"
            className="w-full rounded border border-line bg-bg px-3.5 py-2.25 font-sans text-sm text-ink outline-none focus:border-accent sm:w-70"
          />
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
          <div className="font-mono text-xs text-muted-2">{columns.shown} items visibles</div>
        </div>

        {isFiltering ? (
          <CatalogSkeleton />
        ) : (
          <div className="flex-1 overflow-auto px-4 pb-10 pt-4 sm:px-6 sm:pt-5.5">
            <div className="flex flex-col items-stretch gap-3.5 sm:flex-row sm:items-start">
              {columns.cols.map(({ cat, items }) => (
                <div key={cat.cat} className="flex flex-col gap-1.5 sm:w-53 sm:shrink-0">
                  <div
                    className="mb-0.5 rounded border px-1.5 py-1.75 text-center font-mono text-[11px] uppercase tracking-[.08em]"
                    style={{ color: cat.accent, borderColor: `${cat.accent}55`, background: `${cat.accent}12` }}
                  >
                    {cat.cat}
                  </div>
                  {items.map(({ id, svc }) => {
                    const active = id === selectedId;
                    return (
                      <button
                        key={id}
                        type="button"
                        onClick={() => onSelect(id)}
                        title={svc.d}
                        style={{
                          borderLeftColor: active ? cat.accent : `${cat.accent}88`,
                          background: active ? `${cat.accent}14` : undefined,
                          boxShadow: active ? `0 0 0 1px ${cat.accent}66` : undefined,
                        }}
                        className={`flex w-full flex-col gap-1 rounded border border-l-[3px] px-2.75 py-2.25 text-left font-sans transition-all duration-150 hover:border-muted-2/60 hover:bg-[#1b2740] ${
                          active ? "border-transparent" : "border-line bg-panel-2"
                        }`}
                      >
                        <span className="text-sm font-bold text-white">{svc.name}</span>
                        <span className="text-[11.5px] leading-[1.45] text-muted-2">
                          {svc.d.length > 74 ? `${svc.d.slice(0, 74)}…` : svc.d}
                        </span>
                      </button>
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
