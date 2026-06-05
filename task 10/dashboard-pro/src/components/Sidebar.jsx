import React, { useState } from 'react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';
import { 
  LayoutDashboard, 
  Calendar, 
  Bell, 
  Settings, 
  Moon, 
  Sun,
  Shield, 
  ChevronDown, 
  ChevronRight, 
  LogOut,
  FolderOpen,
  Users,
  Menu,
  X,
  FileSpreadsheet
} from 'lucide-react';

export default function Sidebar({ mobileOpen, setMobileOpen }) {
  const { state, dispatch, logout } = useDashboard();
  const { theme, user, projects, clients } = state;
  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';

  // Sidebar sections collapse states
  const [clientsCollapsed, setClientsCollapsed] = useState(true);
  const [projectsCollapsed, setProjectsCollapsed] = useState(true);

  const activeMenu = state.activeView || 'Dashboard';

  const menuItems = [
    { name: 'Dashboard', icon: <LayoutDashboard size={18} /> },
    { name: 'Calendar', icon: <Calendar size={18} /> },
    { name: 'Notifications', icon: <Bell size={18} /> },
    { name: 'Settings', icon: <Settings size={18} /> },
  ];

  return (
    <>
      {/* Mobile Hamburger toggle (no-print) */}
      <div className="md:hidden p-4 flex items-center justify-between bg-brand-sidebar text-white w-full sticky top-0 z-40 no-print">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
            <FileSpreadsheet className="text-white" size={16} />
          </div>
          <span className="font-bold text-sm">Omset Tracker</span>
        </div>
        <button onClick={() => setMobileOpen(!mobileOpen)} className="text-white focus:outline-none">
          {mobileOpen ? <X size={20} /> : <Menu size={20} />}
        </button>
      </div>

      {/* Main Sidebar (no-print) */}
      <aside 
        className={`w-64 shrink-0 bg-brand-sidebar text-neutral-400 min-h-screen md:h-screen p-5 flex flex-col justify-between border-r border-brand-active/20 transition-transform duration-300 md:translate-x-0 no-print z-50 fixed md:sticky md:top-0 inset-y-0 left-0 ${
          mobileOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div>
          {/* Sidebar Top: Logo Header */}
          <div className="flex items-center gap-3 mb-8 px-2">
            <div className="w-10 h-10 rounded-xl bg-brand-gold flex items-center justify-center shadow-md shadow-brand-gold/15">
              <FileSpreadsheet className="text-white" size={20} />
            </div>
            <div>
              <h1 className="text-base font-bold text-white tracking-wide m-0 leading-none">Omset Tracker</h1>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-none">Freelancer Dashboard</p>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="space-y-6">
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 px-2">Menu Utama</p>
              <nav className="space-y-1">
                {menuItems.map((item) => {
                  const isActive = item.name === activeMenu;
                  return (
                    <button
                      key={item.name}
                      onClick={() => {
                        dispatch({ type: ACTIONS.SET_ACTIVE_VIEW, payload: item.name });
                        setMobileOpen(false);
                      }}
                      className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-brand-active text-[#F59E0B] border-l-4 border-brand-gold shadow-md'
                          : 'hover:bg-brand-active/40 hover:text-white'
                      }`}
                    >
                      {item.icon}
                      <span>{item.name === 'Dashboard' ? 'Dashboard' : item.name === 'Calendar' ? 'Calendar' : item.name === 'Notifications' ? 'Notifications' : 'Settings'}</span>
                    </button>
                  );
                })}
              </nav>
            </div>

            {/* Dynamic Collapsible Segment: Klien (Clients list) */}
            <div>
              <button
                onClick={() => setClientsCollapsed(!clientsCollapsed)}
                className="w-full flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 px-2 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <Users size={12} />
                  <span>Daftar Klien</span>
                </div>
                {clientsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
              </button>

              {!clientsCollapsed && (
                <div className="pl-3 space-y-1 max-h-32 overflow-y-auto pr-1">
                  {clients.length > 0 ? (
                    clients.map((c, i) => (
                      <button
                        key={i}
                        onClick={() => {
                          dispatch({ type: ACTIONS.SET_FILTER, payload: { client: c } });
                          setMobileOpen(false);
                        }}
                        className="w-full text-left truncate text-xs py-1.5 px-2 rounded-lg hover:bg-brand-active/30 hover:text-white transition-all font-medium"
                      >
                        {c}
                      </button>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-600 px-2">Tidak ada klien</p>
                  )}
                </div>
              )}
            </div>

            {/* Dynamic Collapsible Segment: Recent Projects */}
            <div>
              <button
                onClick={() => setProjectsCollapsed(!projectsCollapsed)}
                className="w-full flex items-center justify-between text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 px-2 hover:text-white transition-colors"
              >
                <div className="flex items-center gap-1.5">
                  <FolderOpen size={12} />
                  <span>Proyek Terbaru</span>
                </div>
                {projectsCollapsed ? <ChevronRight size={10} /> : <ChevronDown size={10} />}
              </button>

              {!projectsCollapsed && (
                <div className="pl-3 space-y-1 max-h-32 overflow-y-auto pr-1">
                  {projects.length > 0 ? (
                    projects.slice(0, 5).map((p) => (
                      <div
                        key={p.id}
                        className="text-xs py-1.5 px-2 rounded-lg font-medium truncate flex items-center justify-between group"
                      >
                        <span className="truncate text-gray-400 group-hover:text-white">{p.name}</span>
                        <span className="text-[9px] uppercase shrink-0 font-bold px-1.5 py-0.5 rounded bg-brand-active text-brand-gold ml-1">
                          {p.status === 'completed' ? 'Selesai' : 'Pending'}
                        </span>
                      </div>
                    ))
                  ) : (
                    <p className="text-[10px] text-gray-600 px-2">Tidak ada proyek</p>
                  )}
                </div>
              )}
            </div>

            {/* Segment: Preferences */}
            <div>
              <p className="text-[10px] uppercase font-bold tracking-wider text-gray-500 mb-2 px-2">Preferensi</p>
              <div className="space-y-3 px-2">
                {/* Theme Toggle Button */}
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Moon size={16} /> Mode Gelap
                  </span>
                  <button
                    onClick={() => dispatch({ type: ACTIONS.TOGGLE_THEME })}
                    className="relative inline-flex h-5 w-9 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-1 focus:ring-brand-gold bg-[#3A3029]"
                  >
                    <span
                      className={`pointer-events-none inline-block h-4 w-4 transform rounded-full bg-brand-gold shadow ring-0 transition duration-200 ease-in-out ${
                        isDark ? 'translate-x-4' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>

                {/* Admin Access indicator */}
                <div className="flex items-center justify-between text-sm font-medium">
                  <span className="flex items-center gap-2 text-gray-400">
                    <Shield size={16} /> Admin Access
                  </span>
                  <span className={`px-2 py-0.5 rounded text-[9px] font-extrabold uppercase select-none ${
                    isAdmin 
                      ? 'bg-brand-gold text-white animate-pulse' 
                      : 'bg-neutral-800 text-neutral-600'
                  }`}>
                    ADMIN
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>

        {/* Sidebar Bottom: User Profile and Logout */}
        <div className="mt-auto border-t border-brand-active/20 pt-4 px-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-full bg-brand-gold hover:bg-brand-goldHover flex items-center justify-center text-white font-extrabold text-sm uppercase shadow-sm select-none">
              {user?.username ? user.username.charAt(0) : 'A'}
            </div>
            <div className="truncate w-28">
              <p className="text-sm font-semibold text-white truncate m-0 leading-none capitalize">
                {user?.username || 'admin'}
              </p>
              <p className="text-[10px] text-gray-500 font-medium mt-1 leading-none capitalize">
                {user?.role || 'Admin'} - Logout &rarr;
              </p>
            </div>
          </div>
          <button 
            onClick={logout} 
            className="text-gray-500 hover:text-red-400 p-1.5 hover:bg-brand-active/30 rounded-lg transition-colors focus:outline-none"
            title="Log Out"
          >
            <LogOut size={16} />
          </button>
        </div>
      </aside>

      {/* Overlay for mobile sidebar */}
      {mobileOpen && (
        <div 
          onClick={() => setMobileOpen(false)}
          className="fixed inset-0 bg-black/50 z-45 md:hidden no-print"
        />
      )}
    </>
  );
}
