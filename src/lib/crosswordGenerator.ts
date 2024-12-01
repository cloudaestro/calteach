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
  const sortedWords = words.sort((a, b) => b.length - a.length);
  const gridSize = Math.max(20, Math.ceil(Math.sqrt(words.join('').length * 2)));
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
    let bestPlacement: { pos: Position; intersections: number } | null = null;
    
    // First try to find intersections with existing words
    for (const placedWord of placedWords) {
      const intersections = findIntersections(word, placedWord.word);
      
      // Try placing in opposite orientation of the previous word
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
      forceHorizontal = !forceHorizontal; // Alternate orientation
      for (const placedWord of placedWords) {
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

  // Reassign numbers based on position in grid (top to bottom, left to right)
  const numberedPositions = new Set<string>();
  let currentNumber = 1;

  // First pass: collect all positions that need numbers
  const positionsNeedingNumbers: Array<{ x: number; y: number }> = [];
  placedWords.forEach(word => {
    const key = `${word.position.x},${word.position.y}`;
    if (!numberedPositions.has(key)) {
      positionsNeedingNumbers.push({ x: word.position.x, y: word.position.y });
      numberedPositions.add(key);
    }
  });

  // Sort positions by y first (top to bottom), then x (left to right)
  positionsNeedingNumbers.sort((a, b) => {
    if (a.y === b.y) {
      return a.x - b.x;
    }
    return a.y - b.y;
  });

  // Create a mapping of positions to numbers
  const positionToNumber = new Map<string, number>();
  positionsNeedingNumbers.forEach(pos => {
    positionToNumber.set(`${pos.x},${pos.y}`, currentNumber++);
  });

  // Update word numbers based on their starting position
  placedWords.forEach(word => {
    const key = `${word.position.x},${word.position.y}`;
    word.number = positionToNumber.get(key) || word.number;
  });

  // Generate descriptions for placed words
  const wordsWithDescriptions = await Promise.all(
    placedWords.map(async (placedWord) => {
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
    placedWords: wordsWithDescriptions,
    size: gridSize
  };
};