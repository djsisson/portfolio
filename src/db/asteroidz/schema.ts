import {
	bigint,
	integer,
	json,
	pgTable,
	primaryKey,
	real,
	text,
} from "drizzle-orm/pg-core";

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

type upgrade = { id: number; level: number };
type item = Omit<
	typeof shopItems.$inferSelect & { quantity: number },
	"required_research" | "required_item_id"
>;

export const gamestate = pgTable("gamestate", {
	id: integer("id").primaryKey().generatedAlwaysAsIdentity({
		name: "gamestats_id_seq",
		startWith: 1,
		increment: 1,
		minValue: 1,
		maxValue: 2147483647,
		cache: 1,
	}),
	playerName: text("playername").notNull(),
	theme: text("theme").notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	currentScore: bigint("currentscore", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalClicks: bigint("totalclicks", { mode: "number" }).notNull(),
	// You can use { mode: "bigint" } if numbers are exceeding js number limitations
	totalSpent: bigint("totalspent", { mode: "number" }).notNull(),
	currentAverageCps: real("currentaveragecps").notNull(),
	averageClickValue: real("averageclickvalue").notNull(),
	researched: integer("researched").array().notNull(),
	upgrades: json("upgrades").array().$type<upgrade[]>().notNull(),
	items: json("items").array().$type<item[]>().notNull(),
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
	upgrade_id: integer("upgrade_id")
		.notNull()
		.references(() => upgrades.id),
	cost: integer("cost").notNull(),
	baseValue: real("baseValue").notNull(),
	critChance: real("critChance").notNull(),
	critDamage: real("critDamage").notNull(),
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

export const items_required_research = pgTable(
	"items_required_research",
	{
		item_id: integer("item_id")
			.notNull()
			.references(() => shopItems.id),
		required_id: integer("required_id")
			.notNull()
			.references(() => research.id),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.item_id, table.required_id],
			name: "items_required_research_item_id_required_id_pk",
		}),
	],
);

export const research_required_research = pgTable(
	"research_required_research",
	{
		research_id: integer("research_id")
			.notNull()
			.references(() => research.id),
		required_id: integer("required_id")
			.notNull()
			.references(() => research.id),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.research_id, table.required_id],
			name: "research_required_research_research_id_required_id_pk",
		}),
	],
);

export const upgrade_required_research = pgTable(
	"upgrade_required_research",
	{
		upgrade_id: integer("upgrade_id")
			.notNull()
			.references(() => upgrades.id),
		required_id: integer("required_id")
			.notNull()
			.references(() => research.id),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.upgrade_id, table.required_id],
			name: "upgrade_required_research_upgrade_id_research_id_pk",
		}),
	],
);

export const research_required_items = pgTable(
	"research_required_items",
	{
		research_id: integer("research_id")
			.notNull()
			.references(() => research.id),
		required_id: integer("item_id")
			.notNull()
			.references(() => shopItems.id),
		quantity: integer("quantity").notNull(),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.research_id, table.required_id],
			name: "research_required_items_research_id_item_id_pk",
		}),
	],
);

export const items_required_items = pgTable(
	"items_required_items",
	{
		item_id: integer("item_id")
			.notNull()
			.references(() => shopItems.id),
		required_id: integer("required_id")
			.notNull()
			.references(() => shopItems.id),
		quantity: integer("quantity").notNull(),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.item_id, table.required_id],
			name: "items_required_items_item_id_required_id_pk",
		}),
	],
);

export const upgrade_required_items = pgTable(
	"upgrade_required_items",
	{
		upgrade_id: integer("upgrade_id")
			.notNull()
			.references(() => upgrades.id),
		required_id: integer("item_id")
			.notNull()
			.references(() => shopItems.id),
		quantity: integer("quantity").notNull(),
		description: text("description").notNull(),
	},
	(table) => [
		primaryKey({
			columns: [table.upgrade_id, table.required_id],
			name: "upgrade_required_items_upgrade_id_item_id_pk",
		}),
	],
);
