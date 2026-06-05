import { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';

// Sesuaikan path import dengan lokasi file asli kamu
// Jika semua file ada di src/ langsung, gunakan './'
// Jika sudah dipisah ke folder, sesuaikan pathnya
import Sidebar from './components/Sidebar';
import Topbar from './components/Topbar';
import PrivateRoute from './components/PrivateRoute';
import Dashboard from './components/Dashboard';
import CalendarPage from './components/Calendar';
import Library from './components/Library';
import Notifications from './components/Notifications';
import Settings from './components/Settings';
import Login from './components/Login';
import Signup from './components/Signup';

import './styles/main.scss';

function AppShell({ isLoggedIn, onLogin, userRole, username, onLogout, darkMode, toggleDarkMode }) {
  const location = useLocation();
  const isAuthPage = ['/login', '/signup'].includes(location.pathname);

  if (isAuthPage) {
    return (
      <Routes>
        <Route path="/login" element={<Login onLogin={onLogin} />} />
        <Route path="/signup" element={<Signup />} />
      </Routes>
    );
  }

  return (
    <div className="app-layout">
      <Sidebar
        onLogout={onLogout}
        userRole={userRole}
        username={username}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
      <div className="main-content">
        <Topbar pathname={location.pathname} />
        <div className="page-content">
          <Routes>
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
            <Route path="/dashboard" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Dashboard userRole={userRole} />
              </PrivateRoute>
            } />
            <Route path="/calendar" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <CalendarPage />
              </PrivateRoute>
            } />
            <Route path="/library" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Library userRole={userRole} />
              </PrivateRoute>
            } />
            <Route path="/notifications" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Notifications />
              </PrivateRoute>
            } />
            <Route path="/settings" element={
              <PrivateRoute isLoggedIn={isLoggedIn}>
                <Settings userRole={userRole} username={username} />
              </PrivateRoute>
            } />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(
    () => localStorage.getItem('isLoggedIn') === 'true'
  );
  const [userRole, setUserRole] = useState(
    () => localStorage.getItem('userRole') || 'staff'
  );
  const [username, setUsername] = useState(
    () => localStorage.getItem('username') || ''
  );
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    document.body.className = darkMode ? 'dark-mode' : 'light-mode';
  }, [darkMode]);

  const handleLogin = (userData) => {
    setIsLoggedIn(true);
    setUserRole(userData.role);
    setUsername(userData.username);
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userRole', userData.role);
    localStorage.setItem('username', userData.username);
    localStorage.setItem('userId', userData.id);
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setUserRole('staff');
    setUsername('');
    localStorage.clear();
  };

  const toggleDarkMode = () => setDarkMode(prev => !prev);

  return (
    <Router>
      <AppShell
        isLoggedIn={isLoggedIn}
        onLogin={handleLogin}
        userRole={userRole}
        username={username}
        onLogout={handleLogout}
        darkMode={darkMode}
        toggleDarkMode={toggleDarkMode}
      />
    </Router>
  );
}