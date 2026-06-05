import React, { memo } from 'react';
import { Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS,
  ArcElement,
  Tooltip,
  Legend
} from 'chart.js';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';

ChartJS.register(ArcElement, Tooltip, Legend);

// Helper function to generate deterministic, beautiful colors based on client name
function getClientColor(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) {
    hash = name.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  // Use HSL to ensure all dynamically generated colors look harmonious and vibrant
  // Hues: 30-50 (Gold/Amber), 140-170 (Teal/Emerald), 190-220 (Sky/Blue), 330-350 (Rose)
  const hues = [35, 155, 205, 340, 45, 165, 215, 80];
  const hueIndex = Math.abs(hash) % hues.length;
  const h = hues[hueIndex];
  const s = 65 + (Math.abs(hash) % 15); // 65-80%
  const l = 45 + (Math.abs(hash) % 10); // 45-55%
  
  return `hsl(${h}, ${s}%, ${l}%)`;
}

// React.memo: prevent re-render unless data/theme changes (Requirement #57)
const ClientDonutChart = memo(function ClientDonutChart({ data = [], theme = 'light' }) {
  const { dispatch } = useDashboard();
  const isDark = theme === 'dark';

  // If no data or all values are zero, show the beautiful placeholder
  const activeData = data.filter(d => d.total > 0);
  
  if (activeData.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center w-full h-[280px] text-center p-4">
        <div className="w-16 h-16 rounded-full bg-orange-50 dark:bg-brand-active flex items-center justify-center mb-3">
          <span className="text-3xl">😴</span>
        </div>
        <p className="text-sm font-medium text-brand-dark dark:text-gray-300">Tidak ada data klien</p>
        <p className="text-xs text-gray-400 mt-1">Belum ada invoice yang ditambahkan bulan ini</p>
      </div>
    );
  }

  const labels = activeData.map(d => d.client);
  const totals = activeData.map(d => d.total);
  const colors = labels.map(label => getClientColor(label));

  const chartData = {
    labels: labels,
    datasets: [
      {
        data: totals,
        backgroundColor: colors,
        hoverBackgroundColor: colors.map(c => c.replace('45%', '38%').replace('55%', '45%')), // Slightly darken on hover
        borderWidth: isDark ? 2 : 1,
        borderColor: isDark ? '#1E1A17' : '#FFFFFF',
      }
    ]
  };

  const options = {
    responsive: true,
    maintainAspectRatio: false,
    cutout: '65%', // Thin elegant donut
    plugins: {
      legend: {
        position: 'right',
        labels: {
          color: isDark ? '#E5E7EB' : '#1E1A17',
          font: { family: 'Outfit', size: 10 },
          padding: 8,
          boxWidth: 10,
          usePointStyle: true,
          pointStyle: 'circle',
        }
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
            const rawVal = context.raw;
            const percentage = ((rawVal / totals.reduce((a, b) => a + b, 0)) * 100).toFixed(1);
            const formattedVal = new Intl.NumberFormat('id-ID', {
              style: 'currency',
              currency: 'IDR',
              maximumFractionDigits: 0
            }).format(rawVal);
            return `${context.label}: ${formattedVal} (${percentage}%)`;
          }
        }
      }
    },
    onClick: (event, elements) => {
      // Tap slice to filter the invoice table down to that client!
      if (elements && elements.length > 0) {
        const itemIndex = elements[0].index;
        const clickedClient = labels[itemIndex];
        dispatch({
          type: ACTIONS.SET_FILTER,
          payload: { client: clickedClient }
        });
      }
    },
    hover: {
      mode: 'nearest',
      intersect: true
    }
  };

  return (
    <div className="relative w-full h-[280px]">
      <Doughnut data={chartData} options={options} />
    </div>
  );
});

export default ClientDonutChart;
