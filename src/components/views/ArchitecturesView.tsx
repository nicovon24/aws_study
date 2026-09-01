"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useEffect } from "react";
import { ARCHITECTURES } from "@/data/architectures";
import { getExamItemKeys } from "@/data/exams";
import { useExam, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import { DiagramViewer, MermaidDiagram } from "@/components/diagrams";

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export default function ArchitecturesView({ selectedId, onSelect }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  const examKeys = getExamItemKeys(exam.id);
  const architectures = ARCHITECTURES.filter((architecture) =>
    architecture.services.some((serviceKey) => examKeys.has(serviceKey)),
  );
  const active = architectures.find((a) => a.id === selectedId) ?? null;

  useEffect(() => {
    if (!active) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onSelect(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [active, onSelect]);

  return (
    <main className="flex-1 overflow-auto px-10 py-8 pb-[60px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">
          {pick(locale, UI.archEyebrow)}
        </div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">{pick(locale, UI.archTitle)}</h1>
        <p className="mb-7 max-w-[620px] text-[15px] text-muted">{pick(locale, UI.archSubtitle)}</p>

        {architectures.length === 0 ? (
          <div className="rounded-xl border border-accent/30 bg-accent/8 p-5 text-sm">
            <p className="font-semibold text-white">{pick(locale, UI.examContentPreparing)}</p>
            <p className="mt-1 text-muted-2">{pick(locale, UI.examContentPreparingDetail)}</p>
          </div>
        ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {architectures.map((a) => (
            <button
              key={a.id}
              type="button"
              onClick={() => onSelect(a.id)}
              className="flex flex-col gap-3 rounded-lg border border-line bg-panel-2 px-[22px] pb-[18px] pt-5 text-left transition-colors hover:border-accent/50"
            >
              <div className="text-[17px] font-bold leading-[1.3]">{pick(locale, a.title)}</div>
              <p className="text-[13px] leading-[1.5] text-muted">{pick(locale, a.description)}</p>
              <MermaidDiagram
                chart={pick(locale, a.mermaid)}
                className="flex h-32 w-full items-center justify-center overflow-hidden [&_svg]:max-h-32 [&_svg]:w-full"
              />
            </button>
          ))}
        </div>
        )}
      </div>

      <AnimatePresence>
        {active && (
          <motion.div
            key="backdrop"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.15 }}
            onClick={() => onSelect(null)}
            className="fixed inset-0 z-90 bg-black/50"
          >
            <motion.div
              key="modal"
              initial={{ opacity: 0, scale: 0.96, y: 8 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.96, y: 8 }}
              transition={{ duration: 0.18, ease: "easeOut" }}
              onClick={(e) => e.stopPropagation()}
              className="fixed left-1/2 top-1/2 z-95 flex max-h-[90vh] w-[min(1100px,94vw)] -translate-x-1/2 -translate-y-1/2 flex-col rounded-lg border border-line bg-panel-2 px-4 py-5 shadow-[0_20px_60px_rgba(5,8,15,.6)] sm:px-6"
            >
              <button
                type="button"
                onClick={() => onSelect(null)}
                aria-label={pick(locale, UI.close)}
                className="absolute right-4 top-4 z-20 text-[1.1rem] text-muted hover:text-ink"
              >
                ✕
              </button>
              {active && (
                <>
                  <h2 className="mb-1 shrink-0 pr-8 text-xl font-bold">{pick(locale, active.title)}</h2>
                  <p className="mb-4 shrink-0 max-w-[720px] text-sm text-muted">{pick(locale, active.description)}</p>
                  <DiagramViewer
                    chart={pick(locale, active.mermaid)}
                    labels={{
                      zoomIn: pick(locale, UI.archZoomIn),
                      zoomOut: pick(locale, UI.archZoomOut),
                      reset: pick(locale, UI.archZoomReset),
                    }}
                  />
                </>
              )}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </main>
  );
}
