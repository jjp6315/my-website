CREATE TABLE `daily_stories` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`story_date` text NOT NULL,
	`edition` text NOT NULL,
	`section` text NOT NULL,
	`title` text NOT NULL,
	`introduction` text NOT NULL,
	`body` text NOT NULL,
	`closing_prompt` text NOT NULL,
	`reading_time` text NOT NULL,
	`model` text NOT NULL,
	`source_prompt` text NOT NULL,
	`is_favorite` integer DEFAULT false NOT NULL,
	`published_at` text NOT NULL,
	`created_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_daily_stories_story_date` ON `daily_stories` (`story_date`);--> statement-breakpoint
CREATE INDEX `idx_daily_stories_favorite_published_at` ON `daily_stories` (`is_favorite`,`published_at`);