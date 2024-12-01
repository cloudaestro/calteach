import React, { useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { CrosswordClues } from '@/components/CrosswordClues';

const PrintView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const printRef = useRef<HTMLDivElement>(null);
  const { grid, placedWords } = location.state || {};

  useEffect(() => {
    if (!grid || !placedWords) {
      navigate('/crossword');
      return;
    }
  }, [grid, placedWords, navigate]);

  const handlePrint = async () => {
    if (!printRef.current) return;

    try {
      const canvas = await html2canvas(printRef.current);
      const image = canvas.toDataURL('image/png');
      const printWindow = window.open('', '_blank');
      if (!printWindow) return;

      printWindow.document.write(`
        <html>
          <head>
            <title>Print Crossword</title>
          </head>
          <body style="margin: 0; display: flex; justify-content: center; align-items: center; min-height: 100vh;">
            <img src="${image}" style="max-width: 100%; height: auto;" />
          </body>
        </html>
      `);
      printWindow.document.close();
      printWindow.focus();
      printWindow.print();
    } catch (error) {
      console.error('Error capturing page:', error);
    }
  };

  if (!grid || !placedWords) return null;

  return (
    <div className="min-h-screen bg-white p-8">
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <Button variant="outline" onClick={() => navigate(-1)}>
            Back
          </Button>
          <Button onClick={handlePrint}>
            Print Worksheet
          </Button>
        </div>

        <div ref={printRef} className="bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-8">Crossword Puzzle</h1>
          
          {/* Watermark */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none" style={{ transform: 'rotate(-45deg)' }}>
              <div className="text-4xl text-gray-400 whitespace-nowrap">
                CROSSWORD PUZZLE
                <br />
                FREE VERSION
              </div>
            </div>

            {/* Grid */}
            <div className="grid gap-px bg-neutral-200 w-fit mx-auto mb-8">
              {grid.map((row: string[], y: number) => (
                <div key={y} className="flex">
                  {row.map((cell: string, x: number) => {
                    const number = placedWords.find(
                      (word: any) => word.position.x === x && word.position.y === y
                    )?.number;

                    return cell ? (
                      <div key={`${x}-${y}`} className="w-8 h-8 relative bg-white border border-neutral-300">
                        {number && (
                          <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                            {number}
                          </span>
                        )}
                      </div>
                    ) : (
                      <div key={`${x}-${y}`} className="w-8 h-8 bg-neutral-800" />
                    );
                  })}
                </div>
              ))}
            </div>

            {/* Clues */}
            <CrosswordClues placedWords={placedWords} />
          </div>
        </div>
      </div>
    </div>
  );
};

export default PrintView;