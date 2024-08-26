ALTER TABLE "tilez_games" enable row level security;
DO $$ BEGIN
CREATE POLICY "tilez_select_policy" ON "tilez_games" FOR SELECT USING ( (SELECT auth.uid()) = user_id );
CREATE POLICY "tilez_insert_policy" ON "tilez_games" FOR INSERT TO "authenticated" WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "tilez_update_policy" ON "tilez_games" FOR UPDATE USING ( (SELECT auth.uid()) = user_id ) WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "tilez_delete_policy" ON "tilez_games" FOR DELETE TO "authenticated" USING ( (SELECT auth.uid()) = user_id );
EXCEPTION
 WHEN duplicate_object THEN null;
 END $$;--> statement-breakpoint

 ALTER TABLE "todos" enable row level security;
DO $$ BEGIN
CREATE POLICY "todos_select_policy" ON "todos" FOR SELECT USING ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_insert_policy" ON "todos" FOR INSERT TO "authenticated" WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_update_policy" ON "todos" FOR UPDATE USING ( (SELECT auth.uid()) = user_id ) WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "todos_delete_policy" ON "todos" FOR DELETE TO "authenticated" USING ( (SELECT auth.uid()) = user_id );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER TABLE "users" enable row level security;
DO $$ BEGIN
CREATE POLICY "users_select_policy" ON "users" FOR SELECT USING ( true );
CREATE POLICY "users_insert_policy" ON "users" FOR INSERT TO "authenticated" WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "users_update_policy" ON "users" FOR UPDATE USING ( (SELECT auth.uid()) = user_id ) WITH CHECK ( (SELECT auth.uid()) = user_id );
CREATE POLICY "users_delete_policy" ON "users" FOR DELETE TO "authenticated" USING ( (SELECT auth.uid()) = user_id );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER Table "messages" enable row level security;
DO $$ BEGIN
CREATE POLICY "messages_select_policy" ON "messages" FOR SELECT USING ( true );
CREATE POLICY "messages_insert_policy" ON "messages" FOR INSERT TO "authenticated" WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "messages_update_policy" ON "messages" FOR UPDATE USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) ) WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "messages_delete_policy" ON "messages" FOR DELETE TO "authenticated" USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER Table "likes" enable row level security;
DO $$ BEGIN
CREATE POLICY "likes_select_policy" ON "likes" FOR SELECT USING ( true );
CREATE POLICY "likes_insert_policy" ON "likes" FOR INSERT TO "authenticated" WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "likes_update_policy" ON "likes" FOR UPDATE USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) ) WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "likes_delete_policy" ON "likes" FOR DELETE TO "authenticated" USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER Table "user_follows" enable row level security;
DO $$ BEGIN
CREATE POLICY "user_follows_select_policy" ON "user_follows" FOR SELECT USING ( true );
CREATE POLICY "user_follows_insert_policy" ON "user_follows" FOR INSERT TO "authenticated" WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "user_follows_update_policy" ON "user_follows" FOR UPDATE USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) ) WITH CHECK ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
CREATE POLICY "user_follows_delete_policy" ON "user_follows" FOR DELETE TO "authenticated" USING ( (user_id IN (SELECT id FROM users WHERE users.user_id = auth.uid())) );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER Table "hashtag_messages" enable row level security;
DO $$ BEGIN
CREATE POLICY "hashtag_messages_select_policy" ON "hashtag_messages" FOR SELECT USING ( true );
CREATE POLICY "hashtag_messages_insert_policy" ON "hashtag_messages" FOR INSERT TO "appuser" WITH CHECK ( true );
CREATE POLICY "hashtag_messages_update_policy" ON "hashtag_messages" FOR UPDATE TO "appuser" USING ( true );
CREATE POLICY "hashtag_messages_delete_policy" ON "hashtag_messages" FOR DELETE TO "appuser" USING ( true );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint

ALTER Table "hashtags" enable row level security;
DO $$ BEGIN
CREATE POLICY "hashtags_select_policy" ON "hashtags" FOR SELECT USING ( true );
CREATE POLICY "hashtags_insert_policy" ON "hashtags" FOR INSERT TO "appuser" WITH CHECK ( true );
CREATE POLICY "hashtags_update_policy" ON "hashtags" FOR UPDATE TO "appuser" USING ( true );
CREATE POLICY "hashtags_delete_policy" ON "hashtags" FOR DELETE TO "appuser" USING ( true );
EXCEPTION
 WHEN duplicate_object THEN null;
END $$;--> statement-breakpoint