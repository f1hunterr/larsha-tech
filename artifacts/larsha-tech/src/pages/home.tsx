import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Code,
  Wrench,
  ShieldCheck,
  Globe,
  PhoneCall,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Zap,
  Menu,
  X,
  MessageCircle,
  ClipboardList,
  BadgeCheck,
  Headphones,
} from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import repairHeroImg from '../assets/repair-hero.jpg';

/* ─── animation variants ────────────────────────────────────────────────── */
const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

/* ─── component ─────────────────────────────────────────────────────────── */
export default function Home() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);

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
    { label: 'Services',    id: 'services'    },
    { label: 'Why Us',      id: 'why-us'      },
    { label: 'Pricing',     id: 'pricing'     },
    { label: 'How We Work', id: 'how-we-work' },
    { label: 'Contact',     id: 'contact'     },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ── Navbar ──────────────────────────────────────────────────────── */}
      <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        scrolled
          ? 'bg-background/95 backdrop-blur-md border-b shadow-sm'
          : 'bg-transparent border-b border-transparent'
      }`}>
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
            <Monitor className="w-6 h-6 text-primary" />
            <span className={scrolled ? 'text-foreground' : 'text-white'}>
              Larsha <span className="text-primary">Tech</span>
            </span>
          </div>

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium">
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

        {/* Mobile dropdown */}
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
          {/* Glow orbs */}
          <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
          <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />

          {/* Dot-grid pattern */}
          <div
            className="absolute inset-0 opacity-[0.07] pointer-events-none"
            style={{
              backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)',
              backgroundSize: '32px 32px',
            }}
          />

          <div className="container mx-auto px-4 py-24 relative z-10 w-full">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

              {/* Left — copy */}
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
                  Fast, Reliable<br />& Affordable<br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                    IT Services
                  </span>
                </motion.h1>

                <motion.p
                  variants={fadeInUp}
                  className="text-lg text-slate-400 mb-10 leading-relaxed max-w-lg"
                >
                  Expert computer repair and professional website development in Bangalore.
                  Honest pricing, no jargon, no hidden fees — just real solutions.
                </motion.p>

                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
                  <Button
                    size="lg"
                    className="h-13 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30 transition-all"
                    onClick={() => scrollTo('services')}
                    data-testid="button-hero-services"
                  >
                    Explore Services
                    <ArrowRight className="ml-2 w-4 h-4" />
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

                <motion.div
                  variants={fadeInUp}
                  className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-400"
                >
                  {['Same Day Fixes', 'No Hidden Fees', 'Free Diagnostics'].map(t => (
                    <div key={t} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" />
                      {t}
                    </div>
                  ))}
                </motion.div>
              </motion.div>

              {/* Right — image */}
              <motion.div
                initial={{ opacity: 0, scale: 0.92 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: 'easeOut' as const }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 aspect-[4/3]">
                  <img src={repairHeroImg} alt="Technician repairing laptop" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-slate-950/80 via-slate-950/20 to-transparent" />
                  <div className="absolute bottom-5 left-5 right-5">
                    <div className="flex items-center gap-2">
                      <span className="w-2.5 h-2.5 rounded-full bg-green-400 animate-pulse" />
                      <span className="text-white font-semibold text-xs tracking-widest uppercase">Currently accepting repairs</span>
                    </div>
                  </div>
                </div>

                {/* Floating badge */}
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

        {/* ── Brands banner ────────────────────────────────────────────── */}
        <section className="py-8 border-y bg-slate-50">
          <div className="container mx-auto px-4 text-center">
            <p className="text-xs font-bold text-slate-400 mb-5 uppercase tracking-[0.2em]">
              We repair all major brands &amp; build with modern tech
            </p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-4">
              {['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Windows', 'Linux', 'HTML5', 'JavaScript', 'PHP', 'MySQL'].map(b => (
                <span key={b} className="text-xs font-extrabold text-slate-300 hover:text-slate-600 transition-colors tracking-widest uppercase">
                  {b}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* ── Why Choose Us ────────────────────────────────────────────── */}
        <section id="why-us" className="py-24 bg-white">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Why Larsha Tech</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">We aren't just another IT company</h2>
              <p className="text-muted-foreground text-lg">Your local, dependable partner for everything tech.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { icon: Zap,          title: 'Quick & Fast',     desc: 'Same-day service for most repairs and fast turnarounds for websites.',             color: 'text-amber-500',  bg: 'bg-amber-50',   border: 'border-amber-100' },
                { icon: CheckCircle2, title: 'Affordable',       desc: 'Honest pricing with no hidden fees. Quality service that fits your budget.',         color: 'text-green-500',  bg: 'bg-green-50',   border: 'border-green-100' },
                { icon: MapPin,       title: 'Onsite & Remote',  desc: 'We come to you, or fix software issues remotely via secure connection.',             color: 'text-blue-500',   bg: 'bg-blue-50',    border: 'border-blue-100'  },
                { icon: ShieldCheck,  title: 'Reliable',         desc: 'Professional technicians ensuring your data is safe and systems run perfectly.',      color: 'text-purple-500', bg: 'bg-purple-50',  border: 'border-purple-100'},
              ].map((f, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: '-80px' }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="group p-6 rounded-2xl bg-white border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
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
        <section id="services" className="py-24 bg-slate-50">
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
                className="bg-white rounded-3xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-blue-500 to-cyan-400" />
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-13 h-13 rounded-xl bg-blue-50 border border-blue-100 flex items-center justify-center text-blue-600 mb-6">
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
                      <span key={t} className="px-3 py-1 bg-blue-50 text-blue-700 rounded-full text-xs font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t bg-slate-50">
                  <Button
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white shadow-sm shadow-blue-200"
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
                className="bg-white rounded-3xl overflow-hidden shadow-sm border hover:shadow-md transition-shadow flex flex-col"
              >
                <div className="h-1.5 bg-gradient-to-r from-violet-500 to-purple-400" />
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-13 h-13 rounded-xl bg-purple-50 border border-purple-100 flex items-center justify-center text-purple-600 mb-6">
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
                      <span key={t} className="px-3 py-1 bg-purple-50 text-purple-700 rounded-full text-xs font-semibold">{t}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 border-t bg-slate-50">
                  <Button
                    className="w-full bg-purple-600 hover:bg-purple-700 text-white shadow-sm shadow-purple-200"
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
        <section id="pricing" className="py-24 bg-white">
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
                    <div className="w-10 h-10 rounded-lg bg-blue-50 border border-blue-100 flex items-center justify-center">
                      <Wrench className="w-5 h-5 text-blue-600" />
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
                <CardFooter>
                  <Button
                    variant="outline"
                    className="w-full h-11 text-blue-600 border-blue-200 hover:bg-blue-50"
                    onClick={() => window.open('tel:+918088461724')}
                    data-testid="button-price-repair"
                  >
                    Book Repair
                  </Button>
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
        <section id="how-we-work" className="py-24 bg-slate-50 border-t border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-2xl mx-auto mb-14">
              <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">The Process</p>
              <h2 className="text-3xl md:text-4xl font-black mb-4">How We Work</h2>
              <p className="text-muted-foreground text-lg">Simple, transparent, and stress-free — every time.</p>
            </div>

            {/* Steps with connector */}
            <div className="relative max-w-5xl mx-auto">
              {/* Horizontal connector line (desktop) */}
              <div className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                {[
                  { step: '01', icon: MessageCircle, title: 'Contact Us',        desc: 'Reach out via WhatsApp or call. No technical knowledge needed.',                            color: 'text-blue-600',   bg: 'bg-blue-50',   border: 'border-blue-100',   ring: 'ring-blue-200'   },
                  { step: '02', icon: ClipboardList, title: 'Free Diagnosis',    desc: 'We assess the issue at zero cost and give you a clear honest quote.',                      color: 'text-purple-600', bg: 'bg-purple-50', border: 'border-purple-100', ring: 'ring-purple-200' },
                  { step: '03', icon: Wrench,        title: 'We Fix or Build',   desc: 'Repair or website done with care. You get updates throughout.',                            color: 'text-primary',    bg: 'bg-blue-50',   border: 'border-blue-100',   ring: 'ring-blue-200'   },
                  { step: '04', icon: BadgeCheck,    title: 'You're Satisfied',  desc: "We hand over only when you're happy. Post-service support included.",                      color: 'text-green-600',  bg: 'bg-green-50',  border: 'border-green-100',  ring: 'ring-green-200'  },
                ].map((item, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true, margin: '-60px' }}
                    transition={{ delay: i * 0.12, duration: 0.5 }}
                    className="relative bg-white rounded-2xl p-6 border shadow-sm flex flex-col items-center text-center"
                  >
                    <div className={`relative z-10 w-14 h-14 rounded-full ${item.bg} border ${item.border} ring-4 ${item.ring} flex items-center justify-center ${item.color} mb-5 bg-white`}>
                      <item.icon className="w-6 h-6" />
                    </div>
                    <span className="text-xs font-black text-muted-foreground/40 tracking-widest mb-1">{item.step}</span>
                    <h4 className="font-bold text-base mb-2">{item.title}</h4>
                    <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
                  </motion.div>
                ))}
              </div>
            </div>

            {/* Free diagnostics callout */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="mt-12 max-w-xl mx-auto bg-white border shadow-sm rounded-2xl p-7 text-center"
            >
              <Headphones className="w-8 h-8 text-primary mx-auto mb-3" />
              <h3 className="font-black text-xl mb-2">Free Diagnostics — Always</h3>
              <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
                We diagnose your issue at zero cost. No fix, no fee.
                You only pay when you're satisfied with the solution.
              </p>
              <Button
                onClick={() => window.open('https://wa.me/918088461724?text=Hi%2C%20I%20need%20a%20free%20diagnosis')}
                data-testid="button-free-diag"
              >
                <FaWhatsapp className="w-4 h-4 mr-2 text-green-400" />
                Book a Free Diagnosis
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
                  { label: 'Email Us',       value: 'support@larshatech.com', href: 'mailto:support@larshatech.com' },
                  { label: 'Location',       value: 'Bangalore, Karnataka',   href: null },
                  { label: 'Working Hours',  value: 'Mon – Sat, 9 am – 7 pm', href: null },
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

        {/* ── Floating WhatsApp ─────────────────────────────────────────── */}
        <a
          href="https://wa.me/918088461724"
          target="_blank"
          rel="noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl shadow-green-500/30 hover:scale-110 transition-all z-50 group"
          data-testid="link-floating-whatsapp"
        >
          <FaWhatsapp className="w-7 h-7" />
          <span className="absolute right-full mr-4 bg-slate-900 text-white text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>

      </main>

      {/* ── Footer ───────────────────────────────────────────────────────── */}
      <footer className="bg-white border-t py-8">
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
            className="flex items-center gap-1.5 text-sm font-semibold text-green-600 hover:text-green-700 transition-colors"
          >
            <FaWhatsapp className="w-4 h-4" />
            WhatsApp Us
          </a>
        </div>
      </footer>

    </div>
  );
}
