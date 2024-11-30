import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";

type WordGenerationMode = "ai" | "custom";
type DifficultyLevel = "easy" | "medium" | "hard";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
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
        // Modified prompt to get more specific words
        const wordsPrompt = `Generate ${wordCount} ${difficultyDesc} ${topic}. Return only the specific names separated by commas, no explanations or descriptions. For example, if the topic is "Animals", return "lion, tiger, elephant" etc.`;
        const wordsResponse = await generateWorksheet(wordsPrompt);
        words = wordsResponse.split(",").map(word => word.trim()).slice(0, wordCount);
        
        // Modified prompt to get more direct descriptions
        const descriptionsPrompt = `For each of these ${topic}: ${words.join(", ")}, generate a simple, direct description that clearly identifies what it is. Each description should start with "A/An" and be factual. For example: "A large African cat with a mane" for lion. Return only the descriptions separated by semicolons, in the same order as the words.`;
        const descriptionsResponse = await generateWorksheet(descriptionsPrompt);
        descriptions = descriptionsResponse.split(";").map(desc => desc.trim());
      } else {
        words = customWords.split(",").map(word => word.trim()).slice(0, wordCount);
        descriptions = words.map(word => `Enter the word that means: ${word}`);
      }

      const crossword = generateCrossword(words);
      crossword.placedWords = crossword.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
      }));

      const puzzleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      localStorage.setItem(`crossword-${puzzleId}`, JSON.stringify({
        grid: crossword.grid,
        placedWords: crossword.placedWords,
        size: crossword.size,
        difficulty,
        topic: mode === "ai" ? topic : "Custom Words"
      }));

      navigate(`/crossword/${puzzleId}`);
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
