import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { GenerationForm } from "@/components/crossword/GenerationForm";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { Button } from "@/components/ui/button";
import { useToast } from "@/components/ui/use-toast";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { auth } from "@/lib/firebase";

type DifficultyLevel = "easy" | "medium" | "hard";
type WordGenerationMode = "ai" | "custom";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
  const [grid, setGrid] = useState<string[][]>([]);
  const [placedWords, setPlacedWords] = useState<any[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [wordCount, setWordCount] = useState(10);
  const { toast } = useToast();

  const customWordsPlaceholder = 
`dogs:very good animals
cats:another very good animals
birds:flying animals in the sky`;

  const handleGenerate = async (mode: WordGenerationMode, topic: string, customWords: string) => {
    setIsGenerating(true);
    try {
      const result = await generateCrossword(mode === "ai" ? [topic] : customWords.split("\n").map(line => line.split(":")[0]));
      setGrid(result.grid);
      setPlacedWords(result.placedWords);
    } catch (error) {
      toast({ title: "Error generating crossword", description: "There was an error generating the crossword. Please try again." });
    } finally {
      setIsGenerating(false);
    }
  };

  const handleSave = async () => {
    if (!auth.currentUser) {
      toast({ title: "Error", description: "You must be logged in to save a crossword." });
      return;
    }
    try {
      await addDoc(collection(db, "crosswords"), {
        grid,
        placedWords,
        userId: auth.currentUser.uid,
      });
      toast({ title: "Success", description: "Crossword saved successfully!" });
    } catch (error) {
      toast({ title: "Error saving crossword", description: "There was an error saving your crossword. Please try again." });
    }
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-2xl font-bold mb-6">Crossword Generator</h1>
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />
        </div>
        {grid.length > 0 && (
          <div>
            <CrosswordGrid grid={grid} placedWords={placedWords} />
            <CrosswordClues placedWords={placedWords} />
            <div className="mt-4 space-x-4">
              <Button onClick={handleSave}>Save</Button>
              <Button onClick={handlePrint}>Print</Button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default CrosswordGenerator;
