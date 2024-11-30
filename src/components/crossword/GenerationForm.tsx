import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
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

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="space-y-2">
        <label className="text-sm font-medium">Generation Mode</label>
        <Select value={mode} onValueChange={(value: WordGenerationMode) => setMode(value)}>
          <SelectTrigger>
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
          <label className="text-sm font-medium">Custom Words</label>
          <Input
            placeholder="Enter words separated by commas"
            value={customWords}
            onChange={(e) => setCustomWords(e.target.value)}
          />
          <p className="text-sm text-neutral-500">
            Enter words separated by commas (e.g., cat, dog, bird)
          </p>
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