import { eq, sql } from "drizzle-orm";
import {
	boolean,
	char,
	index,
	integer,
	pgPolicy,
	pgTable,
	text,
	timestamp,
	uniqueIndex,
	uuid,
} from "drizzle-orm/pg-core";
import {
	authenticatedRole,
	authUid,
	authUsers,
	postgresRole,
} from "drizzle-orm/supabase";

export const tilez_games = pgTable(
	"tilez_games",
	{
		id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		game_id: text("game_id").notNull(),
		userId: uuid("user_id")
			.notNull()
			.references(() => authUsers.id, {
				onDelete: "cascade",
				onUpdate: "cascade",
			}),
		game_start: timestamp("game_start", { mode: "string" }),
		game_end: timestamp("game_end", { mode: "string" }).defaultNow(),
		num_moves: integer("num_moves").default(0),
		completed: boolean("completed").default(false),
	},
	(table) => [
		index("tilez_game_id_idx").using("btree", table.game_id),
		index("tilez_game_user_id_idx").using("btree", table.userId),
		pgPolicy("tilez_delete_policy", {
			as: "permissive",
			for: "delete",
			to: authenticatedRole,
			using: eq(table.userId, authUid),
		}),
		pgPolicy("tilez_insert_policy", {
			as: "permissive",
			for: "insert",
			to: authenticatedRole,
			withCheck: eq(table.userId, authUid),
		}),
		pgPolicy("tilez_select_policy", {
			as: "permissive",
			for: "select",
			to: authenticatedRole,
			using: eq(table.userId, authUid),
		}),
		pgPolicy("tilez_update_policy", {
			as: "permissive",
			for: "update",
			to: authenticatedRole,
			withCheck: eq(table.userId, authUid),
			using: eq(table.userId, authUid),
		}),
	],
);

export const tilez_words = pgTable(
	"tilez_words",
	{
		id: uuid("id").default(sql`uuid_generate_v4()`).primaryKey().notNull(),
		word: char("word", { length: 6 }).notNull(),
		definition: text("definition").notNull(),
		last_checked: timestamp("last_checked", { mode: "string" }).notNull(),
	},
	(table) => [
		uniqueIndex("tilez_word_word_idx").using("btree", table.word),
		pgPolicy("tilez_delete_word_policy", {
			as: "permissive",
			for: "delete",
			to: postgresRole,
		}),
		pgPolicy("tilez_insert_word_policy", {
			as: "permissive",
			for: "insert",
			to: postgresRole,
		}),
		pgPolicy("tilez_select_word_policy", {
			as: "permissive",
			for: "select",
			to: postgresRole,
		}),
		pgPolicy("tilez_update_word_policy", {
			as: "permissive",
			for: "update",
			to: postgresRole,
		}),
	],
);
