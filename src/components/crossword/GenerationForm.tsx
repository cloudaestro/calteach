import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

type WordGenerationMode = "ai" | "custom";

interface GenerationFormProps {
  onGenerate: (mode: WordGenerationMode, topic: string, customWords: string) => Promise<void>;
  isGenerating: boolean;
}

export const GenerationForm = ({ onGenerate, isGenerating }: GenerationFormProps) => {
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await onGenerate(mode, topic, customWords);
  };

  const customWordsPlaceholder = 
`cat:A small furry pet that meows
dog:A loyal companion animal that barks
bird:A feathered creature that can fly`;

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="space-y-2">
        <label className="text-sm font-medium">Generation Mode</label>
        <Select value={mode} onValueChange={(value: WordGenerationMode) => setMode(value)}>
          <SelectTrigger className="w-full">
            <SelectValue placeholder="Select mode" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ai">AI Generated Words</SelectItem>
            <SelectItem value="custom">Custom Words</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {mode === "ai" ? (
        <div className="space-y-2">
          <label className="text-sm font-medium">Topic</label>
          <Input
            placeholder="Enter a topic (e.g., animals, sports, food)"
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
          />
        </div>
      ) : (
        <div className="space-y-2">
          <label className="text-sm font-medium">Custom Words and Descriptions</label>
          <div className="bg-neutral-50 p-4 rounded-md mb-2">
            <h4 className="text-sm font-medium mb-2">Format Instructions:</h4>
            <p className="text-sm text-neutral-600 mb-1">1. Write one word and its description per line</p>
            <p className="text-sm text-neutral-600 mb-1">2. Separate word and description with a colon (:)</p>
            <p className="text-sm text-neutral-600">Example: cat:A small furry pet that meows</p>
          </div>
          <Textarea
            placeholder={customWordsPlaceholder}
            value={customWords}
            onChange={(e) => setCustomWords(e.target.value)}
            className="min-h-[200px] font-mono text-sm"
          />
        </div>
      )}

      <Button
        type="submit"
        disabled={isGenerating || (mode === "ai" ? !topic : !customWords)}
        className="w-full"
      >
        {isGenerating ? "Generating..." : "Generate Crossword"}
      </Button>
    </form>
  );
};