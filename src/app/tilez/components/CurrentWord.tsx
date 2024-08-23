"use client";

import { useGameState, useGameStateDispatch } from "./GameContext";
import { useEffect, useState, useRef } from "react";
import { uploadScore, getWordDefinition } from "../lib/GameLogic";
import { GameActionType } from "../lib/GameTypes";
import { Badge } from "@/components/ui/badge";
import Help from "./Help";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewGameButton from "./NewGameButton";
import { getUserFromJWT } from "@/lib/auth";

export default function CurrentWord() {
  const dispatch = useGameStateDispatch();
  const gameState = useGameState();
  const [currentWord, setCurrentWord] = useState([] as string[]);
  const [currentDefinition, setCurrentDefinition] = useState("");
  const completed = gameState.completed || false;
  const allWords = gameState.words;
  const [hoverOpen, setHoverOpen] = useState(false);
  const ref = useRef<NodeJS.Timeout>();
  const refDefinitions = useRef(new Map() as Map<string, string>);
  const [signedIn, setSignedIn] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    setCurrentWord(gameState.rows.map((x) => x.tiles[x.position + 1].letter));
  }, [gameState]);

  useEffect(() => {
    if (!gameState.uploaded && signedIn && gameState.completed && !uploading) {
      async function upload() {
        const uploaded = await uploadScore(gameState);
        if (uploaded) {
          dispatch({ type: GameActionType.UPLOADED });
          setUploading(false);
        }
      }
      setUploading(true);
      upload();
    }
  }, [signedIn, gameState, dispatch, uploading]);

  useEffect(() => {
    setCurrentDefinition("");
    const currentWord = gameState.rows
      .map((x) => x.tiles[x.position + 1].letter)
      .join("");
    if (currentWord.length == 0) return;
    async function getDefinition() {
      const def = refDefinitions.current.get(currentWord);
      if (!(def === undefined)) {
        if (def === "") {
          return;
        }
        setCurrentDefinition(def);
        return;
      }
      refDefinitions.current.set(currentWord, "");
      const result = await getWordDefinition(currentWord);
      refDefinitions.current.set(currentWord, result);
      setCurrentDefinition(result);
    }
    if (allWords.includes(currentWord)) {
      if (!gameState.found.includes(currentWord)) {
        dispatch({
          type: GameActionType.FOUND,
        });
      }
      getDefinition();
    }
  }, [gameState, dispatch, allWords]);

  useEffect(() => {
    async function getUser() {
      const user = await getUserFromJWT();
      if (user) {
        setSignedIn(true);
      }
    }
    getUser();
  }, []);

  const updateDefinition = (e: React.MouseEvent<HTMLDivElement>, x: string) => {
    const getDef = async () => {
      const result = await getWordDefinition(x);
      refDefinitions.current.set(x, result);
      (e.target as HTMLElement).title = result;
    };
    if (refDefinitions.current.get(x) === undefined) {
      getDef();
    }
  };
  return completed ? (
    <div className="modal absolute inset-0 z-50 flex items-center justify-center backdrop-blur-sm">
      <div className="rounded-lg bg-gradient-to-r from-pink-500 via-red-500 to-yellow-500 p-1">
        <div className="bg-secondary flex flex-col gap-4 rounded-lg p-4">
          <div className="text-center">Congratulations, you won!</div>
          <div className="text-center">You made {gameState.moves} moves.</div>
          <div className="flex gap-2">
            <div className="border-secondary-foreground flex flex-col p-2">
              <div>Found words:</div>
              {gameState.found.map((x) => (
                <div
                  key={x}
                  className="cursor-pointer italic"
                  title={refDefinitions.current.get(x) || "No Definition Found"}
                  onMouseOver={(e) => updateDefinition(e, x)}
                >
                  {x}
                </div>
              ))}
            </div>
            <div className="border-secondary-foreground flex flex-col p-2">
              <div>Other Words:</div>
              {[...allWords]
                .filter((x) => !gameState.found.includes(x))
                .map((x) => (
                  <div
                    key={x}
                    className="italic"
                    title={
                      refDefinitions.current.get(x) || "No Definition Found"
                    }
                    onMouseOver={(e) => updateDefinition(e, x)}
                  >
                    {x}
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-around gap-4 text-center">
            <NewGameButton></NewGameButton>
            {!signedIn ? <div>Sign in to upload</div> : null}
          </div>
        </div>
      </div>
    </div>
  ) : (
    <div className="grid w-full grid-cols-3 place-content-center">
      <div className="flex items-center">
        {gameState.moves == 0 ? (
          ""
        ) : (
          <Badge
            title="Moves"
            className="border-muted-foreground border border-solid text-base"
            variant={"outline"}
          >
            {gameState.moves}
          </Badge>
        )}
      </div>
      <div title="Current Word" className="flex items-center justify-center">
        <div
          onClick={() => setHoverOpen(!hoverOpen)}
          onMouseEnter={() => {
            clearTimeout(ref.current);
            setTimeout(() => setHoverOpen(true), 200);
          }}
          onMouseLeave={() => {
            clearTimeout(ref.current);
            ref.current = setTimeout(() => setHoverOpen(false), 200);
          }}
        >
          <Popover open={hoverOpen}>
            <PopoverTrigger className="focus-within:outline-0">
              <Badge
                variant={`${currentDefinition ? "default" : "secondary"}`}
                aria-disabled={true}
                className={`cursor-pointer text-center text-base uppercase md:text-xl lg:text-2xl ${currentDefinition ? "" : "border-muted-foreground border border-solid"}`}
              >
                {currentWord}
              </Badge>
            </PopoverTrigger>
            {currentDefinition && (
              <PopoverContent
                onMouseEnter={() => {
                  clearTimeout(ref.current);
                  setTimeout(() => setHoverOpen(true), 200);
                }}
                onMouseLeave={() => {
                  clearTimeout(ref.current);
                  setTimeout(() => setHoverOpen(false), 200);
                }}
                className="border-border rounded-lg border border-solid normal-case"
              >
                {currentDefinition}
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
      <div className="flex items-center justify-end" title="Help">
        <Badge
          variant={"outline"}
          className="border-muted-foreground border border-solid text-base"
        >
          <Help></Help>
        </Badge>
      </div>
    </div>
  );
}
