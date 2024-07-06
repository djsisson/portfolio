import { pgTable, unique, pgEnum, serial, text, foreignKey, integer } from "drizzle-orm/pg-core"


export const elements = pgTable("elements", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	colour: text("colour").notNull(),
},
(table) => {
	return {
		elements_name_unique: unique("elements_name_unique").on(table.name),
		elements_colour_unique: unique("elements_colour_unique").on(table.colour),
	}
});

export const characters = pgTable("characters", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
	description: text("description").notNull(),
	element_id: integer("element_id").references(() => elements.id),
	city_id: integer("city_id").references(() => cities.id),
},
(table) => {
	return {
		characters_name_unique: unique("characters_name_unique").on(table.name),
	}
});

export const cities = pgTable("cities", {
	id: serial("id").primaryKey().notNull(),
	name: text("name").notNull(),
},
(table) => {
	return {
		cities_name_unique: unique("cities_name_unique").on(table.name),
	}
});