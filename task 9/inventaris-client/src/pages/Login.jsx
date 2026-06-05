import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Box, LogIn, Lock, Mail } from 'lucide-react';
import { THEME_STYLES } from './theme';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    const result = await login({ email, password });
    if (result.success) {
      navigate('/items');
    } else {
      setError(result.message);
    }
    setLoading(false);
  };

  return (
    <>
      <style>{THEME_STYLES}</style>

      <div className="auth-shell">
        <div className="auth-card">

          {/* Brand */}
          <div className="auth-brand">
            <div className="auth-icon-wrap">
              <Box color="white" size={26} />
            </div>
            <div
              style={{
                fontFamily: "'Syne', sans-serif",
                fontWeight: 800,
                fontSize: 22,
                letterSpacing: '-0.4px',
                background: 'linear-gradient(120deg, var(--accent), var(--accent2))',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
                marginBottom: 2,
              }}
            >
              Inventaris
            </div>
            <p className="auth-title" style={{ fontSize: 17, marginBottom: 2 }}>Selamat Datang Kembali</p>
            <p className="auth-sub">Masuk ke sistem inventaris Anda</p>
          </div>

          {/* Error */}
          {error && (
            <div className="alert-error">
              <span className="alert-dot" />
              {error}
            </div>
          )}

          {/* Form */}
          <form onSubmit={handleSubmit}>
            <div className="field-group">
              <label className="field-label">Alamat Email</label>
              <div className="field-wrap">
                <span className="field-icon"><Mail size={16} /></span>
                <input
                  type="email"
                  className="field-input"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="nama@perusahaan.com"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Kata Sandi</label>
              <div className="field-wrap">
                <span className="field-icon"><Lock size={16} /></span>
                <input
                  type="password"
                  className="field-input"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div style={{ marginTop: 24 }}>
              <button type="submit" className="btn-primary" disabled={loading}>
                {loading ? (
                  <>
                    <span className="spinner" style={{ borderColor: 'rgba(255,255,255,0.3)', borderTopColor: 'white', width: 16, height: 16 }} />
                    Masuk...
                  </>
                ) : (
                  <>
                    <LogIn size={16} />
                    Masuk
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            Belum punya akun?{' '}
            <Link to="/register" className="auth-link">Buat Akun</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Login;