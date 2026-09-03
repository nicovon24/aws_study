"use client";

import { useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import type { StudyPriority } from "@/lib/types";

const LEVELS: { value: StudyPriority; label: typeof UI.priorityHigh; tooltip: typeof UI.priorityHighTooltip; color: string }[] = [
  { value: 1, label: UI.priorityHigh, tooltip: UI.priorityHighTooltip, color: "#ff6b6b" },
  { value: 2, label: UI.priorityMedium, tooltip: UI.priorityMediumTooltip, color: "#e0c341" },
  { value: 3, label: UI.priorityLow, tooltip: UI.priorityLowTooltip, color: "#6fe07a" },
];

type Props = {
  value: Set<StudyPriority>;
  onChange: (next: Set<StudyPriority>) => void;
};

/** Compact dot group to filter services by study priority. Each dot keeps its
 * own tooltip naming the level it stands for. */
export default function PriorityFilter({ value, onChange }: Props) {
  const { locale } = useLocale();

  function toggle(level: StudyPriority) {
    const next = new Set(value);
    next.has(level) ? next.delete(level) : next.add(level);
    onChange(next);
  }

  return (
    <div className="flex items-center gap-1">
      {LEVELS.map((l) => {
        const active = value.has(l.value);
        const label = pick(locale, l.label);
        return (
          <button
            key={l.value}
            type="button"
            aria-pressed={active}
            title={`${pick(locale, UI.priorityFilterLabel)} ${label} — ${pick(locale, l.tooltip)}`}
            onClick={() => toggle(l.value)}
            style={{
              color: active ? l.color : undefined,
              borderColor: active ? `${l.color}88` : undefined,
              background: active ? `${l.color}14` : undefined,
            }}
            className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-md border font-mono text-[11px] uppercase transition-colors ${
              active ? "" : "border-line text-muted-2 hover:border-muted-2/70 hover:text-ink-2"
            }`}
          >
            {label.charAt(0)}
          </button>
        );
      })}
    </div>
  );
}
