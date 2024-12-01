import React from 'react';
import { CrosswordClues } from './CrosswordClues';

interface PrintableViewProps {
  grid: string[][];
  placedWords: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
    description?: string;
  }>;
}

export const PrintableView = ({ grid, placedWords }: PrintableViewProps) => {
  return (
    <div className="print:block hidden">
      <div className="p-8 bg-white relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Crossword Puzzle</h1>

        <div className="grid gap-px bg-neutral-200 w-fit mx-auto mb-8">
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const number = placedWords.find(
                  word => word.position.x === x && word.position.y === y
                )?.number;

                return cell ? (
                  <div key={`${x}-${y}`} className="w-10 h-10 relative bg-white border border-neutral-300">
                    {number && (
                      <span className="absolute top-0 left-0 text-[10px] p-[2px]">
                        {number}
                      </span>
                    )}
                  </div>
                ) : (
                  <div key={`${x}-${y}`} className="w-10 h-10 bg-neutral-800" />
                );
              })}
            </div>
          ))}
        </div>

        <CrosswordClues placedWords={placedWords} />

        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} TeachSheets AI
        </div>
      </div>
    </div>
  );
};