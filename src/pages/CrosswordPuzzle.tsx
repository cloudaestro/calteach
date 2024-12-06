import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { CrosswordHeader } from "@/components/crossword/CrosswordHeader";
import { PrintDialog } from "@/components/crossword/PrintDialog";

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

      await addDoc(collection(db, "worksheets"), {
        userId: user.uid,
        puzzleId: id,
        createdAt: serverTimestamp(),
        placedWords: crosswordData.placedWords,
      });

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
      [`${wordNumber}-${index}`]: value
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

  const handleUpdateWord = (wordNumber: number, newWord: string) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map((word: any) => 
        word.number === wordNumber 
          ? { ...word, word: newWord.toUpperCase() }
          : word
      )
    }));
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
      const isCorrect = checkWord(wordNumber, word);
      
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

  const checkWord = (wordNumber: number, word: string) => {
    const placedWord = crosswordData.placedWords.find((w: any) => w.number === wordNumber);
    if (!placedWord) return false;

    const userWord = Array.from(word).map((_, index) => {
      const inputKey = `${wordNumber}-${index}`;
      return (userInputs[inputKey] || '').trim().toLowerCase();
    }).join('');

    return userWord === word.toLowerCase().trim();
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
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Crossword Puzzle</h2>
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="outline">Show Answers</Button>
              </SheetTrigger>
              <SheetContent>
                <SheetHeader>
                  <SheetTitle>Answers</SheetTitle>
                </SheetHeader>
                <div className="mt-4">
                  {crosswordData.placedWords.map((word: any, index: number) => (
                    <div key={index} className="mb-2">
                      <span className="font-bold">{word.number}. </span>
                      <span>{word.word}</span>
                    </div>
                  ))}
                </div>
              </SheetContent>
            </Sheet>
          </div>

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