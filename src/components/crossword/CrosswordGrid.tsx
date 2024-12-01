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
  return (
    <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
      {grid.map((row, y) => (
        <div key={y} className="flex">
          {row.map((cell, x) => {
            const placedWord = placedWords.find(
              word =>
                (word.position.horizontal && word.position.y === y && x >= word.position.x && x < word.position.x + word.word.length) ||
                (!word.position.horizontal && word.position.x === x && y >= word.position.y && y < word.position.y + word.word.length)
            );

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

            if (!placedWord) {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-white border border-neutral-300"
                />
              );
            }

            const index = placedWord.position.horizontal
              ? x - placedWord.position.x
              : y - placedWord.position.y;

            const inputKey = `${placedWord.number}-${index}`;
            const isWordChecked = checkedWords[placedWord.number];

            // Calculate if the entire word is correct
            const isWordCorrect = isWordChecked && placedWord.word.split('').every((letter, idx) => {
              const input = userInputs[`${placedWord.number}-${idx}`] || '';
              return input.toLowerCase() === letter.toLowerCase();
            });

            return (
              <CrosswordCell
                key={`${x}-${y}`}
                x={x}
                y={y}
                number={number}
                value={userInputs[inputKey] || ''}
                correctValue={cell}
                isWordChecked={isWordChecked}
                showSolution={false}
                isWordCorrect={isWordCorrect}
                onChange={(value) => onInputChange(placedWord.number, index, value)}
                onKeyDown={onKeyDown(placedWord.number, placedWord.word)}
              />
            );
          })}
        </div>
      ))}
    </div>
  );
};