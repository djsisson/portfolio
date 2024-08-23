"use client";

import React, { createContext, useContext, useReducer, useEffect } from "react";
import { GameAction, GameState, GameActionType } from "../lib/GameTypes";
import { getWordsOnLoad, NewGame } from "../lib/GameLogic";

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
};

const gameStateReducer = (
  gameState: GameState,
  action: GameAction,
): GameState => {
  switch (action.type) {
    case GameActionType.LOAD_GAME: {
      return { ...(action.payload as GameState) };
    }
    case GameActionType.RESET: {
      return { ...(action.payload as GameState) };
    }
    case GameActionType.UPLOADED: {
      return { ...gameState, uploaded: true };
    }
    case GameActionType.FOUND: {
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
    case GameActionType.MOVEROW: {
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
        dispatch({ type: GameActionType.LOAD_GAME, payload: await NewGame() });
      };
      getGameState();
    } else {
      const loadGameState = async () => {
        const loadGame = JSON.parse(localState) as GameState;
        loadGame.words = await getWordsOnLoad(
          loadGame.rows.map((x) => x.tiles.map((y) => y.letter).join("")),
        );
        dispatch({
          type: GameActionType.LOAD_GAME,
          payload: loadGame,
        });
      };
      loadGameState();
    }
  }, []);

  useEffect(() => {
    if (gameState.rows.length > 0)
      localStorage.setItem(
        "Tilez",
        JSON.stringify({ ...gameState, words: [] }),
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
