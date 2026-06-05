import React, { useState } from 'react';
import { X, Save, FileSpreadsheet } from 'lucide-react';
import { useDashboard, ACTIONS } from '../context/DashboardContext';

export default function AddProjectModal({ isOpen, onClose }) {
  const { state, dispatch, fetchData } = useDashboard();
  const { activeBackendUrl, projects } = state;

  const [name, setName] = useState('');
  const [client, setClient] = useState('');
  const [revenue, setRevenue] = useState('');
  const [hours, setHours] = useState('');
  const [status, setStatus] = useState('pending');
  const [priority, setPriority] = useState('medium');
  const [startDate, setStartDate] = useState(new Date().toISOString().slice(0, 10));
  const [endDate, setEndDate] = useState(new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString().slice(0, 10));

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  if (!isOpen) return null;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (!name || !client || !revenue || !hours) {
      setError('Harap isi semua kolom wajib!');
      return;
    }

    setLoading(true);

    const payload = {
      project_name: name,
      client: client,
      amount: parseFloat(revenue),
      hours: parseInt(hours),
      date: startDate,
      status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending',
      priority: priority,
      start_date: startDate,
      end_date: endDate
    };

    if (activeBackendUrl) {
      // 1. Submit to real PHP/MySQL API!
      try {
        const response = await fetch(`${activeBackendUrl}/api/add_invoice.php`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
          credentials: 'include'
        });
        const result = await response.json();
        
        if (result.success) {
          // Add project to projects table too if backend has project CRUD, otherwise let get_data fetch the sync
          fetchData();
          onClose();
          dispatch({ 
            type: ACTIONS.ADD_NOTIFICATION, 
            payload: { message: `💸 Invoice baru "${name}" berhasil ditambahkan ke database.` } 
          });
        } else {
          setError(result.message || 'Gagal menambahkan invoice.');
        }
      } catch (err) {
        setError('Koneksi ke backend gagal. Disimpan ke memori lokal.');
        saveMock();
      } finally {
        setLoading(false);
      }
    } else {
      // 2. Fallback local mock save
      saveMock();
      setLoading(false);
    }
  };

  const saveMock = () => {
    const newId = projects.length > 0 ? Math.max(...projects.map(p => p.id)) + 1 : 1;
    const newProject = {
      id: newId,
      name,
      client,
      revenue: parseFloat(revenue),
      hours: parseInt(hours),
      status,
      priority,
      start_date: startDate,
      end_date: endDate
    };

    const nextProjects = [newProject, ...projects];

    dispatch({
      type: ACTIONS.SET_DATA,
      payload: {
        ...state,
        projects: nextProjects,
        invoices: nextProjects.map(p => ({
          id: p.id,
          project_name: p.name,
          client: p.client,
          amount: p.revenue,
          date: p.start_date,
          status: p.status === 'completed' ? 'paid' : p.status === 'on-hold' ? 'overdue' : 'pending'
        })),
        total_omset: nextProjects.reduce((sum, p) => sum + p.revenue, 0),
        avg_daily: nextProjects.reduce((sum, p) => sum + p.revenue, 0) / 30,
        achievement: (nextProjects.reduce((sum, p) => sum + p.revenue, 0) / 25000000) * 100
      }
    });

    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `💸 Invoice "${name}" berhasil ditambahkan (Memori Lokal)` } 
    });

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4 backdrop-blur-sm select-none animate-fadeIn">
      <div className="bg-white dark:bg-brand-sidebar rounded-3xl w-full max-w-lg shadow-2xl border border-neutral-100 dark:border-brand-active overflow-hidden relative">
        
        {/* Modal Header */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-100 dark:border-neutral-800">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-brand-gold flex items-center justify-center">
              <FileSpreadsheet className="text-white" size={16} />
            </div>
            <h3 className="text-sm font-bold text-brand-dark dark:text-white">Tambah Invoice Baru</h3>
          </div>
          <button 
            onClick={onClose} 
            className="text-gray-400 hover:text-brand-dark dark:hover:text-white p-1 hover:bg-neutral-100 dark:hover:bg-brand-active rounded-lg transition-colors"
          >
            <X size={18} />
          </button>
        </div>

        {/* Modal Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4">
          
          {error && (
            <p className="p-2.5 rounded-lg border border-red-200 bg-red-50 text-[11px] text-red-600 font-medium">
              ⚠️ {error}
            </p>
          )}

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Nama Proyek *</label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="E.g., Web API Laravel"
              />
            </div>
            
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Klien *</label>
              <input
                type="text"
                required
                value={client}
                onChange={(e) => setClient(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="E.g., Tokopedia"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Omset (Rp) *</label>
              <input
                type="number"
                required
                value={revenue}
                onChange={(e) => setRevenue(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="E.g., 15000000"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Estimasi Jam Kerja *</label>
              <input
                type="number"
                required
                value={hours}
                onChange={(e) => setHours(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
                placeholder="E.g., 40"
              />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Status</label>
              <select
                value={status}
                onChange={(e) => setStatus(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="pending">Pending</option>
                <option value="completed">Completed / Selesai</option>
                <option value="on-hold">On Hold</option>
              </select>
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Prioritas</label>
              <select
                value={priority}
                onChange={(e) => setPriority(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
              >
                <option value="low">Low</option>
                <option value="medium">Medium</option>
                <option value="high">High</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Start Date</label>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>

            <div>
              <label className="block text-[10px] font-bold text-gray-400 mb-1 uppercase tracking-wider">Deadline</label>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                className="w-full text-xs font-semibold px-3 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-white rounded-xl focus:ring-1 focus:ring-brand-gold focus:border-brand-gold"
              />
            </div>
          </div>

          {/* Modal Actions */}
          <div className="flex items-center justify-end gap-2.5 pt-4 border-t border-neutral-100 dark:border-neutral-800">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 rounded-xl text-xs font-bold transition-all hover:bg-neutral-50 dark:hover:bg-brand-active"
            >
              Batal
            </button>
            
            <button
              type="submit"
              disabled={loading}
              className="px-4 py-2 bg-brand-gold hover:bg-brand-goldHover text-white rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 shadow-md shadow-brand-gold/10"
            >
              <Save size={13} />
              {loading ? 'Menyimpan...' : 'Simpan'}
            </button>
          </div>

        </form>
      </div>
    </div>
  );
}
