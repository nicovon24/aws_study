"use client";

import { AnimatePresence, motion } from "framer-motion";
import {
  ChevronDown,
  Cloud,
  Dumbbell,
  LayoutGrid,
  LogIn,
  LogOut,
  Map as MapIcon,
  Network,
  ChartNoAxesColumnIncreasing,
  Star,
  House,
} from "lucide-react";
import { signIn, signOut, useSession } from "next-auth/react";
import { useEffect, useState } from "react";
import { EXAMS } from "@/data/exams";
import { LocaleToggle } from "@/components/ui";
import { useExam, useFavorites, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import type { Locale, View } from "@/lib/types";
import NavGroupDropdown from "./NavGroupDropdown";

type Props = {
  view: View;
  onNavigate: (v: View) => void;
  /** Extra content (e.g. category filters) shown below the nav tabs inside the mobile drawer. */
  children?: React.ReactNode;
};

const TABS: { key: View; label: keyof typeof UI; icon: typeof House }[] = [
  { key: "dashboard", label: "navHome", icon: House },
  { key: "catalog", label: "navCatalog", icon: LayoutGrid },
  { key: "map", label: "navMap", icon: MapIcon },
  { key: "architectures", label: "navArchitectures", icon: Network },
  { key: "practice", label: "navPractice", icon: Dumbbell },
  { key: "progress", label: "navProgress", icon: ChartNoAxesColumnIncreasing },
  { key: "favorites", label: "navFavorites", icon: Star },
];

// Home and Practicar are frequent single actions and stay as direct tabs (no dropdown).
// Estudiar groups the content-browsing views; Mi progreso groups review/tracking views.
// Order: Home, Estudiar, Mi progreso, Practicar (last).
const STUDY_KEYS: View[] = ["catalog", "map", "architectures"];
const MY_PROGRESS_KEYS: View[] = ["progress", "favorites"];
const HOME_TAB = TABS.find((t) => t.key === "dashboard")!;
const PRACTICE_TAB = TABS.find((t) => t.key === "practice")!;
const STUDY_TABS = TABS.filter((t) => STUDY_KEYS.includes(t.key));
const MY_PROGRESS_TABS = TABS.filter((t) => MY_PROGRESS_KEYS.includes(t.key));

const NAV_GROUPS: { labelKey: keyof typeof UI; tabs: typeof TABS }[] = [
  { labelKey: "navGroupStudy", tabs: STUDY_TABS },
  { labelKey: "navGroupMyProgress", tabs: MY_PROGRESS_TABS },
];

export default function Header({ view, onNavigate, children }: Props) {
  const { locale } = useLocale();
  const { exam, setExam } = useExam();
  const { data: session, status } = useSession();
  const { favorites, signedIn } = useFavorites();
  const [open, setOpen] = useState(false);
  const [openGroup, setOpenGroup] = useState<keyof typeof UI | null>(() =>
    MY_PROGRESS_KEYS.includes(view) ? "navGroupMyProgress" : "navGroupStudy",
  );

  // Close the drawer whenever the view changes (nav tap, or programmatic navigation).
  useEffect(() => {
    setOpen(false);
    if (STUDY_KEYS.includes(view) || MY_PROGRESS_KEYS.includes(view)) {
      setOpenGroup(MY_PROGRESS_KEYS.includes(view) ? "navGroupMyProgress" : "navGroupStudy");
    }
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
      <div className="flex items-center gap-2.5">
        <Cloud className="h-5.5 w-5.5 shrink-0 text-accent" strokeWidth={2.2} />
        <span className="flex items-baseline gap-2.5">
          <span className="text-[22px] font-black tracking-tight text-white">AWS</span>
          <span className="text-[17px] font-bold text-white">Prep</span>
        </span>
        <ExamSelect
          id="exam-selector-desktop"
          value={exam.id}
          onChange={setExam}
          label={pick(locale, UI.examSelector)}
          className="hidden sm:block"
        />
        <LocaleToggle />
      </div>

      <nav className="ml-4 hidden gap-1.5 lg:flex">
        <StandaloneTab tab={HOME_TAB} view={view} onNavigate={onNavigate} locale={locale} />
        {NAV_GROUPS.map((g) => (
          <NavGroupDropdown
            key={g.labelKey}
            groupLabel={pick(locale, UI[g.labelKey])}
            tabs={g.tabs}
            view={view}
            onNavigate={onNavigate}
          />
        ))}
        <StandaloneTab tab={PRACTICE_TAB} view={view} onNavigate={onNavigate} locale={locale} />
      </nav>

      {status !== "loading" && (
        <button
          type="button"
          onClick={() => (session ? signOut() : signIn("google"))}
          className="ml-auto hidden shrink-0 items-center gap-2 rounded-md border border-line bg-panel px-3 py-1.5 font-mono text-xs text-muted-2 hover:border-muted-2/70 hover:text-ink-2 lg:flex"
        >
          {session ? (
            <>
              {session.user?.image ? (
                // eslint-disable-next-line @next/next/no-img-element
                <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
              ) : (
                <LogOut size={14} />
              )}
              {pick(locale, UI.signOut)}
            </>
          ) : (
            <>
              <LogIn size={14} />
              {pick(locale, UI.signIn)}
            </>
          )}
        </button>
      )}

      <button
        type="button"
        aria-label={open ? pick(locale, UI.closeMenu) : pick(locale, UI.openMenu)}
        aria-expanded={open}
        onClick={() => setOpen((v) => !v)}
        className="ml-auto flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-ink-2 lg:hidden"
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
        className={`fixed inset-0 z-65 bg-black/50 transition-opacity duration-200 lg:hidden ${
          open ? "opacity-100" : "pointer-events-none opacity-0"
        }`}
      />
      <div
        aria-hidden={!open}
        inert={!open}
        className={`fixed inset-y-0 left-0 z-70 flex w-full flex-col overflow-y-auto bg-panel-2 bg-repeat pb-6 pt-16 transition-transform duration-220 ease-out lg:hidden ${
          open ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{
          backgroundImage:
            "linear-gradient(#1c2b4a 1px,transparent 1px),linear-gradient(90deg,#1c2b4a 1px,transparent 1px),linear-gradient(#16233c 1px,transparent 1px),linear-gradient(90deg,#16233c 1px,transparent 1px)",
          backgroundSize: "73px 73px,73px 73px,18.25px 18.25px,18.25px 18.25px",
        }}
      >
        <button
          type="button"
          aria-label={pick(locale, UI.closeMenu)}
          onClick={() => setOpen(false)}
          className="absolute right-4 top-4 flex h-9 w-9 shrink-0 items-center justify-center rounded-md border border-line bg-panel text-ink-2"
        >
          <span className="relative block h-3.5 w-3.5">
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 rotate-45 bg-current" />
            <span className="absolute left-0 top-1/2 h-0.5 w-full -translate-y-1/2 -rotate-45 bg-current" />
          </span>
        </button>

        <div className="px-4 pb-2 pt-4 sm:hidden">
        <ExamSelect
          id="exam-selector-mobile"
          value={exam.id}
          onChange={(examId) => {
            setExam(examId);
            setOpen(false);
          }}
            label={pick(locale, UI.examSelector)}
            className="w-full"
          />
        </div>

        <nav className="flex flex-col gap-2 px-4 pt-2 sm:pt-4">
          <StandaloneMobileTab tab={HOME_TAB} view={view} onNavigate={onNavigate} locale={locale} />
          {NAV_GROUPS.map((g) => {
            const isOpen = openGroup === g.labelKey;
            return (
              <div key={g.labelKey}>
                <button
                  type="button"
                  aria-expanded={isOpen}
                  onClick={() => setOpenGroup(isOpen ? null : g.labelKey)}
                  className="flex w-full items-center justify-between rounded-md px-4 py-2.5 text-left font-sans text-[13px] font-bold uppercase tracking-wide text-muted-2"
                >
                  {pick(locale, UI[g.labelKey])}
                  <ChevronDown size={16} className={`transition-transform duration-150 ${isOpen ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.15, ease: "easeOut" }}
                      className="overflow-hidden"
                    >
                      <div className="flex flex-col gap-1 pb-1">
                        {g.tabs.map((t) => (
                          <button
                            key={t.key}
                            type="button"
                            onClick={() => onNavigate(t.key)}
                            className={`flex items-center gap-2.5 rounded-md px-4 py-3 text-left font-sans text-[15px] font-semibold ${
                              view === t.key
                                ? "bg-[#1f2d47] text-white"
                                : "text-muted-2 hover:bg-[#1b2740]/60 hover:text-ink-2"
                            }`}
                          >
                            <t.icon size={17} strokeWidth={2.2} />
                            {pick(locale, UI[t.label])}
                            {t.key === "favorites" && signedIn && favorites.size > 0 && (
                              <span className="text-muted-2">({favorites.size})</span>
                            )}
                          </button>
                        ))}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
          <StandaloneMobileTab tab={PRACTICE_TAB} view={view} onNavigate={onNavigate} locale={locale} />
        </nav>

        {status !== "loading" && (
          <div className="px-4 pt-2">
            <button
              type="button"
              onClick={() => (session ? signOut() : signIn("google"))}
              className="flex w-full items-center gap-2 rounded-md border border-line bg-panel px-4 py-3 text-left font-sans text-[15px] font-semibold text-muted-2 hover:text-ink-2"
            >
              {session ? (
                <>
                  {session.user?.image ? (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img src={session.user.image} alt="" className="h-5 w-5 rounded-full" />
                  ) : (
                    <LogOut size={16} />
                  )}
                  {pick(locale, UI.signOut)}
                </>
              ) : (
                <>
                  <LogIn size={16} />
                  {pick(locale, UI.signIn)}
                </>
              )}
            </button>
          </div>
        )}

        {children && (
          <div className="mt-2 border-t border-line px-4 pt-4" onClick={() => setOpen(false)}>
            {children}
          </div>
        )}
      </div>
    </header>
  );
}

type StandaloneTabProps = {
  tab: (typeof TABS)[number];
  view: View;
  onNavigate: (v: View) => void;
  locale: Locale;
};

function StandaloneTab({ tab, view, onNavigate, locale }: StandaloneTabProps) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(tab.key)}
      className={`rounded-t-[3px] border-0 border-b-2 px-3.5 pb-1.75 pt-2.25 font-sans text-sm font-semibold whitespace-nowrap ${
        view === tab.key
          ? "border-accent bg-[#1f2d47] text-white"
          : "border-transparent text-muted-2 hover:text-ink-2"
      }`}
    >
      {pick(locale, UI[tab.label])}
    </button>
  );
}

function StandaloneMobileTab({ tab, view, onNavigate, locale }: StandaloneTabProps) {
  return (
    <button
      type="button"
      onClick={() => onNavigate(tab.key)}
      className={`flex items-center gap-2.5 rounded-md px-4 py-3 text-left font-sans text-[15px] font-semibold ${
        view === tab.key ? "bg-[#1f2d47] text-white" : "text-muted-2 hover:bg-[#1b2740]/60 hover:text-ink-2"
      }`}
    >
      <tab.icon size={17} strokeWidth={2.2} />
      {pick(locale, UI[tab.label])}
    </button>
  );
}

function ExamSelect({
  id,
  value,
  onChange,
  label,
  className = "",
}: {
  id: string;
  value: string;
  onChange: (examId: string) => void;
  label: string;
  className?: string;
}) {
  return (
    <select
      id={id}
      aria-label={label}
      value={value}
      onChange={(event) => onChange(event.target.value)}
      className={`rounded border border-line bg-panel px-2 py-1 font-mono text-[11px] text-ink-2 outline-none focus:border-accent ${className}`}
    >
      {EXAMS.map((exam) => (
        <option key={exam.id} value={exam.id}>
          {exam.code}
        </option>
      ))}
    </select>
  );
}
