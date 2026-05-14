import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle2, Loader2, Send, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

const SERVICE_OPTIONS = [
  'Computer / Laptop Repair',
  'OS Installation / Software Setup',
  'Virus Removal / Data Recovery',
  'SSD Upgrade / Hardware',
  'Website Development',
  'Website Maintenance / Update',
  'Other / Not Sure',
];

interface FormState {
  name: string;
  phone: string;
  service: string;
  message: string;
}

interface Errors {
  name?: string;
  phone?: string;
  service?: string;
  message?: string;
}

function validate(form: FormState): Errors {
  const errs: Errors = {};
  if (!form.name.trim()) errs.name = 'Name is required';
  if (!form.phone.trim()) {
    errs.phone = 'Phone number is required';
  } else if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\s/g, ''))) {
    errs.phone = 'Enter a valid 10-digit Indian mobile number';
  }
  if (!form.service) errs.service = 'Please select a service';
  if (!form.message.trim()) errs.message = 'Please describe your issue or requirement';
  return errs;
}

export default function LeadForm() {
  const { track } = useAnalytics();

  const [form, setForm] = useState<FormState>({ name: '', phone: '', service: '', message: '' });
  const [errors, setErrors] = useState<Errors>({});
  const [status, setStatus] = useState<'idle' | 'loading' | 'success'>('idle');

  const set = (field: keyof FormState) => (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    setForm(prev => ({ ...prev, [field]: e.target.value }));
    if (errors[field]) setErrors(prev => ({ ...prev, [field]: undefined }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate(form);
    if (Object.keys(errs).length) { setErrors(errs); return; }

    setStatus('loading');
    track('lead_form_submit', { service: form.service });

    const payload = { name: form.name, phone: form.phone, service: form.service, message: form.message };

    // Formspree — email alert (fire and forget)
    const formspreeId = import.meta.env.VITE_FORMSPREE_ID as string | undefined;
    if (formspreeId) {
      fetch(`https://formspree.io/f/${formspreeId}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    // Backend API — save to database (fire and forget)
    const apiUrl = import.meta.env.VITE_API_URL as string | undefined;
    if (apiUrl) {
      fetch(`${apiUrl}/api/leads`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      }).catch(() => {});
    }

    const msg = encodeURIComponent(
      `Hi Larsha Tech! 👋\n\nName: ${form.name}\nPhone: ${form.phone}\nService: ${form.service}\n\nIssue / Requirement:\n${form.message}\n\nPlease get back to me at your earliest convenience. 🙏`
    );

    setTimeout(() => {
      window.open(`https://wa.me/918088461724?text=${msg}`, '_blank');
      setStatus('success');
    }, 600);
  };

  const reset = () => { setForm({ name: '', phone: '', service: '', message: '' }); setStatus('idle'); };

  return (
    <section id="get-quote" className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto">

          {/* Header */}
          <div className="text-center mb-10">
            <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Free Consultation</p>
            <h2 className="text-3xl md:text-4xl font-black mb-4">Get a Free Diagnosis Now</h2>
            <p className="text-muted-foreground text-lg">
              Tell us about your issue. We'll respond on WhatsApp within 1 hour — no commitment needed.
            </p>
          </div>

          {/* Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="bg-card border rounded-3xl shadow-sm overflow-hidden"
          >
            {status === 'success' ? (
              /* ── Success state ── */
              <div className="p-10 flex flex-col items-center text-center gap-5">
                <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-950/40 flex items-center justify-center">
                  <CheckCircle2 className="w-10 h-10 text-green-600 dark:text-green-400" />
                </div>
                <h3 className="text-2xl font-black">Message Sent!</h3>
                <p className="text-muted-foreground leading-relaxed max-w-sm">
                  Your WhatsApp was opened with a pre-filled message. We typically respond within <strong>1 hour</strong> during working hours (Mon–Sat, 9 am–7 pm).
                </p>
                <div className="flex gap-3 mt-2">
                  <Button variant="outline" onClick={reset}>Submit Another</Button>
                  <Button onClick={() => window.open('tel:+918088461724')}>
                    <PhoneCall className="w-4 h-4 mr-2" /> Call Now
                  </Button>
                </div>
              </div>
            ) : (
              /* ── Form ── */
              <form onSubmit={handleSubmit} noValidate>
                <div className="p-8 space-y-5">

                  {/* Name + Phone */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                    <div>
                      <label className="block text-sm font-semibold mb-1.5">
                        Your Name <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="text"
                        placeholder="e.g. Ravi Kumar"
                        value={form.name}
                        onChange={set('name')}
                        maxLength={100}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.name ? 'border-destructive' : 'border-input'}`}
                      />
                      {errors.name && <p className="text-destructive text-xs mt-1">{errors.name}</p>}
                    </div>

                    <div>
                      <label className="block text-sm font-semibold mb-1.5">
                        Phone Number <span className="text-destructive">*</span>
                      </label>
                      <input
                        type="tel"
                        placeholder="e.g. 9876543210"
                        value={form.phone}
                        onChange={set('phone')}
                        maxLength={10}
                        className={`w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.phone ? 'border-destructive' : 'border-input'}`}
                      />
                      {errors.phone && <p className="text-destructive text-xs mt-1">{errors.phone}</p>}
                    </div>
                  </div>

                  {/* Service */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Service Needed <span className="text-destructive">*</span>
                    </label>
                    <select
                      value={form.service}
                      onChange={set('service')}
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary ${errors.service ? 'border-destructive' : 'border-input'}`}
                    >
                      <option value="">Select a service...</option>
                      {SERVICE_OPTIONS.map(s => <option key={s} value={s}>{s}</option>)}
                    </select>
                    {errors.service && <p className="text-destructive text-xs mt-1">{errors.service}</p>}
                  </div>

                  {/* Message */}
                  <div>
                    <label className="block text-sm font-semibold mb-1.5">
                      Describe Your Issue / Requirement <span className="text-destructive">*</span>
                    </label>
                    <textarea
                      rows={4}
                      placeholder="e.g. My laptop is running very slow and shutting down randomly. It's a Dell Inspiron, 3 years old..."
                      value={form.message}
                      onChange={set('message')}
                      maxLength={2000}
                      className={`w-full px-4 py-3 rounded-xl border bg-background text-sm outline-none transition-colors focus:ring-2 focus:ring-primary/30 focus:border-primary resize-none ${errors.message ? 'border-destructive' : 'border-input'}`}
                    />
                    {errors.message && <p className="text-destructive text-xs mt-1">{errors.message}</p>}
                  </div>
                </div>

                {/* Footer */}
                <div className="px-8 pb-8 space-y-3">
                  <Button
                    type="submit"
                    size="lg"
                    className="w-full h-12 text-base bg-green-600 hover:bg-green-700 text-white shadow-lg shadow-green-600/20"
                    disabled={status === 'loading'}
                  >
                    {status === 'loading' ? (
                      <><Loader2 className="w-4 h-4 mr-2 animate-spin" /> Sending…</>
                    ) : (
                      <><FaWhatsapp className="w-4 h-4 mr-2" /> Send via WhatsApp</>
                    )}
                  </Button>
                  <p className="text-xs text-center text-muted-foreground">
                    Clicking above opens WhatsApp with a pre-filled message · We respond within 1 hour
                  </p>
                </div>
              </form>
            )}
          </motion.div>

          {/* Trust chips */}
          <div className="mt-6 flex flex-wrap justify-center gap-4 text-xs text-muted-foreground font-medium">
            {['No spam, ever', 'Free consultation', 'No commitment required', 'Mon–Sat, 9 am–7 pm'].map(t => (
              <span key={t} className="flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500" /> {t}
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
