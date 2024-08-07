"use client";

import React, {
  createContext,
  useContext,
  useReducer,
  useEffect,
  Dispatch,
  useState,
} from "react";
import { gameObjectDB, gameStateDB } from "../data";

export enum gameStateActionType {
  CLICK = "click",
  ADDCPS = "addCps",
  BUYRESEARCH = "buyResearch",
  BUYUPGRADE = "buyUpgrade",
  BUYITEM = "buyItem",
  UPDATEAVERAGE = "updateAverage",
  CHANGETHEME = "changeTheme",
  CHANGENAME = "changeName",
  LOAD_GAME = "loadGame",
  NEW_GAME = "newGame",
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
      type: gameStateActionType.CHANGETHEME;
      value: string;
    }
  | {
      type: gameStateActionType.CHANGENAME;
      value: string;
    }
  | {
      type: gameStateActionType.LOAD_GAME;
      payload: Awaited<ReturnType<typeof gameStateDB>>;
    }
  | {
      type: gameStateActionType.NEW_GAME;
      payload: Awaited<ReturnType<typeof gameStateDB>>;
    };

export type stats = {
  baseValue: number;
  critChance: number;
  critDamage: number;
};

const gameStateContext = createContext(
  {} as Awaited<ReturnType<typeof gameStateDB>>,
);
const gameStateDispatchContext = createContext({} as Dispatch<gameAction>);
const gameObjectContext = createContext(
  {} as Readonly<Awaited<ReturnType<typeof gameObjectDB>>>,
);

let g_GameObject: Awaited<ReturnType<typeof gameObjectDB>>;
export const GameStateProvider = ({
  children,
  _gameState,
  _gameObject,
}: {
  children: React.ReactNode;
  _gameState: Awaited<ReturnType<typeof gameStateDB>>;
  _gameObject: Awaited<ReturnType<typeof gameObjectDB>>;
}) => {
  const [gameState, dispatch] = useReducer(gameStateReducer, _gameState) as [
    typeof _gameState,
    Dispatch<gameAction>,
  ];
  const [gameObject, setGameObject] = useState(_gameObject);

  useEffect(() => {
    const localState = localStorage.getItem("Asteroidz");

    if (!localState) {
      const getGameState = async () => {
        dispatch({ type: gameStateActionType.LOAD_GAME, payload: _gameState });
      };
      getGameState();
    } else {
      dispatch({
        type: gameStateActionType.LOAD_GAME,
        payload: JSON.parse(localState) as Awaited<
          ReturnType<typeof gameStateDB>
        >,
      });
    }
  }, [_gameState]);

  useEffect(() => {
    localStorage.setItem("Asteroidz", JSON.stringify(gameState));
  }, [gameState]);

  useEffect(() => {
    setGameObject(_gameObject);
    g_GameObject = _gameObject;
  }, [_gameObject]);

  return (
    <gameStateContext.Provider value={gameState}>
      <gameStateDispatchContext.Provider value={dispatch}>
        <gameObjectContext.Provider value={gameObject}>
          {children}
        </gameObjectContext.Provider>
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

export const useGameObject = () => {
  return useContext(gameObjectContext);
};

const buyItems = (
  items = [] as Awaited<
    ReturnType<typeof gameObjectDB>
  >["research"][number]["requiredItems"],
  inven = [] as Awaited<ReturnType<typeof gameStateDB>>["items"],
) => {
  items.forEach((item) => {
    const itemtoremove = inven.findIndex((x) => x.id == item.required_id);
    const newInvenItem = { ...inven[itemtoremove] };
    newInvenItem.quantity -= item.quantity;
    inven[itemtoremove] = { ...newInvenItem };
  });
};

const upgradeItem = (
  item: Awaited<ReturnType<typeof gameStateDB>>["items"][number],
  stats: stats,
) => {
  item.baseValue += stats.baseValue;
  item.critChance += stats.critChance;
  item.critDamage += stats.critDamage;
};

const averageDamage = (stats: stats) => {
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

const updateAverage = (
  inven = [] as Awaited<ReturnType<typeof gameStateDB>>["items"],
): number => {
  const newAverage = [] as stats[];
  inven.forEach((x) => {
    const stats = {
      baseValue: x.baseValue,
      critChance: x.critChance,
      critDamage: x.critDamage,
    };
    if (x.name != "Click") {
      for (let i = 0; i < x.quantity; i++) {
        newAverage.push(stats);
      }
    }
  });
  return newAverage.reduce((i, x) => i + averageDamage(x), 0);
};

const gameStateReducer = (
  state: Awaited<ReturnType<typeof gameStateDB>>,
  action: gameAction,
): Awaited<ReturnType<typeof gameStateDB>> => {
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
      const researchIndex = g_GameObject.research.find(
        (research) => research.id === action.value,
      )!;
      buyItems(researchIndex.requiredItems, updatedInventory);
      const newAverage = updateAverage(updatedInventory);
      return {
        ...state,
        researched: [...researched, action.value],
        currentScore: state.currentScore - researchIndex.cost,
        currentAverageCps: Math.floor(newAverage * 100) / 100,
        totalSpent: state.totalSpent + researchIndex.cost,
        items: [...updatedInventory],
      };
    }

    case "buyUpgrade": {
      const updatedUpgrades = [...upgrades];
      const updatedInventory = [...inventory];
      const upgrade = g_GameObject.upgrades.find(
        (upgrade) => upgrade.id === action.value,
      )!;
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
      const itemIndex = updatedInventory.findIndex(
        (item) => item.id === upgrade.effectItemId,
      );
      if (itemIndex !== -1) {
        const updatedInventoryItem = { ...updatedInventory[itemIndex] };
        upgradeItem(
          updatedInventoryItem,
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!,
        );
        updatedInventory[itemIndex] = updatedInventoryItem;
      } else {
        const { requiredItems, requiredResearch, ...newInventoryItem } =
          g_GameObject.shopItems.find(
            (item) => item.id === upgrade.effectItemId,
          )!;
        upgradeItem(
          { ...newInventoryItem, quantity: 0 },
          upgrade.levels.find((level) => level.level === currentUpgrade.level)!,
        );
        updatedInventory.push({ ...newInventoryItem, quantity: 0 });
      }
      const clickStats = updatedInventory.find(
        (item) => item.name === "Click",
      )!;
      const newAverage = updateAverage(updatedInventory);
      return {
        ...state,
        currentAverageCps: Math.floor(newAverage * 100) / 100,
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
      const item = g_GameObject.shopItems.find(
        (item) => item.id === action.value,
      )!;
      let quantity = 1;
      buyItems(item.requiredItems, updatedInventory);
      const itemIndex = updatedInventory.findIndex(
        (item) => item.id === action.value,
      );
      if (itemIndex !== -1) {
        const updatedInventoryItem = { ...updatedInventory[itemIndex] };

        updatedInventoryItem.quantity++;
        quantity = updatedInventoryItem.quantity;
        updatedInventory[itemIndex] = updatedInventoryItem;
      } else {
        const { requiredItems, requiredResearch, ...rest } = item;
        updatedInventory.push({
          ...rest,
          quantity: 1,
        });
      }
      const cost = item.cost * Math.pow(item.multiplier, quantity - 1);
      const newAverage = updateAverage(updatedInventory);
      return {
        ...state,
        currentAverageCps: Math.floor(newAverage * 100) / 100,
        currentScore: state.currentScore - cost,
        totalSpent: state.totalSpent + cost,
        items: [...updatedInventory],
      };
    }

    case "changeTheme": {
      return { ...state, theme: action.value };
    }

    case "changeName": {
      return { ...state, playerName: action.value };
    }

    case "loadGame": {
      return action.payload;
    }

    case "newGame": {
      return action.payload;
    }

    default: {
      throw new Error(`Unknown action: ${action.type}`);
    }
  }
};
