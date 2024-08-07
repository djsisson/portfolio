CREATE TABLE IF NOT EXISTS "todos" (
	"id" uuid PRIMARY KEY DEFAULT uuid_generate_v4() NOT NULL,
	"title" text NOT NULL,
	"completed" boolean DEFAULT false NOT NULL,
	"user_id" uuid NOT NULL,
	"created_at" timestamp with time zone DEFAULT now() NOT NULL
);
--> statement-breakpoint
DO $$ BEGIN
 ALTER TABLE "todos" ADD CONSTRAINT "todos_user_id_users_id_fk" FOREIGN KEY ("user_id") REFERENCES "auth"."users"("id") ON DELETE no action ON UPDATE no action;
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
DO $$ BEGIN
CREATE INDEX "todos_user_id_idx" ON "todos" USING btree ("user_id");
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;
--> statement-breakpoint
ALTER TABLE "todos" enable row level security;
DO $$ BEGIN
CREATE POLICY "todos_select_policy" ON "todos" FOR SELECT USING ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_insert_policy" ON "todos" FOR INSERT TO "authenticated" WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_update_policy" ON "todos" FOR UPDATE USING ( (SELECT auth.uid()) = user_id ) WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_delete_policy" ON "todos" FOR DELETE TO "authenticated" USING ( (SELECT auth.uid()) = user_id );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;