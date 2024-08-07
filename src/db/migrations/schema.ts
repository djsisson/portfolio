import { sql } from "drizzle-orm";
import {
  pgTable,
  integer,
  text,
  bigint,
  real,
  unique,
  primaryKey,
  json,
  uuid,
  boolean,
  timestamp,
  index,
} from "drizzle-orm/pg-core";
import { users } from "../auth_schema";

export const gamestate = pgTable("gamestate", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "gamestats_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  playername: text("playername").notNull(),
  theme: text("theme").notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  currentscore: bigint("currentscore", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  totalclicks: bigint("totalclicks", { mode: "number" }).notNull(),
  // You can use { mode: "bigint" } if numbers are exceeding js number limitations
  totalspent: bigint("totalspent", { mode: "number" }).notNull(),
  currentaveragecps: real("currentaveragecps").notNull(),
  averageclickvalue: real("averageclickvalue").notNull(),
  researched: integer("researched").array().notNull(),
  // TODO: failed to parse database type 'json[]'
  upgrades: json("upgrades").array().notNull(),
  // TODO: failed to parse database type 'json[]'
  items: json("items").array().notNull(),
});

export const shopItems = pgTable("shop_items", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "shop_items_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  name: text("name").notNull(),
  cost: integer("cost").notNull(),
  maxQty: integer("maxQty").notNull(),
  multiplier: real("multiplier").notNull(),
  baseValue: real("baseValue").notNull(),
  critChance: real("critChance").notNull(),
  critDamage: real("critDamage").notNull(),
});

export const research = pgTable("research", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "research_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  cost: integer("cost").notNull(),
});

export const upgrades = pgTable("upgrades", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "upgrades_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  name: text("name").notNull(),
  description: text("description").notNull(),
  effectItemId: integer("effectItemId")
    .notNull()
    .references(() => shopItems.id),
});

export const levels = pgTable("levels", {
  id: integer("id").primaryKey().generatedAlwaysAsIdentity({
    name: "levels_id_seq",
    startWith: 1,
    increment: 1,
    minValue: 1,
    maxValue: 2147483647,
    cache: 1,
  }),
  level: integer("level").notNull(),
  upgradeId: integer("upgrade_id")
    .notNull()
    .references(() => upgrades.id),
  cost: integer("cost").notNull(),
  baseValue: real("baseValue").notNull(),
  critChance: real("critChance").notNull(),
  critDamage: real("critDamage").notNull(),
});

export const elements = pgTable(
  "elements",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({
      name: "elements_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: text("name").notNull(),
    colour: text("colour").notNull(),
  },
  (table) => {
    return {
      elementsNameUnique: unique("elements_name_unique").on(table.name),
      elementsColourUnique: unique("elements_colour_unique").on(table.colour),
    };
  },
);

export const characters = pgTable(
  "characters",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({
      name: "characters_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: text("name").notNull(),
    description: text("description").array().notNull(),
    elementId: integer("element_id")
      .notNull()
      .references(() => elements.id),
    cityId: integer("city_id")
      .notNull()
      .references(() => cities.id),
  },
  (table) => {
    return {
      charactersNameUnique: unique("characters_name_unique").on(table.name),
    };
  },
);

export const cities = pgTable(
  "cities",
  {
    id: integer("id").primaryKey().generatedAlwaysAsIdentity({
      name: "cities_id_seq",
      startWith: 1,
      increment: 1,
      minValue: 1,
      maxValue: 2147483647,
      cache: 1,
    }),
    name: text("name").notNull(),
  },
  (table) => {
    return {
      citiesNameUnique: unique("cities_name_unique").on(table.name),
    };
  },
);

export const itemsRequiredResearch = pgTable(
  "items_required_research",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => shopItems.id),
    requiredId: integer("required_id")
      .notNull()
      .references(() => research.id),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      itemsRequiredResearchItemIdRequiredIdPk: primaryKey({
        columns: [table.itemId, table.requiredId],
        name: "items_required_research_item_id_required_id_pk",
      }),
    };
  },
);

export const researchRequiredResearch = pgTable(
  "research_required_research",
  {
    researchId: integer("research_id")
      .notNull()
      .references(() => research.id),
    requiredId: integer("required_id")
      .notNull()
      .references(() => research.id),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      researchRequiredResearchResearchIdRequiredIdPk: primaryKey({
        columns: [table.researchId, table.requiredId],
        name: "research_required_research_research_id_required_id_pk",
      }),
    };
  },
);

export const upgradeRequiredResearch = pgTable(
  "upgrade_required_research",
  {
    upgradeId: integer("upgrade_id")
      .notNull()
      .references(() => upgrades.id),
    requiredId: integer("required_id")
      .notNull()
      .references(() => research.id),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      upgradeRequiredResearchPkey: primaryKey({
        columns: [table.upgradeId, table.requiredId],
        name: "upgrade_required_research_pkey",
      }),
    };
  },
);

export const itemsRequiredItems = pgTable(
  "items_required_items",
  {
    itemId: integer("item_id")
      .notNull()
      .references(() => shopItems.id),
    requiredId: integer("required_id")
      .notNull()
      .references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      itemsRequiredItemsItemIdRequiredIdPk: primaryKey({
        columns: [table.itemId, table.requiredId],
        name: "items_required_items_item_id_required_id_pk",
      }),
    };
  },
);

export const researchRequiredItems = pgTable(
  "research_required_items",
  {
    researchId: integer("research_id")
      .notNull()
      .references(() => research.id),
    itemId: integer("item_id")
      .notNull()
      .references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      researchRequiredItemsResearchIdItemIdPk: primaryKey({
        columns: [table.researchId, table.itemId],
        name: "research_required_items_research_id_item_id_pk",
      }),
    };
  },
);

export const upgradeRequiredItems = pgTable(
  "upgrade_required_items",
  {
    upgradeId: integer("upgrade_id")
      .notNull()
      .references(() => upgrades.id),
    itemId: integer("item_id")
      .notNull()
      .references(() => shopItems.id),
    quantity: integer("quantity").notNull(),
    description: text("description").notNull(),
  },
  (table) => {
    return {
      upgradeRequiredItemsUpgradeIdItemIdPk: primaryKey({
        columns: [table.upgradeId, table.itemId],
        name: "upgrade_required_items_upgrade_id_item_id_pk",
      }),
    };
  },
);

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
      .references(() => users.id),
    createdAt: timestamp("created_at", { withTimezone: true })
      .notNull()
      .default(sql`now()`),
  },
  (table) => {
    return {
      userIdx: index("todos_user_id_idx").using("btree", table.userId),
    };
  },
);
