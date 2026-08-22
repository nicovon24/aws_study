"use client";

import { useEffect, useState } from "react";
import type { View } from "@/lib/types";

type Props = {
  view: View;
  onNavigate: (v: View) => void;
  /** Extra content (e.g. category filters) shown below the nav tabs inside the mobile drawer. */
  children?: React.ReactNode;
};

const TABS: { key: View; label: string }[] = [
  { key: "dashboard", label: "Home" },
  { key: "map", label: "Mapa" },
  { key: "catalog", label: "Catálogo" },
  { key: "practice", label: "Practicar" },
];

export default function Header({ view, onNavigate, children }: Props) {
  const [open, setOpen] = useState(false);

  // Close the drawer whenever the view changes (nav tap, or programmatic navigation).
  useEffect(() => {
    setOpen(false);
  }, [view]);

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open]);

  return (
    <header className="relative z-70 flex h-16 shrink-0 items-center gap-7 border-b border-line bg-panel-2 px-4 sm:px-6">
      <div className="flex items-baseline gap-2.5">
        <span className="text-[22px] font-black tracking-tight text-white">aws</span>
        <span className="text-[17px] font-bold text-white">Study</span>
        <span className="hidden whitespace-nowrap rounded border border-[#6b4218] bg-[#2a1b0c] px-1.75 py-0.5 font-mono text-[11px] text-accent sm:inline">
          CLF-C02
        </span>
      </div>

      <nav className="ml-2 hidden gap-1 md:flex">
        {TABS.map((t) => (
          <button
            key={t.key}
            type="button"
            onClick={() => onNavigate(t.key)}
            className={`rounded-t-[3px] border-0 border-b-2 px-4 pb-1.75 pt-2.25 font-sans text-sm font-semibold ${
              view === t.key
                ? "border-accent bg-[#1f2d47] text-white"
                : "border-transparent text-muted-2 hover:text-ink-2"
            }`}
          >
            {t.label}
          </button>
        ))}
      </nav>

      <button
        type="button"
        aria-label={open ? "cerrar menú" : "abrir menú"}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-ink-2 md:hidden"
      >
        <span className="relative block h-3.5 w-4.5">
          <span
            className={`absolute left-0 top-0 h-0.5 w-full bg-current transition-transform duration-200 ${
              open ? "translate-y-1.5 rotate-45" : ""
            }`}
          />
          <span
            className={`absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 bg-current transition-opacity duration-150 ${
              open ? "opacity-0" : "opacity-100"
            }`}
          />
          <span
            className={`absolute bottom-0 left-0 h-0.5 w-full bg-current transition-transform duration-200 ${
              open ? "-translate-y-1.5 -rotate-45" : ""
            }`}
          />
        </span>
      </button>

      {/* Mobile drawer: full-width nav + (when provided) view-specific filters. */}
      <div
        onClick={() => setOpen(false)}
        className={`fixed inset-0 z-65 bg-black/50 transition-opacity duration-200 md:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        className={`fixed inset-y-0 left-0 z-70 flex w-full flex-col overflow-y-auto bg-panel-2 pb-6 pt-16 transition-transform duration-220 ease-out md:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <nav className="flex flex-col gap-1 px-4 pt-4">
          {TABS.map((t) => (
            <button
              key={t.key}
              type="button"
              onClick={() => onNavigate(t.key)}
              className={`rounded-md px-4 py-3 text-left font-sans text-[15px] font-semibold ${
                view === t.key ? "bg-[#1f2d47] text-white" : "text-muted-2 hover:bg-[#1b2740]/60 hover:text-ink-2"
              }`}
            >
              {t.label}
            </button>
          ))}
        </nav>

        {children && <div className="mt-2 border-t border-line px-4 pt-4">{children}</div>}
      </div>
    </header>
  );
}
