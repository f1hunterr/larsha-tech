import React, { useState, useEffect } from 'react';
import { Lock, LogOut, Loader2, RefreshCw, Download } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface Lead { id: number; name: string; phone: string; service: string; message: string; created_at: string; }
interface Booking {
  id: number; device_type: string; brand: string; model: string; issue: string; urgency: string;
  service_mode: string; address: string; preferred_date: string; preferred_slot: string;
  name: string; phone: string; email: string; status: string; created_at: string;
}
interface Application {
  id: number; name: string; email: string; phone: string; position: string;
  experience: string; message: string; resume_original_name: string | null; status: string; created_at: string;
}
interface Diagnosis {
  id: number; name: string; phone: string; email: string; device_type: string;
  brand: string; model: string; powers_on: string; display_status: string;
  sounds: string; error_messages: string; problem_start: string;
  description: string; tried: string; status: string; created_at: string;
}

type Tab = 'bookings' | 'leads' | 'applications' | 'diagnoses';

const BOOKING_STATUSES  = ['new','confirmed','in-progress','done','cancelled'];
const APP_STATUSES      = ['new','reviewing','shortlisted','rejected','hired'];
const DIAG_STATUSES     = ['pending','reviewed','contacted','resolved'];

const STATUS_COLOR: Record<string, string> = {
  new: 'bg-blue-900/60 text-blue-300', confirmed: 'bg-green-900/60 text-green-300',
  'in-progress': 'bg-orange-900/60 text-orange-300', done: 'bg-slate-700 text-slate-400',
  cancelled: 'bg-red-900/60 text-red-400', reviewing: 'bg-indigo-900/60 text-indigo-300',
  shortlisted: 'bg-emerald-900/60 text-emerald-300', rejected: 'bg-red-900/60 text-red-400',
  hired: 'bg-teal-900/60 text-teal-300',
  pending: 'bg-pink-900/60 text-pink-300', reviewed: 'bg-blue-900/60 text-blue-300',
  contacted: 'bg-orange-900/60 text-orange-300', resolved: 'bg-teal-900/60 text-teal-300',
};

function Badge({ s }: { s: string }) {
  return (
    <span className={`text-xs font-bold px-2 py-0.5 rounded-full ${STATUS_COLOR[s] ?? 'bg-slate-700 text-slate-400'}`}>
      {s}
    </span>
  );
}

function fmt(dt: string) {
  return new Date(dt).toLocaleString('en-IN', { timeZone: 'Asia/Kolkata', day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
}

export default function AdminPage() {
  const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

  const [loginForm, setLoginForm] = useState({ username: 'admin', password: '' });
  const [authHeader, setAuthHeader] = useState<string | null>(() => sessionStorage.getItem('admin-auth'));
  const [loginError, setLoginError] = useState('');
  const [loginLoading, setLoginLoading] = useState(false);

  const [leads, setLeads] = useState<Lead[]>([]);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [applications, setApplications] = useState<Application[]>([]);
  const [diagnoses, setDiagnoses] = useState<Diagnosis[]>([]);
  const [dataLoading, setDataLoading] = useState(false);
  const [tab, setTab] = useState<Tab>('bookings');

  const headers = (auth: string) => ({ Authorization: `Basic ${auth}` });

  const fetchAll = async (auth: string) => {
    setDataLoading(true);
    try {
      const [bRes, lRes, aRes, dRes] = await Promise.all([
        fetch(`${apiUrl}/api/bookings`,     { headers: headers(auth) }),
        fetch(`${apiUrl}/api/leads`,        { headers: headers(auth) }),
        fetch(`${apiUrl}/api/applications`, { headers: headers(auth) }),
        fetch(`${apiUrl}/api/diagnoses`,    { headers: headers(auth) }),
      ]);
      if (!bRes.ok) throw new Error('auth');
      setBookings(  await bRes.json() as Booking[]);
      setLeads(     lRes.ok ? await lRes.json() as Lead[] : []);
      setApplications(aRes.ok ? await aRes.json() as Application[] : []);
      setDiagnoses(   dRes.ok ? await dRes.json() as Diagnosis[] : []);
    } finally {
      setDataLoading(false);
    }
  };

  useEffect(() => {
    if (authHeader && apiUrl) fetchAll(authHeader);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!apiUrl) { setLoginError('VITE_API_URL is not configured.'); return; }
    setLoginLoading(true);
    setLoginError('');
    const auth = btoa(`${loginForm.username}:${loginForm.password}`);
    try {
      const res = await fetch(`${apiUrl}/api/bookings`, { headers: headers(auth) });
      if (res.status === 401) { setLoginError('Invalid username or password.'); setLoginLoading(false); return; }
      if (!res.ok) throw new Error('server');
      sessionStorage.setItem('admin-auth', auth);
      setAuthHeader(auth);
      setBookings(await res.json() as Booking[]);
      const [lRes, aRes, dRes] = await Promise.all([
        fetch(`${apiUrl}/api/leads`,        { headers: headers(auth) }),
        fetch(`${apiUrl}/api/applications`, { headers: headers(auth) }),
        fetch(`${apiUrl}/api/diagnoses`,    { headers: headers(auth) }),
      ]);
      setLeads(       lRes.ok ? await lRes.json() as Lead[] : []);
      setApplications(aRes.ok ? await aRes.json() as Application[] : []);
      setDiagnoses(   dRes.ok ? await dRes.json() as Diagnosis[] : []);
    } catch {
      setLoginError('Could not reach the server. Check your connection.');
    }
    setLoginLoading(false);
  };

  const logout = () => {
    sessionStorage.removeItem('admin-auth');
    setAuthHeader(null);
    setLeads([]); setBookings([]); setApplications([]); setDiagnoses([]);
  };

  const updateStatus = async (resource: string, id: number, status: string) => {
    if (!authHeader) return;
    await fetch(`${apiUrl}/api/${resource}/${id}/status`, {
      method: 'PATCH', headers: { ...headers(authHeader), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    fetchAll(authHeader);
  };

  const downloadResume = async (id: number, filename: string) => {
    if (!authHeader) return;
    const res = await fetch(`${apiUrl}/api/applications/${id}/resume`, { headers: headers(authHeader) });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  if (!authHeader) {
    return (
      <div className="min-h-screen bg-slate-950 flex items-center justify-center px-4">
        <div className="w-full max-w-sm">
          <div className="flex items-center gap-3 justify-center mb-8">
            <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center">
              <Lock className="w-5 h-5 text-white" />
            </div>
            <div>
              <p className="font-black text-white text-lg leading-tight">Larsha <span className="text-blue-400">Tech</span></p>
              <p className="text-slate-500 text-xs">Admin Dashboard</p>
            </div>
          </div>

          <form onSubmit={handleLogin} className="bg-slate-900 border border-slate-700 rounded-2xl p-8 space-y-4">
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Username</label>
              <input
                type="text" autoComplete="username" value={loginForm.username}
                onChange={e => setLoginForm(p => ({ ...p, username: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            <div>
              <label className="block text-slate-400 text-xs font-semibold uppercase tracking-wider mb-1.5">Password</label>
              <input
                type="password" autoComplete="current-password" value={loginForm.password}
                onChange={e => setLoginForm(p => ({ ...p, password: e.target.value }))}
                className="w-full px-4 py-3 rounded-xl bg-slate-800 border border-slate-700 text-white text-sm outline-none focus:border-blue-500 transition-colors"
              />
            </div>
            {loginError && (
              <p className="text-red-400 text-sm bg-red-950/40 border border-red-900/50 px-3 py-2 rounded-lg">{loginError}</p>
            )}
            <Button type="submit" className="w-full h-11 bg-blue-600 hover:bg-blue-700 text-white" disabled={loginLoading}>
              {loginLoading ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Signing in…</> : 'Sign In'}
            </Button>
          </form>
        </div>
      </div>
    );
  }

  const tabClass = (t: Tab) =>
    `px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'text-muted-foreground hover:text-foreground hover:bg-muted'}`;

  const thCls = 'text-left px-4 py-3 text-xs font-semibold text-muted-foreground uppercase tracking-wider bg-muted/50';
  const tdCls = 'px-4 py-3 text-sm border-t border-border align-top';

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="bg-slate-950 border-b border-slate-800 px-6 py-4 flex items-center gap-4">
        <div className="flex items-center gap-2">
          <span className="w-8 h-8 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-5 w-5 object-contain" />
          </span>
          <span className="font-black text-white">Larsha <span className="text-blue-400">Tech</span></span>
          <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">Admin</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <button onClick={() => fetchAll(authHeader)} className="text-slate-400 hover:text-white transition-colors" title="Refresh">
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> Logout
          </button>
        </div>
      </header>

      <main className="p-6 max-w-7xl mx-auto">
        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {[
            { label: 'Total Leads',    value: leads.length,                                           color: '' },
            { label: 'Total Bookings', value: bookings.length,                                        color: '' },
            { label: 'New Bookings',   value: bookings.filter(b=>b.status==='new').length,            color: 'text-blue-500' },
            { label: 'Diagnoses',      value: diagnoses.length,                                       color: '' },
            { label: 'Pending Diag.', value: diagnoses.filter(d=>d.status==='pending').length,        color: 'text-pink-400' },
            { label: 'Total Apps',     value: applications.length,                                    color: '' },
            { label: 'New Apps',       value: applications.filter(a=>a.status==='new').length,        color: 'text-indigo-400' },
            { label: 'Shortlisted',    value: applications.filter(a=>a.status==='shortlisted').length,color: 'text-green-500' },
          ].map(s => (
            <div key={s.label} className="bg-card border rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color || 'text-foreground'}`}>{s.value}</p>
              <p className="text-xs text-muted-foreground mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex flex-wrap gap-2 mb-6">
          <button className={tabClass('bookings')}    onClick={() => setTab('bookings')}>Repair Bookings ({bookings.length})</button>
          <button className={tabClass('leads')}       onClick={() => setTab('leads')}>Leads ({leads.length})</button>
          <button className={tabClass('diagnoses')}   onClick={() => setTab('diagnoses')}>Free Diagnoses ({diagnoses.length})</button>
          <button className={tabClass('applications')} onClick={() => setTab('applications')}>Applications ({applications.length})</button>
        </div>

        {/* Content */}
        <div className="bg-card border rounded-2xl overflow-hidden">
          {/* BOOKINGS */}
          {tab === 'bookings' && (
            bookings.length === 0
              ? <p className="text-center py-16 text-muted-foreground">No bookings yet.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['#','Status','Name','Phone','Device','Issue','Urgency','Mode','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {bookings.map(b => (
                        <tr key={b.id} className="hover:bg-muted/30 transition-colors">
                          <td className={tdCls + ' text-muted-foreground'}>{b.id}</td>
                          <td className={tdCls}>
                            <select
                              value={b.status}
                              onChange={e => updateStatus('bookings', b.id, e.target.value)}
                              className="text-xs bg-background border border-border rounded-lg px-2 py-1 cursor-pointer"
                            >
                              {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className={tdCls}>
                            <p className="font-semibold">{b.name}</p>
                            {b.email && <p className="text-xs text-muted-foreground">{b.email}</p>}
                          </td>
                          <td className={tdCls}><a href={`tel:${b.phone}`} className="text-green-600 dark:text-green-400 hover:underline">{b.phone}</a></td>
                          <td className={tdCls}><p className="font-medium">{b.device_type}</p><p className="text-xs text-muted-foreground">{b.brand}{b.model ? ' · ' + b.model : ''}</p></td>
                          <td className={tdCls + ' max-w-[180px]'}><p className="text-sm truncate">{b.issue}</p></td>
                          <td className={tdCls}><Badge s={b.urgency} /></td>
                          <td className={tdCls}><Badge s={b.service_mode} /></td>
                          <td className={tdCls + ' text-xs text-muted-foreground whitespace-nowrap'}>{fmt(b.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}

          {/* LEADS */}
          {tab === 'leads' && (
            leads.length === 0
              ? <p className="text-center py-16 text-muted-foreground">No leads yet.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['#','Name','Phone','Service','Message','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {leads.map(l => (
                        <tr key={l.id} className="hover:bg-muted/30 transition-colors">
                          <td className={tdCls + ' text-muted-foreground'}>{l.id}</td>
                          <td className={tdCls + ' font-semibold'}>{l.name}</td>
                          <td className={tdCls}><a href={`tel:${l.phone}`} className="text-green-600 dark:text-green-400 hover:underline">{l.phone}</a></td>
                          <td className={tdCls}><Badge s={l.service} /></td>
                          <td className={tdCls + ' max-w-[220px] text-muted-foreground text-xs'}>{l.message}</td>
                          <td className={tdCls + ' text-xs text-muted-foreground whitespace-nowrap'}>{fmt(l.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}

          {/* DIAGNOSES */}
          {tab === 'diagnoses' && (
            diagnoses.length === 0
              ? <p className="text-center py-16 text-muted-foreground">No diagnosis requests yet.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['#','Status','Name','Phone','Device','Powers On','Display','Problem Start','Description','Tried','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {diagnoses.map(d => (
                        <tr key={d.id} className="hover:bg-muted/30 transition-colors">
                          <td className={tdCls + ' text-muted-foreground'}>{d.id}</td>
                          <td className={tdCls}>
                            <select
                              value={d.status}
                              onChange={e => updateStatus('diagnoses', d.id, e.target.value)}
                              className="text-xs bg-background border border-border rounded-lg px-2 py-1 cursor-pointer"
                            >
                              {DIAG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className={tdCls}>
                            <p className="font-semibold">{d.name}</p>
                            {d.email && <p className="text-xs text-muted-foreground">{d.email}</p>}
                          </td>
                          <td className={tdCls}><a href={`tel:${d.phone}`} className="text-green-600 dark:text-green-400 hover:underline">{d.phone}</a></td>
                          <td className={tdCls}><p className="font-medium">{d.device_type}</p><p className="text-xs text-muted-foreground">{d.brand}{d.model ? ' · ' + d.model : ''}</p></td>
                          <td className={tdCls}><Badge s={d.powers_on} /></td>
                          <td className={tdCls + ' text-xs text-muted-foreground'}>{d.display_status || '—'}</td>
                          <td className={tdCls + ' text-xs text-muted-foreground whitespace-nowrap'}>{d.problem_start || '—'}</td>
                          <td className={tdCls + ' max-w-[200px] text-xs text-muted-foreground'}>{d.description.slice(0, 120)}{d.description.length > 120 ? '…' : ''}</td>
                          <td className={tdCls + ' max-w-[160px] text-xs text-muted-foreground'}>{d.tried || '—'}</td>
                          <td className={tdCls + ' text-xs text-muted-foreground whitespace-nowrap'}>{fmt(d.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}

          {/* APPLICATIONS */}
          {tab === 'applications' && (
            applications.length === 0
              ? <p className="text-center py-16 text-muted-foreground">No job applications yet.</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['#','Status','Name','Contact','Position','Experience','Cover Letter','Resume','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {applications.map(a => (
                        <tr key={a.id} className="hover:bg-muted/30 transition-colors">
                          <td className={tdCls + ' text-muted-foreground'}>{a.id}</td>
                          <td className={tdCls}>
                            <select
                              value={a.status}
                              onChange={e => updateStatus('applications', a.id, e.target.value)}
                              className="text-xs bg-background border border-border rounded-lg px-2 py-1 cursor-pointer"
                            >
                              {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                            </select>
                          </td>
                          <td className={tdCls + ' font-semibold'}>{a.name}</td>
                          <td className={tdCls}>
                            <a href={`tel:${a.phone}`} className="text-green-600 dark:text-green-400 hover:underline text-sm">{a.phone}</a>
                            <p className="text-xs text-muted-foreground">{a.email}</p>
                          </td>
                          <td className={tdCls}><Badge s={a.position.split(' ')[0]} /><p className="text-xs mt-1">{a.position}</p></td>
                          <td className={tdCls + ' text-xs text-muted-foreground'}>{a.experience || '—'}</td>
                          <td className={tdCls + ' max-w-[200px] text-xs text-muted-foreground'}>{a.message.slice(0, 120)}{a.message.length > 120 ? '…' : ''}</td>
                          <td className={tdCls}>
                            {a.resume_original_name
                              ? <button onClick={() => downloadResume(a.id, a.resume_original_name!)}
                                  className="flex items-center gap-1.5 text-xs bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 px-2 py-1 rounded-lg transition-colors">
                                  <Download className="w-3 h-3" /> Download
                                </button>
                              : <span className="text-xs text-muted-foreground">None</span>}
                          </td>
                          <td className={tdCls + ' text-xs text-muted-foreground whitespace-nowrap'}>{fmt(a.created_at)}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
          )}
        </div>
      </main>
    </div>
  );
}
