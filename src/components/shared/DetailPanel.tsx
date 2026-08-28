"use client";

import { Star } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { architecturesUsing } from "@/data/architectures";
import { useFavorites, useLocale, useNote } from "@/hooks";
import { byId, relatedIds } from "@/lib/graph";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { Node } from "@/lib/types";

type Props = {
  node: Node | null;
  onSelect: (id: string) => void;
  onClose: () => void;
};

export default function DetailPanel({ node, onSelect, onClose }: Props) {
  const { locale } = useLocale();
  const t = (k: keyof typeof UI) => pick(locale, UI[k]);
  // Remount the folds on every service so they always start collapsed.
  const foldKey = node?.id ?? "none";
  const rels = node ? relatedIds(node.id) : [];
  const archs = node ? architecturesUsing(node.key) : [];
  const { isFavorite, toggle, signedIn: favSignedIn } = useFavorites();
  const note = useNote(node?.key ?? null);
  const favorited = node ? isFavorite(node.key) : false;

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
        className={`fixed inset-0 z-75 bg-black/35 ${node ? "block" : "hidden"}`}
      />
      <aside
        style={{ "--pc-accent": node?.accent } as React.CSSProperties}
        className={`fixed inset-y-0 right-0 z-80 w-full overflow-y-auto border-l border-line bg-panel-2 px-5 pb-8 pt-5 transition-transform duration-180 ease-out sm:w-[min(380px,92vw)] sm:pt-[1.2rem] ${
          node ? "translate-x-0" : "translate-x-full"
        }`}
      >
        {node && (
          <>
            <button
              type="button"
              onClick={onClose}
              aria-label={t("close")}
              className="absolute right-4 top-[.9rem] text-[1.1rem] text-muted"
            >
              ✕
            </button>

            <div className="mb-3 flex items-center gap-2">
              <span
                className="inline-block rounded-[3px] border px-2 py-[3px] font-mono text-[10.5px] uppercase tracking-[.06em]"
                style={{
                  color: node.accent,
                  borderColor: `${node.accent}55`,
                  background: `${node.accent}14`,
                }}
              >
                {pick(locale, node.cat)}
              </span>
              <button
                type="button"
                onClick={() => toggle(node.key)}
                disabled={!favSignedIn}
                title={favSignedIn ? t(favorited ? "removeFromFavorites" : "addToFavorites") : t("signInToUseFavorites")}
                className={`ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted-2 transition-colors ${
                  favSignedIn ? "hover:border-[#e0c341]/60 hover:text-[#e0c341]" : "cursor-not-allowed opacity-40"
                }`}
              >
                <Star size={15} fill={favorited ? "#e0c341" : "none"} color={favorited ? "#e0c341" : "currentColor"} />
              </button>
            </div>
            <h2 className="mb-[.4rem] mt-0 font-sans text-2xl font-bold tracking-tight text-white">{pick(locale, node.name)}</h2>
            <p className="mb-[.8rem] text-[.86rem] leading-[1.55] text-muted">{pick(locale, node.d)}</p>

            {node.long && (
              // `long` is authored copy from the local dataset, not user input.
              <div
                className="long-copy mb-4 text-[.84rem] leading-[1.6] text-ink-2"
                dangerouslySetInnerHTML={{ __html: pick(locale, node.long) }}
              />
            )}

            {node.list && node.list.length > 0 && (
              <ul className="m-0 mb-4 list-disc pl-[1.05rem] marker:text-(--pc-accent)">
                {node.list.map((item, i) => (
                  <li key={i} className="mb-[.35rem] text-[.8rem] leading-[1.45] text-ink-2">
                    <span className="panel-accent font-mono text-[.72rem]">{pick(locale, item.t)}</span>
                    {" — "}
                    {pick(locale, item.d)}
                  </li>
                ))}
              </ul>
            )}

            <Fold key={`use-${foldKey}`} title={t("whenToUse")} show={!!node.use?.length}>
              <ul className="m-0 list-disc pl-[1.05rem] text-ink-2">
                {node.use?.map((t, i) => (
                  <li key={i} className="mb-[.22rem]">
                    {pick(locale, t)}
                  </li>
                ))}
              </ul>
            </Fold>

            <Fold key={`avoid-${foldKey}`} title={t("whenNot")} show={!!node.avoid?.length} danger>
              <ul className="m-0 list-disc pl-[1.05rem] text-ink-2">
                {node.avoid?.map((t, i) => (
                  <li key={i} className="mb-[.22rem]">
                    {pick(locale, t)}
                  </li>
                ))}
              </ul>
            </Fold>

            <Fold key={`con-${foldKey}`} title={t("ownConcepts")} show={!!node.concepts?.length}>
              <dl className="m-0">
                {node.concepts?.map((c, i) => (
                  <div key={i}>
                    <dt className={`panel-accent font-mono text-[.75rem] ${i === 0 ? "" : "mt-2"}`}>{pick(locale, c.t)}</dt>
                    <dd className="ml-0 mt-[.1rem] text-muted">{pick(locale, c.d)}</dd>
                  </div>
                ))}
              </dl>
            </Fold>

            {rels.length > 0 && (
              <>
                <span className="mb-[.35rem] mt-3 block text-[.72rem] uppercase tracking-[.04em] text-muted-2">
                  {t("relatedTo")}
                </span>
                <div className="mb-[.9rem] text-[.8rem] leading-[1.7] text-muted">
                  {rels.map((rid) => (
                    <button
                      type="button"
                      key={rid}
                      onClick={() => onSelect(rid)}
                      className="mb-[.12rem] mr-[.2rem] mt-[.12rem] inline-block rounded-full border border-line px-2 py-[.15rem] font-mono text-[.72rem] text-ink-2 hover:border-[var(--pc-accent)] hover:text-[var(--pc-accent)]"
                    >
                      {pick(locale, byId[rid].name)}
                    </button>
                  ))}
                </div>
              </>
            )}

            {archs.length > 0 && (
              <>
                <span className="mb-[.35rem] mt-3 block text-[.72rem] uppercase tracking-[.04em] text-muted-2">
                  {t("appearsInArchitectures")}
                </span>
                <div className="mb-[.9rem] flex flex-col gap-1">
                  {archs.map((a) => (
                    <Link
                      key={a.id}
                      href={`/arquitecturas?id=${encodeURIComponent(a.id)}`}
                      className="rounded border border-line px-2.5 py-1.5 font-sans text-[.78rem] text-ink-2 hover:border-[var(--pc-accent)] hover:text-[var(--pc-accent)]"
                    >
                      {pick(locale, a.title)}
                    </Link>
                  ))}
                </div>
              </>
            )}

            <div className="mb-4">
              <div className="mb-[.35rem] flex items-center justify-between">
                <span className="block text-[.72rem] uppercase tracking-[.04em] text-muted-2">{t("myNote")}</span>
                {note.signedIn && note.status !== "idle" && (
                  <span className="font-mono text-[.65rem] text-muted-2">
                    {note.status === "saving" ? t("noteSaving") : t("noteSaved")}
                  </span>
                )}
              </div>
              <textarea
                key={foldKey}
                value={note.content}
                onChange={(e) => note.setContent(e.target.value)}
                disabled={!note.signedIn}
                placeholder={note.signedIn ? pick(locale, UI.notePlaceholder) : t("signInToUseNotes")}
                rows={3}
                className={`w-full resize-y rounded border border-line bg-panel px-2.5 py-2 text-[.8rem] leading-[1.5] text-ink-2 outline-none placeholder:text-muted-2 focus:border-[var(--pc-accent)] ${
                  note.signedIn ? "" : "cursor-not-allowed opacity-50"
                }`}
              />
            </div>

            <a
              href={node.link}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-[.8rem] text-accent hover:underline"
            >
              {t("officialDoc")}
            </a>
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
        danger ? "border-l-danger" : "border-l-[var(--pc-accent,#ef4444)]"
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
