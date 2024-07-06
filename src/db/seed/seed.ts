import { db } from "../db";
import { characters, cities, elements } from "../migrations/schema";

export const seed = async () => {
    const element_result = await db.insert(elements).values([
        {
            name: "Anemo",
            colour: "74c2a8"
        },
        {
            name: "Cryo",
            colour: "9fd6e3"
        },
        {
            name: "Electro",
            colour: "af8ec1"
        },
        {
            name: "Hydro",
            colour: "4cc2f1"
        },
        {
            name: "Pyro",
            colour: "#ef7938"
        },
        {
            name: "Dendro",
            colour: "a5c83b"
        },
        {
            name: "Geo",
            colour: "fab632"
        },
    ]).returning();
    const city_result = await db.insert(cities).values([
        {
            name: "Liyue"
        },
        {
            name: "Inazuma"
        },
        {
            name: "Sumeru"
        },
        {
            name: "Mondstadt"
        },
        {
            name: "Fontaine"
        },
    ]).returning();

    const character_result = await db.insert(characters).values([
        {
            name: "Eula",
            description: "Eula is the captain of the Knights of Favonius. She is the most beautiful and elegant of the Knights of Favonius. She is also the most powerful of the Knights of Favonius.",
            element_id: element_result.find(e => e.name === "Cryo")?.id,
            city_id: city_result.find(c => c.name === "Mondstadt")?.id
        },
        ]).returning();}