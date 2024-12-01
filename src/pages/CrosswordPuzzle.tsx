import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { useToast } from "@/hooks/use-toast";
import { Printer } from "lucide-react";
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

  const handlePrintWithAnswers = () => {
    setShowPrintDialog(false);
    navigate(`/crossword/print-answer/${id}`);
  };

  const handlePrintWithoutAnswers = () => {
    setShowPrintDialog(false);
    navigate(`/crossword/print/${id}`);
  };

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
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
            onInputChange={(number, index, value) => {
              const key = `${number}-${index}`;
              setUserInputs(prev => ({
                ...prev,
                [key]: value.toUpperCase()
              }));
            }}
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
            <AlertDialogCancel onClick={handlePrintWithoutAnswers}>
              No, just the puzzle
            </AlertDialogCancel>
            <AlertDialogAction onClick={handlePrintWithAnswers}>
              Yes, include answers
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default CrosswordPuzzle;