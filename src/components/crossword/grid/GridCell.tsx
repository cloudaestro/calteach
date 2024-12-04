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
  activeDirection?: 'horizontal' | 'vertical';
  activeWordNumber?: number | null;
  onCellFocus?: (wordNumber: number, isHorizontal: boolean) => void;
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
  onKeyDown,
  activeDirection = 'horizontal',
  activeWordNumber = null,
  onCellFocus
}: GridCellProps) => {
  if (!cell) {
    return <div className="w-8 h-8 bg-neutral-800" />;
  }

  if (wordsAtCell.length === 0) {
    return <div className="w-8 h-8 bg-white border border-neutral-300" />;
  }

  const horizontalWord = wordsAtCell.find(word => word.position.horizontal);
  const verticalWord = wordsAtCell.find(word => !word.position.horizontal);

  const getPrimaryWord = () => {
    // If there's only one word, use it
    if (wordsAtCell.length === 1) return wordsAtCell[0];

    // If we have both horizontal and vertical words
    if (horizontalWord && verticalWord) {
      // If we have an active word number, use that word
      if (activeWordNumber) {
        const activeWord = wordsAtCell.find(w => w.number === activeWordNumber);
        if (activeWord) return activeWord;
      }

      // Use the word that matches the active direction
      return activeDirection === 'horizontal' ? horizontalWord : verticalWord;
    }

    // Default to whatever word we have
    return horizontalWord || verticalWord;
  };

  const primaryWord = getPrimaryWord();
  const index = primaryWord.position.horizontal
    ? x - primaryWord.position.x
    : y - primaryWord.position.y;
  const inputKey = `${primaryWord.number}-${index}`;

  const handleFocus = () => {
    if (onCellFocus) {
      onCellFocus(primaryWord.number, primaryWord.position.horizontal);
    }
  };

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
      onFocus={handleFocus}
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