"use client";

import { useEffect, useState } from "react";
import { useSession } from "next-auth/react";
import { useExam, useLocale } from "@/hooks";
import { pick } from "@/lib/ui/locale";

type ProgressData = { sessions: { sessionId: string; completedAt: string; mode: string; correctCount: number; questionCount: number }[]; domains: { domainId: string; correct: number; total: number }[] };

export default function ProgressView() {
  const { exam } = useExam();
  const { locale } = useLocale();
  const { status } = useSession();
  const [data, setData] = useState<ProgressData | null>(null);
  useEffect(() => {
    if (status !== "authenticated") { setData(null); return; }
    fetch(`/api/progress?examId=${encodeURIComponent(exam.id)}`).then((response) => response.ok ? response.json() : { sessions: [], domains: [] }).then(setData);
  }, [exam.id, status]);
  if (status !== "authenticated") return <main className="flex-1 p-8"><div className="mx-auto max-w-3xl rounded-xl border border-line bg-panel-2 p-6">{locale === "es" ? "Iniciá sesión para guardar y consultar tu progreso." : "Sign in to save and view your progress."}</div></main>;
  if (!data) return <main className="flex-1 p-8"><div className="mx-auto max-w-3xl animate-pulse rounded-xl border border-line bg-panel-2 p-8" /></main>;
  const total = data.sessions.reduce((sum, item) => sum + item.questionCount, 0);
  const correct = data.sessions.reduce((sum, item) => sum + item.correctCount, 0);
  return <main className="flex-1 overflow-auto px-6 py-8"><div className="mx-auto max-w-4xl"><div className="font-mono text-xs uppercase tracking-widest text-accent">{locale === "es" ? "evidencia de práctica" : "practice evidence"}</div><h1 className="mt-1 text-3xl font-bold">{locale === "es" ? "Progreso" : "Progress"} · {exam.code}</h1><p className="mt-2 text-sm text-muted">{locale === "es" ? "Estos porcentajes resumen tus sesiones; no garantizan aprobar el examen." : "These percentages summarize your sessions; they do not guarantee an exam pass."}</p><div className="mt-6 grid gap-4 sm:grid-cols-3"><Metric label={locale === "es" ? "Sesiones" : "Sessions"} value={`${data.sessions.length}`} /><Metric label={locale === "es" ? "Respuestas" : "Answers"} value={`${total}`} /><Metric label={locale === "es" ? "Aciertos" : "Accuracy"} value={total ? `${Math.round(correct / total * 100)}%` : "—"} /></div><h2 className="mt-8 text-xl font-semibold">{locale === "es" ? "Por dominio" : "By domain"}</h2><div className="mt-3 grid gap-3 sm:grid-cols-2">{exam.domains.map((domain) => { const metric = data.domains.find((item) => item.domainId === domain.id); return <div key={domain.id} className="rounded-lg border border-line bg-panel-2 p-4"><div className="font-semibold">{pick(locale, domain.name)}</div><div className="mt-1 font-mono text-sm" style={{ color: domain.color }}>{metric?.total ? `${Math.round(metric.correct / metric.total * 100)}% · ${metric.total}` : (locale === "es" ? "Sin práctica" : "No practice yet")}</div></div>; })}</div></div></main>;
}

function Metric({ label, value }: { label: string; value: string }) { return <div className="rounded-lg border border-line bg-panel-2 p-4"><div className="text-sm text-muted">{label}</div><div className="mt-1 text-2xl font-bold">{value}</div></div>; }
