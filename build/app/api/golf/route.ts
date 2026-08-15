import { asc, sql } from "drizzle-orm";
import { getDb } from "../../../db";
import { golfHoleScores } from "../../../db/schema";
import { findGolfCourse, findGolfPlayer } from "../../golf/data";
import type { GolfScoresResponse } from "../../golf/types";

async function allGolfScores() {
  return getDb()
    .select()
    .from(golfHoleScores)
    .orderBy(
      asc(golfHoleScores.courseId),
      asc(golfHoleScores.playerId),
      asc(golfHoleScores.hole),
    );
}

export async function GET() {
  try {
    return Response.json(
      { scores: await allGolfScores() } satisfies GolfScoresResponse,
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to read golf scores", error);
    return Response.json(
      { error: "The golf score database is not ready" },
      { status: 503 },
    );
  }
}

export async function POST(request: Request) {
  try {
    const payload = (await request.json()) as Record<string, unknown>;
    const playerId = String(payload.playerId ?? "");
    const courseId = String(payload.courseId ?? "");
    const hole = Number(payload.hole);
    const score = Number(payload.score);
    const putts = Number(payload.putts);
    const penalties = Number(payload.penalties);
    const bunkers = Number(payload.bunkers);

    if (!findGolfPlayer(playerId) || !findGolfCourse(courseId)) {
      return Response.json({ error: "Choose a valid player and course" }, { status: 400 });
    }

    if (!isIntegerWithin(hole, 1, 18) || !isIntegerWithin(score, 1, 15)) {
      return Response.json({ error: "Hole must be 1–18 and score must be 1–15" }, { status: 400 });
    }

    if (
      !isIntegerWithin(putts, 0, 10) ||
      !isIntegerWithin(penalties, 0, 10) ||
      !isIntegerWithin(bunkers, 0, 10)
    ) {
      return Response.json({ error: "Stats must be whole numbers from 0–10" }, { status: 400 });
    }

    if (
      typeof payload.fairwayHit !== "boolean" ||
      typeof payload.greenInRegulation !== "boolean"
    ) {
      return Response.json({ error: "Fairway and green values are required" }, { status: 400 });
    }

    const values = {
      playerId,
      courseId,
      hole,
      score,
      fairwayHit: payload.fairwayHit,
      greenInRegulation: payload.greenInRegulation,
      putts,
      penalties,
      bunkers,
      updatedAt: sql<string>`CURRENT_TIMESTAMP`,
    };

    await getDb()
      .insert(golfHoleScores)
      .values(values)
      .onConflictDoUpdate({
        target: [
          golfHoleScores.playerId,
          golfHoleScores.courseId,
          golfHoleScores.hole,
        ],
        set: values,
      });

    return Response.json(
      { scores: await allGolfScores() } satisfies GolfScoresResponse,
      { status: 201, headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to save golf score", error);
    return Response.json(
      { error: "The score could not be saved" },
      { status: 503 },
    );
  }
}

function isIntegerWithin(value: number, min: number, max: number) {
  return Number.isInteger(value) && value >= min && value <= max;
}
