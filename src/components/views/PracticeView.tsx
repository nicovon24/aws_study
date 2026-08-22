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
import { AccentButton, BackIcon, IconButton, Input, Pill } from "@/components/ui";

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
        <IconButton onClick={() => onNavigate("dashboard")} aria-label="Volver" title="Volver" className="mb-4">
          <BackIcon />
        </IconButton>
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">practicar</div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">Flashcards</h1>
        <p className="mb-8 max-w-[520px] text-[15px] text-muted">
          Elegí qué querés repasar y en qué sentido: adivinar la descripción a partir del
          servicio, o el servicio a partir de la descripción.
        </p>

        <div className="mb-8">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">alcance</div>
          <div className="flex flex-wrap gap-2">
            <Pill active={focus.kind === "all"} onClick={() => onFocusChange({ kind: "all" })}>
              Todos
            </Pill>
            {([1, 2, 3, 4] as const).map((n) => (
              <Pill
                key={n}
                active={focus.kind === "domain" && focus.n === n}
                color={DOMAIN_META[n].color}
                onClick={() => onFocusChange({ kind: "domain", n })}
              >
                {DOMAIN_META[n].name}
              </Pill>
            ))}
          </div>
          <div className="mt-2 flex flex-wrap gap-2">
            {DATA.map((cat) => (
              <Pill
                key={cat.cat}
                active={focus.kind === "category" && focus.name === cat.cat}
                color={cat.accent}
                small
                onClick={() => onFocusChange({ kind: "category", name: cat.cat })}
              >
                {cat.cat}
              </Pill>
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
              <Pill
                key={n}
                active={count === n}
                disabled={n > available}
                onClick={() => setCount(n)}
                className="font-mono! normal-case! tracking-normal! disabled:cursor-not-allowed disabled:opacity-30"
              >
                {n}
              </Pill>
            ))}
            <Pill active={count === null} onClick={() => setCount(null)} className="font-mono! normal-case! tracking-normal!">
              Todas ({available})
            </Pill>
            <Input
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
              className="w-[110px] py-1.5! text-xs!"
            />
          </div>
        </div>

        <StartButton focus={focus} mode={mode} count={count} onStart={(cards) => setDeck(cards)} />
      </div>
    </main>
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
    <AccentButton disabled={deckSize === 0} onClick={() => onStart(buildDeck(focus, mode, count ?? undefined))}>
      Empezar ({deckSize} {deckSize === 1 ? "tarjeta" : "tarjetas"})
    </AccentButton>
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
          <AccentButton onClick={onExit}>Volver a configurar</AccentButton>
        </div>
      </main>
    );
  }

  const isDescriptionMode = mode === "guess-description";
  const questionText = isDescriptionMode ? card.correct.name : card.correct.d;

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto px-10 py-10">
      <div className="mb-6 flex w-full max-w-[640px] items-center justify-between">
        <IconButton onClick={onExit} aria-label="Volver" title="Volver">
          <BackIcon />
        </IconButton>
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
        <AccentButton
          className="mt-8"
          onClick={() => {
            setPickedId(null);
            setIndex((i) => i + 1);
          }}
        >
          Siguiente
        </AccentButton>
      )}
    </main>
  );
}
