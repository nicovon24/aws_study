"use client";

import { useEffect, useMemo, useState } from "react";
import DATA from "@/data/services";
import { DOMAIN_META } from "@/lib/domains";
import {
  buildDeck,
  FLASHCARD_MODE_LABEL,
  nodesInScope,
  type Flashcard,
  type FlashcardMode,
} from "@/lib/flashcards";
import type { MapFocus, View } from "@/lib/types";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  onNavigate: (v: View) => void;
};

const MODES: FlashcardMode[] = ["guess-description", "guess-service"];

export default function PracticeView({ focus, onFocusChange, onNavigate }: Props) {
  const [mode, setMode] = useState<FlashcardMode>("guess-description");
  const [deck, setDeck] = useState<Flashcard[] | null>(null);

  const available = useMemo(() => nodesInScope(focus).length, [focus]);
  const [count, setCount] = useState<number | null>(null);

  // Re-clamp (or clear "all") whenever the scope shrinks below the chosen count.
  useEffect(() => {
    if (count != null && count > available) setCount(null);
  }, [available, count]);

  if (deck) {
    return <FlashcardSession mode={mode} deck={deck} onExit={() => setDeck(null)} />;
  }

  return (
    <main className="flex-1 overflow-auto px-10 py-8 pb-[60px]">
      <div className="mx-auto max-w-[720px]">
        <button
          type="button"
          onClick={() => onNavigate("dashboard")}
          aria-label="Volver"
          title="Volver"
          className="mb-4 flex h-9 w-9 items-center justify-center rounded-full border border-line bg-panel-2 text-ink-2 transition-colors hover:border-accent hover:text-accent"
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M19 12H5M12 19l-7-7 7-7" />
          </svg>
        </button>
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">practicar</div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">Flashcards</h1>
        <p className="mb-8 max-w-[520px] text-[15px] text-muted">
          Elegí qué querés repasar y en qué sentido: adivinar la descripción a partir del
          servicio, o el servicio a partir de la descripción.
        </p>

        <div className="mb-8">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">alcance</div>
          <div className="flex flex-wrap gap-2">
            <ScopeChip active={focus.kind === "all"} label="Todos" onClick={() => onFocusChange({ kind: "all" })} />
            {([1, 2, 3, 4] as const).map((n) => (
              <ScopeChip
                key={n}
                active={focus.kind === "domain" && focus.n === n}
                label={DOMAIN_META[n].name}
                color={DOMAIN_META[n].color}
                onClick={() => onFocusChange({ kind: "domain", n })}
              />
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {DATA.map((cat) => (
              <ScopeChip
                key={cat.cat}
                active={focus.kind === "category" && focus.name === cat.cat}
                label={cat.cat}
                color={cat.accent}
                small
                onClick={() => onFocusChange({ kind: "category", name: cat.cat })}
              />
            ))}
          </div>
        </div>

        <div className="mb-9">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">modo</div>
          <div className="flex gap-2">
            {MODES.map((m) => (
              <button
                key={m}
                type="button"
                onClick={() => setMode(m)}
                className={`rounded-lg border px-4 py-3 text-left font-sans text-sm font-semibold ${
                  mode === m
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line bg-panel-2 text-ink-2 hover:border-muted-2"
                }`}
              >
                {FLASHCARD_MODE_LABEL[m]}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-9">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">
            cantidad de preguntas
          </div>
          <div className="flex flex-wrap items-center gap-2">
            {[5, 10, 20].map((n) => (
              <button
                key={n}
                type="button"
                disabled={n > available}
                onClick={() => setCount(n)}
                className={`rounded-full border px-3 py-[6px] font-mono text-xs disabled:cursor-not-allowed disabled:opacity-30 ${
                  count === n
                    ? "border-accent bg-accent/10 text-accent"
                    : "border-line text-muted-2 hover:border-muted-2/70"
                }`}
              >
                {n}
              </button>
            ))}
            <button
              type="button"
              onClick={() => setCount(null)}
              className={`rounded-full border px-3 py-[6px] font-mono text-xs ${
                count === null
                  ? "border-accent bg-accent/10 text-accent"
                  : "border-line text-muted-2 hover:border-muted-2/70"
              }`}
            >
              Todas ({available})
            </button>
            <input
              type="number"
              min={1}
              max={available}
              placeholder="otra cantidad"
              value={count != null && ![5, 10, 20].includes(count) ? count : ""}
              onChange={(e) => {
                const v = e.target.value === "" ? null : Number(e.target.value);
                setCount(v == null || Number.isNaN(v) ? null : v);
              }}
              onBlur={(e) => {
                const v = e.target.value === "" ? null : Number(e.target.value);
                if (v == null || Number.isNaN(v)) return setCount(null);
                setCount(Math.max(1, Math.min(v, available)));
              }}
              className="w-[110px] rounded border border-line bg-bg px-3 py-[6px] font-mono text-xs text-ink outline-none focus:border-accent"
            />
          </div>
        </div>

        <StartButton focus={focus} mode={mode} count={count} onStart={(cards) => setDeck(cards)} />
      </div>
    </main>
  );
}

function ScopeChip({
  active,
  label,
  color,
  small,
  onClick,
}: {
  active: boolean;
  label: string;
  color?: string;
  small?: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      style={{
        color: active ? (color ?? "#ec7211") : undefined,
        borderColor: active ? `${color ?? "#ec7211"}88` : undefined,
        background: active ? `${color ?? "#ec7211"}14` : undefined,
      }}
      className={`rounded-full border px-3 py-[6px] font-mono uppercase tracking-[.04em] ${
        small ? "text-[10.5px]" : "text-xs"
      } ${active ? "" : "border-line text-muted-2 hover:border-muted-2/70"}`}
    >
      {label}
    </button>
  );
}

function StartButton({
  focus,
  mode,
  count,
  onStart,
}: {
  focus: MapFocus;
  mode: FlashcardMode;
  count: number | null;
  onStart: (deck: Flashcard[]) => void;
}) {
  const deckSize = useMemo(
    () => buildDeck(focus, mode, count ?? undefined).length,
    [focus, mode, count],
  );
  return (
    <button
      type="button"
      disabled={deckSize === 0}
      onClick={() => onStart(buildDeck(focus, mode, count ?? undefined))}
      className="bg-accent px-6 py-3 font-sans text-sm font-bold text-[#111827] disabled:cursor-not-allowed disabled:opacity-40"
      style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}
    >
      Empezar ({deckSize} {deckSize === 1 ? "tarjeta" : "tarjetas"})
    </button>
  );
}

function FlashcardSession({
  mode,
  deck,
  onExit,
}: {
  mode: FlashcardMode;
  deck: Flashcard[];
  onExit: () => void;
}) {
  const [index, setIndex] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const card = deck[index];
  const done = index >= deck.length;

  if (done) {
    return (
      <main className="flex flex-1 items-center justify-center px-10">
        <div className="text-center">
          <div className="mb-2 text-2xl font-bold">Completaste la tanda</div>
          <p className="mb-6 text-muted">{deck.length} tarjetas repasadas.</p>
          <button
            type="button"
            onClick={onExit}
            className="bg-accent px-6 py-3 font-sans text-sm font-bold text-[#111827]"
            style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}
          >
            Volver a configurar
          </button>
        </div>
      </main>
    );
  }

  const isDescriptionMode = mode === "guess-description";
  const questionText = isDescriptionMode ? card.correct.name : card.correct.d;

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto px-10 py-10">
      <div className="mb-6 flex w-full max-w-[640px] items-center justify-between">
        <button type="button" onClick={onExit} className="font-mono text-xs text-muted-2 hover:text-ink-2">
          ✕ salir
        </button>
        <span className="font-mono text-xs text-muted-2">
          {index + 1} / {deck.length}
        </span>
      </div>

      <div className="mb-8 w-full max-w-[640px] rounded-lg border border-line bg-panel-2 px-7 py-8 text-center">
        <div
          className="mb-2 font-mono text-[11px] uppercase tracking-[.08em]"
          style={{ color: card.correct.accent }}
        >
          {isDescriptionMode ? "¿Qué hace este servicio?" : "¿Qué servicio es este?"}
        </div>
        <div className={isDescriptionMode ? "text-2xl font-bold" : "text-base leading-relaxed text-ink-2"}>
          {questionText}
        </div>
      </div>

      <div className="grid w-full max-w-[640px] gap-3 sm:grid-cols-1">
        {card.options.map((opt) => {
          const label = isDescriptionMode ? opt.d : opt.name;
          const isCorrect = opt.id === card.correct.id;
          const isPicked = opt.id === pickedId;
          const revealed = pickedId != null;
          return (
            <button
              key={opt.id}
              type="button"
              disabled={revealed}
              onClick={() => setPickedId(opt.id)}
              className={`rounded-lg border px-5 py-4 text-left font-sans text-sm ${
                !revealed
                  ? "border-line bg-panel-2 text-ink-2 hover:border-accent/60"
                  : isCorrect
                    ? "border-[#2ee6a8] bg-[#2ee6a8]/10 text-[#2ee6a8]"
                    : isPicked
                      ? "border-danger bg-danger/10 text-danger"
                      : "border-line bg-panel-2 text-muted-2 opacity-60"
              }`}
            >
              {label}
            </button>
          );
        })}
      </div>

      {pickedId != null && (
        <button
          type="button"
          onClick={() => {
            setPickedId(null);
            setIndex((i) => i + 1);
          }}
          className="mt-8 bg-accent px-6 py-3 font-sans text-sm font-bold text-[#111827]"
          style={{ clipPath: "polygon(0 0,100% 0,100% calc(100% - 8px),calc(100% - 8px) 100%,0 100%)" }}
        >
          Siguiente
        </button>
      )}
    </main>
  );
}
