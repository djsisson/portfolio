"use server";

import { all_words } from "../data/all_words";
import { words } from "../data/words";
import { filter } from "../data/filter";
import { GameState, GameRow, GameTile } from "./GameTypes";
import { getdb as db } from "@/db/tilez/db";
import { tilez_games, tilez_words } from "@/db/tilez/schema";
import { avg, count, eq } from "drizzle-orm";
import { revalidatePath } from "next/cache";
import { getUserFromJWT } from "@/lib/auth";
import { JWTPayload } from "jose";

function getRandomWord() {
  const i = Math.floor(Math.random() * words.length);
  return words[i];
}

function shuffleArray(array: string[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
}

function mixWords() {
  let totalLength = 0;
  const output = [];
  do {
    totalLength = 0;
    const words = [
      Array.from(getRandomWord()),
      Array.from(getRandomWord()),
      Array.from(getRandomWord()),
    ];
    for (let i = 0; i < 6; i++) {
      const chars = new Set([words[0][i], words[1][i], words[2][i]]);
      output[i] = Array.from(chars);
      shuffleArray(output[i]);
      totalLength += output[i].length;
    }
  } while (totalLength < 17 || isFiltered(output.map((x) => x.join(""))));
  return output;
}

export async function NewGame(): Promise<GameState> {
  const words = mixWords();
  let rows = [] as GameRow[];
  do {
    rows = words.map(
      (x) =>
        ({
          position: Math.floor(Math.random() * x.length) - 1,
          tiles: x.map((y) => ({ letter: y, found: false }) as GameTile),
        }) as GameRow,
    );
  } while (
    all_words.includes(rows.map((x) => x.tiles[x.position + 1].letter).join(""))
  );
  const encodeWords = getAllWords(
    rows.map((x) => x.tiles.map((y) => y.letter).join("")),
  ).join(",");
  const Score = await getScore();
  const _gameState: GameState = {
    gameStart: new Date(),
    completed: false,
    found: [],
    moves: 0,
    rows: rows,
    uploaded: false,
    words: [Buffer.from(encodeWords, "utf-8").toString("base64")],
    score: Score,
  };
  revalidatePath("/tilez");
  return _gameState;
}

function isFiltered(letters: string[]): boolean {
  const words = [] as string[];
  const re = new RegExp(letters.map((x) => `[${x}]`).join(""));
  filter.filter((x) => re.exec(x)).map((x) => words.push(x));
  return words.length > 0;
}

function getAllWords(letters: string[]): string[] {
  const words = [] as string[];
  const re = new RegExp(letters.map((x) => `[${x}]`).join(""));
  all_words.filter((x) => re.exec(x)).map((x) => words.push(x));
  return words;
}

export async function getWordsOnLoad(letters: string[]): Promise<string[]> {
  return getAllWords(letters);
}

export async function uploadScore(game: GameState): Promise<boolean> {
  const jwt = await getUserFromJWT();
  if (!jwt) {
    return false;
  }
  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    const newGame = await tx
      .insert(tilez_games)
      .values({
        userId: jwt.sub as string,
        game_id: game.rows
          .map((x) => x.tiles.map((y) => y.letter).join(""))
          .join("-"),
        game_start: new Date(game.gameStart).toUTCString(),
        num_moves: game.moves,
        completed: true,
      })
      .onConflictDoNothing()
      .returning();
    return newGame.length > 0;
  });
  return result;
}

export async function getScore() {
  const jwt = await getUserFromJWT();
  if (!jwt) return { games: 0, average: 0 };
  const result = await db(jwt as JWTPayload).transaction(async (tx) => {
    const scores = await tx
      .select({
        games: count(),
        average: avg(tilez_games.num_moves).mapWith(Number) || 0,
      })
      .from(tilez_games);
    return scores[0];
  });
  return result;
}

export async function getWordDefinition(word: string): Promise<string> {
  const inDb = await db()
    .select()
    .from(tilez_words)
    .where(eq(tilez_words.word, word))
    .limit(1);

  if (inDb.length > 0 && inDb[0].definition != "") return inDb[0].definition;
  if (
    inDb.length > 0 &&
    new Date(inDb[0].last_checked) >
      new Date(Date.now() - 1000 * 60 * 60 * 24 * 7)
  )
    return "No definition found";
  let definition = "";
  try {
    const result = await fetch(
      `https://api.dictionaryapi.dev/api/v2/entries/en/${word}`,
    );
    if (result.ok) {
      const data = await result.json();
      definition = data[0].meanings[0].definitions[0].definition || "";
    }
  } catch (error) {
  } finally {
    if (inDb.length > 0) {
      await db()
        .update(tilez_words)
        .set({ last_checked: new Date().toISOString(), definition: definition })
        .where(eq(tilez_words.word, word));
    } else {
      await db().insert(tilez_words).values({
        word: word,
        definition: definition,
        last_checked: new Date().toISOString(),
      });
    }
    return definition === "" ? "No definition found" : definition;
  }
}
