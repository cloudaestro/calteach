import { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { FileText, Layout, Printer, Sparkles } from "lucide-react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { collection, query, where, orderBy, limit, getDocs } from "firebase/firestore";
import { db } from "@/lib/firebase";

const features = [
  {
    icon: FileText,
    title: "AI-Powered Creation",
    description: "Create worksheets instantly with our Gemini AI assistant",
  },
  {
    icon: Layout,
    title: "Smart Templates",
    description: "Choose from hundreds of professionally designed templates",
  },
  {
    icon: Printer,
    title: "Print Ready",
    description: "Generate print-perfect PDFs with one click",
  },
  {
    icon: Sparkles,
    title: "AI Assistant",
    description: "Get smart suggestions for content and layout using Google's Gemini AI",
  },
];

const Index = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentWorksheets, setRecentWorksheets] = useState([]);

  useEffect(() => {
    const fetchRecentWorksheets = async () => {
      if (!user) return;

      const q = query(
        collection(db, "savedWorksheets"),
        where("userId", "==", user.uid),
        orderBy("createdAt", "desc"),
        limit(3)
      );

      const querySnapshot = await getDocs(q);
      const worksheets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data()
      }));

      setRecentWorksheets(worksheets);
    };

    fetchRecentWorksheets();
  }, [user]);

  const handleGetStarted = () => {
    if (user) {
      navigate("/dashboard");
    } else {
      navigate("/login");
    }
  };

  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/50 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-display font-semibold text-lg">TeachSheets AI</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              Templates
            </Link>
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              Features
            </Link>
            <Link to="/my-worksheets" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              My Worksheets
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            {user ? (
              <button 
                onClick={() => navigate("/dashboard")}
                className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
              >
                Dashboard
              </button>
            ) : (
              <>
                <button 
                  onClick={() => navigate("/login")}
                  className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors"
                >
                  Sign in
                </button>
                <button 
                  onClick={handleGetStarted}
                  className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors"
                >
                  Get Started
                </button>
              </>
            )}
          </div>
        </div>
      </header>

      <main className="pt-16">
        <section className="container mx-auto px-4 py-24">
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="max-w-3xl mx-auto text-center"
          >
            <span className="px-4 py-2 bg-sage-100 text-sage-600 rounded-full text-sm font-medium inline-block mb-6">
              Powered by Google's Gemini AI
            </span>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Create AI-Powered Worksheets in Minutes
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              The ultimate tool for teachers to create, customize, and share professional worksheets. Powered by advanced AI to save time and inspire learning.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button 
                onClick={handleGetStarted}
                className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-lg"
              >
                Create Worksheet
              </button>
              <button 
                onClick={() => navigate("/templates")}
                className="px-8 py-3 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors text-lg"
              >
                View Templates
              </button>
            </div>
          </motion.div>
        </section>

        {user && recentWorksheets.length > 0 && (
          <section className="container mx-auto px-4 py-12">
            <div className="max-w-4xl mx-auto">
              <h2 className="text-2xl font-bold mb-6">Recent Worksheets</h2>
              <div className="grid gap-4">
                {recentWorksheets.map((worksheet: any) => (
                  <div
                    key={worksheet.id}
                    className="bg-white p-4 rounded-lg shadow hover:shadow-md transition-shadow"
                  >
                    <h3 className="text-xl font-semibold mb-2">{worksheet.title}</h3>
                    <button 
                      onClick={() => navigate(`/crossword/${worksheet.worksheetId}`)}
                      className="text-primary hover:text-primary-hover transition-colors"
                    >
                      Open Worksheet →
                    </button>
                  </div>
                ))}
                <Link 
                  to="/my-worksheets"
                  className="text-center text-primary hover:text-primary-hover transition-colors mt-4"
                >
                  View All Worksheets →
                </Link>
              </div>
            </div>
          </section>
        )}

        <section className="container mx-auto px-4 py-24 bg-neutral-50">
          <div className="max-w-6xl mx-auto">
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
              {features.map((feature, index) => (
                <motion.div
                  key={feature.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                  className="p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow"
                >
                  <feature.icon className="w-10 h-10 text-primary mb-4" />
                  <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                  <p className="text-neutral-600">{feature.description}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>
      </main>
    </div>
  );
};

export default Index;