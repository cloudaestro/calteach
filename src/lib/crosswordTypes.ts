export interface Position {
  x: number;
  y: number;
  horizontal: boolean;
}

export interface PlacedWord {
  word: string;
  position: Position;
  number: number;
  description?: string;
}

export interface CrosswordResult {
  grid: string[][];
  placedWords: PlacedWord[];
  size: number;
}