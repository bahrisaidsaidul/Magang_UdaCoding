import React from 'react';
import { Radar } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
} from 'chart.js';

ChartJS.register(
  RadialLinearScale,
  PointElement,
  LineElement,
  Filler,
  Tooltip,
  Legend
);

// Requirement #41-43: 6 developer skills dengan nilai tetap
// React(90), Laravel(85), JS(95), TypeScript(80), PHP(88), Node.js(78)
const SKILLS = [
  { label: 'JavaScript', value: 95 },
  { label: 'React', value: 90 },
  { label: 'PHP', value: 88 },
  { label: 'Laravel', value: 85 },
  { label: 'TypeScript', value: 80 },
  { label: 'Node.js', value: 78 },
];

export default function SkillsRadarChart({ theme = 'light' }) {
  const isDark = theme === 'dark';

  const chartData = {
    labels: SKILLS.map(s => s.label),
    datasets: [
      {
        label: 'Skill Level (%)',
        data: SKILLS.map(s => s.value),
        // Animated stroke fill
        backgroundColor: isDark ? 'rgba(217, 119, 6, 0.15)' : 'rgba(217, 119, 6, 0.12)',
        borderColor: '#D97706',
        borderWidth: 2.5,
        pointBackgroundColor: '#D97706',
        pointBorderColor: isDark ? '#1E1A17' : '#FFFFFF',
        pointHoverBackgroundColor: '#FFFFFF',
        pointHoverBorderColor: '#D97706',
        pointRadius: 5,
        pointHoverRadius: 7,
        fill: true,
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false,
      },
      tooltip: {
        backgroundColor: isDark ? '#1E1A17' : '#FFFFFF',
        titleColor: isDark ? '#F9FAF5' : '#1E1A17',
        bodyColor: isDark ? '#D1D5DB' : '#4B5563',
        borderColor: isDark ? '#3A3029' : '#E5E7EB',
        borderWidth: 1,
        titleFont: { family: 'Outfit', weight: 'bold' },
        bodyFont: { family: 'Outfit' },
        padding: 10,
        callbacks: {
          label: function (context) {
            return `${context.label}: ${context.raw}%`;
          }
        }
      }
    },
    scales: {
      r: {
        min: 0,
        max: 100,
        angleLines: {
          color: isDark ? '#3A3029' : '#E5E7EB'
        },
        grid: {
          color: isDark ? '#2C2520' : '#F3F4F6'
        },
        pointLabels: {
          color: isDark ? '#E5E7EB' : '#374151',
          font: {
            family: 'Outfit',
            size: 11,
            weight: '600'
          }
        },
        ticks: {
          display: true,
          stepSize: 25,
          color: isDark ? '#6B7280' : '#9CA3AF',
          font: { family: 'Outfit', size: 9 },
          backdropColor: 'transparent',
          callback: (val) => val + '%',
        },
      }
    },
    // Animated stroke draw effect (Requirement #43)
    animation: {
      duration: 2000,
      easing: 'easeInOutQuart',
      onProgress: function (animation) {}
    },
    layout: {
      padding: {
        top: 15,
        bottom: 30, // extra space for bottom legend
        left: 15,
        right: 15
      }
    }
  };

  return (
    <div className="relative w-full h-[320px]">
      <Radar data={chartData} options={options} />
      {/* Skill legend badges */}
      <div className="absolute bottom-0 left-0 right-0 flex flex-wrap justify-center gap-x-3 gap-y-1 px-2 pb-2">
        {SKILLS.map((s) => (
          <div key={s.label} className="flex items-center gap-1">
            <div className="w-1.5 h-1.5 rounded-full bg-brand-gold shrink-0" />
            <span className="text-[9px] font-bold text-gray-400 dark:text-gray-500">
              {s.label} <span className="text-brand-gold">{s.value}%</span>
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}
