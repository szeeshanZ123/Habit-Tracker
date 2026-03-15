import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Landing from './pages/Landing';
import Login from './pages/Login';
import Signup from './pages/Signup';
import Dashboard from './pages/Dashboard';

function App() {
  const [isDarkMode, setIsDarkMode] = useState(
    localStorage.getItem('theme') === 'dark' ||
    (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)
  );

  useEffect(() => {
    if (isDarkMode) {
      document.documentElement.classList.add('dark');
      localStorage.setItem('theme', 'dark');
    } else {
      document.documentElement.classList.remove('dark');
      localStorage.setItem('theme', 'light');
    }
  }, [isDarkMode]);

  const toggleDarkMode = () => setIsDarkMode(!isDarkMode);

  // In a real app, this should depend on AuthContext
  const [isAuthenticated, setIsAuthenticated] = useState(!!localStorage.getItem('token'));

  return (
    <Router>
      <div className="min-h-screen">
        <Routes>
          <Route path="/" element={<Landing toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} />} />
          <Route path="/login" element={<Login setIsAuthenticated={setIsAuthenticated} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>} />
          <Route path="/signup" element={<Signup setIsAuthenticated={setIsAuthenticated} toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode}/>} />
          <Route path="/dashboard/*" element={isAuthenticated ? <Dashboard toggleDarkMode={toggleDarkMode} isDarkMode={isDarkMode} setIsAuthenticated={setIsAuthenticated} /> : <Navigate to="/login" />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
