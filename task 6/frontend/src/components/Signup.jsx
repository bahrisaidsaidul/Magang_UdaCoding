import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

const Signup = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Password tidak cocok');
      return;
    }
    try {
      const response = await axios.post(
        'http://localhost/dashboard-omsets/backend/api/register.php',
        { username, email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        toast.success('Registrasi berhasil! Silakan login.');
        setTimeout(() => navigate('/login'), 2000);
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Registrasi gagal. Coba lagi.');
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', borderRadius: '8px' } }} />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-icon">📝</div>
          <h2>Buat Akun Baru</h2>
          <p>Daftar dan mulai lacak omset kamu</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Username</label>
            <input type="text" placeholder="username" value={username}
              onChange={(e) => setUsername(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Email</label>
            <input type="email" placeholder="email@contoh.com" value={email}
              onChange={(e) => setEmail(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input type="password" placeholder="••••••••" value={password}
              onChange={(e) => setPassword(e.target.value)} required />
          </div>
          <div className="form-group">
            <label>Konfirmasi Password</label>
            <input type="password" placeholder="••••••••" value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)} required />
          </div>
          <button type="submit" className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}>
            Daftar Sekarang
          </button>
        </form>

        <div className="demo-info">
          ⚠️ Akun baru otomatis mendapatkan role <strong>STAFF</strong> (read-only access)
        </div>

        <div className="auth-link">
          Sudah punya akun? <Link to="/login">Masuk di sini</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;