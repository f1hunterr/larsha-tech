import React, { useState, useEffect, useCallback } from 'react';
import { Lock, LogOut, Loader2, RefreshCw, Download, Search, X, ChevronDown, ChevronUp, MessageCircle, Phone, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { API_URL } from '@/lib/api';

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

function waLink(phone: string, name: string) {
  const clean = phone.replace(/\D/g, '');
  const num = clean.startsWith('91') ? clean : `91${clean}`;
  return `https://wa.me/${num}?text=Hi%20${encodeURIComponent(name)}%2C%20this%20is%20Larsha%20Technologies%20regarding%20your%20request.`;
}

function ContactButtons({ phone, name }: { phone: string; name: string }) {
  return (
    <div className="flex items-center gap-1.5">
      <a href={`tel:${phone}`} className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-slate-800 text-slate-300 hover:bg-slate-700 transition-colors">
        <Phone className="w-3 h-3" /> {phone}
      </a>
      <a href={waLink(phone, name)} target="_blank" rel="noreferrer"
        className="flex items-center gap-1 text-xs px-2 py-1 rounded-lg bg-green-900/40 text-green-400 hover:bg-green-800/60 transition-colors">
        <MessageCircle className="w-3 h-3" /> WhatsApp
      </a>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value?: string | null }) {
  if (!value) return null;
  return (
    <div>
      <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mb-0.5">{label}</p>
      <p className="text-sm text-slate-200">{value}</p>
    </div>
  );
}

function Toast({ msg, onDone }: { msg: string; onDone: () => void }) {
  useEffect(() => {
    const t = setTimeout(onDone, 2500);
    return () => clearTimeout(t);
  }, [onDone]);
  return (
    <div className="fixed bottom-6 right-6 z-50 flex items-center gap-2 bg-slate-800 border border-slate-700 text-white px-4 py-3 rounded-xl shadow-2xl text-sm font-medium">
      <CheckCircle2 className="w-4 h-4 text-green-400 shrink-0" /> {msg}
    </div>
  );
}

export default function AdminPage() {
  const apiUrl = API_URL;

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
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [toast, setToast] = useState('');

  const h = (auth: string) => ({ Authorization: `Basic ${auth}` });

  const fetchAll = useCallback(async (auth: string) => {
    setDataLoading(true);
    try {
      const [bRes, lRes, aRes, dRes] = await Promise.all([
        fetch(`${apiUrl}/api/bookings`,     { headers: h(auth) }),
        fetch(`${apiUrl}/api/leads`,        { headers: h(auth) }),
        fetch(`${apiUrl}/api/applications`, { headers: h(auth) }),
        fetch(`${apiUrl}/api/diagnoses`,    { headers: h(auth) }),
      ]);
      if (!bRes.ok) throw new Error('auth');
      setBookings(  await bRes.json() as Booking[]);
      setLeads(     lRes.ok ? await lRes.json() as Lead[] : []);
      setApplications(aRes.ok ? await aRes.json() as Application[] : []);
      setDiagnoses(   dRes.ok ? await dRes.json() as Diagnosis[] : []);
    } finally {
      setDataLoading(false);
    }
  }, [apiUrl]);

  useEffect(() => {
    if (authHeader) fetchAll(authHeader);
  }, []);

  // Auto-refresh every 2 minutes
  useEffect(() => {
    if (!authHeader) return;
    const id = setInterval(() => fetchAll(authHeader), 120_000);
    return () => clearInterval(id);
  }, [authHeader, fetchAll]);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoginLoading(true);
    setLoginError('');
    const auth = btoa(`${loginForm.username}:${loginForm.password}`);
    try {
      const res = await fetch(`${apiUrl}/api/bookings`, { headers: h(auth) });
      if (res.status === 401) { setLoginError('Invalid username or password.'); setLoginLoading(false); return; }
      if (!res.ok) throw new Error('server');
      sessionStorage.setItem('admin-auth', auth);
      setAuthHeader(auth);
      setBookings(await res.json() as Booking[]);
      const [lRes, aRes, dRes] = await Promise.all([
        fetch(`${apiUrl}/api/leads`,        { headers: h(auth) }),
        fetch(`${apiUrl}/api/applications`, { headers: h(auth) }),
        fetch(`${apiUrl}/api/diagnoses`,    { headers: h(auth) }),
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
      method: 'PATCH', headers: { ...h(authHeader), 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    setToast(`Status updated to "${status}"`);
    fetchAll(authHeader);
  };

  const downloadResume = async (id: number, filename: string) => {
    if (!authHeader) return;
    const res = await fetch(`${apiUrl}/api/applications/${id}/resume`, { headers: h(authHeader) });
    if (!res.ok) return;
    const blob = await res.blob();
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url; a.download = filename; a.click();
    URL.revokeObjectURL(url);
  };

  const q = search.toLowerCase().trim();
  const filterRows = <T extends { name: string; phone: string }>(rows: T[]) =>
    q ? rows.filter(r => r.name.toLowerCase().includes(q) || r.phone.includes(q)) : rows;

  const toggleExpand = (id: number) => setExpandedId(prev => prev === id ? null : id);

  // ── Login screen ─────────────────────────────────────────────────────────────
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
    `px-5 py-2.5 text-sm font-semibold rounded-lg transition-colors ${tab === t ? 'bg-blue-600 text-white' : 'text-slate-400 hover:text-white hover:bg-slate-800'}`;

  const thCls = 'text-left px-4 py-3 text-xs font-semibold text-slate-400 uppercase tracking-wider bg-slate-900/50';
  const tdCls = 'px-4 py-3 text-sm border-t border-slate-800 align-top';

  // ── Dashboard ─────────────────────────────────────────────────────────────────
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100">
      {toast && <Toast msg={toast} onDone={() => setToast('')} />}

      {/* Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-6 py-4 flex items-center gap-4 sticky top-0 z-40">
        <div className="flex items-center gap-2">
          <span className="w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm flex-shrink-0">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className="font-black text-white">Larsha <span className="text-blue-400">Tech</span></span>
          <span className="text-xs bg-blue-900/60 text-blue-300 px-2 py-0.5 rounded-full font-bold">Admin</span>
        </div>
        <div className="ml-auto flex items-center gap-3">
          <span className="text-xs text-slate-500 hidden sm:block">Auto-refresh: 2 min</span>
          <button onClick={() => fetchAll(authHeader)} className="text-slate-400 hover:text-white transition-colors" title="Refresh now">
            <RefreshCw className={`w-4 h-4 ${dataLoading ? 'animate-spin' : ''}`} />
          </button>
          <button onClick={logout} className="flex items-center gap-1.5 text-sm text-slate-400 hover:text-red-400 transition-colors">
            <LogOut className="w-4 h-4" /> <span className="hidden sm:inline">Logout</span>
          </button>
        </div>
      </header>

      <main className="p-4 sm:p-6 max-w-7xl mx-auto">

        {/* Stats */}
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 mb-6">
          {[
            { label: 'Total Leads',    value: leads.length,                                            color: '' },
            { label: 'Total Bookings', value: bookings.length,                                         color: '' },
            { label: 'New Bookings',   value: bookings.filter(b => b.status === 'new').length,         color: 'text-blue-400' },
            { label: 'Diagnoses',      value: diagnoses.length,                                        color: '' },
            { label: 'Pending Diag.',  value: diagnoses.filter(d => d.status === 'pending').length,    color: 'text-pink-400' },
            { label: 'Total Apps',     value: applications.length,                                     color: '' },
            { label: 'New Apps',       value: applications.filter(a => a.status === 'new').length,     color: 'text-indigo-400' },
            { label: 'Shortlisted',    value: applications.filter(a => a.status === 'shortlisted').length, color: 'text-green-400' },
          ].map(s => (
            <div key={s.label} className="bg-slate-900 border border-slate-800 rounded-xl p-4 text-center">
              <p className={`text-2xl font-black ${s.color || 'text-white'}`}>{s.value}</p>
              <p className="text-xs text-slate-500 mt-0.5">{s.label}</p>
            </div>
          ))}
        </div>

        {/* Tabs + Search */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-3 mb-4">
          <div className="flex flex-wrap gap-2">
            <button className={tabClass('bookings')}     onClick={() => { setTab('bookings');     setSearch(''); setExpandedId(null); }}>Bookings ({bookings.length})</button>
            <button className={tabClass('leads')}        onClick={() => { setTab('leads');        setSearch(''); setExpandedId(null); }}>Leads ({leads.length})</button>
            <button className={tabClass('diagnoses')}    onClick={() => { setTab('diagnoses');    setSearch(''); setExpandedId(null); }}>Diagnoses ({diagnoses.length})</button>
            <button className={tabClass('applications')} onClick={() => { setTab('applications'); setSearch(''); setExpandedId(null); }}>Applications ({applications.length})</button>
          </div>
          <div className="sm:ml-auto relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-500" />
            <input
              value={search}
              onChange={e => setSearch(e.target.value)}
              placeholder="Search name or phone…"
              className="pl-9 pr-8 py-2 text-sm bg-slate-900 border border-slate-700 rounded-lg text-white placeholder-slate-500 outline-none focus:border-blue-500 w-56 transition-colors"
            />
            {search && (
              <button onClick={() => setSearch('')} className="absolute right-2.5 top-1/2 -translate-y-1/2 text-slate-500 hover:text-white">
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>

        {/* Tables */}
        <div className="bg-slate-900 border border-slate-800 rounded-2xl overflow-hidden">

          {/* ── BOOKINGS ─────────────────────────────── */}
          {tab === 'bookings' && (() => {
            const rows = filterRows(bookings);
            return rows.length === 0
              ? <p className="text-center py-16 text-slate-500">{search ? 'No results found.' : 'No bookings yet.'}</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['','#','Status','Customer','Device','Issue','Urgency','Mode','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rows.map(b => (
                        <React.Fragment key={b.id}>
                          <tr className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleExpand(b.id)}>
                            <td className={tdCls + ' w-8'}>
                              {expandedId === b.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </td>
                            <td className={tdCls + ' text-slate-500 text-xs'}>{b.id}</td>
                            <td className={tdCls} onClick={e => e.stopPropagation()}>
                              <select value={b.status} onChange={e => updateStatus('bookings', b.id, e.target.value)}
                                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 cursor-pointer text-white">
                                {BOOKING_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className={tdCls}>
                              <p className="font-semibold text-white">{b.name}</p>
                              {b.email && <p className="text-xs text-slate-500">{b.email}</p>}
                            </td>
                            <td className={tdCls}><p className="font-medium">{b.device_type}</p><p className="text-xs text-slate-500">{b.brand}{b.model ? ' · ' + b.model : ''}</p></td>
                            <td className={tdCls + ' max-w-[160px]'}><p className="text-sm text-slate-300 truncate">{b.issue}</p></td>
                            <td className={tdCls}><Badge s={b.urgency} /></td>
                            <td className={tdCls}><Badge s={b.service_mode} /></td>
                            <td className={tdCls + ' text-xs text-slate-500 whitespace-nowrap'}>{fmt(b.created_at)}</td>
                          </tr>
                          {expandedId === b.id && (
                            <tr className="bg-slate-800/60">
                              <td colSpan={9} className="px-6 py-5">
                                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4 mb-4">
                                  <DetailRow label="Full Issue" value={b.issue} />
                                  <DetailRow label="Address" value={b.address} />
                                  <DetailRow label="Preferred Date" value={b.preferred_date} />
                                  <DetailRow label="Preferred Slot" value={b.preferred_slot} />
                                </div>
                                <ContactButtons phone={b.phone} name={b.name} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>;
          })()}

          {/* ── LEADS ────────────────────────────────── */}
          {tab === 'leads' && (() => {
            const rows = filterRows(leads);
            return rows.length === 0
              ? <p className="text-center py-16 text-slate-500">{search ? 'No results found.' : 'No leads yet.'}</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['','#','Name','Contact','Service','Message','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rows.map(l => (
                        <React.Fragment key={l.id}>
                          <tr className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleExpand(l.id)}>
                            <td className={tdCls + ' w-8'}>
                              {expandedId === l.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </td>
                            <td className={tdCls + ' text-slate-500 text-xs'}>{l.id}</td>
                            <td className={tdCls + ' font-semibold text-white'}>{l.name}</td>
                            <td className={tdCls} onClick={e => e.stopPropagation()}><ContactButtons phone={l.phone} name={l.name} /></td>
                            <td className={tdCls}><Badge s={l.service} /></td>
                            <td className={tdCls + ' max-w-[220px] text-slate-400 text-xs'}>{l.message.slice(0, 80)}{l.message.length > 80 ? '…' : ''}</td>
                            <td className={tdCls + ' text-xs text-slate-500 whitespace-nowrap'}>{fmt(l.created_at)}</td>
                          </tr>
                          {expandedId === l.id && (
                            <tr className="bg-slate-800/60">
                              <td colSpan={7} className="px-6 py-5">
                                <DetailRow label="Full Message" value={l.message} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>;
          })()}

          {/* ── DIAGNOSES ────────────────────────────── */}
          {tab === 'diagnoses' && (() => {
            const rows = filterRows(diagnoses);
            return rows.length === 0
              ? <p className="text-center py-16 text-slate-500">{search ? 'No results found.' : 'No diagnosis requests yet.'}</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['','#','Status','Customer','Device','Powers On','Problem Start','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rows.map(d => (
                        <React.Fragment key={d.id}>
                          <tr className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleExpand(d.id)}>
                            <td className={tdCls + ' w-8'}>
                              {expandedId === d.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </td>
                            <td className={tdCls + ' text-slate-500 text-xs'}>{d.id}</td>
                            <td className={tdCls} onClick={e => e.stopPropagation()}>
                              <select value={d.status} onChange={e => updateStatus('diagnoses', d.id, e.target.value)}
                                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 cursor-pointer text-white">
                                {DIAG_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className={tdCls}>
                              <p className="font-semibold text-white">{d.name}</p>
                              {d.email && <p className="text-xs text-slate-500">{d.email}</p>}
                            </td>
                            <td className={tdCls}><p className="font-medium">{d.device_type}</p><p className="text-xs text-slate-500">{d.brand}{d.model ? ' · ' + d.model : ''}</p></td>
                            <td className={tdCls}><Badge s={d.powers_on} /></td>
                            <td className={tdCls + ' text-xs text-slate-500'}>{d.problem_start || '—'}</td>
                            <td className={tdCls + ' text-xs text-slate-500 whitespace-nowrap'}>{fmt(d.created_at)}</td>
                          </tr>
                          {expandedId === d.id && (
                            <tr className="bg-slate-800/60">
                              <td colSpan={8} className="px-6 py-5">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 mb-4">
                                  <DetailRow label="Description" value={d.description} />
                                  <DetailRow label="Display Status" value={d.display_status} />
                                  <DetailRow label="Sounds" value={d.sounds} />
                                  <DetailRow label="Error Messages" value={d.error_messages} />
                                  <DetailRow label="What was tried" value={d.tried} />
                                </div>
                                <ContactButtons phone={d.phone} name={d.name} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>;
          })()}

          {/* ── APPLICATIONS ─────────────────────────── */}
          {tab === 'applications' && (() => {
            const rows = filterRows(applications);
            return rows.length === 0
              ? <p className="text-center py-16 text-slate-500">{search ? 'No results found.' : 'No job applications yet.'}</p>
              : <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead><tr>
                      {['','#','Status','Name','Contact','Position','Experience','Resume','Date'].map(h => <th key={h} className={thCls}>{h}</th>)}
                    </tr></thead>
                    <tbody>
                      {rows.map(a => (
                        <React.Fragment key={a.id}>
                          <tr className="hover:bg-slate-800/50 transition-colors cursor-pointer" onClick={() => toggleExpand(a.id)}>
                            <td className={tdCls + ' w-8'}>
                              {expandedId === a.id ? <ChevronUp className="w-4 h-4 text-slate-500" /> : <ChevronDown className="w-4 h-4 text-slate-500" />}
                            </td>
                            <td className={tdCls + ' text-slate-500 text-xs'}>{a.id}</td>
                            <td className={tdCls} onClick={e => e.stopPropagation()}>
                              <select value={a.status} onChange={e => updateStatus('applications', a.id, e.target.value)}
                                className="text-xs bg-slate-800 border border-slate-700 rounded-lg px-2 py-1 cursor-pointer text-white">
                                {APP_STATUSES.map(s => <option key={s} value={s}>{s}</option>)}
                              </select>
                            </td>
                            <td className={tdCls + ' font-semibold text-white'}>{a.name}</td>
                            <td className={tdCls} onClick={e => e.stopPropagation()}><ContactButtons phone={a.phone} name={a.name} /></td>
                            <td className={tdCls}><Badge s={a.position.split(' ')[0]} /><p className="text-xs mt-1 text-slate-400">{a.position}</p></td>
                            <td className={tdCls + ' text-xs text-slate-400'}>{a.experience || '—'}</td>
                            <td className={tdCls}>
                              {a.resume_original_name
                                ? <button onClick={e => { e.stopPropagation(); downloadResume(a.id, a.resume_original_name!); }}
                                    className="flex items-center gap-1.5 text-xs bg-blue-900/40 text-blue-300 hover:bg-blue-800/60 px-2 py-1 rounded-lg transition-colors">
                                    <Download className="w-3 h-3" /> Download
                                  </button>
                                : <span className="text-xs text-slate-500">None</span>}
                            </td>
                            <td className={tdCls + ' text-xs text-slate-500 whitespace-nowrap'}>{fmt(a.created_at)}</td>
                          </tr>
                          {expandedId === a.id && (
                            <tr className="bg-slate-800/60">
                              <td colSpan={9} className="px-6 py-5">
                                <div className="mb-4">
                                  <DetailRow label="Cover Letter" value={a.message} />
                                </div>
                                <ContactButtons phone={a.phone} name={a.name} />
                              </td>
                            </tr>
                          )}
                        </React.Fragment>
                      ))}
                    </tbody>
                  </table>
                </div>;
          })()}

        </div>
      </main>
    </div>
  );
}
