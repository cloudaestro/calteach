import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { generateWorksheet } from "@/lib/gemini";

type WordGenerationMode = "ai" | "custom";

const CrosswordWorksheet = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [generatedWords, setGeneratedWords] = useState<string[]>([]);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      if (mode === "ai") {
        const prompt = `Generate 10 English words related to the topic: ${topic}. Return only the words separated by commas, no explanations.`;
        const response = await generateWorksheet(prompt);
        const words = response.split(",").map(word => word.trim());
        setGeneratedWords(words);
      } else {
        const words = customWords.split(",").map(word => word.trim());
        setGeneratedWords(words);
      }
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

            {generatedWords.length > 0 && (
              <div className="mt-4">
                <h3 className="font-medium mb-2">Generated Words:</h3>
                <div className="bg-white p-4 rounded-lg border">
                  {generatedWords.join(", ")}
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