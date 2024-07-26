"use client";

import Button from "./Button";
import { useGameState, useGameObject } from "./Context";
import React, { useEffect, useState } from "react";

type requiredResearch = {
  required_id: number;
  description: string;
};

enum containerType {
  Inventory = "Inventory",
  Research = "Research",
  Upgrades = "Upgrades",
  Shop = "Shop",
}

const Container = ({ type }: { type: containerType }) => {
  const [buttonList, setButtonList] = useState([] as ButtonList | typeof inven);
  const inven = useGameState().items;
  const research = useGameState().researched;
  const _gameObjects = useGameObject();

  type Research = (typeof _gameObjects)["research"][number];
  type Upgrade = (typeof _gameObjects)["upgrades"][number];
  type ShopItem = (typeof _gameObjects)["shopItems"][number];
  type ButtonList = (Research | Upgrade | ShopItem)[];

  useEffect(() => {
    if (type != "Inventory") return;
    setButtonList(inven.filter((x) => x.quantity != 0 && x.name != "Click"));
  }, [inven, type]);

  useEffect(() => {
    let filteredList = [] as ButtonList;
    switch (type) {
      case "Inventory": {
        return;
      }
      case "Research": {
        filteredList = _gameObjects.research;
        break;
      }
      case "Upgrades": {
        filteredList = _gameObjects.upgrades;
        break;
      }
      case "Shop": {
        filteredList = _gameObjects.shopItems.filter((x) => x.name != "Click");
        break;
      }
      default: {
        return;
      }
    }
    if (!filteredList) return;
    const hasResearched = (requireResearch = [] as requiredResearch[]) => {
      const checkForResearch = requireResearch.filter(
        (x: requiredResearch) => !research.includes(x.required_id),
      );
      return checkForResearch.length == 0;
    };

    setButtonList(
      filteredList.filter((x) => hasResearched(x.requiredResearch)),
    );
  }, [research, _gameObjects, type]);

  const containerStyle = () => {
    switch (type) {
      case "Research": {
        return "row-start-5 -row-end-2 col-start-1 col-end-3 border-l-none";
      }
      case "Upgrades": {
        return "row-start-2 row-end-5 col-start-1 col-end-3 border-l-none";
      }
      case "Shop": {
        return "row-start-2 row-end-5 -col-start-3 -col-end-1 border-r-none";
      }
      default: {
        return "row-start-5 -row-end-2 -col-start-3 -col-end-1 border-r-none";
      }
    }
  };

  return (
    <div
      className={`border-5 [border-style:outset] border-[var(--bgcolour)] md:p-2 lg:p-4 ${containerStyle()}`}
    >
      <h1 className="border-b-2 border-[var(--bgcolour)] text-center text-sm md:text-lg lg:text-3xl">
        {type}
      </h1>
      <div className="relative z-30 grid h-[calc(100%-2rem)] auto-rows-max gap-4 overflow-y-auto p-4">
        {buttonList.toReversed().map((x) => (
          <Button type={type} id={x.id} key={x.id} />
        ))}
      </div>
    </div>
  );
};

export default Container;
