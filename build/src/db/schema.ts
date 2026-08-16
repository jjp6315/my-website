import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text, uniqueIndex } from "drizzle-orm/sqlite-core";

export const brainBits = sqliteTable(
  "brain_bits",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    bitDate: text("bit_date").notNull(),
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
    uniqueIndex("idx_brain_bits_bit_date").on(table.bitDate),
    index("idx_brain_bits_favorite_published_at").on(
      table.isFavorite,
      table.publishedAt,
    ),
  ],
);

export const golfHoleScores = sqliteTable(
  "golf_hole_scores",
  {
    id: integer("id").primaryKey({ autoIncrement: true }),
    playerId: text("player_id").notNull(),
    courseId: text("course_id").notNull(),
    hole: integer("hole").notNull(),
    score: integer("score").notNull(),
    fairwayHit: integer("fairway_hit", { mode: "boolean" })
      .notNull()
      .default(false),
    greenInRegulation: integer("green_in_regulation", { mode: "boolean" })
      .notNull()
      .default(false),
    putts: integer("putts").notNull().default(0),
    penalties: integer("penalties").notNull().default(0),
    bunkers: integer("bunkers").notNull().default(0),
    updatedAt: text("updated_at").notNull().default(sql`CURRENT_TIMESTAMP`),
  },
  (table) => [
    uniqueIndex("idx_golf_scores_player_course_hole").on(
      table.playerId,
      table.courseId,
      table.hole,
    ),
    index("idx_golf_scores_course_player").on(
      table.courseId,
      table.playerId,
    ),
  ],
);
