// Shared theme CSS — import this in every page component
export const THEME_STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@600;700;800&family=Outfit:wght@300;400;500;600;700&display=swap');

  :root {
    --sidebar-w: 268px;
    --radius: 16px;

    --bg:        #f0f2f7;
    --sidebar:   #ffffff;
    --card:      #ffffff;
    --surface:   #f7f8fc;
    --border:    #e8eaf2;
    --text:      #111827;
    --subtext:   #6b7280;
    --accent:    #4f46e5;
    --accent2:   #06b6d4;
    --active-bg: #eef0ff;
    --active-tx: #4f46e5;
    --hover-bg:  #f3f4f8;
    --shadow:    0 8px 32px rgba(79,70,229,0.08);
    --shadow-card: 0 2px 16px rgba(79,70,229,0.07);
  }

  [data-theme="dark"] {
    --bg:        #0d0f17;
    --sidebar:   #13151f;
    --card:      #13151f;
    --surface:   #1a1d2e;
    --border:    #252840;
    --text:      #f1f3ff;
    --subtext:   #6b7280;
    --accent:    #6366f1;
    --accent2:   #22d3ee;
    --active-bg: rgba(99,102,241,0.15);
    --active-tx: #818cf8;
    --hover-bg:  rgba(255,255,255,0.04);
    --shadow:    0 8px 32px rgba(0,0,0,0.4);
    --shadow-card: 0 2px 16px rgba(0,0,0,0.3);
  }

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  body {
    font-family: 'Outfit', sans-serif;
    background: var(--bg);
    color: var(--text);
    min-height: 100vh;
  }

  /* ── Auth pages ── */
  .auth-shell {
    min-height: 100vh;
    display: flex;
    align-items: center;
    justify-content: center;
    background: var(--bg);
    padding: 24px;
    position: relative;
    overflow: hidden;
  }
  .auth-shell::before {
    content: '';
    position: absolute;
    width: 600px; height: 600px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(79,70,229,0.08) 0%, transparent 70%);
    top: -200px; right: -100px;
    pointer-events: none;
  }
  .auth-shell::after {
    content: '';
    position: absolute;
    width: 400px; height: 400px;
    border-radius: 50%;
    background: radial-gradient(circle, rgba(6,182,212,0.06) 0%, transparent 70%);
    bottom: -100px; left: -50px;
    pointer-events: none;
  }
  .auth-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 44px 40px;
    width: 100%;
    max-width: 420px;
    box-shadow: var(--shadow);
    position: relative;
    z-index: 1;
    animation: fadeUp 0.4s cubic-bezier(0.22,1,0.36,1) both;
  }
  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  /* Auth brand */
  .auth-brand {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 36px;
  }
  .auth-icon-wrap {
    width: 60px; height: 60px;
    border-radius: 18px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    margin-bottom: 16px;
    box-shadow: 0 8px 24px rgba(79,70,229,0.3);
  }
  .auth-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.3px;
    color: var(--text);
    margin-bottom: 4px;
    text-align: center;
  }
  .auth-sub {
    font-size: 13.5px;
    color: var(--subtext);
    text-align: center;
  }

  /* Error alert */
  .alert-error {
    display: flex;
    align-items: center;
    gap: 10px;
    background: rgba(239,68,68,0.08);
    border: 1px solid rgba(239,68,68,0.25);
    color: #ef4444;
    padding: 11px 14px;
    border-radius: 12px;
    font-size: 13px;
    font-weight: 500;
    margin-bottom: 20px;
  }
  .alert-dot {
    width: 6px; height: 6px;
    border-radius: 50%;
    background: #ef4444;
    flex-shrink: 0;
  }

  /* Form fields */
  .field-group {
    margin-bottom: 16px;
  }
  .field-label {
    display: block;
    font-size: 12.5px;
    font-weight: 600;
    letter-spacing: 0.04em;
    color: var(--subtext);
    text-transform: uppercase;
    margin-bottom: 7px;
  }
  .field-wrap {
    position: relative;
  }
  .field-icon {
    position: absolute;
    left: 13px;
    top: 50%;
    transform: translateY(-50%);
    color: var(--subtext);
    display: flex;
    pointer-events: none;
  }
  .field-input {
    width: 100%;
    background: var(--surface);
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 11px 14px 11px 40px;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    color: var(--text);
    outline: none;
    transition: border-color 0.2s, box-shadow 0.2s, background 0.2s;
  }
  .field-input::placeholder { color: var(--subtext); opacity: 0.6; }
  .field-input:focus {
    border-color: var(--accent);
    box-shadow: 0 0 0 3px rgba(79,70,229,0.1);
    background: var(--card);
  }
  .field-input.no-icon {
    padding-left: 14px;
  }
  select.field-input {
    cursor: pointer;
    appearance: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='12' viewBox='0 0 24 24' fill='none' stroke='%236b7280' stroke-width='2.5'%3E%3Cpolyline points='6 9 12 15 18 9'/%3E%3C/svg%3E");
    background-repeat: no-repeat;
    background-position: right 14px center;
  }

  /* Buttons */
  .btn-primary {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 12px 20px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, var(--accent) 0%, var(--accent2) 100%);
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 700;
    letter-spacing: 0.04em;
    cursor: pointer;
    transition: opacity 0.2s, transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 16px rgba(79,70,229,0.3);
    position: relative;
    overflow: hidden;
  }
  .btn-primary::after {
    content: '';
    position: absolute;
    inset: 0;
    background: linear-gradient(135deg, rgba(255,255,255,0.15), transparent);
    opacity: 0;
    transition: opacity 0.2s;
  }
  .btn-primary:hover::after { opacity: 1; }
  .btn-primary:hover {
    transform: translateY(-1px);
    box-shadow: 0 8px 24px rgba(79,70,229,0.4);
  }
  .btn-primary:active { transform: scale(0.98); }
  .btn-primary:disabled { opacity: 0.6; cursor: not-allowed; transform: none; }

  .btn-outline {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    width: 100%;
    padding: 11px 20px;
    border-radius: 12px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--subtext);
    font-family: 'Outfit', sans-serif;
    font-size: 14px;
    font-weight: 600;
    cursor: pointer;
    transition: background 0.2s, color 0.2s, border-color 0.2s;
  }
  .btn-outline:hover {
    background: var(--hover-bg);
    color: var(--text);
    border-color: var(--text);
  }

  .btn-icon {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px;
    border-radius: 9px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--subtext);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }
  .btn-icon:hover { background: var(--hover-bg); color: var(--text); }

  /* Auth footer link */
  .auth-footer {
    margin-top: 28px;
    text-align: center;
    font-size: 13px;
    color: var(--subtext);
  }
  .auth-link {
    color: var(--accent);
    font-weight: 600;
    text-decoration: none;
  }
  .auth-link:hover { text-decoration: underline; }

  /* ── Page content (inside Layout) ── */
  .page-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 16px;
    margin-bottom: 28px;
  }
  .page-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 22px;
    letter-spacing: -0.3px;
    color: var(--text);
    display: flex;
    align-items: center;
    gap: 10px;
    margin-bottom: 3px;
  }
  .page-title-icon {
    width: 36px; height: 36px;
    border-radius: 10px;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    display: flex; align-items: center; justify-content: center;
    flex-shrink: 0;
    box-shadow: 0 4px 12px rgba(79,70,229,0.25);
  }
  .page-sub {
    font-size: 13px;
    color: var(--subtext);
    margin-left: 46px;
  }

  /* Add button on pages */
  .btn-add {
    display: flex;
    align-items: center;
    gap: 7px;
    padding: 10px 18px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, var(--accent), var(--accent2));
    color: white;
    font-family: 'Outfit', sans-serif;
    font-size: 13.5px;
    font-weight: 700;
    cursor: pointer;
    transition: transform 0.2s, box-shadow 0.2s;
    box-shadow: 0 4px 14px rgba(79,70,229,0.3);
    white-space: nowrap;
  }
  .btn-add:hover {
    transform: translateY(-1px);
    box-shadow: 0 6px 20px rgba(79,70,229,0.4);
  }
  .btn-add:active { transform: scale(0.97); }

  /* ── Data card / table ── */
  .data-card {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 20px;
    overflow: hidden;
    box-shadow: var(--shadow-card);
    animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) both;
    animation-delay: 0.05s;
  }

  table { width: 100%; border-collapse: collapse; }
  thead tr {
    border-bottom: 1px solid var(--border);
  }
  thead th {
    padding: 14px 20px;
    font-size: 11px;
    font-weight: 600;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--subtext);
    text-align: left;
    background: var(--surface);
  }
  thead th:last-child { text-align: right; }
  tbody tr {
    border-bottom: 1px solid var(--border);
    transition: background 0.15s;
  }
  tbody tr:last-child { border-bottom: none; }
  tbody tr:hover { background: var(--hover-bg); }
  td { padding: 15px 20px; font-size: 13.5px; vertical-align: middle; }

  .td-id {
    font-family: 'Outfit', monospace;
    font-size: 12px;
    color: var(--subtext);
    background: var(--surface);
    padding: 3px 8px;
    border-radius: 6px;
    border: 1px solid var(--border);
    display: inline-block;
  }
  .td-name { font-weight: 600; color: var(--text); }
  .td-sku { font-size: 11.5px; color: var(--subtext); margin-top: 2px; }

  .badge {
    display: inline-flex;
    align-items: center;
    gap: 5px;
    padding: 4px 10px;
    border-radius: 8px;
    font-size: 12px;
    font-weight: 600;
    background: rgba(79,70,229,0.1);
    color: var(--accent);
    border: 1px solid rgba(79,70,229,0.15);
  }

  .stock-ok   { color: #10b981; font-weight: 600; }
  .stock-low  { color: #ef4444; font-weight: 700; }
  .dot        { width: 7px; height: 7px; border-radius: 50%; display: inline-block; margin-right: 5px; }
  .dot-ok     { background: #10b981; }
  .dot-low    { background: #ef4444; }
  .price-text { font-weight: 700; color: var(--accent); font-size: 13.5px; }

  /* action buttons inside table */
  .action-wrap { display: flex; justify-content: flex-end; gap: 6px; }
  .act-edit {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 9px;
    border: 1.5px solid rgba(99,102,241,0.2);
    background: rgba(99,102,241,0.06);
    color: var(--accent);
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .act-edit:hover { background: rgba(99,102,241,0.15); border-color: var(--accent); transform: scale(1.08); }
  .act-del {
    display: flex; align-items: center; justify-content: center;
    width: 32px; height: 32px; border-radius: 9px;
    border: 1.5px solid rgba(239,68,68,0.2);
    background: rgba(239,68,68,0.06);
    color: #ef4444;
    cursor: pointer;
    transition: background 0.2s, border-color 0.2s, transform 0.2s;
  }
  .act-del:hover { background: rgba(239,68,68,0.15); border-color: #ef4444; transform: scale(1.08); }

  /* Loading / empty states */
  .state-loading {
    display: flex; align-items: center; justify-content: center;
    gap: 10px;
    padding: 56px;
    color: var(--subtext);
    font-size: 14px;
  }
  .spinner {
    width: 20px; height: 20px;
    border: 2px solid var(--border);
    border-top-color: var(--accent);
    border-radius: 50%;
    animation: spin 0.7s linear infinite;
  }
  @keyframes spin { to { transform: rotate(360deg); } }
  .state-empty {
    display: flex; flex-direction: column; align-items: center; justify-content: center;
    gap: 12px;
    padding: 64px 24px;
    color: var(--subtext);
  }
  .state-empty-icon {
    width: 56px; height: 56px;
    border-radius: 16px;
    background: var(--surface);
    border: 1.5px dashed var(--border);
    display: flex; align-items: center; justify-content: center;
    color: var(--border);
  }
  .state-empty p { font-size: 13.5px; }

  /* ── Modal ── */
  .modal-backdrop {
    position: fixed; inset: 0;
    background: rgba(0,0,0,0.4);
    backdrop-filter: blur(4px);
    z-index: 200;
    display: flex; align-items: center; justify-content: center;
    padding: 24px;
    animation: fadeIn 0.2s ease;
  }
  @keyframes fadeIn { from { opacity: 0; } to { opacity: 1; } }
  .modal-box {
    background: var(--card);
    border: 1px solid var(--border);
    border-radius: 24px;
    padding: 32px;
    width: 100%; max-width: 460px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.2);
    animation: fadeUp 0.3s cubic-bezier(0.22,1,0.36,1) both;
  }
  .modal-head {
    display: flex;
    align-items: flex-start;
    justify-content: space-between;
    margin-bottom: 28px;
  }
  .modal-title {
    font-family: 'Syne', sans-serif;
    font-weight: 800;
    font-size: 19px;
    color: var(--text);
    margin-bottom: 3px;
  }
  .modal-sub { font-size: 13px; color: var(--subtext); }
  .modal-close {
    display: flex; align-items: center; justify-content: center;
    width: 34px; height: 34px;
    border-radius: 10px;
    border: 1.5px solid var(--border);
    background: transparent;
    color: var(--subtext);
    cursor: pointer;
    transition: background 0.2s, color 0.2s;
    flex-shrink: 0;
  }
  .modal-close:hover { background: var(--hover-bg); color: var(--text); }

  .form-row {
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 14px;
  }
  .btn-row {
    display: flex;
    gap: 10px;
    margin-top: 28px;
  }
  .btn-row > * { flex: 1; }

  /* Divider */
  .divider { height: 1px; background: var(--border); margin: 20px 0; }
`;