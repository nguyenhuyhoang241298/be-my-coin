CREATE TABLE `refresh_tokens` (
	`id` serial AUTO_INCREMENT NOT NULL,
	`user_id` serial AUTO_INCREMENT NOT NULL,
	`token` varchar(512) NOT NULL,
	`expired_at` bigint NOT NULL,
	CONSTRAINT `refresh_tokens_id` PRIMARY KEY(`id`)
);
--> statement-breakpoint
ALTER TABLE `users` ADD `is_email_verified` boolean DEFAULT false NOT NULL;--> statement-breakpoint
ALTER TABLE `users` ADD `otp` varchar(6) NOT NULL;--> statement-breakpoint
ALTER TABLE `refresh_tokens` ADD CONSTRAINT `refresh_tokens_user_id_users_id_fk` FOREIGN KEY (`user_id`) REFERENCES `users`(`id`) ON DELETE cascade ON UPDATE cascade;