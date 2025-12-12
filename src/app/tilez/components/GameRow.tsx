"use client";

import { useEffect, useState } from "react";
import type { GameTile as GTile } from "../lib/GameTypes";
import { useGameState, useGameStateDispatch } from "./GameContext";
import GameTile from "./GameTile";
import LeftArrow from "./LeftArrow";
import RightArrow from "./RightArrow";

export default function GameRow({ rowNumber }: { rowNumber: number }) {
	const [position, setPosition] = useState(0);
	const [letters, setLetters] = useState([] as GTile[]);
	const gameState = useGameState();
	const dispatch = useGameStateDispatch();

	useEffect(() => {
		if (gameState.rows.length === 0) return;
		setPosition(gameState.rows[rowNumber].position);
		setLetters(gameState.rows[rowNumber].tiles);
	}, [gameState, rowNumber]);

	const leftArrowClick = () => {
		const newPosition = position + 1;
		if (!(newPosition === 0 || newPosition === -1 || newPosition === 1)) return;
		if (!dispatch) return;
		dispatch({
			type: "MOVEROW",
			payload: {
				rowNumber: rowNumber,
				position: newPosition,
			},
		});
	};

	const RightArrowClick = () => {
		const newPosition = position - 1;
		if (!(newPosition === 0 || newPosition === -1 || newPosition === 1)) return;
		if (!dispatch) return;
		dispatch({
			type: "MOVEROW",
			payload: {
				rowNumber: rowNumber,
				position: newPosition,
			},
		});
	};

	if (letters.length === 0)
		return <div className="col-span-5 gap-4 py-4 px-6"></div>;

	return (
		<div
			className={`col-span-5 grid grid-cols-[repeat(5,3.5rem)] gap-4 transition delay-150 duration-300 ease-in-out md:grid-cols-[repeat(5,4rem)] lg:grid-cols-[repeat(5,4.5rem)] ${
				position === 0
					? ""
					: position === -1
						? "translate-x-18 md:translate-x-20 lg:translate-x-22"
						: "-translate-x-18 md:-translate-x-20 lg:-translate-x-22"
			}`}
		>
			{position !== 1 && (letters.length === 2 ? position !== 0 : true) ? (
				<LeftArrow clickHandler={leftArrowClick}></LeftArrow>
			) : (
				<div></div>
			)}

			{letters.map((z, j) => {
				return (
					<GameTile
						key={`tile-${z.letter}`}
						position={j}
						letter={z.letter}
						found={z.found}
						active={position === j - 1}
					></GameTile>
				);
			})}
			{position !== -1 ? (
				<RightArrow clickHandler={RightArrowClick}></RightArrow>
			) : (
				<div></div>
			)}
		</div>
	);
}
