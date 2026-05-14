interface Lead {
  id: number;
  name: string;
  phone: string;
  service: string;
  message: string;
  created_at: string;
}

export function adminHtml(leads: Lead[]): string {
  const today = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 86400000)).length;
  const week  = leads.filter(l => new Date(l.created_at) > new Date(Date.now() - 7 * 86400000)).length;

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8"/>
  <meta name="viewport" content="width=device-width,initial-scale=1"/>
  <title>Larsha Tech Admin</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    body{font-family:system-ui,sans-serif;background:#0f172a;color:#e2e8f0;min-height:100vh}
    header{background:#1e293b;border-bottom:1px solid #334155;padding:1rem 2rem;display:flex;align-items:center;gap:.75rem}
    header h1{font-size:1.2rem;font-weight:700}header span.t{color:#3b82f6}
    .badge{background:#1e3a5f;color:#60a5fa;font-size:.7rem;font-weight:700;padding:.2rem .6rem;border-radius:999px}
    .count{margin-left:auto;color:#94a3b8;font-size:.85rem}
    main{padding:2rem;max-width:1200px;margin:0 auto}
    .stats{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1rem;margin-bottom:2rem}
    .stat{background:#1e293b;border:1px solid #334155;border-radius:12px;padding:1.25rem;text-align:center}
    .sv{font-size:2rem;font-weight:800;color:#3b82f6}.sl{font-size:.75rem;color:#94a3b8;margin-top:.2rem}
    table{width:100%;border-collapse:collapse;background:#1e293b;border-radius:12px;overflow:hidden;border:1px solid #334155}
    th{text-align:left;padding:.75rem 1rem;background:#0f172a;color:#94a3b8;font-size:.7rem;text-transform:uppercase;letter-spacing:.05em}
    td{padding:.75rem 1rem;border-top:1px solid #1e293b;font-size:.85rem;vertical-align:top}
    tr:hover td{background:#1a2744}
    .ph a{color:#34d399;text-decoration:none}.ph a:hover{text-decoration:underline}
    .svc{background:#1e3a5f;color:#60a5fa;font-size:.65rem;font-weight:700;padding:.15rem .5rem;border-radius:999px;white-space:nowrap}
    .msg{max-width:260px;color:#94a3b8;white-space:pre-wrap;word-break:break-word;font-size:.8rem}
    .dt{color:#64748b;font-size:.75rem;white-space:nowrap}
    .empty{text-align:center;padding:4rem;color:#475569}
  </style>
</head>
<body>
  <header>
    <h1>Larsha <span class="t">Tech</span></h1>
    <span class="badge">Admin</span>
    <span class="count">${leads.length} leads total</span>
  </header>
  <main>
    <div class="stats">
      <div class="stat"><div class="sv">${leads.length}</div><div class="sl">Total Leads</div></div>
      <div class="stat"><div class="sv">${week}</div><div class="sl">This Week</div></div>
      <div class="stat"><div class="sv">${today}</div><div class="sl">Today</div></div>
    </div>
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
  </main>
</body>
</html>`;
}

function esc(s: string): string {
  return String(s).replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;').replace(/"/g,'&quot;');
}
