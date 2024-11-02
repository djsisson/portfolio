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
  (table) => [
    unique("elements_name_unique").on(table.name),
    unique("elements_colour_unique").on(table.colour),
  ],
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
  (table) => [
    unique("characters_name_unique").on(table.name),
    unique("characters_city_id_cities_id_fk").on(table.city_id),
    unique("characters_element_id_elements_id_fk").on(table.element_id),
  ],
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
  (table) => [unique("cities_name_unique").on(table.name)],
);
