import React, { useState, useMemo, useCallback } from 'react';
import Papa from 'papaparse';
import { 
  ChevronUp, 
  ChevronDown, 
  Eye, 
  EyeOff, 
  Download, 
  Printer, 
  Trash2, 
  CheckSquare, 
  Square,
  Search,
  CheckCircle,
  Clock,
  AlertCircle,
  Grid,
  Star
} from 'lucide-react';
import { useDashboard, ACTIONS } from '../../context/DashboardContext';

// React.memo: prevent row re-renders unless specific row data/state changes (Requirement #57)
const InvoiceRow = React.memo(function InvoiceRow({
  project: p,
  isSelected,
  isFavorite,
  visibleColumns,
  onToggleRow,
  onToggleFavorite,
  getStatusBadge,
  getPriorityBadge,
  formatRupiah
}) {
  return (
    <tr 
      className={`hover:bg-neutral-50/50 dark:hover:bg-brand-active/20 transition-all select-text duration-200 ${
        isSelected ? 'bg-amber-50/20 dark:bg-brand-active/10' : ''
      }`}
    >
      {/* Checkbox column */}
      <td className="p-3 text-center no-print">
        <button
          onClick={() => onToggleRow(p.id)}
          className="text-gray-400 hover:text-brand-gold transition-colors focus:outline-none"
        >
          {isSelected ? (
            <CheckSquare size={16} className="text-brand-gold" />
          ) : (
            <Square size={16} />
          )}
        </button>
      </td>
      
      {/* Favorite column */}
      <td className="p-3 text-center no-print w-10">
        <button
          onClick={() => onToggleFavorite(p.id)}
          className={`transition-colors focus:outline-none ${
            isFavorite ? 'text-amber-400 hover:text-amber-500' : 'text-gray-300 hover:text-amber-400 dark:text-neutral-600'
          }`}
          title={isFavorite ? "Hapus dari Favorit" : "Tandai sebagai Favorit"}
        >
          <Star size={16} fill={isFavorite ? "currentColor" : "none"} />
        </button>
      </td>

      {visibleColumns.project && (
        <td className="p-3 font-semibold text-brand-dark dark:text-white max-w-[200px] truncate">
          {p.name}
        </td>
      )}
      {visibleColumns.client && (
        <td className="p-3 text-neutral-500 dark:text-neutral-400">
          {p.client}
        </td>
      )}
      {visibleColumns.revenue && (
        <td className="p-3 font-bold text-brand-gold dark:text-brand-gold">
          {formatRupiah(p.revenue)}
        </td>
      )}
      {visibleColumns.hours && (
        <td className="p-3 text-center text-neutral-500 dark:text-neutral-400">
          {p.hours} jam
        </td>
      )}
      {visibleColumns.status && (
        <td className="p-3 text-center">
          {getStatusBadge(p.status)}
        </td>
      )}
      {visibleColumns.priority && (
        <td className="p-3 text-center">
          {getPriorityBadge(p.priority)}
        </td>
      )}
      {visibleColumns.start && (
        <td className="p-3 text-xs text-neutral-400">
          {p.start_date}
        </td>
      )}
      {visibleColumns.end && (
        <td className="p-3 text-xs text-neutral-400">
          {p.end_date}
        </td>
      )}
    </tr>
  );
});

export default function InvoiceTable() {
  const { state, dispatch, fetchData } = useDashboard();
  const { projects, filters, visibleColumns, selectedRows, favorites = [], theme, user } = state;

  const isDark = theme === 'dark';
  const isAdmin = user?.role === 'admin';

  // Memoized event handlers to prevent row component re-renders (Requirement #58)
  const handleToggleRow = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_ROW, payload: id });
  }, [dispatch]);

  const handleToggleFavorite = useCallback((id) => {
    dispatch({ type: ACTIONS.TOGGLE_FAVORITE, payload: id });
  }, [dispatch]);

  // Local Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);

  // Column Visibility Dropdown State
  const [showVisibilityDropdown, setShowVisibilityDropdown] = useState(false);

  // Sorting State with memory
  const [sortConfig, setSortConfig] = useState({ key: 'start_date', direction: 'desc' });

  // Handle Column Header Clicks for Sorting
  const requestSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  // Render sorting arrow helper
  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <div className="flex flex-col ml-1 opacity-20"><ChevronUp size={10} /><ChevronDown size={10} /></div>;
    }
    return sortConfig.direction === 'asc' 
      ? <ChevronUp size={14} className="text-brand-gold ml-1 animate-pulse" />
      : <ChevronDown size={14} className="text-brand-gold ml-1 animate-pulse" />;
  };

  // Reset pagination on search/filters change
  React.useEffect(() => {
    setCurrentPage(1);
  }, [filters]);

  // Combine multiple filters and sorting via useMemo
  const filteredAndSortedProjects = useMemo(() => {
    let result = [...projects];

    // 1. Text Search Filter (Project Name or Client Name)
    if (filters.search) {
      const query = filters.search.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(query) ||
          p.client.toLowerCase().includes(query)
      );
    }

    // 2. Client select filter
    if (filters.client) {
      result = result.filter((p) => p.client === filters.client);
    }

    // 3. Status select filter
    if (filters.status) {
      result = result.filter((p) => p.status === filters.status);
    }

    // 4. Priority select filter
    if (filters.priority) {
      result = result.filter((p) => p.priority === filters.priority);
    }

    // 5. Apply sorting
    if (sortConfig.key) {
      result.sort((a, b) => {
        let aVal = a[sortConfig.key];
        let bVal = b[sortConfig.key];

        // Format checking for alphabetical comparison
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase();
          bVal = bVal.toLowerCase();
        }

        if (aVal < bVal) return sortConfig.direction === 'asc' ? -1 : 1;
        if (aVal > bVal) return sortConfig.direction === 'asc' ? 1 : -1;
        return 0;
      });
    }

    return result;
  }, [projects, filters, sortConfig]);

  // Paginated Slices
  const paginatedProjects = useMemo(() => {
    const start = (currentPage - 1) * itemsPerPage;
    return filteredAndSortedProjects.slice(start, start + itemsPerPage);
  }, [filteredAndSortedProjects, currentPage, itemsPerPage]);

  const totalPages = Math.ceil(filteredAndSortedProjects.length / itemsPerPage) || 1;

  // Formatting Rupiah Currency Helper
  const formatRupiah = (val) => {
    return new Intl.NumberFormat('id-ID', {
      style: 'currency',
      currency: 'IDR',
      maximumFractionDigits: 0
    }).format(val);
  };

  // Row selection logic
  const handleSelectAll = () => {
    const currentPageIds = paginatedProjects.map(p => p.id);
    const allSelectedOnPage = currentPageIds.every(id => selectedRows.includes(id));

    if (allSelectedOnPage) {
      // Unselect all on this page
      const nextSelected = selectedRows.filter(id => !currentPageIds.includes(id));
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: nextSelected });
    } else {
      // Select all on this page
      const nextSelected = [...new Set([...selectedRows, ...currentPageIds])];
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: nextSelected });
    }
  };

  const isRowSelected = (id) => selectedRows.includes(id);

  // Bulk Actions
  const handleBulkDelete = async () => {
    if (!isAdmin) return;
    if (window.confirm(`Apakah Anda yakin ingin menghapus ${selectedRows.length} invoice terpilih?`)) {
      if (state.activeBackendUrl) {
        try {
          await Promise.all(selectedRows.map(id => 
            fetch(`${state.activeBackendUrl}/api/delete_invoice.php`, {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ id }),
              credentials: 'include'
            })
          ));
          fetchData();
        } catch (error) {
          console.error(error);
        }
      } else {
        // Mock delete logic
        const remaining = projects.filter(p => !selectedRows.includes(p.id));
        dispatch({
          type: ACTIONS.SET_DATA,
          payload: {
            ...state,
            projects: remaining,
            invoices: remaining.map(p => ({
              id: p.id,
              project_name: p.name,
              client: p.client,
              amount: p.revenue,
              date: p.start_date,
              status: p.status === 'completed' ? 'paid' : p.status === 'on-hold' ? 'overdue' : 'pending'
            }))
          }
        });
      }
      dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: [] });
      dispatch({ 
        type: ACTIONS.ADD_NOTIFICATION, 
        payload: { message: `🗑️ ${selectedRows.length} Invoice berhasil dihapus (Bulk Action)` } 
      });
    }
  };

  const handleBulkStatusUpdate = async (status) => {
    if (!isAdmin) return;
    if (state.activeBackendUrl) {
      try {
        await Promise.all(selectedRows.map(id => {
          const proj = projects.find(p => p.id === id);
          return fetch(`${state.activeBackendUrl}/api/edit_invoice.php`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              ...proj,
              project_name: proj.name,
              amount: proj.revenue,
              date: proj.start_date,
              status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending'
            }),
            credentials: 'include'
          });
        }));
        fetchData();
      } catch (error) {
        console.error(error);
      }
    } else {
      // Mock update
      const updated = projects.map(p => 
        selectedRows.includes(p.id) ? { ...p, status: status } : p
      );
      dispatch({
        type: ACTIONS.SET_DATA,
        payload: {
          ...state,
          projects: updated,
          invoices: updated.map(p => ({
            id: p.id,
            project_name: p.name,
            client: p.client,
            amount: p.revenue,
            date: p.start_date,
            status: status === 'completed' ? 'paid' : status === 'on-hold' ? 'overdue' : 'pending'
          }))
        }
      });
    }
    dispatch({ type: ACTIONS.SET_SELECTED_ROWS, payload: [] });
    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `🔄 Status ${selectedRows.length} Invoice berhasil diubah ke: ${status.toUpperCase()}` } 
    });
  };

  // Exporters using PapaParse
  const handleExportCSV = () => {
    const exportData = filteredAndSortedProjects.map(p => ({
      'Project Name': p.name,
      'Client Name': p.client,
      'Revenue (IDR)': p.revenue,
      'Hours Spent': p.hours,
      'Project Status': p.status.toUpperCase(),
      'Priority Level': p.priority.toUpperCase(),
      'Start Date': p.start_date,
      'End Date': p.end_date
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `omset_tracker_export_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `📥 Berhasil mengunduh CSV (${filteredAndSortedProjects.length} baris)` } 
    });
  };

  const handleExportExcel = () => {
    // Generate standard XML spreadsheet format or formatted CSV representing Excel structure
    // PapaParse handles this beautifully, we append UTF-8 BOM to make sure it opens correctly in MS Excel with accents
    const exportData = filteredAndSortedProjects.map(p => ({
      'Project Name': p.name,
      'Client Name': p.client,
      'Revenue (IDR)': p.revenue,
      'Hours': p.hours,
      'Status': p.status,
      'Priority': p.priority,
      'Start Date': p.start_date,
      'End Date': p.end_date
    }));

    const csv = Papa.unparse(exportData);
    const blob = new Blob([new Uint8Array([0xEF, 0xBB, 0xBF]), csv], { type: 'application/vnd.ms-excel;charset=utf-8;' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.setAttribute('download', `omset_tracker_export_${new Date().toISOString().slice(0, 10)}.xls`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    dispatch({ 
      type: ACTIONS.ADD_NOTIFICATION, 
      payload: { message: `📊 Berhasil mengunduh Excel Spreadsheet` } 
    });
  };

  // Window Printer
  const handlePrint = () => {
    window.print();
  };

  // Status badges helper
  const getStatusBadge = (status) => {
    switch (status) {
      case 'completed':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-emerald-50 text-emerald-700 dark:bg-emerald-950/30 dark:text-emerald-400">
            <CheckCircle size={10} className="mr-1" /> Selesai
          </span>
        );
      case 'on-hold':
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-red-50 text-red-700 dark:bg-red-950/30 dark:text-red-400">
            <AlertCircle size={10} className="mr-1" /> Ditangguhkan
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-amber-50 text-amber-700 dark:bg-amber-950/30 dark:text-amber-400">
            <Clock size={10} className="mr-1" /> Pending
          </span>
        );
    }
  };

  // Priority badges helper
  const getPriorityBadge = (priority) => {
    switch (priority) {
      case 'high':
        return <span className="text-red-500 font-semibold text-xs border border-red-200 dark:border-red-900/50 bg-red-50/20 px-2 py-0.5 rounded">High</span>;
      case 'low':
        return <span className="text-gray-400 text-xs border border-gray-200 dark:border-neutral-800 bg-gray-50/10 px-2 py-0.5 rounded">Low</span>;
      default:
        return <span className="text-amber-500 font-medium text-xs border border-amber-200 dark:border-amber-900/50 bg-amber-50/20 px-2 py-0.5 rounded">Medium</span>;
    }
  };

  return (
    <div className="w-full">
      {/* Table Action Controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between mb-4 gap-3 no-print">
        
        {/* Bulk action buttons when rows are selected */}
        {selectedRows.length > 0 ? (
          <div className="flex items-center gap-2 bg-amber-50/50 dark:bg-brand-active border border-brand-gold/30 rounded-lg p-1 px-3">
            <span className="text-xs font-medium text-brand-dark dark:text-gray-300">
              {selectedRows.length} Terpilih:
            </span>
            {isAdmin ? (
              <>
                <button
                  onClick={() => handleBulkStatusUpdate('completed')}
                  className="px-2 py-1 bg-emerald-600 hover:bg-emerald-700 text-white rounded text-xs flex items-center gap-1 transition-all"
                >
                  Set Selesai
                </button>
                <button
                  onClick={() => handleBulkStatusUpdate('pending')}
                  className="px-2 py-1 bg-amber-600 hover:bg-amber-700 text-white rounded text-xs flex items-center gap-1 transition-all"
                >
                  Set Pending
                </button>
                <button
                  onClick={handleBulkDelete}
                  className="px-2 py-1 bg-red-600 hover:bg-red-700 text-white rounded text-xs flex items-center gap-1 transition-all"
                >
                  <Trash2 size={12} /> Hapus
                </button>
              </>
            ) : (
              <span className="text-[10px] text-gray-400">Hanya Admin yang dapat mengubah/menghapus</span>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-lg font-bold text-brand-dark dark:text-white">Daftar Invoice</h3>
            <span className="px-2 py-0.5 rounded-full text-xs font-medium bg-neutral-100 text-neutral-600 dark:bg-brand-active dark:text-neutral-300">
              {filteredAndSortedProjects.length} Item
            </span>
          </div>
        )}

        {/* Global Toolbar and Exporters */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Column visibility controller */}
          <div className="relative">
            <button
              onClick={() => setShowVisibilityDropdown(!showVisibilityDropdown)}
              className="px-3 py-1.5 border border-neutral-200 dark:border-brand-active rounded-lg text-xs font-medium flex items-center gap-1 bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 transition-all hover:bg-neutral-50 dark:hover:bg-brand-active"
            >
              <Grid size={13} />
              Kolom
            </button>
            
            {showVisibilityDropdown && (
              <div className="absolute right-0 mt-1.5 w-44 rounded-xl shadow-lg border border-neutral-100 dark:border-brand-active bg-white dark:bg-brand-sidebar p-2 z-30 transition-all">
                <p className="text-[10px] uppercase font-bold text-gray-400 p-1 px-2 border-b border-neutral-100 dark:border-neutral-800 mb-1">
                  Visibilitas Kolom
                </p>
                {Object.keys(visibleColumns).map((col) => (
                  <button
                    key={col}
                    onClick={() => dispatch({ type: ACTIONS.TOGGLE_COLUMN, payload: col })}
                    className="flex items-center w-full px-2 py-1 text-xs text-brand-dark dark:text-gray-300 hover:bg-neutral-50 dark:hover:bg-brand-active rounded-md text-left capitalize gap-2"
                  >
                    {visibleColumns[col] ? (
                      <Eye size={12} className="text-brand-gold" />
                    ) : (
                      <EyeOff size={12} className="text-gray-400" />
                    )}
                    {col === 'start' ? 'Start Date' : col === 'end' ? 'End Date' : col}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            onClick={handleExportCSV}
            className="px-3 py-1.5 bg-brand-teal hover:bg-brand-tealHover text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
          >
            <Download size={13} />
            CSV
          </button>
          
          <button
            onClick={handleExportExcel}
            className="px-3 py-1.5 bg-brand-blue hover:bg-brand-blueHover text-white rounded-lg text-xs font-medium flex items-center gap-1 transition-all shadow-sm"
          >
            <Download size={13} />
            Excel
          </button>

          <button
            onClick={handlePrint}
            className="px-3 py-1.5 border border-neutral-200 dark:border-brand-active rounded-lg text-xs font-medium flex items-center gap-1 bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 transition-all hover:bg-neutral-50 dark:hover:bg-brand-active"
          >
            <Printer size={13} />
            Cetak
          </button>
        </div>
      </div>

      {/* Main Responsive Grid Table */}
      <div className="overflow-x-auto rounded-xl border border-neutral-100 dark:border-brand-active shadow-premium bg-white dark:bg-brand-dark print-card">
        <table className="w-full text-left border-collapse min-w-[800px]">
          <thead>
            <tr className="bg-neutral-50/50 dark:bg-brand-sidebar/50 border-b border-neutral-100 dark:border-brand-active text-neutral-400 dark:text-neutral-500 font-bold uppercase text-[10px] tracking-wider select-none">
              <th className="p-3 w-10 text-center no-print">
                <button
                  onClick={handleSelectAll}
                  className="text-gray-400 hover:text-brand-gold transition-colors focus:outline-none"
                >
                  {paginatedProjects.length > 0 && paginatedProjects.every(p => selectedRows.includes(p.id)) ? (
                    <CheckSquare size={16} className="text-brand-gold" />
                  ) : (
                    <Square size={16} />
                  )}
                </button>
              </th>
              <th className="p-3 w-10 text-center no-print">
                <Star size={14} className="text-gray-400 mx-auto" />
              </th>
              {visibleColumns.project && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white" onClick={() => requestSort('name')}>
                  <div className="flex items-center">PROYEK {getSortIcon('name')}</div>
                </th>
              )}
              {visibleColumns.client && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white" onClick={() => requestSort('client')}>
                  <div className="flex items-center">KLIEN {getSortIcon('client')}</div>
                </th>
              )}
              {visibleColumns.revenue && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white" onClick={() => requestSort('revenue')}>
                  <div className="flex items-center">OMSET / NILAI {getSortIcon('revenue')}</div>
                </th>
              )}
              {visibleColumns.hours && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white text-center" onClick={() => requestSort('hours')}>
                  <div className="flex items-center justify-center">JAM {getSortIcon('hours')}</div>
                </th>
              )}
              {visibleColumns.status && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white text-center" onClick={() => requestSort('status')}>
                  <div className="flex items-center justify-center">STATUS {getSortIcon('status')}</div>
                </th>
              )}
              {visibleColumns.priority && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white text-center" onClick={() => requestSort('priority')}>
                  <div className="flex items-center justify-center">PRIORITAS {getSortIcon('priority')}</div>
                </th>
              )}
              {visibleColumns.start && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white" onClick={() => requestSort('start_date')}>
                  <div className="flex items-center">START {getSortIcon('start_date')}</div>
                </th>
              )}
              {visibleColumns.end && (
                <th className="p-3 cursor-pointer hover:text-brand-dark dark:hover:text-white" onClick={() => requestSort('end_date')}>
                  <div className="flex items-center">DEADLINE {getSortIcon('end_date')}</div>
                </th>
              )}
            </tr>
          </thead>
          <tbody className="divide-y divide-neutral-100 dark:divide-neutral-800/50 text-sm font-medium text-brand-dark dark:text-gray-300">
            {paginatedProjects.length > 0 ? (
              paginatedProjects.map((p) => (
                <InvoiceRow
                  key={p.id}
                  project={p}
                  isSelected={isRowSelected(p.id)}
                  isFavorite={favorites.includes(p.id)}
                  visibleColumns={visibleColumns}
                  onToggleRow={handleToggleRow}
                  onToggleFavorite={handleToggleFavorite}
                  getStatusBadge={getStatusBadge}
                  getPriorityBadge={getPriorityBadge}
                  formatRupiah={formatRupiah}
                />
              ))
            ) : (
              <tr>
                <td colSpan={11} className="p-8 text-center text-gray-400">
                  Tidak ada invoice yang ditemukan.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Pagination Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between mt-4 gap-3 no-print">
        <div className="flex items-center gap-2">
          <span className="text-xs text-neutral-500">Tampilkan</span>
          <select
            value={itemsPerPage}
            onChange={(e) => {
              setItemsPerPage(Number(e.target.value));
              setCurrentPage(1);
            }}
            className="px-2.5 py-1 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 rounded-lg text-xs font-medium focus:ring-1 focus:ring-brand-gold"
          >
            <option value={10}>10 per Halaman</option>
            <option value={25}>25 per Halaman</option>
            <option value={50}>50 per Halaman</option>
          </select>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
            disabled={currentPage === 1}
            className="px-3 py-1.5 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-brand-active transition-all"
          >
            Kembali
          </button>
          <span className="text-xs text-neutral-500 font-medium">
            Halaman {currentPage} dari {totalPages}
          </span>
          <button
            onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
            disabled={currentPage === totalPages}
            className="px-3 py-1.5 border border-neutral-200 dark:border-brand-active bg-white dark:bg-brand-dark text-brand-dark dark:text-gray-300 rounded-lg text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed hover:bg-neutral-50 dark:hover:bg-brand-active transition-all"
          >
            Lanjut
          </button>
        </div>
      </div>
    </div>
  );
}
