"use client";

import type React from "react";
import { createContext, useContext, useEffect, useReducer } from "react";
import { getWordsOnLoad, NewGame } from "../lib/GameLogic";
import type { GameAction, GameState } from "../lib/GameTypes";

export const useGameState = () => {
	return useContext(GameStateContext);
};

export const useGameStateDispatch = () => {
	return useContext(GameStateDispatchContext);
};

const _gameState: GameState = {
	gameStart: new Date(),
	moves: 0,
	rows: [],
	completed: false,
	found: [],
	uploaded: false,
	words: [],
	score: { games: 0, average: 0 },
};

const gameStateReducer = (
	gameState: GameState,
	action: GameAction,
): GameState => {
	switch (action.type) {
		case "LOAD_GAME": {
			return { ...(action.payload as GameState) };
		}
		case "RESET": {
			const words = Buffer.from(action.payload.words[0], "base64")
				.toString("utf-8")
				.split(",");
			return { ...(action.payload as GameState), words: words };
		}
		case "UPLOADED": {
			return { ...gameState, uploaded: true };
		}
		case "FOUND": {
			const currentWord = gameState.rows
				.map((x) => x.tiles[x.position + 1].letter)
				.join("");
			const newState = {
				...gameState,
				found: [
					...gameState.found,
					...(gameState.found.includes(currentWord) ? [] : [currentWord]),
				],
				rows: [...gameState.rows].map((x) => ({
					...x,
					tiles: [...x.tiles].map((y, i) => ({
						...y,
						found: i === x.position + 1 ? true : y.found,
					})),
				})),
			};
			if (
				newState.rows.reduce(
					(a, b) => a && b.tiles.reduce((c, d) => c && d.found, true),
					true,
				)
			) {
				newState.completed = true;
			}
			return newState;
		}
		case "GETSCORE": {
			return {
				...gameState,
				score: action.payload,
			};
		}
		case "MOVEROW": {
			return {
				...gameState,
				moves: gameState.completed ? gameState.moves : gameState.moves + 1,
				rows: [
					...gameState.rows.slice(0, action.payload.rowNumber),
					{
						...gameState.rows[action.payload.rowNumber],
						position: action.payload.position,
					},
					...gameState.rows.slice(action.payload.rowNumber + 1),
				],
			};
		}
		default: {
			return { ...gameState };
		}
	}
};

const GameStateContext = createContext(_gameState);
const GameStateDispatchContext = createContext<React.Dispatch<GameAction>>(
	null!,
);
export const GameStateProvider = ({
	children,
}: {
	children: React.ReactNode;
}) => {
	const [gameState, dispatch] = useReducer(gameStateReducer, _gameState) as [
		GameState,
		React.Dispatch<GameAction>,
	];
	useEffect(() => {
		const localState = localStorage.getItem("Tilez");

		if (!localState) {
			const getGameState = async () => {
				dispatch({ type: "LOAD_GAME", payload: await NewGame() });
			};
			getGameState();
		} else {
			const loadGameState = async () => {
				try {
					const loadGame = JSON.parse(localState) as GameState;
					const words = await getWordsOnLoad(
						loadGame.rows.map((x) => x.tiles.map((y) => y.letter).join("")),
					);
					loadGame.words = Buffer.from(words.words[0], "base64")
						.toString("utf-8")
						.split(",");
					loadGame.score = words.score;
					dispatch({
						type: "LOAD_GAME",
						payload: loadGame,
					});
				} catch (e) {
					localStorage.removeItem("Tilez");
					dispatch({
						type: "LOAD_GAME",
						payload: await NewGame(),
					});
				}
			};
			loadGameState();
		}
	}, []);

	useEffect(() => {
		if (gameState.rows.length > 0)
			localStorage.setItem(
				"Tilez",
				JSON.stringify({ ...gameState, words: [], score: [] }),
			);
	}, [gameState]);

	return (
		<GameStateContext.Provider value={gameState}>
			<GameStateDispatchContext.Provider value={dispatch}>
				{children}
			</GameStateDispatchContext.Provider>
		</GameStateContext.Provider>
	);
};
