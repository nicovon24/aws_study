"use client";

import DATA from "@/data/services";
import { DOMAIN_META, domainOf, type DomainNumber } from "@/lib/domains";
import type { MapFocus, View } from "@/lib/types";

type Props = {
  onStudy: (focus: MapFocus) => void;
  onNavigate: (v: View) => void;
};

export default function DashboardView({ onStudy, onNavigate }: Props) {
  const domains = ([1, 2, 3, 4] as DomainNumber[]).map((n) => {
    const cats = DATA.filter((c) => domainOf(c.cat) === n);
    const count = cats.reduce((acc, c) => acc + c.items.length, 0);
    return { meta: DOMAIN_META[n], cats, count };
  });

  return (
    <main className="flex-1 overflow-auto px-10 py-8 pb-[60px]">
      <div className="mx-auto max-w-[1180px]">
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">
          tu ruta de estudio
        </div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">AWS Certified Cloud Practitioner</h1>
        <p className="mb-7 max-w-[620px] text-[15px] text-muted">
          80 servicios y conceptos organizados en los 4 dominios del examen. Estudiá por dominio y
          explorá el mapa.
        </p>

        <StudySteps onNavigate={onNavigate} />

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
          {domains.map(({ meta, cats, count }) => (
            <div
              key={meta.n}
              className="flex flex-col gap-[14px] rounded-lg border border-line bg-panel-2 px-[22px] pb-[18px] pt-5"
            >
              <div className="flex items-start justify-between gap-4">
                <div>
                  <div className="mb-1 font-mono text-[11px] tracking-[.1em] text-muted-2">
                    DOMINIO {meta.n}
                  </div>
                  <div className="text-[19px] font-bold leading-[1.25]">{meta.name}</div>
                </div>
                <div className="flex-shrink-0 text-right">
                  <div className="font-mono text-[22px] font-medium leading-none" style={{ color: meta.color }}>
                    {meta.weight}%
                  </div>
                  <div className="text-[11px] text-muted-2">del examen</div>
                </div>
              </div>

              <div className="flex flex-wrap gap-[6px]">
                {cats.map((c) => (
                  <span
                    key={c.cat}
                    className="rounded-[3px] border px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[.06em]"
                    style={{ color: c.accent, borderColor: `${c.accent}55`, background: `${c.accent}14` }}
                  >
                    {c.cat}
                  </span>
                ))}
              </div>

              <div className="mt-auto flex items-center gap-3">
                <span className="font-mono text-xs text-muted">{count} servicios</span>
                <button
                  type="button"
                  onClick={() => onStudy({ kind: "domain", n: meta.n })}
                  className="ml-auto bg-accent px-4 py-2 font-sans text-[13px] font-bold text-[#111827]"
                  style={{
                    clipPath:
                      "polygon(0 0,100% 0,100% calc(100% - 6px),calc(100% - 6px) 100%,0 100%)",
                  }}
                >
                  Estudiar
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}

function StudySteps({ onNavigate }: { onNavigate: (v: View) => void }) {
  return (
    <div className="mb-[34px] flex flex-wrap items-stretch gap-y-2">
      <button
        type="button"
        onClick={() => onNavigate("dashboard")}
        className="flex items-center gap-[10px] bg-[#1d5ff5] py-3 pl-5 pr-[26px] max-sm:w-full max-sm:pr-5"
        style={{ clipPath: "polygon(0 0,calc(100% - 16px) 0,100% 50%,calc(100% - 16px) 100%,0 100%)" }}
      >
        <span className="text-[26px] font-black text-white">1</span>
        <span className="text-[15px] font-bold text-white">Aprender</span>
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
        <span className="text-[15px] font-bold text-ink-2">Practicar</span>
      </button>
      <div
        className="-ml-[14px] flex cursor-not-allowed items-center gap-[10px] bg-[#1b2740] px-[30px] py-3 opacity-60 max-sm:ml-0 max-sm:w-full max-sm:px-5"
        style={{ clipPath: "polygon(16px 0,100% 0,100% 100%,16px 100%,0 50%)" }}
        title="Próximamente"
      >
        <span className="text-[26px] font-black text-[#2ee6a8]">3</span>
        <span className="text-[15px] font-bold text-muted">Simulacro</span>
      </div>
    </div>
  );
}
