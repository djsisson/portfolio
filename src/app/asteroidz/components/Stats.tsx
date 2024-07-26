"use client";

import { useGameState } from "./Context";

const Stats = () => {
  const gameState = useGameState();

  return (
    <div className="grid grid-cols-2 grid-rows-2 text-sm md:text-lg">
      <div>Total Clicks: {gameState.totalClicks}</div>
      <div>Total Spent: {gameState.totalSpent}</div>
      <div>Avg Click Value: {gameState.averageClickValue}</div>
      <div>Avg CPS Value: {gameState.currentAverageCps}</div>
    </div>
  );
};

export default Stats;
