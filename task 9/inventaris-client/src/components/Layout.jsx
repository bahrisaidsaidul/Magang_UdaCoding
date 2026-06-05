import React from 'react';
import { NavLink, Outlet, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { LayoutGrid, Package, LogOut, Box, Moon, Sun, ChevronRight } from 'lucide-react';

/* ─────────────────────────────────────────────
   INJECT GLOBAL STYLES  (no external CSS file needed)
───────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600&display=swap');

  :root {
    --sidebar-w: 268px;
    --radius: 16px;

    /* Light */
    --bg:        #f0f2f7;
    --sidebar:   #ffffff;
    --surface:   #f7f8fc;
    --border:    #e8eaf2;
    --text:      #111827;
    --subtext:   #6b7280;
    --accent:    #4f46e5;
    --accent2:   #06b6d4;
    --active-bg: #eef0ff;
    --active-tx: #4f46e5;
    --hover-bg:  #f3f4f8;
    --shadow:    0 8px 32px rgba(79,70,229,0.08);
  }

  [data-theme="dark"] {
    --bg:        #0d0f17;
    --sidebar:   #13151f;
    --surface:   #1a1d2e;
    --border:    #252840;
    --text:      #f1f3ff;
    --subtext:   #6b7280;
    --accent:    #6366f1;
    --accent2:   #22d3ee;
    --active-bg: rgba(99,102,241,0.15);
    --active-tx: #818cf8;
    --hover-bg:  rgba(255,255,255,0.04);
    --shadow:    0 8px 32px rgba(0,0,0,0.4);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── Layout shell ── */
  .shell {
    display: flex;
    min-height: 100vh;
  }

  /* ── Sidebar ── */
  .sidebar {
    width: var(--sidebar-w);
    background: var(--sidebar);
    border-right: 1px solid var(--border);
    display: flex;
    flex-direction: column;
    padding: 28px 18px;
    position: fixed;
    top: 0; left: 0; bottom: 0;
    z-index: 100;
    box-shadow: var(--shadow);
    transition: background 0.3s, border-color 0.3s;
  }

  /* ── Brand ── */
  .brand {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 0 6px;
    margin-bottom: 36px;
    text-decoration: none;
    cursor: pointer;
  }
  .brand-icon {
    width: 44px; height: 44px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 6px 18px rgba(79,70,229,0.3);
    transition: transform 0.35s cubic-bezier(0.34,1.56,0.64,1),
                box-shadow 0.3s ease;
  }
  .brand:hover .brand-icon {
    transform: rotate(-6deg) scale(1.08);
    box-shadow: 0 10px 24px rgba(79,70,229,0.4);
  }
  .brand-name {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 19px;
    letter-spacing: -0.4px;
    background: linear-gradient(120deg, var(--accent), var(--accent2));
    -webkit-background-clip: text;
    -webkit-text-fill-color: transparent;
    background-clip: text;
    line-height: 1;
  }
  .brand-sub {
    font-size: 10px;
    font-weight: 500;
    letter-spacing: 0.15em;
    color: var(--subtext);
    text-transform: uppercase;
    margin-top: 3px;
  }

  /* ── Section label ── */
  .nav-section {
    font-size: 10px;
    font-weight: 600;
    letter-spacing: 0.12em;
    color: var(--subtext);
    text-transform: uppercase;
    padding: 0 12px;
    margin-bottom: 8px;
    margin-top: 4px;
  }

  /* ── Nav links ── */
  nav { flex: 1; display: flex; flex-direction: column; gap: 4px; }

  .nav-link {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 12px;
    font-size: 14px;
    font-weight: 500;
    color: var(--subtext);
    text-decoration: none;
    cursor: pointer;
    background: transparent;
    border: none;
    width: 100%;
    transition: background 0.2s ease, color 0.2s ease;
    position: relative;
    overflow: hidden;
  }
  .nav-link:hover {
    background: var(--hover-bg);
    color: var(--text);
  }
  .nav-link.active {
    background: var(--active-bg);
    color: var(--active-tx);
    font-weight: 600;
  }
  .nav-link.active .nav-icon-wrap {
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    box-shadow: 0 4px 12px rgba(79,70,229,0.3);
    color: white;
  }
  .nav-icon-wrap {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface);
    flex-shrink: 0;
    transition: background 0.25s, box-shadow 0.25s, color 0.25s;
    color: var(--subtext);
  }
  .nav-link:hover .nav-icon-wrap {
    background: var(--hover-bg);
    color: var(--text);
  }
  .nav-chevron {
    margin-left: auto;
    opacity: 0;
    transform: translateX(-4px);
    transition: opacity 0.2s, transform 0.2s;
    color: var(--active-tx);
  }
  .nav-link.active .nav-chevron,
  .nav-link:hover .nav-chevron {
    opacity: 1;
    transform: translateX(0);
  }

  /* ── Bottom zone ── */
  .bottom-zone {
    margin-top: auto;
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  /* ── Theme toggle ── */
  .theme-btn {
    display: flex;
    align-items: center;
    gap: 12px;
    padding: 11px 14px;
    border-radius: 12px;
    font-size: 13.5px;
    font-weight: 500;
    color: var(--subtext);
    background: transparent;
    border: none;
    cursor: pointer;
    width: 100%;
    transition: background 0.2s, color 0.2s;
  }
  .theme-btn:hover {
    background: var(--hover-bg);
    color: var(--text);
  }
  .theme-icon {
    width: 34px; height: 34px;
    border-radius: 9px;
    display: flex; align-items: center; justify-content: center;
    background: var(--surface);
    flex-shrink: 0;
    transition: background 0.25s;
  }
  .theme-btn:hover .theme-icon {
    background: var(--hover-bg);
  }

  /* ── Divider ── */
  .divider {
    height: 1px;
    background: var(--border);
    margin: 12px 0;
  }

  /* ── User card ── */
  .user-card {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 12px 14px;
    border-radius: 14px;
    background: var(--surface);
    border: 1px solid var(--border);
    margin-bottom: 8px;
  }
  .avatar {
    width: 38px; height: 38px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 14px;
    color: white;
    box-shadow: 0 4px 12px rgba(79,70,229,0.25);
  }
  .user-name {
    font-size: 13.5px;
    font-weight: 600;
    color: var(--text);
    line-height: 1.2;
    max-width: 140px;
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
  .user-role {
    font-size: 10.5px;
    font-weight: 500;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--subtext);
    margin-top: 1px;
  }

  /* ── Logout button ── */
  .logout-btn {
    display: flex;
    align-items: center;
    gap: 11px;
    padding: 11px 14px;
    border-radius: 12px;
    border: 1px solid transparent;
    font-size: 13.5px;
    font-weight: 600;
    font-family: 'Outfit', sans-serif;
    letter-spacing: 0.02em;
    color: #ef4444;
    background: rgba(239,68,68,0.07);
    cursor: pointer;
    width: 100%;
    transition: all 0.25s ease;
    position: relative;
    overflow: hidden;
  }
  .logout-btn:hover {
    background: linear-gradient(135deg, #ef4444, #f43f5e);
    color: white;
    border-color: transparent;
    box-shadow: 0 6px 18px rgba(239,68,68,0.35);
    transform: translateY(-1px);
  }
  .logout-btn:active {
    transform: scale(0.98) translateY(0);
  }
  .logout-icon {
    display: flex; align-items: center; justify-content: center;
    width: 28px; height: 28px;
    border-radius: 8px;
    background: rgba(239,68,68,0.12);
    flex-shrink: 0;
    transition: background 0.25s, transform 0.35s cubic-bezier(0.34,1.56,0.64,1);
  }
  .logout-btn:hover .logout-icon {
    background: rgba(255,255,255,0.2);
    transform: translateX(-3px) rotate(-8deg);
  }
  /* shimmer on hover */
  .logout-btn::after {
    content: '';
    position: absolute;
    top: 0; left: -60%;
    width: 40%; height: 100%;
    background: linear-gradient(90deg, transparent, rgba(255,255,255,0.15), transparent);
    transition: left 0.45s ease;
    pointer-events: none;
  }
  .logout-btn:hover::after {
    left: 120%;
  }

  /* ── Main content ── */
  .main {
    margin-left: var(--sidebar-w);
    flex: 1;
    padding: 36px 40px;
    min-height: 100vh;
    transition: margin 0.3s;
  }
  .main-inner {
    max-width: 1100px;
    margin: 0 auto;
  }
`;

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
const Layout = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [theme, setTheme] = React.useState('light');

  React.useEffect(() => {
    const saved = localStorage.getItem('theme') || 'light';
    setTheme(saved);
    document.documentElement.setAttribute('data-theme', saved);
  }, []);

  const toggleTheme = () => {
    const next = theme === 'light' ? 'dark' : 'light';
    setTheme(next);
    localStorage.setItem('theme', next);
    document.documentElement.setAttribute('data-theme', next);
  };

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const initials = (user?.name || 'P')
    .split(' ')
    .map(w => w[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <>
      <style>{STYLES}</style>

      <div className="shell">
        {/* ── Sidebar ── */}
        <aside className="sidebar">

          {/* Brand */}
          <div className="brand">
            <div className="brand-icon">
              <Box color="white" size={22} />
            </div>
            <div>
              <div className="brand-name">Inventaris</div>
              <div className="brand-sub">Inventory System</div>
            </div>
          </div>

          {/* Nav */}
          <div className="nav-section">Menu</div>
          <nav>
            <NavLink
              to="/items"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon-wrap"><Package size={17} /></span>
              <span>Data Inventaris</span>
              <ChevronRight size={14} className="nav-chevron" />
            </NavLink>

            <NavLink
              to="/categories"
              className={({ isActive }) => `nav-link${isActive ? ' active' : ''}`}
            >
              <span className="nav-icon-wrap"><LayoutGrid size={17} /></span>
              <span>Kategori</span>
              <ChevronRight size={14} className="nav-chevron" />
            </NavLink>
          </nav>

          {/* Bottom zone */}
          <div className="bottom-zone">
            {/* Theme toggle */}
            <button className="theme-btn" onClick={toggleTheme}>
              <span className="theme-icon">
                {theme === 'light' ? <Moon size={16} /> : <Sun size={16} />}
              </span>
              <span>{theme === 'light' ? 'Mode Gelap' : 'Mode Terang'}</span>
            </button>

            <div className="divider" />

            {/* User card */}
            <div className="user-card">
              <div className="avatar">{initials}</div>
              <div>
                <div className="user-name">{user?.name || 'Pengguna'}</div>
                <div className="user-role">Administrator</div>
              </div>
            </div>

            {/* Logout */}
            <button className="logout-btn" onClick={handleLogout}>
              <span className="logout-icon">
                <LogOut size={15} />
              </span>
              Keluar
            </button>
          </div>
        </aside>

        {/* ── Main ── */}
        <main className="main">
          <div className="main-inner">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  );
};

export default Layout;