import React from 'react';
import { useNavigate } from "react-router-dom";
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

interface PrintDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  id: string;
}

export const PrintDialog = ({ open, onOpenChange, id }: PrintDialogProps) => {
  const navigate = useNavigate();

  return (
    <AlertDialog open={open} onOpenChange={onOpenChange}>
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
  );
};