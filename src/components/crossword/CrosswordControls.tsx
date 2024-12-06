import React from 'react';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";

interface CrosswordControlsProps {
  placedWords: Array<{
    number: number;
    word: string;
  }>;
}

export const CrosswordControls: React.FC<CrosswordControlsProps> = ({
  placedWords
}) => {
  return (
    <div className="flex justify-between items-center mb-4">
      <h2 className="text-2xl font-bold">Crossword Puzzle</h2>
      <Sheet>
        <SheetTrigger asChild>
          <Button variant="outline">Show Answers</Button>
        </SheetTrigger>
        <SheetContent>
          <SheetHeader>
            <SheetTitle>Answers</SheetTitle>
          </SheetHeader>
          <div className="mt-4">
            {placedWords.map((word, index) => (
              <div key={index} className="mb-2">
                <span className="font-bold">{word.number}. </span>
                <span>{word.word}</span>
              </div>
            ))}
          </div>
        </SheetContent>
      </Sheet>
    </div>
  );
};