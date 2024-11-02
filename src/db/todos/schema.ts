import { eq, sql } from "drizzle-orm";
import {
  boolean,
  index,
  pgPolicy,
  pgTable,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { authUsers, authenticatedRole, authUid } from "drizzle-orm/supabase";

export const todos = pgTable(
  "todos",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    title: text("title").notNull(),
    completed: boolean("completed").notNull().default(false),
    userId: uuid("user_id")
      .notNull()
      .references(() => authUsers.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => [
    pgPolicy("todos_delete_policy", {
      as: "permissive",
      for: "delete",
      to: authenticatedRole,
      using: eq(table.userId, authUid),
    }),
    pgPolicy("todos_insert_policy", {
      as: "permissive",
      for: "insert",
      to: authenticatedRole,
      withCheck: eq(table.userId, authUid),
    }),
    pgPolicy("todos_select_policy", {
      as: "permissive",
      for: "select",
      to: authenticatedRole,
      using: eq(table.userId, authUid),
    }),
    pgPolicy("todos_update_policy", {
      as: "permissive",
      for: "update",
      to: authenticatedRole,
      withCheck: eq(table.userId, authUid),
      using: eq(table.userId, authUid),
    }),
    index("todos_user_id_idx").using("btree", table.userId),
  ],
);
