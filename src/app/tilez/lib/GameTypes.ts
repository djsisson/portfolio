export type GameRow = {
  position: -1 | 0 | 1;
  tiles: GameTile[];
};

export type GameTile = {
  letter: string;
  found: boolean;
};

export type GameState = {
  gameStart: Date;
  moves: number;
  rows: GameRow[];
  found: string[];
  completed?: boolean;
  uploaded?: boolean;
  words: string[];
  score: { games: number; average: number };
};

export type GameAction =
  | {
      type: "LOAD_GAME";
      payload: GameState;
    }
  | {
      type: "RESET";
      payload: GameState;
    }
  | {
      type: "UPLOADED";
    }
  | {
      type: "FOUND";
    }
  | {
      type: "MOVEROW";
      payload: MoveRow;
    }
  | {
      type: "GETSCORE";
      payload: { games: number; average: number };
    };

export type MoveRow = {
  rowNumber: number;
  position: -1 | 0 | 1;
};
