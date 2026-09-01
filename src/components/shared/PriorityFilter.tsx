"use client";

import { useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import { Pill } from "@/components/ui";

const LEVELS: { value: 1 | 2 | 3; label: typeof UI.priorityHigh; tooltip: typeof UI.priorityHighTooltip; color: string }[] = [
  { value: 1, label: UI.priorityHigh, tooltip: UI.priorityHighTooltip, color: "#ff6b6b" },
  { value: 2, label: UI.priorityMedium, tooltip: UI.priorityMediumTooltip, color: "#e0c341" },
  { value: 3, label: UI.priorityLow, tooltip: UI.priorityLowTooltip, color: "#6fe07a" },
];

type Props = {
  value: Set<1 | 2 | 3>;
  onChange: (next: Set<1 | 2 | 3>) => void;
};

/** Multi-select chip group to filter services by study priority. */
export default function PriorityFilter({ value, onChange }: Props) {
  const { locale } = useLocale();

  function toggle(level: 1 | 2 | 3) {
    const next = new Set(value);
    next.has(level) ? next.delete(level) : next.add(level);
    onChange(next);
  }

  return (
    <div className="flex items-center gap-1.5">
      <span className="font-mono text-[11px] uppercase tracking-[.04em] text-muted-2">
        {pick(locale, UI.priorityFilterLabel)}
      </span>
      {LEVELS.map((l) => (
        <Pill
          key={l.value}
          active={value.has(l.value)}
          color={l.color}
          small
          title={pick(locale, l.tooltip)}
          onClick={() => toggle(l.value)}
        >
          {pick(locale, l.label)}
        </Pill>
      ))}
    </div>
  );
}
