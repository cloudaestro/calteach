import React from 'react';
import { cn } from "@/lib/utils";

interface CrosswordCellProps {
  x: number;
  y: number;
  number?: number;
  value: string;
  correctValue: string;
  isWordChecked: boolean;
  showSolution: boolean;
  isPartOfCurrentWord?: boolean;
  isWordCorrect?: boolean;
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
  onFocus?: () => void;
}

export const CrosswordCell = ({
  number,
  value,
  correctValue,
  isWordChecked,
  showSolution,
  isPartOfCurrentWord,
  isWordCorrect,
  onChange,
  onKeyDown,
  onFocus
}: CrosswordCellProps) => {
  // Normalize both strings by trimming whitespace and converting to lowercase
  const normalizedValue = value.trim().toLowerCase();
  const normalizedCorrectValue = correctValue.trim().toLowerCase();
  const isCorrect = normalizedValue === normalizedCorrectValue;
  
  return (
    <div className={cn(
      "w-8 h-8 relative bg-white border border-neutral-300 print:w-10 print:h-10",
      isPartOfCurrentWord && "bg-blue-50",
      isWordChecked && (isWordCorrect ? "bg-green-100" : "bg-red-100")
    )}>
      {number && (
        <span className="absolute top-0 left-0 text-[8px] print:text-[10px] p-[2px]">
          {number}
        </span>
      )}
      <input
        type="text"
        maxLength={1}
        className={cn(
          "w-full h-full text-center uppercase bg-transparent focus:outline-none transition-colors duration-200",
          isWordChecked && (isWordCorrect ? "text-green-700" : "text-red-700"),
          showSolution && !value && "text-gray-500"
        )}
        value={showSolution && !value ? correctValue : value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
    </div>
  );
};