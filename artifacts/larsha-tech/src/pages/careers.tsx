import React, { useState, useEffect, useRef } from 'react';
import { useLocation } from 'wouter';
import { usePageMeta } from '@/hooks/usePageMeta';
import { ArrowLeft, Loader2, CheckCircle2, Upload, X, Briefcase, Users, Zap, Heart } from 'lucide-react';
import { motion } from 'framer-motion';
import { Button } from '@/components/ui/button';
import Navbar from '@/components/sections/Navbar';

const POSITIONS = [
  'Computer Repair Technician',
  'Junior Web Developer',
  'Customer Support Executive',
  'Sales & Marketing Executive',
  'Operations Intern',
  'Tech Support Intern',
  'Other / Not Listed',
];
const EXPERIENCE_LEVELS = [
  'Fresher (0–1 year)',
  '1–3 years',
  '3–5 years',
  '5+ years',
];
const PERKS = [
  { icon: Zap,      title: 'Grow Fast',     desc: 'Hands-on work with real clients from day one.' },
  { icon: Heart,    title: 'Great Culture',  desc: 'Small team, big impact. No politics.' },
  { icon: Users,    title: 'Learn Together', desc: 'Regular knowledge sharing and skill-building.' },
  { icon: Briefcase,title: 'Fair Pay',       desc: 'Competitive salary + performance incentives.' },
];

interface FormState {
  name: string; email: string; phone: string;
  position: string; experience: string; message: string;
}
type Errors = Partial<Record<keyof FormState | 'resume', string>>;

const EMPTY: FormState = { name: '', email: '', phone: '', position: '', experience: '', message: '' };

function validate(f: FormState, resume: File | null): Errors {
  const e: Errors = {};
  if (!f.name.trim())     e.name     = 'Your name is required';
  if (!f.email.trim())    e.email    = 'Email is required';
  else if (!f.email.includes('@')) e.email = 'Enter a valid email address';
  if (!f.phone.trim())    e.phone    = 'Phone number is required';
  else if (!/^[6-9]\d{9}$/.test(f.phone.replace(/\s/g, '')))
    e.phone = 'Enter a valid 10-digit Indian mobile number';
  if (!f.position)        e.position = 'Please select a position';
  if (!f.message.trim())  e.message  = 'Please write a short cover letter';
  if (resume) {
    const ext = resume.name.split('.').pop()?.toLowerCase();
    if (!['pdf', 'doc', 'docx'].includes(ext ?? ''))
      e.resume = 'Only PDF, DOC, or DOCX files are accepted';
    else if (resume.size > 5 * 1024 * 1024)
      e.resume = 'File must be under 5 MB';
  }
  return e;
}

function FieldError({ msg }: { msg?: string }) {
  if (!msg) return null;
  return <p className="text-destructive text-xs mt-1">{msg}</p>;
}
const inputCls = (err?: string) =>
  `w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary ${err ? 'border-destructive' : 'border-input'}`;

export default function Careers() {
  const [, navigate] = useLocation();
  const [form, setForm] = useState<FormState>(EMPTY);

  usePageMeta({
    title: 'Careers — Join Larsha Tech',
    description: 'Join the Larsha Tech team in Bangalore. We are hiring computer repair technicians and junior web developers. Apply online with your resume.',
    path: '/careers',
  });
  const [resume, setResume] = useState<File | null>(null);
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [appId, setAppId] = useState<number | null>(null);
  const [errorMsg, setErrorMsg] = useState('');
  const [phoneTouched, setPhoneTouched] = useState(false);
  const fileRef = useRef<HTMLInputElement>(null);

  useEffect(() => { window.scrollTo(0, 0); }, []);

  const set = (field: keyof FormState) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
      setForm(prev => ({ ...prev, [field]: e.target.value }));
      if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
    };

  const handleFile = (e: React.ChangeEvent<HTMLInputElement>) => {
    const f = e.target.files?.[0] ?? null;
    setResume(f);
    setErrors(prev => ({ ...prev, resume: undefined }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form, resume);
    if (Object.keys(errs).length) {
      setErrors(errs);
      const firstKey = Object.keys(errs)[0];
      document.getElementById(`field-${firstKey}`)?.scrollIntoView({ behavior: 'smooth', block: 'center' });
      return;
    }
    setStatus('loading');
    setErrorMsg('');

    const apiUrl = (import.meta.env.VITE_API_URL as string | undefined) ?? '';
    if (!apiUrl) {
      setStatus('error');
      setErrorMsg('Application service is not configured. Please email us directly.');
      return;
    }

    try {
      const fd = new FormData();
      fd.append('name',       form.name);
      fd.append('email',      form.email);
      fd.append('phone',      form.phone);
      fd.append('position',   form.position);
      fd.append('experience', form.experience);
      fd.append('message',    form.message);
      if (resume) fd.append('resume', resume);

      const res = await fetch(`${apiUrl}/api/applications`, { method: 'POST', body: fd });
      if (!res.ok) {
        const data = await res.json().catch(() => ({})) as { error?: string };
        setStatus('error');
        setErrorMsg(data.error ?? 'Something went wrong. Please try again.');
        return;
      }
      const data = await res.json() as { id: number };
      setAppId(data.id);
      setStatus('success');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } catch {
      setStatus('error');
      setErrorMsg('Could not reach the server. Please check your connection.');
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Navbar />

      {/* Hero — pt-28 = pt-16 (fixed navbar) + pt-12 (design padding) */}
      <div className="bg-slate-950 pt-28 pb-16 px-4 relative overflow-hidden">
        <div className="absolute top-0 right-1/4 w-[500px] h-[300px] bg-violet-600/15 rounded-full blur-[80px] pointer-events-none" />
        <div className="container mx-auto relative z-10 max-w-3xl">
          <button
            onClick={() => navigate('/')}
            className="flex items-center gap-2 text-slate-400 hover:text-white transition-colors text-sm mb-6"
          >
            <ArrowLeft className="w-4 h-4" /> Back to home
          </button>
          <p className="text-violet-400 font-bold text-xs uppercase tracking-widest mb-3">Careers at Larsha Tech</p>
          <h1 className="text-3xl sm:text-4xl font-black text-white mb-3 leading-tight">
            Join Our Growing Team
          </h1>
          <p className="text-slate-400 text-base leading-relaxed max-w-xl">
            We're a Bangalore-based tech team that fixes computers and builds websites. If you're passionate, reliable, and love technology — we want to hear from you.
          </p>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12 max-w-3xl">

        {/* Why join us */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-12">
          {PERKS.map(({ icon: Icon, title, desc }) => (
            <motion.div
              key={title}
              initial={{ opacity: 0, y: 12 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}
              className="bg-card border rounded-2xl p-4 text-center"
            >
              <div className="w-10 h-10 rounded-xl bg-violet-50 dark:bg-violet-950/40 flex items-center justify-center text-violet-600 dark:text-violet-400 mx-auto mb-3">
                <Icon className="w-5 h-5" />
              </div>
              <p className="font-bold text-sm mb-1">{title}</p>
              <p className="text-muted-foreground text-xs leading-relaxed">{desc}</p>
            </motion.div>
          ))}
        </div>

        {/* Form / Success */}
        {status === 'success' ? (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}
            className="bg-card border rounded-3xl p-10 text-center shadow-sm"
          >
            <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center mx-auto mb-5">
              <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
            </div>
            <h2 className="text-2xl font-black mb-2">Application Received!</h2>
            {appId && <p className="text-xs font-mono text-muted-foreground mb-2">Application #{appId}</p>}
            <p className="text-muted-foreground leading-relaxed max-w-sm mx-auto mb-6">
              Thanks, <strong>{form.name}</strong>! We've received your application for <strong>{form.position}</strong>. We'll review it and reach you on <strong>{form.email}</strong> within 3–5 business days.
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Button variant="outline" onClick={() => { setForm(EMPTY); setResume(null); setStatus('idle'); setAppId(null); }}>
                Submit Another
              </Button>
              <Button onClick={() => navigate('/')}>Back to Home</Button>
            </div>
          </motion.div>
        ) : (
          <motion.form
            initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }}
            onSubmit={handleSubmit} noValidate encType="multipart/form-data"
            className="bg-card border rounded-2xl p-6 sm:p-8 shadow-sm space-y-5"
          >
            <div>
              <h2 className="text-xl font-black mb-1">Apply Now</h2>
              <p className="text-muted-foreground text-sm">Fill in your details and attach your resume (optional but recommended).</p>
            </div>

            {/* Name + Phone */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="field-name">
                <label className="block text-sm font-semibold mb-1.5">Full Name <span className="text-destructive">*</span></label>
                <input type="text" placeholder="e.g. Priya Sharma" value={form.name} onChange={set('name')} maxLength={100} className={inputCls(errors.name)} />
                <FieldError msg={errors.name} />
              </div>
              <div id="field-phone">
                <label className="block text-sm font-semibold mb-1.5">Phone Number <span className="text-destructive">*</span></label>
                <div className="relative">
                  <input
                    type="tel"
                    placeholder="e.g. 9876543210"
                    value={form.phone}
                    onChange={set('phone')}
                    onBlur={() => setPhoneTouched(true)}
                    maxLength={10}
                    className={`${inputCls(errors.phone || (phoneTouched && form.phone.length > 0 && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g,'')) ? 'err' : undefined))} pr-10`}
                  />
                  {/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')) && (
                    <CheckCircle2 className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-green-500 pointer-events-none" />
                  )}
                </div>
                {(errors.phone || (phoneTouched && form.phone.length > 0 && !/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, '')))) && (
                  <p className="text-destructive text-xs mt-1">{errors.phone ?? 'Enter a valid 10-digit Indian mobile number'}</p>
                )}
              </div>
            </div>

            {/* Email */}
            <div id="field-email">
              <label className="block text-sm font-semibold mb-1.5">Email Address <span className="text-destructive">*</span></label>
              <input type="email" placeholder="e.g. priya@gmail.com" value={form.email} onChange={set('email')} maxLength={120} className={inputCls(errors.email)} />
              <FieldError msg={errors.email} />
            </div>

            {/* Position + Experience */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div id="field-position">
                <label className="block text-sm font-semibold mb-1.5">Position Applying For <span className="text-destructive">*</span></label>
                <select value={form.position} onChange={set('position')} className={inputCls(errors.position)}>
                  <option value="">Select a role...</option>
                  {POSITIONS.map(p => <option key={p} value={p}>{p}</option>)}
                </select>
                <FieldError msg={errors.position} />
              </div>
              <div id="field-experience">
                <label className="block text-sm font-semibold mb-1.5">Years of Experience</label>
                <select value={form.experience} onChange={set('experience')} className={inputCls()}>
                  <option value="">Select...</option>
                  {EXPERIENCE_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
              </div>
            </div>

            {/* Cover letter */}
            <div id="field-message">
              <label className="block text-sm font-semibold mb-1.5">
                Why do you want to join Larsha Tech? <span className="text-destructive">*</span>
              </label>
              <textarea
                rows={5}
                placeholder="Tell us a bit about yourself, your skills, and why you'd be a great fit..."
                value={form.message} onChange={set('message')} maxLength={3000}
                className={`${inputCls(errors.message)} resize-none`}
              />
              <div className="flex justify-between mt-1">
                <FieldError msg={errors.message} />
                <span className="text-xs text-muted-foreground ml-auto">{form.message.length}/3000</span>
              </div>
            </div>

            {/* Resume upload */}
            <div id="field-resume">
              <label className="block text-sm font-semibold mb-1.5">
                Resume <span className="text-muted-foreground font-normal">(optional — PDF, DOC, DOCX · max 5 MB)</span>
              </label>
              <input ref={fileRef} type="file" accept=".pdf,.doc,.docx" onChange={handleFile} className="hidden" />
              {resume ? (
                <div className="flex items-center gap-3 px-4 py-3 rounded-xl border border-input bg-background text-sm">
                  <Upload className="w-4 h-4 text-violet-500 shrink-0" />
                  <span className="flex-1 truncate font-medium">{resume.name}</span>
                  <button type="button" onClick={() => { setResume(null); if (fileRef.current) fileRef.current.value = ''; }}
                    className="text-muted-foreground hover:text-destructive transition-colors">
                    <X className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <button
                  type="button"
                  onClick={() => fileRef.current?.click()}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-8 rounded-xl border-2 border-dashed text-sm font-medium transition-colors ${
                    errors.resume ? 'border-destructive text-destructive' : 'border-input text-muted-foreground hover:border-violet-400 hover:text-violet-600 dark:hover:text-violet-400'
                  }`}
                >
                  <Upload className="w-4 h-4" />
                  Click to upload your resume
                </button>
              )}
              <FieldError msg={errors.resume} />
            </div>

            {/* Error banner */}
            {status === 'error' && (
              <div className="px-4 py-3 rounded-xl bg-destructive/10 border border-destructive/30 text-destructive text-sm">
                {errorMsg}
              </div>
            )}

            <Button
              type="submit" size="lg"
              className="w-full h-12 bg-violet-600 hover:bg-violet-700 text-white"
              disabled={status === 'loading'}
            >
              {status === 'loading'
                ? <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Submitting…</>
                : 'Submit Application'
              }
            </Button>

            <p className="text-center text-xs text-muted-foreground">
              We review every application personally and respond within 3–5 business days.
            </p>
          </motion.form>
        )}
      </div>
    </div>
  );
}
