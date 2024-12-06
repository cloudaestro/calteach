import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { generateWorksheet } from "@/lib/gemini";
import { generateCrossword } from "@/lib/crosswordGenerator";
import { ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { db } from "@/lib/firebase";
import { collection, addDoc } from "firebase/firestore";
import { useToast } from "@/hooks/use-toast";
import { GenerationForm } from "@/components/crossword/GenerationForm";

type WordGenerationMode = "ai" | "custom";

const CrosswordGenerator = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { toast } = useToast();
  const [isGenerating, setIsGenerating] = useState(false);

  const handleGenerate = async (mode: WordGenerationMode, topic: string, customWords: string) => {
    if (!user) {
      toast({
        title: "Please login",
        description: "You need to be logged in to create worksheets",
        variant: "destructive",
      });
      navigate("/login");
      return;
    }

    setIsGenerating(true);
    try {
      let words: string[] = [];
      let descriptions: string[] = [];
      
      if (mode === "ai") {
        const wordsPrompt = `Generate 10 ${topic}. Return only the specific names separated by commas, no explanations or descriptions. For example, if the topic is "Animals", return "lion, tiger, elephant" etc.`;
        const wordsResponse = await generateWorksheet(wordsPrompt);
        words = wordsResponse.split(",").map(word => word.trim()).slice(0, 10);
        
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
      
      // Convert the grid to a string representation for Firestore
      const gridString = crosswordResult.grid.map(row => row.join(',')).join('|');
      
      // Create worksheet data with the string representation
      const worksheetData = {
        userId: user.uid,
        title: `${topic || 'Custom'} Crossword`,
        topic: topic || 'Custom Words',
        createdAt: new Date(),
        gridString: gridString, // Store as string instead of nested array
        placedWords: crosswordResult.placedWords.map((word, index) => ({
          ...word,
          description: descriptions[words.indexOf(word.word)] || `Enter: ${word.word}`
        })),
        size: crosswordResult.size,
      };

      const docRef = await addDoc(collection(db, "worksheets"), worksheetData);

      toast({
        title: "Success!",
        description: "Worksheet saved successfully",
      });

      navigate(`/crossword/${docRef.id}`);
    } catch (error) {
      console.error("Error generating crossword:", error);
      toast({
        title: "Error",
        description: "Failed to generate crossword. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsGenerating(false);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50 p-4">
      <div className="max-w-4xl mx-auto">
        <button 
          className="mb-4 flex items-center text-sm text-gray-600 hover:text-gray-900"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back
        </button>
        
        <Card>
          <CardHeader>
            <CardTitle>Create Crossword Worksheet</CardTitle>
            <CardDescription>
              Generate a crossword puzzle with AI-generated words or your custom words
            </CardDescription>
          </CardHeader>
          <CardContent>
            <GenerationForm onGenerate={handleGenerate} isGenerating={isGenerating} />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default CrosswordGenerator;