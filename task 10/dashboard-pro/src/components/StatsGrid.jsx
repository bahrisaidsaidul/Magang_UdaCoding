import React from 'react';
import { useDashboard } from '../context/DashboardContext';
import { Wallet, TrendingUp, FileText, Target } from 'lucide-react';

export default function StatsGrid() {
  const { state } = useDashboard();
  const { revenue, target, achievement, avgDaily, projects } = state;

  // Format IDR Helper into short Juta / Ribu shorthand
  const formatShorthand = (val, type = 'jt') => {
    if (val >= 1000000) {
      return `Rp ${(val / 1000000).toFixed(0)}jt`;
    }
    if (val >= 1000) {
      return `Rp ${(val / 1000).toFixed(0)}rb`;
    }
    return `Rp ${val}`;
  };

  const activeProjectsCount = projects.filter(p => p.status !== 'completed').length;

  const stats = [
    {
      title: 'OMSET BULANAN',
      value: formatShorthand(revenue),
      subtext: 'Total penerimaan bulan ini',
      icon: <Wallet size={18} className="text-brand-gold" />,
      bg: 'bg-orange-50/50 dark:bg-brand-active/20'
    },
    {
      title: 'RATA-RATA HARIAN',
      value: formatShorthand(avgDaily),
      subtext: 'Omset rata-rata per hari',
      icon: <TrendingUp size={18} className="text-[#D97706]" />,
      bg: 'bg-orange-50/50 dark:bg-brand-active/20'
    },
    {
      title: 'TOTAL INVOICE',
      value: projects.length.toString(),
      subtext: `${activeProjectsCount} proyek aktif bulan ini`,
      icon: <FileText size={18} className="text-brand-gold" />,
      bg: 'bg-orange-50/50 dark:bg-brand-active/20'
    },
    {
      title: 'PENCAPAIAN TARGET',
      value: `${achievement.toFixed(1)}%`,
      subtext: `dari target ${new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(target)}`,
      icon: <Target size={18} className="text-[#D97706]" />,
      bg: 'bg-orange-50/50 dark:bg-brand-active/20',
      progress: Math.min(achievement, 100)
    }
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
      {stats.map((stat, i) => (
        <div key={i} className="glass-card flex flex-col justify-between">
          
          {/* Card Header */}
          <div className="flex items-start justify-between">
            <div>
              <p className="text-[10px] font-bold text-gray-400 dark:text-gray-500 tracking-wider uppercase">
                {stat.title}
              </p>
              <h3 className="text-2xl font-extrabold text-brand-dark dark:text-white mt-2 tracking-tight">
                {stat.value}
              </h3>
            </div>
            
            <div className={`p-2.5 rounded-xl ${stat.bg} shadow-sm shrink-0`}>
              {stat.icon}
            </div>
          </div>

          {/* Card Footer */}
          <div className="mt-4">
            <p className="text-xs text-neutral-400 dark:text-neutral-500">
              {stat.subtext}
            </p>
            
            {/* Display progress bar if this is target milestone card */}
            {stat.progress !== undefined && (
              <div className="w-full bg-neutral-100 dark:bg-neutral-800 h-1.5 rounded-full mt-3 overflow-hidden">
                <div 
                  className="bg-brand-gold h-full rounded-full transition-all duration-1000" 
                  style={{ width: `${stat.progress}%` }}
                />
              </div>
            )}
          </div>

        </div>
      ))}
    </div>
  );
}
