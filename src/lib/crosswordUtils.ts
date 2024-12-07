import { Position } from './crosswordTypes';

export const findIntersections = (word1: string, word2: string): [number, number][] => {
  const intersections: [number, number][] = [];
  if (!word1 || !word2) return intersections;
  
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i]?.toLowerCase() === word2[j]?.toLowerCase()) {
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
  if (!existingPos) return null;

  const x = horizontal 
    ? existingPos.x + (existingPos.horizontal ? existingIndex : 0) - newIndex
    : existingPos.x + (existingPos.horizontal ? existingIndex : 0);
    
  const y = horizontal
    ? existingPos.y + (!existingPos.horizontal ? existingIndex : 0)
    : existingPos.y + (!existingPos.horizontal ? existingIndex : 0) - newIndex;

  if (x < 0 || y < 0) return null;

  return { x, y, horizontal };
};

export const canPlaceWord = (grid: string[][], word: string, pos: Position): boolean => {
  if (!word || !grid || !pos || !Array.isArray(grid)) return false;

  // Check if word fits within grid bounds
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0]?.length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  // Check each position where the word would be placed
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    // Validate grid position exists
    if (!grid[y] || grid[y][x] === undefined) return false;

    const currentCell = grid[y][x];
    const currentLetter = word[i];
    
    if (currentCell && currentCell !== '' && 
        currentCell.toLowerCase() !== currentLetter?.toLowerCase()) {
      return false;
    }

    // Check adjacent cells
    if (pos.horizontal) {
      if ((i === 0 && x > 0 && grid[y][x-1] !== '') || 
          (i === word.length - 1 && x < grid[0].length - 1 && grid[y][x+1] !== '')) {
        return false;
      }
      if (y > 0 && grid[y-1][x] !== '' && !isValidAdjacent(grid, x, y - 1, pos.horizontal)) return false;
      if (y < grid.length - 1 && grid[y+1][x] !== '' && !isValidAdjacent(grid, x, y + 1, pos.horizontal)) return false;
    } else {
      if ((i === 0 && y > 0 && grid[y-1][x] !== '') || 
          (i === word.length - 1 && y < grid.length - 1 && grid[y+1][x] !== '')) {
        return false;
      }
      if (x > 0 && grid[y][x-1] !== '' && !isValidAdjacent(grid, x - 1, y, pos.horizontal)) return false;
      if (x < grid[0].length - 1 && grid[y][x+1] !== '' && !isValidAdjacent(grid, x + 1, y, pos.horizontal)) return false;
    }
  }
  
  return true;
};

const isValidAdjacent = (grid: string[][], x: number, y: number, isHorizontal: boolean): boolean => {
  if (!grid[y] || grid[y][x] === undefined) return false;

  const isEmpty = grid[y][x] === '';
  if (isEmpty) return true;

  const hasValidIntersection = isHorizontal
    ? (y > 0 && grid[y-1]?.[x] !== '') || (y < grid.length - 1 && grid[y+1]?.[x] !== '')
    : (x > 0 && grid[y]?.[x-1] !== '') || (x < grid[0].length - 1 && grid[y]?.[x+1] !== '');

  return hasValidIntersection;
};

export const placeWord = (grid: string[][], word: string, pos: Position): void => {
  if (!word || !grid || !pos || !Array.isArray(grid)) return;
  
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    if (grid[y] && grid[y][x] !== undefined) {
      grid[y][x] = word[i];
    }
  }
};

export const countIntersections = (grid: string[][], word: string, pos: Position): number => {
  if (!word || !grid || !pos || !Array.isArray(grid)) return 0;
  
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    if (grid[y]?.[x] && grid[y][x] !== '' && 
        grid[y][x].toLowerCase() === word[i]?.toLowerCase()) {
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
  if (!grid || !placedWord?.word || !placedWord?.position || !Array.isArray(grid)) return [];
  
  const positions: Position[] = [];
  const { word, position: { x, y, horizontal } } = placedWord;
  
  for (let i = 0; i < word.length; i++) {
    const currentX = horizontal ? x + i : x;
    const currentY = horizontal ? y : y + i;
    
    if (horizontal) {
      if (currentY > 1) {
        positions.push({ x: currentX, y: currentY - 1, horizontal: false });
      }
      if (currentY < grid.length - 2) {
        positions.push({ x: currentX, y: currentY + 1, horizontal: false });
      }
    } else {
      if (currentX > 1) {
        positions.push({ x: currentX - 1, y: currentY, horizontal: true });
      }
      if (currentX < grid[0].length - 2) {
        positions.push({ x: currentX + 1, y: currentY, horizontal: true });
      }
    }
  }
  
  return positions;
};