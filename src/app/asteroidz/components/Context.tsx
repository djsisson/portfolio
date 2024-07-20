import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
} from "react";
import { gameStateDB, gameObjectDB } from "../data";

const _gameState = await gameStateDB();
const _gameObject = await gameObjectDB();

enum gameStateActionType {
  CLICK = "click",
  ADDCPS = "addCps",
  BUYRESEARCH = "buyResearch",
  BUYUPGRADE = "buyUpgrade",
  BUYITEM = "buyItem",
  UPDATEAVERAGE = "updateAverage",
  CHANGETHEME = "changeTheme",
  CHANGENAME = "changeName",
}

type gameAction =
  | {
      type: gameStateActionType.CLICK;
      value: number;
    }
  | {
      type: gameStateActionType.ADDCPS;
      value: number;
    }
  | {
      type: gameStateActionType.BUYRESEARCH;
      value: number;
    }
  | {
      type: gameStateActionType.BUYUPGRADE;
      value: number;
    }
  | {
      type: gameStateActionType.BUYITEM;
      value: number;
    }
  | {
      type: gameStateActionType.UPDATEAVERAGE;
      value: number;
    }
  | {
      type: gameStateActionType.CHANGETHEME;
      value: string;
    }
  | {
      type: gameStateActionType.CHANGENAME;
      value: string;
    };

type stats = {
  baseValue: number;
  critChance: number;
  critDamage: number;
};

const gameStateContext = createContext(_gameState);
const gameStateDispatchContext = createContext({} as Dispatch<gameAction>);

export const GameStateProvider = ({
  children,
}: {
  children: React.ReactNode;
}) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, _gameState, () => {
    const localState = localStorage.getItem("Asteroidz");
    return localState ? JSON.parse(localState) : _gameState;
  }) as [typeof _gameState, Dispatch<gameAction>];

  useEffect(() => {
    localStorage.setItem("Asteroidz", JSON.stringify(gameState));
  }, [gameState]);

  return (
    <gameStateContext.Provider value={gameState}>
      <gameStateDispatchContext.Provider value={dispatch}>
        {children}
      </gameStateDispatchContext.Provider>
    </gameStateContext.Provider>
  );
};

export const useGameState = () => {
  return useContext(gameStateContext);
};

export const useGameStateDispatch = () => {
  return useContext(gameStateDispatchContext);
};

const buyItems = (
  items = [] as (typeof _gameObject)["research"][number]["requiredItems"],
  inven = [] as (typeof _gameState)["items"],
) => {
  items.forEach((item) => {
    const itemtoremove = inven.findIndex((x) => x.id == item.required_id);
    const newInvenItem = { ...inven[itemtoremove] };
    newInvenItem.quantity -= item.quantity;
    inven[itemtoremove] = { ...newInvenItem };
  });
};

const upgradeItem = (
  item: (typeof _gameState)["items"][number],
  stats: stats,
) => {
  item.baseValue += stats.baseValue;
  item.critChance += stats.critChance;
  item.critDamage += stats.critDamage;
};

export const averageDamage = (stats: stats) => {
  return (
    stats.baseValue * stats.critChance * stats.critDamage + stats.baseValue
  );
};
export const calcdamage = (stats: stats) => {
  let totaldamage = stats.baseValue;
  let crit = false;
  if (Math.random() < stats.critChance) {
    totaldamage = totaldamage * (stats.critDamage + 1);
    crit = true;
  }
  return { totaldamage, crit };
};

const gameStateReducer = (
  state: Awaited<typeof _gameState>,
  action: gameAction,
): Awaited<typeof _gameState> => {
  const inventory = state.items;
  const researched = state.researched;
  const upgrades = state.upgrades;

  switch (action.type) {
    case "click": {
      return {
        ...state,
        totalClicks: state.totalClicks + 1,
        currentScore: state.currentScore + action.value,
      };
    }

    case "addCps": {
      return {
        ...state,
        currentScore: state.currentScore + action.value,
      };
    }

    case "buyResearch": {
      const updatedInventory = [...inventory];
      const researchIndex = _gameObject.research.find((research) => research.id === action.value)!;
      buyItems(researchIndex.requiredItems, updatedInventory);
      return {
        ...state,
        researched: [...researched, action.value],
        currentScore: state.currentScore - researchIndex.cost,
        totalSpent: state.totalSpent + researchIndex.cost,
        items: [...updatedInventory],
      };
    }

    case "buyUpgrade": {
      const updatedUpgrades = [...upgrades];
      const updatedInventory = [...inventory];
      const upgrade = _gameObject.upgrades.find((upgrade) => upgrade.id === action.value)!;
      const upgradeIndex = updatedUpgrades.findIndex(
        (upgrade) => upgrade.id === action.value,
      );
      if (upgradeIndex !== -1) {
        const updatedUpgrade = { ...updatedUpgrades[upgradeIndex] };
        updatedUpgrade.level++;
        updatedUpgrades[upgradeIndex] = updatedUpgrade;
      } else {
        updatedUpgrades.push({ id: action.value, level: 1 });
      }
      const currentUpgrade = updatedUpgrades.find(
        (upgrade) => upgrade.id === action.value,
      )!;
      const itemIndex = updatedInventory.findIndex((item) => item.id === upgrade.effectItemId);
      if (itemIndex !== -1) {
        const updatedInventoryItem = { ...updatedInventory[itemIndex] };
        upgradeItem(
          updatedInventoryItem,
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!,
        );
        updatedInventory[itemIndex] = updatedInventoryItem;
      } else {
        const { requiredItemId, requiredResearch, ...newInventoryItem } =
          _gameObject.shopItems.find((item) => item.id === upgrade.effectItemId)!;
        upgradeItem(
          { ...newInventoryItem, quantity: 0 },
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!,
        );
        updatedInventory.push({ ...newInventoryItem, quantity: 0 });
      }
      const clickStats = updatedInventory.find((item) => item.name === "Click")!;
      return {
        ...state,
        currentScore:
          state.currentScore -
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!
            .cost,
        totalSpent:
          state.totalSpent +
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!
            .cost,
        averageClickValue: Math.floor(averageDamage(clickStats) * 100) / 100,
        upgrades: [...updatedUpgrades],
        items: [...updatedInventory],
      };
    }

    case "buyItem": {
      const updatedInventory = [...inventory];
      const item = _gameObject.shopItems.find((item) => item.id === action.value)!;
      let quantity = 1;
      buyItems(item.requiredItemId, updatedInventory);
      const itemIndex = updatedInventory.findIndex((item) => item.id === action.value);
      if (itemIndex !== -1) {
        const updatedInventoryItem = { ...updatedInventory[itemIndex] };
        updatedInventoryItem.quantity++;
        quantity = updatedInventoryItem.quantity;
        updatedInventory[itemIndex] = updatedInventoryItem;
      } else {
        const { requiredItemId, requiredResearch, ...rest } = item;
        updatedInventory.push({
          ...rest,
          quantity: 1,
        });
      }
      const cost = item.cost * Math.pow(item.multiplier, quantity);
      return {
        ...state,
        currentScore: state.currentScore - cost,
        totalSpent: state.totalSpent + cost,
        items: [...updatedInventory],
      };
    }

    case "updateAverage": {
      return {
        ...state,
        currentAverageCps: Math.floor(action.value * 100) / 100,
      };
    }

    case "changeTheme": {
      return { ...state, theme: action.value };
    }

    case "changeName": {
      return { ...state, playerName: action.value };
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
};
