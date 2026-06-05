import React, { useState, useEffect } from 'react';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Settings = ({ userRole, username }) => {
  const [target, setTarget] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchSettings(); }, []);

  const fetchSettings = async () => {
    try {
      const response = await axios.get('http://localhost/dashboard-omsets/backend/api/get_data.php', {
        withCredentials: true
      });
      setTarget(response.data.target);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTarget = async (e) => {
    e.preventDefault();
    if (userRole !== 'admin') {
      toast.error('Hanya admin yang dapat mengubah pengaturan');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost/dashboard-omsets/backend/api/update_settings.php',
        { target_bulanan: target },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        toast.success('Target berhasil diperbarui!');
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Gagal memperbarui target');
    }
  };

  if (loading) return (
    <div className="loading-state">
      <div className="spinner" />
      <p>Memuat pengaturan...</p>
    </div>
  );

  return (
    <>
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', borderRadius: '8px' } }} />

      <div className="page-header">
        <h2>Pengaturan</h2>
        <p>Kelola preferensi dan konfigurasi akun</p>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', maxWidth: 560 }}>
        <div className="settings-card">
          <h3>🎯 Target Omset Bulanan</h3>
          <form onSubmit={handleUpdateTarget} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div className="form-group">
              <label>Nominal Target (Rp)</label>
              <input
                type="number"
                value={target}
                onChange={(e) => setTarget(e.target.value)}
                disabled={userRole !== 'admin'}
                placeholder="Masukkan target omset..."
              />
            </div>
            {userRole === 'admin' && (
              <button type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }}>
                Simpan Target
              </button>
            )}
            {userRole !== 'admin' && (
              <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                ⚠️ Hanya admin yang dapat mengubah target omset
              </p>
            )}
          </form>
        </div>

        <div className="settings-card">
          <h3>👤 Informasi Akun</h3>
          <div className="info-row">
            <span className="info-label">Username</span>
            <span className="info-value">{username || '—'}</span>
          </div>
          <div className="info-row">
            <span className="info-label">Role</span>
            <span className="info-value">
              {userRole === 'admin' ? '👑 Administrator' : '👤 Staff'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Hak Akses</span>
            <span className="info-value">
              {userRole === 'admin' ? 'Full CRUD Access' : 'Read Only'}
            </span>
          </div>
          <div className="info-row">
            <span className="info-label">Dark Mode</span>
            <span className="info-value">Toggle di sidebar kiri</span>
          </div>
        </div>
      </div>
    </>
  );
};

export default Settings;