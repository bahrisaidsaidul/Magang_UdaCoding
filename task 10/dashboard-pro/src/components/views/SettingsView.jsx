import React, { useState, useEffect } from 'react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';
import { Settings, User, Bell, Palette, Database, Save, Shield, Users } from 'lucide-react';

function UserManagementTab() {
  const { state, dispatch } = useDashboard();
  const [usersList, setUsersList] = useState([]);
  const [loadingUsers, setLoadingUsers] = useState(true);

  const fetchUsers = async () => {
    setLoadingUsers(true);
    try {
      const url = state.activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
      const response = await fetch(`${url}/api/get_users.php`, { credentials: 'include' });
      const result = await response.json();
      if (result.success) {
        setUsersList(result.users);
      } else {
        console.error("Failed to fetch users");
      }
    } catch (err) {
      console.error("Error fetching users:", err);
    }
    setLoadingUsers(false);
  };

  useEffect(() => {
    fetchUsers();
  }, [state.activeBackendUrl]);

  const handleRoleChange = async (userId, newRole) => {
    const url = state.activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
    try {
      const response = await fetch(`${url}/api/update_role.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ user_id: userId, new_role: newRole }),
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '✅ Role berhasil diperbarui' } });
        fetchUsers();
      } else {
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: `⚠️ Gagal: ${result.message}` } });
      }
    } catch (err) {
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '⚠️ Gagal terhubung ke server' } });
    }
  };

  return (
    <div className="space-y-6 max-w-2xl">
      <div>
        <h3 className="text-lg font-bold text-brand-dark dark:text-white">Manajemen Pengguna</h3>
        <p className="text-xs text-gray-500 mt-1">Ubah hak akses role untuk staf atau admin lainnya.</p>
      </div>

      <div className="bg-white dark:bg-brand-darker border border-neutral-100 dark:border-brand-active rounded-2xl overflow-hidden shadow-sm">
        {loadingUsers ? (
          <div className="p-8 text-center text-sm text-gray-500">Memuat pengguna...</div>
        ) : (
          <table className="w-full text-left text-sm text-brand-dark dark:text-gray-300">
            <thead className="bg-neutral-50 dark:bg-brand-active text-xs uppercase font-semibold text-gray-500 dark:text-gray-400">
              <tr>
                <th className="px-6 py-4">Username</th>
                <th className="px-6 py-4">Email</th>
                <th className="px-6 py-4">Role Saat Ini</th>
                <th className="px-6 py-4">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-neutral-100 dark:divide-brand-active">
              {usersList.map((u) => (
                <tr key={u.id} className="hover:bg-neutral-50 dark:hover:bg-brand-active/50 transition-colors">
                  <td className="px-6 py-4 font-medium">{u.username}</td>
                  <td className="px-6 py-4 text-xs">{u.email}</td>
                  <td className="px-6 py-4">
                    <span className={`px-2.5 py-1 text-[10px] font-bold uppercase rounded-full ${u.role === 'admin' ? 'bg-brand-gold/10 text-brand-gold' : 'bg-blue-50 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400'}`}>
                      {u.role}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    {u.id !== state.user?.id ? (
                      <select 
                        value={u.role}
                        onChange={(e) => handleRoleChange(u.id, e.target.value)}
                        className="text-xs bg-white dark:bg-brand-darker border border-neutral-200 dark:border-gray-600 rounded-lg px-2 py-1.5 focus:ring-1 focus:ring-brand-gold"
                      >
                        <option value="staff">Jadikan Staff</option>
                        <option value="admin">Jadikan Admin</option>
                      </select>
                    ) : (
                      <span className="text-xs text-gray-400 italic">Akun Anda</span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default function SettingsView() {
  const { state, dispatch } = useDashboard();
  const { user, target, theme, activeBackendUrl } = state;

  const [localTarget, setLocalTarget] = useState(target);
  const [activeTab, setActiveTab] = useState('profile');
  const [isSaving, setIsSaving] = useState(false);

  const isDark = theme === 'dark';

  const handleSave = async () => {
    setIsSaving(true);
    const url = activeBackendUrl || import.meta.env.VITE_BACKEND_URL;
    
    if (localTarget !== target && user?.role === 'admin') {
      try {
        const response = await fetch(`${url}/api/update_settings.php`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ target_bulanan: Number(localTarget) }),
          credentials: 'include'
        });
        const result = await response.json();
        if (result.success) {
          dispatch({
            type: ACTIONS.SET_DATA,
            payload: { ...state, target: Number(localTarget) }
          });
          dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '💾 Pengaturan berhasil disimpan ke database!' } });
        } else {
          dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: `⚠️ Gagal menyimpan: ${result.message}` } });
        }
      } catch (err) {
        console.error('Failed to update target:', err);
        // Fallback local save in case backend is offline
        dispatch({
          type: ACTIONS.SET_DATA,
          payload: { ...state, target: Number(localTarget) }
        });
        dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '💾 Pengaturan disimpan lokal (Koneksi offline)' } });
      }
    } else if (user?.role !== 'admin') {
      dispatch({ type: ACTIONS.ADD_NOTIFICATION, payload: { message: '⚠️ Akses ditolak. Hanya Admin yang dapat mengubah target.' } });
    }
    setIsSaving(false);
  };

  return (
    <div className="flex flex-col md:flex-row gap-6 animate-fadeIn">
      {/* Settings Navigation */}
      <div className="w-full md:w-64 shrink-0 space-y-2">
        <h2 className="text-xl font-bold text-brand-dark dark:text-white mb-6">Pengaturan</h2>
        
        <button 
          onClick={() => setActiveTab('profile')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'profile' ? 'bg-brand-active text-brand-gold border-l-4 border-brand-gold shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-brand-active text-neutral-500 dark:text-gray-400'}`}
        >
          <User size={18} /> Profil Akun
        </button>
        {user?.role === 'admin' && (
          <button 
            onClick={() => setActiveTab('users')}
            className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'users' ? 'bg-brand-active text-brand-gold border-l-4 border-brand-gold shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-brand-active text-neutral-500 dark:text-gray-400'}`}
          >
            <Shield size={18} /> Manajemen Pengguna
          </button>
        )}
        <button 
          onClick={() => setActiveTab('app')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'app' ? 'bg-brand-active text-brand-gold border-l-4 border-brand-gold shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-brand-active text-neutral-500 dark:text-gray-400'}`}
        >
          <Settings size={18} /> Aplikasi
        </button>
        <button 
          onClick={() => setActiveTab('appearance')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'appearance' ? 'bg-brand-active text-brand-gold border-l-4 border-brand-gold shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-brand-active text-neutral-500 dark:text-gray-400'}`}
        >
          <Palette size={18} /> Tampilan
        </button>
        <button 
          onClick={() => setActiveTab('system')}
          className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all ${activeTab === 'system' ? 'bg-brand-active text-brand-gold border-l-4 border-brand-gold shadow-sm' : 'hover:bg-neutral-50 dark:hover:bg-brand-active text-neutral-500 dark:text-gray-400'}`}
        >
          <Database size={18} /> Sistem & Database
        </button>
      </div>

      {/* Settings Content Area */}
      <div className="flex-1 glass-card min-h-[500px]">
        {activeTab === 'profile' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white">Profil Pengguna</h3>
              <p className="text-xs text-gray-500 mt-1">Informasi dasar akun Anda.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Username</label>
                <input type="text" disabled value={user?.username || ''} className="block w-full px-4 py-2 border border-neutral-200 dark:border-brand-active rounded-xl text-sm bg-neutral-50 dark:bg-brand-sidebar text-brand-dark dark:text-gray-300 opacity-70" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Email</label>
                <input type="email" disabled value={user?.email || ''} className="block w-full px-4 py-2 border border-neutral-200 dark:border-brand-active rounded-xl text-sm bg-neutral-50 dark:bg-brand-sidebar text-brand-dark dark:text-gray-300 opacity-70" />
              </div>
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Role Hak Akses</label>
                <div className="flex items-center gap-2 mt-2">
                  <Shield size={16} className={user?.role === 'admin' ? 'text-brand-gold' : 'text-gray-400'} />
                  <span className="text-sm font-bold capitalize text-brand-dark dark:text-white">{user?.role || 'Staff'}</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'users' && user?.role === 'admin' && (
          <UserManagementTab />
        )}

        {activeTab === 'app' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white">Pengaturan Target</h3>
              <p className="text-xs text-gray-500 mt-1">Sesuaikan target pencapaian untuk KPI bulanan Anda.</p>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-600 dark:text-gray-400 mb-1.5 uppercase tracking-wider">Target Bulanan (Rp)</label>
                <input 
                  type="number" 
                  disabled={user?.role !== 'admin'}
                  value={localTarget} 
                  onChange={(e) => setLocalTarget(e.target.value)}
                  className="block w-full px-4 py-2 border border-neutral-200 dark:border-brand-active rounded-xl text-sm focus:ring-1 focus:ring-brand-gold bg-white dark:bg-brand-dark text-brand-dark dark:text-white disabled:opacity-50" 
                />
                {user?.role !== 'admin' && <p className="text-[10px] text-red-500 mt-1">Hanya Admin yang dapat mengubah target.</p>}
              </div>
            </div>
            <button 
              onClick={handleSave}
              disabled={isSaving || user?.role !== 'admin'}
              className="px-6 py-2.5 bg-brand-gold hover:bg-brand-goldHover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md flex items-center gap-2"
            >
              <Save size={16} /> {isSaving ? 'Menyimpan...' : 'Simpan Perubahan'}
            </button>
          </div>
        )}

        {activeTab === 'appearance' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white">Tampilan Antarmuka</h3>
              <p className="text-xs text-gray-500 mt-1">Sesuaikan gaya visual dashboard Anda.</p>
            </div>
            <div className="flex items-center justify-between p-4 border border-neutral-100 dark:border-brand-active rounded-xl bg-neutral-50/50 dark:bg-brand-active/20">
              <div>
                <p className="font-semibold text-sm text-brand-dark dark:text-white">Mode Gelap (Dark Mode)</p>
                <p className="text-xs text-gray-500 mt-0.5">Aktifkan tema gelap bernuansa eksklusif premium</p>
              </div>
              <button
                onClick={() => dispatch({ type: ACTIONS.TOGGLE_THEME })}
                className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ease-in-out focus:outline-none focus:ring-2 focus:ring-brand-gold focus:ring-offset-2 ${isDark ? 'bg-brand-gold' : 'bg-gray-200'}`}
              >
                <span className={`pointer-events-none inline-block h-5 w-5 transform rounded-full bg-white shadow ring-0 transition duration-200 ease-in-out ${isDark ? 'translate-x-5' : 'translate-x-0'}`} />
              </button>
            </div>
          </div>
        )}

        {activeTab === 'system' && (
          <div className="space-y-6 max-w-xl">
            <div>
              <h3 className="text-lg font-bold text-brand-dark dark:text-white">Sistem & Database</h3>
              <p className="text-xs text-gray-500 mt-1">Status koneksi ke backend PHP/MySQL (XAMPP).</p>
            </div>
            <div className="p-4 border border-neutral-100 dark:border-brand-active rounded-xl bg-neutral-50/50 dark:bg-brand-active/20">
              <div className="flex items-center gap-3 mb-3">
                <div className={`w-3 h-3 rounded-full ${activeBackendUrl ? 'bg-emerald-500 animate-pulse' : 'bg-amber-500'}`}></div>
                <p className="font-semibold text-sm text-brand-dark dark:text-white">
                  {activeBackendUrl ? 'Terkoneksi ke XAMPP MySQL' : 'Mode Offline (Mock Data Aktif)'}
                </p>
              </div>
              <p className="text-xs text-gray-500 mb-2">Endpoint Backend Saat Ini:</p>
              <code className="text-xs block p-2 rounded bg-neutral-200 dark:bg-brand-dark text-brand-dark dark:text-gray-300 overflow-hidden text-ellipsis">
                {activeBackendUrl || 'Menunggu koneksi http://localhost/task%2010/backend'}
              </code>
              {!activeBackendUrl && (
                <p className="text-[10px] text-amber-600 dark:text-amber-400 mt-3 bg-amber-50 dark:bg-amber-900/20 p-2 rounded">
                  ⚠️ Silakan jalankan modul Apache & MySQL di XAMPP, dan pastikan file database.sql sudah diimpor ke phpMyAdmin agar mendapatkan data real-time.
                </p>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
