import { useState, useEffect } from 'react';
import { FaMoneyBillWave, FaNotEqual } from "react-icons/fa";
import { IoTrendingUpOutline } from "react-icons/io5";
import { FaRegNoteSticky } from "react-icons/fa6";
import { TbTargetArrow } from "react-icons/tb";
import { IoMdSearch } from "react-icons/io";
import axios from 'axios';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  LineChart, Line,
  PieChart, Pie, Cell
} from 'recharts';
import toast, { Toaster } from 'react-hot-toast';

const GOLD_COLORS = ['#f59e0b', '#d97706', '#fbbf24', '#b45309', '#fde68a'];

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--surface)',
        border: '1px solid var(--border)',
        borderRadius: '8px',
        padding: '0.625rem 0.875rem',
        boxShadow: 'var(--shadow-md)',
        fontSize: '0.8rem'
      }}>
        <p style={{ color: 'var(--text-muted)', marginBottom: '0.25rem', fontWeight: 600 }}>{label}</p>
        {payload.map((p, i) => (
          <p key={i} style={{ color: p.color, fontFamily: 'JetBrains Mono, monospace', fontWeight: 600 }}>
            Rp {(p.value || 0).toLocaleString('id-ID')}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

export default function Dashboard({ userRole }) {
  const [data, setData] = useState({
    total_omset: 0,
    total_invoices: 0,
    avg_daily: 0,
    target: 0,
    achievement: 0,
    daily_chart: [],
    weekly_chart: [],
    client_chart: [],
    invoices: []
  });
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingInvoice, setEditingInvoice] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [formData, setFormData] = useState({
    project_name: '', client: '', amount: '', date: '', status: 'pending'
  });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/dashboard-omsets/backend/api/get_data.php', {
        withCredentials: true
      });

      const clientChart = (response.data.client_chart || []).map(item => ({
        client: item.client || item.name || 'Unknown',
        total: parseFloat(item.total) || 0
      }));

      setData({
        total_omset: response.data.total_omset || 0,
        total_invoices: response.data.total_invoices || 0,
        avg_daily: response.data.avg_daily || 0,
        target: response.data.target || 0,
        achievement: response.data.achievement || 0,
        daily_chart: response.data.daily_chart || [],
        weekly_chart: response.data.weekly_chart || [],
        client_chart: clientChart,
        invoices: response.data.invoices || []
      });
    } catch (error) {
      toast.error('Gagal memuat data dashboard');
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const url = editingInvoice
      ? 'http://localhost/dashboard-omsets/backend/api/edit_invoice.php'
      : 'http://localhost/dashboard-omsets/backend/api/add_invoice.php';
    const payload = editingInvoice ? { ...formData, id: editingInvoice.id } : formData;

    try {
      const response = await axios.post(url, payload, {
        withCredentials: true,
        headers: { 'Content-Type': 'application/json' }
      });
      if (response.data.success) {
        toast.success(editingInvoice ? 'Invoice diperbarui!' : 'Invoice ditambahkan!');
        closeModal();
        await fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Operasi gagal');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus invoice ini?')) return;
    try {
      const response = await axios.post(
        'http://localhost/dashboard-omsets/backend/api/delete_invoice.php',
        { id },
        { withCredentials: true, headers: { 'Content-Type': 'application/json' } }
      );
      if (response.data.success) {
        toast.success('Invoice dihapus!');
        await fetchData();
      } else {
        toast.error(response.data.message);
      }
    } catch {
      toast.error('Gagal menghapus');
    }
  };

  const handleExport = (format) => {
    window.open(`http://localhost/dashboard-omsets/backend/api/export_data.php?format=${format}`, '_blank');
  };

  const openEdit = (invoice) => {
    setEditingInvoice(invoice);
    setFormData({
      project_name: invoice.project_name,
      client: invoice.client,
      amount: invoice.amount,
      date: invoice.date,
      status: invoice.status
    });
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingInvoice(null);
    setFormData({ project_name: '', client: '', amount: '', date: '', status: 'pending' });
  };

  const filteredInvoices = Array.isArray(data.invoices)
    ? data.invoices.filter(inv =>
        inv.project_name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        inv.client?.toLowerCase().includes(searchTerm.toLowerCase())
      )
    : [];

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat dashboard...</p>
      </div>
    );
  }

  const achievementPct = Math.min(data.achievement, 100);

  return (
    <div className="dashboard">
      <Toaster position="top-right" toastOptions={{
        style: {
          fontFamily: 'Plus Jakarta Sans, sans-serif',
          fontSize: '0.85rem',
          borderRadius: '8px',
        }
      }} />

      {/* ── STAT CARDS ── */}
      <div className="stats-grid">
        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Omset Bulanan</span>
            <div className="stat-card__icon"><FaMoneyBillWave /></div>
          </div>
          <div className="stat-card__value">
            Rp {Math.round(data.total_omset / 1000000).toLocaleString('id-ID')}jt
          </div>
          <div className="stat-card__sub">
            Total penerimaan bulan ini
          </div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Rata-rata Harian</span>
            <div className="stat-card__icon"><IoTrendingUpOutline /></div>
          </div>
          <div className="stat-card__value">
            Rp {Math.round(data.avg_daily / 1000).toLocaleString('id-ID')}rb
          </div>
          <div className="stat-card__sub">Omset rata-rata per hari</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Total Invoice</span>
            <div className="stat-card__icon"><FaRegNoteSticky /></div>
          </div>
          <div className="stat-card__value">{data.total_invoices}</div>
          <div className="stat-card__sub">Proyek aktif bulan ini</div>
        </div>

        <div className="stat-card">
          <div className="stat-card__header">
            <span className="stat-card__label">Pencapaian Target</span>
            <div className="stat-card__icon"><TbTargetArrow /></div>
          </div>
          <div className="stat-card__value">{data.achievement.toFixed(1)}%</div>
          <div className="stat-card__sub">
            dari target Rp {parseInt(data.target).toLocaleString('id-ID')}
          </div>
          <div className="stat-card__bar">
            <div className="fill" style={{ width: `${achievementPct}%` }} />
          </div>
        </div>
      </div>

      {/* ── CHARTS ── */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Omset Harian</h3>
            <span className="chart-badge">Bar Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <BarChart data={data.daily_chart} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="day" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v/1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Bar dataKey="total" fill="#f59e0b" name="Omset" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Trend Mingguan</h3>
            <span className="chart-badge">Line Chart</span>
          </div>
          <ResponsiveContainer width="100%" height={260}>
            <LineChart data={data.weekly_chart} margin={{ top: 4, right: 4, left: -10, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" vertical={false} />
              <XAxis dataKey="week" tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: 'var(--text-muted)' }} axisLine={false} tickLine={false}
                tickFormatter={v => `${(v/1000000).toFixed(0)}jt`} />
              <Tooltip content={<CustomTooltip />} />
              <Line type="monotone" dataKey="total" stroke="#f59e0b" strokeWidth={2}
                dot={{ r: 4, fill: '#f59e0b', strokeWidth: 0 }}
                activeDot={{ r: 6, fill: '#d97706', strokeWidth: 0 }} name="Omset" />
            </LineChart>
          </ResponsiveContainer>
        </div>

        <div className="chart-card">
          <div className="chart-card__header">
            <h3>Distribusi Klien</h3>
            <span className="chart-badge">Donut Chart</span>
          </div>
          {data.client_chart.length > 0 ? (
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie
                  data={data.client_chart}
                  cx="50%" cy="50%"
                  innerRadius={45} outerRadius={80}
                  paddingAngle={3}
                  dataKey="total"
                  nameKey="client"
                  label={({ percent }) => `${((percent || 0) * 100).toFixed(0)}%`}
                  labelLine={false}
                >
                  {data.client_chart.map((_, index) => (
                    <Cell key={`cell-${index}`} fill={GOLD_COLORS[index % GOLD_COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value, _, props) => [
                    `Rp ${parseFloat(value).toLocaleString('id-ID')}`,
                    props.payload.client
                  ]}
                  contentStyle={{
                    fontFamily: 'Plus Jakarta Sans, sans-serif',
                    fontSize: '0.8rem',
                    borderRadius: '8px',
                    border: '1px solid var(--border)',
                    background: 'var(--surface)',
                    boxShadow: 'var(--shadow-md)'
                  }}
                />
                <Legend
                  formatter={(value) => (
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{value}</span>
                  )}
                />
              </PieChart>
            </ResponsiveContainer>
          ) : (
            <div className="empty-state" style={{ padding: '4rem 1rem' }}>
              <div className="empty-icon">🥧</div>
              <p>Tidak ada data klien</p>
            </div>
          )}
        </div>
      </div>

      {/* ── INVOICE TOOLBAR ── */}
      {userRole === 'admin' && (
        <div className="toolbar">
          <button onClick={() => setShowModal(true)} className="btn btn-primary">
            + Tambah Invoice
          </button>
          <button onClick={() => handleExport('csv')} className="btn btn-success">
            ↓ Export CSV
          </button>
          <button onClick={() => handleExport('excel')} className="btn btn-info">
            ↓ Export Excel
          </button>
        </div>
      )}

      {/* ── INVOICE TABLE ── */}
      <div className="table-card">
        <div className="table-card__header">
          <h3>Daftar Invoice</h3>
          <div className="search-bar">
            <span className="search-icon"><IoMdSearch /></span>
            <input
              type="text"
              placeholder="Cari proyek atau klien..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        {filteredInvoices.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon">📋</div>
            <p>Tidak ada data invoice</p>
          </div>
        ) : (
          <div style={{ overflowX: 'auto' }}>
            <table className="data-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Proyek</th>
                  <th>Klien</th>
                  <th>Nominal</th>
                  <th>Tanggal</th>
                  <th>Status</th>
                  {userRole === 'admin' && <th>Aksi</th>}
                </tr>
              </thead>
              <tbody>
                {filteredInvoices.map((invoice) => (
                  <tr key={invoice.id}>
                    <td>
                      <span className="mono" style={{ color: 'var(--text-muted)' }}>#{invoice.id}</span>
                    </td>
                    <td style={{ fontWeight: 600 }}>{invoice.project_name}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{invoice.client}</td>
                    <td>
                      <span className="mono">Rp {parseInt(invoice.amount).toLocaleString('id-ID')}</span>
                    </td>
                    <td style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>{invoice.date}</td>
                    <td>
                      <span className={`badge badge-${invoice.status}`}>
                        {invoice.status === 'paid' ? 'Lunas' : invoice.status === 'pending' ? 'Pending' : 'Overdue'}
                      </span>
                    </td>
                    {userRole === 'admin' && (
                      <td>
                        <button
                          className="action-btn edit"
                          onClick={() => openEdit(invoice)}
                          title="Edit"
                        >✏️</button>
                        <button
                          className="action-btn delete"
                          onClick={() => handleDelete(invoice.id)}
                          title="Hapus"
                        >🗑️</button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* ── MODAL ── */}
      {showModal && (
        <div className="modal-overlay" onClick={closeModal}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div className="modal-box__header">
              <h2>{editingInvoice ? 'Edit Invoice' : 'Tambah Invoice Baru'}</h2>
              <button className="close-btn" onClick={closeModal}>✕</button>
            </div>
            <div className="modal-box__body">
              <form onSubmit={handleSubmit}>
                <div className="form-group">
                  <label>Nama Proyek</label>
                  <input
                    type="text"
                    placeholder="Contoh: Website Company Profile"
                    value={formData.project_name}
                    onChange={(e) => setFormData({ ...formData, project_name: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nama Klien</label>
                  <input
                    type="text"
                    placeholder="Nama klien atau perusahaan"
                    value={formData.client}
                    onChange={(e) => setFormData({ ...formData, client: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Nominal Omset (Rp)</label>
                  <input
                    type="number"
                    placeholder="0"
                    value={formData.amount}
                    onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Tanggal</label>
                  <input
                    type="date"
                    value={formData.date}
                    onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Status</label>
                  <select
                    value={formData.status}
                    onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                  >
                    <option value="pending">Pending</option>
                    <option value="paid">Paid (Lunas)</option>
                    <option value="overdue">Overdue</option>
                  </select>
                </div>
                <div className="modal-actions">
                  <button type="submit" className="btn btn-primary">Simpan</button>
                  <button type="button" className="btn btn-secondary" onClick={closeModal}>Batal</button>
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}