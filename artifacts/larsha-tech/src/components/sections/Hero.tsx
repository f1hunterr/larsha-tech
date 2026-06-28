import React from 'react';
import { useLocation } from 'wouter';
import { motion } from 'framer-motion';
import { Code, Wrench, PhoneCall, CheckCircle2, ArrowRight } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { useAnalytics } from '@/hooks/useAnalytics';

const fadeInUp = {
  hidden: { opacity: 0, y: 28 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.55, ease: 'easeOut' as const } },
};
const staggerContainer = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

export default function Hero() {
  const { track } = useAnalytics();
  const [, navigate] = useLocation();

  return (
    <section id="hero" className="relative min-h-[75vh] sm:min-h-[92vh] flex items-start sm:items-center overflow-hidden bg-slate-950">
      <div className="absolute top-[-10%] left-[-5%] w-[600px] h-[600px] rounded-full bg-blue-600/20 blur-[120px] pointer-events-none" />
      <div className="absolute bottom-[-10%] right-[-5%] w-[500px] h-[500px] rounded-full bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.07] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '32px 32px' }}
      />

      <div className="container mx-auto px-4 pt-12 pb-16 sm:py-24 relative z-10 w-full">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">

          {/* Left — copy */}
          <motion.div initial="hidden" animate="visible" variants={staggerContainer}>
            <motion.span
              variants={fadeInUp}
              className="inline-flex items-center gap-2 py-1.5 px-3 sm:px-4 rounded-full bg-white/10 text-blue-300 font-semibold text-xs sm:text-sm mb-5 sm:mb-6 border border-white/10 backdrop-blur-sm"
            >
              <span className="w-2 h-2 rounded-full bg-green-400 animate-pulse shadow-[0_0_8px_4px_rgba(74,222,128,0.6)]" />
              Your Local Tech Partner · Bangalore
            </motion.span>

            <motion.h1
              variants={fadeInUp}
              className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight mb-6 leading-[1.05] text-white"
            >
              Fast, Reliable<br />&amp; Affordable<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-cyan-400">
                IT Services
              </span>
            </motion.h1>

            <motion.p variants={fadeInUp} className="text-base sm:text-lg text-slate-400 mb-8 sm:mb-10 leading-relaxed max-w-lg">
              Expert computer repair and professional website development in Bangalore.
              Honest pricing, no jargon, no hidden fees — just real solutions.
            </motion.p>

            <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row gap-4">
              <Button
                size="lg"
                className="h-13 px-8 text-base bg-blue-600 hover:bg-blue-500 text-white shadow-lg shadow-blue-600/30"
                onClick={() => { track('hero_cta_services'); navigate('/free-diagnosis'); }}
                data-testid="button-hero-quote"
              >
                Get Free Diagnosis <ArrowRight className="ml-2 w-4 h-4" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-13 px-8 text-base border-white/20 text-white bg-white/5 hover:bg-white/10 backdrop-blur-sm"
                onClick={() => { track('hero_cta_whatsapp'); window.open('https://wa.me/918088461724'); }}
                data-testid="button-hero-whatsapp"
              >
                <FaWhatsapp className="w-5 h-5 mr-2 text-green-400" />
                WhatsApp Us
              </Button>
            </motion.div>

            <motion.div variants={fadeInUp} className="mt-10 flex flex-wrap gap-6 text-sm font-medium text-slate-400">
              {['Fast Turnaround', 'No Hidden Fees', 'Free Diagnostics'].map(t => (
                <div key={t} className="flex items-center gap-2">
                  <CheckCircle2 className="w-4 h-4 text-blue-400 shrink-0" /> {t}
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right — code editor illustration */}
          <motion.div
            initial={{ opacity: 0, scale: 0.92 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.8, ease: 'easeOut' as const }}
            className="relative hidden lg:block"
          >
            <div className="absolute -inset-8 bg-blue-600/10 blur-3xl rounded-3xl pointer-events-none" />

            <div className="relative bg-[#1e1e2e] rounded-2xl overflow-hidden shadow-2xl ring-1 ring-white/10 font-mono text-sm">
              <div className="flex items-center gap-1.5 px-4 py-3 bg-[#181825] border-b border-white/5">
                <span className="w-3 h-3 rounded-full bg-[#f38ba8]" />
                <span className="w-3 h-3 rounded-full bg-[#f9e2af]" />
                <span className="w-3 h-3 rounded-full bg-[#a6e3a1]" />
                <span className="text-xs text-slate-500 ml-3">index.html — Larsha Technologies</span>
              </div>
              <div className="flex bg-[#181825] border-b border-white/5 text-xs">
                <span className="px-4 py-2 bg-[#1e1e2e] text-[#89b4fa] border-t-2 border-[#89b4fa] border-r border-white/5">index.html</span>
                <span className="px-4 py-2 text-slate-500 border-r border-white/5">style.css</span>
                <span className="px-4 py-2 text-slate-500">script.js</span>
              </div>
              <div className="p-6 leading-7 space-y-0.5">
                <div><span className="text-[#585b70]">&lt;!-- Larsha Technologies Website --&gt;</span></div>
                <div>
                  <span className="text-[#89b4fa]">&lt;section</span>
                  {' '}<span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span><span className="text-[#a6e3a1]">"hero"</span>
                  <span className="text-[#89b4fa]">&gt;</span>
                </div>
                <div className="pl-5">
                  <span className="text-[#89b4fa]">&lt;h1</span>{' '}
                  <span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span><span className="text-[#a6e3a1]">"title"</span>
                  <span className="text-[#89b4fa]">&gt;</span>
                </div>
                <div className="pl-10 text-[#cdd6f4]">Fast &amp; Reliable IT Services</div>
                <div className="pl-5"><span className="text-[#89b4fa]">&lt;/h1&gt;</span></div>
                <div className="pl-5">
                  <span className="text-[#89b4fa]">&lt;a</span>{' '}
                  <span className="text-[#cba6f7]">href</span><span className="text-[#cdd6f4]">=</span>
                  <span className="text-[#a6e3a1]">"tel:+918088461724"</span>
                </div>
                <div className="pl-10">
                  <span className="text-[#cba6f7]">class</span><span className="text-[#cdd6f4]">=</span>
                  <span className="text-[#a6e3a1]">"btn-cta"</span><span className="text-[#89b4fa]">&gt;</span>
                </div>
                <div className="pl-10 text-[#cdd6f4]">Call Now — Free Diagnosis</div>
                <div className="pl-5"><span className="text-[#89b4fa]">&lt;/a&gt;</span></div>
                <div><span className="text-[#89b4fa]">&lt;/section&gt;</span></div>
                <div className="inline-block w-2 h-[1.1em] bg-[#89b4fa] animate-pulse rounded-[1px] align-middle" />
              </div>
              <div className="flex items-center gap-4 px-4 py-2 bg-[#181825] border-t border-white/5 text-xs text-slate-500">
                <span className="flex items-center gap-1.5 text-[#a6e3a1]">
                  <span className="w-2 h-2 rounded-full bg-[#a6e3a1] animate-pulse" />
                  Currently Accepting Repairs
                </span>
                <span className="ml-auto">HTML · UTF-8</span>
              </div>
            </div>

            {/* Floating repair checklist */}
            <motion.div
              initial={{ y: -12, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.5, duration: 0.5 }}
              className="absolute -top-4 -right-6 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl backdrop-blur-sm animate-float"
            >
              <div className="flex items-center gap-2 mb-3">
                <Wrench className="w-4 h-4 text-blue-400" />
                <span className="text-xs font-bold text-white">System Repair</span>
              </div>
              <div className="space-y-2">
                {[{ label: 'Virus Removal', done: true }, { label: 'SSD Upgrade', done: true }, { label: 'OS Install', done: false }].map(({ label, done }) => (
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

            {/* Floating Web Design badge */}
            <motion.div
              initial={{ y: 16, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.6, duration: 0.5 }}
              className="absolute -bottom-5 -left-5 bg-slate-900 border border-white/10 rounded-xl p-4 shadow-2xl flex items-center gap-3 backdrop-blur-sm animate-float-slow"
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
  );
}
