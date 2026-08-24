"use client";

import { ChevronDown } from "lucide-react";
import { useLocale } from "@/hooks";

const LABEL = { es: "Es", en: "En" };

function FlagAR() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" className="shrink-0 rounded-[2px]">
      <rect width="18" height="13" fill="#74ACDF" />
      <rect y="4.33" width="18" height="4.33" fill="#fff" />
      <circle cx="9" cy="6.5" r="1.6" fill="#F6B40E" stroke="#85340A" strokeWidth="0.25" />
    </svg>
  );
}

function FlagUS() {
  return (
    <svg width="18" height="13" viewBox="0 0 18 13" className="shrink-0 rounded-[2px]">
      <rect width="18" height="13" fill="#fff" />
      {[0, 2, 4, 6, 8, 10, 12].map((y) => (
        <rect key={y} y={y} width="18" height="1" fill="#B22234" />
      ))}
      <rect width="8" height="7" fill="#3C3B6E" />
    </svg>
  );
}

const FLAG = { es: FlagAR, en: FlagUS };

/** Flag + language code pill; click cycles between "es" and "en". */
export default function LocaleToggle() {
  const { locale, setLocale } = useLocale();
  const next = locale === "es" ? "en" : "es";
  const Flag = FLAG[locale];
  return (
    <button
      type="button"
      onClick={() => setLocale(next)}
      aria-label={locale === "es" ? "Switch to English" : "Cambiar a Español"}
      title={locale === "es" ? "English" : "Español"}
      className="flex shrink-0 items-center gap-1.5 rounded-full border border-accent/60 bg-panel-2 px-2.5 py-1 text-ink-2 transition-colors hover:border-accent hover:text-ink"
    >
      <Flag />
      <span className="font-sans text-[13px] font-semibold">{LABEL[locale]}</span>
      <ChevronDown size={14} className="text-muted-2" />
    </button>
  );
}
