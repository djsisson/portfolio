import { relations } from "drizzle-orm/relations";
import {
  shopItems,
  upgrades,
  levels,
  cities,
  characters,
  elements,
  items_required_research,
  research,
  research_required_research,
  upgrade_required_research,
  research_required_items,
  items_required_items,
  upgrade_required_items,
} from "./schema";

export const upgradesRelations = relations(upgrades, ({ one, many }) => ({
  shop_item: one(shopItems, {
    fields: [upgrades.effectItemId],
    references: [shopItems.id],
  }),
  levels: many(levels),
  requiredResearch: many(upgrade_required_research),
  requiredItems: many(upgrade_required_items),
}));

export const shopItemsRelations = relations(shopItems, ({ many }) => ({
  upgrades: many(upgrades),
  requiredResearch: many(items_required_research),
  research_required_items: many(research_required_items),
  item_id: many(items_required_items, {
    relationName: "required_item_id",
  }),
  requiredItems: many(items_required_items, {
    relationName: "item_id",
  }),
  upgrade_required_items: many(upgrade_required_items),
}));

export const levelsRelations = relations(levels, ({ one }) => ({
  upgrade: one(upgrades, {
    fields: [levels.upgrade_id],
    references: [upgrades.id],
  }),
}));

export const charactersRelations = relations(characters, ({ one }) => ({
  city: one(cities, {
    fields: [characters.city_id],
    references: [cities.id],
  }),
  element: one(elements, {
    fields: [characters.element_id],
    references: [elements.id],
  }),
}));

export const citiesRelations = relations(cities, ({ many }) => ({
  characters: many(characters),
}));

export const elementsRelations = relations(elements, ({ many }) => ({
  characters: many(characters),
}));

export const items_required_researchRelations = relations(
  items_required_research,
  ({ one }) => ({
    shop_item: one(shopItems, {
      fields: [items_required_research.item_id],
      references: [shopItems.id],
    }),
    research: one(research, {
      fields: [items_required_research.required_id],
      references: [research.id],
    }),
  }),
);

export const researchRelations = relations(research, ({ many }) => ({
  items_required_research: many(items_required_research),
  requiredResearch: many(research_required_research, {
    relationName: "research_id",
  }),
  research_id: many(research_required_research, {
    relationName: "required_research_id",
  }),
  upgrade_required_research: many(upgrade_required_research),
  requiredItems: many(research_required_items),
}));

export const research_required_researchRelations = relations(
  research_required_research,
  ({ one }) => ({
    research_required_id: one(research, {
      fields: [research_required_research.required_id],
      references: [research.id],
      relationName: "required_research_id",
    }),
    research_research_id: one(research, {
      fields: [research_required_research.research_id],
      references: [research.id],
      relationName: "research_id",
    }),
  }),
);

export const upgrade_required_researchRelations = relations(
  upgrade_required_research,
  ({ one }) => ({
    research: one(research, {
      fields: [upgrade_required_research.required_id],
      references: [research.id],
    }),
    upgrade: one(upgrades, {
      fields: [upgrade_required_research.upgrade_id],
      references: [upgrades.id],
    }),
  }),
);

export const research_required_itemsRelations = relations(
  research_required_items,
  ({ one }) => ({
    shop_item: one(shopItems, {
      fields: [research_required_items.required_id],
      references: [shopItems.id],
    }),
    research: one(research, {
      fields: [research_required_items.research_id],
      references: [research.id],
    }),
  }),
);

export const items_required_itemsRelations = relations(
  items_required_items,
  ({ one }) => ({
    shop_item_item_id: one(shopItems, {
      fields: [items_required_items.item_id],
      references: [shopItems.id],
      relationName: "item_id",
    }),
    shop_item_required_id: one(shopItems, {
      fields: [items_required_items.required_id],
      references: [shopItems.id],
      relationName: "required_item_id",
    }),
  }),
);

export const upgrade_required_itemsRelations = relations(
  upgrade_required_items,
  ({ one }) => ({
    shop_item: one(shopItems, {
      fields: [upgrade_required_items.required_id],
      references: [shopItems.id],
    }),
    upgrade: one(upgrades, {
      fields: [upgrade_required_items.upgrade_id],
      references: [upgrades.id],
    }),
  }),
);
