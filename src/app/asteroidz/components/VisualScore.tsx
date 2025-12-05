"use client";

import { useEffect } from "react";
import type { Score } from "./ViewPort";

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

	if (!x.id) return null;

	return (
		<div
			className={`absolute inline-block text-[var(--bgcolour)] opacity-0`}
			style={
				{
					top: `calc(40% + ${x.rndTop}px)`,
					left: type === "Click" ? `calc(15% + ${x.rndLeft}px)` : undefined,
					right: type === "Cps" ? `calc(15% + ${x.rndLeft}px)` : undefined,
					animationTimingFunction: "cubic-bezier(0.23, 1, 0.32, 1)",
					animationFillMode: "forwards",
					animationDelay: `${x.delay}ms`,
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
