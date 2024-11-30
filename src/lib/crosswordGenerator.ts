interface Position {
  x: number;
  y: number;
  horizontal: boolean;
}

interface PlacedWord {
  word: string;
  position: Position;
  number: number;
}

export const generateCrossword = (words: string[]) => {
  const sortedWords = words.sort((a, b) => b.length - a.length);
  const gridSize = Math.max(
    20,
    Math.ceil(Math.sqrt(words.join('').length * 2))
  );
  
  const grid: string[][] = Array(gridSize).fill(null)
    .map(() => Array(gridSize).fill(''));
  
  const placedWords: PlacedWord[] = [];
  let clueNumber = 1;

  // Place first word horizontally in the middle
  if (sortedWords.length > 0) {
    const firstWord = sortedWords[0];
    const startX = Math.floor((gridSize - firstWord.length) / 2);
    const startY = Math.floor(gridSize / 2);
    
    placeWord(grid, firstWord, { x: startX, y: startY, horizontal: true });
    placedWords.push({
      word: firstWord,
      position: { x: startX, y: startY, horizontal: true },
      number: clueNumber++
    });
  }

  // Try multiple starting positions for better word placement
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    let bestPlacement: { pos: Position; intersections: number } | null = null;
    
    // Try each placed word as an anchor point
    for (const placedWord of placedWords) {
      const intersections = findIntersections(word, placedWord.word);
      
      for (const [newWordIndex, placedWordIndex] of intersections) {
        // Try both horizontal and vertical orientations
        const orientations = [true, false];
        
        for (const horizontal of orientations) {
          const pos = calculatePosition(
            placedWord.position,
            placedWordIndex,
            newWordIndex,
            word.length,
            horizontal
          );

          if (pos && canPlaceWord(grid, word, pos)) {
            const intersectionCount = countIntersections(grid, word, pos);
            if (!bestPlacement || intersectionCount > bestPlacement.intersections) {
              bestPlacement = { pos, intersections: intersectionCount };
            }
          }
        }
      }
    }
    
    // If no placement found with intersections, try placing adjacent to existing words
    if (!bestPlacement) {
      for (const placedWord of placedWords) {
        const adjacentPositions = findAdjacentPositions(grid, placedWord, word.length);
        for (const pos of adjacentPositions) {
          if (canPlaceWord(grid, word, pos)) {
            bestPlacement = { pos, intersections: 0 };
            break;
          }
        }
        if (bestPlacement) break;
      }
    }
    
    // Place the word if a valid position was found
    if (bestPlacement) {
      placeWord(grid, word, bestPlacement.pos);
      placedWords.push({
        word,
        position: bestPlacement.pos,
        number: clueNumber++
      });
    }
  }

  return {
    grid,
    placedWords,
    size: gridSize
  };
};

function findIntersections(word1: string, word2: string): [number, number][] {
  const intersections: [number, number][] = [];
  for (let i = 0; i < word1.length; i++) {
    for (let j = 0; j < word2.length; j++) {
      if (word1[i] === word2[j]) {
        intersections.push([i, j]);
      }
    }
  }
  return intersections;
}

function calculatePosition(
  existingPos: Position,
  existingIndex: number,
  newIndex: number,
  newLength: number,
  horizontal: boolean
): Position | null {
  let x = existingPos.x;
  let y = existingPos.y;

  if (existingPos.horizontal) {
    x += existingIndex;
    y -= newIndex;
  } else {
    x -= newIndex;
    y += existingIndex;
  }

  // Ensure position is within grid bounds
  if (x < 0 || y < 0) return null;

  return { x, y, horizontal };
}

function canPlaceWord(grid: string[][], word: string, pos: Position): boolean {
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

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
}

function placeWord(grid: string[][], word: string, pos: Position) {
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    grid[y][x] = word[i];
  }
}

function findAdjacentPositions(grid: string[][], placedWord: PlacedWord, newWordLength: number): Position[] {
  const positions: Position[] = [];
  const { x, y, horizontal } = placedWord.position;
  
  if (horizontal) {
    // Try placing vertically adjacent to the word
    if (y > 0) positions.push({ x, y: y - newWordLength + 1, horizontal: false });
    if (y < grid.length - 1) positions.push({ x, y: y + 1, horizontal: false });
  } else {
    // Try placing horizontally adjacent to the word
    if (x > 0) positions.push({ x: x - newWordLength + 1, y, horizontal: true });
    if (x < grid[0].length - 1) positions.push({ x: x + 1, y, horizontal: true });
  }
  
  return positions;
}

function countIntersections(grid: string[][], word: string, pos: Position): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    if (grid[y][x] !== '' && grid[y][x] === word[i]) {
      count++;
    }
  }
  return count;
}