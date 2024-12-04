import React, { useRef, useState } from 'react';
import { GridRow } from './grid/GridRow';

interface CrosswordGridProps {
  grid: string[][];
  placedWords: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
  }>;
  userInputs: { [key: string]: string };
  checkedWords: { [key: number]: boolean };
  onInputChange: (number: number, index: number, value: string) => void;
  onKeyDown: (wordNumber: number, word: string) => (e: React.KeyboardEvent) => void;
}

export const CrosswordGrid = ({
  grid,
  placedWords,
  userInputs,
  checkedWords,
  onInputChange,
  onKeyDown
}: CrosswordGridProps) => {
  const [activeDirection, setActiveDirection] = useState<'horizontal' | 'vertical'>('horizontal');
  const [activeWordNumber, setActiveWordNumber] = useState<number | null>(null);
  const lastInteractionRef = useRef<number>(Date.now());

  // Helper function to get all words that use a specific cell
  const getWordsAtCell = (x: number, y: number) => {
    return placedWords.filter(word => {
      if (word.position.horizontal) {
        return y === word.position.y &&
          x >= word.position.x &&
          x < word.position.x + word.word.length;
      } else {
        return x === word.position.x &&
          y >= word.position.y &&
          y < word.position.y + word.word.length;
      }
    });
  };

  // Function to find and focus the next cell
  const focusNextCell = (wordNumber: number, currentIndex: number) => {
    const word = placedWords.find(w => w.number === wordNumber);
    if (!word) return;

    const nextIndex = currentIndex + 1;
    if (nextIndex < word.word.length) {
      const nextX = word.position.horizontal ? word.position.x + nextIndex : word.position.x;
      const nextY = word.position.horizontal ? word.position.y : word.position.y + nextIndex;
      const nextCell = document.querySelector(`[data-cell="cell-${nextX}-${nextY}"]`) as HTMLInputElement;
      if (nextCell) {
        nextCell.focus();
      }
    }
  };

  // Enhanced input change handler
  const handleInputChange = (wordNumber: number, index: number, value: string) => {
    onInputChange(wordNumber, index, value);
    if (value) {
      focusNextCell(wordNumber, index);
    }
  };

  // Handle cell focus with direction persistence
  const handleCellFocus = (wordNumber: number, isHorizontal: boolean) => {
    const now = Date.now();
    // Only change direction if it's been more than 500ms since the last interaction
    if (now - lastInteractionRef.current > 500) {
      setActiveDirection(isHorizontal ? 'horizontal' : 'vertical');
      lastInteractionRef.current = now;
    }
    setActiveWordNumber(wordNumber);
  };

  return (
    <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
      {grid.map((row, y) => (
        <GridRow
          key={y}
          row={row}
          y={y}
          placedWords={placedWords}
          userInputs={userInputs}
          checkedWords={checkedWords}
          onInputChange={handleInputChange}
          onKeyDown={onKeyDown}
          getWordsAtCell={getWordsAtCell}
          activeDirection={activeDirection}
          activeWordNumber={activeWordNumber}
          onCellFocus={handleCellFocus}
        />
      ))}
    </div>
  );
};