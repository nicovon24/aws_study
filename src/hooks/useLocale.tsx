"use client";

import { createContext, useContext, useEffect, useState, type ReactNode } from "react";
import { LOCALE_KEY, type Locale } from "@/lib/locale";

const LocaleCtx = createContext<{ locale: Locale; setLocale: (l: Locale) => void } | null>(null);

/** Wraps the app; syncs the active locale to localStorage and `<html lang>`. */
export function LocaleProvider({ children }: { children: ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>("es");

  useEffect(() => {
    const saved = localStorage.getItem(LOCALE_KEY);
    if (saved === "es" || saved === "en") setLocaleState(saved);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(l: Locale) {
    setLocaleState(l);
    localStorage.setItem(LOCALE_KEY, l);
  }

  return <LocaleCtx.Provider value={{ locale, setLocale }}>{children}</LocaleCtx.Provider>;
}

export function useLocale() {
  const ctx = useContext(LocaleCtx);
  if (!ctx) throw new Error("useLocale must be used within LocaleProvider");
  return ctx;
}
