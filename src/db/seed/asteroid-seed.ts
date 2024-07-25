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
} from "./../schema";
import { Transaction } from "./seed";

export const asteroidSeed = async (db: Transaction) => {
  const newShopItems = await db
    .insert(shopItems)
    .values([
      {
        name: "Click",
        cost: 0,
        maxQty: 1,
        multiplier: 1,
        baseValue: 1,
        critChance: 0,
        critDamage: 0.5,
      },
      {
        name: "Clone",
        cost: 5,
        maxQty: 10,
        multiplier: 2,
        baseValue: 0.5,
        critChance: 0,
        critDamage: 0,
      },
      {
        name: "Super Clone",
        cost: 20,
        maxQty: 10,
        multiplier: 3,
        baseValue: 1,
        critChance: 0.1,
        critDamage: 1,
      },
    ])
    .returning();
  await db.insert(items_required_items).values([
    {
      item_id: newShopItems.find((i) => i.name === "Super Clone")!.id,
      required_id: newShopItems.find((i) => i.name === "Clone")!.id,
      quantity: 10,
      description: "10 Clones Required",
    },
  ]);
  const researchItems = await db
    .insert(research)
    .values([
      {
        name: "Cloning",
        description: "Unlocks Clones",
        cost: 1,
      },
      {
        name: "Critcal Strike",
        description: "Unlocks Upgrading Click Damage",
        cost: 10,
      },
      {
        name: "Refining",
        description: "Further Unlocks Upgrading Click Damage",
        cost: 100,
      },
      {
        name: "Super Clones",
        description: "Unlocks Super Clones",
        cost: 1000,
      },
    ])
    .returning();
  await db.insert(research_required_research).values([
    {
      research_id: researchItems.find((i) => i.name === "Critcal Strike")!.id,
      required_id: researchItems.find((i) => i.name === "Cloning")!.id,
      description: "Cloning Research Required",
    },
    {
      research_id: researchItems.find((i) => i.name === "Refining")!.id,
      required_id: researchItems.find((i) => i.name === "Cloning")!.id,
      description: "Cloning Research Required",
    },
    {
      research_id: researchItems.find((i) => i.name === "Super Clones")!.id,
      required_id: researchItems.find((i) => i.name === "Critcal Strike")!.id,
      description: "Critcal Strike Research Required",
    },
    {
      research_id: researchItems.find((i) => i.name === "Super Clones")!.id,
      required_id: researchItems.find((i) => i.name === "Refining")!.id,
      description: "Refining Research Required",
    },
  ]);
  await db.insert(research_required_items).values([
    {
      research_id: researchItems.find((i) => i.name === "Critcal Strike")!.id,
      required_id: newShopItems.find((i) => i.name === "Clone")!.id,
      quantity: 2,
      description: "2 Clones Required",
    },
    {
      research_id: researchItems.find((i) => i.name === "Refining")!.id,
      required_id: newShopItems.find((i) => i.name === "Clone")!.id,
      quantity: 5,
      description: "5 Clones Required",
    },
    {
      research_id: researchItems.find((i) => i.name === "Super Clones")!.id,
      required_id: newShopItems.find((i) => i.name === "Clone")!.id,
      quantity: 10,
      description: "10 Clones Required",
    },
  ]);
  await db.insert(items_required_research).values([
    {
      item_id: newShopItems.find((i) => i.name === "Clone")!.id,
      required_id: researchItems.find((i) => i.name === "Cloning")!.id,
      description: "Cloning Research Required",
    },
    {
      item_id: newShopItems.find((i) => i.name === "Super Clone")!.id,
      required_id: researchItems.find((i) => i.name === "Super Clones")!.id,
      description: "Super Clones Research Required",
    },
  ]);
  const upgradeItems = await db
    .insert(upgrades)
    .values([
      {
        name: "Weapon",
        description: "Upgrades Click Damage",
        effectItemId: newShopItems.find((i) => i.name === "Click")!.id,
      },
      {
        name: "Clones",
        description: "Upgrades Clone Damage",
        effectItemId: newShopItems.find((i) => i.name === "Clone")!.id,
      },
      {
        name: "Crit Chance",
        description: "Click Damage Can Now Critically Hit",
        effectItemId: newShopItems.find((i) => i.name === "Click")!.id,
      },
      {
        name: "Refining",
        description: "Further Increase Click Damage",
        effectItemId: newShopItems.find((i) => i.name === "Click")!.id,
      },
      {
        name: "Super Clones",
        description: "Upgrades Super Clone Damage",
        effectItemId: newShopItems.find((i) => i.name === "Super Clone")!.id,
      },
    ])
    .returning();
  await db.insert(upgrade_required_research).values([
    {
      upgrade_id: upgradeItems.find((i) => i.name === "Clones")!.id,
      required_id: researchItems.find((i) => i.name === "Cloning")!.id,
      description: "Cloning Research Required",
    },
    {
      upgrade_id: upgradeItems.find((i) => i.name === "Crit Chance")!.id,
      required_id: researchItems.find((i) => i.name === "Critcal Strike")!.id,
      description: "Critcal Strike Research Required",
    },
    {
      upgrade_id: upgradeItems.find((i) => i.name === "Refining")!.id,
      required_id: researchItems.find((i) => i.name === "Refining")!.id,
      description: "Refining Research Required",
    },
    {
      upgrade_id: upgradeItems.find((i) => i.name === "Super Clones")!.id,
      required_id: researchItems.find((i) => i.name === "Super Clones")!.id,
      description: "Super Clones Research Required",
    },
  ]);
  await db.insert(levels).values([
    {
      level: 1,
      upgrade_id: upgradeItems.find((i) => i.name === "Weapon")!.id,
      cost: 5,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 2,
      upgrade_id: upgradeItems.find((i) => i.name === "Weapon")!.id,
      cost: 20,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 3,
      upgrade_id: upgradeItems.find((i) => i.name === "Weapon")!.id,
      cost: 50,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 1,
      upgrade_id: upgradeItems.find((i) => i.name === "Clones")!.id,
      cost: 10,
      baseValue: 0.5,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 2,
      upgrade_id: upgradeItems.find((i) => i.name === "Clones")!.id,
      cost: 50,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 3,
      upgrade_id: upgradeItems.find((i) => i.name === "Clones")!.id,
      cost: 100,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 1,
      upgrade_id: upgradeItems.find((i) => i.name === "Crit Chance")!.id,
      cost: 100,
      baseValue: 1,
      critChance: 0.1,
      critDamage: 0,
    },
    {
      level: 2,
      upgrade_id: upgradeItems.find((i) => i.name === "Crit Chance")!.id,
      cost: 250,
      baseValue: 1,
      critChance: 0,
      critDamage: 0.5,
    },
    {
      level: 3,
      upgrade_id: upgradeItems.find((i) => i.name === "Crit Chance")!.id,
      cost: 500,
      baseValue: 1,
      critChance: 0.1,
      critDamage: 0.5,
    },
    {
      level: 1,
      upgrade_id: upgradeItems.find((i) => i.name === "Refining")!.id,
      cost: 100,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 2,
      upgrade_id: upgradeItems.find((i) => i.name === "Refining")!.id,
      cost: 500,
      baseValue: 2,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 3,
      upgrade_id: upgradeItems.find((i) => i.name === "Refining")!.id,
      cost: 1000,
      baseValue: 2,
      critChance: 0,
      critDamage: 1,
    },
    {
      level: 1,
      upgrade_id: upgradeItems.find((i) => i.name === "Super Clones")!.id,
      cost: 250,
      baseValue: 1,
      critChance: 0.1,
      critDamage: 0,
    },
    {
      level: 2,
      upgrade_id: upgradeItems.find((i) => i.name === "Super Clones")!.id,
      cost: 1000,
      baseValue: 1,
      critChance: 0,
      critDamage: 0,
    },
    {
      level: 3,
      upgrade_id: upgradeItems.find((i) => i.name === "Super Clones")!.id,
      cost: 2500,
      baseValue: 1,
      critChance: 0.1,
      critDamage: 1,
    },
  ]);
  await db.insert(gamestate).values({
    playerName: "Traveller",
    theme: "aqua",
    currentScore: 0,
    totalClicks: 0,
    totalSpent: 0,
    currentAverageCps: 0,
    averageClickValue: 1,
    researched: [],
    upgrades: [],
    items: [{ ...newShopItems.find((i) => i.name === "Click")!, quantity: 1 }],
  });
};
