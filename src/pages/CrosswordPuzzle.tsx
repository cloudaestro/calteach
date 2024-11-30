import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { CrosswordCell } from "@/components/CrosswordCell";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useToast } from "@/hooks/use-toast";

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
  const { toast } = useToast();
  const [crosswordData, setCrosswordData] = useState<CrosswordData | null>(null);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [showSolution, setShowSolution] = useState(false);

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

  const checkAnswers = () => {
    if (!crosswordData) return;

    let allCorrect = true;
    let totalAnswered = 0;

    crosswordData.placedWords.forEach(word => {
      for (let i = 0; i < word.word.length; i++) {
        const key = `${word.number}-${i}`;
        const userInput = userInputs[key]?.toLowerCase() || '';
        const correctLetter = word.word[i].toLowerCase();
        
        if (userInput) {
          totalAnswered++;
        }
        
        if (userInput !== correctLetter) {
          allCorrect = false;
        }
      }
    });

    setShowSolution(true);

    if (allCorrect && totalAnswered === crosswordData.placedWords.reduce((acc, word) => acc + word.word.length, 0)) {
      toast({
        title: "Perfect!",
        description: "All answers are correct! 🎉",
      });
    } else {
      toast({
        title: "Keep trying!",
        description: "Some answers are incorrect. Correct answers are shown in green.",
        variant: "destructive",
      });
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      checkAnswers();
    }
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
              <div className="space-x-2">
                <Button variant="outline" onClick={() => navigate("/crossword")}>
                  Create New Puzzle
                </Button>
                <Button onClick={checkAnswers}>
                  Check Answers
                </Button>
              </div>
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

                    const correctLetter = placedWord?.word[
                      placedWord.position.horizontal
                        ? x - placedWord.position.x
                        : y - placedWord.position.y
                    ] || '';

                    return (
                      <CrosswordCell
                        key={`${x}-${y}`}
                        x={x}
                        y={y}
                        number={number}
                        value={userInputs[inputKey] || ''}
                        correctValue={correctLetter}
                        showSolution={showSolution}
                        onChange={(value) => {
                          if (placedWord) {
                            const index = placedWord.position.horizontal
                              ? x - placedWord.position.x
                              : y - placedWord.position.y;
                            handleInputChange(placedWord.number, index, value);
                          }
                        }}
                        onKeyDown={handleKeyDown}
                      />
                    );
                  })}
                </div>
              ))}
            </div>

            <CrosswordClues placedWords={crosswordData.placedWords} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordPuzzle;