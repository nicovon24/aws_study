import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";
import { buildQuestionBank, QUESTION_BANK_VERSION } from "@/lib/practice";
import { findExam } from "@/data/exams";
import type { PracticeSessionResult } from "@/lib/types";

export async function GET(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ sessions: [], domains: [] }, { status: 401 });
  const examId = new URL(req.url).searchParams.get("examId") ?? "";
  if (!findExam(examId)) return NextResponse.json({ error: "Invalid examId" }, { status: 400 });
  const db = await getDb();
  const sessions = await db.collection("practiceSessions").find({ userId: session.user.id, examId }).sort({ completedAt: -1 }).limit(20).project({ _id: 0, userId: 0 }).toArray();
  const domainMap = new Map<string, { domainId: string; correct: number; total: number }>();
  for (const item of sessions) for (const domain of item.domains ?? []) {
    const aggregate = domainMap.get(domain.domainId) ?? { domainId: domain.domainId, correct: 0, total: 0 };
    aggregate.correct += domain.correct;
    aggregate.total += domain.total;
    domainMap.set(domain.domainId, aggregate);
  }
  return NextResponse.json({ sessions, domains: [...domainMap.values()] });
}

export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  const payload = await req.json() as Partial<PracticeSessionResult>;
  if (!payload.examId || !findExam(payload.examId) || !payload.sessionId || payload.sessionId.length > 160 || !Array.isArray(payload.answers) || payload.answers.length > 100) {
    return NextResponse.json({ error: "Invalid session" }, { status: 400 });
  }
  const bank = new Map(buildQuestionBank(payload.examId).map((question) => [question.id, question]));
  const answers = payload.answers.map((answer) => {
    const question = bank.get(answer.questionId);
    if (!question || !Array.isArray(answer.selectedOptionIds)) return null;
    const selected = [...new Set(answer.selectedOptionIds)].sort();
    const correctIds = [...question.correctOptionIds].sort();
    return { questionId: question.id, domainId: question.domainId, selectedOptionIds: selected, correct: selected.join("|") === correctIds.join("|") };
  });
  if (answers.some((answer) => !answer)) return NextResponse.json({ error: "Unknown question" }, { status: 400 });
  const verified = answers.filter((answer): answer is NonNullable<typeof answer> => Boolean(answer));
  const domains = [...new Set(verified.map((answer) => answer.domainId))].map((domainId) => ({ domainId, total: verified.filter((answer) => answer.domainId === domainId).length, correct: verified.filter((answer) => answer.domainId === domainId && answer.correct).length }));
  const document = { sessionId: payload.sessionId, userId: session.user.id, examId: payload.examId, mode: payload.mode === "mock" ? "mock" : "practice", startedAt: new Date(payload.startedAt ?? Date.now()), completedAt: new Date(payload.completedAt ?? Date.now()), questionCount: verified.length, correctCount: verified.filter((answer) => answer.correct).length, bankVersion: QUESTION_BANK_VERSION, domains, answers: verified };
  const db = await getDb();
  const collection = db.collection("practiceSessions");
  await collection.createIndex({ userId: 1, sessionId: 1 }, { unique: true });
  await collection.updateOne({ userId: session.user.id, sessionId: payload.sessionId }, { $setOnInsert: document }, { upsert: true });
  return NextResponse.json({ saved: true, correctCount: document.correctCount });
}
