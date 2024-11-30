import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";

type WordGenerationMode = "ai" | "custom";

const CrosswordWorksheet = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);
  const [crosswordData, setCrosswordData] = useState<{
    grid: string[][];
    placedWords: Array<{
      word: string;
      position: { x: number; y: number; horizontal: boolean };
      number: number;
    }>;
    size: number;
  } | null>(null);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let words: string[] = [];
      if (mode === "ai") {
        const prompt = `Generate 10 English words related to the topic: ${topic}. Return only the words separated by commas, no explanations.`;
        const response = await generateWorksheet(prompt);
        words = response.split(",").map(word => word.trim());
      } else {
        words = customWords.split(",").map(word => word.trim());
      }
      setGeneratedWords(words);
      
      // Generate crossword puzzle
      const crossword = generateCrossword(words);
      setCrosswordData(crossword);
    } catch (error) {
      console.error("Error generating crossword:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Card>
          <CardHeader>
            <CardTitle>Create Crossword Worksheet</CardTitle>
            <CardDescription>
              Generate a crossword puzzle with AI-generated words or your custom words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium">Generation Mode</label>
              <Select value={mode} onValueChange={(value: WordGenerationMode) => setMode(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select mode" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="ai">AI Generated Words</SelectItem>
                  <SelectItem value="custom">Custom Words</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {mode === "ai" ? (
              <div className="space-y-2">
                <label className="text-sm font-medium">Topic</label>
                <Input
                  placeholder="Enter a topic (e.g., animals, sports, food)"
                  value={topic}
                  onChange={(e) => setTopic(e.target.value)}
                />
              </div>
            ) : (
              <div className="space-y-2">
                <label className="text-sm font-medium">Custom Words</label>
                <Input
                  placeholder="Enter words separated by commas"
                  value={customWords}
                  onChange={(e) => setCustomWords(e.target.value)}
                />
                <p className="text-sm text-neutral-500">
                  Enter words separated by commas (e.g., cat, dog, bird)
                </p>
              </div>
            )}

            <Button
              onClick={handleGenerate}
              disabled={isGenerating || (mode === "ai" ? !topic : !customWords)}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Crossword"}
            </Button>

            {crosswordData && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Generated Crossword:</h3>
                <div className="grid gap-px bg-neutral-200 w-fit mx-auto">
                  {crosswordData.grid.map((row, y) => (
                    <div key={y} className="flex">
                      {row.map((cell, x) => {
                        const number = crosswordData.placedWords.find(
                          word => word.position.x === x && word.position.y === y
                        )?.number;

                        return (
                          <div
                            key={`${x}-${y}`}
                            className={`w-8 h-8 relative flex items-center justify-center ${
                              cell ? 'bg-white' : 'bg-neutral-800'
                            }`}
                          >
                            {number && (
                              <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                                {number}
                              </span>
                            )}
                            {cell && <span className="text-sm">{cell}</span>}
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
                            {word.number}. {word.word}
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
                            {word.number}. {word.word}
                          </li>
                        ))}
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordWorksheet;