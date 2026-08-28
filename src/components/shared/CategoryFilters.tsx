"use client";

import { getCategoriesForDomain } from "@/data/exams";
import { useExam, useLocale } from "@/hooks";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { MapFocus } from "@/lib/types";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
};

export default function CategoryFilters({ focus, onFocusChange }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  return (
    <>
      <div className="px-2 pb-2.5 font-mono text-[11px] uppercase tracking-widest text-muted-2">
        {pick(locale, UI.categories)}
      </div>
      <div className="mb-3 flex flex-col gap-0.5">
        <CategoryButton
          active={focus.kind === "all"}
          label={pick(locale, UI.all)}
          count={null}
          onClick={() => onFocusChange({ kind: "all" })}
        />
      </div>

      {exam.domains.map((domain) => {
        const cats = getCategoriesForDomain(exam.id, domain.id);
        return (
          <div key={domain.id} className="mb-3">
            <button
              type="button"
              onClick={() => onFocusChange({ kind: "domain", domainId: domain.id })}
              title={`${pick(locale, UI.domainTitle)} ${domain.number} · ${domain.weight}% ${pick(locale, UI.ofExam)}`}
              className={`mb-0.5 flex w-full items-center gap-2.25 rounded px-2.5 py-1.5 font-sans text-[12px] font-bold uppercase tracking-[.04em] transition-colors duration-150 ${
                focus.kind === "domain" && focus.domainId === domain.id
                  ? "bg-[#1b2740] text-white"
                  : "text-muted-2 hover:bg-[#1b2740]/50 hover:text-ink-2"
              }`}
              style={{ color: focus.kind === "domain" && focus.domainId === domain.id ? domain.color : undefined }}
            >
              <span
                className="h-1.5 w-1.5 shrink-0 rounded-full"
                style={{
                  background: domain.color,
                  opacity: focus.kind === "domain" && focus.domainId === domain.id ? 1 : 0.5,
                }}
              />
              <span className="flex-1 text-left">{pick(locale, domain.name)}</span>
              <span className="font-mono text-[10px] font-normal normal-case tracking-normal text-muted-2">
                {domain.weight}%
              </span>
            </button>
            <div className="flex flex-col gap-0.5">
              {cats.map((cat) => (
                <CategoryButton
                  key={cat.slug}
                  active={focus.kind === "category" && focus.slug === cat.slug}
                  label={pick(locale, cat.cat)}
                  color={cat.accent}
                  count={cat.items.length}
                  onClick={() => onFocusChange({ kind: "category", slug: cat.slug })}
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
