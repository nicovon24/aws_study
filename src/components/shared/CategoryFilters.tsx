"use client";

import DATA from "@/data/services";
import { DOMAIN_META, domainOf, type DomainNumber } from "@/lib/domains";
import type { MapFocus } from "@/lib/types";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
};

export default function CategoryFilters({ focus, onFocusChange }: Props) {
  return (
    <>
      <div className="px-2 pb-2.5 font-mono text-[11px] uppercase tracking-widest text-muted-2">categorías</div>
      <div className="mb-3 flex flex-col gap-0.5">
        <CategoryButton
          active={focus.kind === "all"}
          label="Todas"
          count={null}
          onClick={() => onFocusChange({ kind: "all" })}
        />
      </div>

      {([1, 2, 3, 4] as DomainNumber[]).map((n) => {
        const meta = DOMAIN_META[n];
        const cats = DATA.filter((c) => domainOf(c.cat) === n);
        return (
          <div key={n} className="mb-3">
            <button
              type="button"
              onClick={() => onFocusChange({ kind: "domain", n })}
              title={`Dominio ${n} · ${meta.weight}% del examen`}
              className={`mb-0.5 flex w-full items-center gap-2.25 rounded px-2.5 py-1.5 font-sans text-[12px] font-bold uppercase tracking-[.04em] transition-colors duration-150 ${
                focus.kind === "domain" && focus.n === n
                  ? "bg-[#1b2740] text-white"
                  : "text-muted-2 hover:bg-[#1b2740]/50 hover:text-ink-2"
              }`}
              style={{ color: focus.kind === "domain" && focus.n === n ? meta.color : undefined }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{ background: meta.color, opacity: focus.kind === "domain" && focus.n === n ? 1 : 0.5 }}
              />
              <span className="flex-1 text-left">{meta.name}</span>
              <span className="font-mono text-[10px] font-normal normal-case tracking-normal text-muted-2">
                {meta.weight}%
              </span>
            </button>
            <div className="flex flex-col gap-0.5">
              {cats.map((cat) => (
                <CategoryButton
                  key={cat.cat}
                  active={focus.kind === "category" && focus.name === cat.cat}
                  label={cat.cat}
                  color={cat.accent}
                  count={cat.items.length}
                  onClick={() => onFocusChange({ kind: "category", name: cat.cat })}
                />
              ))}
            </div>
          </div>
        );
      })}
    </>
  );
}

function CategoryButton({
  active,
  label,
  color,
  count,
  onClick,
}: {
  active: boolean;
  label: string;
  color?: string;
  count: number | null;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        borderLeftColor: active ? (color ?? "#ef4444") : "transparent",
        background: active ? `${color ?? "#ef4444"}14` : undefined,
      }}
      className={`flex w-full items-center gap-2.25 rounded border-l-2 px-2.5 py-2 font-sans text-[13.5px] transition-colors duration-150 ${
        active ? "font-bold text-white" : "text-ink-2 hover:bg-[#1b2740]/50 hover:text-white"
      }`}
    >
      {color && (
        <span
          className="block h-2 w-2 shrink-0 rounded-full transition-opacity"
          style={{ background: color, opacity: active ? 1 : 0.65 }}
        />
      )}
      <span className="flex-1 text-left">{label}</span>
      {count != null && (
        <span
          className="font-mono text-[11px] tabular-nums"
          style={{ color: active ? (color ?? "#ef4444") : undefined }}
        >
          {count}
        </span>
      )}
    </button>
  );
}
