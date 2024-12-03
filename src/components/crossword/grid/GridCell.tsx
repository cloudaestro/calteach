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
  // If there's only one word, use that
  // If there are both, check if we're in the middle of filling either word
  const primaryWord = (() => {
    if (wordsAtCell.length === 1) return wordsAtCell[0];
    
    // Check if we're in the middle of filling either word
    const horizontalIndex = horizontalWord ? x - horizontalWord.position.x : -1;
    const verticalIndex = verticalWord ? y - verticalWord.position.y : -1;
    
    const isFillingHorizontal = horizontalWord && Array.from(horizontalWord.word).some((_, idx) => {
      const key = `${horizontalWord.number}-${idx}`;
      return userInputs[key];
    });
    
    const isFillingVertical = verticalWord && Array.from(verticalWord.word).some((_, idx) => {
      const key = `${verticalWord.number}-${idx}`;
      return userInputs[key];
    });

    // Prioritize the word that's being filled
    if (isFillingHorizontal && !isFillingVertical) return horizontalWord;
    if (isFillingVertical && !isFillingHorizontal) return verticalWord;
    
    // If neither or both are being filled, prefer the one that has this cell's position
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