"use client";

import { useEffect, useMemo, useState } from "react";
import { useExam, useLocale } from "@/hooks";
import { buildDeck, nodesInScope, type Flashcard, type FlashcardMode } from "@/lib/study/flashcards";
import { pick } from "@/lib/ui/locale";
import { buildMockExam, buildQuestionBank, QUESTION_BANK_VERSION, seededShuffle } from "@/lib/study/practice";
import { UI } from "@/lib/ui/uiStrings";
import type { MapFocus, PracticeQuestion, PracticeSessionResult, View } from "@/lib/types";
import { AccentButton, BackIcon, IconButton, Input, Pill } from "@/components/ui";

type Props = {
  focus: MapFocus;
  onFocusChange: (f: MapFocus) => void;
  onNavigate: (v: View) => void;
};

const MODES: FlashcardMode[] = ["guess-description", "guess-service"];

export default function PracticeView({ focus, onFocusChange, onNavigate }: Props) {
  const { locale } = useLocale();
  const { exam } = useExam();
  const [mode, setMode] = useState<FlashcardMode>("guess-description");
  const [deck, setDeck] = useState<Flashcard[] | null>(null);
  const [questionSession, setQuestionSession] = useState<{ mode: "practice" | "mock"; questions: PracticeQuestion[] } | null>(null);

  const available = useMemo(() => nodesInScope(focus, exam.id).length, [exam.id, focus]);
  const [count, setCount] = useState<number | null>(null);

  // Re-clamp (or clear "all") whenever the scope shrinks below the chosen count.
  useEffect(() => {
    if (count != null && count > available) setCount(null);
  }, [available, count]);

  if (deck) {
    return <FlashcardSession mode={mode} deck={deck} onExit={() => setDeck(null)} />;
  }
  if (questionSession) {
    return <QuestionSession examId={exam.id} {...questionSession} onExit={() => setQuestionSession(null)} />;
  }

  return (
    <main className="flex-1 overflow-auto px-4 py-8 pb-[60px] sm:px-10">
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
            {exam.domains.map((domain) => (
              <Pill
                key={domain.id}
                active={focus.kind === "domain" && focus.domainId === domain.id}
                color={domain.color}
                onClick={() => onFocusChange({ kind: "domain", domainId: domain.id })}
              >
                {pick(locale, domain.name)}
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

        {available === 0 && (
          <div className="mb-6 rounded-lg border border-accent/35 bg-accent/8 px-4 py-3 text-sm text-ink-2">
            {pick(locale, UI.examContentPreparing)} {pick(locale, UI.examContentPreparingDetail)}
          </div>
        )}

        <StartButton
          examId={exam.id}
          focus={focus}
          mode={mode}
          count={count}
          onStart={(cards) => setDeck(cards)}
        />
        <div className="mt-4 flex flex-wrap gap-3 border-t border-line pt-6">
          <AccentButton
            disabled={buildQuestionBank(exam.id).length === 0}
            onClick={() => setQuestionSession({ mode: "practice", questions: seededShuffle(buildQuestionBank(exam.id), `${exam.id}:${Date.now()}`).slice(0, Math.min(count ?? 10, buildQuestionBank(exam.id).length)) })}
          >
            {locale === "es" ? "Práctica guiada" : "Guided practice"}
          </AccentButton>
          <AccentButton
            disabled={buildQuestionBank(exam.id).length === 0}
            onClick={() => setQuestionSession({ mode: "mock", questions: buildMockExam(exam.id, Math.min(count ?? 20, buildQuestionBank(exam.id).length), `${Date.now()}`) })}
          >
            {pick(locale, UI.stepMock)}
          </AccentButton>
        </div>
      </div>
    </main>
  );
}

function QuestionSession({ examId, mode, questions, onExit }: { examId: string; mode: "practice" | "mock"; questions: PracticeQuestion[]; onExit: () => void }) {
  const { locale } = useLocale();
  const [index, setIndex] = useState(0);
  const [selected, setSelected] = useState<string[]>([]);
  const [answers, setAnswers] = useState<PracticeSessionResult["answers"]>([]);
  const [startedAt] = useState(() => new Date().toISOString());
  const question = questions[index];

  if (!question) {
    const correct = answers.filter((answer) => answer.correct).length;
    const incorrect = answers.filter((answer) => !answer.correct);
    const result: PracticeSessionResult = {
      sessionId: `${examId}-${startedAt}`,
      examId,
      mode,
      startedAt,
      completedAt: new Date().toISOString(),
      bankVersion: QUESTION_BANK_VERSION,
      answers,
    };
    return (
      <main className="flex flex-1 items-center justify-center overflow-auto px-6 py-10">
        <div className="w-full max-w-[720px] rounded-xl border border-line bg-panel-2 p-7">
          <h1 className="text-2xl font-bold">{locale === "es" ? "Resumen de sesión" : "Session summary"}</h1>
          <p className="mt-2 text-muted">{correct} / {answers.length} {locale === "es" ? "respuestas correctas" : "correct answers"}</p>
          {incorrect.length > 0 && <div className="mt-5"><h2 className="font-semibold">{locale === "es" ? "Para revisar" : "Review"}</h2><ul className="mt-2 space-y-2 text-sm text-muted">{incorrect.map((answer) => <li key={answer.questionId}>{questions.find((candidate) => candidate.id === answer.questionId)?.explanation[locale]}</li>)}</ul></div>}
          <div className="mt-6 flex gap-3">
            <AccentButton onClick={() => { fetch("/api/progress", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(result) }).catch(() => undefined); onExit(); }}>{pick(locale, UI.backToSetup)}</AccentButton>
          </div>
        </div>
      </main>
    );
  }

  const revealed = answers.some((answer) => answer.questionId === question.id);
  const isCorrect = [...selected].sort().join("|") === [...question.correctOptionIds].sort().join("|");
  return (
    <main className="flex flex-1 flex-col items-center overflow-auto px-6 py-8">
      <div className="mb-5 flex w-full max-w-[720px] items-center justify-between"><IconButton onClick={onExit} aria-label={pick(locale, UI.back)}><BackIcon /></IconButton><span className="font-mono text-xs text-muted-2">{index + 1} / {questions.length}</span></div>
      <div className="w-full max-w-[720px] rounded-xl border border-line bg-panel-2 p-6">
        <div className="mb-2 font-mono text-[11px] uppercase text-accent">{question.skill} · {question.difficulty}</div>
        <h1 className="text-lg font-semibold leading-relaxed">{question.prompt[locale]}</h1>
        <div className="mt-5 grid gap-3">{question.options.map((option) => {
          const checked = selected.includes(option.id);
          const correctOption = question.correctOptionIds.includes(option.id);
          return <button key={option.id} type="button" disabled={revealed} onClick={() => setSelected(question.type === "single-choice" ? [option.id] : checked ? selected.filter((id) => id !== option.id) : [...selected, option.id])} className={`rounded-lg border px-4 py-3 text-left text-sm ${revealed ? correctOption ? "border-[#2ee6a8] bg-[#2ee6a8]/10" : checked ? "border-danger bg-danger/10" : "border-line opacity-60" : checked ? "border-accent bg-accent/10" : "border-line hover:border-accent/60"}`}>{option.label[locale]}</button>;
        })}</div>
        {!revealed ? <AccentButton disabled={selected.length === 0} className="mt-5" onClick={() => setAnswers((current) => [...current, { questionId: question.id, selectedOptionIds: selected, correct: isCorrect }])}>{locale === "es" ? "Responder" : "Answer"}</AccentButton> : <div className="mt-5 rounded-lg border border-line bg-bg/40 p-4"><p className="font-semibold">{isCorrect ? (locale === "es" ? "Correcto" : "Correct") : (locale === "es" ? "Incorrecto" : "Incorrect")}</p><p className="mt-1 text-sm text-muted">{question.explanation[locale]}</p><AccentButton className="mt-4" onClick={() => { setSelected([]); setIndex((value) => value + 1); }}>{pick(locale, UI.next)}</AccentButton></div>}
      </div>
    </main>
  );
}

function StartButton({
  examId,
  focus,
  mode,
  count,
  onStart,
}: {
  examId: string;
  focus: MapFocus;
  mode: FlashcardMode;
  count: number | null;
  onStart: (deck: Flashcard[]) => void;
}) {
  const { locale } = useLocale();
  const deckSize = useMemo(
    () => buildDeck(focus, mode, count ?? undefined, examId).length,
    [examId, focus, mode, count],
  );
  return (
    <AccentButton
      disabled={deckSize === 0}
      onClick={() => onStart(buildDeck(focus, mode, count ?? undefined, examId))}
    >
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
