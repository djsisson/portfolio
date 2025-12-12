export const shopItems = [
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
];

export const research = [
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
];

export const upgrades = [
  {
    name: "Weapon",
    description: "Upgrades Click Damage",
    effectItem: "Click",
  },
  {
    name: "Clones",
    description: "Upgrades Clone Damage",
    effectItem: "Clone",
  },
  {
    name: "Crit Chance",
    description: "Click Damage Can Now Critically Hit",
    effectItem: "Click",
  },
  {
    name: "Refining",
    description: "Further Increase Click Damage",
    effectItem: "Click",
  },
  {
    name: "Super Clones",
    description: "Upgrades Super Clone Damage",
    effectItem: "Super Clone",
  },
];

export const levels = [
  {
    level: 1,
    upgrade_item: "Weapon",
    cost: 5,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 2,
    upgrade_item: "Weapon",
    cost: 20,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 3,
    upgrade_item: "Weapon",
    cost: 50,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 1,
    upgrade_item: "Clones",
    cost: 10,
    baseValue: 0.5,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 2,
    upgrade_item: "Clones",
    cost: 50,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 3,
    upgrade_item: "Clones",
    cost: 100,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 1,
    upgrade_item: "Crit Chance",
    cost: 100,
    baseValue: 1,
    critChance: 0.1,
    critDamage: 0,
  },
  {
    level: 2,
    upgrade_item: "Crit Chance",
    cost: 250,
    baseValue: 1,
    critChance: 0,
    critDamage: 0.5,
  },
  {
    level: 3,
    upgrade_item: "Crit Chance",
    cost: 500,
    baseValue: 1,
    critChance: 0.1,
    critDamage: 0.5,
  },
  {
    level: 1,
    upgrade_item: "Refining",
    cost: 100,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 2,
    upgrade_item: "Refining",
    cost: 500,
    baseValue: 2,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 3,
    upgrade_item: "Refining",
    cost: 1000,
    baseValue: 2,
    critChance: 0,
    critDamage: 1,
  },
  {
    level: 1,
    upgrade_item: "Super Clones",
    cost: 250,
    baseValue: 1,
    critChance: 0.1,
    critDamage: 0,
  },
  {
    level: 2,
    upgrade_item: "Super Clones",
    cost: 1000,
    baseValue: 1,
    critChance: 0,
    critDamage: 0,
  },
  {
    level: 3,
    upgrade_item: "Super Clones",
    cost: 2500,
    baseValue: 1,
    critChance: 0.1,
    critDamage: 1,
  },
];

export const item_required_items = [
  {
    item: "Super Clone",
    required: "Clone",
    quantity: 10,
    description: "10 Clones Required",
  },
];

export const item_required_research = [
  {
    item: "Clone",
    required: "Cloning",
    description: "Cloning Research Required",
  },
  {
    item: "Super Clone",
    required: "Super Clones",
    description: "Super Clones Research Required",
  },
];

export const research_required_research = [
  {
    research: "Critcal Strike",
    required: "Cloning",
    description: "Cloning Research Required",
  },
  {
    research: "Refining",
    required: "Cloning",
    description: "Cloning Research Required",
  },
  {
    research: "Super Clones",
    required: "Critcal Strike",
    description: "Critcal Strike Research Required",
  },
  {
    research: "Super Clones",
    required: "Refining",
    description: "Refining Research Required",
  },
];

export const research_required_items = [
  {
    research: "Critcal Strike",
    required: "Clone",
    quantity: 2,
    description: "2 Clones Required",
  },
  {
    research: "Refining",
    required: "Clone",
    quantity: 5,
    description: "5 Clones Required",
  },
  {
    research: "Super Clones",
    required: "Clone",
    quantity: 10,
    description: "10 Clones Required",
  },
];

export const upgrade_required_items: {
  upgrade: string;
  required: string;
  quantity: number;
  description: string;
}[] = [];

export const upgrade_required_research = [
  {
    upgrade: "Clones",
    required: "Cloning",
    description: "Cloning Research Required",
  },
  {
    upgrade: "Crit Chance",
    required: "Critcal Strike",
    description: "Critcal Strike Research Required",
  },
  {
    upgrade: "Refining",
    required: "Refining",
    description: "Refining Research Required",
  },
  {
    upgrade: "Super Clones",
    required: "Super Clones",
    description: "Super Clones Research Required",
  },
];

export const gameState = {
  playerName: "Traveller",
  theme: "aqua",
  currentScore: 0,
  totalClicks: 0,
  totalSpent: 0,
  currentAverageCps: 0,
  averageClickValue: 1,
  researched: [] as string[],
  upgrades: [] as {name: string; level: number}[],
  items: [{ ...(shopItems[0]), quantity: 1 }],
};
