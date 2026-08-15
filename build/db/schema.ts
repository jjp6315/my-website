import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const scores = sqliteTable(
  "scores",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    name: text("name").notNull(),
    score: integer("score").notNull(),
    submitterKey: text("submitter_key"),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    index("idx_scores_score_created_at").on(table.score, table.createdAt),
    index("idx_scores_submitter_created_at").on(
      table.submitterKey,
      table.createdAt,
    ),
  ],
);

export const dailyStories = sqliteTable(
  "daily_stories",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    storyDate: text("story_date").notNull(),
    edition: text("edition").notNull(),
    section: text("section").notNull(),
    title: text("title").notNull(),
    introduction: text("introduction").notNull(),
    body: text("body").notNull(),
    closingPrompt: text("closing_prompt").notNull(),
    readingTime: text("reading_time").notNull(),
    model: text("model").notNull(),
    sourcePrompt: text("source_prompt").notNull(),
    isFavorite: integer("is_favorite", { mode: "boolean" })
      .notNull()
      .default(false),
    publishedAt: text("published_at").notNull(),
    createdAt: text("created_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_daily_stories_story_date").on(table.storyDate),
    index("idx_daily_stories_favorite_published_at").on(
      table.isFavorite,
      table.publishedAt,
    ),
  ],
);
