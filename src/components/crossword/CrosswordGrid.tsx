import React from 'react';
import { CrosswordCell } from '../CrosswordCell';

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

  // Helper function to check if a word is correct
  const isWordCorrect = (word: typeof placedWords[0]) => {
    return Array.from(word.word).every((letter, idx) => {
      const inputKey = `${word.number}-${idx}`;
      const userInput = userInputs[inputKey];
      
      // If this cell is shared with another word and has input
      const pos = word.position.horizontal 
        ? { x: word.position.x + idx, y: word.position.y }
        : { x: word.position.x, y: word.position.y + idx };
      
      const wordsAtThisCell = getWordsAtCell(pos.x, pos.y);
      
      // If this cell is shared and has input from another word
      if (wordsAtThisCell.length > 1) {
        const otherWord = wordsAtThisCell.find(w => w.number !== word.number);
        if (otherWord) {
          const otherIdx = otherWord.position.horizontal
            ? pos.x - otherWord.position.x
            : pos.y - otherWord.position.y;
          const otherInputKey = `${otherWord.number}-${otherIdx}`;
          const otherInput = userInputs[otherInputKey];
          
          // Use either input if available
          const effectiveInput = userInput || otherInput || '';
          return effectiveInput.toLowerCase() === letter.toLowerCase();
        }
      }
      
      // Normal case - just check this word's input
      return (userInput || '').toLowerCase() === letter.toLowerCase();
    });
  };

  return (
    <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => {
            const wordsAtCell = getWordsAtCell(x, y);
            
            if (!cell) {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-neutral-800"
                />
              );
            }

            const number = placedWords.find(
              word => word.position.x === x && word.position.y === y
            )?.number;

            if (wordsAtCell.length === 0) {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-white border border-neutral-300"
                />
              );
            }

            // Check all words at this cell
            const cellStates = wordsAtCell.map(word => {
              if (!checkedWords[word.number]) return null;
              return {
                isWordChecked: true,
                isWordCorrect: isWordCorrect(word)
              };
            }).filter(Boolean);

            const isAnyWordChecked = cellStates.some(state => state?.isWordChecked);
            const areAllCheckedWordsCorrect = cellStates.every(state => state?.isWordCorrect);

            const primaryWord = wordsAtCell[0];
            const index = primaryWord.position.horizontal
              ? x - primaryWord.position.x
              : y - primaryWord.position.y;
            const inputKey = `${primaryWord.number}-${index}`;

            return (
              <CrosswordCell
                key={`${x}-${y}`}
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
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};