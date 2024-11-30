import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";

type WordGenerationMode = "ai" | "custom";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let words: string[] = [];
      let descriptions: string[] = [];
      
      if (mode === "ai") {
        const wordsPrompt = `Generate 10 English words related to the topic: ${topic}. Return only the words separated by commas, no explanations.`;
        const wordsResponse = await generateWorksheet(wordsPrompt);
        words = wordsResponse.split(",").map(word => word.trim());
        
        const descriptionsPrompt = `Generate short, one-line descriptions for these words related to ${topic}: ${words.join(", ")}. Return only the descriptions separated by semicolons, in the same order as the words.`;
        const descriptionsResponse = await generateWorksheet(descriptionsPrompt);
        descriptions = descriptionsResponse.split(";").map(desc => desc.trim());
      } else {
        words = customWords.split(",").map(word => word.trim());
        descriptions = words.map(word => `Enter the word that means: ${word}`);
      }

      const crossword = generateCrossword(words);
      crossword.placedWords = crossword.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
      }));

      // Generate a unique ID (timestamp + random string)
      const puzzleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      
      // Store the puzzle data in localStorage (in a real app, this would be in a database)
      localStorage.setItem(`crossword-${puzzleId}`, JSON.stringify({
        grid: crossword.grid,
        placedWords: crossword.placedWords,
        size: crossword.size
      }));

      // Navigate to the puzzle page
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
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordGenerator;