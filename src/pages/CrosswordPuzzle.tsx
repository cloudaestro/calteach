import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";

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

const CrosswordPuzzle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  useEffect(() => {
    const data = localStorage.getItem(`crossword-${id}`);
    if (data) {
      setCrosswordData(JSON.parse(data));
    }
  }, [id]);

  const handleInputChange = (number: number, index: number, value: string) => {
    const key = `${number}-${index}`;
    setUserInputs(prev => ({
      ...prev,
      [key]: value.toUpperCase()
    }));
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardContent className="space-y-4 p-6">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-2xl font-bold">Crossword Puzzle</h2>
              <Button variant="outline" onClick={() => navigate("/crossword")}>
                Create New Puzzle
              </Button>
            </div>

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

                    const isInputCell = cell !== '';

                    if (!isInputCell) {
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
                              handleInputChange(placedWord.number, index, e.target.value);
                            }
                          }}
                        />
                      </div>
                    );
                  })}
                </div>
              ))}
            </div>

            <div className="mt-6 space-y-4">
              <div>
                <h4 className="font-medium mb-2">Across:</h4>
                <ul className="space-y-1">
                  {crosswordData.placedWords
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
                  {crosswordData.placedWords
                    .filter(word => !word.position.horizontal)
                    .map(word => (
                      <li key={word.number} className="text-sm">
                        {word.number}. {word.description}
                      </li>
                    ))}
                </ul>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;