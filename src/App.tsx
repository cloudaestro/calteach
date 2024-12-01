import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./contexts/AuthContext";
import Index from "./pages/Index";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import CrosswordGenerator from "./pages/CrosswordGenerator";
import CrosswordPuzzle from "./pages/CrosswordPuzzle";
import PrintView from "./pages/PrintView";

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
          <Route path="/print" element={<PrintView />} />
        </Routes>
      </AuthProvider>
    </Router>
  );
}

export default App;