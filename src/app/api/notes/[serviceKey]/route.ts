import { NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";

type Params = { params: Promise<{ serviceKey: string }> };

export async function GET(_req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ content: "" }, { status: 401 });

  const { serviceKey } = await params;
  const db = await getDb();
  const note = await db.collection("notes").findOne({ userId: session.user.id, serviceKey });

  return NextResponse.json({ content: note?.content ?? "" });
}

/** Upserts the signed-in user's note for this service. Body: { content: string }. */
export async function PUT(req: Request, { params }: Params) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { serviceKey } = await params;
  const { content } = await req.json();
  if (typeof content !== "string") {
    return NextResponse.json({ error: "Missing content" }, { status: 400 });
  }

  const db = await getDb();
  const col = db.collection("notes");

  if (content.trim() === "") {
    await col.deleteOne({ userId: session.user.id, serviceKey });
    return NextResponse.json({ content: "" });
  }

  await col.updateOne(
    { userId: session.user.id, serviceKey },
    { $set: { content, updatedAt: new Date() }, $setOnInsert: { createdAt: new Date() } },
    { upsert: true },
  );

  return NextResponse.json({ content });
}
