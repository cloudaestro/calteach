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
      <div className="p-8 relative">
        <h1 className="text-2xl font-bold mb-6 text-center">Crossword Puzzle</h1>

        {/* Grid container with outer border */}
        <div className="w-fit mx-auto mb-8 border border-neutral-800">
          {grid.map((row, y) => (
            <div key={y} className="flex">
              {row.map((cell, x) => {
                const number = placedWords.find(
                  word => word.position.x === x && word.position.y === y
                )?.number;

                return cell ? (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-10 h-10 relative border-r border-b border-neutral-800"
                    style={{ 
                      borderCollapse: 'collapse',
                      boxSizing: 'border-box'
                    }}
                  >
                    {number && (
                      <span className="absolute top-0.5 left-0.5 text-[10px] leading-none font-medium">
                        {number}
                      </span>
                    )}
                  </div>
                ) : (
                  <div 
                    key={`${x}-${y}`} 
                    className="w-10 h-10 border-r border-b border-neutral-800"
                    style={{ 
                      borderCollapse: 'collapse',
                      boxSizing: 'border-box',
                      backgroundColor: '#000'
                    }}
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