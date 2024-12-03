import React from 'react';
import { GridCell } from './GridCell';

interface GridRowProps {
  row: string[];
  y: number;
  placedWords: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
  }>;
  userInputs: { [key: string]: string };
  checkedWords: { [key: number]: boolean };
  onInputChange: (number: number, index: number, value: string) => void;
  onKeyDown: (wordNumber: number, word: string) => (e: React.KeyboardEvent) => void;
  getWordsAtCell: (x: number, y: number) => Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
  }>;
}

export const GridRow = ({
  row,
  y,
  placedWords,
  userInputs,
  checkedWords,
  onInputChange,
  onKeyDown,
  getWordsAtCell
}: GridRowProps) => {
  return (
    <div className="flex">
      {row.map((cell, x) => {
        const wordsAtCell = getWordsAtCell(x, y);
        const number = placedWords.find(
          word => word.position.x === x && word.position.y === y
        )?.number;

        return (
          <GridCell
            key={`${x}-${y}`}
            x={x}
            y={y}
            cell={cell}
            number={number}
            wordsAtCell={wordsAtCell}
            userInputs={userInputs}
            checkedWords={checkedWords}
            onInputChange={onInputChange}
            onKeyDown={onKeyDown}
          />
        );
      })}
    </div>
  );
};