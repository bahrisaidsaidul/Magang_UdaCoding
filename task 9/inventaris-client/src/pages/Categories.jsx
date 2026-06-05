import React, { useState, useEffect } from 'react';
import axiosClient from '../api/axiosClient';
import { Plus, Edit, Trash2, LayoutGrid, X, Hash } from 'lucide-react';
import { THEME_STYLES } from './theme';

const Categories = () => {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showModal, setShowModal] = useState(false);
  const [editingCategory, setEditingCategory] = useState(null);
  const [name, setName] = useState('');

  useEffect(() => { fetchCategories(); }, []);

  const fetchCategories = async () => {
    try {
      const res = await axiosClient.get('/categories');
      setCategories(res.data);
    } catch (err) {
      console.error('Failed to fetch categories', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editingCategory) {
        await axiosClient.put(`/categories/${editingCategory.id}`, { name });
      } else {
        await axiosClient.post('/categories', { name });
      }
      fetchCategories();
      closeModal();
    } catch {
      alert('Error menyimpan kategori');
    }
  };

  const handleEdit = (cat) => {
    setEditingCategory(cat);
    setName(cat.name);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Hapus kategori ini?')) return;
    try {
      await axiosClient.delete(`/categories/${id}`);
      fetchCategories();
    } catch {
      alert('Error menghapus kategori');
    }
  };

  const closeModal = () => {
    setShowModal(false);
    setEditingCategory(null);
    setName('');
  };

  return (
    <>
      <style>{THEME_STYLES}</style>

      {/* Page header */}
      <div className="page-head">
        <div>
          <div className="page-title">
            <span className="page-title-icon">
              <LayoutGrid size={18} color="white" />
            </span>
            Kategori
          </div>
          <p className="page-sub">Kelola kategori produk Anda</p>
        </div>
        <button className="btn-add" onClick={() => setShowModal(true)}>
          <Plus size={16} />
          Tambah Kategori
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
                <th style={{ width: 80 }}>ID</th>
                <th>Nama Kategori</th>
                <th style={{ width: 110 }}>Aksi</th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr key={cat.id}>
                  <td>
                    <span className="td-id">
                      <Hash size={10} style={{ display: 'inline', verticalAlign: 'middle', marginRight: 2 }} />
                      {cat.id}
                    </span>
                  </td>
                  <td>
                    <span className="td-name">{cat.name}</span>
                  </td>
                  <td>
                    <div className="action-wrap">
                      <button className="act-edit" onClick={() => handleEdit(cat)} title="Edit">
                        <Edit size={14} />
                      </button>
                      <button className="act-del" onClick={() => handleDelete(cat.id)} title="Hapus">
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={3} style={{ padding: 0 }}>
                    <div className="state-empty">
                      <div className="state-empty-icon">
                        <LayoutGrid size={24} />
                      </div>
                      <p>Belum ada kategori ditemukan.</p>
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
                  {editingCategory ? 'Edit Kategori' : 'Kategori Baru'}
                </div>
                <div className="modal-sub">Beri nama kategori untuk mengelompokkan produk</div>
              </div>
              <button className="modal-close" onClick={closeModal}>
                <X size={16} />
              </button>
            </div>

            <form onSubmit={handleSubmit}>
              <div className="field-group">
                <label className="field-label">Nama Kategori</label>
                <input
                  type="text"
                  className="field-input no-icon"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="misal: Elektronik, Pakaian"
                  autoFocus
                  required
                />
              </div>

              <div className="btn-row">
                <button type="button" className="btn-outline" onClick={closeModal}>Batal</button>
                <button type="submit" className="btn-primary">
                  {editingCategory ? 'Perbarui' : 'Simpan'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
};

export default Categories;