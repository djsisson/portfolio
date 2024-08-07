import { relations } from "drizzle-orm/relations";
import { cities, characters, elements } from "./schema";

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
