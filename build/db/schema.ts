import { sql } from "drizzle-orm";
import { index, integer, sqliteTable, text } from "drizzle-orm/sqlite-core";

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
