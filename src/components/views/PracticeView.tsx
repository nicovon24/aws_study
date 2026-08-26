"use client";

import { useEffect, useMemo, useState } from "react";
import { useLocale } from "@/hooks";
import { DOMAIN_META } from "@/lib/domains";
import { buildDeck, nodesInScope, type Flashcard, type FlashcardMode } from "@/lib/flashcards";
import { pick } from "@/lib/locale";
import { UI } from "@/lib/uiStrings";
import type { MapFocus, View } from "@/lib/types";
import { AccentButton, BackIcon, IconButton, Input, Pill } from "@/components/ui";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  onNavigate: (v: View) => void;
};

const MODES: FlashcardMode[] = ["guess-description", "guess-service"];

export default function PracticeView({ focus, onFocusChange, onNavigate }: Props) {
  const { locale } = useLocale();
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
        <IconButton
          onClick={() => onNavigate("dashboard")}
          aria-label={pick(locale, UI.back)}
          title={pick(locale, UI.back)}
          className="mb-4"
        >
          <BackIcon />
        </IconButton>
        <div className="mb-[6px] font-mono text-xs uppercase tracking-[.12em] text-accent">
          {pick(locale, UI.practiceEyebrow)}
        </div>
        <h1 className="mb-1 text-[34px] font-bold tracking-tight">{pick(locale, UI.flashcards)}</h1>
        <p className="mb-8 max-w-[520px] text-[15px] text-muted">{pick(locale, UI.practiceIntro)}</p>

        <div className="mb-8">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">
            {pick(locale, UI.scope)}
          </div>
          <div className="flex flex-wrap gap-2">
            <Pill active={focus.kind === "all"} onClick={() => onFocusChange({ kind: "all" })}>
              {pick(locale, UI.allPill)}
            </Pill>
            {([1, 2, 3, 4] as const).map((n) => (
              <Pill
                key={n}
                active={focus.kind === "domain" && focus.n === n}
                color={DOMAIN_META[n].color}
                onClick={() => onFocusChange({ kind: "domain", n })}
              >
                {pick(locale, DOMAIN_META[n].name)}
              </Pill>
            ))}
          </div>
        </div>

        <div className="mb-9">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">
            {pick(locale, UI.mode)}
          </div>
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
                {pick(locale, m === "guess-description" ? UI.guessDescription : UI.guessService)}
              </button>
            ))}
          </div>
        </div>

        <div className="mb-9">
          <div className="mb-3 font-mono text-xs uppercase tracking-[.08em] text-muted-2">
            {pick(locale, UI.questionCount)}
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
              {pick(locale, UI.allCount)} ({available})
            </Pill>
            <Input
              type="number"
              min={1}
              max={available}
              placeholder={pick(locale, UI.otherCount)}
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
  const { locale } = useLocale();
  const deckSize = useMemo(
    () => buildDeck(focus, mode, count ?? undefined).length,
    [focus, mode, count],
  );
  return (
    <AccentButton disabled={deckSize === 0} onClick={() => onStart(buildDeck(focus, mode, count ?? undefined))}>
      {pick(locale, UI.start)} ({deckSize} {pick(locale, deckSize === 1 ? UI.card : UI.cards)})
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
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const [pickedId, setPickedId] = useState<string | null>(null);

  const card = deck[index];
  const done = index >= deck.length;

  if (done) {
    return (
      <main className="flex flex-1 items-center justify-center px-10">
        <div className="text-center">
          <div className="mb-2 text-2xl font-bold">{pick(locale, UI.batchDone)}</div>
          <p className="mb-6 text-muted">
            {deck.length} {pick(locale, UI.cardsReviewed)}
          </p>
          <AccentButton onClick={onExit}>{pick(locale, UI.backToSetup)}</AccentButton>
        </div>
      </main>
    );
  }

  const isDescriptionMode = mode === "guess-description";
  const questionText = isDescriptionMode ? pick(locale, card.correct.name) : pick(locale, card.correct.d);

  return (
    <main className="flex flex-1 flex-col items-center overflow-auto px-10 py-10">
      <div className="mb-6 flex w-full max-w-[640px] items-center justify-between">
        <IconButton onClick={onExit} aria-label={pick(locale, UI.back)} title={pick(locale, UI.back)}>
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
          {pick(locale, isDescriptionMode ? UI.whatDoesThisDo : UI.whichServiceIsThis)}
        </div>
        <div className={isDescriptionMode ? "text-2xl font-bold" : "text-base leading-relaxed text-ink-2"}>
          {questionText}
        </div>
      </div>

      <div className="grid w-full max-w-[640px] gap-3 sm:grid-cols-1">
        {card.options.map((opt) => {
          const label = isDescriptionMode ? pick(locale, opt.d) : pick(locale, opt.name);
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
          {pick(locale, UI.next)}
        </AccentButton>
      )}
    </main>
  );
}
