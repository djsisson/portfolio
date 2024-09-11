import { genshinSeed } from "./genshin-seed";
import { asteroidSeed } from "./asteroid-seed";
import { forumSeed } from "./forum-seed";
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

const seedForum = async () => {
  try {
    await db.transaction(async (db) => {
      await forumSeed(db);
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
  // await seedForum();
  console.log("Seeding complete");
  process.exit(0);
};

main();
