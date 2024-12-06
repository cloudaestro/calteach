import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useToast } from "@/hooks/use-toast";
import { Printer, ArrowLeft, Save, Edit2 } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { db } from "@/lib/firebase";
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
} from "@/components/ui/sheet";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { toast } from "sonner";

const CrosswordPuzzle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [crosswordData, setCrosswordData] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [checkedWords, setCheckedWords] = useState({});
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
      navigate("/login");
      return;
    }

    setIsSaving(true);
    try {
      // Save to localStorage first
      localStorage.setItem(`crossword-${id}`, JSON.stringify(crosswordData));

      // Then save to Firestore
      await addDoc(collection(db, "worksheets"), {
        userId: user.uid,
        puzzleId: id,
        title: crosswordData?.topic || "Untitled Crossword",
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

  const handleUpdateDescription = (wordNumber: number, newDescription: string) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map(word => 
        word.number === wordNumber 
          ? { ...word, description: newDescription }
          : word
      )
    }));
  };

  const handleUpdateWord = (wordNumber: number, newWord: string) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map(word => 
        word.number === wordNumber 
          ? { ...word, word: newWord.toUpperCase() }
          : word
      )
    }));
  };

  const handleAIEdit = (descriptions: string[]) => {
    setCrosswordData(prev => ({
      ...prev,
      placedWords: prev.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[index] || word.description
      }))
    }));
  };

  const checkWord = (wordNumber: number, word: string) => {
    const placedWord = crosswordData.placedWords.find(w => w.number === wordNumber);
    if (!placedWord) return false;

    const userWord = Array.from(word).map((_, index) => {
      const inputKey = `${wordNumber}-${index}`;
      const userInput = (userInputs[inputKey] || '').trim().toLowerCase();
      return userInput;
    }).join('');

    const correctWord = word.toLowerCase().trim();
    
    return userWord === correctWord;
  };

  const handleKeyDown = (wordNumber: number, word: string) => (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      const isCorrect = checkWord(wordNumber, word);
      
      setCheckedWords(prev => ({
        ...prev,
        [wordNumber]: true
      }));

      toast({
        title: isCorrect ? "Correct!" : "Try Again",
        description: isCorrect 
          ? "Great job! The word is correct." 
          : "The word is not correct. Keep trying!",
        variant: isCorrect ? "default" : "destructive",
      });
    }
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate(-1)}
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back
          </Button>
          <Button
            variant="outline"
            onClick={() => setIsEditing(!isEditing)}
            className={isEditing ? "bg-blue-50" : ""}
          >
            <Edit2 className="w-4 h-4 mr-2" />
            {isEditing ? "Exit Edit Mode" : "Edit Mode"}
          </Button>
        </div>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Crossword Puzzle</h2>
            <div className="space-x-2">
              <Button 
                variant="outline" 
                onClick={handleSave}
                disabled={isSaving}
              >
                <Save className="w-4 h-4 mr-2" />
                {isSaving ? "Saving..." : "Save"}
              </Button>
              <Button variant="outline" onClick={() => navigate("/crossword")}>
                Create New Puzzle
              </Button>
              <Button variant="outline" onClick={() => setShowPrintDialog(true)}>
                <Printer className="w-4 h-4 mr-2" />
                Print
              </Button>
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline">Show Answers</Button>
                </SheetTrigger>
                <SheetContent>
                  <SheetHeader>
                    <SheetTitle>Answers</SheetTitle>
                  </SheetHeader>
                  <div className="mt-4">
                    {crosswordData.placedWords.map((word, index) => (
                      <div key={index} className="mb-2">
                        <span className="font-bold">{word.number}. </span>
                        <span>{word.word}</span>
                      </div>
                    ))}
                  </div>
                </SheetContent>
              </Sheet>
            </div>
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

      <AlertDialog open={showPrintDialog} onOpenChange={setShowPrintDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Print Options</AlertDialogTitle>
            <AlertDialogDescription>
              Would you like to include an answer sheet with your crossword puzzle?
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel onClick={() => navigate(`/crossword/print/${id}`)}>
              No, just the puzzle
            </AlertDialogCancel>
            <AlertDialogAction onClick={() => navigate(`/crossword/print-answer/${id}`)}>
              Yes, include answers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CrosswordPuzzle;
