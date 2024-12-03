import React from 'react';

interface CrosswordCluesProps {
  placedWords: Array<{
    word: string;
    position: { x: number; y: number; horizontal: boolean };
    number: number;
    description?: string;
  }>;
}

export const CrosswordClues: React.FC<CrosswordCluesProps> = ({ placedWords }) => {
  const horizontalWords = placedWords.filter(word => word.position.horizontal);
  const verticalWords = placedWords.filter(word => !word.position.horizontal);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 print:grid-cols-2 print:gap-4">
      <div>
        <h3 className="font-bold mb-2 text-lg">Across</h3>
        <div className="space-y-2">
          {horizontalWords
            .sort((a, b) => a.number - b.number)
            .map((word) => (
              <div key={word.number} className="flex">
                <span className="font-medium min-w-[2rem]">{word.number}.</span>
                <span>{word.description || word.word}</span>
              </div>
            ))}
        </div>
      </div>

      <div>
        <h3 className="font-bold mb-2 text-lg">Down</h3>
        <div className="space-y-2">
          {verticalWords
            .sort((a, b) => a.number - b.number)
            .map((word) => (
              <div key={word.number} className="flex">
                <span className="font-medium min-w-[2rem]">{word.number}.</span>
                <span>{word.description || word.word}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};