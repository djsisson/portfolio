"use client";

import Image from "next/image";
import starfield from "@/../public/assets/asteroidz/starfield.webp";
import { useGameState } from "./Context";

export const ThemeProvider = ({ children }: { children: React.ReactNode }) => {
	const gameState = useGameState();
	return (
		<div
			className="relative grid h-svh w-svw grid-cols-7 grid-rows-8 border-[var(--bgcolour)] text-[var(--bgcolour)]"
			style={{ "--bgcolour": gameState.theme } as React.CSSProperties}
		>
			<Image
				className="absolute top-0 left-0 -z-20 h-svh w-svw object-cover object-center"
				src={starfield}
				alt="Background"
				fill={true}
				priority={true}
			/>
			{children}
		</div>
	);
};
