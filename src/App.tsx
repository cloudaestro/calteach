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

function App() {
  return (
    <Router>
      <AuthProvider>
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
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;