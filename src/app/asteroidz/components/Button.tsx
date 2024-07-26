"use client";
import Tooltip from "./Tooltip";
import {
  useGameState,
  useGameStateDispatch,
  useGameObject,
  gameStateActionType,
} from "./Context";
import { useEffect, useState, useId } from "react";

enum containerType {
  Inventory = "Inventory",
  Research = "Research",
  Upgrades = "Upgrades",
  Shop = "Shop",
}

const Button = ({ type, id }: { type: containerType; id: number }) => {
  const dispatch = useGameStateDispatch();
  const score = useGameState().currentScore;
  const research = useGameState().researched;
  const upgrades = useGameState().upgrades;
  const inven = useGameState().items;
  const [completed, setCompleted] = useState(false);
  const [canBuy, setCanBuy] = useState(false);
  const [nextLevel, setNextLevel] = useState(1);
  const [quantity, setQuantity] = useState(0);
  const [displayText, setDisplayText] = useState("");
  const [tooltipText, setToolTipText] = useState([] as string[]);
  const buttonLabel = useId();
  const _gameObjects = useGameObject();
  type Research = (typeof _gameObjects)["research"][number];
  type Upgrade = (typeof _gameObjects)["upgrades"][number];
  type ShopItem = (typeof _gameObjects)["shopItems"][number];

  useEffect(() => {
    let textToDisplay = "";
    let toolTip = [];
    switch (type) {
      case "Research": {
        const x = _gameObjects.research.find((x) => x.id == id)!;
        if (completed) {
          textToDisplay = `${x.name} Research Completed`;
          toolTip = [`${x.name} Completed`];
        } else {
          textToDisplay = `${x.name} Research Cost:${x.cost}`;
          toolTip = [
            `${x.name}`,
            `${x.description} Cost:${x.cost}`,
            `${x.requiredItems.map((x) => x.description).join(", ")}`,
          ];
        }
        break;
      }
      case "Upgrades": {
        const x = _gameObjects.upgrades.find((x) => x.id == id)!;
        if (completed) {
          textToDisplay = `${x.name} Upgrade Completed`;
          toolTip = [`${x.name} Completed`];
        } else {
          textToDisplay = `${x.name} (${nextLevel}) Cost: ${
            x.levels.find((x) => x.level == nextLevel)?.cost || 0
          }`;
          toolTip = [
            `${x.name} Upgrade`,
            `${x.description} Cost: ${x.levels.find((x) => x.level == nextLevel)?.cost || 0} `,
          ];
        }
        break;
      }
      case "Shop": {
        const x = _gameObjects.shopItems.find((x) => x.id == id)!;
        if (quantity == x.maxQty) {
          textToDisplay = `${x.name} Max: ${quantity}`;
          toolTip = [`${x.name} Qty: ${quantity}`];
        } else {
          textToDisplay = `${x.name} (${quantity}) Cost: ${
            x.cost * Math.pow(x.multiplier, quantity)
          }`;
          toolTip = [
            `${x.name}`,
            `Cost: ${x.cost * Math.pow(x.multiplier, quantity)}`,
            `${x.requiredItems.map((x) => x.description).join(", ")}`,
          ];
        }
        break;
      }
      case "Inventory": {
        const x = inven.find((x) => x.id == id)!;
        textToDisplay = `${x.name} Qty: ${quantity}`;
        toolTip = [`${x.name} Qty: ${quantity}`];
        break;
      }
      default: {
        return;
      }
    }
    setDisplayText(textToDisplay);
    setToolTipText(toolTip);
  }, [type, id, completed, nextLevel, quantity, inven, _gameObjects]);

  useEffect(() => {
    if (completed) return;
    let canBuy = true;
    let calcCost = 0;

    const hasItems = (x: Research | Upgrade | ShopItem) => {
      let canBuy = true;
      x.requiredItems.forEach((item) => {
        let invenItem = inven.find((x) => x.id == item.required_id);
        if (invenItem ? invenItem.quantity < item.quantity : true) {
          canBuy = false;
        }
      });
      return canBuy;
    };

    switch (type) {
      case "Research": {
        const x = _gameObjects.research.find((x) => x.id == id)!;
        setCompleted(research.includes(x.id));
        calcCost = x.cost;
        if (canBuy) canBuy = hasItems(x);
        break;
      }
      case "Upgrades": {
        const x = _gameObjects.upgrades.find((x) => x.id == id)!;
        calcCost = x.levels.find((x) => x.level == nextLevel)?.cost || 0;
        let isCompleted = false;
        const currentUpgrade = upgrades.find((item) => x.id == item.id);
        if (currentUpgrade) {
          isCompleted = currentUpgrade.level == x.levels.length;
          setNextLevel(currentUpgrade.level + 1);
        }
        setCompleted(isCompleted);
        if (canBuy) canBuy = hasItems(x);
        break;
      }
      case "Shop": {
        const x = _gameObjects.shopItems.find((x) => x.id == id)!;
        calcCost = x.cost * Math.pow(x.multiplier, quantity);
        const currentShopItem = inven.find((item) => x.id == item.id);
        if (currentShopItem) {
          if (currentShopItem.quantity == x.maxQty) canBuy = false;
          setQuantity(currentShopItem.quantity);
        }
        if (canBuy) canBuy = hasItems(x);
        break;
      }
      case "Inventory": {
        const x = inven.find((x) => x.id == id)!;
        setQuantity(x.quantity);
        canBuy = false;
        break;
      }
      default: {
        break;
      }
    }
    if (calcCost > score) {
      canBuy = false;
    }
    setCanBuy(canBuy);
  }, [
    score,
    inven,
    nextLevel,
    quantity,
    _gameObjects,
    completed,
    research,
    upgrades,
    id,
    type,
  ]);

  const onClick = (e: React.MouseEvent<HTMLButtonElement>) => {
    switch (type) {
      case "Research": {
        dispatch({
          type: gameStateActionType.BUYRESEARCH,
          value: id,
        });
        return;
      }
      case "Upgrades": {
        dispatch({
          type: gameStateActionType.BUYUPGRADE,
          value: id,
        });
        return;
      }
      case "Shop": {
        dispatch({
          type: gameStateActionType.BUYITEM,
          value: id,
        });
        return;
      }
      default: {
        return;
      }
    }
  };

  if (completed) return <></>;

  return (
    <Tooltip content={tooltipText}>
      <div className="relative flex cursor-not-allowed items-center gap-1 rounded-lg bg-black p-1 text-sm before:absolute before:-inset-1 before:-z-10 before:[animation:rotation_5s_linear_infinite] before:rounded-lg before:bg-white/30 before:bg-[conic-gradient(from_var(--gradient-angle),var(--clr-4),var(--clr-5),var(--clr-6),var(--clr-5),var(--clr-4))] before:content-[''] after:absolute after:-inset-1 after:-z-10 after:[animation:rotation_5s_linear_infinite] after:rounded-lg after:bg-white/30 after:bg-[conic-gradient(from_var(--gradient-angle),var(--clr-4),var(--clr-5),var(--clr-6),var(--clr-5),var(--clr-4))] after:blur-lg after:content-[''] has-enabled:cursor-pointer has-enabled:before:bg-[conic-gradient(from_var(--gradient-angle),var(--clr-7),var(--clr-8),var(--clr-9),var(--clr-8),var(--clr-7))] has-enabled:after:bg-[conic-gradient(from_var(--gradient-angle),var(--clr-7),var(--clr-8),var(--clr-9),var(--clr-8),var(--clr-7))] md:gap-2 md:p-2 lg:gap-4">
        <button
          id={buttonLabel}
          title={displayText}
          type="button"
          className={`hidden cursor-[inherit] p-1 text-center md:block md:p-2 lg:p-4 ${canBuy ? "bg-green-500" : "bg-red-500"}`}
          onClick={onClick}
          disabled={completed || !canBuy}
        ></button>
        <label
          className="flex-1 cursor-[inherit] text-wrap text-sm lg:text-lg"
          htmlFor={buttonLabel}
        >
          {displayText}
        </label>
      </div>
    </Tooltip>
  );
};

export default Button;
