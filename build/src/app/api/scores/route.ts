import { and, count, desc, eq, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { scores } from "../../../db/schema";

const MAX_SUBMISSIONS_PER_WINDOW = 5;

async function topScores() {
  return getDb()
    .select({
      id: scores.id,
      name: scores.name,
      score: scores.score,
      createdAt: scores.createdAt,
    })
    .from(scores)
    .orderBy(desc(scores.score), desc(scores.createdAt))
    .limit(10);
}

export async function GET() {
  try {
    return Response.json(
      { scores: await topScores() },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to read leaderboard", error);
    return Response.json(
      { error: "Leaderboard database is not ready" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as { name?: string; score?: number };
    const name = payload.name?.trim().slice(0, 12).toUpperCase();
    const score = Number(payload.score);
    if (!name || !Number.isInteger(score) || score < 0 || score > 99_999_999) {
      return Response.json(
        { error: "Use a name and a score from 0 to 99,999,999" },
        { status: 400 },
      );
    }

    const submitterKey = await getSubmitterKey(request);
    const db = getDb();

    if (submitterKey) {
      const [recent] = await db
        .select({ total: count() })
        .from(scores)
        .where(
          and(
            eq(scores.submitterKey, submitterKey),
            sql`${scores.createdAt} >= datetime('now', '-10 minutes')`,
          ),
        );

      if ((recent?.total ?? 0) >= MAX_SUBMISSIONS_PER_WINDOW) {
        return Response.json(
          { error: "Too many scores submitted. Try again in a few minutes." },
          { status: 429 },
        );
      }
    }

    await db.insert(scores).values({ name, score, submitterKey });
    return Response.json(
      { scores: await topScores() },
      { status: 201, headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to save leaderboard score", error);
    return Response.json(
      { error: "Leaderboard database is not ready" },
      { status: 503 },
    );
  }
}

async function getSubmitterKey(request: Request): Promise<string | null> {
  const ip = request.headers.get("cf-connecting-ip");
  if (!ip) return null;

  const input = new TextEncoder().encode(`leaderboard:${ip}`);
  const digest = await crypto.subtle.digest("SHA-256", input);
  return Array.from(new Uint8Array(digest), (byte) =>
    byte.toString(16).padStart(2, "0"),
  ).join("");
}
