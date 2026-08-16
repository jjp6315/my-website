import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { brainBits } from "../../../db/schema";
import {
  fallbackBrainBit,
  type BrainBitsResponse,
  type BrainBit,
} from "../../content/brainBits";

type BrainBitRow = typeof brainBits.$inferSelect;

export async function GET() {
  try {
    const db = getDb();
    const [latest, favorites] = await Promise.all([
      db
        .select()
        .from(brainBits)
        .orderBy(desc(brainBits.publishedAt))
        .limit(1),
      db
        .select()
        .from(brainBits)
        .where(eq(brainBits.isFavorite, true))
        .orderBy(desc(brainBits.publishedAt))
        .limit(50),
    ]);

    const response: BrainBitsResponse = {
      current: latest[0] ? toBrainBit(latest[0]) : fallbackBrainBit,
      favorites: favorites.map(toBrainBit),
    };

    return Response.json(response, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to read Brain Bits", error);
    return Response.json(
      { current: fallbackBrainBit, favorites: [] } satisfies BrainBitsResponse,
      { headers: { "cache-control": "no-store" } },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const payload = (await request.json()) as {
      id?: number;
      isFavorite?: boolean;
    };
    if (!Number.isInteger(payload.id) || typeof payload.isFavorite !== "boolean") {
      return Response.json(
        { error: "A valid story id and favorite state are required" },
        { status: 400 },
      );
    }

    const updated = await getDb()
      .update(brainBits)
      .set({ isFavorite: payload.isFavorite })
      .where(eq(brainBits.id, payload.id as number))
      .returning();

    if (!updated[0]) {
      return Response.json({ error: "Brain Bit not found" }, { status: 404 });
    }

    return Response.json(
      { story: toBrainBit(updated[0]) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to update shared Brain Bits archive", error);
    return Response.json(
      { error: "The Brain Bits archive could not be updated" },
      { status: 500 },
    );
  }
}

function toBrainBit(row: BrainBitRow): BrainBit {
  return {
    id: row.id,
    bitDate: row.bitDate,
    edition: row.edition,
    section: row.section,
    title: row.title,
    introduction: row.introduction,
    body: row.body,
    closingPrompt: row.closingPrompt,
    readingTime: row.readingTime,
    isFavorite: row.isFavorite,
    publishedAt: row.publishedAt,
  };
}
