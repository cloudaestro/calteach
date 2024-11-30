import { Position } from './crosswordTypes';

export const findIntersections = (word1: string, word2: string): [number, number][] => {
  const intersections: [number, number][] = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i].toLowerCase() === word2[j].toLowerCase()) {
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
  const x = horizontal 
    ? existingPos.x + (existingPos.horizontal ? existingIndex : 0) - newIndex
    : existingPos.x + (existingPos.horizontal ? existingIndex : 0);
    
  const y = horizontal
    ? existingPos.y + (!existingPos.horizontal ? existingIndex : 0)
    : existingPos.y + (!existingPos.horizontal ? existingIndex : 0) - newIndex;

  return { x, y, horizontal };
};

export const canPlaceWord = (grid: string[][], word: string, pos: Position): boolean => {
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    // Check if current position conflicts with existing letters
    if (grid[y][x] !== '' && grid[y][x].toLowerCase() !== word[i].toLowerCase()) {
      return false;
    }
    
    // Check adjacent cells (no words should touch except at intersections)
    if (pos.horizontal) {
      // Check cells above and below
      if (y > 0 && grid[y-1][x] !== '' && !hasIntersectionAt(grid, x, y)) return false;
      if (y < grid.length - 1 && grid[y+1][x] !== '' && !hasIntersectionAt(grid, x, y)) return false;
    } else {
      // Check cells to the left and right
      if (x > 0 && grid[y][x-1] !== '' && !hasIntersectionAt(grid, x, y)) return false;
      if (x < grid[0].length - 1 && grid[y][x+1] !== '' && !hasIntersectionAt(grid, x, y)) return false;
    }
  }
  
  return true;
};

// Helper function to check if there's a valid intersection at the given position
const hasIntersectionAt = (grid: string[][], x: number, y: number): boolean => {
  return grid[y][x] !== '';
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
    
    if (grid[y][x] !== '' && grid[y][x].toLowerCase() === word[i].toLowerCase()) {
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
  const { word, position: { x, y, horizontal } } = placedWord;
  
  for (let i = 0; i < word.length; i++) {
    if (horizontal) {
      // Try vertical positions at each letter
      if (y > newWordLength) {
        positions.push({ x: x + i, y: y - 1, horizontal: false });
      }
      if (y < grid.length - newWordLength) {
        positions.push({ x: x + i, y: y + 1, horizontal: false });
      }
    } else {
      // Try horizontal positions at each letter
      if (x > newWordLength) {
        positions.push({ x: x - 1, y: y + i, horizontal: true });
      }
      if (x < grid[0].length - newWordLength) {
        positions.push({ x: x + 1, y: y + i, horizontal: true });
      }
    }
  }
  
  return positions;
};