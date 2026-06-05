import React, { useState, useEffect } from 'react';
import Confetti from 'react-confetti';
import { Award, Zap, Sparkles, Plus, PlusCircle, RefreshCw } from 'lucide-react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';

export default function Achievements({ onOpenAddModal }) {
  const { state, dispatch, fetchData } = useDashboard();
  const { achievements, revenue, target, projects, theme, user } = state;
  
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowDimension, setWindowDimension] = useState({ width: window.innerWidth, height: window.innerHeight });

  // Handle window resizing for Confetti dimensions
  const detectSize = () => {
    setWindowDimension({ width: window.innerWidth, height: window.innerHeight });
  };

  useEffect(() => {
    window.addEventListener('resize', detectSize);
    return () => {
      window.removeEventListener('resize', detectSize);
    };
  }, []);

  // Trigger confetti when revenue target is achieved, only ONCE per target!
  useEffect(() => {
    const revNum = Number(revenue);
    const targetNum = Number(target);

    if (revNum > 0 && targetNum > 0 && revNum >= targetNum) {
      const storageKey = `confetti_shown_target_${targetNum}`;
      const hasCelebrated = localStorage.getItem(storageKey);
      
      if (!hasCelebrated) {
        setShowConfetti(true);
        localStorage.setItem(storageKey, 'true');
        const timer = setTimeout(() => setShowConfetti(false), 7000); // 7 seconds
        return () => clearTimeout(timer);
      }
    }
  }, [revenue, target]);

  return (
    <div className="space-y-6 no-print">
      
      {/* Dynamic Confetti Celebration */}
      {showConfetti && (
        <Confetti
          width={windowDimension.width}
          height={windowDimension.height}
          recycle={false}
          numberOfPieces={500}
          gravity={0.12}
          style={{ zIndex: 100, position: 'fixed', top: 0, left: 0 }}
        />
      )}

      {/* Segment: Quick Actions */}
      <div className="glass-card">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Zap size={14} className="text-brand-gold" />
          Aksi Cepat
        </h4>
        
        <div className="space-y-3">
          {user?.role === 'admin' ? (
            <button
              onClick={onOpenAddModal}
              className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-brand-gold hover:bg-brand-goldHover text-white text-xs font-bold rounded-xl transition-all shadow-md shadow-brand-gold/10"
            >
              <PlusCircle size={15} />
              + Tambah Invoice
            </button>
          ) : (
            <div className="p-3 text-center text-xs text-neutral-400 border border-neutral-100 dark:border-neutral-800 rounded-xl bg-neutral-50/10">
              🔒 Tambah Invoice hanya untuk Admin
            </div>
          )}

          <button
            onClick={() => {
              fetchData();
              dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '🔄 Sinkronisasi database lokal berhasil dilakukan.' } });
            }}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 border border-neutral-200 dark:border-brand-active text-brand-dark dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-brand-active text-xs font-bold rounded-xl transition-all bg-white dark:bg-brand-dark"
          >
            <RefreshCw size={14} />
            Muat Ulang Data
          </button>
        </div>
      </div>

      {/* Segment: Achievements Badge List */}
      <div className="glass-card">
        <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Award size={14} className="text-[#D97706]" />
          Pencapaian (Achievements)
        </h4>

        <div className="space-y-3">
          {achievements.map((ach) => (
            <div 
              key={ach.id} 
              className={`p-3 rounded-xl border flex items-center gap-3 transition-all ${
                ach.unlocked 
                  ? 'bg-amber-50/10 border-brand-gold/30 shadow-sm' 
                  : 'bg-neutral-50/30 border-neutral-100 dark:bg-brand-active/5 dark:border-brand-active/10 opacity-60'
              }`}
            >
              <div className="text-2xl shrink-0 p-1 select-none">
                {ach.icon}
              </div>
              
              <div className="truncate">
                <div className="flex items-center gap-1.5">
                  <p className="text-xs font-bold text-brand-dark dark:text-white truncate m-0">
                    {ach.title}
                  </p>
                  {ach.unlocked && (
                    <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-ping"></span>
                  )}
                </div>
                <p className="text-[10px] text-gray-500 truncate mt-0.5">
                  {ach.desc}
                </p>
              </div>
            </div>
          ))}
        </div>

        {/* Milestone info banner */}
        <div className="mt-4 p-3 bg-orange-50/50 dark:bg-brand-active/20 rounded-xl border border-brand-gold/15 text-[10px] text-neutral-500 dark:text-neutral-400 leading-normal">
          🏆 Pencapaian akan terbuka secara otomatis seiring dengan bertambahnya invoice, omset, dan klien Anda di database.
        </div>
      </div>

    </div>
  );
}
