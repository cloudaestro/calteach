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

  // Prioritize horizontal words when both directions are available
  const primaryWord = wordsAtCell.find(word => word.position.horizontal) || wordsAtCell[0];
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