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

interface AnswerSheetProps {
  placedWords: PlacedWord[];
}

export const AnswerSheet = ({ placedWords }: AnswerSheetProps) => {
  // Sort words by their number
  const sortedWords = [...placedWords].sort((a, b) => a.number - b.number);

  return (
    <div className="print:block hidden">
      <div className="p-8 bg-white relative page-break-before-always">
        {/* Watermark */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] rotate-[-35deg] text-4xl font-bold text-neutral-400 print:block hidden">
          TeachSheets AI
        </div>

        <h1 className="text-2xl font-bold mb-6 text-center">Answer Sheet</h1>

        <div className="grid grid-cols-2 gap-4">
          {sortedWords.map((word, index) => (
            <div key={index} className="flex gap-2">
              <span className="font-bold">{word.number}.</span>
              <span className="uppercase">{word.word}</span>
            </div>
          ))}
        </div>

        <div className="text-center text-sm text-gray-500 mt-8">
          © {new Date().getFullYear()} TeachSheets AI
        </div>
      </div>
    </div>
  );
};