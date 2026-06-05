import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit, Trash2, Package, X } from 'lucide-react';
import { THEME_STYLES } from './theme';

const Items = () => {
  const [items, setItems] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ name: '', category_id: '', price: '', stock: '' });

  useEffect(() => { fetchData(); }, []);

  const fetchData = async () => {
    try {
      const [itemsRes, catsRes] = await Promise.all([
        axiosClient.get('/items'),
        axiosClient.get('/categories'),
      ]);
      setItems(itemsRes.data);
      setCategories(catsRes.data);
    } catch (err) {
      console.error('Failed to fetch data', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingItem) {
        await axiosClient.put(`/items/${editingItem.id}`, formData);
      } else {
        await axiosClient.post('/items', formData);
      }
      fetchData();
      closeModal();
    } catch {
      alert('Error menyimpan barang');
    }
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({ name: item.name, category_id: item.category_id, price: item.price, stock: item.stock });
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus barang ini?')) return;
    try {
      await axiosClient.delete(`/items/${id}`);
      fetchData();
    } catch {
      alert('Error menghapus barang');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingItem(null);
    setFormData({ name: '', category_id: '', price: '', stock: '' });
  };

  const set = (key) => (e) => setFormData({ ...formData, [key]: e.target.value });

  const formatIDR = (n) =>
    new Intl.NumberFormat('id-ID', { style: 'currency', currency: 'IDR', maximumFractionDigits: 0 }).format(n);

  return (
    <>
      <style>{THEME_STYLES}</style>

      {/* Page header */}
      <div className="page-head">
        <div>
          <div className="page-title">
            <span className="page-title-icon">
              <Package size={18} color="white" />
            </span>
            Data Inventaris
          </div>
          <p className="page-sub">Kelola stok dan harga Anda</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Tambah Barang
        </button>
      </div>

      {/* Table card */}
      <div className="data-card">
        {loading ? (
          <div className="state-loading">
            <div className="spinner" />
            Memuat data...
          </div>
        ) : (
          <table>
            <thead>
              <tr>
                <th>Nama Barang</th>
                <th>Kategori</th>
                <th>Harga</th>
                <th>Stok</th>
                <th style={{ width: 110 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {items.map((item) => {
                return (
                  <tr key={item.id}>
                    <td>
                      <div className="td-name">{item.name}</div>
                      <div className="td-sku">Kode Barang: {String(item.id).padStart(4, '0')}</div>
                    </td>
                    <td>
                      <span className="badge">{item.category?.name || 'Tanpa Kategori'}</span>
                    </td>
                    <td>
                      <span className="price-text">{formatIDR(item.price)}</span>
                    </td>
                    <td>
                      <span style={{ fontSize: 13.5, color: 'var(--text)', fontWeight: 500 }}>
                        {item.stock} unit
                      </span>
                    </td>
                    <td>
                      <div className="action-wrap">
                        <button className="act-edit" onClick={() => handleEdit(item)} title="Edit">
                          <Edit size={14} />
                        </button>
                        <button className="act-del" onClick={() => handleDelete(item.id)} title="Hapus">
                          <Trash2 size={14} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}

              {items.length === 0 && (
                <tr>
                  <td colSpan={5} style={{ padding: 0 }}>
                    <div className="state-empty">
                      <div className="state-empty-icon">
                        <Package size={24} />
                      </div>
                      <p>Belum ada barang di inventaris.</p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={(e) => e.target === e.currentTarget && closeModal()}>
          <div className="modal-box">
            <div className="modal-head">
              <div>
                <div className="modal-title">
                  {editingItem ? 'Edit Barang' : 'Barang Baru'}
                </div>
                <div className="modal-sub">Lengkapi detail informasi barang</div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Nama Barang</label>
                <input
                  type="text"
                  className="field-input no-icon"
                  value={formData.name}
                  onChange={set('name')}
                  placeholder="misal: MacBook Pro M3"
                  autoFocus
                  required
                />
              </div>

              <div className="field-group">
                <label className="field-label">Kategori</label>
                <select
                  className="field-input no-icon"
                  value={formData.category_id}
                  onChange={set('category_id')}
                  required
                >
                  <option value="">Pilih Kategori</option>
                  {categories.map((cat) => (
                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                  ))}
                </select>
              </div>

              <div className="form-row">
                <div className="field-group" style={{ margin: 0 }}>
                  <label className="field-label">Harga (IDR)</label>
                  <input
                    type="number"
                    className="field-input no-icon"
                    value={formData.price}
                    onChange={set('price')}
                    placeholder="0"
                    required
                  />
                </div>
                <div className="field-group" style={{ margin: 0 }}>
                  <label className="field-label">Stok Awal</label>
                  <input
                    type="number"
                    className="field-input no-icon"
                    value={formData.stock}
                    onChange={set('stock')}
                    placeholder="0"
                    required
                  />
                </div>
              </div>

              <div className="btn-row">
                <button type="button" className="btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary">
                  {editingItem ? 'Perbarui Barang' : 'Simpan Barang'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Items;