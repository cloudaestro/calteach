import React, { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Wand2 } from "lucide-react";
import { generateWorksheet } from "@/lib/gemini";
import { toast } from "sonner";

interface AIEditDialogProps {
  onEdit: (descriptions: string[]) => void;
  words: string[];
}

export const AIEditDialog = ({ onEdit, words }: AIEditDialogProps) => {
  const [prompt, setPrompt] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      const wordsStr = words.join(", ");
      const fullPrompt = `Generate short, one-line descriptions for these words, considering this context: ${prompt}. Words: ${wordsStr}. Return only the descriptions separated by semicolons, in the same order as the words.`;
      
      const response = await generateWorksheet(fullPrompt);
      const descriptions = response.split(";").map(desc => desc.trim());
      
      if (descriptions.length === words.length) {
        onEdit(descriptions);
        toast.success("Descriptions updated successfully!");
      } else {
        toast.error("AI response format was incorrect. Please try again.");
      }
    } catch (error) {
      console.error("Error generating descriptions:", error);
      toast.error("Failed to generate descriptions. Please try again.");
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm">
          <Wand2 className="w-4 h-4 mr-2" />
          AI Edit
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit with AI</DialogTitle>
          <DialogDescription>
            Describe how you want to modify the crossword clues, and AI will help generate new descriptions.
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 py-4">
          <Textarea
            placeholder="E.g., Make the descriptions more challenging and suitable for high school students..."
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            rows={4}
          />
        </div>
        <DialogFooter>
          <Button
            onClick={handleGenerate}
            disabled={!prompt.trim() || isGenerating}
          >
            {isGenerating ? "Generating..." : "Generate Descriptions"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};