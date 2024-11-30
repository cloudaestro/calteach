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

  // Try to place remaining words
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    let placed = false;

    // Try to find intersections with placed words
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
          placeWord(grid, word, pos);
          placedWords.push({ word, position: pos, number: clueNumber++ });
          placed = true;
          break;
        }
      }
      
      if (placed) break;
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

  return { x, y, horizontal };
}

function canPlaceWord(grid: string[][], word: string, pos: Position): boolean {
  if (pos.x < 0 || pos.y < 0 || 
      (pos.horizontal && pos.x + word.length > grid[0].length) ||
      (!pos.horizontal && pos.y + word.length > grid.length)) {
    return false;
  }

  for (let i = 0; i < word.length; i++) {
    const x = pos.horizontal ? pos.x + i : pos.x;
    const y = pos.horizontal ? pos.y : pos.y + i;

    if (grid[y][x] !== '' && grid[y][x] !== word[i]) {
      return false;
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