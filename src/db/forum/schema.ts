import {
  AnyPgColumn,
  index,
  integer,
  pgTable,
  primaryKey,
  text,
  timestamp,
  uuid,
} from "drizzle-orm/pg-core";
import { users as auth } from "../auth_schema";
import { sql } from "drizzle-orm";

export const users = pgTable(
  "users",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    user_id: uuid("user_id").references(() => auth.id, {
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
  (table) => {
    return {
      usernameIdx: index("users_username_idx").using("btree", table.username),
      emailIdx: index("users_email_idx").using("btree", table.email),
      userIdx: index("users_user_id_idx").using("btree", table.user_id),
    };
  },
);

export const messages = pgTable(
  "messages",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
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
  (table) => {
    return {
      userIdx: index("messages_user_id_idx").using("btree", table.user_id),
      parentIdIdx: index("messages_parent_id_idx").using(
        "btree",
        table.parent_id,
      ),
    };
  },
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
  (table) => {
    return {
      likespk: primaryKey({
        columns: [table.user_id, table.message_id],
        name: "likes_pk",
      }),
    };
  },
);
export const hashtags = pgTable(
  "hashtags",
  {
    id: uuid("id")
      .default(sql`uuid_generate_v4()`)
      .primaryKey()
      .notNull(),
    hashtag: text("hashtag").notNull(),
  },
  (table) => {
    return {
      hashtagIdx: index("hashtags_hashtag_idx").using("btree", table.hashtag),
    };
  },
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
  (table) => {
    return {
      hashtagIdIdx: index("hashtag_messages_hashtag_id_idx").using(
        "btree",
        table.hashtag_id,
      ),
      messageIdIdx: index("hashtag_messages_message_id_idx").using(
        "btree",
        table.message_id,
      ),
      hashtagpk: primaryKey({
        columns: [table.hashtag_id, table.message_id],
        name: "hashtag_messages_pk",
      }),
    };
  },
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
  (table) => {
    return {
      userIdx: index("user_follows_user_id_idx").using("btree", table.user_id),
      followingUserIdx: index("user_follows_following_user_id_idx").using(
        "btree",
        table.following_user_id,
      ),
      userFollowspk: primaryKey({
        columns: [table.user_id, table.following_user_id],
        name: "user_follows_pk",
      }),
    };
  },
);
