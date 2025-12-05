"use client";

import { useGameStateDispatch } from "./Context";

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
      type: "changeTheme",
      value: colour,
    });
  };

  return (
    <div className="group relative inline-block cursor-pointer text-sm md:text-xl">
      Theme
      <div className="absolute right-0 hidden min-w-fit bg-black shadow-lg group-hover:flex group-hover:flex-col">
        {themes.map((x) => {
          return (
            <button
              key={x}
              type="button"
              style={{ color: x }}
              onClick={() => onClick({ colour: x })}
              className="flex cursor-pointer items-center gap-3 border-2 border-transparent p-4 text-xl hover:border-white"
            >
              {x}
            </button>
          );
        })}
      </div>
    </div>
  );
};

export default Theme;
