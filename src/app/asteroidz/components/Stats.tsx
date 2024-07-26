"use client";

import { useGameState } from "./Context";

const Stats = () => {
  const gameState = useGameState();

  return (
    <div className="grid grid-cols-2 grid-rows-2 gap-1 text-sm md:gap-2 md:text-lg lg:gap-4">
      <div>Total Clicks: {gameState.totalClicks}</div>
      <div>Total Spent: {gameState.totalSpent}</div>
      <div>Avg Click Value: {gameState.averageClickValue}</div>
      <div>Avg CPS Value: {gameState.currentAverageCps}</div>
    </div>
  );
};

export default Stats;
