import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { ArrowLeft } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { auth, db } from "@/lib/firebase";

type WordGenerationMode = "ai" | "custom";
type DifficultyLevel = "easy" | "medium" | "hard";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
  const [mode, setMode] = useState<WordGenerationMode>("ai");
  const [topic, setTopic] = useState("");
  const [customWords, setCustomWords] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);
  const [difficulty, setDifficulty] = useState<DifficultyLevel>("medium");
  const [wordCount, setWordCount] = useState(10);

  const customWordsPlaceholder = 
`dog:a faithful companion animal
cat:an independent feline pet
bird:a feathered flying creature`;

  const getDifficultyPrompt = (difficulty: DifficultyLevel) => {
    switch (difficulty) {
      case "easy":
        return "simple and common";
      case "medium":
        return "moderate complexity";
      case "hard":
        return "challenging and sophisticated";
      default:
        return "moderate complexity";
    }
  };

  const handleGenerate = async () => {
    setIsGenerating(true);
    try {
      let words: string[] = [];
      let descriptions: string[] = [];
      
      if (mode === "ai") {
        const difficultyDesc = getDifficultyPrompt(difficulty);
        const wordsPrompt = `Generate ${wordCount} ${difficultyDesc} ${topic}. Return only the specific names separated by commas, no explanations or descriptions. For example, if the topic is "Animals", return "lion, tiger, elephant" etc.`;
        const wordsResponse = await generateWorksheet(wordsPrompt);
        words = wordsResponse.split(",").map(word => word.trim()).slice(0, wordCount);
        
        const descriptionsPrompt = `For each of these ${topic}: ${words.join(", ")}, generate a simple, direct description that clearly identifies what it is. Each description should start with "A/An" and be factual. For example: "A large African cat with a mane" for lion. Return only the descriptions separated by semicolons, in the same order as the words.`;
        const descriptionsResponse = await generateWorksheet(descriptionsPrompt);
        descriptions = descriptionsResponse.split(";").map(desc => desc.trim());
      } else {
        const lines = customWords.split("\n").filter(line => line.trim());
        lines.forEach(line => {
          const [word, description] = line.split(":").map(part => part.trim());
          if (word && description) {
            words.push(word);
            descriptions.push(description);
          }
        });
      }

      const crosswordResult = await generateCrossword(words);
      const enhancedPlacedWords = crosswordResult.placedWords.map((word, index) => ({
        ...word,
        description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
      }));

      const puzzleId = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
      const worksheetData = {
        grid: crosswordResult.grid,
        placedWords: enhancedPlacedWords,
        size: crosswordResult.size,
        difficulty,
        topic: mode === "ai" ? topic : "Custom Words",
        createdAt: new Date().toISOString(),
        userId: auth.currentUser?.uid
      };
      
      localStorage.setItem(`crossword-${puzzleId}`, JSON.stringify(worksheetData));

      if (auth.currentUser) {
        try {
          const docRef = await addDoc(collection(db, "worksheets"), {
            ...worksheetData,
            createdAt: serverTimestamp(),
          });
          console.log("Worksheet saved with ID:", docRef.id);
          toast({
            title: "Success",
            description: "Worksheet saved successfully",
          });
        } catch (error) {
          console.error("Error saving worksheet:", error);
          toast({
            title: "Error",
            description: "Failed to save worksheet",
            variant: "destructive",
          });
        }
      }

      navigate(`/crossword/${puzzleId}`);
    } catch (error) {
      console.error("Error generating crossword:", error);
      toast({
        title: "Error",
        description: "Failed to generate crossword",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <Button 
          variant="ghost" 
          className="mb-4" 
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </Button>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Crossword Worksheet</CardTitle>
            <CardDescription>
              Generate a crossword puzzle with AI-generated words or your custom words
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
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

            <div className="space-y-2">
              <label className="text-sm font-medium">Difficulty Level</label>
              <Select value={difficulty} onValueChange={(value: DifficultyLevel) => setDifficulty(value)}>
                <SelectTrigger>
                  <SelectValue placeholder="Select difficulty" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="easy">Easy</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="hard">Hard</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <label className="text-sm font-medium">Number of Words: {wordCount}</label>
              <Slider
                value={[wordCount]}
                onValueChange={(value) => setWordCount(value[0])}
                min={5}
                max={15}
                step={1}
                className="w-full"
              />
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
                  <h4 className="text-sm font-medium mb-2">Input Instructions:</h4>
                  <p className="text-sm text-neutral-600 mb-1">Enter one word per line using the format: word:description</p>
                  <p className="text-sm text-neutral-600">Example: dog:a faithful companion animal</p>
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
              onClick={handleGenerate}
              disabled={isGenerating || (mode === "ai" ? !topic : !customWords)}
              className="w-full"
            >
              {isGenerating ? "Generating..." : "Generate Crossword"}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordGenerator;
