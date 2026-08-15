import { env } from "cloudflare:workers";
import { desc, eq } from "drizzle-orm";
import { getDb } from "../../../db";
import { dailyStories } from "../../../db/schema";
import { isStoryOwner } from "../../../worker/story-auth";
import {
  fallbackDailyStory,
  type DailyBriefResponse,
  type DailyStory,
} from "../../content/dailyBrief";

type StoryRow = typeof dailyStories.$inferSelect;

export async function GET() {
  try {
    const db = getDb();
    const [latest, favorites] = await Promise.all([
      db.select().from(dailyStories).orderBy(desc(dailyStories.publishedAt)).limit(1),
      db
        .select()
        .from(dailyStories)
        .where(eq(dailyStories.isFavorite, true))
        .orderBy(desc(dailyStories.publishedAt))
        .limit(50),
    ]);

    const response: DailyBriefResponse = {
      current: latest[0] ? toDailyStory(latest[0]) : fallbackDailyStory,
      favorites: favorites.map(toDailyStory),
    };

    return Response.json(response, {
      headers: { "cache-control": "no-store" },
    });
  } catch (error) {
    console.error("Unable to read daily stories", error);
    return Response.json(
      { current: fallbackDailyStory, favorites: [] } satisfies DailyBriefResponse,
      { headers: { "cache-control": "no-store" } },
    );
  }
}

export async function PATCH(request: Request) {
  try {
    const authError = await requireOwner(request);
    if (authError) return authError;

    const payload = (await request.json()) as {
      id?: number;
      isFavorite?: boolean;
    };

    if (!Number.isInteger(payload.id) || typeof payload.isFavorite !== "boolean") {
      return Response.json(
        { error: "A story id and favorite state are required" },
        { status: 400 },
      );
    }

    const db = getDb();
    const updated = await db
      .update(dailyStories)
      .set({ isFavorite: payload.isFavorite })
      .where(eq(dailyStories.id, payload.id as number))
      .returning();

    if (!updated[0]) {
      return Response.json({ error: "Story not found" }, { status: 404 });
    }

    return Response.json(
      { story: toDailyStory(updated[0]) },
      { headers: { "cache-control": "no-store" } },
    );
  } catch (error) {
    console.error("Unable to update daily story", error);
    return Response.json(
      { error: "The story could not be updated" },
      { status: 500 },
    );
  }
}

async function requireOwner(request: Request): Promise<Response | null> {
  if (!env.STORY_ADMIN_TOKEN) {
    return Response.json(
      { error: "Story admin access is not configured" },
      { status: 503 },
    );
  }

  if (!(await isStoryOwner(request, env.STORY_ADMIN_TOKEN))) {
    return Response.json({ error: "Invalid owner token" }, { status: 401 });
  }

  return null;
}

function toDailyStory(row: StoryRow): DailyStory {
  return {
    id: row.id,
    storyDate: row.storyDate,
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
