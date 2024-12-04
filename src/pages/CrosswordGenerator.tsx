import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenerationForm } from "@/components/crossword/GenerationForm";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { useToast } from "@/hooks/use-toast";

type WordGenerationMode = "ai" | "custom";

const CrosswordGenerator = () => {
  const [isGenerating, setIsGenerating] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleGenerate = async (mode: WordGenerationMode, topic: string, customWords: string) => {
    setIsGenerating(true);
    try {
      let words: string[] = [];
      
      if (mode === "custom") {
        // Parse custom words input
        words = customWords
          .split("\n")
          .filter(line => line.trim())
          .map(line => line.split(":")[0].trim());
      } else {
        // For AI mode, use the topic to generate words
        words = topic.split(",").map(word => word.trim());
      }

      if (words.length === 0) {
        throw new Error("No valid words provided");
      }

      const result = await generateCrossword(words);
      // Navigate to the generated crossword
      navigate(`/crossword/${result.id}`);
    } catch (error) {
      console.error("Generation error:", error);
      toast({
        title: "Error",
        description: "Failed to generate crossword. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Generate Crossword Puzzle</h1>
      <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />
    </div>
  );
};

export default CrosswordGenerator;