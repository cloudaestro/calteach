import React from 'react';
import { CrosswordCell } from '../../CrosswordCell';

interface GridCellProps {
  x: number;
  y: number;
  cell: string;
  number?: number;
  wordsAtCell: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
  }>;
  userInputs: { [key: string]: string };
  checkedWords: { [key: number]: boolean };
  onInputChange: (number: number, index: number, value: string) => void;
  onKeyDown: (wordNumber: number, word: string) => (e: React.KeyboardEvent) => void;
}

export const GridCell = ({
  x,
  y,
  cell,
  number,
  wordsAtCell,
  userInputs,
  checkedWords,
  onInputChange,
  onKeyDown
}: GridCellProps) => {
  if (!cell) {
    return (
      <div
        key={`${x}-${y}`}
        className="w-8 h-8 bg-neutral-800"
      />
    );
  }

  if (wordsAtCell.length === 0) {
    return (
      <div
        key={`${x}-${y}`}
        className="w-8 h-8 bg-white border border-neutral-300"
      />
    );
  }

  // Find both horizontal and vertical words at this cell
  const horizontalWord = wordsAtCell.find(word => word.position.horizontal);
  const verticalWord = wordsAtCell.find(word => !word.position.horizontal);

  // Determine which word to use based on current input context
  const primaryWord = (() => {
    if (wordsAtCell.length === 1) return wordsAtCell[0];
    
    // If we have both horizontal and vertical words
    if (horizontalWord && verticalWord) {
      // Calculate indices for both words
      const horizontalIndex = x - horizontalWord.position.x;
      const verticalIndex = y - verticalWord.position.y;
      
      // Check if either word has started being filled
      const isHorizontalStarted = Array.from(horizontalWord.word).some((_, idx) => {
        const key = `${horizontalWord.number}-${idx}`;
        return userInputs[key];
      });
      
      const isVerticalStarted = Array.from(verticalWord.word).some((_, idx) => {
        const key = `${verticalWord.number}-${idx}`;
        return userInputs[key];
      });

      // If only one word has started being filled, use that one
      if (isHorizontalStarted && !isVerticalStarted) return horizontalWord;
      if (isVerticalStarted && !isHorizontalStarted) return verticalWord;
      
      // If neither word has started or both have started,
      // check if we're at the start of either word
      const isHorizontalStart = horizontalIndex === 0;
      const isVerticalStart = verticalIndex === 0;
      
      if (isHorizontalStart && !isVerticalStart) return horizontalWord;
      if (isVerticalStart && !isHorizontalStart) return verticalWord;
      
      // If we're still undecided, check which word has more filled cells
      const horizontalFilled = Array.from(horizontalWord.word).filter((_, idx) => {
        const key = `${horizontalWord.number}-${idx}`;
        return userInputs[key];
      }).length;
      
      const verticalFilled = Array.from(verticalWord.word).filter((_, idx) => {
        const key = `${verticalWord.number}-${idx}`;
        return userInputs[key];
      }).length;
      
      if (horizontalFilled > verticalFilled) return horizontalWord;
      if (verticalFilled > horizontalFilled) return verticalWord;
    }
    
    // Default to horizontal if we can't decide
    return horizontalWord || verticalWord;
  })();

  const index = primaryWord.position.horizontal
    ? x - primaryWord.position.x
    : y - primaryWord.position.y;
  const inputKey = `${primaryWord.number}-${index}`;

  // Check all words at this cell
  const cellStates = wordsAtCell.map(word => {
    if (!checkedWords[word.number]) return null;
    return {
      isWordChecked: true,
      isWordCorrect: isWordCorrect(word, userInputs)
    };
  }).filter(Boolean);

  const isAnyWordChecked = cellStates.some(state => state?.isWordChecked);
  const areAllCheckedWordsCorrect = cellStates.every(state => state?.isWordCorrect);

  return (
    <CrosswordCell
      x={x}
      y={y}
      number={number}
      value={userInputs[inputKey] || ''}
      correctValue={cell}
      isWordChecked={isAnyWordChecked}
      showSolution={false}
      isWordCorrect={areAllCheckedWordsCorrect}
      onChange={(value) => onInputChange(primaryWord.number, index, value)}
      onKeyDown={onKeyDown(primaryWord.number, primaryWord.word)}
      data-cell={`cell-${x}-${y}`}
    />
  );
};

// Helper function to check if a word is correct
const isWordCorrect = (
  word: { 
    word: string; 
    position: { x: number; y: number; horizontal: boolean }; 
    number: number 
  }, 
  userInputs: { [key: string]: string }
) => {
  return Array.from(word.word).every((letter, idx) => {
    const inputKey = `${word.number}-${idx}`;
    const userInput = userInputs[inputKey];
    return (userInput || '').toLowerCase() === letter.toLowerCase();
  });
};