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

  // Enhanced word placement with alternating orientations
  for (let i = 1; i < sortedWords.length; i++) {
    const word = sortedWords[i];
    let bestPlacement: { pos: Position; intersections: number } | null = null;
    
    // Try each placed word as an anchor point
    for (const placedWord of placedWords) {
      const intersections = findIntersections(word, placedWord.word);
      
      // Try both orientations for better coverage
      for (const [newWordIndex, placedWordIndex] of intersections) {
        const orientations = [!placedWord.position.horizontal, placedWord.position.horizontal];
        
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
    
    // If no placement found with intersections, try adjacent positions
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

  // Generate detailed descriptions for the placed words
  const wordsWithDescriptions = placedWords.map(async (placedWord) => {
    const descriptionPrompt = `Generate a detailed, specific clue for the word "${placedWord.word}" that would be suitable for a crossword puzzle. The clue should be challenging but fair, and should focus on the word's primary meaning or most common usage. Make it specific enough that the answer could only be "${placedWord.word}".`;
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
  });

  const enhancedPlacedWords = await Promise.all(wordsWithDescriptions);

  return {
    grid,
    placedWords: enhancedPlacedWords,
    size: gridSize
  };
};