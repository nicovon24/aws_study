import { NextResponse } from "next/server";
import { auth } from "@/lib/server/auth";
import { getDb } from "@/lib/server/db";
import { byKey } from "@/lib/study/graph";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ favorites: [] }, { status: 401 });

  const db = await getDb();
  const docs = await db
    .collection("favorites")
    .find({ userId: session.user.id })
    .project({ serviceKey: 1, itemKey: 1, _id: 0 })
    .toArray();

  return NextResponse.json({ favorites: docs.map((d) => d.itemKey ?? d.serviceKey).filter(Boolean) });
}

/** Toggles a service's favorite status for the signed-in user. Body: { serviceKey: string }. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const body = await req.json();
  const itemKey = body.itemKey ?? body.serviceKey;
  if (typeof itemKey !== "string" || !byKey[itemKey]) {
    return NextResponse.json({ error: "Invalid itemKey" }, { status: 400 });
  }

  const db = await getDb();
  const col = db.collection("favorites");
  const existing = await col.findOne({ userId: session.user.id, $or: [{ itemKey }, { serviceKey: itemKey }] });

  if (existing) {
    await col.deleteOne({ _id: existing._id });
    return NextResponse.json({ favorited: false });
  }

  await col.insertOne({ userId: session.user.id, itemKey, serviceKey: itemKey, createdAt: new Date() });
  return NextResponse.json({ favorited: true });
}
