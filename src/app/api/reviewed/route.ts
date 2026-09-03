import { NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { byKey } from "@/lib/study/graph";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ reviewed: [] }, { status: 401 });

  const db = await getDb();
  const docs = await db
    .collection("reviewed")
    .find({ userId: session.user.id })
    .project({ itemKey: 1, _id: 0 })
    .toArray();

  return NextResponse.json({ reviewed: docs.map((d) => d.itemKey).filter(Boolean) });
}

/** Toggles an item's reviewed status for the signed-in user. Body: { itemKey: string }. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const itemKey = body.itemKey;
  if (typeof itemKey !== "string" || !byKey[itemKey]) {
    return NextResponse.json({ error: "Invalid itemKey" }, { status: 400 });
  }

  const db = await getDb();
  const col = db.collection("reviewed");
  const existing = await col.findOne({ userId: session.user.id, itemKey });

  if (existing) {
    await col.deleteOne({ _id: existing._id });
    return NextResponse.json({ reviewed: false });
  }

  await col.insertOne({ userId: session.user.id, itemKey, reviewedAt: new Date() });
  return NextResponse.json({ reviewed: true });
}
