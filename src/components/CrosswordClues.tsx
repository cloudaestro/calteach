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
    <div className="flex flex-col md:flex-row print:flex-row w-full gap-8 print:gap-16">
      <div className="flex-1">
        <h3 className="font-bold mb-4 text-lg border-b pb-2">Across</h3>
        <div className="space-y-3">
          {horizontalWords
            .sort((a, b) => a.number - b.number)
            .map((word) => (
              <div key={word.number} className="flex items-start">
                <span className="font-medium w-8 flex-shrink-0">{word.number}.</span>
                <span className="flex-1">{word.description || word.word}</span>
              </div>
            ))}
        </div>
      </div>

      <div className="flex-1">
        <h3 className="font-bold mb-4 text-lg border-b pb-2">Down</h3>
        <div className="space-y-3">
          {verticalWords
            .sort((a, b) => a.number - b.number)
            .map((word) => (
              <div key={word.number} className="flex items-start">
                <span className="font-medium w-8 flex-shrink-0">{word.number}.</span>
                <span className="flex-1">{word.description || word.word}</span>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};