import React from 'react';
import { Button } from "@/components/ui/button";
import { Edit2, Printer, Save } from "lucide-react";
import { useNavigate } from "react-router-dom";

interface CrosswordHeaderProps {
  isEditing: boolean;
  isSaving: boolean;
  onEditToggle: () => void;
  onSave: () => void;
  onPrintDialog: () => void;
}

export const CrosswordHeader = ({
  isEditing,
  isSaving,
  onEditToggle,
  onSave,
  onPrintDialog
}: CrosswordHeaderProps) => {
  const navigate = useNavigate();

  return (
    <div className="flex justify-between items-center mb-4">
      <Button 
        variant="ghost" 
        onClick={() => navigate(-1)}
      >
        Back
      </Button>
      <div className="space-x-2">
        <Button 
          variant="outline" 
          onClick={onSave}
          disabled={isSaving}
        >
          <Save className="w-4 h-4 mr-2" />
          {isSaving ? "Saving..." : "Save"}
        </Button>
        <Button variant="outline" onClick={() => navigate("/crossword")}>
          Create New Puzzle
        </Button>
        <Button variant="outline" onClick={onPrintDialog}>
          <Printer className="w-4 h-4 mr-2" />
          Print
        </Button>
        <Button
          variant="outline"
          onClick={onEditToggle}
          className={isEditing ? "bg-blue-50" : ""}
        >
          <Edit2 className="w-4 h-4 mr-2" />
          {isEditing ? "Exit Edit Mode" : "Edit Mode"}
        </Button>
      </div>
    </div>
  );
};