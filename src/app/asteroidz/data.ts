import "server-only";
import { db } from "@/db/db";

const upgrades_object = async () => {
  const result = await db.query.upgrades.findMany({
    with: {
      levels: {
        orderBy: (levels, { asc }) => [asc(levels.level)],
      },
      required_items: {
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
      required_items: {
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
  const result = await db.query.shop_items.findMany({
    with: {
      required_item_id: {
        columns: {
          item_id: false,
        },
      },
      required_research: {
        columns: {
          item_id: false,
        },
      },
    },
  });
  return result;
};

export const gameState = async () => {
  const result = await db.query.gamestate.findFirst();
  return result;
};

export const gameObject = async () => {
  const upgrades = await upgrades_object();
  const research = await research_object();
  const shop_items = await shop_items_object();

  return { upgrades, research, shop_items };
};
