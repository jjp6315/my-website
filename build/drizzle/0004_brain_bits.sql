ALTER TABLE `daily_stories` RENAME TO `brain_bits`;--> statement-breakpoint
ALTER TABLE `brain_bits` RENAME COLUMN "story_date" TO "bit_date";--> statement-breakpoint
DROP INDEX `idx_daily_stories_story_date`;--> statement-breakpoint
DROP INDEX `idx_daily_stories_favorite_published_at`;--> statement-breakpoint
CREATE UNIQUE INDEX `idx_brain_bits_bit_date` ON `brain_bits` (`bit_date`);--> statement-breakpoint
CREATE INDEX `idx_brain_bits_favorite_published_at` ON `brain_bits` (`is_favorite`,`published_at`);