CREATE TABLE `activity` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`actor` text NOT NULL,
	`action` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `provider_events` (
	`id` text PRIMARY KEY NOT NULL,
	`provider` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `items` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`meal_id` text NOT NULL,
	`name` text NOT NULL,
	`supplier` text NOT NULL,
	`qty` integer NOT NULL,
	`price` integer NOT NULL,
	`cost` integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE `meals` (
	`id` text PRIMARY KEY NOT NULL,
	`name` text NOT NULL,
	`description` text NOT NULL,
	`supplier` text NOT NULL,
	`price` integer NOT NULL,
	`cost` integer NOT NULL,
	`capacity` integer NOT NULL,
	`diet` text NOT NULL,
	`image` text NOT NULL,
	`allergens` text NOT NULL,
	`active` integer DEFAULT 1 NOT NULL
);
--> statement-breakpoint
CREATE TABLE `members` (
	`id` text PRIMARY KEY NOT NULL,
	`email` text NOT NULL,
	`name` text NOT NULL,
	`role` text NOT NULL,
	`scope` text DEFAULT '' NOT NULL,
	`phone` text DEFAULT '' NOT NULL,
	`optin` integer DEFAULT 0 NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `members_email_unique` ON `members` (`email`);--> statement-breakpoint
CREATE TABLE `messages` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`actor` text NOT NULL,
	`role` text NOT NULL,
	`body` text NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `orders` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`name` text NOT NULL,
	`phone` text NOT NULL,
	`address` text NOT NULL,
	`date` text NOT NULL,
	`slot` text NOT NULL,
	`status` text NOT NULL,
	`payment` text NOT NULL,
	`method` text NOT NULL,
	`total` integer NOT NULL,
	`delivery` integer NOT NULL,
	`driver` text DEFAULT '' NOT NULL,
	`company` text DEFAULT '' NOT NULL,
	`optin` integer DEFAULT 0 NOT NULL,
	`created` text NOT NULL,
	`request_key` text NOT NULL,
	`note` text DEFAULT '' NOT NULL,
	`plan_id` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX `orders_request_key_unique` ON `orders` (`request_key`);--> statement-breakpoint
CREATE TABLE `outbox` (
	`id` text PRIMARY KEY NOT NULL,
	`order_id` text NOT NULL,
	`recipient` text NOT NULL,
	`body` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL,
	`provider_id` text DEFAULT '' NOT NULL
);
--> statement-breakpoint
CREATE TABLE `plans` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`name` text NOT NULL,
	`remaining` integer NOT NULL,
	`total` integer NOT NULL,
	`created` text NOT NULL
);
--> statement-breakpoint
CREATE TABLE `tickets` (
	`id` text PRIMARY KEY NOT NULL,
	`customer` text NOT NULL,
	`order_id` text NOT NULL,
	`subject` text NOT NULL,
	`body` text NOT NULL,
	`status` text NOT NULL,
	`created` text NOT NULL
);
