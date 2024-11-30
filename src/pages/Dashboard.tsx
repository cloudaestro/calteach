import { useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Grid, BookOpen, Search, FileText, Brain, PenTool } from "lucide-react";
import { motion } from "framer-motion";

const worksheetTypes = [
  {
    title: "Crossword",
    description: "Create engaging crossword puzzles",
    icon: Grid,
    comingSoon: true
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
  },
  {
    title: "Custom",
    description: "Create custom worksheets",
    icon: FileText,
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

  return (
    <div className="min-h-screen bg-neutral-50">
      <header className="border-b bg-white/50 backdrop-blur-xl">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-display font-semibold text-lg">TeachSheets AI</span>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-neutral-600">Welcome, {user.email}</span>
          </div>
        </div>
      </header>

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
                <Card className="relative overflow-hidden hover:shadow-lg transition-shadow">
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
                      className="w-full px-4 py-2 bg-primary text-white rounded-lg opacity-50 cursor-not-allowed"
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