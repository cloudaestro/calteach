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

        {/* Centered puzzle grid with strict grid layout */}
        <div className="flex justify-center mb-8">
          <div 
            style={{ 
              display: 'grid',
              gridTemplateColumns: `repeat(${grid[0].length}, 25px)`,
              border: '1px solid #D4D4D4',
              width: 'fit-content'
            }}
          >
            {grid.map((row, y) => 
              row.map((cell, x) => {
                const number = placedWords.find(
                  word => word.position.x === x && word.position.y === y
                )?.number;

                return cell ? (
                  <div 
                    key={`${x}-${y}`} 
                    style={{
                      width: '25px',
                      height: '25px',
                      borderRight: '1px solid #D4D4D4',
                      borderBottom: '1px solid #D4D4D4',
                      backgroundColor: 'white',
                      position: 'relative'
                    }}
                  >
                    {number && (
                      <span 
                        style={{
                          position: 'absolute',
                          top: '2px',
                          left: '2px',
                          fontSize: '8px',
                          lineHeight: 1
                        }}
                      >
                        {number}
                      </span>
                    )}
                  </div>
                ) : (
                  <div 
                    key={`${x}-${y}`} 
                    style={{
                      width: '25px',
                      height: '25px',
                      borderRight: '1px solid #D4D4D4',
                      borderBottom: '1px solid #D4D4D4',
                      backgroundColor: '#2C3333'
                    }}
                  />
                );
              })
            )}
          </div>
        </div>

        <CrosswordClues placedWords={placedWords} />

        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} TeachSheets AI
        </div>
      </div>
    </div>
  );
};