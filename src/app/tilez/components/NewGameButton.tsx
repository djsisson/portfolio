"use client";

import { useGameStateDispatch } from "./GameContext";
import { Button } from "@/components/ui/button";
import { NewGame } from "../lib/GameLogic";

export default function NewGameButton() {
  const dispatch = useGameStateDispatch();
  return (
    <Button
      title="New Game"
      onClick={async () =>
        dispatch({ type: "RESET", payload: await NewGame() })
      }
    >
      New Game
    </Button>
  );
}
