import React, { useState, useEffect } from 'react';
import { Routes, Route, Link, useNavigate, useLocation } from 'react-router-dom';
import { Activity, LogOut, Sun, Moon, LayoutDashboard, Settings, User, Bell } from 'lucide-react';
import HabitGrid from '../components/HabitGrid';
import Analytics from '../components/Analytics';

export default function Dashboard({ toggleDarkMode, isDarkMode, setIsAuthenticated }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [user, setUser] = useState(null);

  useEffect(() => {
    const userData = localStorage.getItem('user');
    if (userData) {
      setUser(JSON.parse(userData));
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setIsAuthenticated(false);
    navigate('/');
  };

  const navLinks = [
    { name: 'Tracker', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Analytics', path: '/dashboard/analytics', icon: Activity },
    { name: 'Settings', path: '/dashboard/settings', icon: Settings },
  ];

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-slate-100 dark:bg-gray-900 transition-colors duration-300">
      {/* Sidebar */}
      <aside className="w-full md:w-64 bg-white dark:bg-gray-800 border-r border-slate-200 dark:border-gray-700 flex flex-col md:h-screen md:sticky md:top-0">
        <div className="p-6 flex items-center justify-between md:justify-center">
          <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
            <Activity size={28} />
            <span className="text-xl font-bold">HabitMinder</span>
          </div>
          <button onClick={toggleDarkMode} className="md:hidden text-gray-500 dark:text-gray-400">
            {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
          </button>
        </div>
        
        <nav className="flex-1 px-4 py-4 space-y-2 flex md:flex-col overflow-x-auto md:overflow-visible hidden md:flex">
          {navLinks.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.path;
            return (
              <Link
                key={link.name}
                to={link.path}
                className={`flex items-center px-4 py-3 rounded-xl transition-colors ${
                  isActive 
                    ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-900/30 dark:text-indigo-400 font-medium' 
                    : 'text-gray-600 hover:bg-gray-100 dark:text-gray-400 dark:hover:bg-gray-700/50'
                }`}
              >
                <Icon size={20} className="mr-3" />
                {link.name}
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t border-gray-200 dark:border-gray-700 hidden md:flex flex-col space-y-2">
          <button onClick={toggleDarkMode} className="flex items-center px-4 py-3 text-gray-600 dark:text-gray-400 hover:bg-gray-100 dark:hover:bg-gray-700/50 rounded-xl transition-colors">
            {isDarkMode ? <Sun size={20} className="mr-3" /> : <Moon size={20} className="mr-3" />}
            {isDarkMode ? 'Light Mode' : 'Dark Mode'}
          </button>
          <button onClick={handleLogout} className="flex items-center px-4 py-3 text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 rounded-xl transition-colors">
            <LogOut size={20} className="mr-3" />
            Logout
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 overflow-auto">
        <header className="bg-white dark:bg-gray-800 border-b border-slate-200 dark:border-gray-700 px-8 py-4 flex justify-between items-center sticky top-0 z-10">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white capitalize">
            {location.pathname.replace('/dashboard', '').replace('/', '') || 'Tracker'}
          </h1>
          <div className="flex items-center space-x-4">
            <button onClick={toggleDarkMode} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              {isDarkMode ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
              <Bell size={20} />
            </button>
            <div className="h-8 w-8 rounded-full bg-indigo-100 dark:bg-indigo-900 flex items-center justify-center text-indigo-600 dark:text-indigo-400 font-bold border border-indigo-200 dark:border-indigo-800">
              {user?.email?.[0].toUpperCase() || <User size={16} />}
            </div>
          </div>
        </header>

        <div className="p-6 md:p-8">
          <Routes>
            <Route path="/" element={<HabitGrid />} />
            <Route path="/analytics" element={<Analytics />} />
            <Route path="/settings" element={<div className="text-gray-500 dark:text-gray-400">Settings Page (Coming Soon)</div>} />
          </Routes>
        </div>
      </main>

      {/* Mobile Nav */}
      <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-200 dark:border-gray-700 flex justify-around p-3 z-20">
        {navLinks.map((link) => {
          const Icon = link.icon;
          const isActive = location.pathname === link.path;
          return (
            <Link
              key={link.name}
              to={link.path}
              className={`flex flex-col items-center p-2 rounded-lg ${
                isActive ? 'text-indigo-600 dark:text-indigo-400' : 'text-gray-500 dark:text-gray-400'
              }`}
            >
              <Icon size={20} />
              <span className="text-xs mt-1 font-medium">{link.name}</span>
            </Link>
          );
        })}
        <button onClick={handleLogout} className="flex flex-col items-center p-2 text-gray-500 dark:text-gray-400 hover:text-red-500">
          <LogOut size={20} />
          <span className="text-xs mt-1 font-medium">Exit</span>
        </button>
      </nav>
    </div>
  );
}
