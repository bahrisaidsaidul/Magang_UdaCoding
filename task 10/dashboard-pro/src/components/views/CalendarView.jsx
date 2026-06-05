import React, { useState } from 'react';
import { useDashboard } from '../../context/DashboardContext';
import { ChevronLeft, ChevronRight, Calendar as CalendarIcon, Clock } from 'lucide-react';
import { format, addMonths, subMonths, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, isToday } from 'date-fns';

export default function CalendarView() {
  const { state } = useDashboard();
  const { projects, theme } = state;
  const isDark = theme === 'dark';

  const [currentDate, setCurrentDate] = useState(new Date());

  const nextMonth = () => setCurrentDate(addMonths(currentDate, 1));
  const prevMonth = () => setCurrentDate(subMonths(currentDate, 1));

  const monthStart = startOfMonth(currentDate);
  const monthEnd = endOfMonth(monthStart);
  const daysInMonth = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Map projects to dates (Start or End)
  const getProjectsForDay = (date) => {
    return projects.filter(p => {
      const pStart = new Date(p.start_date);
      const pEnd = new Date(p.end_date);
      return isSameDay(pStart, date) || isSameDay(pEnd, date) || (date >= pStart && date <= pEnd);
    });
  };

  return (
    <div className="glass-card animate-fadeIn">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            <CalendarIcon className="text-brand-gold" /> Jadwal Proyek
          </h2>
          <p className="text-xs text-gray-500 mt-1">Pantau timeline pengerjaan dan deadline proyek</p>
        </div>
        
        <div className="flex items-center gap-4">
          <button onClick={prevMonth} className="p-2 border border-neutral-200 dark:border-brand-active rounded-lg hover:bg-neutral-50 dark:hover:bg-brand-active text-brand-dark dark:text-white">
            <ChevronLeft size={18} />
          </button>
          <span className="font-bold text-brand-dark dark:text-white text-sm min-w-[120px] text-center">
            {format(currentDate, 'MMMM yyyy')}
          </span>
          <button onClick={nextMonth} className="p-2 border border-neutral-200 dark:border-brand-active rounded-lg hover:bg-neutral-50 dark:hover:bg-brand-active text-brand-dark dark:text-white">
            <ChevronRight size={18} />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 text-center mb-2">
        {['Minggu', 'Senin', 'Selasa', 'Rabu', 'Kamis', 'Jumat', 'Sabtu'].map(day => (
          <div key={day} className="text-[10px] font-bold text-gray-400 uppercase tracking-wider py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-2">
        {/* Fill empty days before month start */}
        {Array.from({ length: monthStart.getDay() }).map((_, i) => (
          <div key={`empty-${i}`} className="min-h-[100px] bg-neutral-50/30 dark:bg-brand-active/5 rounded-xl border border-transparent"></div>
        ))}
        
        {/* Render actual days */}
        {daysInMonth.map((day, idx) => {
          const dayProjects = getProjectsForDay(day);
          const isCurrentMonth = isSameMonth(day, currentDate);
          
          return (
            <div 
              key={idx} 
              className={`min-h-[100px] p-2 rounded-xl border transition-all ${
                isToday(day) 
                  ? 'bg-amber-50/50 border-brand-gold dark:bg-brand-active/30 dark:border-brand-gold' 
                  : isCurrentMonth
                    ? 'bg-white border-neutral-100 dark:bg-brand-sidebar dark:border-brand-active/50'
                    : 'bg-neutral-50/30 border-transparent text-gray-300 dark:bg-brand-active/5 dark:text-gray-600'
              }`}
            >
              <div className="flex items-center justify-between mb-1">
                <span className={`text-xs font-bold ${isToday(day) ? 'text-brand-gold' : 'text-brand-dark dark:text-gray-300'}`}>
                  {format(day, 'd')}
                </span>
                {dayProjects.length > 0 && (
                  <span className="w-1.5 h-1.5 rounded-full bg-brand-gold"></span>
                )}
              </div>
              
              <div className="space-y-1 mt-2">
                {dayProjects.slice(0, 3).map(p => {
                  const isEnd = isSameDay(new Date(p.end_date), day);
                  return (
                    <div 
                      key={`${p.id}-${idx}`}
                      className={`text-[9px] px-1.5 py-1 rounded truncate border ${
                        isEnd 
                          ? 'bg-red-50 text-red-600 border-red-100 dark:bg-red-950/30 dark:text-red-400 dark:border-red-900/30'
                          : 'bg-neutral-100 text-neutral-600 border-neutral-200 dark:bg-brand-active/50 dark:text-gray-400 dark:border-brand-active'
                      }`}
                      title={p.name}
                    >
                      {isEnd ? '🎯 ' : ''}{p.name}
                    </div>
                  );
                })}
                {dayProjects.length > 3 && (
                  <div className="text-[9px] text-center text-gray-400 font-medium pt-0.5">
                    +{dayProjects.length - 3} lainnya
                  </div>
                )}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
