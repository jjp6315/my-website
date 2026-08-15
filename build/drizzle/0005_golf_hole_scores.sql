CREATE TABLE `golf_hole_scores` (
	`id` integer PRIMARY KEY AUTOINCREMENT NOT NULL,
	`player_id` text NOT NULL,
	`course_id` text NOT NULL,
	`hole` integer NOT NULL,
	`score` integer NOT NULL,
	`fairway_hit` integer DEFAULT false NOT NULL,
	`green_in_regulation` integer DEFAULT false NOT NULL,
	`putts` integer DEFAULT 0 NOT NULL,
	`penalties` integer DEFAULT 0 NOT NULL,
	`bunkers` integer DEFAULT 0 NOT NULL,
	`updated_at` text DEFAULT CURRENT_TIMESTAMP NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `idx_golf_scores_player_course_hole` ON `golf_hole_scores` (`player_id`,`course_id`,`hole`);--> statement-breakpoint
CREATE INDEX `idx_golf_scores_course_player` ON `golf_hole_scores` (`course_id`,`player_id`);