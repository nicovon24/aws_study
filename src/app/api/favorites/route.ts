import { NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { getDb } from "@/lib/db";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ favorites: [] }, { status: 401 });

  const db = await getDb();
  const docs = await db
    .collection("favorites")
    .find({ userId: session.user.id })
    .project({ serviceKey: 1, _id: 0 })
    .toArray();

  return NextResponse.json({ favorites: docs.map((d) => d.serviceKey) });
}

/** Toggles a service's favorite status for the signed-in user. Body: { serviceKey: string }. */
export async function POST(req: Request) {
  const session = await auth();
  if (!session?.user?.id) return NextResponse.json({ error: "Unauthorized" }, { status: 401 });

  const { serviceKey } = await req.json();
  if (typeof serviceKey !== "string" || !serviceKey) {
    return NextResponse.json({ error: "Missing serviceKey" }, { status: 400 });
  }

  const db = await getDb();
  const col = db.collection("favorites");
  const existing = await col.findOne({ userId: session.user.id, serviceKey });

  if (existing) {
    await col.deleteOne({ _id: existing._id });
    return NextResponse.json({ favorited: false });
  }

  await col.insertOne({ userId: session.user.id, serviceKey, createdAt: new Date() });
  return NextResponse.json({ favorited: true });
}
