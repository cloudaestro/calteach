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
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newValue = e.target.value.slice(-1).toUpperCase();
    onChange(newValue);
  };

  return (
    <div className={cn(
      "w-8 h-8 relative bg-white border border-neutral-300 print:w-10 print:h-10 print:bg-white print:border-black",
      isPartOfCurrentWord && "bg-blue-50 print:bg-white",
      isWordChecked && (isWordCorrect ? "bg-green-100 print:bg-white" : "bg-red-100 print:bg-white")
    )}>
      {number && (
        <span className="absolute top-0 left-0 text-[8px] print:text-[10px] p-[2px] print:text-black">
          {number}
        </span>
      )}
      <input
        type="text"
        maxLength={1}
        className={cn(
          "w-full h-full text-center uppercase bg-transparent focus:outline-none transition-colors duration-200 print:text-black",
          isWordChecked && (isWordCorrect ? "text-green-700 print:text-black" : "text-red-700 print:text-black"),
          showSolution && !value && "text-gray-500 print:text-black"
        )}
        value={showSolution && !value ? correctValue : value}
        onChange={handleChange}
        onKeyDown={onKeyDown}
        onFocus={onFocus}
      />
    </div>
  );
};