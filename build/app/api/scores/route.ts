import { desc } from "drizzle-orm";
import { getDb } from "../../../db";
import { scores } from "../../../db/schema";

async function topScores() { return getDb().select().from(scores).orderBy(desc(scores.score), desc(scores.createdAt)).limit(10); }

export async function GET() {
  try { return Response.json({ scores: await topScores() }); }
  catch { return Response.json({ error: "Leaderboard database is not ready" }, { status: 503 }); }
}

export async function POST(request: Request) {
  try {
    const payload = await request.json() as { name?: string; score?: number };
    const name = payload.name?.trim().slice(0, 12).toUpperCase();
    const score = Number(payload.score);
    if (!name || !Number.isInteger(score) || score < 0 || score > 99_999_999) return Response.json({ error: "Use a name and a score from 0 to 99,999,999" }, { status: 400 });
    await getDb().insert(scores).values({ name, score });
    return Response.json({ scores: await topScores() }, { status: 201 });
  } catch { return Response.json({ error: "Leaderboard database is not ready" }, { status: 503 }); }
}
