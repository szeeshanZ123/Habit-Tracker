import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Plus, Trash2, Edit2, Save, X } from 'lucide-react';
import { format, getDaysInMonth, startOfMonth, addMonths, subMonths } from 'date-fns';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

export default function HabitGrid() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [habits, setHabits] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  
  // New habit form
  const [isAddingMode, setIsAddingMode] = useState(false);
  const [newHabitName, setNewHabitName] = useState('');

  // Edit mode
  const [editingHabit, setEditingHabit] = useState(null);
  const [editName, setEditName] = useState('');

  const year = currentDate.getFullYear();
  const month = currentDate.getMonth();
  const daysInMonth = getDaysInMonth(currentDate);
  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);

  useEffect(() => {
    fetchHabits();
  }, [year, month]);

  const fetchHabits = async () => {
    setLoading(true);
    try {
      const res = await axios.get(`https://habit-tracker-5ifp.onrender.com/api/habits?year=${year}&month=${month + 1}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(res.data);
    } catch (err) {
      console.error('Failed to fetch habits', err);
      if (err.response?.status === 401) {
        localStorage.removeItem('token');
        navigate('/login');
      }
    } finally {
      setLoading(false);
    }
  };

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const toggleDay = async (habitId, day) => {
    // Optimistic update
    const updatedHabits = [...habits];
    const habitIndex = updatedHabits.findIndex(h => h._id === habitId);
    if(habitIndex === -1) return;
    
    const habit = updatedHabits[habitIndex];
    // Find entry
    const existingEntryIndex = habit.entries?.findIndex(e => e.day === day);
    let isCompleted = true;
    
    if (existingEntryIndex >= 0) {
      isCompleted = !habit.entries[existingEntryIndex].completed;
      habit.entries[existingEntryIndex].completed = isCompleted;
    } else {
      if(!habit.entries) habit.entries = [];
      habit.entries.push({ day, completed: true });
    }
    
    setHabits(updatedHabits);

    try {
      await axios.post('https://habit-tracker-5ifp.onrender.com/api/habits/toggle', {
        habitId,
        year,
        month: month + 1,
        day,
        completed: isCompleted
      }, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
    } catch (err) {
      console.error('Failed to toggle', err);
      // Revert in real prod app
    }
  };

  const addHabit = async () => {
    if (!newHabitName.trim()) return;
    try {
      const res = await axios.post('https://habit-tracker-5ifp.onrender.com/api/habits', 
        { name: newHabitName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setHabits([...habits, { ...res.data, entries: [] }]);
      setNewHabitName('');
      setIsAddingMode(false);
    } catch (err) {
      console.error('Failed to add habit', err);
    }
  };

  const deleteHabit = async (habitId) => {
    if(!window.confirm('Are you sure you want to delete this habit?')) return;
    try {
      await axios.delete(`https://habit-tracker-5ifp.onrender.com/api/habits/${habitId}`, {
        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      setHabits(habits.filter(h => h._id !== habitId));
    } catch (err) {
      console.error('Failed to delete', err);
    }
  };

  const saveEdit = async (habitId) => {
    try {
      await axios.put(`https://habit-tracker-5ifp.onrender.com/api/habits/${habitId}`,
        { name: editName },
        { headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }}
      );
      setHabits(habits.map(h => h._id === habitId ? { ...h, name: editName } : h));
      setEditingHabit(null);
    } catch (err) {
      console.error('Failed to edit', err);
    }
  };

  // Calculate overall progress for the month
  let totalPossible = habits.length * daysInMonth;
  let totalCompleted = 0;
  habits.forEach(h => {
    if(h.entries) {
      totalCompleted += h.entries.filter(e => e.completed).length;
    }
  });
  const successRate = totalPossible === 0 ? 0 : Math.round((totalCompleted / totalPossible) * 100);

  return (
    <div className="bg-white dark:bg-gray-800 rounded-2xl p-6 md:p-8 shadow-md border border-slate-200 dark:border-gray-700 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center mb-8 space-y-4 md:space-y-0">
        <div className="flex items-center space-x-6">
          <button onClick={handlePrevMonth} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors">
            <ChevronLeft className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="text-center">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {format(currentDate, 'MMMM')}
            </h2>
            <p className="text-sm font-medium text-gray-500 dark:text-gray-400">
              {year} • {daysInMonth} Days
            </p>
          </div>
          
          <button onClick={handleNextMonth} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors">
            <ChevronRight className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>

        <div className="flex items-center space-x-4">
          <div className="bg-indigo-50 dark:bg-indigo-900/30 px-5 py-3 rounded-xl border border-indigo-100 dark:border-indigo-800">
            <span className="text-sm text-indigo-800 dark:text-indigo-300 font-medium">Monthly Success:</span>
            <span className="ml-2 text-xl font-bold text-indigo-600 dark:text-indigo-400">{successRate}%</span>
          </div>
          <button 
            onClick={() => setIsAddingMode(!isAddingMode)}
            className="bg-indigo-600 hover:bg-indigo-700 text-white px-4 py-3 rounded-xl font-medium transition-colors shadow flex items-center"
          >
            <Plus size={20} className="mr-1" /> Add Habit
          </button>
        </div>
      </div>

      {isAddingMode && (
        <div className="mb-6 flex space-x-2 animate-in fade-in zoom-in-95 duration-200">
          <input 
            type="text" 
            placeholder="E.g. Morning Jog, Reading 20 pages..." 
            className="flex-1 px-4 py-3 border border-gray-300 dark:border-gray-600 rounded-xl focus:ring-2 focus:ring-indigo-500 outline-none dark:bg-gray-700 dark:text-white"
            value={newHabitName}
            onChange={(e) => setNewHabitName(e.target.value)}
            autoFocus
            onKeyDown={(e) => e.key === 'Enter' && addHabit()}
          />
          <button onClick={addHabit} className="bg-green-500 hover:bg-green-600 text-white px-6 py-3 rounded-xl font-medium transition-colors">Save</button>
          <button onClick={() => setIsAddingMode(false)} className="bg-gray-200 dark:bg-gray-700 hover:bg-gray-300 dark:hover:bg-gray-600 text-gray-700 dark:text-white px-4 py-3 rounded-xl transition-colors"><X size={20}/></button>
        </div>
      )}

      {/* Grid wrapper */}
      <div className="overflow-x-auto pb-4">
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-500 border-t-transparent"></div>
          </div>
        ) : (
          <div className="min-w-max border border-gray-200 dark:border-gray-700 rounded-xl overflow-hidden bg-white dark:bg-gray-800">
            {/* Header Row */}
            <div className="flex border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
              <div className="w-48 sm:w-64 p-3 font-semibold text-gray-700 dark:text-gray-300 sticky left-0 bg-gray-50 dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 z-10 flex items-center px-4">
                Habit
              </div>
              <div className="flex flex-1">
                {daysArray.map(day => (
                  <div key={day} className="w-10 sm:w-12 flex-shrink-0 flex items-center justify-center font-medium text-xs sm:text-sm text-gray-500 border-r border-gray-200 dark:border-gray-700 dark:text-gray-400 py-3">
                    {day}
                  </div>
                ))}
              </div>
            </div>

            {/* Habit Rows */}
            {habits.length === 0 ? (
              <div className="p-8 text-center text-gray-500 dark:text-gray-400 bg-gray-50/50 dark:bg-gray-800/50">
                You haven't tracked any habits this month. Time to start!
              </div>
            ) : (
              habits.map((habit, i) => {
                const isEditing = editingHabit === habit._id;
                
                return (
                  <div key={habit._id} className="group flex border-b last:border-0 border-gray-200 dark:border-gray-700 hover:bg-gray-50/50 dark:hover:bg-gray-700/30 transition-colors">
                    <div className="w-48 sm:w-64 sticky left-0 bg-white dark:bg-gray-800 group-hover:bg-gray-50 dark:group-hover:bg-gray-700/80 border-r border-gray-200 dark:border-gray-700 z-10 flex items-center justify-between px-4 py-2 transition-colors">
                      {isEditing ? (
                        <div className="flex items-center space-x-2 w-full">
                          <input 
                            className="w-full bg-gray-100 dark:bg-gray-700 px-2 py-1 rounded text-sm text-gray-900 dark:text-white"
                            value={editName}
                            onChange={(e) => setEditName(e.target.value)}
                            onKeyDown={(e) => e.key === 'Enter' && saveEdit(habit._id)}
                            autoFocus
                          />
                          <button onClick={() => saveEdit(habit._id)} className="text-green-500 hover:text-green-600"><Save size={16}/></button>
                        </div>
                      ) : (
                        <>
                          <span className="font-medium text-gray-800 dark:text-gray-200 text-sm truncate pr-2" title={habit.name}>{habit.name}</span>
                          <div className="flex space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                            <button onClick={() => { setEditingHabit(habit._id); setEditName(habit.name); }} className="p-1 text-gray-400 hover:text-indigo-500">
                              <Edit2 size={14} />
                            </button>
                            <button onClick={() => deleteHabit(habit._id)} className="p-1 text-gray-400 hover:text-red-500">
                              <Trash2 size={14} />
                            </button>
                          </div>
                        </>
                      )}
                    </div>
                    
                    <div className="flex flex-1">
                      {daysArray.map(day => {
                        const entry = habit.entries?.find(e => e.day === day);
                        const isCompleted = entry?.completed;
                        const isToday = day === new Date().getDate() && month === new Date().getMonth() && year === new Date().getFullYear();
                        
                        return (
                          <div key={day} className={`w-10 sm:w-12 flex-shrink-0 border-r border-gray-200 dark:border-gray-700 flex items-center justify-center p-1 sm:p-1.5 ${isToday ? 'bg-indigo-50/50 dark:bg-indigo-900/10' : ''}`}>
                            <button
                              onClick={() => toggleDay(habit._id, day)}
                              className={`w-full h-full rounded-md md:rounded-lg flex items-center justify-center transition-all duration-200 transform hover:scale-105 active:scale-95 ${
                                isCompleted 
                                  ? 'bg-indigo-500 shadow-md shadow-indigo-500/20 text-white' 
                                  : 'bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-transparent hover:text-gray-400'
                              }`}
                            >
                              ✓
                            </button>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                );
              })
            )}
          </div>
        )}
      </div>
    </div>
  );
}
