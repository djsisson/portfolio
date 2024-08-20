"use client";

import { useGameState } from "./Context";
import Image from "next/image";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
  const gameState = useGameState();
  const cdn = process.env.NEXT_PUBLIC_CDN || "";
  return (
    <div
      className="relative grid h-svh w-svw grid-cols-7 grid-rows-8 border-[var(--bgcolour)] text-[var(--bgcolour)]"
      style={{ "--bgcolour": gameState.theme } as React.CSSProperties}
    >
      <Image
        className="absolute top-0 left-0 -z-20 h-svh w-svw object-cover object-center"
        src={`${cdn}/assets/asteroidz/starfield.webp`}
        alt="Background"
        fill={true}
        sizes="100vw"
        priority={true}
        quality={75}
      />
      {children}
    </div>
  );
};
