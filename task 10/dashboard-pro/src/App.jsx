import React, { useState, Suspense, useCallback } from 'react';
import { useDashboard } from './context/DashboardContext';
import Sidebar from './components/Sidebar';
import Navbar from './components/Navbar';
import StatsGrid from './components/StatsGrid';
import Achievements from './components/Achievements';
import InvoiceTable from './components/table/InvoiceTable';
import Login from './components/Login';
import SkeletonLoader from './components/SkeletonLoader';
import AddProjectModal from './components/AddProjectModal';
import CalendarView from './components/views/CalendarView';
import SettingsView from './components/views/SettingsView';
import NotificationsView from './components/views/NotificationsView';

// Lazy loading all charts as requested for maximum optimization (Requirement 59)
const OmsetHarianBarChart = React.lazy(() => import('./components/charts/OmsetHarianBarChart'));
const TrendMingguanLineChart = React.lazy(() => import('./components/charts/TrendMingguanLineChart'));
const ClientDonutChart = React.lazy(() => import('./components/charts/ClientDonutChart'));
const SkillsRadarChart = React.lazy(() => import('./components/charts/SkillsRadarChart'));

function DashboardContent() {
  const { state } = useDashboard();
  const { loading, dailyChart, target, weeklyChart, clientChart, theme, projects } = state;
  const [mobileOpen, setMobileOpen] = useState(false);
  const [addModalOpen, setAddModalOpen] = useState(false);

  // useCallback for memoizing toggle actions (Requirement 58)
  const handleOpenAddModal = useCallback(() => {
    setAddModalOpen(true);
  }, []);

  const handleCloseAddModal = useCallback(() => {
    setAddModalOpen(false);
  }, []);

  return (
    <div className="min-h-screen flex flex-col md:flex-row bg-brand-light dark:bg-brand-darker transition-colors duration-300">
      
      {/* Left Sidebar Layout */}
      <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

      {/* Right Content Area */}
      <main className="flex-1 p-5 md:p-8 space-y-6 overflow-x-hidden md:max-w-[calc(100vw-16rem)]">
        
        {/* Top Navbar */}
        <Navbar />

        {/* Dashboard Modules */}
        {loading ? (
          <>
            <SkeletonLoader type="stats" />
            <SkeletonLoader type="charts" />
            <SkeletonLoader type="table" />
          </>
        ) : (
          <>
            {state.activeView === 'Dashboard' && (
              <>
                {/* 1. Statistics Cards */}
                <StatsGrid />

                {/* 2. Custom Analytical Charts with Lazy Loading and Suspense Fallbacks */}
                <Suspense fallback={<SkeletonLoader type="charts" />}>
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 select-none">
                    
                    {/* Chart 1: Omset Harian (Bar Chart) - 8 Cols */}
                    <div className="lg:col-span-8 glass-card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Omset Harian</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Pendapatan per hari bulan ini</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#D97706] dark:bg-brand-active dark:text-brand-gold uppercase">
                          Bar Chart
                        </span>
                      </div>
                      <OmsetHarianBarChart data={dailyChart} theme={theme} />
                    </div>

                    {/* Chart 3: Distribusi Klien (Donut Chart) - 4 Cols */}
                    <div className="lg:col-span-4 glass-card flex flex-col justify-between">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Distribusi Klien</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Pembagian omset per klien</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#D97706] dark:bg-brand-active dark:text-brand-gold uppercase">
                          Donut Chart
                        </span>
                      </div>
                      <div className="flex-1 flex items-center justify-center">
                        <ClientDonutChart data={clientChart} theme={theme} />
                      </div>
                    </div>

                    {/* Chart 2: Trend Mingguan (Line Chart) - 8 Cols */}
                    <div className="lg:col-span-8 glass-card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Trend Mingguan</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Aktual vs Target Pendapatan</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#D97706] dark:bg-brand-active dark:text-brand-gold uppercase">
                          Line Chart
                        </span>
                      </div>
                      <TrendMingguanLineChart data={weeklyChart} target={target} theme={theme} />
                    </div>

                    {/* Chart 4: Radar Distribusi Proyek - 4 Cols */}
                    <div className="lg:col-span-4 glass-card">
                      <div className="flex items-center justify-between mb-4">
                        <div>
                          <h4 className="text-xs font-bold text-gray-400 dark:text-gray-500 uppercase tracking-wider">Distribusi Proyek</h4>
                          <p className="text-[10px] text-gray-400 mt-0.5">Prioritas & status proyek aktif</p>
                        </div>
                        <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-amber-50 text-[#D97706] dark:bg-brand-active dark:text-brand-gold uppercase">
                          Radar Chart
                        </span>
                      </div>
                      <SkillsRadarChart projects={projects} theme={theme} />
                    </div>

                  </div>
                </Suspense>

                {/* 3. Bottom Layout: Invoice Table & Achievements Panel */}
                <div className="grid grid-cols-1 xl:grid-cols-12 gap-6 items-start">
                  
                  {/* Invoice Data Grid (8 Cols) */}
                  <div className="xl:col-span-8">
                    <InvoiceTable />
                  </div>

                  {/* Achievements Sidebar (4 Cols) */}
                  <div className="xl:col-span-4">
                    <Achievements onOpenAddModal={handleOpenAddModal} />
                  </div>

                </div>
              </>
            )}

            {state.activeView === 'Calendar' && <CalendarView />}
            {state.activeView === 'Settings' && <SettingsView />}
            {state.activeView === 'Notifications' && <NotificationsView />}
          </>
        )}

      </main>

      {/* Add Invoice Modal Dialog */}
      <AddProjectModal isOpen={addModalOpen} onClose={handleCloseAddModal} />
    </div>
  );
}

export default function App() {
  const { state } = useDashboard();
  
  if (!state.user) {
    return <Login />;
  }

  return <DashboardContent />;
}
