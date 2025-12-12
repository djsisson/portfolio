"use client";

import type React from "react";
import { useRef, useState } from "react";

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
	const refTimeout = useRef<NodeJS.Timeout>(null);
	const refDisplay = useRef<NodeJS.Timeout>(null);
	const anchorRef = useRef<HTMLDivElement>(null);

	const showTip = () => {
		if (refTimeout.current) clearTimeout(refTimeout.current);
		if (refDisplay.current) clearTimeout(refDisplay.current);
		refTimeout.current = setTimeout(() => {
			setActive(true);
		}, delay || 400);
		refDisplay.current = setTimeout(() => {
			hideTip();
		}, 3000);
	};

	const hideTip = () => {
		if (refTimeout.current) clearTimeout(refTimeout.current);
		if (refDisplay.current) clearTimeout(refDisplay.current);
		setActive(false);
	};

	const getPosition = () => {
		if (anchorRef.current) {
			return anchorRef.current.getBoundingClientRect();
		}
		return { top: 0, left: 0 } as DOMRect;
	};

	return (
		<div
			className="relative inline-block select-none"
			onMouseEnter={showTip}
			onMouseLeave={hideTip}
			ref={anchorRef}
			role="none"
		>
			{children}
			{active && (
				<div
					className={`fixed z-50 flex w-full translate-x-[-50%] flex-col flex-wrap gap-2 whitespace-nowrap text-wrap rounded-md border-2 border-white bg-black p-2 text-sm text-white backdrop-blur-sm before:absolute before:top-full before:left-[50%] before:z-40 before:h-0 before:w-0 before:translate-x-[-50%] before:border-8 before:border-transparent before:border-t-white before:content-[''] after:z-40`}
					style={
						{
							left: getPosition().left + getPosition().width / 2,
							bottom: window.innerHeight - getPosition().top + 10,
							width: getPosition().width,
						} as React.CSSProperties
					}
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
