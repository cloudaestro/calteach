import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Grid, Search, BookOpen, Brain, PenTool } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

const worksheetTypes = [
  {
    title: "Crossword",
    description: "Create engaging crossword puzzles",
    icon: Grid,
    path: "/crossword",
    comingSoon: false
  },
  {
    title: "Word Find",
    description: "Generate word search puzzles",
    icon: Search,
    comingSoon: true
  },
  {
    title: "Vocabulary",
    description: "Build vocabulary worksheets",
    icon: BookOpen,
    comingSoon: true
  },
  {
    title: "Quiz",
    description: "Create custom quizzes",
    icon: Brain,
    comingSoon: true
  },
  {
    title: "Writing",
    description: "Generate writing prompts",
    icon: PenTool,
    comingSoon: true
  }
];

const Dashboard = () => {
  const { user } = useAuth();
  const navigate = useNavigate();

  if (!user) {
    navigate("/login");
    return null;
  }

  const handleWorksheetClick = (type: typeof worksheetTypes[0]) => {
    if (!type.comingSoon && type.path) {
      navigate(type.path);
    }
  };

  return (
    <div className="min-h-screen bg-neutral-50">
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl font-bold mb-8">Choose a Worksheet Type</h1>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {worksheetTypes.map((type, index) => (
              <motion.div
                key={type.title}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: index * 0.1 }}
              >
                <Card 
                  className={cn(
                    "relative overflow-hidden transition-shadow",
                    !type.comingSoon && "hover:shadow-lg cursor-pointer"
                  )}
                  onClick={() => handleWorksheetClick(type)}
                >
                  {type.comingSoon && (
                    <div className="absolute top-2 right-2 bg-primary/10 text-primary px-2 py-1 rounded-full text-xs font-medium">
                      Coming Soon
                    </div>
                  )}
                  <CardHeader>
                    <div className="flex items-center gap-2 mb-2">
                      <type.icon className="w-5 h-5 text-primary" />
                      <CardTitle className="text-xl">{type.title}</CardTitle>
                    </div>
                    <CardDescription>{type.description}</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <button 
                      disabled={type.comingSoon}
                      className={cn(
                        "w-full px-4 py-2 bg-primary text-white rounded-lg",
                        type.comingSoon ? "opacity-50 cursor-not-allowed" : "hover:bg-primary/90"
                      )}
                    >
                      Create Worksheet
                    </button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;