"use client";

import { useState, useRef } from "react";
import { useGameState } from "./GameContext";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Info } from "lucide-react";

export default function GameScore() {
  const games = useGameState().score.games;
  const average = useGameState().score.average;
  const [hoverOpen, setHoverOpen] = useState(false);
  const ref = useRef<NodeJS.Timeout>();

  return (
    <div
      onClick={() => setHoverOpen(!hoverOpen)}
      onMouseEnter={() => {
        clearTimeout(ref.current);
        setTimeout(() => setHoverOpen(true), 200);
      }}
      onMouseLeave={() => {
        clearTimeout(ref.current);
        ref.current = setTimeout(() => setHoverOpen(false), 200);
      }}
    >
      <Popover open={hoverOpen}>
        <PopoverTrigger className="focus-visible:outline-0">
          <div className="flex items-center gap-2 hover:cursor-pointer">
            <Info />
            Stats
          </div>
        </PopoverTrigger>
        <PopoverContent>
          <div className="flex flex-col gap-4 text-sm italic">
            <div>Games Played: {games}</div>
            <div>Average Moves: {Math.round(average)}</div>
          </div>
        </PopoverContent>
      </Popover>
    </div>
  );
}
