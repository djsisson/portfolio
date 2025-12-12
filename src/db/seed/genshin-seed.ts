import * as genshin from "../genshin/data";
import { characters, cities, elements } from "../genshin/schema";
import type { Transaction } from "./seed";

export const genshinSeed = async (db: Transaction) => {
	await db.delete(characters).execute();
	await db.delete(cities).execute();
	await db.delete(elements).execute();

	const element_result = await db
		.insert(elements)
		.values(genshin.elements)
		.returning();

	const city_result = await db
		.insert(cities)
		.values(genshin.cities)
		.returning();

	await db
		.insert(characters)
		.values(
			genshin.characters.map((c) => ({
				...c,
				element_id: element_result.find((e) => e.name === c.element_name)?.id || 0,
				city_id: city_result.find((e) => e.name === c.city_name)?.id || 0,
			})),
		)
		.returning();
};
