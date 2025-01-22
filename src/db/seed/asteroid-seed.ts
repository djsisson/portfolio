import {
  items_required_items,
  items_required_research,
  research,
  research_required_items,
  research_required_research,
  shopItems,
  upgrades,
  upgrade_required_research,
  levels,
  gamestate,
} from "../asteroidz/schema";
import * as asteroidz from "../asteroidz/data";
import { Transaction } from "./seed";

export const asteroidSeed = async (db: Transaction) => {
  const newShopItems = await db
    .insert(shopItems)
    .values(asteroidz.shopItems)
    .returning();

  await db.insert(items_required_items).values(
    asteroidz.item_required_items.map((i) => ({
      ...i,
      item_id: newShopItems.find((s) => s.name === i.item)?.id!,
      required_id: newShopItems.find((s) => s.name === i.required)?.id!,
    })),
  );

  const researchItems = await db
    .insert(research)
    .values(asteroidz.research)
    .returning();

  await db.insert(research_required_research).values(
    asteroidz.research_required_research.map((r) => ({
      ...r,
      research_id: researchItems.find((i) => i.name === r.research)?.id!,
      required_id: researchItems.find((i) => i.name === r.required)?.id!,
    })),
  );

  await db.insert(research_required_items).values(
    asteroidz.research_required_items.map((r) => ({
      ...r,
      research_id: researchItems.find((i) => i.name === r.research)?.id!,
      required_id: newShopItems.find((i) => i.name === r.required)?.id!,
    })),
  );

  await db.insert(items_required_research).values(
    asteroidz.item_required_research.map((i) => ({
      ...i,
      item_id: newShopItems.find((s) => s.name === i.item)?.id!,
      required_id: researchItems.find((s) => s.name === i.required)?.id!,
    })),
  );

  const upgradeItems = await db
    .insert(upgrades)
    .values(
      asteroidz.upgrades.map((u) => ({
        ...u,
        effectItemId: newShopItems.find((i) => i.name === u.effectItem)?.id!,
      })),
    )
    .returning();

  await db.insert(upgrade_required_research).values(
    asteroidz.upgrade_required_research.map((u) => ({
      ...u,
      upgrade_id: upgradeItems.find((i) => i.name === u.upgrade)?.id!,
      required_id: researchItems.find((i) => i.name === u.required)?.id!,
    })),
  );

  await db.insert(levels).values(
    asteroidz.levels.map((l) => ({
      ...l,
      upgrade_id: upgradeItems.find((i) => i.name === l.upgrade_item)?.id!,
    })),
  );

  await db.insert(gamestate).values({
    ...asteroidz.gameState,
    upgrades: asteroidz.gameState.upgrades.map((u) => ({
      ...u,
      id: upgradeItems.find((i) => i.name === u.name)?.id!,
    })),
    researched: asteroidz.gameState.researched.map(
      (r) => researchItems.find((i) => i.name === r)?.id!,
    ),
    items: asteroidz.gameState.items.map((i) => ({
      ...i,
      id: newShopItems.find((x) => x.name === i.name)?.id!,
    })),
  });
};
