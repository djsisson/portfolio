CREATE TABLE IF NOT EXISTS "characters" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "characters_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text[] NOT NULL,
	"element_id" integer NOT NULL,
	"city_id" integer NOT NULL,
	CONSTRAINT "characters_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "cities" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "cities_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	CONSTRAINT "cities_name_unique" UNIQUE("name")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "elements" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "elements_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"colour" text NOT NULL,
	CONSTRAINT "elements_name_unique" UNIQUE("name"),
	CONSTRAINT "elements_colour_unique" UNIQUE("colour")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "gamestate" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "gamestats_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"playername" text NOT NULL,
	"theme" text NOT NULL,
	"currentscore" bigint NOT NULL,
	"totalclicks" bigint NOT NULL,
	"totalspent" bigint NOT NULL,
	"currentaveragecps" real NOT NULL,
	"averageclickvalue" real NOT NULL,
	"researched" integer[] NOT NULL,
	"upgrades" json[] NOT NULL,
	"items" json[] NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items_required_items" (
	"item_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "items_required_items_item_id_required_id_pk" PRIMARY KEY("item_id","required_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items_required_research" (
	"item_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "items_required_research_item_id_required_id_pk" PRIMARY KEY("item_id","required_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "levels" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "levels_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"level" integer NOT NULL,
	"upgrade_id" integer NOT NULL,
	"cost" integer NOT NULL,
	"baseValue" real NOT NULL,
	"critChance" real NOT NULL,
	"critDamage" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "research_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"cost" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_required_items" (
	"research_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "research_required_items_research_id_item_id_pk" PRIMARY KEY("research_id","item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_required_research" (
	"research_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "research_required_research_research_id_required_id_pk" PRIMARY KEY("research_id","required_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "shop_items" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "shop_items_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"cost" integer NOT NULL,
	"maxQty" integer NOT NULL,
	"multiplier" real NOT NULL,
	"baseValue" real NOT NULL,
	"critChance" real NOT NULL,
	"critDamage" real NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrade_required_items" (
	"upgrade_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "upgrade_required_items_upgrade_id_item_id_pk" PRIMARY KEY("upgrade_id","item_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrade_required_research" (
	"upgrade_id" integer NOT NULL,
	"research_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "upgrade_required_research_upgrade_id_research_id_pk" PRIMARY KEY("upgrade_id","research_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "upgrades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"effectItemId" integer NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_element_id_elements_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."elements"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_required_items" ADD CONSTRAINT "items_required_items_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_required_items" ADD CONSTRAINT "items_required_items_required_id_shop_items_id_fk" FOREIGN KEY ("required_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_required_research" ADD CONSTRAINT "items_required_research_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "items_required_research" ADD CONSTRAINT "items_required_research_required_id_research_id_fk" FOREIGN KEY ("required_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "levels" ADD CONSTRAINT "levels_upgrade_id_upgrades_id_fk" FOREIGN KEY ("upgrade_id") REFERENCES "public"."upgrades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_required_items" ADD CONSTRAINT "research_required_items_research_id_research_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_required_items" ADD CONSTRAINT "research_required_items_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_required_research" ADD CONSTRAINT "research_required_research_research_id_research_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "research_required_research" ADD CONSTRAINT "research_required_research_required_id_research_id_fk" FOREIGN KEY ("required_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_items" ADD CONSTRAINT "upgrade_required_items_upgrade_id_upgrades_id_fk" FOREIGN KEY ("upgrade_id") REFERENCES "public"."upgrades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_items" ADD CONSTRAINT "upgrade_required_items_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_research" ADD CONSTRAINT "upgrade_required_research_upgrade_id_upgrades_id_fk" FOREIGN KEY ("upgrade_id") REFERENCES "public"."upgrades"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_research" ADD CONSTRAINT "upgrade_required_research_research_id_research_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrades" ADD CONSTRAINT "upgrades_effectItemId_shop_items_id_fk" FOREIGN KEY ("effectItemId") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
