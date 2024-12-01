import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useToast } from "@/hooks/use-toast";
import { Printer, ArrowLeft } from "lucide-react";
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

const CrosswordPuzzle = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [showPrintDialog, setShowPrintDialog] = useState(false);
  const [crosswordData, setCrosswordData] = useState(null);
  const [userInputs, setUserInputs] = useState({});
  const [checkedWords, setCheckedWords] = useState({});

  useEffect(() => {
    const data = localStorage.getItem(`crossword-${id}`);
    if (data) {
      setCrosswordData(JSON.parse(data));
    }
  }, [id]);

  const checkWord = (wordNumber: number, word: string) => {
    const placedWord = crosswordData.placedWords.find(w => w.number === wordNumber);
    if (!placedWord) return false;

    // Get all letters for this word from user inputs
    const userWord = Array.from(word).map((_, index) => {
      const inputKey = `${wordNumber}-${index}`;
      const userInput = userInputs[inputKey] || '';
      return userInput.toLowerCase();
    }).join('');

    // Compare ignoring case
    const correctWord = word.toLowerCase();
    console.log('Checking word:', {
      userWord,
      correctWord,
      isCorrect: userWord === correctWord
    });
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

  const handleInputChange = (wordNumber: number, index: number, value: string) => {
    const key = `${wordNumber}-${index}`;
    setUserInputs(prev => ({
      ...prev,
      [key]: value.toUpperCase()
    }));
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>

        <div className="space-y-4">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-2xl font-bold">Crossword Puzzle</h2>
            <div className="space-x-2">
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

          <CrosswordClues placedWords={crosswordData.placedWords} />
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