import React from 'react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import { Bell, Check, Trash2 } from 'lucide-react';

export default function NotificationsView() {
  const { state, dispatch } = useDashboard();
  const { notifications } = state;

  const unreadCount = notifications.filter(n => !n.read).length;

  return (
    <div className="glass-card max-w-4xl mx-auto animate-fadeIn min-h-[500px]">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-8 gap-4 border-b border-neutral-100 dark:border-brand-active pb-4">
        <div>
          <h2 className="text-xl font-bold text-brand-dark dark:text-white flex items-center gap-2">
            <Bell className="text-brand-gold" /> Pusat Pemberitahuan
          </h2>
          <p className="text-xs text-gray-500 mt-1">
            Anda memiliki {unreadCount} pesan yang belum dibaca.
          </p>
        </div>
        
        {unreadCount > 0 && (
          <button
            onClick={() => dispatch({ type: ACTIONS.MARK_NOTIFICATIONS_READ })}
            className="px-4 py-2 bg-brand-gold hover:bg-brand-goldHover text-white rounded-xl text-xs font-semibold flex items-center justify-center gap-2 transition-all shadow-md"
          >
            <Check size={14} /> Tandai Semua Dibaca
          </button>
        )}
      </div>

      <div className="space-y-4">
        {notifications.length > 0 ? (
          notifications.map((n) => (
            <div
              key={n.id}
              className={`p-4 rounded-2xl border transition-all flex items-start gap-4 ${
                n.read
                  ? 'bg-neutral-50/50 border-neutral-100 dark:bg-brand-active/5 dark:border-brand-active/20 text-neutral-500'
                  : 'bg-amber-50/30 border-brand-gold/30 shadow-sm text-brand-dark dark:text-gray-200'
              }`}
            >
              <div className={`mt-1 w-2 h-2 rounded-full shrink-0 ${n.read ? 'bg-transparent' : 'bg-brand-gold animate-pulse'}`}></div>
              <div className="flex-1">
                <p className={`text-sm ${n.read ? 'font-medium' : 'font-bold'}`}>{n.message}</p>
                <span className="text-[11px] text-gray-400 font-medium block mt-1.5">{n.time}</span>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20">
            <div className="w-16 h-16 rounded-full bg-neutral-100 dark:bg-brand-active flex items-center justify-center mx-auto mb-4 text-gray-300">
              <Bell size={32} />
            </div>
            <p className="text-sm font-semibold text-gray-500">Belum ada pemberitahuan</p>
            <p className="text-xs text-gray-400 mt-1">Aktivitas dan pencapaian Anda akan muncul di sini.</p>
          </div>
        )}
      </div>
    </div>
  );
}
