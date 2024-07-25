"use client";

import { useEffect } from "react";
import { Score } from "./ViewPort";

const VisualScore = ({
  x,
  remove,
  type,
}: {
  x: Score;
  remove: (id: number) => void;
  type: string;
}) => {
  useEffect(() => {
    const timeout = setTimeout(() => {
      remove(x.id);
    }, 3000 + x.delay);
    return () => clearTimeout(timeout);
  }, [x, remove]);

  const position = () => {
    switch (type) {
      case "Click": {
        return "left-[calc(15%_+_var(--rndLeft))]";
      }
      case "Cps": {
        return "right-[calc(15%_+_var(--rndLeft))]";
      }
    }
  };

  const animation = () => {
    switch (x.crit) {
      case true: {
        return "animation-name: crit;";
      }
      case false: {
        return "animation-name: up;";
      }
    }
  };

  if (!x.id) return null;

  return (
    <div
      className={`absolute top-[calc(40%_+_var(--rndTop))] hidden inline-block text-[var(--bgcolour)] opacity-0 ${position()}`}
      style={
        {
          "--rndLeft": `${x.rndLeft}px`,
          "--rndTop": `${x.rndTop}px`,
          "--delay": `${x.delay}ms`,
          animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
          animationFillMode: "forwards",
          animationDelay: "var(--delay)",
          animationDuration: "3s",
          animationIterationCount: "1",
          transformOrigin: "center",
          animationName: `${x.crit ? "crit" : "up"}`,
        } as React.CSSProperties
      }
    >
      +{x.value}
    </div>
  );
};

export default VisualScore;
