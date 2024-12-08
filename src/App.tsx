import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CrosswordGenerator from "./pages/CrosswordGenerator";
import CrosswordPuzzle from "./pages/CrosswordPuzzle";
import CrosswordPrint from "./pages/CrosswordPrint";
import MyWorksheets from "./pages/MyWorksheets";
import Profile from "./pages/Profile";
import Pricing from "./pages/Pricing";
import FloatingNav from "./components/FloatingNav";

function App() {
  return (
    <Router>
      <AuthProvider>
        <FloatingNav />
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/crossword" element={<CrosswordGenerator />} />
          <Route path="/crossword/:id" element={<CrosswordPuzzle />} />
          <Route path="/crossword/print/:id" element={<CrosswordPrint />} />
          <Route path="/crossword/print-answer/:id" element={<CrosswordPrint />} />
          <Route path="/my-worksheets" element={<MyWorksheets />} />
          <Route path="/profile" element={<Profile />} />
          <Route path="/pricing" element={<Pricing />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;