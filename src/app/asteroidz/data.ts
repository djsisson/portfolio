import * as asteroidz from "@/db/asteroidz/data";

const upgrades = asteroidz.upgrades.map((u) => ({
  ...u,
  levels: asteroidz.levels.filter((l) => l.upgrade_item === u.name),
  requiredItems: asteroidz.upgrade_required_items.filter(
    (i) => i.upgrade === u.name,
  ),
  requiredResearch: asteroidz.upgrade_required_research.filter(
    (r) => r.upgrade === u.name,
  ),
}));

const research = asteroidz.research.map((r) => ({
  ...r,
  requiredItems: asteroidz.research_required_items.filter(
    (i) => i.research === r.name,
  ),
  requiredResearch: asteroidz.research_required_research.filter(
    (e) => e.research === r.name,
  ),
}));

const shopItems = asteroidz.shopItems.map((i) => ({
  ...i,
  requiredItems: asteroidz.item_required_items.filter((r) => r.item === i.name),
  requiredResearch: asteroidz.item_required_research.filter(
    (r) => r.item === i.name,
  ),
}));

export const gameObject = { upgrades, research, shopItems }!;
export const gameState = { ...asteroidz.gameState };
