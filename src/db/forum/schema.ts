import { eq, sql } from "drizzle-orm";
import {
	type AnyPgColumn,
	index,
	integer,
	pgPolicy,
	pgTable,
	primaryKey,
	text,
	timestamp,
	uuid,
} from "drizzle-orm/pg-core";
import {
	anonRole,
	authenticatedRole,
	authUid,
	authUsers,
	postgresRole,
} from "drizzle-orm/supabase";

export const users = pgTable(
	"users",
	{
		id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		user_id: uuid("user_id").references(() => authUsers.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
		username: text("username").notNull(),
		email: text("email").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
		bio: text("bio"),
		avatar: text("avatar"),
	},
	(table) => [
		index("users_username_idx").using("btree", table.username),
		index("users_email_idx").using("btree", table.email),
		index("users_user_id_idx").using("btree", table.user_id),
		pgPolicy("users_delete_policy", {
			as: "permissive",
			for: "delete",
			to: authenticatedRole,
			using: eq(table.user_id, authUid),
		}),
		pgPolicy("users_insert_policy", {
			as: "permissive",
			for: "insert",
			to: authenticatedRole,
			withCheck: eq(table.user_id, authUid),
		}),
		pgPolicy("users_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("users_update_policy", {
			as: "permissive",
			for: "update",
			to: authenticatedRole,
			withCheck: eq(table.user_id, authUid),
			using: eq(table.user_id, authUid),
		}),
	],
);

export const messages = pgTable(
	"messages",
	{
		id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		user_id: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
		parent_id: uuid("parent_id").references((): AnyPgColumn => messages.id, {
			onDelete: "cascade",
			onUpdate: "cascade",
		}),
		message: text("message").notNull(),
		createdAt: timestamp("created_at", { withTimezone: true })
			.defaultNow()
			.notNull(),
		updatedAt: timestamp("updated_at", { withTimezone: true }).$onUpdate(
			() => new Date(),
		),
	},
	(table) => [
		index("messages_user_id_idx").using("btree", table.user_id),
		index("messages_parent_id_idx").using("btree", table.parent_id),
		pgPolicy("messages_delete_policy", {
			as: "permissive",
			for: "delete",
			to: authenticatedRole,
			using: eq(table.user_id, authUid),
		}),
		pgPolicy("messages_insert_policy", {
			as: "permissive",
			for: "insert",
			to: authenticatedRole,
			withCheck: eq(table.user_id, authUid),
		}),
		pgPolicy("messages_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("messages_update_policy", {
			as: "permissive",
			for: "update",
			to: authenticatedRole,
			withCheck: eq(table.user_id, authUid),
			using: eq(table.user_id, authUid),
		}),
	],
);

export const likes = pgTable(
	"likes",
	{
		user_id: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
		message_id: uuid("message_id")
			.references(() => messages.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		like: integer("like").default(0).notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.user_id, table.message_id],
			name: "likes_pk",
		}),
		pgPolicy("likes_delete_policy", {
			as: "permissive",
			for: "delete",
			to: authenticatedRole,
			using: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
		pgPolicy("likes_insert_policy", {
			as: "permissive",
			for: "insert",
			to: authenticatedRole,
			withCheck: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
		pgPolicy("likes_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("likes_update_policy", {
			as: "permissive",
			for: "update",
			to: authenticatedRole,
			withCheck: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
			using: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
	],
);
export const hashtags = pgTable(
	"hashtags",
	{
		id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		hashtag: text("hashtag").notNull(),
	},
	(table) => [
		index("hashtags_hashtag_idx").using("btree", table.hashtag),
		pgPolicy("hashtags_delete_policy", {
			as: "permissive",
			for: "delete",
			to: postgresRole,
			using: sql`true`,
		}),
		pgPolicy("hashtags_insert_policy", {
			as: "permissive",
			for: "insert",
			to: postgresRole,
			withCheck: sql`true`,
		}),
		pgPolicy("hashtags_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("hashtags_update_policy", {
			as: "permissive",
			for: "update",
			to: postgresRole,
			using: sql`true`,
		}),
	],
);

export const hashtag_messages = pgTable(
	"hashtag_messages",
	{
		hashtag_id: uuid("hashtag_id")
			.references(() => hashtags.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
		message_id: uuid("message_id")
			.references(() => messages.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			})
			.notNull(),
	},
	(table) => [
		index("hashtag_messages_hashtag_id_idx").using("btree", table.hashtag_id),
		index("hashtag_messages_message_id_idx").using("btree", table.message_id),
		primaryKey({
			columns: [table.hashtag_id, table.message_id],
			name: "hashtag_messages_pk",
		}),
		pgPolicy("hashtag_messages_delete_policy", {
			as: "permissive",
			for: "delete",
			to: postgresRole,
			using: sql`true`,
		}),
		pgPolicy("hashtag_messages_insert_policy", {
			as: "permissive",
			for: "insert",
			to: postgresRole,
			withCheck: sql`true`,
		}),
		pgPolicy("hashtag_messages_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("hashtag_messages_update_policy", {
			as: "permissive",
			for: "update",
			to: postgresRole,
			using: sql`true`,
		}),
	],
);

export const user_follows = pgTable(
	"user_follows",
	{
		user_id: uuid("user_id")
			.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
		following_user_id: uuid("following_user_id")
			.references(() => users.id, { onDelete: "cascade", onUpdate: "cascade" })
			.notNull(),
	},
	(table) => [
		index("user_follows_user_id_idx").using("btree", table.user_id),
		index("user_follows_following_user_id_idx").using(
			"btree",
			table.following_user_id,
		),
		primaryKey({
			columns: [table.user_id, table.following_user_id],
			name: "user_follows_pk",
		}),
		pgPolicy("user_follows_delete_policy", {
			as: "permissive",
			for: "delete",
			to: authenticatedRole,
			using: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
		pgPolicy("user_follows_insert_policy", {
			as: "permissive",
			for: "insert",
			to: authenticatedRole,
			withCheck: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
		pgPolicy("user_follows_select_policy", {
			as: "permissive",
			for: "select",
			to: anonRole,
			using: sql`true`,
		}),
		pgPolicy("user_follows_update_policy", {
			as: "permissive",
			for: "update",
			to: authenticatedRole,
			using: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
			withCheck: sql`(user_id IN ( SELECT users.id FROM users WHERE (users.user_id = ( SELECT auth.uid() AS uid))))`,
		}),
	],
);
