import {
  pgTable,
  unique,
  text,
  integer,
  numeric,
  primaryKey,
} from "drizzle-orm/pg-core";

export const characters = pgTable(
  "characters",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    name: text("name").notNull(),
    description: text("description").array().notNull(),
    element_id: integer("element_id").references(() => elements.id),
    city_id: integer("city_id").references(() => cities.id),
  },
  (table) => {
    return {
      characters_name_unique: unique("characters_name_unique").on(table.name),
    };
  },
);

export const cities = pgTable(
  "cities",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    name: text("name").notNull(),
  },
  (table) => {
    return {
      cities_name_unique: unique("cities_name_unique").on(table.name),
    };
  },
);

export const elements = pgTable(
  "elements",
  {
    id: integer("id")
      .primaryKey()
      .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
    name: text("name").notNull(),
    colour: text("colour").notNull(),
  },
  (table) => {
    return {
      elements_name_unique: unique("elements_name_unique").on(table.name),
      elements_colour_unique: unique("elements_colour_unique").on(table.colour),
    };
  },
);

export const upgrades = pgTable("upgrades", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  effectItemId: integer("effectItemId").references(() => shopItems.id),
});

export const levels = pgTable("levels", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  index: integer("index").notNull(),
  upgrade_id: integer("upgrade_id").references(() => upgrades.id),
  cost: integer("cost").notNull(),
  baseValue: numeric("baseValue").notNull(),
  critChance: numeric("critChance").notNull(),
  critDamage: numeric("critDamage").notNull(),
});

export const research = pgTable("research", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
  requiredToolTip: text("requiredToolTip").notNull(),
});

export const shopItems = pgTable("shop_items", {
  id: integer("id")
    .primaryKey()
    .generatedAlwaysAsIdentity({ startWith: 1, increment: 1 }),
  name: text("name").notNull(),
  cost: integer("cost").notNull(),
  requiredToolTip: text("requiredToolTip").notNull(),
  maxQty: integer("maxQty").notNull(),
  multiplier: numeric("multiplier").notNull(),
  baseValue: numeric("baseValue").notNull(),
  critChance: numeric("critChance").notNull(),
  critDamage: numeric("critDamage").notNull(),
});

export const upgradeRequiredItems = pgTable(
  "upgrade_required_items",
  {
    upgrade_id: integer("upgrade_id").references(() => upgrades.id),
    item_id: integer("item_id").references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.upgrade_id, table.item_id] }),
    };
  },
);

export const upgradeRequiredResearch = pgTable(
  "upgrade_required_research",
  {
    upgrade_id: integer("upgrade_id").references(() => upgrades.id),
    research_id: integer("research_id").references(() => research.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.upgrade_id, table.research_id] }),
    };
  },
);

export const researchRequiredItems = pgTable(
  "research_required_items",
  {
    research_id: integer("research_id").references(() => research.id),
    item_id: integer("item_id").references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.research_id, table.item_id] }),
    };
  },
);

export const researchRequiredResearch = pgTable(
  "research_required_research",
  {
    research_id: integer("research_id").references(() => research.id),
    required_id: integer("required_id").references(() => research.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.research_id, table.required_id] }),
    };
  },
);

export const itemsRequiredResearch = pgTable(
  "items_required_research",
  {
    item_id: integer("item_id").references(() => shopItems.id),
    required_id: integer("required_id").references(() => research.id),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.item_id, table.required_id] }),
    };
  },
);

export const itemsRequiredItems = pgTable(
  "items_required_items",
  {
    item_id: integer("item_id").references(() => shopItems.id),
    required_id: integer("required_id").references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
  },
  (table) => {
    return {
      pk: primaryKey({ columns: [table.item_id, table.required_id] }),
    };
  },
);
