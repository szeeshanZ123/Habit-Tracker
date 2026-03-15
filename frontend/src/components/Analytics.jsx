import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
} from 'chart.js';
import { Line, Doughnut, Bar } from 'react-chartjs-2';
import { getDaysInMonth, format, subMonths, addMonths } from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export default function Analytics() {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const fetchStats = async () => {
    setLoading(true);
    try {
      const year = currentDate.getFullYear();
      const month = currentDate.getMonth(); // 0-based
const res = await axios.get(`https://habit-tracker-5ifp.onrender.com/api/habits?year=${year}&month=${month + 1}`, {        headers: { Authorization: `Bearer ${localStorage.getItem('token')}` }
      });
      
      const habits = res.data;
      const daysCount = getDaysInMonth(new Date(year, month));
      
      // Calculate daily completion array (number of habits completed per day)
      const dailyCompletion = Array(daysCount).fill(0);
      let totalCompleted = 0;
      
      habits.forEach(h => {
        h.entries?.forEach(e => {
          if(e.completed && e.day <= daysCount) {
            dailyCompletion[e.day - 1] += 1;
            totalCompleted++;
          }
        });
      });

      const maxPossible = habits.length * daysCount;
      const successRate = maxPossible === 0 ? 0 : Math.round((totalCompleted / maxPossible) * 100);

      // Bar chart data (completion per habit)
      const habitCompletionNames = [];
      const habitCompletionData = [];
      
      habits.forEach(h => {
        habitCompletionNames.push(h.name);
        const comp = h.entries?.filter(e => e.completed).length || 0;
        habitCompletionData.push(comp);
      });

      setData({
        daysCount,
        dailyCompletion,
        successRate,
        totalCompleted,
        habitCompletionNames,
        habitCompletionData,
        habitsCount: habits.length
      });
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const year = currentDate.getFullYear();

  if(!data && loading) {
     return <div className="flex justify-center p-20"><div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div></div>;
  }
  if (!data) return null;

  const isDark = document.documentElement.classList.contains('dark');
  const textColor = isDark ? '#e5e7eb' : '#374151';
  const gridColor = isDark ? '#374151' : '#f3f4f6';

  const chartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        labels: { color: textColor }
      }
    },
    scales: {
      x: { 
        ticks: { color: textColor },
        grid: { color: gridColor }
      },
      y: {
        ticks: { color: textColor, precision: 0 },
        grid: { color: gridColor }
      }
    }
  };

  const lineData = {
    labels: Array.from({length: data.daysCount}, (_, i) => i + 1),
    datasets: [
      {
        fill: true,
        label: 'Habits Completed',
        data: data.dailyCompletion,
        borderColor: 'rgb(16, 185, 129)',
        backgroundColor: 'rgba(16, 185, 129, 0.2)',
        tension: 0.4
      }
    ]
  };

  const donutData = {
    labels: ['Completed', 'Missed'],
    datasets: [
      {
        data: [data.successRate, 100 - data.successRate],
        backgroundColor: [
          'rgba(16, 185, 129, 0.9)',
          'rgba(243, 244, 246, 0.2)'
        ],
        borderColor: [
          'transparent',
          'transparent'
        ],
        borderWidth: 0,
        hoverOffset: 4
      }
    ]
  };

  const barData = {
    labels: data.habitCompletionNames,
    datasets: [
      {
        label: 'Days Completed This Month',
        data: data.habitCompletionData,
        backgroundColor: 'rgba(16, 185, 129, 0.8)',
        borderRadius: 6
      }
    ]
  };

  return (
    <div className={`space-y-6 transition-opacity duration-300 ${loading ? 'opacity-50 pointer-events-none' : 'opacity-100'}`}>
      
      {/* Top Header Controls */}
      <div className="flex flex-col md:flex-row justify-between items-center bg-white dark:bg-gray-800 p-4 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700">
        <h2 className="hidden md:block text-lg font-bold text-gray-900 dark:text-white mb-4 md:mb-0">Performance Analytics</h2>
        <div className="flex items-center space-x-6">
          <button onClick={handlePrevMonth} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors">
            <ChevronLeft className="text-gray-700 dark:text-gray-300" />
          </button>
          
          <div className="text-center w-36">
            <h2 className="text-xl font-bold text-gray-900 dark:text-white leading-tight">
              {format(currentDate, 'MMMM')}
            </h2>
            <p className="text-xs font-medium text-gray-500 dark:text-gray-400">
              {year} • {data.daysCount} Days
            </p>
          </div>
          
          <button onClick={handleNextMonth} className="p-2 bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 rounded-xl transition-colors">
            <ChevronRight className="text-gray-700 dark:text-gray-300" />
          </button>
        </div>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Total Habits</p>
          <p className="text-3xl font-bold text-gray-900 dark:text-white">{data.habitsCount}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Items Completed</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{data.totalCompleted}</p>
        </div>
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 text-center">
          <p className="text-sm text-gray-500 dark:text-gray-400 font-medium mb-1">Success Rate</p>
          <p className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{data.successRate}%</p>
        </div>
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Line Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 lg:col-span-2">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Daily Completion Trend</h3>
          <div className="h-64">
            <Line data={lineData} options={chartOptions} />
          </div>
        </div>

        {/* Donut Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 flex flex-col items-center">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6 w-full text-left">Monthly Target</h3>
          <div className="h-48 w-full flex justify-center relative">
            <Doughnut 
              data={donutData} 
              options={{
                cutout: '75%', 
                plugins: { legend: { display: false } }
              }} 
            />
            <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none mt-2">
               <span className="text-3xl font-bold text-gray-900 dark:text-white">{data.successRate}%</span>
               <span className="text-xs text-gray-500 dark:text-gray-400">Success</span>
            </div>
          </div>
        </div>

        {/* Bar Chart */}
        <div className="bg-white dark:bg-gray-800 p-6 rounded-2xl shadow-md border border-slate-200 dark:border-gray-700 lg:col-span-3">
          <h3 className="text-lg font-bold text-gray-900 dark:text-white mb-6">Completion by Habit</h3>
          <div className="h-64">
            <Bar data={barData} options={chartOptions} />
          </div>
        </div>

      </div>
    </div>
  );
}
