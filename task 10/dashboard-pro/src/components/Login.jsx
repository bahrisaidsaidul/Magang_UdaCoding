import React, { useState } from 'react';
import { useDashboard } from '../context/DashboardContext';
import { KeyRound, Mail, AlertTriangle, FileSpreadsheet, User as UserIcon } from 'lucide-react';

export default function Login() {
  const { login, register } = useDashboard();
  const [isRegistering, setIsRegistering] = useState(false);
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [successMsg, setSuccessMsg] = useState('');
  const [loading, setLoading] = useState(false);

  // Set default login credentials only when not registering
  React.useEffect(() => {
    if (!isRegistering) {
      setEmail('admin@example.com');
      setPassword('admin123');
      setUsername('');
      setError('');
      setSuccessMsg('');
    } else {
      setEmail('');
      setPassword('');
      setUsername('');
      setError('');
      setSuccessMsg('');
    }
  }, [isRegistering]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccessMsg('');
    setLoading(true);
    
    if (isRegistering) {
      const result = await register(username, email, password);
      setLoading(false);
      if (result.success) {
        setSuccessMsg('Pendaftaran berhasil! Silakan masuk.');
        setIsRegistering(false);
      } else {
        setError(result.message || 'Pendaftaran gagal.');
      }
    } else {
      const result = await login(email, password);
      setLoading(false);
      if (!result.success) {
        setError(result.message || 'Login gagal. Periksa kembali email dan password Anda.');
      }
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-brand-darker px-4 py-12 relative overflow-hidden">
      {/* Background radial glow */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-brand-gold/10 rounded-full blur-[120px] pointer-events-none z-0"></div>

      <div className="max-w-md w-full bg-white rounded-3xl shadow-premium p-8 z-10 relative border border-neutral-100">
        
        {/* Logo and header */}
        <div className="text-center mb-8">
          <div className="mx-auto w-12 h-12 rounded-xl bg-brand-gold flex items-center justify-center shadow-lg shadow-brand-gold/20 mb-4 animate-bounce">
            <FileSpreadsheet className="text-white" size={24} />
          </div>
          <h2 className="text-2xl font-bold text-brand-dark font-sans tracking-tight">Omset Tracker</h2>
          <p className="text-sm text-gray-500 mt-1">
            {isRegistering ? 'Daftar akun baru' : 'Masuk ke dashboard freelancer kamu'}
          </p>
        </div>

        {error && (
          <div className="mb-5 p-3 rounded-xl bg-red-50 border border-red-200 text-xs text-red-600 flex items-start gap-2 animate-shake">
            <AlertTriangle size={16} className="shrink-0 mt-0.5" />
            <span>{error}</span>
          </div>
        )}

        {successMsg && (
          <div className="mb-5 p-3 rounded-xl bg-emerald-50 border border-emerald-200 text-xs text-emerald-600 flex items-start gap-2">
            <span>{successMsg}</span>
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {isRegistering && (
            <div>
              <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
                Username
              </label>
              <div className="relative rounded-xl shadow-sm">
                <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                  <UserIcon size={16} />
                </div>
                <input
                  type="text"
                  required
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  className="block w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-gold focus:border-brand-gold bg-neutral-50/50"
                  placeholder="Masukkan username"
                />
              </div>
            </div>
          )}

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              {isRegistering ? 'Email' : 'Email atau Username'}
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <Mail size={16} />
              </div>
              <input
                type="text"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-gold focus:border-brand-gold bg-neutral-50/50"
                placeholder={isRegistering ? 'Masukkan email' : 'Masukkan email atau username'}
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5 uppercase tracking-wider">
              Password
            </label>
            <div className="relative rounded-xl shadow-sm">
              <div className="absolute inset-y-0 left-0 pl-3.5 flex items-center pointer-events-none text-gray-400">
                <KeyRound size={16} />
              </div>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="block w-full pl-10 pr-4 py-3 border border-neutral-200 rounded-xl text-sm font-medium focus:ring-1 focus:ring-brand-gold focus:border-brand-gold bg-neutral-50/50"
                placeholder="••••••••"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 bg-brand-gold hover:bg-brand-goldHover disabled:opacity-50 text-white font-semibold rounded-xl text-sm transition-all shadow-md shadow-brand-gold/10 hover:shadow-lg focus:outline-none flex items-center justify-center gap-2"
          >
            {loading ? 'Menghubungkan...' : (isRegistering ? 'Daftar Akun' : 'Masuk')}
          </button>
        </form>

        {/* Demo Accounts Panel (Only show on Login) */}
        {!isRegistering && (
          <div className="mt-6 p-4 rounded-2xl bg-[#F7F5F0] border border-[#EBE8E0] text-xs text-[#5C5647]">
            <p className="font-bold mb-1">Demo Accounts:</p>
            <div className="space-y-1 font-medium font-mono text-[11px]">
              <p>Admin: <span className="underline">admin@example.com</span> / <span className="font-semibold">admin123</span></p>
              <p>Staff: <span className="underline">staff@example.com</span> / <span className="font-semibold">staff123</span></p>
            </div>
          </div>
        )}

        {/* Toggle Link */}
        <div className="text-center mt-6">
          <p className="text-xs text-gray-500">
            {isRegistering ? 'Sudah punya akun? ' : 'Belum punya akun? '}
            <span 
              onClick={() => setIsRegistering(!isRegistering)}
              className="text-brand-gold hover:text-brand-goldHover font-bold cursor-pointer transition-colors"
            >
              {isRegistering ? 'Masuk di sini' : 'Daftar sekarang'}
            </span>
          </p>
        </div>

      </div>
    </div>
  );
}
