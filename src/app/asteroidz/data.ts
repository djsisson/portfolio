import "server-only";
import { db } from "@/db/db";

const upgrades_object = async () => {
  const result = await db.query.upgrades.findMany({
    with: {
      levels: {
        orderBy: (levels, { asc }) => [asc(levels.level)],
      },
      requiredItems: {
        columns: {
          upgrade_id: false,
        },
      },
      required_research: {
        columns: {
          upgrade_id: false,
        },
      },
    },
  });
  return result;
};

const research_object = async () => {
  const result = await db.query.research.findMany({
    with: {
      requiredItems: {
        columns: {
          research_id: false,
        },
      },
      required_research_id: {
        columns: {
          research_id: false,
        },
      },
    },
  });
  return result;
};

const shop_items_object = async () => {
  const result = await db.query.shopItems.findMany({
    with: {
      requiredItemId: {
        columns: {
          item_id: false,
        },
      },
      requiredResearch: {
        columns: {
          item_id: false,
        },
      },
    },
  });
  return result;
};

export const gameStateDB = async () => {
  const result = await db.query.gamestate.findFirst();
  return result!;
};

export const gameObjectDB = async () => {
  const upgrades = await upgrades_object();
  const research = await research_object();
  const shopItems = await shop_items_object();

  return { upgrades, research, shopItems }!;
};
