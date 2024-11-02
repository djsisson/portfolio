-- Current sql file was generated after introspecting the database
-- If you want to run this migration please uncomment this code before executing migrations
/*
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
CREATE TABLE IF NOT EXISTS "hashtags" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"hashtag" text NOT NULL
);
--> statement-breakpoint
ALTER TABLE "hashtags" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
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
CREATE TABLE IF NOT EXISTS "messages" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid NOT NULL,
	"parent_id" uuid,
	"message" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone
);
--> statement-breakpoint
ALTER TABLE "messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "research_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"cost" integer NOT NULL
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
CREATE TABLE IF NOT EXISTS "tilez_games" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"game_id" text NOT NULL,
	"user_id" uuid NOT NULL,
	"game_start" timestamp,
	"game_end" timestamp DEFAULT now(),
	"num_moves" integer DEFAULT 0,
	"completed" boolean DEFAULT false
);
--> statement-breakpoint
ALTER TABLE "tilez_games" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "tilez_words" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"word" char(6) NOT NULL,
	"definition" text NOT NULL,
	"last_checked" timestamp NOT NULL
);
--> statement-breakpoint
ALTER TABLE "tilez_words" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
ALTER TABLE "todos" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrades" (
	"id" integer PRIMARY KEY GENERATED ALWAYS AS IDENTITY (sequence name "upgrades_id_seq" INCREMENT BY 1 MINVALUE 1 MAXVALUE 2147483647 START WITH 1 CACHE 1),
	"name" text NOT NULL,
	"description" text NOT NULL,
	"effectItemId" integer NOT NULL
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "users" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"user_id" uuid,
	"username" text NOT NULL,
	"email" text NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL,
	"updated_at" timestamp with time zone,
	"bio" text,
	"avatar" text
);
--> statement-breakpoint
ALTER TABLE "users" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "hashtag_messages" (
	"hashtag_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	CONSTRAINT "hashtag_messages_pk" PRIMARY KEY("hashtag_id","message_id")
);
--> statement-breakpoint
ALTER TABLE "hashtag_messages" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "user_follows" (
	"user_id" uuid NOT NULL,
	"following_user_id" uuid NOT NULL,
	CONSTRAINT "user_follows_pk" PRIMARY KEY("user_id","following_user_id")
);
--> statement-breakpoint
ALTER TABLE "user_follows" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "items_required_research" (
	"item_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "items_required_research_item_id_required_id_pk" PRIMARY KEY("item_id","required_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "likes" (
	"user_id" uuid NOT NULL,
	"message_id" uuid NOT NULL,
	"like" integer DEFAULT 0 NOT NULL,
	CONSTRAINT "likes_pk" PRIMARY KEY("user_id","message_id")
);
--> statement-breakpoint
ALTER TABLE "likes" ENABLE ROW LEVEL SECURITY;--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "research_required_research" (
	"research_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "research_required_research_research_id_required_id_pk" PRIMARY KEY("research_id","required_id")
);
--> statement-breakpoint
CREATE TABLE IF NOT EXISTS "upgrade_required_research" (
	"upgrade_id" integer NOT NULL,
	"required_id" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "upgrade_required_research_upgrade_id_research_id_pk" PRIMARY KEY("upgrade_id","required_id")
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
CREATE TABLE IF NOT EXISTS "research_required_items" (
	"research_id" integer NOT NULL,
	"item_id" integer NOT NULL,
	"quantity" integer NOT NULL,
	"description" text NOT NULL,
	CONSTRAINT "research_required_items_research_id_item_id_pk" PRIMARY KEY("research_id","item_id")
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
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_city_id_cities_id_fk" FOREIGN KEY ("city_id") REFERENCES "public"."cities"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "characters" ADD CONSTRAINT "characters_element_id_elements_id_fk" FOREIGN KEY ("element_id") REFERENCES "public"."elements"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "messages" ADD CONSTRAINT "messages_parent_id_messages_id_fk" FOREIGN KEY ("parent_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "messages" ADD CONSTRAINT "messages_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "tilez_games" ADD CONSTRAINT "tilez_games_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrades" ADD CONSTRAINT "upgrades_effectItemId_shop_items_id_fk" FOREIGN KEY ("effectItemId") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "users" ADD CONSTRAINT "users_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hashtag_messages" ADD CONSTRAINT "hashtag_messages_hashtag_id_hashtags_id_fk" FOREIGN KEY ("hashtag_id") REFERENCES "public"."hashtags"("id") ON DELETE restrict ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "hashtag_messages" ADD CONSTRAINT "hashtag_messages_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_following_user_id_users_id_fk" FOREIGN KEY ("following_user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "user_follows" ADD CONSTRAINT "user_follows_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
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
 ALTER TABLE "likes" ADD CONSTRAINT "likes_message_id_messages_id_fk" FOREIGN KEY ("message_id") REFERENCES "public"."messages"("id") ON DELETE cascade ON UPDATE cascade;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "likes" ADD CONSTRAINT "likes_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "public"."users"("id") ON DELETE cascade ON UPDATE cascade;
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
 ALTER TABLE "research_required_research" ADD CONSTRAINT "research_required_research_research_id_research_id_fk" FOREIGN KEY ("research_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "upgrade_required_research" ADD CONSTRAINT "upgrade_required_research_required_id_research_id_fk" FOREIGN KEY ("required_id") REFERENCES "public"."research"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "research_required_items" ADD CONSTRAINT "research_required_items_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
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
 ALTER TABLE "upgrade_required_items" ADD CONSTRAINT "upgrade_required_items_item_id_shop_items_id_fk" FOREIGN KEY ("item_id") REFERENCES "public"."shop_items"("id") ON DELETE no action ON UPDATE no action;
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
CREATE INDEX IF NOT EXISTS "hashtags_hashtag_idx" ON "hashtags" USING btree ("hashtag");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_parent_id_idx" ON "messages" USING btree ("parent_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "messages_user_id_idx" ON "messages" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tilez_game_id_idx" ON "tilez_games" USING btree ("game_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "tilez_game_user_id_idx" ON "tilez_games" USING btree ("user_id");--> statement-breakpoint
CREATE UNIQUE INDEX IF NOT EXISTS "tilez_word_word_idx" ON "tilez_words" USING btree ("word");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "todos_user_id_idx" ON "todos" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_email_idx" ON "users" USING btree ("email");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_user_id_idx" ON "users" USING btree ("user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "users_username_idx" ON "users" USING btree ("username");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hashtag_messages_hashtag_id_idx" ON "hashtag_messages" USING btree ("hashtag_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "hashtag_messages_message_id_idx" ON "hashtag_messages" USING btree ("message_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_follows_following_user_id_idx" ON "user_follows" USING btree ("following_user_id");--> statement-breakpoint
CREATE INDEX IF NOT EXISTS "user_follows_user_id_idx" ON "user_follows" USING btree ("user_id");--> statement-breakpoint
CREATE POLICY "hashtags_delete_policy" ON "hashtags" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "hashtags_insert_policy" ON "hashtags" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "hashtags_select_policy" ON "hashtags" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "hashtags_update_policy" ON "hashtags" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "messages_delete_policy" ON "messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "messages_insert_policy" ON "messages" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "messages_select_policy" ON "messages" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "messages_update_policy" ON "messages" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "tilez_delete_policy" ON "tilez_games" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "tilez_insert_policy" ON "tilez_games" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "tilez_select_policy" ON "tilez_games" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "tilez_update_policy" ON "tilez_games" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "todos_delete_policy" ON "todos" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "todos_insert_policy" ON "todos" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "todos_select_policy" ON "todos" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "todos_update_policy" ON "todos" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "users_delete_policy" ON "users" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((( SELECT auth.uid() AS uid) = user_id));--> statement-breakpoint
CREATE POLICY "users_insert_policy" ON "users" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "users_select_policy" ON "users" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "users_update_policy" ON "users" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "hashtag_messages_delete_policy" ON "hashtag_messages" AS PERMISSIVE FOR DELETE TO "authenticated" USING (true);--> statement-breakpoint
CREATE POLICY "hashtag_messages_insert_policy" ON "hashtag_messages" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "hashtag_messages_select_policy" ON "hashtag_messages" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "hashtag_messages_update_policy" ON "hashtag_messages" AS PERMISSIVE FOR UPDATE TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_follows_delete_policy" ON "user_follows" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "user_follows_insert_policy" ON "user_follows" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "user_follows_select_policy" ON "user_follows" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "user_follows_update_policy" ON "user_follows" AS PERMISSIVE FOR UPDATE TO public;--> statement-breakpoint
CREATE POLICY "likes_delete_policy" ON "likes" AS PERMISSIVE FOR DELETE TO "authenticated" USING ((user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid)))));--> statement-breakpoint
CREATE POLICY "likes_insert_policy" ON "likes" AS PERMISSIVE FOR INSERT TO "authenticated";--> statement-breakpoint
CREATE POLICY "likes_select_policy" ON "likes" AS PERMISSIVE FOR SELECT TO public;--> statement-breakpoint
CREATE POLICY "likes_update_policy" ON "likes" AS PERMISSIVE FOR UPDATE TO public;
*/