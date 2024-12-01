import { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { CrosswordGrid } from "@/components/crossword/CrosswordGrid";
import { CrosswordClues } from "@/components/CrosswordClues";
import { AnswerSheet } from "@/components/AnswerSheet";
import { ArrowLeft } from "lucide-react";

const CrosswordPrint = () => {
  const { id } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const [crosswordData, setCrosswordData] = useState(null);
  const showAnswers = location.pathname.includes('print-answer');

  useEffect(() => {
    const data = localStorage.getItem(`crossword-${id}`);
    if (data) {
      setCrosswordData(JSON.parse(data));
    }
  }, [id]);

  useEffect(() => {
    // Auto-trigger print dialog when component mounts
    if (crosswordData) {
      window.print();
    }
  }, [crosswordData]);

  if (!crosswordData) {
    return <div>Loading...</div>;
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="p-4 print:hidden">
        <Button 
          variant="ghost" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
      </div>

      {/* First Page - Worksheet */}
      <div className="p-8 print:p-0">
        <div className="max-w-4xl mx-auto print:max-w-none">
          <div className="space-y-8 print:space-y-4">
            {/* Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.15] rotate-[-35deg] text-4xl font-bold text-neutral-400">
              TeachSheets AI
            </div>

            <h1 className="text-3xl font-bold text-center print:text-2xl">
              Crossword Puzzle
            </h1>

            <CrosswordGrid
              grid={crosswordData.grid}
              placedWords={crosswordData.placedWords}
              userInputs={{}}
              onInputChange={() => {}}
            />

            <CrosswordClues placedWords={crosswordData.placedWords} />

            <div className="text-center text-sm text-gray-500 print:mt-8">
              © {new Date().getFullYear()} TeachSheets AI
            </div>
          </div>
        </div>
      </div>

      {/* Second Page - Answer Sheet (only if showAnswers is true) */}
      {showAnswers && <AnswerSheet placedWords={crosswordData.placedWords} />}
    </div>
  );
};

export default CrosswordPrint;