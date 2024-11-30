import React from 'react';

interface CrosswordGridProps {
  grid: string[][];
  placedWords: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
  }>;
  userInputs: { [key: string]: string };
  onInputChange: (number: number, index: number, value: string) => void;
}

export const CrosswordGrid = ({ grid, placedWords, userInputs, onInputChange }: CrosswordGridProps) => {
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

            const number = placedWords.find(
              word => word.position.x === x && word.position.y === y
            )?.number;

            if (cell === '') {
              return (
                <div
                  key={`${x}-${y}`}
                  className="w-8 h-8 bg-neutral-800"
                />
              );
            }

            const inputKey = `${placedWord?.number}-${
              placedWord?.position.horizontal
                ? x - placedWord.position.x
                : y - placedWord.position.y
            }`;

            return (
              <div
                key={`${x}-${y}`}
                className="w-8 h-8 relative bg-white border border-neutral-300"
              >
                {number && (
                  <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                    {number}
                  </span>
                )}
                <input
                  type="text"
                  maxLength={1}
                  className="w-full h-full text-center uppercase bg-transparent focus:outline-none"
                  value={userInputs[inputKey] || ''}
                  onChange={(e) => {
                    if (placedWord) {
                      const index = placedWord.position.horizontal
                        ? x - placedWord.position.x
                        : y - placedWord.position.y;
                      onInputChange(placedWord.number, index, e.target.value);
                    }
                  }}
                />
              </div>
            );
          })}
        </div>
      ))}
    </div>
  );
};