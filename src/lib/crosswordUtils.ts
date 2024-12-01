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
  // Calculate x position
  const x = horizontal 
    ? existingPos.x + (existingPos.horizontal ? existingIndex : 0) - newIndex
    : existingPos.x + (existingPos.horizontal ? existingIndex : 0);
    
  // Calculate y position
  const y = horizontal
    ? existingPos.y + (!existingPos.horizontal ? existingIndex : 0)
    : existingPos.y + (!existingPos.horizontal ? existingIndex : 0) - newIndex;

  // Validate position is within bounds
  if (x < 0 || y < 0) {
    return null;
  }

  return { x, y, horizontal };
};

export const canPlaceWord = (grid: string[][], word: string, pos: Position): boolean => {
  // Check if word fits within grid bounds
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  // Check each position where the word would be placed
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    // Check if current position conflicts with existing letters
    if (grid[y][x] !== '' && grid[y][x].toLowerCase() !== word[i].toLowerCase()) {
      return false;
    }

    // Check adjacent cells
    if (pos.horizontal) {
      // Check cells above and below
      if (y > 0 && !isValidAdjacent(grid, x, y - 1, pos.horizontal)) return false;
      if (y < grid.length - 1 && !isValidAdjacent(grid, x, y + 1, pos.horizontal)) return false;
      
      // Check cells before and after (only at word boundaries)
      if (i === 0 && x > 0 && grid[y][x-1] !== '') return false;
      if (i === word.length - 1 && x < grid[0].length - 1 && grid[y][x+1] !== '') return false;
    } else {
      // Check cells to left and right
      if (x > 0 && !isValidAdjacent(grid, x - 1, y, pos.horizontal)) return false;
      if (x < grid[0].length - 1 && !isValidAdjacent(grid, x + 1, y, pos.horizontal)) return false;
      
      // Check cells before and after (only at word boundaries)
      if (i === 0 && y > 0 && grid[y-1][x] !== '') return false;
      if (i === word.length - 1 && y < grid.length - 1 && grid[y+1][x] !== '') return false;
    }
  }
  
  return true;
};

// Helper function to check if adjacent cell placement is valid
const isValidAdjacent = (grid: string[][], x: number, y: number, isHorizontal: boolean): boolean => {
  // An adjacent cell is valid if it's empty or if it's part of an intersecting word
  const isEmpty = grid[y][x] === '';
  if (isEmpty) return true;

  // Check if this is part of a valid intersection
  // For horizontal words, check vertical neighbors
  // For vertical words, check horizontal neighbors
  const hasValidIntersection = isHorizontal
    ? (y > 0 && grid[y-1][x] !== '') || (y < grid.length - 1 && grid[y+1][x] !== '')
    : (x > 0 && grid[y][x-1] !== '') || (x < grid[0].length - 1 && grid[y][x+1] !== '');

  return hasValidIntersection;
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
  
  // Try positions at each letter of the existing word
  for (let i = 0; i < word.length; i++) {
    const currentX = horizontal ? x + i : x;
    const currentY = horizontal ? y : y + i;
    
    // Try perpendicular positions
    if (horizontal) {
      // Try vertical positions
      if (currentY > newWordLength) {
        positions.push({ x: currentX, y: currentY - 1, horizontal: false });
      }
      if (currentY < grid.length - newWordLength) {
        positions.push({ x: currentX, y: currentY + 1, horizontal: false });
      }
    } else {
      // Try horizontal positions
      if (currentX > newWordLength) {
        positions.push({ x: currentX - 1, y: currentY, horizontal: true });
      }
      if (currentX < grid[0].length - newWordLength) {
        positions.push({ x: currentX + 1, y: currentY, horizontal: true });
      }
    }
  }
  
  return positions;
};