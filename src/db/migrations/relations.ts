import { relations } from "drizzle-orm/relations";
import { cities, characters, elements, upgrades, levels, messages, users, usersInAuth, tilezGames, todos, shopItems, hashtags, hashtagMessages, userFollows, itemsRequiredResearch, research, likes, researchRequiredResearch, upgradeRequiredResearch, itemsRequiredItems, researchRequiredItems, upgradeRequiredItems } from "./schema";

export const charactersRelations = relations(characters, ({one}) => ({
	city: one(cities, {
		fields: [characters.cityId],
		references: [cities.id]
	}),
	element: one(elements, {
		fields: [characters.elementId],
		references: [elements.id]
	}),
}));

export const citiesRelations = relations(cities, ({many}) => ({
	characters: many(characters),
}));

export const elementsRelations = relations(elements, ({many}) => ({
	characters: many(characters),
}));

export const levelsRelations = relations(levels, ({one}) => ({
	upgrade: one(upgrades, {
		fields: [levels.upgradeId],
		references: [upgrades.id]
	}),
}));

export const upgradesRelations = relations(upgrades, ({one, many}) => ({
	levels: many(levels),
	shopItem: one(shopItems, {
		fields: [upgrades.effectItemId],
		references: [shopItems.id]
	}),
	upgradeRequiredResearches: many(upgradeRequiredResearch),
	upgradeRequiredItems: many(upgradeRequiredItems),
}));

export const messagesRelations = relations(messages, ({one, many}) => ({
	message: one(messages, {
		fields: [messages.parentId],
		references: [messages.id],
		relationName: "messages_parentId_messages_id"
	}),
	messages: many(messages, {
		relationName: "messages_parentId_messages_id"
	}),
	user: one(users, {
		fields: [messages.userId],
		references: [users.id]
	}),
	hashtagMessages: many(hashtagMessages),
	likes: many(likes),
}));

export const usersRelations = relations(users, ({one, many}) => ({
	messages: many(messages),
	usersInAuth: one(usersInAuth, {
		fields: [users.userId],
		references: [usersInAuth.id]
	}),
	userFollows_followingUserId: many(userFollows, {
		relationName: "userFollows_followingUserId_users_id"
	}),
	userFollows_userId: many(userFollows, {
		relationName: "userFollows_userId_users_id"
	}),
	likes: many(likes),
}));

export const tilezGamesRelations = relations(tilezGames, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [tilezGames.userId],
		references: [usersInAuth.id]
	}),
}));

export const usersInAuthRelations = relations(usersInAuth, ({many}) => ({
	tilezGames: many(tilezGames),
	todos: many(todos),
	users: many(users),
}));

export const todosRelations = relations(todos, ({one}) => ({
	usersInAuth: one(usersInAuth, {
		fields: [todos.userId],
		references: [usersInAuth.id]
	}),
}));

export const shopItemsRelations = relations(shopItems, ({many}) => ({
	upgrades: many(upgrades),
	itemsRequiredResearches: many(itemsRequiredResearch),
	itemsRequiredItems_itemId: many(itemsRequiredItems, {
		relationName: "itemsRequiredItems_itemId_shopItems_id"
	}),
	itemsRequiredItems_requiredId: many(itemsRequiredItems, {
		relationName: "itemsRequiredItems_requiredId_shopItems_id"
	}),
	researchRequiredItems: many(researchRequiredItems),
	upgradeRequiredItems: many(upgradeRequiredItems),
}));

export const hashtagMessagesRelations = relations(hashtagMessages, ({one}) => ({
	hashtag: one(hashtags, {
		fields: [hashtagMessages.hashtagId],
		references: [hashtags.id]
	}),
	message: one(messages, {
		fields: [hashtagMessages.messageId],
		references: [messages.id]
	}),
}));

export const hashtagsRelations = relations(hashtags, ({many}) => ({
	hashtagMessages: many(hashtagMessages),
}));

export const userFollowsRelations = relations(userFollows, ({one}) => ({
	user_followingUserId: one(users, {
		fields: [userFollows.followingUserId],
		references: [users.id],
		relationName: "userFollows_followingUserId_users_id"
	}),
	user_userId: one(users, {
		fields: [userFollows.userId],
		references: [users.id],
		relationName: "userFollows_userId_users_id"
	}),
}));

export const itemsRequiredResearchRelations = relations(itemsRequiredResearch, ({one}) => ({
	shopItem: one(shopItems, {
		fields: [itemsRequiredResearch.itemId],
		references: [shopItems.id]
	}),
	research: one(research, {
		fields: [itemsRequiredResearch.requiredId],
		references: [research.id]
	}),
}));

export const researchRelations = relations(research, ({many}) => ({
	itemsRequiredResearches: many(itemsRequiredResearch),
	researchRequiredResearches_requiredId: many(researchRequiredResearch, {
		relationName: "researchRequiredResearch_requiredId_research_id"
	}),
	researchRequiredResearches_researchId: many(researchRequiredResearch, {
		relationName: "researchRequiredResearch_researchId_research_id"
	}),
	upgradeRequiredResearches: many(upgradeRequiredResearch),
	researchRequiredItems: many(researchRequiredItems),
}));

export const likesRelations = relations(likes, ({one}) => ({
	message: one(messages, {
		fields: [likes.messageId],
		references: [messages.id]
	}),
	user: one(users, {
		fields: [likes.userId],
		references: [users.id]
	}),
}));

export const researchRequiredResearchRelations = relations(researchRequiredResearch, ({one}) => ({
	research_requiredId: one(research, {
		fields: [researchRequiredResearch.requiredId],
		references: [research.id],
		relationName: "researchRequiredResearch_requiredId_research_id"
	}),
	research_researchId: one(research, {
		fields: [researchRequiredResearch.researchId],
		references: [research.id],
		relationName: "researchRequiredResearch_researchId_research_id"
	}),
}));

export const upgradeRequiredResearchRelations = relations(upgradeRequiredResearch, ({one}) => ({
	research: one(research, {
		fields: [upgradeRequiredResearch.requiredId],
		references: [research.id]
	}),
	upgrade: one(upgrades, {
		fields: [upgradeRequiredResearch.upgradeId],
		references: [upgrades.id]
	}),
}));

export const itemsRequiredItemsRelations = relations(itemsRequiredItems, ({one}) => ({
	shopItem_itemId: one(shopItems, {
		fields: [itemsRequiredItems.itemId],
		references: [shopItems.id],
		relationName: "itemsRequiredItems_itemId_shopItems_id"
	}),
	shopItem_requiredId: one(shopItems, {
		fields: [itemsRequiredItems.requiredId],
		references: [shopItems.id],
		relationName: "itemsRequiredItems_requiredId_shopItems_id"
	}),
}));

export const researchRequiredItemsRelations = relations(researchRequiredItems, ({one}) => ({
	shopItem: one(shopItems, {
		fields: [researchRequiredItems.itemId],
		references: [shopItems.id]
	}),
	research: one(research, {
		fields: [researchRequiredItems.researchId],
		references: [research.id]
	}),
}));

export const upgradeRequiredItemsRelations = relations(upgradeRequiredItems, ({one}) => ({
	shopItem: one(shopItems, {
		fields: [upgradeRequiredItems.itemId],
		references: [shopItems.id]
	}),
	upgrade: one(upgrades, {
		fields: [upgradeRequiredItems.upgradeId],
		references: [upgrades.id]
	}),
}));