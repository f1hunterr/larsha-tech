import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor, Code, Wrench, ShieldCheck, Globe, PhoneCall, MapPin,
  CheckCircle2, ArrowRight, Zap, Menu, X, MessageCircle,
  ClipboardList, BadgeCheck, Headphones, Sun, Moon,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import {
  SiDell, SiHp, SiLenovo, SiAsus, SiAcer,
  SiHtml5, SiCss3, SiJavascript, SiPhp, SiMysql, SiLinux, SiReact, SiTailwindcss, SiWordpress,
} from 'react-icons/si';
import { useTheme } from 'next-themes';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';


/* ─── animation variants ────────────────────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ─── static data ───────────────────────────────────────────────────────── */
/* Hardware brands we repair — all with official Si icons + brand hex */
const BRANDS = [
  { icon: SiDell,   label: 'Dell',   color: '#007DB8' },
  { icon: SiHp,     label: 'HP',     color: '#0096D6' },
  { icon: SiLenovo, label: 'Lenovo', color: '#E2231A' },
  { icon: SiAsus,   label: 'ASUS',   color: '#00AAAD' },
  { icon: SiAcer,   label: 'Acer',   color: '#83B81A' },
];

/* Tech stack we build with */
const TECH = [
  { icon: SiHtml5,       label: 'HTML5',      color: '#E34F26' },
  { icon: SiCss3,        label: 'CSS3',       color: '#1572B6' },
  { icon: SiJavascript,  label: 'JavaScript', color: '#F7DF1E' },
  { icon: SiReact,       label: 'React',      color: '#61DAFB' },
  { icon: SiPhp,         label: 'PHP',        color: '#777BB4' },
  { icon: SiMysql,       label: 'MySQL',      color: '#4479A1' },
  { icon: SiLinux,       label: 'Linux',      color: '#FCC624' },
  { icon: SiTailwindcss, label: 'Tailwind',   color: '#06B6D4' },
  { icon: SiWordpress,   label: 'WordPress',  color: '#21759B' },
];

const FAQS = [
  {
    q: 'Do you come to my home or office?',
    a: "Yes! We offer doorstep service across Bangalore — homes, offices, and shops. We also provide remote support for software issues via secure screen sharing. Just WhatsApp us your location and we'll schedule a visit at a time that suits you.",
  },
  {
    q: 'How long does a repair take?',
    a: "Most software issues, OS installations, and optimizations are completed the same day. Hardware repairs usually take 24–48 hours. We always give you a clear timeline before starting any work — no surprises.",
  },
  {
    q: "What if you can't fix the problem?",
    a: "You pay absolutely nothing. Our free diagnostics promise is simple: if we assess your device and cannot solve the problem, there's no charge. We'd rather be honest than bill you for a failed attempt.",
  },
  {
    q: 'How do I know my data is safe?',
    a: "Data privacy is our top priority. We never access personal files unless required for the repair, and we always recommend taking a backup before any work begins. You're welcome to be present throughout the entire repair if you prefer.",
  },
  {
    q: 'Do you offer a warranty on repairs?',
    a: "Yes — we provide a 30-day service warranty on all repairs. If the same issue recurs within 30 days, we fix it at no additional cost. This reflects our confidence in the quality of our work.",
  },
  {
    q: 'What payment methods do you accept?',
    a: "We accept cash, all UPI apps (GPay, PhonePe, Paytm), and bank transfers. Payment is collected only after the work is completed and you're fully satisfied — not before.",
  },
  {
    q: 'Can you build a website if I have no technical knowledge?',
    a: "Absolutely — that's exactly who we build for. Just share your business idea and what you want the website to do. We handle everything: design, development, domain registration, and hosting setup. No jargon, no technical knowledge needed from your side.",
  },
];

type MarqueeEntry =
  | { kind: 'item'; icon: React.ElementType; label: string; color: string }
  | { kind: 'sep' };

/* Brands first, then a divider, then tech stack */
const MARQUEE_ITEMS: MarqueeEntry[] = [
  ...BRANDS.map(b => ({ kind: 'item' as const, ...b })),
  { kind: 'sep' },
  ...TECH.map(t => ({ kind: 'item' as const, ...t })),
  { kind: 'sep' },
];

/* ─── component ─────────────────────────────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { resolvedTheme, setTheme } = useTheme();

  const isDark = resolvedTheme === 'dark';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileMenuOpen(false);
  };

  const NAV_LINKS = [
    { label: 'Services', id: 'services' },
    { label: 'Pricing',  id: 'pricing'  },
    { label: 'About',    id: 'about'    },
    { label: 'FAQ',      id: 'faq'      },
    { label: 'Contact',  id: 'contact'  },
  ];

  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Monitor className="w-6 h-6 text-primary" />
            <span className={scrolled ? 'text-foreground' : 'text-white'}>
              Larsha <span className="text-primary">Tech</span>
            </span>
          </div>

          <nav className="hidden md:flex items-center gap-7 text-sm font-medium">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`transition-colors hover:text-primary ${
                  scrolled ? 'text-muted-foreground' : 'text-white/80'
                }`}
              >
                {label}
              </button>
            ))}
          </nav>

          <div className="flex items-center gap-2">
            {/* Dark / light toggle */}
            <button
              onClick={() => setTheme(isDark ? 'light' : 'dark')}
              aria-label="Toggle theme"
              className={`p-2 rounded-lg transition-colors ${
                scrolled
                  ? 'text-muted-foreground hover:text-foreground hover:bg-muted'
                  : 'text-white/70 hover:text-white hover:bg-white/10'
              }`}
            >
              {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>

            <Button
              onClick={() => window.open('tel:+918088461724')}
              className={scrolled ? '' : 'bg-white text-slate-900 hover:bg-white/90'}
              data-testid="button-nav-call"
            >
              <PhoneCall className="w-4 h-4 mr-2" />
              Call Now
            </Button>
            <button
              className={`md:hidden p-2 rounded-md transition-colors ${
                scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
              }`}
              onClick={() => setMobileMenuOpen(v => !v)}
              aria-label="Toggle menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>

        {mobileMenuOpen && (
          <div className="md:hidden border-t bg-background shadow-lg">
            <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
              {NAV_LINKS.map(({ label, id }) => (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className="text-left px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
                >
                  {label}
                </button>
              ))}
              <div className="pt-2 border-t mt-2 flex gap-2">
                <Button className="flex-1" onClick={() => { window.open('tel:+918088461724'); setMobileMenuOpen(false); }}>
                  <PhoneCall className="w-4 h-4 mr-2" /> Call Now
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { window.open('https://wa.me/918088461724'); setMobileMenuOpen(false); }}>
                  <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
                </Button>
              </div>
            </nav>
          </div>
        )}
      </header>

      <main className="flex-1">

        {/* ── Hero ─────────────────────────────────────────────────────── */}
        <section id="hero" className="relative min-h-[92vh] flex items-center overflow-hidden bg-slate-950">
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
          />

          <div className="container mx-auto px-4 py-24 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
                <motion.span
                  variants={fadeInUp}
                  className="inline-flex items-center gap-2 py-1.5 px-4 rounded-full bg-white/10 text-blue-300 font-semibold text-sm mb-6 border border-white/10 backdrop-blur-sm"
                >
                  <span className="w-2 h-2 rounded-full bg-blue-400 animate-pulse" />
                  Your Local Tech Partner · Bangalore
                </motion.span>

                <motion.h1
                  variants={fadeInUp}
                  className="text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05] text-white"
                >
                  Fast, Reliable<br />&amp; Affordable<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    IT Services
                  </span>
                </motion.h1>

                <motion.p variants={fadeInUp} className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg">
                  Expert computer repair and professional website development in Bangalore.
                  Honest pricing, no jargon, no hidden fees — just real solutions.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                    onClick={() => scrollTo('services')}
                    data-testid="button-hero-services"
                  >
                    Explore Services <ArrowRight className="ml-2 w-4 h-4" />
                  </Button>
                  <Button
                    size="lg"
                    variant="outline"
                    className="h-13 px-8 text-base border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                    onClick={() => window.open('https://wa.me/918088461724')}
                    data-testid="button-hero-whatsapp"
                  >
                    <FaWhatsapp className="w-5 h-5 mr-2 text-green-400" />
                    WhatsApp Us
                  </Button>
                </motion.div>

                <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-400">
                  {['Same Day Fixes', 'No Hidden Fees', 'Free Diagnostics'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* ── Code editor illustration ── */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' as const }}
                className="relative hidden lg:block"
              >
                {/* Ambient glow */}
                <div className="absolute -inset-8 bg-blue-600/10 blur-3xl rounded-3xl pointer-events-none" />

                {/* VS Code-style editor */}
                <div className="relative bg-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 font-mono text-sm">
                  {/* Title bar */}
                  <div className="flex items-center gap-1.5 px-4 py-3 bg-[#181825] border-b border-white/5">
                    <span className="w-3 h-3 rounded-full bg-[#f38ba8]" />
                    <span className="w-3 h-3 rounded-full bg-[#f9e2af]" />
                    <span className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
                    <span className="text-xs text-slate-500 ml-3">index.html — Larsha Tech</span>
                  </div>
                  {/* Tab bar */}
                  <div className="flex bg-[#181825] border-b border-white/5 text-xs">
                    <span className="px-4 py-2 bg-[#1e1e2e] text-[#89b4fa] border-t-2 border-[#89b4fa] border-r border-white/5">index.html</span>
                    <span className="px-4 py-2 text-slate-500 border-r border-white/5">style.css</span>
                    <span className="px-4 py-2 text-slate-500">script.js</span>
                  </div>
                  {/* Code body */}
                  <div className="p-6 leading-7 space-y-0.5">
                    <div><span className="text-[#585b70]">&lt;!-- Larsha Tech Website --&gt;</span></div>
                    <div>
                      <span className="text-[#89b4fa]">&lt;section</span>
                      {' '}<span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span><span className="text-[#a6e3a1]">"hero"</span>
                      <span className="text-[#89b4fa]">&gt;</span>
                    </div>
                    <div className="pl-5">
                      <span className="text-[#89b4fa]">&lt;h1</span>
                      {' '}<span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span><span className="text-[#a6e3a1]">"title"</span>
                      <span className="text-[#89b4fa]">&gt;</span>
                    </div>
                    <div className="pl-10 text-[#cdd6f4]">Fast &amp; Reliable IT Services</div>
                    <div className="pl-5"><span className="text-[#89b4fa]">&lt;/h1&gt;</span></div>
                    <div className="pl-5">
                      <span className="text-[#89b4fa]">&lt;p</span>
                      {' '}<span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span><span className="text-[#a6e3a1]">"subtitle"</span>
                      <span className="text-[#89b4fa]">&gt;</span>
                    </div>
                    <div className="pl-10 text-[#cdd6f4]">Bangalore's trusted tech partner</div>
                    <div className="pl-5"><span className="text-[#89b4fa]">&lt;/p&gt;</span></div>
                    <div className="pl-5">
                      <span className="text-[#89b4fa]">&lt;a</span>
                      {' '}<span className="text-[#cba6f7]">href</span><span className="text-[#cdd6f4]">=</span>
                      <span className="text-[#a6e3a1]">"tel:+918088461724"</span>
                    </div>
                    <div className="pl-10">
                      <span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span>
                      <span className="text-[#a6e3a1]">"btn-cta"</span><span className="text-[#89b4fa]">&gt;</span>
                    </div>
                    <div className="pl-10 text-[#cdd6f4]">Call Now — Free Diagnosis</div>
                    <div className="pl-5"><span className="text-[#89b4fa]">&lt;/a&gt;</span></div>
                    <div><span className="text-[#89b4fa]">&lt;/section&gt;</span></div>
                    {/* Blinking cursor */}
                    <div className="inline-block w-2 h-[1.1em] bg-[#89b4fa] animate-pulse rounded-[1px] align-middle" />
                  </div>
                  {/* Status bar */}
                  <div className="flex items-center gap-4 px-4 py-2 bg-[#181825] border-t border-white/5 text-xs text-slate-500">
                    <span className="flex items-center gap-1.5 text-[#a6e3a1]">
                      <span className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse" />
                      Currently Accepting Repairs
                    </span>
                    <span className="ml-auto">HTML · UTF-8</span>
                  </div>
                </div>

                {/* Floating repair checklist (top right) */}
                <motion.div
                  initial={{ y: -12, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -top-4 -right-6 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-sm"
                >
                  <div className="flex items-center gap-2 mb-3">
                    <Wrench className="w-4 h-4 text-blue-400" />
                    <span className="text-xs font-bold text-white">System Repair</span>
                  </div>
                  <div className="space-y-2">
                    {[
                      { label: 'Virus Removal', done: true  },
                      { label: 'SSD Upgrade',   done: true  },
                      { label: 'OS Install',    done: false },
                    ].map(({ label, done }) => (
                      <div key={label} className="flex items-center gap-2">
                        {done
                          ? <CheckCircle2 className="w-3.5 h-3.5 text-green-400 shrink-0" />
                          : <div className="w-3.5 h-3.5 rounded-full border-2 border-blue-400 border-t-transparent animate-spin shrink-0" />
                        }
                        <span className="text-xs text-slate-300">{label}</span>
                      </div>
                    ))}
                  </div>
                </motion.div>

                {/* Floating Web Design badge (bottom left) */}
                <motion.div
                  initial={{ y: 16, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6, duration: 0.5 }}
                  className="absolute -bottom-5 -left-5 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3 backdrop-blur-sm"
                >
                  <div className="w-11 h-11 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                    <Code className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="font-bold text-white text-sm">Web Design</p>
                    <p className="text-xs text-slate-400">Starts at ₹3,000</p>
                  </div>
                </motion.div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── Brands / Tech marquee ─────────────────────────────────────── */}
        <section className="py-8 border-y bg-muted">
          <p className="text-center text-xs font-bold text-muted-foreground mb-5 uppercase tracking-[0.2em]">
            We repair all major brands &amp; build with modern tech
          </p>
          <div className="overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />
            <div className="flex animate-marquee w-max gap-8 items-center px-8">
              {[...MARQUEE_ITEMS, ...MARQUEE_ITEMS].map((entry, i) =>
                entry.kind === 'sep' ? (
                  <span key={i} className="w-px h-5 bg-border/60 shrink-0 mx-2" />
                ) : (
                  <span key={i} className="flex items-center gap-2 whitespace-nowrap select-none">
                    <entry.icon style={{ color: entry.color }} className="w-4 h-4 shrink-0" />
                    <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">{entry.label}</span>
                  </span>
                )
              )}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ────────────────────────────────────────────── */}
        <section id="why-us" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Why Larsha Tech</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">We aren't just another IT company</h2>
              <p className="text-muted-foreground text-lg">Your local, dependable partner for everything tech.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap,          title: 'Quick & Fast',    desc: 'Same-day service for most repairs and fast turnarounds for websites.',        color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/40',  border: 'border-amber-100 dark:border-amber-900/50'  },
                { icon: CheckCircle2, title: 'Affordable',      desc: 'Honest pricing with no hidden fees. Quality service that fits your budget.',   color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-950/40',  border: 'border-green-100 dark:border-green-900/50'  },
                { icon: MapPin,       title: 'Onsite & Remote', desc: 'We come to you, or fix software issues remotely via secure connection.',       color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-100 dark:border-blue-900/50'    },
                { icon: ShieldCheck,  title: 'Reliable',        desc: 'Professional technicians ensuring your data is safe and systems run perfectly.',color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40',border: 'border-purple-100 dark:border-purple-900/50'},
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
                >
                  <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} mb-5`}>
                    <f.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-lg mb-2">{f.title}</h3>
                  <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── Services ─────────────────────────────────────────────────── */}
        <section id="services" className="py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">What We Do</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Our Core Services</h2>
              <p className="text-muted-foreground text-lg">Comprehensive solutions for hardware and your digital presence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Repair */}
              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-3xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-13 h-13 rounded-xl bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center text-blue-600 dark:text-blue-400 mb-6">
                    <Wrench className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Computer &amp; Laptop Repair</h3>
                  <p className="text-muted-foreground mb-7 leading-relaxed">
                    From slow laptops to dead motherboards, we diagnose and fix issues quickly to get you back to work.
                  </p>
                  <ul className="space-y-3 mb-7">
                    {[
                      'Slow System Optimization & SSD Upgrades',
                      'OS Installation (Windows, Linux) & Software',
                      'Laptop Not Powering On / Blue Screen Fix',
                      'Virus Removal & Data Recovery',
                      'Thermal Cleaning & Overheating Fix',
                      'Motherboard Basic Diagnostics',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {['Doorstep Service', 'Remote Support', 'Workshop Repair'].map(t => (
                      <span key={t} className="px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-300 rounded-full text-xs font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t bg-muted/50">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                    size="lg"
                    onClick={() => scrollTo('pricing')}
                    data-testid="button-service-repair"
                  >
                    View Repair Pricing
                  </Button>
                </div>
              </motion.div>

              {/* Web dev */}
              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="bg-card rounded-3xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-13 h-13 rounded-xl bg-purple-50 dark:bg-purple-950/40 border border-purple-100 dark:border-purple-900/50 flex items-center justify-center text-purple-600 dark:text-purple-400 mb-6">
                    <Globe className="w-6 h-6" />
                  </div>
                  <h3 className="text-2xl font-black mb-3">Website Design &amp; Development</h3>
                  <p className="text-muted-foreground mb-7 leading-relaxed">
                    Professional, fast, and mobile-ready websites to establish your digital presence and grow your business.
                  </p>
                  <ul className="space-y-3 mb-7">
                    {[
                      'Business, Portfolio & Service Websites',
                      'Landing Pages & Personal Branding',
                      'Mobile Responsive & Fast Loading',
                      'SEO Friendly Structure',
                      'Contact Forms & WhatsApp Integration',
                      'Domain & Hosting Setup Support',
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-4 h-4 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-sm font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  <div className="flex flex-wrap gap-2">
                    {['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'].map(t => (
                      <span key={t} className="px-3 py-1 bg-purple-50 dark:bg-purple-950/40 text-purple-700 dark:text-purple-300 rounded-full text-xs font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t bg-muted/50">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white"
                    size="lg"
                    onClick={() => scrollTo('pricing')}
                    data-testid="button-service-web"
                  >
                    View Web Dev Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── Pricing ──────────────────────────────────────────────────── */}
        <section id="pricing" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Pricing</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Transparent Pricing</h2>
              <p className="text-muted-foreground text-lg">Honest rates. No surprises, ever.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
              {/* Repair */}
              <Card className="border shadow-sm hover:shadow-md transition-shadow">
                <CardHeader className="pb-6">
                  <div className="flex items-center gap-3 mb-1">
                    <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                    </div>
                    <CardTitle className="text-xl">Computer Repair</CardTitle>
                  </div>
                  <CardDescription>Affordable fixes to keep you running</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {[
                      ['Basic Diagnostics / Service', '₹500 onwards'],
                      ['OS Installation (Windows / Linux)', '₹800'],
                      ['SSD Upgrade Setup', '₹1,000'],
                      ['Full System Service & Cleaning', '₹1,500'],
                    ].map(([label, price]) => (
                      <li key={label} className="flex justify-between items-center border-b border-border/50 pb-4 last:border-0 last:pb-0">
                        <span className="text-sm font-medium text-muted-foreground">{label}</span>
                        <span className="font-bold text-base whitespace-nowrap">{price}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
                <CardFooter className="flex flex-col gap-3">
                  <Button
                    variant="outline"
                    className="w-full h-11 text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                    onClick={() => window.open('tel:+918088461724')}
                    data-testid="button-price-repair"
                  >
                    Book Repair
                  </Button>
                  <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                    Free diagnosis always included — no fix, no fee
                  </p>
                </CardFooter>
              </Card>

              {/* Web dev — featured */}
              <div className="relative">
                <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-60 blur-sm" />
                <Card className="relative border-0 shadow-xl">
                  <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1 text-xs font-bold rounded-bl-xl rounded-tr-xl tracking-wide">
                    POPULAR
                  </div>
                  <CardHeader className="pb-6">
                    <div className="flex items-center gap-3 mb-1">
                      <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                        <Globe className="w-5 h-5 text-primary" />
                      </div>
                      <CardTitle className="text-xl">Web Development</CardTitle>
                    </div>
                    <CardDescription>Professional presence online</CardDescription>
                  </CardHeader>
                  <CardContent>
                    <ul className="space-y-4">
                      {[
                        ['Basic Website',    'Single Landing Page',     '₹3k – ₹5k',  false],
                        ['Business Website', '3–5 Pages, Contact Form', '₹8k – ₹15k', true ],
                        ['Advanced Website', 'Custom Features, CMS',    '₹20,000+',    false],
                      ].map(([title, sub, price, highlight]) => (
                        <li key={String(title)} className="flex justify-between items-center border-b border-border/50 pb-4 last:border-0 last:pb-0">
                          <div>
                            <p className={`font-bold text-sm ${highlight ? 'text-primary' : ''}`}>{title}</p>
                            <p className="text-xs text-muted-foreground">{sub}</p>
                          </div>
                          <span className={`font-bold text-base whitespace-nowrap ${highlight ? 'text-primary' : ''}`}>{price}</span>
                        </li>
                      ))}
                    </ul>
                  </CardContent>
                  <CardFooter>
                    <Button
                      className="w-full h-11 shadow-sm"
                      onClick={() => window.open('https://wa.me/918088461724?text=Hi%2C%20I%20need%20a%20website%20built')}
                      data-testid="button-price-web"
                    >
                      Discuss Your Project
                    </Button>
                  </CardFooter>
                </Card>
              </div>
            </div>
          </div>
        </section>

        {/* ── How We Work ──────────────────────────────────────────────── */}
        <section id="how-we-work" className="py-24 bg-muted border-t border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">The Process</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">How We Work</h2>
              <p className="text-muted-foreground text-lg">Simple, transparent, and stress-free — every time.</p>
            </div>

            <div className="relative max-w-5xl mx-auto">
              <div className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '01', icon: MessageCircle, title: 'Contact Us',       desc: 'Reach out via WhatsApp or call. No technical knowledge needed.',     color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-100 dark:border-blue-900/50',    ring: 'ring-blue-200 dark:ring-blue-900'   },
                  { step: '02', icon: ClipboardList, title: 'Free Diagnosis',   desc: 'We assess the issue at zero cost and give you a clear honest quote.',  color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-950/40',border: 'border-purple-100 dark:border-purple-900/50',ring: 'ring-purple-200 dark:ring-purple-900'},
                  { step: '03', icon: Wrench,        title: 'We Fix or Build',  desc: 'Repair or website done with care. You get updates throughout.',       color: 'text-primary',                        bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-100 dark:border-blue-900/50',    ring: 'ring-blue-200 dark:ring-blue-900'   },
                  { step: '04', icon: BadgeCheck,    title: "You're Satisfied", desc: "We hand over only when you're happy. Post-service support included.", color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/40',  border: 'border-green-100 dark:border-green-900/50',  ring: 'ring-green-200 dark:ring-green-900' },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative bg-card rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center"
                  >
                    <div className={`relative z-10 w-14 h-14 rounded-full ${item.bg} border ${item.border} ring-4 ${item.ring} flex items-center justify-center ${item.color} mb-5`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-muted-foreground/40 tracking-widest mb-1">{item.step}</span>
                    <h4 className="font-bold text-base mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 max-w-xl mx-auto bg-card border shadow-sm rounded-2xl p-7 text-center"
            >
              <Headphones className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-black text-xl mb-2">Free Diagnostics — Always</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                We diagnose your issue at zero cost. No fix, no fee.
                You only pay when you're satisfied with the solution.
              </p>
              <Button onClick={() => window.open('https://wa.me/918088461724?text=Hi%2C%20I%20need%20a%20free%20diagnosis')} data-testid="button-free-diag">
                <FaWhatsapp className="w-4 h-4 mr-2 text-green-400" />
                Book a Free Diagnosis
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── About / Founder ───────────────────────────────────────────── */}
        <section id="about" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-14 items-center">

              <motion.div
                initial={{ opacity: 0, x: -24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
                className="flex flex-col items-center md:items-start"
              >
                <div className="relative mb-6">
                  {/* Replace with an actual founder photo when available */}
                  <div className="w-48 h-48 rounded-3xl bg-gradient-to-br from-blue-500 to-violet-600 flex items-center justify-center text-white text-7xl font-black shadow-2xl shadow-blue-500/25 select-none">
                    H
                  </div>
                  <div className="absolute -bottom-3 -right-3 bg-card border shadow-md rounded-xl px-3 py-2 flex items-center gap-2">
                    <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                    <span className="text-xs font-bold">Verified Tech</span>
                  </div>
                </div>

                <h3 className="text-2xl font-black mb-1">Hemanth K</h3>
                <p className="text-primary font-semibold text-sm mb-4">Founder &amp; Tech Lead, Larsha Tech</p>

                <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
                  {[
                    { label: 'Service Area',  value: 'All Bangalore' },
                    { label: 'Response Time', value: 'Same Day'       },
                    { label: 'Diagnostics',   value: 'Always Free'    },
                    { label: 'Satisfaction',  value: 'Guaranteed'     },
                  ].map(({ label, value }) => (
                    <div key={label} className="bg-muted border rounded-xl p-3 text-center">
                      <p className="font-black text-sm">{value}</p>
                      <p className="text-xs text-muted-foreground mt-0.5">{label}</p>
                    </div>
                  ))}
                </div>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 24 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.55 }}
              >
                <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">About Us</p>
                <h2 className="text-3xl md:text-4xl font-black mb-5 leading-tight">
                  The person behind<br />Larsha Tech
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-5">
                  Hi, I'm Hemanth — a Bangalore-based tech professional who believes everyone deserves
                  honest, jargon-free IT support. I started Larsha Tech to offer real solutions to real
                  people: no inflated quotes, no passing the buck, no fine print.
                </p>
                <p className="text-muted-foreground leading-relaxed mb-8">
                  Whether you need a laptop repaired or a website built from scratch, you work directly
                  with me — not an anonymous support agent. That means faster answers, better accountability,
                  and a service experience that actually feels personal.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button size="lg" onClick={() => window.open('https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20need%20help%20with')}>
                    <FaWhatsapp className="w-4 h-4 mr-2 text-green-400" />
                    Chat with Me
                  </Button>
                  <Button size="lg" variant="outline" onClick={() => scrollTo('faq')}>
                    Read FAQs
                  </Button>
                </div>
              </motion.div>

            </div>
          </div>
        </section>

        {/* ── FAQ ──────────────────────────────────────────────────────── */}
        <section id="faq" className="py-24 bg-muted">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-12">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">FAQ</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
              <p className="text-muted-foreground text-lg">Everything you need to know before reaching out.</p>
            </div>

            <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-3">
              {FAQS.map((faq, i) => (
                <AccordionItem
                  key={i}
                  value={`faq-${i}`}
                  className="border-0 bg-card rounded-xl shadow-sm px-6 overflow-hidden"
                >
                  <AccordionTrigger className="text-base font-semibold py-5 hover:no-underline text-left">
                    {faq.q}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed pb-5">
                    {faq.a}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>

            <motion.div
              initial={{ opacity: 0, y: 16 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-10 text-center"
            >
              <p className="text-muted-foreground text-sm mb-4">Still have questions? We're one message away.</p>
              <Button variant="outline" onClick={() => window.open('https://wa.me/918088461724')}>
                <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" />
                Ask on WhatsApp
              </Button>
            </motion.div>
          </div>
        </section>

        {/* ── Contact CTA ──────────────────────────────────────────────── */}
        <section id="contact" className="py-24 relative overflow-hidden bg-slate-950">
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
          <div
            className="absolute inset-0 opacity-[0.06] pointer-events-none"
            style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
          />

          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">Get In Touch</p>
              <h2 className="text-4xl md:text-5xl font-black mb-6 text-white">Ready to get started?</h2>
              <p className="text-slate-400 text-lg mb-10 leading-relaxed">
                Whether you need a quick repair or a brand new website, we're here to help.
                Describe your issue and get support fast.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
                <Button
                  size="lg"
                  className="w-full sm:w-auto h-14 px-10 text-base bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
                  onClick={() => window.open('tel:+918088461724')}
                  data-testid="button-cta-call"
                >
                  <PhoneCall className="w-5 h-5 mr-3" />
                  +91 80884 61724
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="w-full sm:w-auto h-14 px-10 text-base border-white/15 text-white hover:bg-white/10"
                  onClick={() => window.open('https://wa.me/918088461724')}
                  data-testid="button-cta-whatsapp"
                >
                  <FaWhatsapp className="w-5 h-5 mr-3 text-green-400" />
                  WhatsApp Us
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 border-t border-white/10 pt-10">
                {[
                  { label: 'Email Us',      value: 'support@larshatech.com', href: 'mailto:support@larshatech.com' },
                  { label: 'Location',      value: 'Bangalore, Karnataka',   href: null },
                  { label: 'Working Hours', value: 'Mon – Sat, 9 am – 7 pm', href: null },
                ].map(({ label, value, href }) => (
                  <div key={label} className="text-center md:text-left">
                    <div className="text-slate-500 text-xs font-bold uppercase tracking-widest mb-1">{label}</div>
                    {href
                      ? <a href={href} className="text-white font-semibold hover:text-primary transition-colors">{value}</a>
                      : <div className="text-white font-semibold">{value}</div>
                    }
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── Floating WhatsApp — desktop only ─────────────────────────── */}
        <a
          href="https://wa.me/918088461724"
          target="_blank"
          rel="noreferrer"
          className="hidden md:flex fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-all z-50 group"
          data-testid="link-floating-whatsapp"
        >
          <FaWhatsapp className="w-7 h-7" />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-background border-t py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 font-bold text-lg">
            <Monitor className="w-5 h-5 text-primary" />
            <span>Larsha <span className="text-primary">Tech</span></span>
          </div>
          <p className="text-muted-foreground text-sm">
            © {new Date().getFullYear()} Larsha Technologies · Bangalore, Karnataka
          </p>
          <a
            href="https://wa.me/918088461724"
            className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 dark:text-green-400 dark:hover:text-green-300 transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </footer>

      {/* ── Mobile sticky CTA bar ─────────────────────────────────────────── */}
      <div className="fixed bottom-0 left-0 right-0 z-40 md:hidden bg-background/95 backdrop-blur-md border-t shadow-lg">
        <div className="flex gap-2 p-3">
          <Button
            className="flex-1 h-12 bg-blue-600 hover:bg-blue-700 text-white"
            onClick={() => window.open('tel:+918088461724')}
          >
            <PhoneCall className="w-4 h-4 mr-2" />
            Call Now
          </Button>
          <Button
            variant="outline"
            className="flex-1 h-12 border-green-200 dark:border-green-800 text-green-700 dark:text-green-400 hover:bg-green-50 dark:hover:bg-green-950/30"
            onClick={() => window.open('https://wa.me/918088461724')}
          >
            <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" />
            WhatsApp
          </Button>
        </div>
      </div>

    </div>
  );
}
