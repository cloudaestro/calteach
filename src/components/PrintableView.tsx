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

        {/* Print-optimized puzzle grid */}
        <div className="flex justify-center mb-8">
          <table 
            style={{ 
              borderCollapse: 'collapse',
              border: '2px solid black',
              tableLayout: 'fixed',
              width: 'auto'
            }}
          >
            <tbody>
              {grid.map((row, y) => (
                <tr key={y} style={{ height: '30px' }}>
                  {row.map((cell, x) => {
                    const number = placedWords.find(
                      word => word.position.x === x && word.position.y === y
                    )?.number;

                    return (
                      <td 
                        key={`${x}-${y}`}
                        style={{
                          width: '30px',
                          height: '30px',
                          border: '1px solid black',
                          padding: '0px',
                          position: 'relative',
                          backgroundColor: cell ? 'white' : '#2C3333',
                          textAlign: 'center',
                          verticalAlign: 'middle'
                        }}
                      >
                        {cell && number && (
                          <span style={{
                            position: 'absolute',
                            top: '1px',
                            left: '1px',
                            fontSize: '8px',
                            lineHeight: '8px',
                            fontFamily: 'Arial, sans-serif'
                          }}>
                            {number}
                          </span>
                        )}
                      </td>
                    );
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <CrosswordClues placedWords={placedWords} />

        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} TeachSheets AI
        </div>
      </div>
    </div>
  );
};