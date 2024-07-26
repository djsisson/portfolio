"use client";

import { useGameState } from "./Context";
import Image from "next/image";
import background from "@/assets/asteroidz/starfield.webp";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const gameState = useGameState();
  return (
    <div
      className="grid h-svh w-svw grid-cols-7 grid-rows-6 border-[var(--bgcolour)] text-[var(--bgcolour)]"
      style={{ "--bgcolour": gameState.theme } as React.CSSProperties}
    >
      <Image
        className="absolute top-0 left-0 -z-20 h-svh w-svw object-cover object-center"
        placeholder="blur"
        src={background}
        alt="Background"
      />
      {children}
    </div>
  );
};
