import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import toast, { Toaster } from 'react-hot-toast';

export default function Login({ onLogin }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await axios.post(
        'http://localhost/dashboard-omsets/backend/api/login.php',
        { email, password },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data.success) {
        toast.success('Login berhasil!');
        onLogin(response.data.user);
        navigate('/dashboard');
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Login gagal. Coba lagi.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <Toaster position="top-right" toastOptions={{ style: { fontFamily: 'Plus Jakarta Sans, sans-serif', fontSize: '0.85rem', borderRadius: '8px' } }} />
      <div className="auth-card">
        <div className="auth-logo">
          <div className="auth-icon">📊</div>
          <h2>Omset Tracker</h2>
          <p>Masuk ke dashboard freelancer kamu</p>
        </div>

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>Email atau Username</label>
            <input
              type="text"
              placeholder="email@contoh.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Password</label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            disabled={loading}
            className="btn btn-primary"
            style={{ width: '100%', justifyContent: 'center', padding: '0.75rem', marginTop: '0.25rem' }}
          >
            {loading ? 'Memproses...' : 'Masuk'}
          </button>
        </form>

        <div className="demo-info">
          <strong>Demo Accounts:</strong><br />
          Admin: admin@example.com / admin123<br />
          Staff: staff@example.com / staff123
        </div>

        <div className="auth-link">
          Belum punya akun? <Link to="/signup">Daftar sekarang</Link>
        </div>
      </div>
    </div>
  );
}