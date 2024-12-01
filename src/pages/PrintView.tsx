import React, { useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { CrosswordClues } from '@/components/CrosswordClues';
import { useToast } from "@/hooks/use-toast";

const PrintView = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { toast } = useToast();
  const { grid, placedWords } = location.state || {};

  useEffect(() => {
    if (!grid || !placedWords) {
      navigate('/crossword');
      return;
    }
    // Automatically trigger print when component mounts
    handlePrint();
  }, [grid, placedWords, navigate]);

  const handlePrint = async () => {
    try {
      const content = document.querySelector('.printable-content');
      if (!content) {
        throw new Error('Print content not found');
      }

      // Make sure content is visible before capturing
      content.classList.remove('hidden');
      
      const canvas = await html2canvas(content, {
        scale: 2, // Higher quality
        useCORS: true,
        logging: false,
        backgroundColor: '#ffffff'
      });

      // Hide content again
      content.classList.add('hidden');

      // Create print window
      const printWindow = window.open('', '_blank');
      if (!printWindow) {
        throw new Error('Could not open print window');
      }

      // Setup print window
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
          <head>
            <title>Print Crossword</title>
            <style>
              @media print {
                body { margin: 0; }
                img { 
                  max-width: 100%;
                  height: auto;
                  page-break-inside: avoid;
                }
              }
            </style>
          </head>
          <body>
            <img src="${canvas.toDataURL('image/png')}" />
          </body>
        </html>
      `);

      // Wait for image to load before printing
      const img = printWindow.document.querySelector('img');
      if (img) {
        img.onload = () => {
          printWindow.focus();
          printWindow.print();
          printWindow.close();
        };
      }
    } catch (error) {
      console.error('Print error:', error);
      toast({
        title: "Print Error",
        description: "Failed to prepare document for printing. Please try again.",
        variant: "destructive",
      });
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

        <div className="printable-content hidden bg-white p-8 rounded-lg shadow-lg">
          <h1 className="text-2xl font-bold text-center mb-8">Crossword Puzzle</h1>
          
          {/* Grid */}
          <div className="grid gap-px bg-neutral-200 w-fit mx-auto mb-8">
            {grid.map((row: string[], y: number) => (
              <div key={y} className="flex">
                {row.map((cell: string, x: number) => {
                  const number = placedWords.find(
                    (word: any) => word.position.x === x && word.position.y === y
                  )?.number;

                  return cell ? (
                    <div 
                      key={`${x}-${y}`} 
                      className="w-8 h-8 relative bg-white border border-neutral-300"
                    >
                      {number && (
                        <span className="absolute top-0 left-0 text-[8px] p-[2px]">
                          {number}
                        </span>
                      )}
                    </div>
                  ) : (
                    <div 
                      key={`${x}-${y}`} 
                      className="w-8 h-8 bg-neutral-800" 
                    />
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
  );
};

export default PrintView;