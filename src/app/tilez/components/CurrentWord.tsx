"use client";

import { useGameState, useGameStateDispatch } from "./GameContext";
import { useEffect, useState, useRef } from "react";
import { uploadScore, getWordDefinition } from "../lib/GameLogic";
import { Badge } from "@/components/ui/badge";
import Help from "./Help";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import NewGameButton from "./NewGameButton";
import { getUser } from "@/lib/auth-client";

export default function CurrentWord() {
  const dispatch = useGameStateDispatch();
  const gameState = useGameState();
  const currentWord = gameState.rows
    .map((x) => x.tiles[x.position + 1].letter)
    .join("");
  const [definitions, setDefinitions] = useState(
    new Map() as Map<string, string>,
  );
  const completed = gameState.completed || false;
  const allWords = gameState.words;
  const [hoverOpen, setHoverOpen] = useState(false);
  const ref = useRef<NodeJS.Timeout>(null);
  const [signedIn, setSignedIn] = useState(false);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (!gameState.uploaded && signedIn && gameState.completed && !uploading) {
      async function upload() {
        const uploaded = await uploadScore(gameState);
        if (uploaded) {
          dispatch({ type: "UPLOADED" });
          setUploading(false);
        }
      }
      setUploading(true);
      upload();
    }
  }, [signedIn, gameState, dispatch, uploading]);

  useEffect(() => {
    const currentWord = gameState.rows
      .map((x) => x.tiles[x.position + 1].letter)
      .join("");
    if (currentWord.length == 0) return;

    async function getDefinition() {
      const def = definitions.get(currentWord);
      if (!(def === undefined)) {
        return;
      }
      setDefinitions((x) => new Map([...x, [currentWord, ""]]));
      const result = await getWordDefinition(currentWord);
      setDefinitions((x) => new Map([...x, [currentWord, result]]));
    }
    if (allWords.includes(currentWord)) {
      if (!gameState.found.includes(currentWord)) {
        dispatch({
          type: "FOUND",
        });
      }
      if (!definitions.has(currentWord)) {
        getDefinition();
      }
    }
  }, [gameState, dispatch, allWords, definitions]);

  useEffect(() => {
    async function isUser() {
      const user = await getUser();
      if (user) {
        setSignedIn(true);
      }
    }
    isUser();
  }, []);

  const updateDefinition = (e: React.MouseEvent<HTMLDivElement>, x: string) => {
    const currentDef = definitions.get(x);
    if (currentDef === "") return;
    const getDef = async () => {
      const result = await getWordDefinition(x);
      setDefinitions((def) => new Map([...def, [x, result]]));
    };
    if (currentDef === undefined) {
      setDefinitions((def) => new Map([...def, [x, ""]]));
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
                  title={definitions.get(x)}
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
                    key={definitions.get(x) ? x : `no def ${x}`}
                    className="cursor-pointer italic"
                    title={
                      definitions.get(x) ? definitions.get(x) : "loading..."
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
      <div
        title={definitions.get(currentWord) ? undefined : "Current Word"}
        className="flex items-center justify-center"
      >
        <div
          onClick={() => setHoverOpen(!hoverOpen)}
          onMouseEnter={() => {
            if (ref.current) clearTimeout(ref.current);
            setTimeout(() => setHoverOpen(true), 200);
          }}
          onMouseLeave={() => {
            if (ref.current) clearTimeout(ref.current);
            ref.current = setTimeout(() => setHoverOpen(false), 200);
          }}
        >
          <Popover open={hoverOpen}>
            <PopoverTrigger className="focus-within:outline-0">
              <Badge
                variant={`${definitions.get(currentWord) ? "default" : "secondary"}`}
                aria-disabled={true}
                className={`cursor-pointer text-center text-base uppercase md:text-xl lg:text-2xl ${definitions.get(currentWord) ? "" : "border-muted-foreground border border-solid"}`}
              >
                {currentWord}
              </Badge>
            </PopoverTrigger>
            {definitions.get(currentWord) && (
              <PopoverContent
                onMouseEnter={() => {
                  if (ref.current) clearTimeout(ref.current);
                  setTimeout(() => setHoverOpen(true), 200);
                }}
                onMouseLeave={() => {
                  if (ref.current) clearTimeout(ref.current);
                  setTimeout(() => setHoverOpen(false), 200);
                }}
                className="border-border rounded-lg border border-solid normal-case"
              >
                {definitions.get(currentWord)}
              </PopoverContent>
            )}
          </Popover>
        </div>
      </div>
      <div
        className="flex cursor-pointer items-center justify-end"
        title="Help"
      >
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
