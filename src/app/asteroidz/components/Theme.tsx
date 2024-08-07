"use client";

import { gameStateActionType, useGameStateDispatch } from "./Context";

const Theme = () => {
  const dispatch = useGameStateDispatch();
  const themes = [
    "Aqua",
    "DeepPink",
    "LightGreen",
    "Orange",
    "Red",
    "Tomato",
    "White",
    "Yellow",
  ];

  const onClick = ({ colour }: { colour: string }) => {
    dispatch({
      type: gameStateActionType.CHANGETHEME,
      value: colour,
    });
  };

  return (
    <div className="group relative inline-block cursor-pointer text-sm md:text-xl">
      Theme
      <div className="absolute right-0 hidden min-w-fit bg-black shadow-lg group-hover:flex group-hover:flex-col">
        {themes.map((x) => {
          return (
            <div
              key={x}
              style={{ color: x }}
              onClick={() => onClick({ colour: x })}
              className="flex cursor-pointer items-center gap-3 border-2 border-transparent p-4 text-xl hover:border-white"
            >
              {x}
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default Theme;
