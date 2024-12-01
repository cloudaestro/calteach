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

  return (
    <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => {
            // Get all words that use this cell
            const wordsAtCell = getWordsAtCell(x, y);
            
            if (!cell) {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-neutral-800"
                />
              );
            }

            // Get the word number if this is the start of any word
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

            // For each word at this cell, check if it's correct
            const cellStates = wordsAtCell.map(word => {
              const index = word.position.horizontal
                ? x - word.position.x
                : y - word.position.y;

              const inputKey = `${word.number}-${index}`;
              const isWordChecked = checkedWords[word.number];

              if (!isWordChecked) return null;

              const isWordCorrect = Array.from(word.word).every((letter, idx) => {
                const input = (userInputs[`${word.number}-${idx}`] || '').trim().toLowerCase();
                return input === letter.toLowerCase();
              });

              return { isWordChecked, isWordCorrect };
            }).filter(Boolean);

            // Determine the overall state of the cell
            const isAnyWordChecked = cellStates.some(state => state?.isWordChecked);
            const areAllCheckedWordsCorrect = cellStates.every(state => state?.isWordCorrect);

            // Use the first word for input handling
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