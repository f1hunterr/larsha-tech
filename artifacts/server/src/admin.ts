interface Lead {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
}

interface Booking {
  id: number;
  device_type: string;
  brand: string;
  model: string;
  device_age: string;
  issue: string;
  description: string;
  urgency: string;
  service_mode: string;
  address: string;
  preferred_date: string;
  preferred_slot: string;
  name: string;
  phone: string;
  email: string;
  status: string;
  created_at: string;
}

export function adminHtml(leads: Lead[], bookings: Booking[]): string {
  const now = Date.now();
  const leadsToday = leads.filter(l => new Date(l.created_at) > new Date(now - 86400000)).length;
  const leadsWeek  = leads.filter(l => new Date(l.created_at) > new Date(now - 7 * 86400000)).length;
  const bToday     = bookings.filter(b => new Date(b.created_at) > new Date(now - 86400000)).length;
  const bNew       = bookings.filter(b => b.status === 'new').length;

  const STATUS_COLORS: Record<string, string> = {
    new: '#1e3a5f:#60a5fa',
    confirmed: '#14532d:#4ade80',
    'in-progress': '#422006:#fb923c',
    done: '#1c1917:#78716c',
    cancelled: '#450a0a:#f87171',
  };

  function statusBadge(s: string) {
    const [bg, color] = (STATUS_COLORS[s] ?? '#1e293b:#94a3b8').split(':');
    return `<span style="background:${bg};color:${color};font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:999px;white-space:nowrap">${esc(s)}</span>`;
  }

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Larsha Tech Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
    header{background:#1e293b;border-bottom:1px solid #334155;padding:1rem 2rem;display:flex;align-items:center;gap:.75rem;flex-wrap:wrap}
    header h1{font-size:1.2rem;font-weight:700}
    header span.t{color:#3b82f6}
    .badge{background:#1e3a5f;color:#60a5fa;font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:999px}
    .count{margin-left:auto;color:#94a3b8;font-size:.85rem}
    main{padding:1.5rem 2rem;max-width:1400px;margin:0 auto}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(130px,1fr));gap:1rem;margin-bottom:1.5rem}
    .stat{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:1.25rem;text-align:center}
    .sv{font-size:2rem;font-weight:800;color:#3b82f6}.sl{font-size:.75rem;color:#94a3b8;margin-top:.2rem}
    .tabs{display:flex;gap:0;border-bottom:1px solid #334155;margin-bottom:1.5rem}
    .tab{padding:.65rem 1.5rem;cursor:pointer;font-size:.85rem;font-weight:600;color:#94a3b8;border:none;background:none;border-bottom:2px solid transparent;margin-bottom:-1px;transition:all .15s}
    .tab.active{color:#60a5fa;border-bottom-color:#3b82f6}
    .tab:hover:not(.active){color:#e2e8f0}
    .tab-panel{display:none}.tab-panel.active{display:block}
    table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    th{text-align:left;padding:.75rem 1rem;background:#0f172a;color:#94a3b8;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em}
    td{padding:.75rem 1rem;border-top:1px solid #1e293b;font-size:.85rem;vertical-align:top}
    tr:hover td{background:#1a2744}
    .ph a{color:#34d399;text-decoration:none}.ph a:hover{text-decoration:underline}
    .svc{background:#1e3a5f;color:#60a5fa;font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:999px;white-space:nowrap}
    .msg{max-width:220px;color:#94a3b8;white-space:pre-wrap;word-break:break-word;font-size:.8rem}
    .dt{color:#64748b;font-size:.75rem;white-space:nowrap}
    .empty{text-align:center;padding:4rem;color:#475569}
    select.status-select{background:#0f172a;border:1px solid #334155;color:#e2e8f0;padding:.2rem .4rem;border-radius:6px;font-size:.75rem;cursor:pointer}
    @media(max-width:640px){main{padding:1rem}th,td{padding:.5rem .6rem;font-size:.78rem}}
  </style>
</head>
<body>
  <header>
    <h1>Larsha <span class="t">Tech</span></h1>
    <span class="badge">Admin</span>
    <span class="count">${leads.length} leads · ${bookings.length} bookings</span>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><div class="sv">${leads.length}</div><div class="sl">Total Leads</div></div>
      <div class="stat"><div class="sv">${leadsWeek}</div><div class="sl">Leads This Week</div></div>
      <div class="stat"><div class="sv">${leadsToday}</div><div class="sl">Leads Today</div></div>
      <div class="stat"><div class="sv">${bookings.length}</div><div class="sl">Total Bookings</div></div>
      <div class="stat"><div class="sv" style="color:#4ade80">${bNew}</div><div class="sl">New Bookings</div></div>
      <div class="stat"><div class="sv">${bToday}</div><div class="sl">Bookings Today</div></div>
    </div>

    <div class="tabs">
      <button class="tab active" onclick="switchTab('bookings')">Repair Bookings</button>
      <button class="tab" onclick="switchTab('leads')">Quick Leads</button>
    </div>

    <!-- Bookings tab -->
    <div id="tab-bookings" class="tab-panel active">
      ${bookings.length === 0
        ? '<div class="empty">No repair bookings yet.</div>'
        : `<div style="overflow-x:auto"><table>
        <thead><tr>
          <th>#</th><th>Status</th><th>Name</th><th>Phone</th>
          <th>Device</th><th>Issue</th><th>Urgency</th>
          <th>Mode</th><th>Address</th><th>Slot</th><th>Date</th>
        </tr></thead>
        <tbody>
          ${bookings.map(b => `<tr>
            <td style="color:#475569">${b.id}</td>
            <td>
              <select class="status-select" onchange="updateStatus(${b.id},this.value)">
                ${['new','confirmed','in-progress','done','cancelled'].map(s =>
                  `<option value="${s}"${b.status===s?' selected':''}>${s}</option>`
                ).join('')}
              </select>
            </td>
            <td><strong>${esc(b.name)}</strong>${b.email ? `<br><span style="color:#64748b;font-size:.75rem">${esc(b.email)}</span>` : ''}</td>
            <td class="ph"><a href="tel:${encodeURI(String(b.phone))}">${esc(b.phone)}</a></td>
            <td><span class="svc">${esc(b.device_type)}</span><br><span style="color:#94a3b8;font-size:.75rem">${esc(b.brand)}${b.model ? ' · ' + esc(b.model) : ''}</span></td>
            <td class="msg">${esc(b.issue)}</td>
            <td><span style="font-size:.8rem">${esc(b.urgency)}</span></td>
            <td><span class="svc">${esc(b.service_mode)}</span></td>
            <td class="msg">${b.address ? esc(b.address) : '<span style="color:#475569">—</span>'}</td>
            <td style="font-size:.75rem;color:#94a3b8;white-space:nowrap">${b.preferred_date ? esc(b.preferred_date) : '—'}<br>${b.preferred_slot ? esc(b.preferred_slot) : ''}</td>
            <td class="dt">${new Date(b.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td>
          </tr>`).join('')}
        </tbody>
      </table></div>`}
    </div>

    <!-- Leads tab -->
    <div id="tab-leads" class="tab-panel">
      ${leads.length === 0
        ? '<div class="empty">No leads yet — share the site to get started!</div>'
        : `<div style="overflow-x:auto"><table>
        <thead><tr><th>#</th><th>Name</th><th>Phone</th><th>Service</th><th>Message</th><th>Date</th></tr></thead>
        <tbody>
          ${leads.map(l => `<tr>
            <td style="color:#475569">${l.id}</td>
            <td><strong>${esc(l.name)}</strong></td>
            <td class="ph"><a href="tel:${encodeURI(String(l.phone))}">${esc(l.phone)}</a></td>
            <td><span class="svc">${esc(l.service)}</span></td>
            <td class="msg">${esc(l.message)}</td>
            <td class="dt">${new Date(l.created_at).toLocaleString('en-IN',{timeZone:'Asia/Kolkata'})}</td>
          </tr>`).join('')}
        </tbody></table></div>`}
    </div>
  </main>

  <script>
    function switchTab(name) {
      document.querySelectorAll('.tab-panel').forEach(p => p.classList.remove('active'));
      document.querySelectorAll('.tab').forEach(t => t.classList.remove('active'));
      document.getElementById('tab-' + name).classList.add('active');
      event.target.classList.add('active');
    }

    function updateStatus(id, status) {
      fetch('/api/bookings/' + id + '/status', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      }).catch(() => alert('Failed to update status. Please refresh and try again.'));
    }
  </script>
</body>
</html>`;
}

function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
