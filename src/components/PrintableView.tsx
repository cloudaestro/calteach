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
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] rotate-[-35deg] text-4xl font-bold text-neutral-400 print:block hidden">
          TeachSheets AI
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Crossword Puzzle</h1>

        {/* Updated grid styling for perfect alignment */}
        <div className="grid gap-0 w-fit mx-auto mb-8 border border-neutral-300">
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const number = placedWords.find(
                  word => word.position.x === x && word.position.y === y
                )?.number;

                return cell ? (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-10 h-10 relative bg-white border-r border-b border-neutral-300 last:border-r-0"
                  >
                    {number && (
                      <span className="absolute top-0.5 left-0.5 text-[10px] leading-none">
                        {number}
                      </span>
                    )}
                  </div>
                ) : (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-10 h-10 bg-neutral-800 border-r border-b border-neutral-300 last:border-r-0" 
                  />
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