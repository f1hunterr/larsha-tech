interface Lead {
  id: number; name: string; phone: string; service: string; message: string; created_at: string;
}
interface Booking {
  id: number; device_type: string; brand: string; model: string; device_age: string;
  issue: string; description: string; urgency: string; service_mode: string; address: string;
  preferred_date: string; preferred_slot: string; name: string; phone: string; email: string;
  status: string; created_at: string;
}
interface Application {
  id: number; name: string; email: string; phone: string; position: string;
  experience: string; message: string; resume_original_name: string | null;
  status: string; created_at: string;
}
interface Diagnosis {
  id: number; name: string; phone: string; email: string; device_type: string;
  brand: string; model: string; powers_on: string; display_status: string;
  sounds: string; error_messages: string; problem_start: string;
  description: string; tried: string; status: string; created_at: string;
}

export function adminHtml(leads: Lead[], bookings: Booking[], applications: Application[], diagnoses: Diagnosis[] = []): string {
  const now = Date.now();
  const leadsToday = leads.filter(l => new Date(l.created_at) > new Date(now - 86400000)).length;
  const bNew       = bookings.filter(b => b.status === 'new').length;
  const aNew       = applications.filter(a => a.status === 'new').length;
  const dPending   = diagnoses.filter(d => d.status === 'pending').length;

  const BOOKING_STATUSES  = ['new','confirmed','in-progress','done','cancelled'];
  const APP_STATUSES      = ['new','reviewing','shortlisted','rejected','hired'];
  const DIAG_STATUSES     = ['pending','reviewed','contacted','resolved'];

  const STATUS_COLORS: Record<string, string> = {
    new: '#1e3a5f:#60a5fa', confirmed: '#14532d:#4ade80', 'in-progress': '#422006:#fb923c',
    done: '#1c1917:#78716c', cancelled: '#450a0a:#f87171',
    reviewing: '#312e81:#a5b4fc', shortlisted: '#14532d:#4ade80',
    rejected: '#450a0a:#f87171', hired: '#064e3b:#34d399',
    pending: '#4a1d4a:#f472b6', reviewed: '#1e3a5f:#60a5fa',
    contacted: '#422006:#fb923c', resolved: '#064e3b:#34d399',
  };
  function statusBg(s: string) { return (STATUS_COLORS[s] ?? '#1e293b:#94a3b8').split(':')[0]; }
  function statusFg(s: string) { return (STATUS_COLORS[s] ?? '#1e293b:#94a3b8').split(':')[1]; }

  function statusSelect(id: number, current: string, statuses: string[], endpoint: string) {
    const opts = statuses.map(s =>
      `<option value="${s}"${s === current ? ' selected' : ''}>${s}</option>`
    ).join('');
    return `<select class="status-select" onchange="updateStatus('${endpoint}',${id},this)">${opts}</select>`;
  }

  function fmtDate(d: string) {
    return new Date(d).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day:'2-digit', month:'short', year:'numeric', hour:'2-digit', minute:'2-digit' });
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Larsha Technologies Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,-apple-system,sans-serif;background:#0a0f1e;color:#e2e8f0;min-height:100vh}

    /* Header */
    header{background:#111827;border-bottom:1px solid #1f2937;padding:1rem 2rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap;position:sticky;top:0;z-index:50}
    .logo{font-size:1.25rem;font-weight:800;letter-spacing:-.02em}
    .logo span{color:#3b82f6}
    .badge{background:#1e3a5f;color:#60a5fa;font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:999px}
    .header-right{margin-left:auto;display:flex;align-items:center;gap:1rem;flex-wrap:wrap}
    .last-updated{color:#475569;font-size:.75rem}
    .refresh-btn{background:#1e293b;border:1px solid #334155;color:#94a3b8;padding:.4rem .85rem;border-radius:8px;cursor:pointer;font-size:.78rem;display:flex;align-items:center;gap:.4rem;transition:all .15s}
    .refresh-btn:hover{background:#334155;color:#e2e8f0}

    /* Stats */
    main{padding:1.5rem 2rem;max-width:1440px;margin:0 auto}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:2rem}
    .stat{background:#111827;border:1px solid #1f2937;border-radius:14px;padding:1.25rem 1rem;text-align:center;transition:border-color .2s}
    .stat:hover{border-color:#3b82f6}
    .sv{font-size:2.2rem;font-weight:800;color:#3b82f6;line-height:1}
    .sl{font-size:.72rem;color:#6b7280;margin-top:.4rem;text-transform:uppercase;letter-spacing:.04em}
    .sv.green{color:#4ade80}.sv.purple{color:#a5b4fc}.sv.pink{color:#f472b6}.sv.orange{color:#fb923c}

    /* Toolbar */
    .toolbar{display:flex;align-items:center;gap:.75rem;margin-bottom:1rem;flex-wrap:wrap}
    .search-wrap{position:relative;flex:1;min-width:200px;max-width:360px}
    .search-wrap svg{position:absolute;left:.75rem;top:50%;transform:translateY(-50%);color:#475569;pointer-events:none}
    .search-input{width:100%;background:#111827;border:1px solid #1f2937;color:#e2e8f0;padding:.5rem .75rem .5rem 2.25rem;border-radius:9px;font-size:.85rem;outline:none;transition:border-color .15s}
    .search-input:focus{border-color:#3b82f6}
    .search-input::placeholder{color:#475569}
    .filter-select{background:#111827;border:1px solid #1f2937;color:#94a3b8;padding:.5rem .75rem;border-radius:9px;font-size:.82rem;outline:none;cursor:pointer}
    .export-btn{background:#14532d;color:#4ade80;border:none;padding:.5rem 1rem;border-radius:9px;cursor:pointer;font-size:.8rem;font-weight:600;margin-left:auto;transition:all .15s;white-space:nowrap}
    .export-btn:hover{background:#166534}
    .row-count{font-size:.78rem;color:#475569;white-space:nowrap}

    /* Tabs */
    .tabs{display:flex;gap:0;border-bottom:1px solid #1f2937;margin-bottom:1.5rem;overflow-x:auto}
    .tab{padding:.7rem 1.5rem;cursor:pointer;font-size:.85rem;font-weight:600;color:#6b7280;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s;white-space:nowrap;display:flex;align-items:center;gap:.5rem}
    .tab.active{color:#60a5fa;border-bottom-color:#3b82f6}
    .tab:hover:not(.active){color:#e2e8f0}
    .tab-count{background:#1f2937;color:#94a3b8;font-size:.65rem;font-weight:700;padding:.1rem .45rem;border-radius:999px;min-width:1.4rem;text-align:center}
    .tab.active .tab-count{background:#1e3a5f;color:#60a5fa}
    .tab-panel{display:none}.tab-panel.active{display:block}

    /* Table */
    .table-wrap{overflow-x:auto;border-radius:14px;border:1px solid #1f2937}
    table{width:100%;border-collapse:collapse;background:#111827}
    th{text-align:left;padding:.65rem 1rem;background:#0a0f1e;color:#6b7280;font-size:.68rem;text-transform:uppercase;letter-spacing:.06em;white-space:nowrap}
    td{padding:.8rem 1rem;border-top:1px solid #1a2234;font-size:.84rem;vertical-align:top}
    tr:hover td{background:#0d1526}
    .empty{text-align:center;padding:5rem 2rem;color:#374151}
    .empty-icon{font-size:2.5rem;margin-bottom:.75rem;opacity:.4}

    /* Cells */
    .ph a{color:#34d399;text-decoration:none;font-weight:500}
    .ph a:hover{text-decoration:underline}
    .call-btn{display:inline-flex;align-items:center;gap:.3rem;background:#064e3b;color:#34d399;border:none;padding:.25rem .6rem;border-radius:6px;cursor:pointer;font-size:.75rem;text-decoration:none;margin-top:.3rem}
    .call-btn:hover{background:#065f46}
    .badge-sm{font-size:.65rem;font-weight:700;padding:.18rem .55rem;border-radius:999px;white-space:nowrap;display:inline-block}
    .msg{max-width:240px;color:#9ca3af;white-space:pre-wrap;word-break:break-word;font-size:.8rem;line-height:1.5}
    .dt{color:#4b5563;font-size:.73rem;white-space:nowrap}
    .id-cell{color:#374151;font-size:.78rem;font-weight:600}

    /* Status select */
    select.status-select{background:#0a0f1e;border:1px solid #1f2937;color:#e2e8f0;padding:.3rem .5rem;border-radius:8px;font-size:.76rem;cursor:pointer;outline:none;transition:border-color .15s}
    select.status-select:hover,select.status-select:focus{border-color:#3b82f6}

    /* Download button */
    .dl-btn{background:#1e3a5f;color:#60a5fa;border:none;padding:.3rem .7rem;border-radius:7px;cursor:pointer;font-size:.76rem;text-decoration:none;display:inline-block;transition:all .15s}
    .dl-btn:hover{background:#1d4ed8;color:#fff}

    /* Toast */
    #toast{position:fixed;bottom:1.5rem;right:1.5rem;background:#111827;border:1px solid #1f2937;color:#e2e8f0;padding:.75rem 1.25rem;border-radius:12px;font-size:.85rem;opacity:0;transform:translateY(.5rem);transition:all .25s;z-index:999;pointer-events:none;max-width:320px;display:flex;align-items:center;gap:.6rem}
    #toast.show{opacity:1;transform:translateY(0)}
    #toast.success{border-color:#14532d;color:#4ade80}
    #toast.error{border-color:#7f1d1d;color:#f87171}

    /* Responsive */
    @media(max-width:640px){
      main{padding:1rem}header{padding:.75rem 1rem}
      th,td{padding:.5rem .6rem;font-size:.76rem}
      .toolbar{gap:.5rem}.export-btn{padding:.45rem .75rem}
    }
  </style>
</head>
<body>
  <header>
    <div class="logo">Larsha <span>Tech</span></div>
    <span class="badge">Admin</span>
    <div class="header-right">
      <span class="last-updated" id="lastUpdated">Loaded at ${new Date().toLocaleTimeString('en-IN',{timeZone:'Asia/Kolkata'})}</span>
      <button class="refresh-btn" onclick="location.reload()">
        <svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8"/><path d="M21 3v5h-5"/><path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16"/><path d="M8 16H3v5"/></svg>
        Refresh
      </button>
    </div>
  </header>

  <main>
    <!-- Stats -->
    <div class="stats">
      <div class="stat"><div class="sv">${leads.length}</div><div class="sl">Total Leads</div></div>
      <div class="stat"><div class="sv orange">${leadsToday}</div><div class="sl">Leads Today</div></div>
      <div class="stat"><div class="sv">${bookings.length}</div><div class="sl">Bookings</div></div>
      <div class="stat"><div class="sv green">${bNew}</div><div class="sl">New Bookings</div></div>
      <div class="stat"><div class="sv">${diagnoses.length}</div><div class="sl">Diagnoses</div></div>
      <div class="stat"><div class="sv pink">${dPending}</div><div class="sl">Pending</div></div>
      <div class="stat"><div class="sv">${applications.length}</div><div class="sl">Applications</div></div>
      <div class="stat"><div class="sv purple">${aNew}</div><div class="sl">New Apps</div></div>
    </div>

    <!-- Tabs -->
    <div class="tabs">
      <button class="tab active" onclick="switchTab('bookings',this)">Repair Bookings <span class="tab-count">${bookings.length}</span></button>
      <button class="tab" onclick="switchTab('leads',this)">Quick Leads <span class="tab-count">${leads.length}</span></button>
      <button class="tab" onclick="switchTab('diagnoses',this)">Free Diagnoses <span class="tab-count">${diagnoses.length}</span></button>
      <button class="tab" onclick="switchTab('applications',this)">Job Applications <span class="tab-count">${applications.length}</span></button>
    </div>

    <!-- Bookings -->
    <div id="tab-bookings" class="tab-panel active">
      <div class="toolbar">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" placeholder="Search name, phone, device…" oninput="filterTable('bookings-table',this.value,'bookings-filter')" />
        </div>
        <select class="filter-select" id="bookings-filter" onchange="filterTable('bookings-table',document.querySelector('#tab-bookings .search-input').value,this.id)">
          <option value="">All statuses</option>
          ${BOOKING_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join('')}
        </select>
        <span class="row-count" id="bookings-count">${bookings.length} rows</span>
        <button class="export-btn" onclick="exportCSV('bookings-table','bookings')">Export CSV</button>
      </div>
      ${bookings.length === 0
        ? '<div class="empty"><div class="empty-icon">📋</div>No bookings yet.</div>'
        : `<div class="table-wrap"><table id="bookings-table">
        <thead><tr><th>#</th><th>Status</th><th>Customer</th><th>Device</th><th>Issue</th><th>Urgency</th><th>Mode</th><th>Address</th><th>Slot</th><th>Submitted</th></tr></thead>
        <tbody>${bookings.map(b => `<tr data-status="${b.status}">
          <td class="id-cell">${b.id}</td>
          <td>${statusSelect(b.id, b.status, BOOKING_STATUSES, '/api/bookings')}</td>
          <td>
            <strong>${esc(b.name)}</strong>
            ${b.email ? `<br><span style="color:#6b7280;font-size:.75rem">${esc(b.email)}</span>` : ''}
            <br><a class="call-btn" href="tel:${encodeURI(String(b.phone))}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.61 16z"/></svg>${esc(b.phone)}</a>
          </td>
          <td><span class="badge-sm" style="background:#1e3a5f;color:#60a5fa">${esc(b.device_type)}</span><br><span style="color:#6b7280;font-size:.74rem">${esc(b.brand)}${b.model ? ' · ' + esc(b.model) : ''}</span></td>
          <td class="msg">${esc(b.issue)}</td>
          <td><span class="badge-sm" style="background:${b.urgency==='urgent'?'#450a0a':'#1e293b'};color:${b.urgency==='urgent'?'#f87171':'#94a3b8'}">${esc(b.urgency||'—')}</span></td>
          <td><span class="badge-sm" style="background:#1e3a5f;color:#60a5fa">${esc(b.service_mode||'—')}</span></td>
          <td class="msg" style="max-width:160px">${b.address ? esc(b.address) : '<span style="color:#374151">—</span>'}</td>
          <td style="font-size:.75rem;color:#9ca3af;white-space:nowrap">${b.preferred_date ? esc(b.preferred_date) : '—'}<br>${b.preferred_slot ? esc(b.preferred_slot) : ''}</td>
          <td class="dt">${fmtDate(b.created_at)}</td>
        </tr>`).join('')}</tbody>
      </table></div>`}
    </div>

    <!-- Leads -->
    <div id="tab-leads" class="tab-panel">
      <div class="toolbar">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" placeholder="Search name, phone, service…" oninput="filterTable('leads-table',this.value)" />
        </div>
        <span class="row-count" id="leads-count">${leads.length} rows</span>
        <button class="export-btn" onclick="exportCSV('leads-table','leads')">Export CSV</button>
      </div>
      ${leads.length === 0
        ? '<div class="empty"><div class="empty-icon">📬</div>No leads yet.</div>'
        : `<div class="table-wrap"><table id="leads-table">
        <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Service</th><th>Message</th><th>Submitted</th></tr></thead>
        <tbody>${leads.map(l => `<tr>
          <td class="id-cell">${l.id}</td>
          <td><strong>${esc(l.name)}</strong></td>
          <td class="ph">
            <a href="tel:${encodeURI(String(l.phone))}">${esc(l.phone)}</a>
            <br><a class="call-btn" href="tel:${encodeURI(String(l.phone))}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.61 16z"/></svg>Call</a>
          </td>
          <td><span class="badge-sm" style="background:#1e3a5f;color:#60a5fa">${esc(l.service)}</span></td>
          <td class="msg">${esc(l.message)}</td>
          <td class="dt">${fmtDate(l.created_at)}</td>
        </tr>`).join('')}</tbody>
      </table></div>`}
    </div>

    <!-- Diagnoses -->
    <div id="tab-diagnoses" class="tab-panel">
      <div class="toolbar">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" placeholder="Search name, phone, device…" oninput="filterTable('diagnoses-table',this.value,'diagnoses-filter')" />
        </div>
        <select class="filter-select" id="diagnoses-filter" onchange="filterTable('diagnoses-table',document.querySelector('#tab-diagnoses .search-input').value,this.id)">
          <option value="">All statuses</option>
          ${DIAG_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join('')}
        </select>
        <span class="row-count" id="diagnoses-count">${diagnoses.length} rows</span>
        <button class="export-btn" onclick="exportCSV('diagnoses-table','diagnoses')">Export CSV</button>
      </div>
      ${diagnoses.length === 0
        ? '<div class="empty"><div class="empty-icon">🔬</div>No diagnosis requests yet.</div>'
        : `<div class="table-wrap"><table id="diagnoses-table">
        <thead><tr><th>#</th><th>Status</th><th>Customer</th><th>Device</th><th>Powers On</th><th>Display</th><th>Description</th><th>Tried</th><th>Submitted</th></tr></thead>
        <tbody>${diagnoses.map(d => `<tr data-status="${d.status}">
          <td class="id-cell">${d.id}</td>
          <td>${statusSelect(d.id, d.status, DIAG_STATUSES, '/api/diagnoses')}</td>
          <td>
            <strong>${esc(d.name)}</strong>
            ${d.email ? `<br><span style="color:#6b7280;font-size:.75rem">${esc(d.email)}</span>` : ''}
            <br><a class="call-btn" href="tel:${encodeURI(String(d.phone))}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.61 16z"/></svg>${esc(d.phone)}</a>
          </td>
          <td><span class="badge-sm" style="background:#1e3a5f;color:#60a5fa">${esc(d.device_type)}</span><br><span style="color:#6b7280;font-size:.74rem">${esc(d.brand)}${d.model ? ' · ' + esc(d.model) : ''}</span></td>
          <td style="font-size:.8rem">${esc(d.powers_on || '—')}</td>
          <td style="font-size:.8rem;color:#9ca3af">${d.display_status ? esc(d.display_status) : '—'}</td>
          <td class="msg">${esc(d.description)}</td>
          <td class="msg" style="color:#4b5563">${d.tried ? esc(d.tried) : '—'}</td>
          <td class="dt">${fmtDate(d.created_at)}</td>
        </tr>`).join('')}</tbody>
      </table></div>`}
    </div>

    <!-- Applications -->
    <div id="tab-applications" class="tab-panel">
      <div class="toolbar">
        <div class="search-wrap">
          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="8"/><path d="m21 21-4.35-4.35"/></svg>
          <input class="search-input" placeholder="Search name, email, position…" oninput="filterTable('applications-table',this.value,'applications-filter')" />
        </div>
        <select class="filter-select" id="applications-filter" onchange="filterTable('applications-table',document.querySelector('#tab-applications .search-input').value,this.id)">
          <option value="">All statuses</option>
          ${APP_STATUSES.map(s=>`<option value="${s}">${s}</option>`).join('')}
        </select>
        <span class="row-count" id="applications-count">${applications.length} rows</span>
        <button class="export-btn" onclick="exportCSV('applications-table','applications')">Export CSV</button>
      </div>
      ${applications.length === 0
        ? '<div class="empty"><div class="empty-icon">👤</div>No job applications yet.</div>'
        : `<div class="table-wrap"><table id="applications-table">
        <thead><tr><th>#</th><th>Status</th><th>Name</th><th>Contact</th><th>Position</th><th>Experience</th><th>Cover Letter</th><th>Resume</th><th>Submitted</th></tr></thead>
        <tbody>${applications.map(a => `<tr data-status="${a.status}">
          <td class="id-cell">${a.id}</td>
          <td>${statusSelect(a.id, a.status, APP_STATUSES, '/api/applications')}</td>
          <td><strong>${esc(a.name)}</strong></td>
          <td class="ph">
            <a href="tel:${encodeURI(String(a.phone))}">${esc(a.phone)}</a>
            <br><span style="color:#6b7280;font-size:.75rem">${esc(a.email)}</span>
            <br><a class="call-btn" href="tel:${encodeURI(String(a.phone))}"><svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07A19.5 19.5 0 0 1 4.69 12 19.79 19.79 0 0 1 1.61 3.4 2 2 0 0 1 3.6 1.21h3a2 2 0 0 1 2 1.72c.127.96.361 1.903.7 2.81a2 2 0 0 1-.45 2.11L7.91 8.78a16 16 0 0 0 6 6l.93-.93a2 2 0 0 1 2.11-.45c.907.339 1.85.573 2.81.7A2 2 0 0 1 21.61 16z"/></svg>Call</a>
          </td>
          <td><span class="badge-sm" style="background:#312e81;color:#a5b4fc">${esc(a.position)}</span></td>
          <td style="font-size:.8rem;color:#9ca3af">${a.experience ? esc(a.experience) : '—'}</td>
          <td class="msg">${esc(a.message)}</td>
          <td>${a.resume_original_name ? `<a href="/api/applications/${a.id}/resume" class="dl-btn">⬇ Download</a>` : '<span style="color:#374151;font-size:.78rem">None</span>'}</td>
          <td class="dt">${fmtDate(a.created_at)}</td>
        </tr>`).join('')}</tbody>
      </table></div>`}
    </div>
  </main>

  <div id="toast"></div>

  <script>
    function switchTab(name, btn) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + name).classList.add('active');
      btn.classList.add('active');
    }

    function showToast(msg, type = 'success') {
      const t = document.getElementById('toast');
      t.textContent = (type === 'success' ? '✓ ' : '✕ ') + msg;
      t.className = 'show ' + type;
      clearTimeout(t._timer);
      t._timer = setTimeout(() => t.className = '', 3000);
    }

    function updateStatus(endpoint, id, sel) {
      const status = sel.value;
      const prev = sel.dataset.prev || sel.querySelector('[selected]')?.value || status;
      sel.dataset.prev = status;
      fetch(endpoint + '/' + id + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status })
      }).then(r => {
        if (!r.ok) throw new Error('Failed');
        const row = sel.closest('tr');
        if (row) row.dataset.status = status;
        showToast('Status updated to ' + status);
      }).catch(() => {
        sel.value = prev;
        showToast('Failed to update status', 'error');
      });
    }

    function filterTable(tableId, query, filterId) {
      const table = document.getElementById(tableId);
      if (!table) return;
      const q = query.trim().toLowerCase();
      const filterSel = filterId ? document.getElementById(filterId) : null;
      const statusFilter = filterSel ? filterSel.value : '';
      let visible = 0;
      table.querySelectorAll('tbody tr').forEach(row => {
        const text = row.textContent.toLowerCase();
        const rowStatus = row.dataset.status || '';
        const matchesQ = !q || text.includes(q);
        const matchesS = !statusFilter || rowStatus === statusFilter;
        const show = matchesQ && matchesS;
        row.style.display = show ? '' : 'none';
        if (show) visible++;
      });
      const countId = tableId.replace('-table', '-count');
      const countEl = document.getElementById(countId);
      if (countEl) countEl.textContent = visible + ' rows';
    }

    function exportCSV(tableId, name) {
      const table = document.getElementById(tableId);
      if (!table) return;
      const rows = [];
      table.querySelectorAll('thead tr').forEach(tr => {
        rows.push([...tr.querySelectorAll('th')].map(th => '"' + th.textContent.trim().replace(/"/g, '""') + '"').join(','));
      });
      table.querySelectorAll('tbody tr').forEach(tr => {
        if (tr.style.display === 'none') return;
        rows.push([...tr.querySelectorAll('td')].map(td => {
          const sel = td.querySelector('select');
          const text = sel ? sel.value : td.textContent.trim().replace(/\\s+/g, ' ');
          return '"' + text.replace(/"/g, '""') + '"';
        }).join(','));
      });
      const blob = new Blob([rows.join('\\n')], { type: 'text/csv' });
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name + '-' + new Date().toISOString().slice(0,10) + '.csv';
      a.click();
    }
  </script>
</body>
</html>`;
}

function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
