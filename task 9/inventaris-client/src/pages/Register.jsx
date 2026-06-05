import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axiosClient from '../api/axiosClient';
import { Box, UserPlus, User, Mail, Lock } from 'lucide-react';
import { THEME_STYLES } from './theme';

const Register = () => {
  const [formData, setFormData] = useState({ name: '', email: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    try {
      await axiosClient.post('/register', formData);
      navigate('/login');
    } catch (err) {
      setError(err.response?.data?.message || 'Pendaftaran gagal');
    } finally {
      setLoading(false);
    }
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

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
            <p className="auth-title" style={{ fontSize: 17, marginBottom: 2 }}>Buat Akun Baru</p>
            <p className="auth-sub">Bergabung dengan sistem inventaris kami</p>
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
              <label className="field-label">Nama Lengkap</label>
              <div className="field-wrap">
                <span className="field-icon"><User size={16} /></span>
                <input
                  type="text"
                  className="field-input"
                  value={formData.name}
                  onChange={set('name')}
                  placeholder="John Doe"
                  required
                />
              </div>
            </div>

            <div className="field-group">
              <label className="field-label">Alamat Email</label>
              <div className="field-wrap">
                <span className="field-icon"><Mail size={16} /></span>
                <input
                  type="email"
                  className="field-input"
                  value={formData.email}
                  onChange={set('email')}
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
                  value={formData.password}
                  onChange={set('password')}
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
                    Membuat akun...
                  </>
                ) : (
                  <>
                    <UserPlus size={16} />
                    Daftar
                  </>
                )}
              </button>
            </div>
          </form>

          <div className="auth-footer">
            Sudah punya akun?{' '}
            <Link to="/login" className="auth-link">Masuk</Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default Register;