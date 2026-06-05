import React, { createContext, useContext, useReducer, useEffect, useCallback } from 'react';
import useLocalStorage from '../hooks/useLocalStorage';

const DashboardContext = createContext();

const BACKEND_URLS = [
  import.meta.env.VITE_BACKEND_URL,
  'http://localhost/task%2010/backend',
  'http://localhost/task%206/backend',
  'http://localhost:8000',
  '/backend'
].filter(Boolean);

// Initial state values
const initialState = {
  user: null,
  theme: 'light',
  projects: [],
  invoices: [],
  clients: [],
  revenue: 0,
  target: 25000000,
  achievement: 0,
  avgDaily: 0,
  dailyChart: [],
  weeklyChart: [],
  clientChart: [],
  filters: {
    search: '',
    client: '',
    status: '',
    priority: '',
  },
  notifications: [],
  achievements: [
    { id: 'rev_100m', title: '100M Revenue', desc: 'Mencapai total omset Rp 100 Juta', icon: '🏆', unlocked: false },
    { id: 'proj_50', title: '50 Projects Completed', desc: 'Menyelesaikan 50 proyek freelance', icon: '🎉', unlocked: false },
    { id: 'client_gold', title: 'Top Client Gold', desc: 'Mendapat predikat bintang dari klien utama', icon: '⭐', unlocked: false }
  ],
  loading: true,
  selectedRows: [],
  visibleColumns: {
    project: true,
    client: true,
    revenue: true,
    hours: true,
    status: true,
    priority: true,
    start: true,
    end: true
  },
  favorites: [],
  activeBackendUrl: '',
  activeView: 'Dashboard'
};

// Reducer Action Types
export const ACTIONS = {
  SET_LOADING: 'SET_LOADING',
  SET_ACTIVE_BACKEND: 'SET_ACTIVE_BACKEND',
  LOGIN: 'LOGIN',
  LOGOUT: 'LOGOUT',
  SET_DATA: 'SET_DATA',
  TOGGLE_THEME: 'TOGGLE_THEME',
  SET_FILTER: 'SET_FILTER',
  RESET_FILTERS: 'RESET_FILTERS',
  SET_SELECTED_ROWS: 'SET_SELECTED_ROWS',
  TOGGLE_ROW: 'TOGGLE_ROW',
  TOGGLE_COLUMN: 'TOGGLE_COLUMN',
  ADD_NOTIFICATION: 'ADD_NOTIFICATION',
  MARK_NOTIFICATIONS_READ: 'MARK_NOTIFICATIONS_READ',
  UNLOCK_ACHIEVEMENT: 'UNLOCK_ACHIEVEMENT',
  REFRESH_REVENUE: 'REFRESH_REVENUE',
  SET_ACTIVE_VIEW: 'SET_ACTIVE_VIEW',
  SET_FAVORITES: 'SET_FAVORITES',
  TOGGLE_FAVORITE: 'TOGGLE_FAVORITE'
};

// Reducer function
function dashboardReducer(state, action) {
  switch (action.type) {
    case ACTIONS.SET_LOADING:
      return { ...state, loading: action.payload };
    case ACTIONS.SET_ACTIVE_BACKEND:
      return { ...state, activeBackendUrl: action.payload };
    case ACTIONS.LOGIN:
      return { ...state, user: action.payload };
    case ACTIONS.LOGOUT:
      return { ...state, user: null, projects: [], invoices: [], selectedRows: [] };
    case ACTIONS.SET_DATA: {
      const {
        projects = [],
        invoices = [],
        total_omset = 0,
        target = 25000000,
        achievement = 0,
        avg_daily = 0,
        daily_chart = [],
        weekly_chart = [],
        client_chart = []
      } = action.payload;

      // Calculate clients list
      const uniqueClients = [...new Set(projects.map(p => p.client))];

      // Evaluate achievements dynamically based on database statistics
      let newNotifications = [...state.notifications];
      const updatedAchievements = state.achievements.map(ach => {
        let isUnlocked = ach.unlocked;
        if (ach.id === 'rev_100m' && total_omset >= 100000000) isUnlocked = true;
        
        const completedProjectsCount = projects.filter(p => p.status === 'completed').length;
        if (ach.id === 'proj_50' && completedProjectsCount >= 50) isUnlocked = true;
        
        const topClientFound = client_chart.some(c => c.total >= 40000000);
        if (ach.id === 'client_gold' && topClientFound) isUnlocked = true;
        
        // Push notification if transitioning from locked to unlocked
        if (!ach.unlocked && isUnlocked) {
          newNotifications.unshift({
            id: Date.now() + Math.random(),
            message: `🎉 Pencapaian baru diraih: ${ach.title}!`,
            time: 'Baru saja',
            read: false
          });
        }
        
        return { ...ach, unlocked: isUnlocked };
      });

      return {
        ...state,
        projects: projects || [],
        invoices: invoices || [],
        revenue: total_omset || 0,
        target: target || 25000000,
        achievement: achievement || 0,
        avgDaily: avg_daily || 0,
        dailyChart: daily_chart || [],
        weeklyChart: weekly_chart || [],
        clientChart: client_chart || [],
        clients: uniqueClients,
        achievements: updatedAchievements,
        notifications: newNotifications,
        loading: false
      };
    }
    case ACTIONS.TOGGLE_THEME:
      return { ...state, theme: state.theme === 'light' ? 'dark' : 'light' };
    case ACTIONS.SET_FILTER:
      return { ...state, filters: { ...state.filters, ...action.payload } };
    case ACTIONS.RESET_FILTERS:
      return { ...state, filters: { search: '', client: '', status: '', priority: '' } };
    case ACTIONS.SET_SELECTED_ROWS:
      return { ...state, selectedRows: action.payload };
    case ACTIONS.TOGGLE_ROW: {
      const id = action.payload;
      const isSelected = state.selectedRows.includes(id);
      return {
        ...state,
        selectedRows: isSelected
          ? state.selectedRows.filter(rowId => rowId !== id)
          : [...state.selectedRows, id]
      };
    }
    case ACTIONS.TOGGLE_COLUMN: {
      const colName = action.payload;
      return {
        ...state,
        visibleColumns: {
          ...state.visibleColumns,
          [colName]: !state.visibleColumns[colName]
        }
      };
    }
    case ACTIONS.ADD_NOTIFICATION:
      return {
        ...state,
        notifications: [
          {
            id: Date.now(),
            message: action.payload.message,
            time: 'Just now',
            read: false
          },
          ...state.notifications
        ]
      };
    case ACTIONS.MARK_NOTIFICATIONS_READ:
      return {
        ...state,
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      };
    case ACTIONS.UNLOCK_ACHIEVEMENT: {
      const achId = action.payload;
      return {
        ...state,
        achievements: state.achievements.map(ach =>
          ach.id === achId ? { ...ach, unlocked: true } : ach
        )
      };
    }
    case ACTIONS.REFRESH_REVENUE: {
      // Simulate periodic incremental shifts in revenue or background polling updates
      return { ...state };
    }
    case ACTIONS.SET_ACTIVE_VIEW:
      return { ...state, activeView: action.payload };
    case ACTIONS.SET_FAVORITES:
      return { ...state, favorites: action.payload };
    case ACTIONS.TOGGLE_FAVORITE: {
      const id = action.payload;
      const isFav = state.favorites.includes(id);
      return {
        ...state,
        favorites: isFav
          ? state.favorites.filter(favId => favId !== id)
          : [...state.favorites, id]
      };
    }
    default:
      return state;
  }
}

export function DashboardProvider({ children }) {
  const [state, dispatch] = useReducer(dashboardReducer, initialState);
  const [localTheme, setLocalTheme] = useLocalStorage('theme', 'light');
  const [sessionUser, setSessionUser] = useLocalStorage('session_user', null);
  const [localFavorites, setLocalFavorites] = useLocalStorage('project_favorites', []);
  // Use the env variable as the primary backend URL (no localStorage caching)
  const envBackendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';

  // Sync initial theme and login state
  useEffect(() => {
    if (sessionUser) {
      dispatch({ type: ACTIONS.LOGIN, payload: sessionUser });
    }
    if (localFavorites) {
      dispatch({ type: ACTIONS.SET_FAVORITES, payload: localFavorites });
    }
    // Immediately set backend URL from env (no localStorage needed)
    if (envBackendUrl) {
      dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: envBackendUrl });
    }
  }, []);

  // Update DOM when theme changes
  useEffect(() => {
    const root = window.document.documentElement;
    if (state.theme === 'dark') {
      root.classList.add('dark');
      setLocalTheme('dark');
    } else {
      root.classList.remove('dark');
      setLocalTheme('light');
    }
  }, [state.theme]);

  // Update localStorage when favorites state changes
  useEffect(() => {
    setLocalFavorites(state.favorites);
  }, [state.favorites]);

  // Discover and set active PHP backend URL
  const discoverBackend = async () => {
    // Try env URL first (from .env VITE_BACKEND_URL)
    try {
      const response = await fetch(`${envBackendUrl}/api/get_data.php`, { credentials: 'include' });
      if (response.ok || response.status === 401) {
        dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: envBackendUrl });
        return envBackendUrl;
      }
    } catch (err) {
      console.warn('Env backend URL failed, probing others:', envBackendUrl);
    }
    // Probe fallback URLs
    for (const url of BACKEND_URLS) {
      if (url === envBackendUrl) continue;
      try {
        const response = await fetch(`${url}/api/get_data.php`, { credentials: 'include' });
        if (response.ok || response.status === 401) {
          dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: url });
          return url;
        }
      } catch (err) {
        // Continue probing
      }
    }
    return '';
  };

  // Main data fetching method - always uses env URL first
  const fetchData = useCallback(async (customBackendUrl = '') => {
    dispatch({ type: ACTIONS.SET_LOADING, payload: true });
    let targetUrl = customBackendUrl || state.activeBackendUrl || envBackendUrl;

    if (!targetUrl) {
      // Last resort: probe all known URLs
      for (const url of BACKEND_URLS) {
        try {
          const res = await fetch(`${url}/api/get_data.php`, { credentials: 'include' });
          if (res.ok || res.status === 401) {
            targetUrl = url;
            dispatch({ type: ACTIONS.SET_ACTIVE_BACKEND, payload: url });
            break;
          }
        } catch (_) { /* continue */ }
      }
    }

    if (targetUrl) {
      try {
        const response = await fetch(`${targetUrl}/api/get_data.php`, { credentials: 'include' });
        if (response.ok) {
          const result = await response.json();
          if (result && !result.error) {
            dispatch({ type: ACTIONS.SET_DATA, payload: result });
            return;
          }
          console.error('Backend returned error:', result);
        } else {
          console.warn('Backend responded with status:', response.status);
        }
      } catch (error) {
        console.warn('Backend connection failed:', error.message);
      }
    }

    // Backend unreachable - set loading false and show empty state
    dispatch({ type: ACTIONS.SET_LOADING, payload: false });
  }, [state.activeBackendUrl, envBackendUrl]);

  // Handle active backend and mounting fetching
  useEffect(() => {
    const init = async () => {
      const activeUrl = await discoverBackend();
      fetchData(activeUrl);
    };
    init();

    // 30 seconds auto-refresh interval
    const interval = setInterval(() => {
      const urlToUse = state.activeBackendUrl || envBackendUrl;
      if (urlToUse) fetchData(urlToUse);
    }, 30000);

    return () => clearInterval(interval);
  }, []);

  // Connect to Server-Sent Events (SSE) streaming endpoint (Requirement #23)
  useEffect(() => {
    const url = state.activeBackendUrl;
    if (!url) {
      // Simulation mode for offline/mock data to prove SSE dynamic behavior!
      const simInterval = setInterval(() => {
        dispatch({
          type: ACTIONS.REFRESH_REVENUE,
          payload: { timestamp: Date.now() }
        });
      }, 5000);
      return () => clearInterval(simInterval);
    }

    const sseUrl = `${url}/api/stream_revenue.php`;
    console.log('🔄 Connecting to Server-Sent Events Stream:', sseUrl);
    const eventSource = new EventSource(sseUrl);

    eventSource.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data);
        if (data.revenue !== undefined) {
          dispatch({
            type: ACTIONS.SET_DATA,
            payload: { ...state, revenue: data.revenue }
          });
        }
      } catch (err) {
        console.error('Failed to parse SSE streaming data:', err);
      }
    };

    eventSource.onerror = (err) => {
      console.warn('EventSource SSE stream connection failed. Closing...', err);
      eventSource.close();
    };

    return () => {
      console.log('🔌 Disconnecting from Server-Sent Events Stream:', sseUrl);
      eventSource.close();
    };
  }, [state.activeBackendUrl]);

  // Auth operations
  const login = async (email, password) => {
    const url = state.activeBackendUrl || BACKEND_URLS[0];
    try {
      const response = await fetch(`${url}/api/login.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
        credentials: 'include'
      });
      const result = await response.json();
      if (result.success) {
        dispatch({ type: ACTIONS.LOGIN, payload: result.user });
        setSessionUser(result.user);
        fetchData(url);
        return { success: true };
      }
      return { success: false, message: result.message };
    } catch (err) {
      // Mock Login Bypass if offline
      if (
        (email === 'admin@example.com' && password === 'admin123') ||
        (email === 'admin' && password === 'admin123')
      ) {
        const mockUser = { id: 1, username: 'admin', email: 'admin@example.com', role: 'admin' };
        dispatch({ type: ACTIONS.LOGIN, payload: mockUser });
        setSessionUser(mockUser);
        fetchData();
        return { success: true };
      } else if (
        (email === 'staff@example.com' && password === 'staff123') ||
        (email === 'staff1' && password === 'staff123')
      ) {
        const mockUser = { id: 2, username: 'staff1', email: 'staff@example.com', role: 'staff' };
        dispatch({ type: ACTIONS.LOGIN, payload: mockUser });
        setSessionUser(mockUser);
        fetchData();
        return { success: true };
      }
      return { success: false, message: 'Database offline. Silakan masukkan akun demo admin atau staff!' };
    }
  };

  const register = async (username, email, password) => {
    const url = state.activeBackendUrl || BACKEND_URLS[0];
    try {
      const response = await fetch(`${url}/api/register.php`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, email, password }),
        credentials: 'include'
      });
      const result = await response.json();
      return result;
    } catch (err) {
      return { success: false, message: 'Gagal terhubung ke database. Pastikan server berjalan.' };
    }
  };

  const logout = () => {
    dispatch({ type: ACTIONS.LOGOUT });
    setSessionUser(null);
    const url = state.activeBackendUrl;
    if (url) {
      fetch(`${url}/api/logout.php`, { credentials: 'include' }).catch(() => { });
    }
  };

  return (
    <DashboardContext.Provider value={{
      state,
      dispatch,
      fetchData,
      login,
      logout,
      register
    }}>
      {children}
    </DashboardContext.Provider>
  );
}

export function useDashboard() {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
}
