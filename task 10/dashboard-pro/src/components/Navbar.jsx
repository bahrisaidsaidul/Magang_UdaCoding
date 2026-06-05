import React, { useState, useEffect, memo } from 'react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';
import useDebounce from '../hooks/useDebounce';
import { Search, Bell, Sun, Moon, Check, FileSpreadsheet } from 'lucide-react';

// React.memo prevents re-render unless props change (Requirement #57)
const Navbar = memo(function Navbar() {
  const { state, dispatch } = useDashboard();
  const { filters, notifications, theme } = state;
  
  const isDark = theme === 'dark';
  const [localSearch, setLocalSearch] = useState(filters.search);
  const [showNotifications, setShowNotifications] = useState(false);

  // useDebounce hook 300ms (Requirement #14-15): only 1 dispatch per rapid typing burst
  const debouncedSearch = useDebounce(localSearch, 300);

  useEffect(() => {
    dispatch({ 
      type: ACTIONS.SET_FILTER, 
      payload: { search: debouncedSearch } 
    });
  }, [debouncedSearch, dispatch]);

  // Sync state search back to local (e.g. if reset externally)
  useEffect(() => {
    setLocalSearch(filters.search);
  }, [filters.search]);

  // Calculate unread count
  const unreadNotificationsCount = notifications.filter(n => !n.read).length;

  return (
    <header className="flex flex-col md:flex-row md:items-center md:justify-between py-5 border-b border-neutral-100 dark:border-brand-active/20 gap-4 no-print select-none">
      
      {/* Welcome Title */}
      <div>
        <h2 className="text-xl font-bold text-brand-dark dark:text-white m-0">Dashboard</h2>
        <p className="text-xs text-gray-500 font-medium mt-1">Ringkasan omset & invoice</p>
      </div>

      {/* Action Toolbar */}
      <div className="flex items-center gap-3 self-end md:self-auto w-full md:w-auto">
        
        {/* Search Field */}
        <div className="relative flex-1 md:w-64 rounded-xl shadow-sm">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-gray-400">
            <Search size={15} />
          </div>
          <input
            type="text"
            value={localSearch}
            onChange={(e) => setLocalSearch(e.target.value)}
            className="block w-full pl-9 pr-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark rounded-xl text-xs font-medium focus:ring-1 focus:ring-brand-gold focus:border-brand-gold text-brand-dark dark:text-white"
            placeholder="Cari proyek atau klien..."
          />
        </div>

        {/* Alternative Theme Toggle */}
        <button
          onClick={() => dispatch({ type: ACTIONS.TOGGLE_THEME })}
          className="p-2 border border-neutral-200 dark:border-brand-active rounded-xl bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-brand-active transition-all focus:outline-none"
          title="Toggle Mode"
        >
          {isDark ? <Sun size={15} className="text-brand-gold" /> : <Moon size={15} />}
        </button>

        {/* Notifications Panel */}
        <div className="relative">
          <button
            onClick={() => setShowNotifications(!showNotifications)}
            className="p-2 border border-neutral-200 dark:border-brand-active rounded-xl bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-brand-active transition-all focus:outline-none relative"
            title="Notifikasi"
          >
            <Bell size={15} />
            {unreadNotificationsCount > 0 && (
              <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[9px] font-bold text-white ring-2 ring-white dark:ring-brand-dark">
                {unreadNotificationsCount}
              </span>
            )}
          </button>

          {showNotifications && (
            <div className="absolute right-0 mt-2 w-80 rounded-2xl shadow-xl border border-neutral-100 dark:border-brand-active bg-white dark:bg-brand-sidebar p-3 z-30 transition-all">
              <div className="flex items-center justify-between border-b border-neutral-100 dark:border-neutral-800 pb-2 mb-2">
                <span className="text-xs font-bold text-brand-dark dark:text-white">Pemberitahuan</span>
                {unreadNotificationsCount > 0 && (
                  <button
                    onClick={() => dispatch({ type: ACTIONS.MARK_NOTIFICATIONS_READ })}
                    className="text-[10px] font-bold text-brand-gold hover:text-brand-goldHover flex items-center gap-1 transition-colors"
                  >
                    <Check size={11} /> Tandai dibaca
                  </button>
                )}
              </div>

              <div className="space-y-2 max-h-60 overflow-y-auto pr-1">
                {notifications.length > 0 ? (
                  notifications.map((n) => (
                    <div
                      key={n.id}
                      className={`p-2.5 rounded-xl border text-xs transition-all ${
                        n.read
                          ? 'bg-neutral-50/30 border-neutral-100 dark:bg-brand-active/10 dark:border-brand-active/20 text-neutral-400'
                          : 'bg-amber-50/10 border-brand-gold/20 text-brand-dark dark:text-gray-200 font-semibold'
                      }`}
                    >
                      <p>{n.message}</p>
                      <span className="text-[9px] text-gray-500 font-medium block mt-1">{n.time}</span>
                    </div>
                  ))
                ) : (
                  <p className="text-xs text-center text-gray-400 py-4">Tidak ada pemberitahuan</p>
                )}
              </div>
            </div>
          )}
        </div>

      </div>
    </header>
  );
});

export default Navbar;
