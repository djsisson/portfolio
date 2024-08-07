import { pgTable, integer, text, unique } from "drizzle-orm/pg-core";

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
      elements_name_unique: unique("elements_name_unique").on(table.name),
      elements_colour_unique: unique("elements_colour_unique").on(table.colour),
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
    element_id: integer("element_id")
      .notNull()
      .references(() => elements.id),
    city_id: integer("city_id")
      .notNull()
      .references(() => cities.id),
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
      cities_name_unique: unique("cities_name_unique").on(table.name),
    };
  },
);
