import { pgTable, foreignKey, unique, integer, text, bigint, real, json, index, pgPolicy, uuid, timestamp, boolean, uniqueIndex, char, primaryKey } from "drizzle-orm/pg-core"
import { sql } from "drizzle-orm"
import {
	authenticatedRole,
	authUid,
	authUsers,
	realtimeMessages,
	realtimeTopic,
	supabaseAuthAdminRole,
  } from "drizzle-orm/supabase";

  export const usersInAuth = authUsers

export const characters = pgTable("characters", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "characters_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	description: text().array().notNull(),
	elementId: integer("element_id").notNull(),
	cityId: integer("city_id").notNull(),
}, (table) => {
	return {
		charactersCityIdCitiesIdFk: foreignKey({
			columns: [table.cityId],
			foreignColumns: [cities.id],
			name: "characters_city_id_cities_id_fk"
		}),
		charactersElementIdElementsIdFk: foreignKey({
			columns: [table.elementId],
			foreignColumns: [elements.id],
			name: "characters_element_id_elements_id_fk"
		}),
		charactersNameUnique: unique("characters_name_unique").on(table.name),
	}
});

export const cities = pgTable("cities", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "cities_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
}, (table) => {
	return {
		citiesNameUnique: unique("cities_name_unique").on(table.name),
	}
});

export const elements = pgTable("elements", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "elements_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	colour: text().notNull(),
}, (table) => {
	return {
		elementsNameUnique: unique("elements_name_unique").on(table.name),
		elementsColourUnique: unique("elements_colour_unique").on(table.colour),
	}
});

export const gamestate = pgTable("gamestate", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "gamestats_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	playername: text().notNull(),
	theme: text().notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currentscore: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalclicks: bigint({ mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalspent: bigint({ mode: "number" }).notNull(),
	currentaveragecps: real().notNull(),
	averageclickvalue: real().notNull(),
	researched: integer().array().notNull(),
	upgrades: json().array().notNull(),
	items: json().array().notNull(),
});

export const hashtags = pgTable("hashtags", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	hashtag: text().notNull(),
}, (table) => {
	return {
		hashtagIdx: index("hashtags_hashtag_idx").using("btree", table.hashtag.asc().nullsLast()),
		hashtagsDeletePolicy: pgPolicy("hashtags_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
		hashtagsInsertPolicy: pgPolicy("hashtags_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		hashtagsSelectPolicy: pgPolicy("hashtags_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		hashtagsUpdatePolicy: pgPolicy("hashtags_update_policy", { as: "permissive", for: "update", to: ["authenticated"] }),
	}
});

export const levels = pgTable("levels", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "levels_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	level: integer().notNull(),
	upgradeId: integer("upgrade_id").notNull(),
	cost: integer().notNull(),
	baseValue: real().notNull(),
	critChance: real().notNull(),
	critDamage: real().notNull(),
}, (table) => {
	return {
		levelsUpgradeIdUpgradesIdFk: foreignKey({
			columns: [table.upgradeId],
			foreignColumns: [upgrades.id],
			name: "levels_upgrade_id_upgrades_id_fk"
		}),
	}
});

export const messages = pgTable("messages", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id").notNull(),
	parentId: uuid("parent_id"),
	message: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
}, (table) => {
	return {
		parentIdIdx: index("messages_parent_id_idx").using("btree", table.parentId.asc().nullsLast()),
		userIdIdx: index("messages_user_id_idx").using("btree", table.userId.asc().nullsLast()),
		messagesParentIdMessagesIdFk: foreignKey({
			columns: [table.parentId],
			foreignColumns: [table.id],
			name: "messages_parent_id_messages_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		messagesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "messages_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		messagesDeletePolicy: pgPolicy("messages_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid))))` }),
		messagesInsertPolicy: pgPolicy("messages_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		messagesSelectPolicy: pgPolicy("messages_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		messagesUpdatePolicy: pgPolicy("messages_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const research = pgTable("research", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "research_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	description: text().notNull(),
	cost: integer().notNull(),
});

export const shopItems = pgTable("shop_items", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "shop_items_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	cost: integer().notNull(),
	maxQty: integer().notNull(),
	multiplier: real().notNull(),
	baseValue: real().notNull(),
	critChance: real().notNull(),
	critDamage: real().notNull(),
});

export const tilezGames = pgTable("tilez_games", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	gameId: text("game_id").notNull(),
	userId: uuid("user_id").notNull(),
	gameStart: timestamp("game_start", { mode: 'string' }),
	gameEnd: timestamp("game_end", { mode: 'string' }).defaultNow(),
	numMoves: integer("num_moves").default(0),
	completed: boolean().default(false),
}, (table) => {
	return {
		tilezGameIdIdx: index("tilez_game_id_idx").using("btree", table.gameId.asc().nullsLast()),
		tilezGameUserIdIdx: index("tilez_game_user_id_idx").using("btree", table.userId.asc().nullsLast()),
		tilezGamesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "tilez_games_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		tilezDeletePolicy: pgPolicy("tilez_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
		tilezInsertPolicy: pgPolicy("tilez_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		tilezSelectPolicy: pgPolicy("tilez_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		tilezUpdatePolicy: pgPolicy("tilez_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const tilezWords = pgTable("tilez_words", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	word: char({ length: 6 }).notNull(),
	definition: text().notNull(),
	lastChecked: timestamp("last_checked", { mode: 'string' }).notNull(),
}, (table) => {
	return {
		tilezWordWordIdx: uniqueIndex("tilez_word_word_idx").using("btree", table.word.asc().nullsLast()),
	}
});

export const todos = pgTable("todos", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	title: text().notNull(),
	completed: boolean().default(false).notNull(),
	userId: uuid("user_id").notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
}, (table) => {
	return {
		userIdIdx: index("todos_user_id_idx").using("btree", table.userId.asc().nullsLast()),
		todosUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "todos_user_id_users_id_fk"
		}),
		todosDeletePolicy: pgPolicy("todos_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
		todosInsertPolicy: pgPolicy("todos_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		todosSelectPolicy: pgPolicy("todos_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		todosUpdatePolicy: pgPolicy("todos_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const upgrades = pgTable("upgrades", {
	id: integer().primaryKey().generatedAlwaysAsIdentity({ name: "upgrades_id_seq", startWith: 1, increment: 1, minValue: 1, maxValue: 2147483647, cache: 1 }),
	name: text().notNull(),
	description: text().notNull(),
	effectItemId: integer().notNull(),
}, (table) => {
	return {
		upgradesEffectItemIdShopItemsIdFk: foreignKey({
			columns: [table.effectItemId],
			foreignColumns: [shopItems.id],
			name: "upgrades_effectItemId_shop_items_id_fk"
		}),
	}
});

export const users = pgTable("users", {
	id: uuid().default(sql`uuid_generate_v4()`).primaryKey().notNull(),
	userId: uuid("user_id"),
	username: text().notNull(),
	email: text().notNull(),
	createdAt: timestamp("created_at", { withTimezone: true, mode: 'string' }).defaultNow().notNull(),
	updatedAt: timestamp("updated_at", { withTimezone: true, mode: 'string' }),
	bio: text(),
	avatar: text(),
}, (table) => {
	return {
		emailIdx: index("users_email_idx").using("btree", table.email.asc().nullsLast()),
		userIdIdx: index("users_user_id_idx").using("btree", table.userId.asc().nullsLast()),
		usernameIdx: index("users_username_idx").using("btree", table.username.asc().nullsLast()),
		usersUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [table.id],
			name: "users_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		usersDeletePolicy: pgPolicy("users_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(( SELECT auth.uid() AS uid) = user_id)` }),
		usersInsertPolicy: pgPolicy("users_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		usersSelectPolicy: pgPolicy("users_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		usersUpdatePolicy: pgPolicy("users_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const hashtagMessages = pgTable("hashtag_messages", {
	hashtagId: uuid("hashtag_id").notNull(),
	messageId: uuid("message_id").notNull(),
}, (table) => {
	return {
		hashtagIdIdx: index("hashtag_messages_hashtag_id_idx").using("btree", table.hashtagId.asc().nullsLast()),
		messageIdIdx: index("hashtag_messages_message_id_idx").using("btree", table.messageId.asc().nullsLast()),
		hashtagMessagesHashtagIdHashtagsIdFk: foreignKey({
			columns: [table.hashtagId],
			foreignColumns: [hashtags.id],
			name: "hashtag_messages_hashtag_id_hashtags_id_fk"
		}).onUpdate("cascade").onDelete("restrict"),
		hashtagMessagesMessageIdMessagesIdFk: foreignKey({
			columns: [table.messageId],
			foreignColumns: [messages.id],
			name: "hashtag_messages_message_id_messages_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		hashtagMessagesPk: primaryKey({ columns: [table.hashtagId, table.messageId], name: "hashtag_messages_pk"}),
		hashtagMessagesDeletePolicy: pgPolicy("hashtag_messages_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`true` }),
		hashtagMessagesInsertPolicy: pgPolicy("hashtag_messages_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		hashtagMessagesSelectPolicy: pgPolicy("hashtag_messages_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		hashtagMessagesUpdatePolicy: pgPolicy("hashtag_messages_update_policy", { as: "permissive", for: "update", to: ["authenticated"] }),
	}
});

export const userFollows = pgTable("user_follows", {
	userId: uuid("user_id").notNull(),
	followingUserId: uuid("following_user_id").notNull(),
}, (table) => {
	return {
		followingUserIdIdx: index("user_follows_following_user_id_idx").using("btree", table.followingUserId.asc().nullsLast()),
		userIdIdx: index("user_follows_user_id_idx").using("btree", table.userId.asc().nullsLast()),
		userFollowsFollowingUserIdUsersIdFk: foreignKey({
			columns: [table.followingUserId],
			foreignColumns: [users.id],
			name: "user_follows_following_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		userFollowsUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "user_follows_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		userFollowsPk: primaryKey({ columns: [table.userId, table.followingUserId], name: "user_follows_pk"}),
		userFollowsDeletePolicy: pgPolicy("user_follows_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid))))` }),
		userFollowsInsertPolicy: pgPolicy("user_follows_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		userFollowsSelectPolicy: pgPolicy("user_follows_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		userFollowsUpdatePolicy: pgPolicy("user_follows_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const itemsRequiredResearch = pgTable("items_required_research", {
	itemId: integer("item_id").notNull(),
	requiredId: integer("required_id").notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		itemsRequiredResearchItemIdShopItemsIdFk: foreignKey({
			columns: [table.itemId],
			foreignColumns: [shopItems.id],
			name: "items_required_research_item_id_shop_items_id_fk"
		}),
		itemsRequiredResearchRequiredIdResearchIdFk: foreignKey({
			columns: [table.requiredId],
			foreignColumns: [research.id],
			name: "items_required_research_required_id_research_id_fk"
		}),
		itemsRequiredResearchItemIdRequiredIdPk: primaryKey({ columns: [table.itemId, table.requiredId], name: "items_required_research_item_id_required_id_pk"}),
	}
});

export const likes = pgTable("likes", {
	userId: uuid("user_id").notNull(),
	messageId: uuid("message_id").notNull(),
	like: integer().default(0).notNull(),
}, (table) => {
	return {
		likesMessageIdMessagesIdFk: foreignKey({
			columns: [table.messageId],
			foreignColumns: [messages.id],
			name: "likes_message_id_messages_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		likesUserIdUsersIdFk: foreignKey({
			columns: [table.userId],
			foreignColumns: [users.id],
			name: "likes_user_id_users_id_fk"
		}).onUpdate("cascade").onDelete("cascade"),
		likesPk: primaryKey({ columns: [table.userId, table.messageId], name: "likes_pk"}),
		likesDeletePolicy: pgPolicy("likes_delete_policy", { as: "permissive", for: "delete", to: ["authenticated"], using: sql`(user_id IN ( SELECT users.id
   FROM users
  WHERE (users.user_id = ( SELECT auth.uid() AS uid))))` }),
		likesInsertPolicy: pgPolicy("likes_insert_policy", { as: "permissive", for: "insert", to: ["authenticated"] }),
		likesSelectPolicy: pgPolicy("likes_select_policy", { as: "permissive", for: "select", to: ["public"] }),
		likesUpdatePolicy: pgPolicy("likes_update_policy", { as: "permissive", for: "update", to: ["public"] }),
	}
});

export const researchRequiredResearch = pgTable("research_required_research", {
	researchId: integer("research_id").notNull(),
	requiredId: integer("required_id").notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		researchRequiredResearchRequiredIdResearchIdFk: foreignKey({
			columns: [table.requiredId],
			foreignColumns: [research.id],
			name: "research_required_research_required_id_research_id_fk"
		}),
		researchRequiredResearchResearchIdResearchIdFk: foreignKey({
			columns: [table.researchId],
			foreignColumns: [research.id],
			name: "research_required_research_research_id_research_id_fk"
		}),
		researchRequiredResearchResearchIdRequiredIdPk: primaryKey({ columns: [table.researchId, table.requiredId], name: "research_required_research_research_id_required_id_pk"}),
	}
});

export const upgradeRequiredResearch = pgTable("upgrade_required_research", {
	upgradeId: integer("upgrade_id").notNull(),
	requiredId: integer("required_id").notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		upgradeRequiredResearchRequiredIdResearchIdFk: foreignKey({
			columns: [table.requiredId],
			foreignColumns: [research.id],
			name: "upgrade_required_research_required_id_research_id_fk"
		}),
		upgradeRequiredResearchUpgradeIdUpgradesIdFk: foreignKey({
			columns: [table.upgradeId],
			foreignColumns: [upgrades.id],
			name: "upgrade_required_research_upgrade_id_upgrades_id_fk"
		}),
		upgradeRequiredResearchUpgradeIdResearchIdPk: primaryKey({ columns: [table.upgradeId, table.requiredId], name: "upgrade_required_research_upgrade_id_research_id_pk"}),
	}
});

export const itemsRequiredItems = pgTable("items_required_items", {
	itemId: integer("item_id").notNull(),
	requiredId: integer("required_id").notNull(),
	quantity: integer().notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		itemsRequiredItemsItemIdShopItemsIdFk: foreignKey({
			columns: [table.itemId],
			foreignColumns: [shopItems.id],
			name: "items_required_items_item_id_shop_items_id_fk"
		}),
		itemsRequiredItemsRequiredIdShopItemsIdFk: foreignKey({
			columns: [table.requiredId],
			foreignColumns: [shopItems.id],
			name: "items_required_items_required_id_shop_items_id_fk"
		}),
		itemsRequiredItemsItemIdRequiredIdPk: primaryKey({ columns: [table.itemId, table.requiredId], name: "items_required_items_item_id_required_id_pk"}),
	}
});

export const researchRequiredItems = pgTable("research_required_items", {
	researchId: integer("research_id").notNull(),
	itemId: integer("item_id").notNull(),
	quantity: integer().notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		researchRequiredItemsItemIdShopItemsIdFk: foreignKey({
			columns: [table.itemId],
			foreignColumns: [shopItems.id],
			name: "research_required_items_item_id_shop_items_id_fk"
		}),
		researchRequiredItemsResearchIdResearchIdFk: foreignKey({
			columns: [table.researchId],
			foreignColumns: [research.id],
			name: "research_required_items_research_id_research_id_fk"
		}),
		researchRequiredItemsResearchIdItemIdPk: primaryKey({ columns: [table.researchId, table.itemId], name: "research_required_items_research_id_item_id_pk"}),
	}
});

export const upgradeRequiredItems = pgTable("upgrade_required_items", {
	upgradeId: integer("upgrade_id").notNull(),
	itemId: integer("item_id").notNull(),
	quantity: integer().notNull(),
	description: text().notNull(),
}, (table) => {
	return {
		upgradeRequiredItemsItemIdShopItemsIdFk: foreignKey({
			columns: [table.itemId],
			foreignColumns: [shopItems.id],
			name: "upgrade_required_items_item_id_shop_items_id_fk"
		}),
		upgradeRequiredItemsUpgradeIdUpgradesIdFk: foreignKey({
			columns: [table.upgradeId],
			foreignColumns: [upgrades.id],
			name: "upgrade_required_items_upgrade_id_upgrades_id_fk"
		}),
		upgradeRequiredItemsUpgradeIdItemIdPk: primaryKey({ columns: [table.upgradeId, table.itemId], name: "upgrade_required_items_upgrade_id_item_id_pk"}),
	}
});
