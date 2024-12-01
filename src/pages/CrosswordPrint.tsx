import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CrosswordCell } from "@/components/CrosswordCell";
import { CrosswordClues } from "@/components/CrosswordClues";

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

interface CrosswordData {
  grid: string[][];
  placedWords: PlacedWord[];
  size: number;
}

const CrosswordPrint = () => {
  const { id } = useParams();
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(`crossword-${id}`);
    if (data) {
      setCrosswordData(JSON.parse(data));
    }
  }, [id]);

  useEffect(() => {
    if (crosswordData) {
      // Auto-trigger print when the data is loaded
      window.print();
    }
  }, [crosswordData]);

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white p-8 print:p-0">
      <div className="max-w-4xl mx-auto print:max-w-none">
        <div className="space-y-8 print:space-y-4">
          <h1 className="text-3xl font-bold text-center print:text-2xl">Crossword Puzzle</h1>
          
          <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
            {crosswordData.grid.map((row, y) => (
              <div key={y} className="flex">
                {row.map((cell, x) => {
                  const placedWord = crosswordData.placedWords.find(
                    word => 
                      (word.position.horizontal && word.position.y === y && x >= word.position.x && x < word.position.x + word.word.length) ||
                      (!word.position.horizontal && word.position.x === x && y >= word.position.y && y < word.position.y + word.word.length)
                  );

                  const number = crosswordData.placedWords.find(
                    word => word.position.x === x && word.position.y === y
                  )?.number;

                  if (!cell) {
                    return (
                      <div
                        key={`${x}-${y}`}
                        className="w-8 h-8 bg-neutral-800 print:w-10 print:h-10"
                      />
                    );
                  }

                  return (
                    <CrosswordCell
                      key={`${x}-${y}`}
                      x={x}
                      y={y}
                      number={number}
                      value=""
                      correctValue={cell}
                      isWordChecked={false}
                      showSolution={false}
                      onChange={() => {}}
                      onKeyDown={() => {}}
                    />
                  );
                })}
              </div>
            ))}
          </div>

          <CrosswordClues placedWords={crosswordData.placedWords} />
          
          <div className="text-center text-sm text-gray-500 print:mt-8">
            © {new Date().getFullYear()} TeachSheets AI
          </div>
        </div>
      </div>
    </div>
  );
};

export default CrosswordPrint;