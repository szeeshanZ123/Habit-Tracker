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
} from "chart.js";
import { Line, Doughnut, Bar } from "react-chartjs-2";
import { getDaysInMonth, format, subMonths, addMonths } from "date-fns";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { API_URL } from '../config';
    
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
  const navigate = useNavigate();

  useEffect(() => {
    fetchStats();
  }, [currentDate]);

  const handlePrevMonth = () => setCurrentDate(subMonths(currentDate, 1));
  const handleNextMonth = () => setCurrentDate(addMonths(currentDate, 1));

  const fetchStats = async () => {
    setLoading(true);

    try {
      const token = localStorage.getItem("token");

      if (!token) {
        console.log("User not logged in");
        navigate("/login");
        return;
      }

      const year = currentDate.getFullYear();
      const month = currentDate.getMonth();

      const res = await axios.get(
        `${API_URL}/api/habits?year=${year}&month=${month + 1}`,
        {
          headers: {
            Authorization: `Bearer ${token}`
          }
        }
      );

      const habits = res.data;
      const daysCount = getDaysInMonth(new Date(year, month));

      const dailyCompletion = Array(daysCount).fill(0);
      let totalCompleted = 0;

      habits.forEach((h) => {
        h.entries?.forEach((e) => {
          if (e.completed && e.day <= daysCount) {
            dailyCompletion[e.day - 1] += 1;
            totalCompleted++;
          }
        });
      });

      const maxPossible = habits.length * daysCount;
      const successRate =
        maxPossible === 0
          ? 0
          : Math.round((totalCompleted / maxPossible) * 100);

      // Bar chart data (completion per habit)
      const habitCompletionNames = [];
      const habitCompletionData = [];

      habits.forEach((h) => {
        habitCompletionNames.push(h.name);
        const comp = h.entries?.filter((e) => e.completed).length || 0;
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
      console.error("Analytics error:", err);

      if (err.response?.status === 401) {
        console.log("Token invalid, redirecting to login");
        localStorage.removeItem("token");
        navigate("/login");
      }
    } finally {
      setLoading(false);
    }
  };

  if (!data && loading) {
    return (
      <div className="flex justify-center p-20">
        <div className="animate-spin rounded-full h-10 w-10 border-4 border-indigo-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!data) return null;

  const isDark = document.documentElement.classList.contains("dark");
  const textColor = isDark ? "#e5e7eb" : "#374151";
  const gridColor = isDark ? "#374151" : "#f3f4f6";

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
    labels: Array.from({ length: data.daysCount }, (_, i) => i + 1),
    datasets: [
      {
        fill: true,
        label: "Habits Completed",
        data: data.dailyCompletion,
        borderColor: "rgb(16,185,129)",
        backgroundColor: "rgba(16,185,129,0.2)",
        tension: 0.4
      }
    ]
  };

  const donutData = {
    labels: ["Completed", "Missed"],
    datasets: [
      {
        data: [data.successRate, 100 - data.successRate],
        backgroundColor: [
          "rgba(16,185,129,0.9)",
          "rgba(243,244,246,0.2)"
        ],
        borderWidth: 0
      }
    ]
  };

  const barData = {
    labels: data.habitCompletionNames,
    datasets: [
      {
        label: "Days Completed",
        data: data.habitCompletionData,
        backgroundColor: "rgba(16,185,129,0.8)",
        borderRadius: 6
      }
    ]
  };

  return (
    <div className="space-y-6">

      {/* Month Controls */}
      <div className="flex justify-between items-center">
        <button onClick={handlePrevMonth}>
          <ChevronLeft />
        </button>

        <h2 className="text-xl font-bold">
          {format(currentDate, "MMMM yyyy")}
        </h2>

        <button onClick={handleNextMonth}>
          <ChevronRight />
        </button>
      </div>

      {/* Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        <div className="lg:col-span-2 h-64">
          <Line data={lineData} options={chartOptions} />
        </div>

        <div className="h-64">
          <Doughnut data={donutData} />
        </div>

        <div className="lg:col-span-3 h-64">
          <Bar data={barData} options={chartOptions} />
        </div>

      </div>

    </div>
  );
    }