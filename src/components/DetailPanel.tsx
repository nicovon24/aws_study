"use client";

import { useEffect, useState } from "react";
import { byId, relatedIds } from "@/lib/graph";
import type { Node } from "@/lib/types";
import { useNotes } from "@/lib/useNotes";

type Props = {
  node: Node | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export default function DetailPanel({ node, onSelect, onClose }: Props) {
  const { notes, setNote } = useNotes();
  // Remount the folds on every service so they always start collapsed.
  const foldKey = node?.id ?? "none";
  const rels = node ? relatedIds(node.id) : [];

  useEffect(() => {
    if (!node) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [node, onClose]);

  return (
    <>
      <div
        onClick={onClose}
        className={`fixed inset-0 z-[55] bg-black/35 ${node ? "block" : "hidden"}`}
      />
      <aside
        style={{ "--pc-accent": node?.accent } as React.CSSProperties}
        className={`fixed inset-y-0 right-0 z-[60] w-[min(380px,92vw)] overflow-y-auto border-l border-line bg-panel-2 px-[1.3rem] pb-8 pt-[1.2rem] transition-transform duration-[180ms] ease-out ${
          node ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {node && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label="cerrar"
              className="absolute right-4 top-[.9rem] text-[1.1rem] text-muted"
            >
              ✕
            </button>

            <div className="mb-[.2rem] text-[.72rem] uppercase tracking-[.05em]" style={{ color: node.accent }}>
              {node.cat}
            </div>
            <h2 className="mb-[.8rem] mt-[.1rem] font-sans text-[1.3rem]">{node.name}</h2>
            <p className="mb-[.8rem] text-[.86rem] leading-[1.55] text-muted">{node.d}</p>

            {node.long && (
              // `long` is authored copy from the local dataset, not user input.
              <div
                className="long-copy mb-4 text-[.84rem] leading-[1.6] text-ink-2"
                dangerouslySetInnerHTML={{ __html: node.long }}
              />
            )}

            <Fold key={`use-${foldKey}`} title="Cuándo usarlo" show={!!node.use?.length}>
              <ul className="m-0 list-disc pl-[1.05rem] text-ink-2">
                {node.use?.map((t, i) => (
                  <li key={i} className="mb-[.22rem]">
                    {t}
                  </li>
                ))}
              </ul>
            </Fold>

            <Fold key={`avoid-${foldKey}`} title="Cuándo NO" show={!!node.avoid?.length} danger>
              <ul className="m-0 list-disc pl-[1.05rem] text-ink-2">
                {node.avoid?.map((t, i) => (
                  <li key={i} className="mb-[.22rem]">
                    {t}
                  </li>
                ))}
              </ul>
            </Fold>

            <Fold key={`con-${foldKey}`} title="Conceptos propios" show={!!node.concepts?.length}>
              <dl className="m-0">
                {node.concepts?.map((c, i) => (
                  <div key={i}>
                    <dt className={`panel-accent font-mono text-[.75rem] ${i === 0 ? "" : "mt-2"}`}>{c.t}</dt>
                    <dd className="ml-0 mt-[.1rem] text-muted">{c.d}</dd>
                  </div>
                ))}
              </dl>
            </Fold>

            {rels.length > 0 && (
              <>
                <span className="mb-[.35rem] mt-3 block text-[.72rem] uppercase tracking-[.04em] text-muted-2">
                  Se relaciona con
                </span>
                <div className="mb-[.9rem] text-[.8rem] leading-[1.7] text-muted">
                  {rels.map((rid) => (
                    <button
                      type="button"
                      key={rid}
                      onClick={() => onSelect(rid)}
                      className="mb-[.12rem] mr-[.2rem] mt-[.12rem] inline-block rounded-full border border-line px-2 py-[.15rem] font-mono text-[.72rem] text-ink-2 hover:border-[var(--pc-accent)] hover:text-[var(--pc-accent)]"
                    >
                      {byId[rid].name}
                    </button>
                  ))}
                </div>
              </>
            )}

            <a
              href={node.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mb-4 inline-block text-[.8rem] text-accent hover:underline"
            >
              ↗ doc oficial
            </a>

            <span className="mb-[.35rem] block text-[.72rem] uppercase tracking-[.04em] text-muted-2">
              Tus notas
            </span>
            <textarea
              value={notes[node.id] ?? ""}
              onChange={(e) => setNote(node.id, e.target.value)}
              placeholder="qué querés recordar de este servicio…"
              className="min-h-20 w-full resize-y rounded-md border border-line bg-panel px-[.65rem] py-[.55rem] font-mono text-[.8rem] text-ink placeholder:text-muted-2"
            />
          </>
        )}
      </aside>
    </>
  );
}

function Fold({
  title,
  show,
  danger,
  children,
}: {
  title: string;
  show: boolean;
  danger?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(false);
  if (!show) return null;
  return (
    <details
      open={open}
      onToggle={(e) => setOpen((e.currentTarget as HTMLDetailsElement).open)}
      className={`fold mb-[.55rem] overflow-hidden rounded-r-md border border-line border-l-2 bg-panel ${
        danger ? "border-l-danger" : "border-l-[var(--pc-accent,#4dd9c5)]"
      }`}
    >
      <summary
        className={`flex cursor-pointer select-none items-center gap-[.45rem] px-3 py-2 font-sans text-[.72rem] uppercase tracking-[.05em] hover:bg-white/[.03] ${
          danger ? "text-danger" : "panel-accent"
        }`}
      >
        {title}
      </summary>
      <div className="px-3 pb-[.6rem] text-[.82rem] leading-[1.55]">{children}</div>
    </details>
  );
}
