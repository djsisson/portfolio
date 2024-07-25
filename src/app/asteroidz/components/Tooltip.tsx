"use client";

import React, { useState, useRef } from "react";

const Tooltip = ({
  delay,
  children,
  content,
}: {
  delay?: number;
  children: React.ReactNode;
  content: string[];
}) => {
  const [active, setActive] = useState(false);
  const refTimeout = useRef<NodeJS.Timeout>();
  const refDisplay = useRef<NodeJS.Timeout>();

  const showTip = () => {
    clearTimeout(refTimeout.current);
    clearTimeout(refDisplay.current);
    refTimeout.current = setTimeout(() => {
      setActive(true);
    }, delay || 400);
    refDisplay.current = setTimeout(() => {
      hideTip();
    }, 3000);
  };

  const hideTip = () => {
    clearTimeout(refTimeout.current);
    clearTimeout(refDisplay.current);
    setActive(false);
  };

  return (
    <div
      className="relative inline-block"
      onMouseEnter={showTip}
      onMouseLeave={hideTip}
    >
      {children}
      {active && (
        <div
          className={`absolute bottom-12 left-[50%] z-50 flex w-full translate-x-[-50%] flex-col flex-wrap gap-2 whitespace-nowrap text-wrap rounded-md border-2 border-white bg-black p-2 text-sm text-white backdrop-blur-sm before:absolute before:top-[100%] before:left-[50%] before:h-0 before:w-0 before:translate-x-[-50%] before:border-8 before:border-transparent before:border-t-white before:content-['']`}
        >
          {content.map((x) => {
            return <div key={x}>{x}</div>;
          })}
        </div>
      )}
    </div>
  );
};

export default Tooltip;
