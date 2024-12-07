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
  showAnswers?: boolean;
}

export const CrosswordClues = ({ 
  placedWords,
  isEditing = false,
  onUpdateDescription,
  onUpdateWord,
  onAIEdit,
  showAnswers = false,
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
      <div className="space-y-6">
        <div>
          <h4 className="font-medium mb-4">Across:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600">Descriptions</h5>
              <ul className="space-y-2">
                {placedWords
                  .filter(word => word.position.horizontal)
                  .map((word, index) => (
                    <li key={`across-desc-${word.number}-${index}`} className="text-sm flex">
                      <span className="font-medium mr-2 min-w-[20px]">{word.number}.</span>
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
            {showAnswers && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-600">Answers</h5>
                <ul className="space-y-2">
                  {placedWords
                    .filter(word => word.position.horizontal)
                    .map((word, index) => (
                      <li key={`across-ans-${word.number}-${index}`} className="text-sm flex">
                        <span className="font-medium mr-2 min-w-[20px]">{word.number}.</span>
                        {isEditing && onUpdateWord ? (
                          <EditableText
                            text={word.word}
                            isEditing={isEditing}
                            onSave={(newWord) => onUpdateWord(word.number, newWord)}
                          />
                        ) : (
                          <span>{word.word}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        <div>
          <h4 className="font-medium mb-4">Down:</h4>
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <h5 className="text-sm font-medium text-gray-600">Descriptions</h5>
              <ul className="space-y-2">
                {placedWords
                  .filter(word => !word.position.horizontal)
                  .map((word, index) => (
                    <li key={`down-desc-${word.number}-${index}`} className="text-sm flex">
                      <span className="font-medium mr-2 min-w-[20px]">{word.number}.</span>
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
            {showAnswers && (
              <div className="space-y-2">
                <h5 className="text-sm font-medium text-gray-600">Answers</h5>
                <ul className="space-y-2">
                  {placedWords
                    .filter(word => !word.position.horizontal)
                    .map((word, index) => (
                      <li key={`down-ans-${word.number}-${index}`} className="text-sm flex">
                        <span className="font-medium mr-2 min-w-[20px]">{word.number}.</span>
                        {isEditing && onUpdateWord ? (
                          <EditableText
                            text={word.word}
                            isEditing={isEditing}
                            onSave={(newWord) => onUpdateWord(word.number, newWord)}
                          />
                        ) : (
                          <span>{word.word}</span>
                        )}
                      </li>
                    ))}
                </ul>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};