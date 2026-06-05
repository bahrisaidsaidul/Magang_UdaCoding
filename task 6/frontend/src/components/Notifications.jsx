import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Notifications = () => {
  const [notifications, setNotifications] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => { checkNotifications(); }, []);

  const checkNotifications = async () => {
    try {
      const response = await axios.get('http://localhost/dashboard-omsets/backend/api/get_data.php', {
        withCredentials: true
      });
      const data = response.data;
      const alerts = [];

      if (data.achievement < 50) {
        alerts.push({
          id: 1, type: 'warning',
          icon: '⚠️',
          title: 'Pencapaian Target Rendah',
          message: `Pencapaian omset kamu baru ${data.achievement.toFixed(1)}% dari target bulan ini. Yuk tingkatkan!`,
          date: new Date().toLocaleDateString('id-ID')
        });
      } else if (data.achievement > 90) {
        alerts.push({
          id: 2, type: 'success',
          icon: '🎉',
          title: 'Target Hampir Tercapai!',
          message: `Luar biasa! Pencapaian omset kamu sudah ${data.achievement.toFixed(1)}% dari target.`,
          date: new Date().toLocaleDateString('id-ID')
        });
      }

      const overdueInvoices = (data.invoices || []).filter(inv => inv.status === 'overdue');
      if (overdueInvoices.length > 0) {
        alerts.push({
          id: 3, type: 'danger',
          icon: '🔴',
          title: 'Invoice Overdue',
          message: `Terdapat ${overdueInvoices.length} invoice yang sudah melewati jatuh tempo. Segera tindaklanjuti!`,
          date: new Date().toLocaleDateString('id-ID')
        });
      }

      if (alerts.length === 0) {
        alerts.push({
          id: 0, type: 'success',
          icon: '✅',
          title: 'Semua Baik-baik Saja',
          message: 'Tidak ada peringatan atau notifikasi penting saat ini.',
          date: new Date().toLocaleDateString('id-ID')
        });
      }

      setNotifications(alerts);
    } catch (error) {
      console.error('Error:', error);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-state">
        <div className="spinner" />
        <p>Memuat notifikasi...</p>
      </div>
    );
  }

  return (
    <>
      <div className="page-header">
        <h2>Notifikasi</h2>
        <p>{notifications.length} pesan untukmu</p>
      </div>

      <div style={{ maxWidth: 640 }}>
        {notifications.map(notif => (
          <div
            key={notif.id}
            className={`notification-item notification-item-${notif.type}`}
          >
            <div className="notif-icon">{notif.icon}</div>
            <div className="notif-body">
              <p style={{ fontWeight: 700, marginBottom: '0.25rem' }}>{notif.title}</p>
              <p style={{ fontWeight: 400, opacity: 0.85 }}>{notif.message}</p>
              <small>{notif.date}</small>
            </div>
          </div>
        ))}
      </div>
    </>
  );
};

export default Notifications;