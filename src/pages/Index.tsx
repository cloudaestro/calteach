import { motion } from "framer-motion";
import { FileText, Layout, Printer, Sparkles } from "lucide-react";
import { Link } from "react-router-dom";

const features = [
  {
    icon: FileText,
    title: "Easy Creation",
    description: "Design worksheets with our intuitive drag-and-drop interface",
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
    description: "Get smart suggestions for content and layout",
  },
];

const Index = () => {
  return (
    <div className="min-h-screen">
      <header className="border-b bg-white/50 backdrop-blur-xl fixed top-0 w-full z-50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <FileText className="w-6 h-6 text-primary" />
            <span className="font-display font-semibold text-lg">TeachSheets</span>
          </div>
          <nav className="hidden md:flex items-center gap-8">
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              Templates
            </Link>
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              Features
            </Link>
            <Link to="#" className="text-neutral-600 hover:text-neutral-800 transition-colors">
              Pricing
            </Link>
          </nav>
          <div className="flex items-center gap-4">
            <button className="px-4 py-2 text-neutral-600 hover:text-neutral-800 transition-colors">
              Sign in
            </button>
            <button className="px-4 py-2 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors">
              Get Started
            </button>
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
              Revolutionizing Worksheet Creation
            </span>
            <h1 className="text-5xl font-bold mb-6 leading-tight">
              Create Beautiful Worksheets in Minutes
            </h1>
            <p className="text-xl text-neutral-600 mb-8">
              The ultimate tool for teachers to create, customize, and share professional worksheets. Save time and inspire learning.
            </p>
            <div className="flex items-center justify-center gap-4">
              <button className="px-8 py-3 bg-primary text-white rounded-full hover:bg-primary-hover transition-colors text-lg">
                Create Worksheet
              </button>
              <button className="px-8 py-3 border border-neutral-200 rounded-full hover:bg-neutral-50 transition-colors text-lg">
                View Templates
              </button>
            </div>
          </motion.div>
        </section>

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