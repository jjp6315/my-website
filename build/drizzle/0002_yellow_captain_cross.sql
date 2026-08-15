ALTER TABLE `scores` ADD `submitter_key` text;--> statement-breakpoint
CREATE INDEX `idx_scores_submitter_created_at` ON `scores` (`submitter_key`,`created_at`);