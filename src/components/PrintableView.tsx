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
    <div className="print:block hidden p-8 relative min-h-[297mm] w-[210mm] mx-auto bg-white">
      {/* Watermark */}
      <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-20 rotate-[-45deg] text-4xl text-gray-400 font-bold select-none">
        <div className="whitespace-nowrap text-center">
          CROSSWORD PUZZLE
          <br />
          FREE VERSION
        </div>
      </div>

      <h1 className="text-2xl font-bold mb-6 text-center">Crossword Puzzle</h1>

      <div className="grid gap-px bg-neutral-200 w-fit mx-auto mb-8">
        {grid.map((row, y) => (
          <div key={y} className="flex">
            {row.map((cell, x) => {
              const number = placedWords.find(
                word => word.position.x === x && word.position.y === y
              )?.number;

              return cell ? (
                <div key={`${x}-${y}`} className="w-8 h-8 relative bg-white border border-neutral-300">
                  {number && (
                    <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                      {number}
                    </span>
                  )}
                </div>
              ) : (
                <div key={`${x}-${y}`} className="w-8 h-8 bg-neutral-800" />
              );
            })}
          </div>
        ))}
      </div>

      <CrosswordClues placedWords={placedWords} />

      <div className="text-center text-sm text-gray-500 mt-8">
        © {new Date().getFullYear()} Crossword Puzzle Generator
      </div>
    </div>
  );
};