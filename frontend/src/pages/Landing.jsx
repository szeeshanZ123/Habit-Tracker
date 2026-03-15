import React from 'react';
import { Link } from 'react-router-dom';
import { Activity, LogIn, UserPlus, Grid, BarChart3, Moon, Sun } from 'lucide-react';

export default function Landing({ toggleDarkMode, isDarkMode }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 transition-colors duration-300">
      <nav className="container mx-auto px-6 py-4 flex justify-between items-center">
        <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400">
          <Activity size={32} />
          <span className="text-2xl font-bold">HabitMinder</span>
        </div>
        <div className="flex items-center space-x-6">
          <button onClick={toggleDarkMode} className="text-gray-500 hover:text-gray-900 dark:text-gray-400 dark:hover:text-white">
            {isDarkMode ? <Sun size={24} /> : <Moon size={24} />}
          </button>
          <Link to="/login" className="text-gray-600 dark:text-gray-300 hover:text-indigo-600 dark:hover:text-indigo-400 font-medium flex items-center">
            <LogIn size={20} className="mr-1"/> Login
          </Link>
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white px-5 py-2 rounded-lg font-medium transition-colors flex items-center">
            <UserPlus size={20} className="mr-1" /> Sign Up
          </Link>
        </div>
      </nav>

      <main className="container mx-auto px-6 pt-20 pb-24 text-center">
        <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 dark:text-white mb-8 tracking-tight">
          Track habits. <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-purple-600">Achieve goals.</span>
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto mb-12">
          A clean, modern grid-calendar tracker designed to help you build consistency and visualize your progress over time.
        </p>
        
        <div className="flex flex-col sm:flex-row justify-center space-y-4 sm:space-y-0 sm:space-x-4 mb-20">
          <Link to="/signup" className="bg-indigo-600 hover:bg-indigo-700 text-white text-lg px-8 py-3 rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all flex items-center justify-center">
            Start Tracking Free
          </Link>
          <a href="#features" className="bg-white dark:bg-gray-800 text-gray-900 dark:text-white border border-gray-200 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-700 text-lg px-8 py-3 rounded-xl font-semibold transition-all">
            Learn More
          </a>
        </div>

        <div id="features" className="grid md:grid-cols-3 gap-8 text-left mt-16 max-w-5xl mx-auto">
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-indigo-100 dark:bg-indigo-900/40 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Grid className="text-indigo-600 dark:text-indigo-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Grid Tracker</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Visualize your monthly progress with a beautiful grid layout. Check off days and build visual streaks.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-purple-100 dark:bg-purple-900/40 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <BarChart3 className="text-purple-600 dark:text-purple-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Rich Analytics</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Understand your patterns with detailed charts, success rates, and streak counters.
            </p>
          </div>
          <div className="bg-white dark:bg-gray-800 p-8 rounded-2xl shadow-sm border border-gray-100 dark:border-gray-700">
            <div className="bg-teal-100 dark:bg-teal-900/40 w-14 h-14 rounded-xl flex items-center justify-center mb-6">
              <Activity className="text-teal-600 dark:text-teal-400" size={28} />
            </div>
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-3">Minimalist Design</h3>
            <p className="text-gray-600 dark:text-gray-400">
              Distraction-free interface with lovely animations. Available in light and dark mode.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
