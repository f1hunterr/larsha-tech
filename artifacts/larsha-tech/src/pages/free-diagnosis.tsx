import React, { useState } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { CheckCircle, CheckCircle2, ChevronLeft, Loader2, Stethoscope } from 'lucide-react';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/sections/Navbar';

const VITE_API_URL = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

const DEVICE_TYPES = ['Laptop', 'Desktop', 'MacBook / iMac', 'All-in-One PC', 'Other'];
const POWERS_ON_OPTIONS = ['Yes, powers on normally', 'Yes, but with issues', 'Sometimes / Intermittent', 'No, does not power on'];
const DISPLAY_OPTIONS = ['Yes, display is normal', 'Display has issues (flickering, lines, dim)', 'No display at all', 'N/A — Desktop without monitor issue'];
const SOUNDS_OPTIONS = ['No unusual sounds', 'Loud fan / overheating', 'Beeping on startup', 'Clicking or grinding', 'Other sounds'];
const PROBLEM_START_OPTIONS = ['Just now / Today', 'A few days ago', 'This week', 'This month', 'More than a month ago', 'Not sure'];

interface Form {
  name: string; phone: string; email: string;
  deviceType: string; brand: string; model: string;
  powersOn: string; displayStatus: string; sounds: string;
  errorMessages: string; problemStart: string;
  description: string; tried: string;
}

const EMPTY: Form = {
  name: '', phone: '', email: '',
  deviceType: '', brand: '', model: '',
  powersOn: '', displayStatus: '', sounds: '',
  errorMessages: '', problemStart: '',
  description: '', tried: '',
};

export default function FreeDiagnosis() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<Form>(EMPTY);

  usePageMeta({
    title: 'Free Computer Diagnosis — Larsha Tech',
    description: 'Get a free diagnosis for your laptop or computer problem in Bangalore. Describe your issue and our technician will contact you within hours. No charge, no commitment.',
    path: '/free-diagnosis',
  });
  const [errors, setErrors] = useState<Partial<Form>>({});
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [apiError, setApiError] = useState('');
  const [success, setSuccess] = useState<{ id: number; name: string } | null>(null);

  const set = (key: keyof Form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm(p => ({ ...p, [key]: e.target.value }));

  const validate = (): boolean => {
    const e: Partial<Form> = {};
    if (!form.name.trim())        e.name       = 'Name is required';
    if (!form.phone.trim())       e.phone      = 'Phone is required';
    else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))
                                  e.phone      = 'Enter a valid 10-digit Indian mobile number';
    if (!form.deviceType)         e.deviceType = 'Select a device type';
    if (!form.brand.trim())       e.brand      = 'Brand is required';
    if (!form.powersOn)           e.powersOn   = 'Please answer this question';
    if (!form.description.trim()) e.description = 'Please describe the problem';
    setErrors(e);
    return Object.keys(e).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    setLoading(true);
    setApiError('');
    try {
      const res = await fetch(`${VITE_API_URL}/api/diagnoses`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name.trim(),
          phone: form.phone.replace(/\s/g, ''),
          email: form.email.trim(),
          deviceType: form.deviceType,
          brand: form.brand.trim(),
          model: form.model.trim(),
          powersOn: form.powersOn,
          displayStatus: form.displayStatus,
          sounds: form.sounds,
          errorMessages: form.errorMessages.trim(),
          problemStart: form.problemStart,
          description: form.description.trim(),
          tried: form.tried.trim(),
        }),
      });
      const data = await res.json() as { id?: number; error?: string };
      if (!res.ok) { setApiError(data.error ?? 'Something went wrong. Please try again.'); return; }
      setSuccess({ id: data.id!, name: form.name.trim() });
    } catch {
      setApiError('Could not reach the server. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  if (success) {
    return (
      <div className="min-h-screen bg-background flex flex-col">
        <Navbar />
        <div className="flex-1 flex items-center justify-center px-4 pt-20 pb-16">
          <div className="max-w-md w-full text-center">
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center mx-auto mb-6">
              <CheckCircle className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h1 className="text-2xl font-black text-foreground mb-2">Request Submitted!</h1>
            <p className="text-muted-foreground mb-1">
              Thank you, <strong>{success.name}</strong>. Your free diagnosis request <strong>#{success.id}</strong> has been received.
            </p>
            <p className="text-muted-foreground text-sm mb-8">
              Our technician will review your answers and call you back within a few hours.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button onClick={() => navigate('/')}>Back to Home</Button>
              <Button variant="outline" onClick={() => { setSuccess(null); setForm(EMPTY); }}>Submit Another</Button>
            </div>
          </div>
        </div>
      </div>
    );
  }

  const fieldCls = (key: keyof Form) =>
    `w-full px-4 py-3 rounded-xl bg-background border text-sm outline-none transition-colors ${
      errors[key] ? 'border-destructive focus:border-destructive' : 'border-input focus:border-primary'
    }`;

  const labelCls = 'block text-sm font-semibold text-foreground mb-1.5';
  const errCls   = 'text-xs text-destructive mt-1';
  const sectionCls = 'bg-card border rounded-2xl p-6 space-y-5';
  const sectionHead = 'text-base font-black text-foreground mb-4 pb-3 border-b flex items-center gap-2';

  return (
    <div className="min-h-screen bg-background flex flex-col">
      <Navbar />

      {/* Hero — pt-30 = pt-16 (fixed navbar) + pt-14 (design padding) */}
      <div className="bg-slate-950 text-white pt-[7.5rem] pb-14 px-4 text-center">
        <div className="inline-flex items-center gap-2 bg-pink-500/20 text-pink-300 text-xs font-bold px-3 py-1 rounded-full mb-4">
          <Stethoscope className="w-3.5 h-3.5" /> FREE SERVICE
        </div>
        <h1 className="text-3xl sm:text-4xl font-black mb-3">Get a Free Diagnosis</h1>
        <p className="text-slate-400 max-w-lg mx-auto text-sm">
          Answer a few quick questions about your device and problem. Our technician will review your case and call you back — at no charge.
        </p>
      </div>

      <main className="flex-1 max-w-2xl mx-auto w-full px-4 py-10 space-y-6">
        <form onSubmit={handleSubmit} noValidate className="space-y-6">

          {/* Section 1 — Your Details */}
          <div className={sectionCls}>
            <h2 className={sectionHead}>Your Details</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Full Name <span className="text-destructive">*</span></label>
                <input className={fieldCls('name')} placeholder="e.g. Rahul Sharma" value={form.name} onChange={set('name')} maxLength={100} />
                {errors.name && <p className={errCls}>{errors.name}</p>}
              </div>
              <div>
                <label className={labelCls}>Phone Number <span className="text-destructive">*</span></label>
                <div className="relative">
                  <input
                    className={`${fieldCls('phone')} pr-10`}
                    placeholder="10-digit mobile number"
                    value={form.phone}
                    onChange={set('phone')}
                    onBlur={() => setPhoneTouched(true)}
                    maxLength={10}
                    inputMode="tel"
                  />
                  {/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')) && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
                  )}
                </div>
                {(errors.phone || (phoneTouched && form.phone.length > 0 && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))) && (
                  <p className={errCls}>{errors.phone ?? 'Enter a valid 10-digit Indian mobile number'}</p>
                )}
              </div>
            </div>
            <div>
              <label className={labelCls}>Email <span className="text-muted-foreground text-xs font-normal">(optional)</span></label>
              <input className={fieldCls('email')} placeholder="you@example.com" value={form.email} onChange={set('email')} maxLength={120} type="email" />
            </div>
          </div>

          {/* Section 2 — Device Info */}
          <div className={sectionCls}>
            <h2 className={sectionHead}>About Your Device</h2>
            <div className="grid sm:grid-cols-2 gap-5">
              <div>
                <label className={labelCls}>Device Type <span className="text-destructive">*</span></label>
                <select className={fieldCls('deviceType')} value={form.deviceType} onChange={set('deviceType')}>
                  <option value="">Select type…</option>
                  {DEVICE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                </select>
                {errors.deviceType && <p className={errCls}>{errors.deviceType}</p>}
              </div>
              <div>
                <label className={labelCls}>Brand <span className="text-destructive">*</span></label>
                <input className={fieldCls('brand')} placeholder="e.g. Dell, HP, Lenovo, Apple" value={form.brand} onChange={set('brand')} maxLength={50} />
                {errors.brand && <p className={errCls}>{errors.brand}</p>}
              </div>
            </div>
            <div>
              <label className={labelCls}>Model <span className="text-muted-foreground text-xs font-normal">(optional)</span></label>
              <input className={fieldCls('model')} placeholder="e.g. Inspiron 15, ThinkPad E14" value={form.model} onChange={set('model')} maxLength={80} />
            </div>
          </div>

          {/* Section 3 — Diagnostic Q&A */}
          <div className={sectionCls}>
            <h2 className={sectionHead}>Diagnostic Questions</h2>

            <div>
              <label className={labelCls}>Does your device power on? <span className="text-destructive">*</span></label>
              <div className="space-y-2">
                {POWERS_ON_OPTIONS.map(opt => (
                  <label key={opt} className="flex items-center gap-3 p-3 rounded-xl border border-input hover:border-primary hover:bg-muted/40 transition-colors cursor-pointer">
                    <input type="radio" name="powersOn" value={opt} checked={form.powersOn === opt} onChange={set('powersOn')} className="accent-primary" />
                    <span className="text-sm">{opt}</span>
                  </label>
                ))}
              </div>
              {errors.powersOn && <p className={errCls}>{errors.powersOn}</p>}
            </div>

            <div>
              <label className={labelCls}>Is the display working?</label>
              <select className={fieldCls('displayStatus')} value={form.displayStatus} onChange={set('displayStatus')}>
                <option value="">Select…</option>
                {DISPLAY_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Any unusual sounds from the device?</label>
              <select className={fieldCls('sounds')} value={form.sounds} onChange={set('sounds')}>
                <option value="">Select…</option>
                {SOUNDS_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>

            <div>
              <label className={labelCls}>Any error messages shown? <span className="text-muted-foreground text-xs font-normal">(optional)</span></label>
              <input className={fieldCls('errorMessages')} placeholder="e.g. Blue screen, 'No boot device found', etc." value={form.errorMessages} onChange={set('errorMessages')} maxLength={300} />
            </div>

            <div>
              <label className={labelCls}>When did the problem start?</label>
              <select className={fieldCls('problemStart')} value={form.problemStart} onChange={set('problemStart')}>
                <option value="">Select…</option>
                {PROBLEM_START_OPTIONS.map(o => <option key={o} value={o}>{o}</option>)}
              </select>
            </div>
          </div>

          {/* Section 4 — Problem Description */}
          <div className={sectionCls}>
            <h2 className={sectionHead}>Describe the Problem</h2>
            <div>
              <label className={labelCls}>What is happening? <span className="text-destructive">*</span></label>
              <textarea
                className={fieldCls('description')}
                rows={4}
                placeholder="Describe the issue in as much detail as possible…"
                value={form.description}
                onChange={set('description')}
                maxLength={2000}
              />
              {errors.description && <p className={errCls}>{errors.description}</p>}
              <p className="text-xs text-muted-foreground mt-1 text-right">{form.description.length}/2000</p>
            </div>
            <div>
              <label className={labelCls}>What have you already tried? <span className="text-muted-foreground text-xs font-normal">(optional)</span></label>
              <textarea
                className={fieldCls('tried')}
                rows={2}
                placeholder="e.g. Restarted, updated drivers, reinstalled Windows…"
                value={form.tried}
                onChange={set('tried')}
                maxLength={500}
              />
            </div>
          </div>

          {apiError && (
            <div className="bg-destructive/10 border border-destructive/30 text-destructive text-sm px-4 py-3 rounded-xl">
              {apiError}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3">
            <Button type="button" variant="outline" onClick={() => navigate('/')} className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" /> Back
            </Button>
            <Button type="submit" className="flex-1 h-12 bg-pink-600 hover:bg-pink-700 text-white font-bold" disabled={loading}>
              {loading
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
                : <><Stethoscope className="w-4 h-4 mr-2" /> Submit for Free Diagnosis</>}
            </Button>
          </div>
        </form>
      </main>
    </div>
  );
}
