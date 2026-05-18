import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '@/hooks/usePageMeta';
import {
  ArrowLeft, Loader2, CheckCircle2, PhoneCall,
  Laptop, Monitor, MapPin, Clock, Calendar,
  ImagePlus, X,
} from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/sections/Navbar';

// ─── Data ──────────────────────────────────────────────────────────────────────

const DEVICE_TYPES = ['Laptop', 'Desktop PC', 'Mac / MacBook', 'Tablet', 'Other'];

const DEVICE_BRANDS: Record<string, string[]> = {
  'Laptop':        ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Samsung', 'MSI', 'Other'],
  'Desktop PC':    ['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'MSI', 'Other'],
  'Mac / MacBook': ['Apple'],
  'Tablet':        ['Apple (iPad)', 'Samsung', 'Lenovo', 'ASUS', 'Other'],
  'Other':         ['Other'],
};

const BRAND_MODELS: Record<string, string[]> = {
  'Dell':          ['Inspiron', 'XPS', 'Latitude', 'Vostro', 'G-Series Gaming', 'Other'],
  'HP':            ['Pavilion', 'Envy', 'ProBook', 'EliteBook', 'Omen Gaming', 'Other'],
  'Lenovo':        ['IdeaPad', 'ThinkPad', 'Legion', 'Yoga', 'Other'],
  'ASUS':          ['VivoBook', 'ZenBook', 'ROG', 'TUF Gaming', 'ExpertBook', 'Other'],
  'Acer':          ['Aspire', 'Swift', 'Nitro', 'Predator', 'Other'],
  'Samsung':       ['Galaxy Book', 'Galaxy Tab S', 'Galaxy Tab A', 'Other'],
  'MSI':           ['GS Series', 'GE Series', 'GP Series', 'Creator', 'Stealth', 'Other'],
  'Apple':         ['MacBook Air (M1)', 'MacBook Air (M2)', 'MacBook Air (M3)', 'MacBook Pro 13"', 'MacBook Pro 14"', 'MacBook Pro 16"', 'iMac', 'Mac Mini', 'Mac Studio', 'Other'],
  'Apple (iPad)':  ['iPad (standard)', 'iPad Air', 'iPad Pro 11"', 'iPad Pro 13"', 'iPad Mini', 'Other'],
  'Other':         [],
};

const DEVICE_AGES = ['Less than 1 year', '1–2 years', '3–5 years', '5+ years', 'Not sure'];
const ISSUES = [
  'Slow Performance / Freezing',
  "Won't Turn On / No Power",
  'Blue Screen / Frequent Crashes',
  'Virus / Malware Infection',
  'Broken Screen / Display Issue',
  'Keyboard or Touchpad Not Working',
  'Battery / Charging Problem',
  'Overheating / Fan Noise',
  'OS Reinstall / Software Setup',
  'SSD or RAM Upgrade',
  'Data Recovery',
  'Water Damage',
  'Other / Not Sure',
];
const URGENCY_OPTIONS = [
  { value: 'today',    label: 'Today — Urgent!',     desc: 'Need it fixed ASAP'          },
  { value: '2-3days',  label: 'Within 2–3 days',     desc: 'Can wait a couple of days'   },
  { value: 'thisweek', label: 'This week',            desc: 'Sometime before the weekend' },
  { value: 'flexible', label: 'Flexible',             desc: 'No rush, any time works'     },
];
const SERVICE_MODES = [
  { value: 'doorstep', icon: MapPin,  label: 'Doorstep Visit',       desc: 'We come to your home or office in Bangalore' },
  { value: 'dropoff',  icon: Laptop,  label: 'Drop-off at Workshop', desc: 'You bring the device to our workshop'        },
  { value: 'remote',   icon: Monitor, label: 'Remote Support',       desc: 'Online fix via secure screen sharing'        },
];
const TIME_SLOTS = ['Morning  (9 am – 12 pm)', 'Afternoon  (12 pm – 3 pm)', 'Evening  (3 pm – 7 pm)'];

const PHONE_RE = /^[6-9]\d{9}$/;

// ─── Form state ────────────────────────────────────────────────────────────────

interface FormState {
  deviceType: string; brand: string; model: string; deviceAge: string;
  issue: string; description: string; urgency: string;
  serviceMode: string; address: string; preferredDate: string; preferredSlot: string;
  name: string; phone: string; email: string;
}

type Errors = Partial<Record<keyof FormState, string>>;

const EMPTY: FormState = {
  deviceType: '', brand: '', model: '', deviceAge: '',
  issue: '', description: '', urgency: '',
  serviceMode: '', address: '', preferredDate: '', preferredSlot: '',
  name: '', phone: '', email: '',
};

function validate(f: FormState): Errors {
  const e: Errors = {};
  if (!f.deviceType) e.deviceType = 'Please select your device type';
  const brandsForDevice = DEVICE_BRANDS[f.deviceType] ?? [];
  if (brandsForDevice.length > 1 && !f.brand) e.brand = 'Please select the brand';
  if (!f.issue)      e.issue       = 'Please select the main issue';
  if (!f.description.trim()) e.description = 'Please describe the problem';
  if (!f.urgency)    e.urgency     = 'Please select urgency';
  if (!f.serviceMode) e.serviceMode = 'Please choose a service option';
  if (f.serviceMode === 'doorstep' && !f.address.trim())
    e.address = 'Please enter your address or area for doorstep service';
  if (!f.name.trim()) e.name = 'Your name is required';
  if (!f.phone.trim()) {
    e.phone = 'Phone number is required';
  } else if (!PHONE_RE.test(f.phone.replace(/\s/g, ''))) {
    e.phone = 'Enter a valid 10-digit Indian mobile number';
  }
  return e;
}

// ─── Sub-components ────────────────────────────────────────────────────────────

function SectionTitle({ step, title, subtitle }: { step: number; title: string; subtitle?: string }) {
  return (
    <div className="flex items-start gap-4 mb-6">
      <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground text-sm font-black shrink-0 mt-0.5">
        {step}
      </div>
      <div>
        <h3 className="font-black text-lg">{title}</h3>
        {subtitle && <p className="text-muted-foreground text-sm mt-0.5">{subtitle}</p>}
      </div>
    </div>
  );
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-destructive text-xs mt-1">{msg}</p>;
}

const inputCls = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary ${
    err ? 'border-destructive' : 'border-input'
  }`;

// ─── Page ──────────────────────────────────────────────────────────────────────

export default function BookRepair() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>(EMPTY);

  usePageMeta({
    title: 'Book a Repair',
    description: 'Book a same-day laptop or computer repair in Bangalore. Free diagnosis, no hidden fees. Drop off or doorstep service available — call +91 80884 61724.',
    path: '/book-repair',
  });

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const [photos, setPhotos] = useState<Array<{ file: File; url: string }>>([]);
  const [errors, setErrors] = useState<Errors>({});
  const [phoneTouched, setPhoneTouched] = useState(false);
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [bookingId, setBookingId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const photoRef = useRef<HTMLInputElement>(null);
  const photosRef = useRef(photos);
  photosRef.current = photos;

  // Revoke object URLs on unmount to avoid memory leaks
  useEffect(() => {
    return () => photosRef.current.forEach(p => URL.revokeObjectURL(p.url));
  }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const pick = (field: keyof FormState, value: string) => {
    setForm(prev => {
      const next = { ...prev, [field]: value };
      if (field === 'deviceType') { next.brand = ''; next.model = ''; }
      if (field === 'brand')      { next.model = ''; }
      return next;
    });
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const availableBrands = form.deviceType ? (DEVICE_BRANDS[form.deviceType] ?? []) : [];
  const availableModels = form.brand ? (BRAND_MODELS[form.brand] ?? []) : [];

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = Array.from(e.target.files ?? []);
    const items = files.map(f => ({ file: f, url: URL.createObjectURL(f) }));
    setPhotos(prev => {
      const combined = [...prev, ...items];
      if (combined.length > 3) combined.slice(3).forEach(p => URL.revokeObjectURL(p.url));
      return combined.slice(0, 3);
    });
    if (photoRef.current) photoRef.current.value = '';
  };

  const removePhoto = (i: number) => {
    setPhotos(prev => {
      URL.revokeObjectURL(prev[i].url);
      return prev.filter((_, j) => j !== i);
    });
  };

  // Real-time phone validation state
  const phoneRaw    = form.phone.replace(/\s/g, '');
  const phoneValid  = PHONE_RE.test(phoneRaw);
  const showPhoneOk = phoneValid;
  const showPhoneErr = phoneTouched && phoneRaw.length > 0 && !phoneValid;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setPhoneTouched(true);
    const errs = validate(form);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0] as keyof FormState;
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';

    try {
      const fd = new FormData();
      fd.append('deviceType',    form.deviceType);
      fd.append('brand',         form.brand);
      fd.append('model',         form.model);
      fd.append('deviceAge',     form.deviceAge);
      fd.append('issue',         form.issue);
      fd.append('description',   form.description);
      fd.append('urgency',       form.urgency);
      fd.append('serviceMode',   form.serviceMode);
      fd.append('address',       form.address);
      fd.append('preferredDate', form.preferredDate);
      fd.append('preferredSlot', form.preferredSlot);
      fd.append('name',          form.name);
      fd.append('phone',         form.phone);
      fd.append('email',         form.email);
      photos.forEach(p => fd.append('photos', p.file));

      const res = await fetch(`${apiUrl}/api/bookings`, { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again or call us directly.');
        return;
      }
      const data = await res.json() as { id: number };
      setBookingId(data.id);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
      setErrorMsg('Could not reach the server. Please check your connection or call us directly.');
    }
  };

  const today = new Date().toISOString().split('T')[0];

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero header — pt-28 = pt-16 (fixed navbar) + pt-12 (design padding) */}
      <div className="bg-slate-950 pt-28 pb-14 px-4 relative overflow-hidden">
        <div className="absolute top-0 left-1/4 w-[500px] h-[300px] bg-blue-600/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto relative z-10 max-w-2xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <p className="text-blue-400 font-bold text-xs uppercase tracking-widest mb-3">Repair Booking</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Book a Repair
          </h1>
          <p className="text-slate-400 text-base leading-relaxed">
            Fill in the details below. We'll confirm your booking within 1 hour .
          </p>
        </div>
      </div>

      {/* Form */}
      <div className="container mx-auto px-4 py-10 max-w-2xl">
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-3xl p-10 text-center shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-black mb-3">Booking Confirmed!</h2>
            {bookingId && (
              <p className="text-xs font-mono text-muted-foreground mb-2">Booking #{bookingId}</p>
            )}
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
              Your repair request has been saved. We'll call you on <strong>{form.phone}</strong> to confirm your slot within <strong>1 hour</strong> .
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => { setForm(EMPTY); setPhotos([]); setStatus('idle'); setBookingId(null); setPhoneTouched(false); }}>
                Book Another Repair
              </Button>
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </motion.div>
        ) : (
          <form onSubmit={handleSubmit} noValidate className="space-y-6">

            {/* ── Section 1: Device ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.05 }}
              className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <SectionTitle step={1} title="Your Device" subtitle="Tell us what we're working with" />

              <div className="space-y-5">
                {/* Device type */}
                <div id="field-deviceType">
                  <label className="block text-sm font-semibold mb-2">Device Type <span className="text-destructive">*</span></label>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                    {DEVICE_TYPES.map(t => (
                      <button
                        key={t} type="button"
                        onClick={() => pick('deviceType', t)}
                        className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all text-left ${
                          form.deviceType === t
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background border-input hover:border-primary/50 text-foreground'
                        }`}
                      >
                        {t}
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.deviceType} />
                </div>

                {/* Brand */}
                {availableBrands.length > 0 && (
                  <motion.div
                    key={form.deviceType}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    id="field-brand"
                  >
                    <label className="block text-sm font-semibold mb-2">Brand <span className="text-destructive">*</span></label>
                    <div className="grid grid-cols-3 sm:grid-cols-4 gap-2">
                      {availableBrands.map(b => (
                        <button
                          key={b} type="button"
                          onClick={() => pick('brand', b)}
                          className={`px-3 py-2.5 rounded-xl border text-sm font-medium transition-all ${
                            form.brand === b
                              ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                              : 'bg-background border-input hover:border-primary/50'
                          }`}
                        >
                          {b}
                        </button>
                      ))}
                    </div>
                    <FieldError msg={errors.brand} />
                  </motion.div>
                )}

                {/* Model + Age */}
                {form.brand && (
                  <motion.div
                    key={form.brand}
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    className="grid grid-cols-1 sm:grid-cols-2 gap-4"
                  >
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">
                        Model <span className="text-muted-foreground font-normal">(optional)</span>
                      </label>
                      {availableModels.length > 0 ? (
                        <div className="flex flex-wrap gap-2">
                          {availableModels.map(m => (
                            <button
                              key={m} type="button"
                              onClick={() => pick('model', m)}
                              className={`px-3 py-2 rounded-lg border text-xs font-medium transition-all ${
                                form.model === m
                                  ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                                  : 'bg-background border-input hover:border-primary/50'
                              }`}
                            >
                              {m}
                            </button>
                          ))}
                        </div>
                      ) : (
                        <input
                          type="text" placeholder="Enter model name"
                          value={form.model} onChange={set('model')} maxLength={80}
                          className={inputCls()}
                        />
                      )}
                    </div>
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">Approximate Age</label>
                      <select value={form.deviceAge} onChange={set('deviceAge')} className={inputCls()}>
                        <option value="">Select age...</option>
                        {DEVICE_AGES.map(a => <option key={a} value={a}>{a}</option>)}
                      </select>
                    </div>
                  </motion.div>
                )}
              </div>
            </motion.div>

            {/* ── Section 2: Problem ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}
              className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <SectionTitle step={2} title="The Problem" subtitle="Help us understand the issue" />

              <div className="space-y-5">
                {/* Issue type */}
                <div id="field-issue">
                  <label className="block text-sm font-semibold mb-1.5">Main Issue <span className="text-destructive">*</span></label>
                  <select value={form.issue} onChange={set('issue')} className={inputCls(errors.issue)}>
                    <option value="">Select the issue...</option>
                    {ISSUES.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                  <FieldError msg={errors.issue} />
                </div>

                {/* Description */}
                <div id="field-description">
                  <label className="block text-sm font-semibold mb-1.5">
                    Describe the Problem <span className="text-destructive">*</span>
                  </label>
                  <textarea
                    rows={4}
                    placeholder="e.g. My laptop shuts off randomly after 10 minutes of use. It started after I spilled water near it last week. The fans are running loudly."
                    value={form.description} onChange={set('description')} maxLength={2000}
                    className={`${inputCls(errors.description)} resize-none`}
                  />
                  <FieldError msg={errors.description} />
                </div>

                {/* Photo upload */}
                <div>
                  <label className="block text-sm font-semibold mb-1.5">
                    Photos{' '}
                    <span className="text-muted-foreground font-normal text-xs">
                      (optional · up to 3 · JPG, PNG, WebP · max 5 MB each)
                    </span>
                  </label>
                  <input
                    ref={photoRef}
                    type="file"
                    accept="image/jpeg,image/png,image/webp"
                    multiple
                    onChange={handlePhotoChange}
                    className="hidden"
                  />
                  {photos.length > 0 && (
                    <div className="grid grid-cols-3 gap-2 mb-2">
                      {photos.map((p, i) => (
                        <div key={i} className="relative aspect-square rounded-xl overflow-hidden border border-input bg-muted">
                          <img src={p.url} alt="" className="w-full h-full object-cover" />
                          <button
                            type="button"
                            onClick={() => removePhoto(i)}
                            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-black/60 text-white flex items-center justify-center hover:bg-black/80 transition-colors"
                          >
                            <X className="w-3 h-3" />
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                  {photos.length < 3 && (
                    <button
                      type="button"
                      onClick={() => photoRef.current?.click()}
                      className="w-full flex items-center justify-center gap-2 px-4 py-6 rounded-xl border-2 border-dashed border-input text-muted-foreground text-sm font-medium hover:border-primary/50 hover:text-foreground transition-colors"
                    >
                      <ImagePlus className="w-4 h-4" />
                      {photos.length === 0 ? 'Add a photo of the problem' : 'Add another photo'}
                    </button>
                  )}
                </div>

                {/* Urgency */}
                <div id="field-urgency">
                  <label className="block text-sm font-semibold mb-2">How Urgent Is It? <span className="text-destructive">*</span></label>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                    {URGENCY_OPTIONS.map(u => (
                      <button
                        key={u.value} type="button"
                        onClick={() => pick('urgency', u.value)}
                        className={`px-4 py-3 rounded-xl border text-left transition-all ${
                          form.urgency === u.value
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background border-input hover:border-primary/50'
                        }`}
                      >
                        <p className="font-semibold text-sm">{u.label}</p>
                        <p className={`text-xs mt-0.5 ${form.urgency === u.value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{u.desc}</p>
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.urgency} />
                </div>
              </div>
            </motion.div>

            {/* ── Section 3: Service ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.15 }}
              className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <SectionTitle step={3} title="Service Preference" subtitle="How would you like us to help?" />

              <div className="space-y-5">
                <div id="field-serviceMode">
                  <div className="space-y-2">
                    {SERVICE_MODES.map(({ value, icon: Icon, label, desc }) => (
                      <button
                        key={value} type="button"
                        onClick={() => pick('serviceMode', value)}
                        className={`w-full flex items-center gap-4 px-5 py-4 rounded-xl border text-left transition-all ${
                          form.serviceMode === value
                            ? 'bg-primary text-primary-foreground border-primary shadow-sm'
                            : 'bg-background border-input hover:border-primary/50'
                        }`}
                      >
                        <Icon className={`w-5 h-5 shrink-0 ${form.serviceMode === value ? 'text-primary-foreground' : 'text-primary'}`} />
                        <div>
                          <p className="font-semibold text-sm">{label}</p>
                          <p className={`text-xs mt-0.5 ${form.serviceMode === value ? 'text-primary-foreground/70' : 'text-muted-foreground'}`}>{desc}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                  <FieldError msg={errors.serviceMode} />
                </div>

                {form.serviceMode === 'doorstep' && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }}
                    id="field-address"
                  >
                    <label className="block text-sm font-semibold mb-1.5">
                      Your Address / Area <span className="text-destructive">*</span>
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Koramangala, 5th Block or full address"
                      value={form.address} onChange={set('address')} maxLength={200}
                      className={inputCls(errors.address)}
                    />
                    <FieldError msg={errors.address} />
                  </motion.div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      <Calendar className="w-3.5 h-3.5 inline mr-1" />
                      Preferred Date <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <input
                      type="date" min={today}
                      value={form.preferredDate} onChange={set('preferredDate')}
                      className={inputCls()}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      <Clock className="w-3.5 h-3.5 inline mr-1" />
                      Preferred Time <span className="text-muted-foreground font-normal">(optional)</span>
                    </label>
                    <select value={form.preferredSlot} onChange={set('preferredSlot')} className={inputCls()}>
                      <option value="">Any time</option>
                      {TIME_SLOTS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* ── Section 4: Contact ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}
              className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm"
            >
              <SectionTitle step={4} title="Your Details" subtitle="How do we reach you?" />

              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div id="field-name">
                    <label className="block text-sm font-semibold mb-1.5">Full Name <span className="text-destructive">*</span></label>
                    <input
                      type="text" placeholder="e.g. Ravi Kumar"
                      value={form.name} onChange={set('name')} maxLength={100}
                      className={inputCls(errors.name)}
                    />
                    <FieldError msg={errors.name} />
                  </div>

                  {/* Phone with real-time validation */}
                  <div id="field-phone">
                    <label className="block text-sm font-semibold mb-1.5">Phone Number <span className="text-destructive">*</span></label>
                    <div className="relative">
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={e => {
                          setForm(prev => ({ ...prev, phone: e.target.value }));
                          if (errors.phone) setErrors(prev => ({ ...prev, phone: undefined }));
                        }}
                        onBlur={() => setPhoneTouched(true)}
                        maxLength={10}
                        className={`${inputCls(errors.phone || (showPhoneErr ? 'err' : undefined))} pr-10`}
                      />
                      {showPhoneOk && (
                        <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
                      )}
                    </div>
                    {(errors.phone || showPhoneErr) && (
                      <p className="text-destructive text-xs mt-1">
                        {errors.phone ?? 'Enter a valid 10-digit Indian mobile number'}
                      </p>
                    )}
                  </div>
                </div>

                <div>
                  <label className="block text-sm font-semibold mb-1.5">Email <span className="text-muted-foreground font-normal">(optional — we'll send updates here)</span></label>
                  <input
                    type="email" placeholder="e.g. ravi@gmail.com"
                    value={form.email} onChange={set('email')} maxLength={120}
                    className={inputCls()}
                  />
                </div>
              </div>
            </motion.div>

            {/* ── Submit ── */}
            <motion.div
              initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.25 }}
              className="space-y-3"
            >
              {status === 'error' && (
                <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm text-center">
                  {errorMsg}
                </div>
              )}
              <Button
                type="submit"
                size="lg"
                className="w-full h-14 text-base bg-blue-600 hover:bg-blue-700 text-white shadow-lg shadow-blue-600/20"
                disabled={status === 'loading'}
              >
                {status === 'loading'
                  ? <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Saving your booking…</>
                  : 'Confirm Booking Request'
                }
              </Button>
              <div className="flex flex-wrap justify-center gap-4 text-xs text-muted-foreground">
                {['Free diagnosis always included', 'No fix — no fee', 'Confirmation within 1 hour'].map(t => (
                  <span key={t} className="flex items-center gap-1.5">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {t}
                  </span>
                ))}
              </div>
              <p className="text-center text-xs text-muted-foreground">
                Prefer to call?{' '}
                <a href="tel:+918088461724" className="text-primary font-semibold hover:underline">
                  <PhoneCall className="w-3 h-3 inline mr-0.5" />+91 80884 61724
                </a>
              </p>
            </motion.div>
          </form>
        )}
      </div>
    </div>
  );
}
