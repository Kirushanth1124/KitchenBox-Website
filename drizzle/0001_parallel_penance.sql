CREATE TABLE `kb_commits` (
	`id` text PRIMARY KEY NOT NULL,
	`revision` integer NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `kb_commits_revision_unique` ON `kb_commits` (`revision`);--> statement-breakpoint
CREATE TABLE `kb_records` (
	`id` text PRIMARY KEY NOT NULL,
	`kind` text NOT NULL,
	`data` text NOT NULL,
	`created` text NOT NULL,
	`updated` text NOT NULL
);
