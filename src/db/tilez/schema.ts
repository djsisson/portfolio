import {
  pgTable,
  integer,
  uuid,
  text,
  timestamp,
  boolean,
  index,
  uniqueIndex,
  varchar,
  char,
} from "drizzle-orm/pg-core";
import { sql } from "drizzle-orm";
import { users } from "../auth_schema";

export const tilez_games = pgTable(
  "tilez_games",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    game_id: text("game_id").notNull(),
    userId: uuid("user_id")
      .notNull()
      .references(() => users.id, {
        onDelete: "cascade",
        onUpdate: "cascade",
      }),
    game_start: timestamp("game_start", { mode: "string" }),
    game_end: timestamp("game_end", { mode: "string" }).defaultNow(),
    num_moves: integer("num_moves").default(0),
    completed: boolean("completed").default(false),
  },
  (table) => {
    return {
      game_id_idx: index("tilez_game_id_idx").using("btree", table.game_id),
      user_id_idx: index("tilez_game_user_id_idx").using("btree", table.userId),
    };
  },
);

export const tilez_words = pgTable(
  "tilez_words",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    word: char("word", { length: 6 }).notNull(),
    definition: text("definition").notNull(),
    last_checked: timestamp("last_checked", { mode: "string" }).notNull(),
  },
  (table) => {
    return {
      word_idx: uniqueIndex("tilez_word_word_idx").using("btree", table.word),
    };
  },
);
