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
  onChange: (value: string) => void;
  onKeyDown: (e: React.KeyboardEvent) => void;
}

export const CrosswordCell = ({
  number,
  value,
  correctValue,
  isWordChecked,
  showSolution,
  onChange,
  onKeyDown
}: CrosswordCellProps) => {
  const isCorrect = value.toLowerCase() === correctValue.toLowerCase();
  
  return (
    <div className="w-8 h-8 relative bg-white border border-neutral-300">
      {number && (
        <span className="absolute top-0 left-0 text-[8px] p-[2px]">
          {number}
        </span>
      )}
      <input
        type="text"
        maxLength={1}
        className={cn(
          "w-full h-full text-center uppercase bg-transparent focus:outline-none",
          isWordChecked && (isCorrect ? "bg-green-200" : "bg-red-200"),
          showSolution && !value && "text-gray-500"
        )}
        value={showSolution && !value ? correctValue : value}
        onChange={(e) => onChange(e.target.value)}
        onKeyDown={onKeyDown}
      />
    </div>
  );
};