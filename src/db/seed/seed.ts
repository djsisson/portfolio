import { drizzle } from "drizzle-orm/postgres-js";
import postgres from "postgres";
import * as schema from "../schema";
import * as relations from "../relations";
import { genshinSeed } from "./genshin-seed";
import { asteroidSeed } from "./asteroid-seed";
import { loadEnvConfig } from "@next/env";

loadEnvConfig(process.cwd(), true);
const connectionString = process.env.DATABASE_URL;
const client = postgres(connectionString as string);
const db = drizzle(client, {
  schema: { ...schema, ...relations },
  logger: true,
});

export type Transaction = Parameters<Parameters<typeof db.transaction>[0]>[0];

const seedGenshin = async () => {
  try {
    await db.transaction(async (db) => {
      await genshinSeed(db);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const seedAsteroid = async () => {
  try {
    await db.transaction(async (db) => {
      await asteroidSeed(db);
    });
  } catch (e) {
    console.error(e);
    process.exit(1);
  }
};

const main = async () => {
  if (process.env.SEED !== "true") {
    console.log("Skipping seed");
    process.exit(0);
  }
  console.log("Seeding database...");
  // await seedGenshin();
  // await seedAsteroid();
  console.log("Seeding complete");
  process.exit(0);
};

main();
