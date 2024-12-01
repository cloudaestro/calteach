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
    <div className="printable-content hidden">
      <div className="p-8 bg-white relative">
        {/* Watermark */}
        <div 
          className="absolute inset-0 flex items-center justify-center opacity-20 select-none"
          style={{
            transform: 'rotate(-45deg)',
            fontSize: '2rem',
            color: '#666',
            zIndex: 10
          }}
        >
          <div className="whitespace-nowrap text-center">
            CROSSWORD PUZZLE
            <br />
            FREE VERSION
          </div>
        </div>

        {/* Content */}
        <div className="relative z-20">
          <h1 className="text-2xl font-bold mb-6 text-center">Crossword Puzzle</h1>

          {/* Grid */}
          <div className="grid gap-px bg-neutral-200 w-fit mx-auto mb-8">
            {grid.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  const number = placedWords.find(
                    word => word.position.x === x && word.position.y === y
                  )?.number;

                  return cell ? (
                    <div 
                      key={`${x}-${y}`} 
                      className="w-8 h-8 relative bg-white border border-neutral-300"
                    >
                      {number && (
                        <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                          {number}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div 
                      key={`${x}-${y}`} 
                      className="w-8 h-8 bg-neutral-800" 
                    />
                  );
                })}
              </div>
            ))}
          </div>

          {/* Clues */}
          <CrosswordClues placedWords={placedWords} />

          {/* Footer */}
          <div className="text-center text-sm text-gray-500 mt-8">
            © {new Date().getFullYear()} Crossword Puzzle Generator
          </div>
        </div>
      </div>
    </div>
  );
};