import React, { useState } from 'react';

const CATEGORY_ICONS = {
  Invoice: '🧾',
  Legal: '⚖️',
  Proposal: '📝',
  Timesheet: '⏱️',
  default: '📄'
};

const Library = ({ userRole }) => {
  const [templates] = useState([
    { id: 1, name: 'Template Invoice Freelance', category: 'Invoice', downloads: 45 },
    { id: 2, name: 'Contract Agreement', category: 'Legal', downloads: 32 },
    { id: 3, name: 'Project Proposal Template', category: 'Proposal', downloads: 28 },
    { id: 4, name: 'Timesheet Template', category: 'Timesheet', downloads: 19 },
    { id: 5, name: 'NDA Template', category: 'Legal', downloads: 24 },
  ]);

  const [newTemplate, setNewTemplate] = useState({ name: '', category: '' });

  const handleAddTemplate = () => {
    if (userRole !== 'admin') {
      alert('Hanya admin yang dapat menambahkan template');
      return;
    }
    alert('Template berhasil ditambahkan!');
    setNewTemplate({ name: '', category: '' });
  };

  return (
    <>
      <div className="page-header">
        <h2>Library & Templates</h2>
        <p>Unduh template siap pakai untuk kebutuhan freelance kamu</p>
      </div>

      {userRole === 'admin' && (
        <div className="settings-card" style={{ marginBottom: '1.5rem' }}>
          <h3>Tambah Template Baru</h3>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap', alignItems: 'flex-end' }}>
            <div className="form-group" style={{ flex: 1, minWidth: 180 }}>
              <label>Nama Template</label>
              <input
                type="text"
                placeholder="Nama template..."
                value={newTemplate.name}
                onChange={(e) => setNewTemplate({ ...newTemplate, name: e.target.value })}
              />
            </div>
            <div className="form-group" style={{ flex: 1, minWidth: 140 }}>
              <label>Kategori</label>
              <input
                type="text"
                placeholder="Kategori..."
                value={newTemplate.category}
                onChange={(e) => setNewTemplate({ ...newTemplate, category: e.target.value })}
              />
            </div>
            <button onClick={handleAddTemplate} className="btn btn-primary" style={{ marginBottom: '0.4rem' }}>
              + Tambah
            </button>
          </div>
        </div>
      )}

      <div className="template-grid">
        {templates.map(template => (
          <div key={template.id} className="template-card">
            <div className="template-icon">
              {CATEGORY_ICONS[template.category] || CATEGORY_ICONS.default}
            </div>
            <h3>{template.name}</h3>
            <div className="template-meta">
              <span className="cat-badge">{template.category}</span>
              <span className="dl-count">↓ {template.downloads}</span>
            </div>
            <button className="btn btn-primary" style={{ width: '100%', justifyContent: 'center' }}>
              Download
            </button>
          </div>
        ))}
      </div>
    </>
  );
};

export default Library;