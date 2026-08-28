import { useLocale } from "@/hooks";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";

const LEVELS: Record<1 | 2 | 3, { label: typeof UI.priorityHigh; color: string }> = {
  1: { label: UI.priorityHigh, color: "#ff6b6b" },
  2: { label: UI.priorityMedium, color: "#e0c341" },
  3: { label: UI.priorityLow, color: "#6fe07a" },
};

/** Small non-interactive study-priority indicator (1 = high, 2 = medium, 3 = low). */
export default function PriorityBadge({ priority }: { priority: 1 | 2 | 3 }) {
  const { locale } = useLocale();
  const { label, color } = LEVELS[priority];
  return (
    <span
      style={{ color, borderColor: `${color}55`, background: `${color}14` }}
      className="inline-block w-fit shrink-0 rounded-full border px-1.5 py-[1px] font-mono text-[9.5px] uppercase tracking-[.04em]"
    >
      {pick(locale, label)}
    </span>
  );
}
