import React from 'react';
import { EditableText } from './crossword/EditableText';
import { AIEditDialog } from './crossword/AIEditDialog';

interface PlacedWord {
  word: string;
  position: {
    x: number;
    y: number;
    horizontal: boolean;
  };
  number: number;
  description?: string;
}

interface CrosswordCluesProps {
  placedWords: PlacedWord[];
  isEditing?: boolean;
  onUpdateDescription?: (wordNumber: number, newDescription: string) => void;
  onUpdateWord?: (wordNumber: number, newWord: string) => void;
  onAIEdit?: (descriptions: string[]) => void;
}

export const CrosswordClues = ({ 
  placedWords,
  isEditing = false,
  onUpdateDescription,
  onUpdateWord,
  onAIEdit,
}: CrosswordCluesProps) => {
  return (
    <div className="mt-6 space-y-4">
      {isEditing && onAIEdit && (
        <div className="flex justify-end mb-4">
          <AIEditDialog
            words={placedWords.map(word => word.word)}
            onEdit={onAIEdit}
          />
        </div>
      )}
      <div>
        <h4 className="font-medium mb-2">Across:</h4>
        <ul className="space-y-1">
          {placedWords
            .filter(word => word.position.horizontal)
            .map((word, index) => (
              <li key={`across-${word.number}-${index}`} className="text-sm">
                <span className="font-medium mr-1">{word.number}.</span>
                <span>{word.word}</span>
                {" - "}
                <EditableText
                  text={word.description || ''}
                  isEditing={isEditing}
                  multiline
                  onSave={(newDescription) => 
                    onUpdateDescription?.(word.number, newDescription)
                  }
                />
              </li>
            ))}
        </ul>
      </div>
      <div>
        <h4 className="font-medium mb-2">Down:</h4>
        <ul className="space-y-1">
          {placedWords
            .filter(word => !word.position.horizontal)
            .map((word, index) => (
              <li key={`down-${word.number}-${index}`} className="text-sm">
                <span className="font-medium mr-1">{word.number}.</span>
                <span>{word.word}</span>
                {" - "}
                <EditableText
                  text={word.description || ''}
                  isEditing={isEditing}
                  multiline
                  onSave={(newDescription) => 
                    onUpdateDescription?.(word.number, newDescription)
                  }
                />
              </li>
            ))}
        </ul>
      </div>
    </div>
  );
};