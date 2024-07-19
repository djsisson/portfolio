CREATE TABLE IF NOT EXISTS "gamestate" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gamestats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"playername" text NOT NULL,
	"theme" text NOT NULL,
	"currentscore" bigint NOT NULL,
	"totalclicks" bigint NOT NULL,
	"totalspent" bigint NOT NULL,
	"currentaveragecps" real NOT NULL,
	"averageclickvalue" real NOT NULL,
	"researched" integer[],
	"upgrades" integer[],
	"items" integer[]
);
--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "baseValue" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "critChance" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "levels" ALTER COLUMN "critDamage" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "shop_items" ALTER COLUMN "multiplier" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "shop_items" ALTER COLUMN "baseValue" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "shop_items" ALTER COLUMN "critChance" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "shop_items" ALTER COLUMN "critDamage" SET DATA TYPE real;--> statement-breakpoint
ALTER TABLE "items_required_items" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "items_required_research" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "research_required_items" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "research_required_research" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "upgrade_required_items" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "upgrade_required_research" ADD COLUMN "description" text NOT NULL;--> statement-breakpoint
ALTER TABLE "research" DROP COLUMN IF EXISTS "requiredToolTip";--> statement-breakpoint
ALTER TABLE "shop_items" DROP COLUMN IF EXISTS "requiredToolTip";