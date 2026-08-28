"use client";

import { Star } from "lucide-react";
import { signIn, useSession } from "next-auth/react";
import { useMemo, useState } from "react";
import { getExamItem, getItemPriority } from "@/data/exams";
import { useExam, useFavorites, useLocale } from "@/hooks";
import { byId, byKey, catBySlug } from "@/lib/graph";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import { AccentButton, PriorityBadge } from "@/components/ui";
import { DetailPanel, FavoriteStar, PriorityFilter } from "@/components/shared";

type Props = {
  selectedId: string | null;
  onSelect: (id: string | null) => void;
};

export default function FavoritesView({ selectedId, onSelect }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  const { status } = useSession();
  const { favorites, loaded } = useFavorites();
  const [priorities, setPriorities] = useState<Set<1 | 2 | 3>>(new Set([1, 2, 3]));

  const groups = useMemo(() => {
    const nodes = [...favorites]
      .map((key) => byKey[key])
      .filter(Boolean)
      .filter((node) => Boolean(getExamItem(exam.id, node.key)))
      .filter((node) => priorities.has(getItemPriority(exam.id, node.key) ?? node.priority ?? 2));
    const map = new Map<string, typeof nodes>();
    for (const node of nodes) {
      const list = map.get(node.catSlug) ?? [];
      list.push(node);
      map.set(node.catSlug, list);
    }
    return [...map.entries()]
      .map(([slug, items]) => ({ cat: catBySlug[slug], items }))
      .filter((g) => g.cat);
  }, [exam.id, favorites, priorities]);

  const total = groups.reduce((n, g) => n + g.items.length, 0);

  return (
    <main className="flex min-h-0 flex-1">
      <div className="flex min-w-0 flex-1 flex-col">
        <div className="flex shrink-0 flex-wrap items-center gap-3.5 border-b border-line bg-panel px-4 py-3.5 sm:px-6">
          <span className="flex items-center gap-2 font-sans text-sm font-bold text-white">
            <Star size={16} fill="#e0c341" color="#e0c341" />
            {pick(locale, UI.navFavorites)}
          </span>
          {status === "authenticated" && favorites.size > 0 && (
            <PriorityFilter value={priorities} onChange={setPriorities} />
          )}
          {status === "authenticated" && (
            <div className="ml-auto font-mono text-xs text-muted-2">
              {total} {pick(locale, UI.favoritesCount)}
            </div>
          )}
        </div>

        <div className="flex-1 overflow-auto px-4 pb-10 pt-4 sm:px-6 sm:pt-5.5">
          {status !== "authenticated" ? (
            <EmptyState>
              <p className="mb-4 max-w-sm text-sm leading-relaxed text-muted">
                {pick(locale, UI.favoritesSignInPrompt)}
              </p>
              <AccentButton onClick={() => signIn("google")}>{pick(locale, UI.signIn)}</AccentButton>
            </EmptyState>
          ) : !loaded ? null : exam.items.length === 0 ? (
            <EmptyState>
              <p className="font-semibold text-white">{pick(locale, UI.examContentPreparing)}</p>
              <p className="max-w-sm text-sm leading-relaxed text-muted">{pick(locale, UI.examContentPreparingDetail)}</p>
            </EmptyState>
          ) : total === 0 ? (
            <EmptyState>
              <p className="max-w-sm text-sm leading-relaxed text-muted">{pick(locale, UI.favoritesEmpty)}</p>
            </EmptyState>
          ) : (
            <div className="flex flex-col gap-5">
              {groups.map(({ cat, items }) => (
                <div key={cat.slug}>
                  <div
                    className="mb-1.5 inline-block rounded border px-1.5 py-1.75 font-mono text-[11px] uppercase tracking-[.08em]"
                    style={{ color: cat.accent, borderColor: `${cat.accent}55`, background: `${cat.accent}12` }}
                  >
                    {pick(locale, cat.cat)}
                  </div>
                  <div className="grid grid-cols-1 gap-2 sm:grid-cols-2 lg:grid-cols-3">
                    {items.map((node) => {
                      const active = node.id === selectedId;
                      const d = pick(locale, node.d);
                      return (
                        <div
                          key={node.id}
                          role="button"
                          tabIndex={0}
                          onClick={() => onSelect(node.id)}
                          onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && onSelect(node.id)}
                          title={d}
                          style={{
                            borderLeftColor: active ? node.accent : `${node.accent}88`,
                            background: active ? `${node.accent}14` : undefined,
                            boxShadow: active ? `0 0 0 1px ${node.accent}66` : undefined,
                          }}
                          className={`flex w-full cursor-pointer flex-col gap-1 rounded border border-l-[3px] px-2.75 py-2.25 text-left font-sans transition-all duration-150 hover:border-muted-2/60 hover:bg-[#1b2740] ${
                            active ? "border-transparent" : "border-line bg-panel-2"
                          }`}
                        >
                          <span className="flex items-center gap-1.5">
                            <span className="min-w-0 flex-1 truncate text-sm font-bold text-white">{pick(locale, node.name)}</span>
                            <FavoriteStar serviceKey={node.key} />
                          </span>
                          <span className="text-[11.5px] leading-[1.45] text-muted-2">
                            {d.length > 74 ? `${d.slice(0, 74)}…` : d}
                          </span>
                          <PriorityBadge
                            priority={getItemPriority(exam.id, node.key) ?? node.priority ?? 2}
                          />
                        </div>
                      );
                    })}
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      <DetailPanel node={selectedId ? (byId[selectedId] ?? null) : null} onSelect={onSelect} onClose={() => onSelect(null)} />
    </main>
  );
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-full flex-col items-center justify-center gap-3 py-16 text-center">
      <Star size={32} className="text-muted-2" />
      {children}
    </div>
  );
}
