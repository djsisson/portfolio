"use client";
import { useRef, useEffect, useState } from "react";
import { useGameState } from "./Context";

const Total = () => {
  const currentScore = useGameState().currentScore;
  const refDisplay = useRef<typeof setDisplay>();
  const [displayTotal, setDisplayTotal] = useState(0);

  useEffect(() => {
    refDisplay.current = setDisplay;
  });

  useEffect(() => {
    const displayInterval = setInterval(() => {
      if (refDisplay.current) refDisplay.current();
    }, 100);
    return () => clearInterval(displayInterval);
  }, []);

  const setDisplay = () => {
    const updatedTotal =
      currentScore < displayTotal
        ? currentScore
        : Math.ceil((currentScore - displayTotal) / 4) + displayTotal;
    setDisplayTotal(Math.ceil(updatedTotal));
  };

  return (
    <div className="relative -col-start-3 -col-end-2 -row-start-3 -row-end-2 flex items-center justify-center border-5 [border-style:outset] border-[var(--bgcolour)] p-10">
      Total: {displayTotal}
    </div>
  );
};

export default Total;
