import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { GenerationForm } from "@/components/crossword/GenerationForm";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { PrintableView } from "@/components/PrintableView";
import { ArrowLeft } from "lucide-react";

type WordGenerationMode = "ai" | "custom";

const CrosswordWorksheet = () => {
  const navigate = useNavigate();
  const [isGenerating, setIsGenerating] = useState(false);
  const [crosswordData, setCrosswordData] = useState<{
    grid: string[][];
    placedWords: Array<{
      word: string;
      position: { x: number; y: number; horizontal: boolean };
      number: number;
      description?: string;
    }>;
    size: number;
  } | null>(null);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});

  const handleGenerate = async (mode: WordGenerationMode, topic: string, customWords: string) => {
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
        // Parse custom words and descriptions from the new format
        const lines = customWords.split("\n").filter(line => line.trim());
        lines.forEach(line => {
          const [word, description] = line.split(":").map(part => part.trim());
          if (word && description) {
            words.push(word);
            descriptions.push(description);
          }
        });
      }

      const crosswordResult = await generateCrossword(words);
      const enhancedPlacedWords = crosswordResult.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
      }));

      setCrosswordData({
        grid: crosswordResult.grid,
        placedWords: enhancedPlacedWords,
        size: crosswordResult.size
      });
      
      setUserInputs({});
    } catch (error) {
      console.error("Error generating crossword:", error);
    } finally {
      setIsGenerating(false);
    }
  };

  const handleInputChange = (number: number, index: number, value: string) => {
    const key = `${number}-${index}`;
    setUserInputs(prev => ({
      ...prev,
      [key]: value.toUpperCase()
    }));
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4 print:hidden" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <Card>
          <CardHeader>
            <CardTitle>Create Crossword Worksheet</CardTitle>
            <CardDescription>
              Generate a crossword puzzle with AI-generated words or your custom words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />

            {crosswordData && (
              <div className="mt-8">
                <h3 className="font-medium mb-4">Fill in the Crossword:</h3>
                <CrosswordGrid
                  grid={crosswordData.grid}
                  placedWords={crosswordData.placedWords}
                  userInputs={userInputs}
                  checkedWords={{}}
                  onInputChange={handleInputChange}
                  onKeyDown={() => () => {}}
                />

                <CrosswordClues placedWords={crosswordData.placedWords} />
              </div>
            )}
          </CardContent>
        </Card>

        {crosswordData && (
          <PrintableView
            grid={crosswordData.grid}
            placedWords={crosswordData.placedWords}
          />
        )}
      </div>
    </div>
  );
};

export default CrosswordWorksheet;