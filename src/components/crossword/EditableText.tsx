import React, { useState, useRef, useEffect } from 'react';
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";

interface EditableTextProps {
  text: string;
  isEditing: boolean;
  multiline?: boolean;
  onSave: (newText: string) => void;
}

export const EditableText = ({ text, isEditing, multiline = false, onSave }: EditableTextProps) => {
  const [isEditable, setIsEditable] = useState(false);
  const [editedText, setEditedText] = useState(text);
  const inputRef = useRef<HTMLInputElement | HTMLTextAreaElement>(null);

  useEffect(() => {
    setEditedText(text);
  }, [text]);

  const handleDoubleClick = () => {
    if (isEditing) {
      setIsEditable(true);
    }
  };

  const handleBlur = () => {
    setIsEditable(false);
    if (editedText !== text) {
      onSave(editedText);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !multiline) {
      e.preventDefault();
      handleBlur();
    }
    if (e.key === 'Escape') {
      setEditedText(text);
      setIsEditable(false);
    }
  };

  if (!isEditable) {
    return (
      <div 
        onDoubleClick={handleDoubleClick}
        className={isEditing ? "cursor-pointer hover:bg-gray-100 p-1 rounded" : ""}
      >
        {text}
      </div>
    );
  }

  const InputComponent = multiline ? Textarea : Input;

  return (
    <InputComponent
      ref={inputRef as any}
      value={editedText}
      onChange={(e) => setEditedText(e.target.value)}
      onBlur={handleBlur}
      onKeyDown={handleKeyDown}
      autoFocus
      className="min-w-[200px]"
    />
  );
};