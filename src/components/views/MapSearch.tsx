"use client";

import { useMemo, useRef, useState } from "react";
import { Input } from "@/components/ui";
import { useDebouncedValue, useLocale } from "@/hooks";
import { byId } from "@/lib/graph";
import { pick as pickLocale } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { Node } from "@/lib/types";

type Props = {
  onPick: (node: Node) => void;
};

const MAX_RESULTS = 8;

/** Debounced service search for the mind map: typing filters a dropdown of
 * matching services (by name or description), picking one centers that node. */
export default function MapSearch({ onPick }: Props) {
  const { locale } = useLocale();
  const [raw, setRaw] = useState("");
  const [open, setOpen] = useState(false);
  const query = useDebouncedValue(raw.trim().toLowerCase(), 200);
  const containerRef = useRef<HTMLDivElement>(null);

  const results = useMemo(() => {
    if (!query) return [];
    return Object.values(byId)
      .filter(
        (n) =>
          n.name.es.toLowerCase().includes(query) ||
          n.name.en.toLowerCase().includes(query) ||
          pickLocale(locale, n.d).toLowerCase().includes(query),
      )
      .slice(0, MAX_RESULTS);
  }, [query, locale]);

  function pick(node: Node) {
    onPick(node);
    setRaw("");
    setOpen(false);
  }

  return (
    <div ref={containerRef} className="relative w-full max-w-70">
      <Input
        value={raw}
        onChange={(e) => {
          setRaw(e.target.value);
          setOpen(true);
        }}
        onFocus={() => setOpen(true)}
        onBlur={() => {
          // Delay so a click on a result registers before the dropdown unmounts.
          setTimeout(() => setOpen(false), 120);
        }}
        placeholder={pickLocale(locale, UI.searchService)}
        className="w-full"
      />
      {open && query && (
        <div className="absolute left-0 right-0 top-[calc(100%+6px)] z-20 max-h-80 overflow-auto rounded border border-line bg-panel-2 shadow-[0_12px_30px_rgba(5,8,15,.5)]">
          {results.length === 0 ? (
            <div className="px-3 py-2.5 text-[13px] text-muted-2">{pickLocale(locale, UI.noResults)}</div>
          ) : (
            results.map((n) => (
              <button
                key={n.id}
                type="button"
                onMouseDown={(e) => e.preventDefault()}
                onClick={() => pick(n)}
                className="flex w-full flex-col gap-0.5 border-b border-line px-3 py-2 text-left last:border-b-0 hover:bg-[#1b2740]"
              >
                <span className="flex items-center gap-2 text-sm font-bold text-white">
                  <span className="h-1.5 w-1.5 shrink-0 rounded-full" style={{ background: n.accent }} />
                  {pickLocale(locale, n.name)}
                </span>
                <span className="truncate text-[11.5px] text-muted-2">{pickLocale(locale, n.d)}</span>
              </button>
            ))
          )}
        </div>
      )}
    </div>
  );
}
