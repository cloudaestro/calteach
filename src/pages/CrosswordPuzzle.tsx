import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";
import { CrosswordHeader } from "@/components/crossword/CrosswordHeader";
import { PrintDialog } from "@/components/crossword/PrintDialog";
import { CrosswordControls } from "@/components/crossword/CrosswordControls";
import { regenerateCrossword, checkWord } from "@/lib/crosswordHandlers";

const CrosswordPuzzle = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [crosswordData, setCrosswordData] = useState<any>(null);
  const [userInputs, setUserInputs] = useState<{ [key: string]: string }>({});
  const [checkedWords, setCheckedWords] = useState<{ [key: number]: boolean }>({});
  const [isSaving, setIsSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);

  useEffect(() => {
    const data = localStorage.getItem(`crossword-${id}`);
    if (data) {
      setCrosswordData(JSON.parse(data));
    }
  }, [id]);

  const handleSave = async () => {
    if (!user) {
      toast.error("Please login to save worksheets");
      return;
    }

    setIsSaving(true);
    try {
      localStorage.setItem(`crossword-${id}`, JSON.stringify(crosswordData));

      const { error } = await supabase
        .from('worksheets')
        .insert({
          user_id: user.id,
          puzzle_id: id,
          created_at: new Date().toISOString(),
          placed_words: crosswordData.placedWords
        });

      if (error) throw error;

      toast.success("Worksheet saved successfully!");
    } catch (error) {
      console.error("Error saving worksheet:", error);
      toast.error("Failed to save worksheet. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleInputChange = (wordNumber: number, index: number, value: string) => {
    setUserInputs(prev => ({
      ...prev,
      [`${wordNumber}-${index}`]: value.toLowerCase()
    }));
  };

  const handleUpdateDescription = (wordNumber: number, newDescription: string) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map((word: any) => 
        word.number === wordNumber 
          ? { ...word, description: newDescription }
          : word
      )
    }));
  };

  const handleUpdateWord = async (wordNumber: number, newWord: string) => {
    const updatedPlacedWords = crosswordData.placedWords.map((word: any) => 
      word.number === wordNumber 
        ? { ...word, word: newWord.toLowerCase() }
        : word
    );

    const words = updatedPlacedWords.map((word: any) => word.word);
    const newCrosswordData = await regenerateCrossword(words, crosswordData.placedWords);
    
    if (newCrosswordData) {
      setCrosswordData(newCrosswordData);
      setUserInputs({});
      setCheckedWords({});
    }
  };

  const handleAIEdit = (descriptions: string[]) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map((word: any, index: number) => ({
        ...word,
        description: descriptions[index] || word.description
      }))
    }));
  };

  const handleKeyDown = (wordNumber: number, word: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const isCorrect = checkWord(wordNumber, word, userInputs);
      
      setCheckedWords(prev => ({
        ...prev,
        [wordNumber]: true
      }));

      toast(isCorrect ? "Correct!" : "Try Again", {
        description: isCorrect 
          ? "Great job! The word is correct." 
          : "The word is not correct. Keep trying!"
      });
    }
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <CrosswordHeader
          isEditing={isEditing}
          isSaving={isSaving}
          onEditToggle={() => setIsEditing(!isEditing)}
          onSave={handleSave}
          onPrintDialog={() => setShowPrintDialog(true)}
        />

        <div className="space-y-4">
          <CrosswordControls placedWords={crosswordData.placedWords} />

          <CrosswordGrid
            grid={crosswordData.grid}
            placedWords={crosswordData.placedWords}
            userInputs={userInputs}
            checkedWords={checkedWords}
            onInputChange={handleInputChange}
            onKeyDown={handleKeyDown}
          />

          <CrosswordClues 
            placedWords={crosswordData.placedWords}
            isEditing={isEditing}
            onUpdateDescription={handleUpdateDescription}
            onUpdateWord={handleUpdateWord}
            onAIEdit={handleAIEdit}
          />
        </div>
      </div>

      <PrintDialog
        open={showPrintDialog}
        onOpenChange={setShowPrintDialog}
        id={id || ''}
      />
    </div>
  );
};

export default CrosswordPuzzle;