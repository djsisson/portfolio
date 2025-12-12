"use client";

import { Button } from "@/components/ui/button";
import { NewGame } from "../lib/GameLogic";
import { useGameStateDispatch } from "./GameContext";

export default function NewGameButton() {
	const dispatch = useGameStateDispatch();
	return (
		<Button
			title="New Game"
			onClick={async () => {
				if (!dispatch) return;
				dispatch({ type: "RESET", payload: await NewGame() });
			}}
		>
			New Game
		</Button>
	);
}
