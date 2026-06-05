import { useState } from 'react';
import { useNavigate } from 'react-router-dom';

const PAGE_TITLES = {
  '/dashboard': { title: 'Dashboard', sub: 'Ringkasan omset & invoice' },
  '/calendar': { title: 'Kalender', sub: 'Jadwal & omset harian' },
  '/library': { title: 'Library', sub: 'Template & dokumen' },
  '/notifications': { title: 'Notifikasi', sub: 'Alert & pemberitahuan' },
  '/settings': { title: 'Pengaturan', sub: 'Konfigurasi akun' },
};

export default function Topbar({ pathname }) {
  const [searchTerm, setSearchTerm] = useState('');
  const navigate = useNavigate();

  const page = PAGE_TITLES[pathname] || { title: 'Dashboard', sub: '' };

  const handleSearch = (e) => {
    if (e.key === 'Enter' && searchTerm.trim()) {
      navigate(`/dashboard?search=${searchTerm}`);
    }
  };

  return (
    <header className="topbar">
      <div className="topbar__left">
        <div>
          <div className="page-title">{page.title}</div>
          <div className="breadcrumb">{page.sub}</div>
        </div>
      </div>

      <div className="topbar__right">


        <button
          className="icon-btn"
          onClick={() => navigate('/notifications')}
          title="Notifications"
          style={{ fontSize: '1.1rem' }}
        >
          🔔
        </button>
      </div>
    </header>
  );
}