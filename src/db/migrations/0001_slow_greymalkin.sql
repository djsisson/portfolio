CREATE TABLE IF NOT EXISTS "tilez_words" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"word" char(6) NOT NULL,
	"definition" text NOT NULL,
	"last_checked" timestamp NOT NULL
);
--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tilez_word_word_idx" ON "tilez_words" USING btree ("word");