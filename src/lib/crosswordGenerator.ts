import { generateWorksheet } from './gemini';
import { Position, PlacedWord, CrosswordResult } from './crosswordTypes';
import {
  findIntersections,
  calculatePosition,
  canPlaceWord,
  placeWord,
  countIntersections,
  findAdjacentPositions
} from './crosswordUtils';

export const generateCrossword = async (words: string[]): Promise<CrosswordResult> => {
  // Validate input
  if (!words || words.length === 0) {
    throw new Error("No words provided for crossword generation");
  }

  // Filter out any invalid words
  const validWords = words.filter(word => word && typeof word === 'string' && word.trim().length > 0);
  
  if (validWords.length === 0) {
    throw new Error("No valid words provided for crossword generation");
  }

  const sortedWords = validWords.sort((a, b) => b.length - a.length);
  const gridSize = Math.max(20, Math.ceil(Math.sqrt(validWords.join('').length * 2)));
  const grid: string[][] = Array(gridSize).fill(null).map(() => Array(gridSize).fill(''));
  const placedWords: PlacedWord[] = [];
  
  // Place first word in the middle horizontally
  if (sortedWords.length > 0) {
    const firstWord = sortedWords[0];
    const startX = Math.floor((gridSize - firstWord.length) / 2);
    const startY = Math.floor(gridSize / 2);
    
    placeWord(grid, firstWord, { x: startX, y: startY, horizontal: true });
    placedWords.push({
      word: firstWord,
      position: { x: startX, y: startY, horizontal: true },
      number: 1
    });
  }

  // Try to place remaining words with alternating orientations
  let forceHorizontal = false;
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    if (!word) continue; // Skip if word is undefined

    let bestPlacement: { pos: Position; intersections: number } | null = null;
    
    // First try to find intersections with existing words
    for (const placedWord of placedWords) {
      if (!placedWord || !placedWord.word) continue; // Skip if placed word is invalid
      
      const intersections = findIntersections(word, placedWord.word);
      const horizontal = !placedWord.position.horizontal;
      
      for (const [newWordIndex, placedWordIndex] of intersections) {
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

    // If no intersections found, try adjacent positions
    if (!bestPlacement) {
      forceHorizontal = !forceHorizontal;
      for (const placedWord of placedWords) {
        if (!placedWord || !placedWord.word) continue;
        
        const adjacentPositions = findAdjacentPositions(grid, placedWord, word.length);
        for (const pos of adjacentPositions.filter(p => p.horizontal === forceHorizontal)) {
          if (canPlaceWord(grid, word, pos)) {
            bestPlacement = { pos, intersections: 0 };
            break;
          }
        }
        if (bestPlacement) break;
      }
    }

    // If still no placement found, try any valid position
    if (!bestPlacement) {
      const centerX = Math.floor(gridSize / 2);
      const centerY = Math.floor(gridSize / 2);
      
      // Try positions radiating out from center
      for (let offset = 1; offset < gridSize / 2 && !bestPlacement; offset++) {
        const positions = [
          { x: centerX + offset, y: centerY, horizontal: !forceHorizontal },
          { x: centerX - offset, y: centerY, horizontal: !forceHorizontal },
          { x: centerX, y: centerY + offset, horizontal: forceHorizontal },
          { x: centerX, y: centerY - offset, horizontal: forceHorizontal }
        ];

        for (const pos of positions) {
          if (canPlaceWord(grid, word, pos)) {
            bestPlacement = { pos, intersections: 0 };
            break;
          }
        }
      }
    }

    // Place the word if a valid position was found
    if (bestPlacement) {
      placeWord(grid, word, bestPlacement.pos);
      placedWords.push({
        word,
        position: bestPlacement.pos,
        number: 0  // Temporary number, will be reassigned
      });
    }
  }

  // Reassign numbers based on position in grid
  const numberedPositions = new Set<string>();
  let currentNumber = 1;

  const positionsNeedingNumbers: Array<{ x: number; y: number }> = [];
  placedWords.forEach(word => {
    if (!word || !word.position) return;
    const key = `${word.position.x},${word.position.y}`;
    if (!numberedPositions.has(key)) {
      positionsNeedingNumbers.push({ x: word.position.x, y: word.position.y });
      numberedPositions.add(key);
    }
  });

  positionsNeedingNumbers.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  const positionToNumber = new Map<string, number>();
  positionsNeedingNumbers.forEach(pos => {
    positionToNumber.set(`${pos.x},${pos.y}`, currentNumber++);
  });

  placedWords.forEach(word => {
    if (!word || !word.position) return;
    const key = `${word.position.x},${word.position.y}`;
    word.number = positionToNumber.get(key) || word.number;
  });

  // Generate descriptions for placed words
  const wordsWithDescriptions = await Promise.all(
    placedWords.map(async (placedWord) => {
      if (!placedWord || !placedWord.word) return placedWord;
      
      const descriptionPrompt = `Generate a detailed, specific clue for the word "${placedWord.word}" that would be suitable for a crossword puzzle. The clue should be challenging but fair.`;
      try {
        const description = await generateWorksheet(descriptionPrompt);
        return {
          ...placedWord,
          description: description.trim()
        };
      } catch (error) {
        console.error('Error generating description:', error);
        return placedWord;
      }
    })
  );

  return {
    grid,
    placedWords: wordsWithDescriptions.filter(word => word && word.word),
    size: gridSize
  };
};