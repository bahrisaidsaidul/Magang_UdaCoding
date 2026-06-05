import { Link, useLocation } from 'react-router-dom';
import Logo from '../assets/dashboard.png';
import { LuLayoutDashboard } from "react-icons/lu";
import { SlCalender } from "react-icons/sl";
import { FaRegBell } from "react-icons/fa";
import { IoSettingsOutline } from "react-icons/io5";

export default function Sidebar({ onLogout, userRole, username, darkMode, toggleDarkMode }) {
  const location = useLocation();

  const navItems = [
    { path: '/dashboard', icon: <LuLayoutDashboard />, label: 'Dashboard' },
    { path: '/calendar', icon: <SlCalender />, label: 'Calendar' },
    //{ path: '/library', icon: '⊟', label: 'Library' },
    { path: '/notifications', icon: <FaRegBell  />, label: 'Notifications' },
    { path: '/settings', icon: <IoSettingsOutline />, label: 'Settings' },
  ];

  const initials = (username || userRole || 'U')
    .split(' ')
    .map(w => w[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);

  return (
    <aside className="sidebar">
      <div className="sidebar__brand">
        <div className="brand-icon"><img src={Logo} alt="Ikon Saya" style={{ width: '30px', height: '30px' }} /></div>
        <div className="brand-text">
          <h1>Omset Tracker</h1>
          <p>Freelancer Dashboard</p>
        </div>
      </div>

      <nav className="sidebar__nav">
        <span className="sidebar__section-label">Menu Utama</span>

        {navItems.map(item => (
          <Link
            key={item.path}
            to={item.path}
            className={`sidebar__item ${location.pathname === item.path ? 'active' : ''}`}
          >
            <span className="item-icon">{item.icon}</span>
            {item.label}
          </Link>
        ))}

        <span className="sidebar__section-label" style={{ marginTop: '0.75rem' }}>Preferensi</span>

        <button className="sidebar__item" onClick={toggleDarkMode}>
          <span className="item-icon">{darkMode ? '☀' : '◑'}</span>
          {darkMode ? 'Light Mode' : 'Dark Mode'}
        </button>

        {userRole === 'admin' && (
          <span className="sidebar__item" style={{ cursor: 'default', opacity: 0.5 }}>
            <span className="item-icon">◈</span>
            Admin Access
            <span className="item-badge">ADMIN</span>
          </span>
        )}
      </nav>

      <div className="sidebar__footer">
        <div className="user-card" onClick={onLogout} title="Click to logout">
          <div className="avatar">{initials}</div>
          <div className="user-info">
            <div className="name">{username || (userRole === 'admin' ? 'Administrator' : 'Staff')}</div>
            <div className="role">{userRole} · Logout →</div>
          </div>
        </div>
      </div>
    </aside>
  );
}