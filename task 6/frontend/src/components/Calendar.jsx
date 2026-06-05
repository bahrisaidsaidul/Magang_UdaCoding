import { useState, useEffect } from 'react';
import Calendar from 'react-calendar';
import axios from 'axios';
import 'react-calendar/dist/Calendar.css';

export default function CalendarPage() {
  const [value, setValue] = useState(new Date());
  const [invoices, setInvoices] = useState([]);
  const [selectedDateInvoices, setSelectedDateInvoices] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { fetchInvoices(); }, []);

  const fetchInvoices = async () => {
    try {
      setLoading(true);
      const response = await axios.get('http://localhost/dashboard-omsets/backend/api/get_data.php', {
        withCredentials: true
      });
      setInvoices(response.data.invoices || []);
    } catch (error) {
      console.error('Error fetching invoices:', error);
    } finally {
      setLoading(false);
    }
  };

  const getTileContent = ({ date, view }) => {
    if (view === 'month') {
      const dateStr = date.toISOString().split('T')[0];
      const dayInvoices = invoices.filter(inv => inv && inv.date === dateStr);
      if (dayInvoices.length > 0) {
        const total = dayInvoices.reduce((sum, inv) => sum + parseFloat(inv.amount || 0), 0);
        return (
          <span className="tile-amount">
            {(total / 1000000).toFixed(1)}jt
          </span>
        );
      }
    }
    return null;
  };

  const handleDateClick = (date) => {
    setValue(date);
    const dateStr = date.toISOString().split('T')[0];
    setSelectedDateInvoices(invoices.filter(inv => inv && inv.date === dateStr));
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat kalender...</p>
      </div>
    );
  }

  const totalSelected = selectedDateInvoices.reduce(
    (sum, inv) => sum + parseFloat(inv.amount || 0), 0
  );

  return (
    <>
      <div className="page-header">
        <h2>Kalender Omset</h2>
        <p>Klik tanggal untuk melihat detail transaksi</p>
      </div>

      <div className="calendar-page">
        <Calendar
          onChange={handleDateClick}
          value={value}
          tileContent={getTileContent}
          onClickDay={handleDateClick}
          className="custom-calendar"
        />

        <div>
          <div style={{
            background: 'var(--surface)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-lg)',
            overflow: 'hidden',
            boxShadow: 'var(--shadow-sm)'
          }}>
            <div style={{
              padding: '1rem 1.25rem',
              borderBottom: '1px solid var(--border)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center'
            }}>
              <div>
                <h3 style={{ fontSize: '0.9rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '0.1rem' }}>
                  {value.toLocaleDateString('id-ID', { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}
                </h3>
                <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  {selectedDateInvoices.length} transaksi
                </p>
              </div>
              {selectedDateInvoices.length > 0 && (
                <div style={{
                  background: 'linear-gradient(135deg, var(--gold-50), var(--gold-100))',
                  border: '1px solid var(--gold-200)',
                  borderRadius: 'var(--radius-sm)',
                  padding: '0.375rem 0.75rem',
                  textAlign: 'right'
                }}>
                  <div style={{ fontSize: '0.65rem', color: 'var(--gold-700)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Total</div>
                  <div style={{ fontFamily: 'JetBrains Mono, monospace', fontSize: '0.875rem', fontWeight: 700, color: 'var(--gold-700)' }}>
                    Rp {totalSelected.toLocaleString('id-ID')}
                  </div>
                </div>
              )}
            </div>

            {selectedDateInvoices.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon">📅</div>
                <p>Tidak ada transaksi pada tanggal ini</p>
              </div>
            ) : (
              <table className="data-table">
                <thead>
                  <tr>
                    <th>Proyek</th>
                    <th>Klien</th>
                    <th style={{ textAlign: 'right' }}>Omset</th>
                  </tr>
                </thead>
                <tbody>
                  {selectedDateInvoices.map((inv, idx) => (
                    <tr key={idx}>
                      <td style={{ fontWeight: 600 }}>{inv.project_name || '—'}</td>
                      <td style={{ color: 'var(--text-secondary)' }}>{inv.client || '—'}</td>
                      <td style={{ textAlign: 'right' }}>
                        <span className="mono" style={{ color: 'var(--gold-600)', fontWeight: 700 }}>
                          Rp {parseFloat(inv.amount || 0).toLocaleString('id-ID')}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>
      </div>
    </>
  );
}