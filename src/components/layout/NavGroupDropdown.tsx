"use client";

import { AnimatePresence, motion } from "framer-motion";
import { ChevronDown, type House } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { useFavorites, useLocale } from "@/hooks";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { View } from "@/lib/types";

type Tab = { key: View; label: keyof typeof UI; icon: typeof House };

type Props = {
  groupLabel: string;
  tabs: Tab[];
  view: View;
  onNavigate: (v: View) => void;
};

export default function NavGroupDropdown({ groupLabel, tabs, view, onNavigate }: Props) {
  const { locale } = useLocale();
  const { favorites, signedIn } = useFavorites();
  const [open, setOpen] = useState(false);
  const rootRef = useRef<HTMLDivElement>(null);
  const isActiveGroup = tabs.some((t) => t.key === view);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    const onClick = (e: MouseEvent) => {
      if (rootRef.current && !rootRef.current.contains(e.target as Node)) setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    window.addEventListener("mousedown", onClick);
    return () => {
      window.removeEventListener("keydown", onKey);
      window.removeEventListener("mousedown", onClick);
    };
  }, [open]);

  useEffect(() => {
    setOpen(false);
  }, [view]);

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className={`flex items-center gap-1 rounded-t-[3px] border-0 border-b-2 px-3.5 pb-1.75 pt-2.25 font-sans text-sm font-semibold whitespace-nowrap ${
          isActiveGroup
            ? "border-accent bg-[#1f2d47] text-white"
            : "border-transparent text-muted-2 hover:text-ink-2"
        }`}
      >
        {groupLabel}
        <ChevronDown size={14} className={`transition-transform duration-150 ${open ? "rotate-180" : ""}`} />
      </button>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15, ease: "easeOut" }}
            className="absolute left-0 top-full z-80 mt-1 min-w-48 rounded-md border border-line bg-panel-2 p-1 shadow-lg"
          >
            {tabs.map((t) => (
              <button
                key={t.key}
                type="button"
                onClick={() => onNavigate(t.key)}
                className={`flex w-full items-center gap-2.5 rounded-md px-3 py-2 text-left font-sans text-sm font-semibold whitespace-nowrap ${
                  view === t.key ? "bg-[#1f2d47] text-white" : "text-muted-2 hover:bg-[#1b2740]/60 hover:text-ink-2"
                }`}
              >
                <t.icon size={16} strokeWidth={2.2} />
                {pick(locale, UI[t.label])}
                {t.key === "favorites" && signedIn && favorites.size > 0 && (
                  <span className="text-muted-2">({favorites.size})</span>
                )}
              </button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
