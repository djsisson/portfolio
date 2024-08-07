import { relations } from "drizzle-orm/relations";
import { shopItems, upgrades, levels, cities, characters, elements, itemsRequiredResearch, research, researchRequiredResearch, upgradeRequiredResearch, itemsRequiredItems, researchRequiredItems, upgradeRequiredItems } from "./schema";

export const upgradesRelations = relations(upgrades, ({one, many}) => ({
	shopItem: one(shopItems, {
		fields: [upgrades.effectItemId],
		references: [shopItems.id]
	}),
	levels: many(levels),
	upgradeRequiredResearches: many(upgradeRequiredResearch),
	upgradeRequiredItems: many(upgradeRequiredItems),
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

export const levelsRelations = relations(levels, ({one}) => ({
	upgrade: one(upgrades, {
		fields: [levels.upgradeId],
		references: [upgrades.id]
	}),
}));

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