import { genshinSeed } from "./genshin-seed";
import { asteroidSeed } from "./asteroid-seed";
import { db } from "../db";


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
