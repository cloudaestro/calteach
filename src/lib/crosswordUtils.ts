import { Position } from './crosswordTypes';

export const findIntersections = (word1: string, word2: string): [number, number][] => {
  const intersections: [number, number][] = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        intersections.push([i, j]);
      }
    }
  }
  return intersections;
};

export const calculatePosition = (
  existingPos: Position,
  existingIndex: number,
  newIndex: number,
  newLength: number,
  horizontal: boolean
): Position | null => {
  let x = existingPos.x;
  let y = existingPos.y;

  if (existingPos.horizontal) {
    x += existingIndex;
    y -= newIndex;
  } else {
    x -= newIndex;
    y += existingIndex;
  }

  if (x < 0 || y < 0) return null;

  return { x, y, horizontal };
};

export const canPlaceWord = (grid: string[][], word: string, pos: Position): boolean => {
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  // Check surrounding cells to ensure words don't touch unless at intersections
  for (let i = -1; i <= word.length; i++) {
    for (let j = -1; j <= 1; j++) {
      const x = pos.horizontal ? pos.x + i : pos.x + j;
      const y = pos.horizontal ? pos.y + j : pos.y + i;
      
      if (x >= 0 && x < grid[0].length && y >= 0 && y < grid.length) {
        const isWordPosition = i >= 0 && i < word.length && j === 0;
        const currentCell = grid[y][x];
        
        if (isWordPosition) {
          if (currentCell !== '' && currentCell !== word[i]) {
            return false;
          }
        } else if (currentCell !== '') {
          return false;
        }
      }
    }
  }
  return true;
};

export const placeWord = (grid: string[][], word: string, pos: Position): void => {
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    grid[y][x] = word[i];
  }
};

export const countIntersections = (grid: string[][], word: string, pos: Position): number => {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    if (grid[y][x] !== '' && grid[y][x] === word[i]) {
      count++;
    }
  }
  return count;
};

export const findAdjacentPositions = (
  grid: string[][],
  placedWord: { word: string; position: Position },
  newWordLength: number
): Position[] => {
  const positions: Position[] = [];
  const { x, y, horizontal } = placedWord.position;
  
  // Try both horizontal and vertical positions for better word placement
  if (horizontal) {
    // Try placing vertically
    if (y > 0) positions.push({ x, y: y - newWordLength + 1, horizontal: false });
    if (y < grid.length - 1) positions.push({ x, y: y + 1, horizontal: false });
  } else {
    // Try placing horizontally
    if (x > 0) positions.push({ x: x - newWordLength + 1, y, horizontal: true });
    if (x < grid[0].length - 1) positions.push({ x: x + 1, y, horizontal: true });
  }
  
  return positions;
};