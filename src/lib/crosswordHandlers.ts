import { toast } from "sonner";
import { generateCrossword } from "./crosswordGenerator";

export const regenerateCrossword = async (
  words: string[],
  originalPlacedWords: any[]
) => {
  try {
    const result = await generateCrossword(words);
    // Keep the descriptions from the original words
    const updatedPlacedWords = result.placedWords.map(newWord => {
      const originalWord = originalPlacedWords.find(
        w => w.word.toLowerCase() === newWord.word.toLowerCase()
      );
      return {
        ...newWord,
        description: originalWord?.description || newWord.description
      };
    });

    return {
      ...result,
      placedWords: updatedPlacedWords
    };
  } catch (error) {
    console.error("Error regenerating crossword:", error);
    toast.error("Failed to regenerate crossword puzzle");
    return null;
  }
};

export const checkWord = (
  wordNumber: number,
  word: string,
  userInputs: { [key: string]: string }
) => {
  const userWord = Array.from(word).map((_, index) => {
    const inputKey = `${wordNumber}-${index}`;
    return (userInputs[inputKey] || '').toLowerCase();
  }).join('');

  return userWord === word.toLowerCase();
};