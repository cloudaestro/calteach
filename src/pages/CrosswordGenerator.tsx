import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { useToast } from "@/hooks/use-toast";

type WordGenerationMode = "ai" | "custom";
type DifficultyLevel = "easy" | "medium" | "hard";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
  const { toast } = useToast();
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [wordCount, setWordCount] = useState(10);

  const getDifficultyPrompt = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "easy":
        return "simple and common";
      case "medium":
        return "moderate complexity";
      case "hard":
        return "challenging and sophisticated";
      default:
        return "moderate complexity";
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let words: string[] = [];
      let descriptions: string[] = [];
      
      if (mode === "ai") {
        const difficultyDesc = getDifficultyPrompt(difficulty);
        // Modified prompt to ensure we get exactly the number of words requested
        const wordsPrompt = `Generate exactly ${wordCount} different ${difficultyDesc} words related to ${topic}. Return ONLY the specific words separated by commas, no explanations. Each word should be between 3 and 15 letters long.`;
        const wordsResponse = await generateWorksheet(wordsPrompt);
        words = wordsResponse.split(",")
          .map(word => word.trim())
          .filter(word => word.length >= 3 && word.length <= 15)
          .slice(0, wordCount);

        // If we didn't get enough words, request more
        if (words.length < wordCount) {
          const remainingCount = wordCount - words.length;
          const additionalPrompt = `Generate ${remainingCount} more different ${difficultyDesc} words related to ${topic}. Return ONLY the words separated by commas.`;
          const additionalResponse = await generateWorksheet(additionalPrompt);
          const additionalWords = additionalResponse.split(",")
            .map(word => word.trim())
            .filter(word => word.length >= 3 && word.length <= 15)
            .slice(0, remainingCount);
          words = [...words, ...additionalWords];
        }
        
        const descriptionsPrompt = `For each of these ${topic} words: ${words.join(", ")}, generate a clear, concise clue that would be suitable for a crossword puzzle. Each clue should be specific and helpful. Return only the clues separated by semicolons, in the same order as the words.`;
        const descriptionsResponse = await generateWorksheet(descriptionsPrompt);
        descriptions = descriptionsResponse.split(";").map(desc => desc.trim());
      } else {
        words = customWords.split(",")
          .map(word => word.trim())
          .filter(word => word.length >= 3 && word.length <= 15)
          .slice(0, wordCount);
        descriptions = words.map(word => `Enter the word that means: ${word}`);
      }

      if (words.length < 3) {
        throw new Error("Not enough valid words generated. Please try again.");
      }

      const crosswordResult = await generateCrossword(words);
      const enhancedPlacedWords = crosswordResult.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
      }));

      const puzzleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(`crossword-${puzzleId}`, JSON.stringify({
        grid: crosswordResult.grid,
        placedWords: enhancedPlacedWords,
        size: crosswordResult.size,
        difficulty,
        topic: mode === "ai" ? topic : "Custom Words"
      }));

      navigate(`/crossword/${puzzleId}`);
    } catch (error) {
      console.error("Error generating crossword:", error);
      toast({
        title: "Error",
        description: "Failed to generate crossword puzzle. Please try again.",
        variant: "destructive",
      });
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
          <CardContent className="space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Words: {wordCount}</label>
              <Slider
                value={[wordCount]}
                onValueChange={(value) => setWordCount(value[0])}
                min={5}
                max={15}
                step={1}
                className="w-full"
              />
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordGenerator;