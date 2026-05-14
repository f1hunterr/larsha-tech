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

export function adminHtml(leads: Lead[], bookings: Booking[], applications: Application[]): string {
  const now = Date.now();
  const leadsToday = leads.filter(l => new Date(l.created_at) > new Date(now - 86400000)).length;
  const bNew       = bookings.filter(b => b.status === 'new').length;
  const aNew       = applications.filter(a => a.status === 'new').length;

  const BOOKING_STATUSES  = ['new','confirmed','in-progress','done','cancelled'];
  const APP_STATUSES      = ['new','reviewing','shortlisted','rejected','hired'];

  const STATUS_COLORS: Record<string, string> = {
    new: '#1e3a5f:#60a5fa', confirmed: '#14532d:#4ade80', 'in-progress': '#422006:#fb923c',
    done: '#1c1917:#78716c', cancelled: '#450a0a:#f87171',
    reviewing: '#312e81:#a5b4fc', shortlisted: '#14532d:#4ade80',
    rejected: '#450a0a:#f87171', hired: '#064e3b:#34d399',
  };
  function statusBg(s: string) {
    return (STATUS_COLORS[s] ?? '#1e293b:#94a3b8').split(':')[0];
  }
  function statusFg(s: string) {
    return (STATUS_COLORS[s] ?? '#1e293b:#94a3b8').split(':')[1];
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/><meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Larsha Tech Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
    header{background:#1e293b;border-bottom:1px solid #334155;padding:1rem 2rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
    header h1{font-size:1.2rem;font-weight:700}header span.t{color:#3b82f6}
    .badge{background:#1e3a5f;color:#60a5fa;font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:999px}
    .count{margin-left:auto;color:#94a3b8;font-size:.85rem}
    main{padding:1.5rem 2rem;max-width:1400px;margin:0 auto}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1.5rem}
    .stat{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:1.25rem;text-align:center}
    .sv{font-size:2rem;font-weight:800;color:#3b82f6}.sl{font-size:.75rem;color:#94a3b8;margin-top:.2rem}
    .tabs{display:flex;gap:0;border-bottom:1px solid #334155;margin-bottom:1.5rem}
    .tab{padding:.65rem 1.5rem;cursor:pointer;font-size:.85rem;font-weight:600;color:#94a3b8;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
    .tab.active{color:#60a5fa;border-bottom-color:#3b82f6}.tab:hover:not(.active){color:#e2e8f0}
    .tab-panel{display:none}.tab-panel.active{display:block}
    table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    th{text-align:left;padding:.75rem 1rem;background:#0f172a;color:#94a3b8;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em}
    td{padding:.75rem 1rem;border-top:1px solid #1e293b;font-size:.85rem;vertical-align:top}
    tr:hover td{background:#1a2744}
    .ph a{color:#34d399;text-decoration:none}.ph a:hover{text-decoration:underline}
    .svc{font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:999px;white-space:nowrap}
    .msg{max-width:220px;color:#94a3b8;white-space:pre-wrap;word-break:break-word;font-size:.8rem}
    .dt{color:#64748b;font-size:.75rem;white-space:nowrap}
    .empty{text-align:center;padding:4rem;color:#475569}
    select.status-select{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:.2rem .4rem;border-radius:6px;font-size:.75rem;cursor:pointer}
    .dl-btn{background:#1e3a5f;color:#60a5fa;border:none;padding:.25rem .6rem;border-radius:6px;cursor:pointer;font-size:.75rem}
    .dl-btn:hover{background:#1d4ed8;color:#fff}
    @media(max-width:640px){main{padding:1rem}th,td{padding:.5rem .6rem;font-size:.78rem}}
  </style>
</head>
<body>
  <header>
    <h1>Larsha <span class="t">Tech</span></h1>
    <span class="badge">Admin</span>
    <span class="count">${leads.length} leads · ${bookings.length} bookings · ${applications.length} applications</span>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><div class="sv">${leads.length}</div><div class="sl">Total Leads</div></div>
      <div class="stat"><div class="sv">${leadsToday}</div><div class="sl">Leads Today</div></div>
      <div class="stat"><div class="sv">${bookings.length}</div><div class="sl">Total Bookings</div></div>
      <div class="stat"><div class="sv" style="color:#4ade80">${bNew}</div><div class="sl">New Bookings</div></div>
      <div class="stat"><div class="sv">${applications.length}</div><div class="sl">Applications</div></div>
      <div class="stat"><div class="sv" style="color:#a5b4fc">${aNew}</div><div class="sl">New Applications</div></div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('bookings',this)">Repair Bookings</button>
      <button class="tab" onclick="switchTab('leads',this)">Quick Leads</button>
      <button class="tab" onclick="switchTab('applications',this)">Job Applications</button>
    </div>

    <!-- Bookings -->
    <div id="tab-bookings" class="tab-panel active">
      ${bookings.length === 0 ? '<div class="empty">No bookings yet.</div>' : `<div style="overflow-x:auto"><table>
      <thead><tr><th>#</th><th>Status</th><th>Name</th><th>Phone</th><th>Device</th><th>Issue</th><th>Urgency</th><th>Mode</th><th>Address</th><th>Slot</th><th>Date</th></tr></thead>
      <tbody>${bookings.map(b => `<tr>
        <td style="color:#475569">${b.id}</td>
        <td><span class="svc" style="background:${statusBg(b.status)};color:${statusFg(b.status)}">${esc(b.status)}</span></td>
        <td><strong>${esc(b.name)}</strong>${b.email?`<br><span style="color:#64748b;font-size:.75rem">${esc(b.email)}</span>`:''}</td>
        <td class="ph"><a href="tel:${encodeURI(String(b.phone))}">${esc(b.phone)}</a></td>
        <td><span class="svc" style="background:#1e3a5f;color:#60a5fa">${esc(b.device_type)}</span><br><span style="color:#94a3b8;font-size:.75rem">${esc(b.brand)}${b.model?' · '+esc(b.model):''}</span></td>
        <td class="msg">${esc(b.issue)}</td>
        <td style="font-size:.8rem">${esc(b.urgency)}</td>
        <td><span class="svc" style="background:#1e3a5f;color:#60a5fa">${esc(b.service_mode)}</span></td>
        <td class="msg">${b.address?esc(b.address):'<span style="color:#475569">—</span>'}</td>
        <td style="font-size:.75rem;color:#94a3b8;white-space:nowrap">${b.preferred_date?esc(b.preferred_date):'—'}<br>${b.preferred_slot?esc(b.preferred_slot):''}</td>
        <td class="dt">${new Date(b.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td>
      </tr>`).join('')}</tbody></table></div>`}
    </div>

    <!-- Leads -->
    <div id="tab-leads" class="tab-panel">
      ${leads.length === 0 ? '<div class="empty">No leads yet.</div>' : `<div style="overflow-x:auto"><table>
      <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Service</th><th>Message</th><th>Date</th></tr></thead>
      <tbody>${leads.map(l => `<tr>
        <td style="color:#475569">${l.id}</td>
        <td><strong>${esc(l.name)}</strong></td>
        <td class="ph"><a href="tel:${encodeURI(String(l.phone))}">${esc(l.phone)}</a></td>
        <td><span class="svc" style="background:#1e3a5f;color:#60a5fa">${esc(l.service)}</span></td>
        <td class="msg">${esc(l.message)}</td>
        <td class="dt">${new Date(l.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td>
      </tr>`).join('')}</tbody></table></div>`}
    </div>

    <!-- Applications -->
    <div id="tab-applications" class="tab-panel">
      ${applications.length === 0 ? '<div class="empty">No job applications yet.</div>' : `<div style="overflow-x:auto"><table>
      <thead><tr><th>#</th><th>Status</th><th>Name</th><th>Contact</th><th>Position</th><th>Experience</th><th>Cover Letter</th><th>Resume</th><th>Date</th></tr></thead>
      <tbody>${applications.map(a => `<tr>
        <td style="color:#475569">${a.id}</td>
        <td><span class="svc" style="background:${statusBg(a.status)};color:${statusFg(a.status)}">${esc(a.status)}</span></td>
        <td><strong>${esc(a.name)}</strong></td>
        <td class="ph"><a href="tel:${encodeURI(String(a.phone))}">${esc(a.phone)}</a><br><span style="color:#64748b;font-size:.75rem">${esc(a.email)}</span></td>
        <td><span class="svc" style="background:#312e81;color:#a5b4fc">${esc(a.position)}</span></td>
        <td style="font-size:.8rem;color:#94a3b8">${a.experience?esc(a.experience):'—'}</td>
        <td class="msg">${esc(a.message)}</td>
        <td>${a.resume_original_name?`<a href="/api/applications/${a.id}/resume" class="dl-btn">Download</a>`:'<span style="color:#475569">None</span>'}</td>
        <td class="dt">${new Date(a.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td>
      </tr>`).join('')}</tbody></table></div>`}
    </div>
  </main>

  <script>
    function switchTab(name, btn) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + name).classList.add('active');
      btn.classList.add('active');
    }
  </script>
</body>
</html>`;
}

function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
