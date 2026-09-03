"use client";

import { CheckCircle2, ExternalLink, Star, Workflow } from "lucide-react";
import Link from "next/link";
import { useState } from "react";
import { architecturesUsing } from "@/data/architectures";
import { useFavorites, useLocale, useNote, useReviewed } from "@/hooks";
import { byId, relatedIds } from "@/lib/study/graph";
import { pick } from "@/lib/ui/locale";
import { UI } from "@/lib/ui/uiStrings";
import { DiagramViewer } from "@/components/diagrams";
import type { Node } from "@/lib/types";

type Props = {
  node: Node;
  onSelect: (id: string) => void;
  /** Shows the "open full view" link. Omitted on the full-view page itself. */
  showFullViewLink?: boolean;
};

/**
 * The service detail content shared by the sliding `DetailPanel` and the
 * `/servicio/[key]` full-view page — same sections, same data, two frames.
 */
export default function ServiceContent({ node, onSelect, showFullViewLink }: Props) {
  const { locale } = useLocale();
  const t = (k: keyof typeof UI) => pick(locale, UI[k]);
  // Remount the folds on every service so they always start collapsed.
  const foldKey = node.id;
  const rels = relatedIds(node.id);
  const archs = architecturesUsing(node.key);
  const { isFavorite, toggle, signedIn: favSignedIn } = useFavorites();
  const { isReviewed, toggle: toggleReviewed, signedIn: revSignedIn } = useReviewed();
  const note = useNote(node.key);
  const favorited = isFavorite(node.key);
  const reviewed = isReviewed(node.key);

  return (
    <div style={{ "--pc-accent": node.accent } as React.CSSProperties}>
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
        {showFullViewLink && (
          <Link
            href={`/servicio/${node.key}`}
            title={t("viewFullPage")}
            className="ml-auto flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted-2 transition-colors hover:border-accent/60 hover:text-accent"
          >
            <ExternalLink size={14} />
          </Link>
        )}
        <button
          type="button"
          onClick={() => toggleReviewed(node.key)}
          disabled={!revSignedIn}
          title={revSignedIn ? t(reviewed ? "unmarkAsReviewed" : "markAsReviewed") : t("signInToUseReviewed")}
          className={`flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted-2 transition-colors ${
            showFullViewLink ? "" : "ml-auto"
          } ${revSignedIn ? "hover:border-[#2ee6a8]/60 hover:text-[#2ee6a8]" : "cursor-not-allowed opacity-40"}`}
        >
          <CheckCircle2 size={15} fill={reviewed ? "#2ee6a8" : "none"} color={reviewed ? "#0b1f19" : "currentColor"} strokeWidth={reviewed ? 0 : 2} />
        </button>
        <button
          type="button"
          onClick={() => toggle(node.key)}
          disabled={!favSignedIn}
          title={favSignedIn ? t(favorited ? "removeFromFavorites" : "addToFavorites") : t("signInToUseFavorites")}
          className={`flex h-7 w-7 items-center justify-center rounded-md border border-line text-muted-2 transition-colors ${
            favSignedIn ? "hover:border-[#e0c341]/60 hover:text-[#e0c341]" : "cursor-not-allowed opacity-40"
          }`}
        >
          <Star size={15} fill={favorited ? "#e0c341" : "none"} color={favorited ? "#e0c341" : "currentColor"} />
        </button>
      </div>
      <h2 className="mb-[.4rem] mt-0 font-sans text-2xl font-bold tracking-tight text-white">{pick(locale, node.name)}</h2>
      <p className="mb-[.8rem] text-[.86rem] leading-[1.55] text-muted">{pick(locale, node.d)}</p>

      {/* A flowchart needs real width to stay readable, so the side panel links
          to the full view instead of squeezing one into 380px. */}
      {node.diagram &&
        (showFullViewLink ? (
          <Link
            href={`/servicio/${node.key}`}
            className="mb-4 flex items-center gap-2.5 rounded-lg border border-line bg-panel px-3 py-2.5 text-[.8rem] text-ink-2 transition-colors hover:border-accent/60 hover:text-accent"
          >
            <Workflow size={16} className="shrink-0 text-accent" />
            <span className="flex-1">{pick(locale, UI.viewDiagram)}</span>
            <span aria-hidden className="text-muted-2">→</span>
          </Link>
        ) : (
          <div className="mb-4">
            <DiagramViewer
              chart={pick(locale, node.diagram)}
              labels={{
                zoomIn: pick(locale, UI.archZoomIn),
                zoomOut: pick(locale, UI.archZoomOut),
                reset: pick(locale, UI.archZoomReset),
              }}
            />
          </div>
        ))}

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
          {node.use?.map((u, i) => (
            <li key={i} className="mb-[.22rem]">
              {pick(locale, u)}
            </li>
          ))}
        </ul>
      </Fold>

      <Fold key={`avoid-${foldKey}`} title={t("whenNot")} show={!!node.avoid?.length} danger>
        <ul className="m-0 list-disc pl-[1.05rem] text-ink-2">
          {node.avoid?.map((a, i) => (
            <li key={i} className="mb-[.22rem]">
              {pick(locale, a)}
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
    </div>
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
