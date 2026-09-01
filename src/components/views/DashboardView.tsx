"use client";

import { getCategoriesForDomain } from "@/data/exams";
import { useExam, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import type { MapFocus, View } from "@/lib/types";
import { AccentButton } from "@/components/ui";

type Props = {
  onStudy: (focus: MapFocus) => void;
  onNavigate: (v: View) => void;
};

export default function DashboardView({ onStudy, onNavigate }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  const domains = exam.domains.map((meta) => {
    const cats = getCategoriesForDomain(exam.id, meta.id);
    const count = cats.reduce((acc, c) => acc + c.items.length, 0);
    return { meta, cats, count };
  });
  const totalItems = exam.items.length;

  return (
    <main className="flex-1 overflow-auto px-4 py-8 pb-[60px] sm:px-10">
      <div className="mx-auto max-w-[1180px]">
        <p className="mb-4 max-w-[620px] text-[13px] text-muted-2">
          {pick(locale, UI.dashboardIntro)}{" "}
          <span className="text-ink-2">{pick(locale, exam.name)}</span>.
        </p>
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">
          {pick(locale, UI.dashboardEyebrow)}
        </div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">{pick(locale, exam.name)}</h1>
        <p className="mb-7 max-w-[620px] text-[15px] text-muted">
          {locale === "es"
            ? `${totalItems} servicios y conceptos organizados en ${exam.domains.length} dominios del examen.`
            : `${totalItems} services and concepts organized across ${exam.domains.length} exam domains.`}
        </p>

        {totalItems === 0 && (
          <div className="mb-7 rounded-lg border border-accent/35 bg-accent/8 px-4 py-3 text-sm text-ink-2">
            <strong className="text-white">{pick(locale, UI.examContentPreparing)}</strong>{" "}
            {pick(locale, UI.examContentPreparingDetail)}
          </div>
        )}

        <StudySteps onNavigate={onNavigate} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {domains.map(({ meta, cats, count }) => (
            <div
              key={meta.id}
              className="flex flex-col gap-[14px] rounded-lg border border-line bg-panel-2 px-[22px] pb-[18px] pt-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 font-mono text-[11px] tracking-widest text-muted-2">
                    {pick(locale, UI.domainLabel)} {meta.number}
                  </div>
                  <div className="text-[19px] font-bold leading-[1.25]">{pick(locale, meta.name)}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-mono text-[22px] font-medium leading-none" style={{ color: meta.color }}>
                    {meta.weight}%
                  </div>
                  <div className="text-[11px] text-muted-2">{pick(locale, UI.ofExam)}</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-[6px]">
                {cats.map((c) => (
                  <span
                    key={c.slug}
                    className="rounded-[3px] border px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[.06em]"
                    style={{ color: c.accent, borderColor: `${c.accent}55`, background: `${c.accent}14` }}
                  >
                    {pick(locale, c.cat)}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3">
                <span className="font-mono text-xs text-muted">
                  {count} {pick(locale, UI.servicesCount)}
                </span>
                <AccentButton
                  size="sm"
                  className="ml-auto"
                  onClick={() => onStudy({ kind: "domain", domainId: meta.id })}
                >
                  {pick(locale, UI.study)}
                </AccentButton>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StudySteps({ onNavigate }: { onNavigate: (v: View) => void }) {
  const { locale } = useLocale();
  return (
    <div className="mb-[34px] flex flex-wrap items-stretch gap-y-2">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-[10px] bg-[#1d5ff5] py-3 pl-5 pr-[26px] max-sm:w-full max-sm:pr-5"
        style={{ clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 50%,calc(100% - 16px) 100%,0 100%)" }}
      >
        <span className="text-[26px] font-black text-white">1</span>
        <span className="text-[15px] font-bold text-white">{pick(locale, UI.stepLearn)}</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate("practice")}
        className="-ml-[14px] flex items-center gap-[10px] bg-[#1b2740] py-3 pl-[30px] pr-[26px] hover:bg-[#233350] max-sm:ml-0 max-sm:w-full max-sm:pl-5 max-sm:pr-5"
        style={{
          clipPath: "polygon(16px 0,calc(100% - 16px) 0,100% 50%,calc(100% - 16px) 100%,16px 100%,0 50%)",
        }}
      >
        <span className="text-[26px] font-black text-[#f2b544]">2</span>
        <span className="text-[15px] font-bold text-ink-2">{pick(locale, UI.stepPractice)}</span>
      </button>
      <button
        type="button"
        onClick={() => onNavigate("practice")}
        className="-ml-[14px] flex items-center gap-[10px] bg-[#1b2740] px-[30px] py-3 hover:bg-[#233350] max-sm:ml-0 max-sm:w-full max-sm:px-5"
        style={{ clipPath: "polygon(16px 0,100% 0,100% 100%,16px 100%,0 50%)" }}
      >
        <span className="text-[26px] font-black text-[#2ee6a8]">3</span>
        <span className="text-[15px] font-bold text-muted">{pick(locale, UI.stepMock)}</span>
      </button>
    </div>
  );
}
