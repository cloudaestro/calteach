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

  // Try to place remaining words with better intersection strategy
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    let bestPlacement: { pos: Position; intersections: number } | null = null;

    // Try all possible placements and find the one with most intersections
    for (const placedWord of placedWords) {
      const intersections = findIntersections(word, placedWord.word);
      
      for (const [newWordIndex, placedWordIndex] of intersections) {
        const pos = calculatePosition(
          placedWord.position,
          placedWordIndex,
          newWordIndex,
          word.length,
          !placedWord.position.horizontal
        );

        if (pos && canPlaceWord(grid, word, pos)) {
          // Count how many letters this placement would share with existing words
          const intersectionCount = countIntersections(grid, word, pos);
          
          if (!bestPlacement || intersectionCount > bestPlacement.intersections) {
            bestPlacement = { pos, intersections: intersectionCount };
          }
        }
      }
    }
    
    // Place the word using the best placement found
    if (bestPlacement) {
      placeWord(grid, word, bestPlacement.pos);
      placedWords.push({ 
        word, 
        position: bestPlacement.pos, 
        number: clueNumber++ 
      });
    }
  }

  // Clean up the grid by removing any isolated words
  const finalPlacedWords = placedWords.filter(word => {
    const intersectionCount = countIntersections(grid, word.word, word.position);
    return intersectionCount > 1; // Keep only words with more than one intersection
  });

  return {
    grid,
    placedWords: finalPlacedWords,
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

  return { x, y, horizontal };
}

function canPlaceWord(grid: string[][], word: string, pos: Position): boolean {
  // Check boundaries
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  // Check for conflicts and ensure proper spacing
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
        } else {
          // Ensure words don't touch except at intersections
          if (currentCell !== '') {
            return false;
          }
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

function countIntersections(grid: string[][], word: string, pos: Position): number {
  let count = 0;
  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;
    
    // Check perpendicular cells
    const checkX = pos.horizontal ? x : x + 1;
    const checkY = pos.horizontal ? y + 1 : y;
    if (checkY < grid.length && checkX < grid[0].length && grid[checkY][checkX] !== '') {
      count++;
    }
    
    const checkX2 = pos.horizontal ? x : x - 1;
    const checkY2 = pos.horizontal ? y - 1 : y;
    if (checkY2 >= 0 && checkX2 >= 0 && grid[checkY2][checkX2] !== '') {
      count++;
    }
  }
  return count;
}