import React from 'react';

interface PlacedWord {
  word: string;
  position: {
    x: number;
    y: number;
    horizontal: boolean;
  };
  number: number;
  description?: string;
}

interface CrosswordCluesProps {
  placedWords: PlacedWord[];
}

export const CrosswordClues = ({ placedWords }: CrosswordCluesProps) => {
  return (
    <div className="mt-6 space-y-4">
      <div>
        <h4 className="font-medium mb-2">Across:</h4>
        <ul className="space-y-1">
          {placedWords
            .filter(word => word.position.horizontal)
            .map(word => (
              <li key={word.number} className="text-sm">
                {word.number}. {word.description}
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">Down:</h4>
        <ul className="space-y-1">
          {placedWords
            .filter(word => !word.position.horizontal)
            .map(word => (
              <li key={word.number} className="text-sm">
                {word.number}. {word.description}
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};