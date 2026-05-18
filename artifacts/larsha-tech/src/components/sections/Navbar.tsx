import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PhoneCall, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Home',      id: 'home'       },
  { label: 'Services',  id: 'services'   },
  { label: 'Pricing',   id: 'pricing'    },
  { label: 'Get Quote', id: 'get-quote'  },
  { label: 'About',     id: 'about'      },
  { label: 'FAQ',       id: 'faq'        },
  { label: 'Contact',   id: 'contact'    },
];

const SECTION_IDS = NAV_LINKS.map(l => l.id).filter(id => id !== 'home');

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggle: toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    if (!isHome) { setActiveSection(''); return; }
    const detect = () => {
      const scrollY = window.scrollY;
      if (scrollY < 80) { setActiveSection('home'); return; }
      const entries = SECTION_IDS
        .map(id => {
          const el = document.getElementById(id);
          return el ? { id, top: el.getBoundingClientRect().top + scrollY } : null;
        })
        .filter((e): e is { id: string; top: number } => e !== null)
        .sort((a, b) => a.top - b.top);
      const trigger = scrollY + window.innerHeight * 0.4;
      let current = 'home';
      for (const { id, top } of entries) {
        if (top <= trigger) current = id;
        else break;
      }
      setActiveSection(current);
    };
    detect();
    window.addEventListener('scroll', detect, { passive: true });
    return () => window.removeEventListener('scroll', detect);
  }, [isHome]);

  const scrollTo = (id: string) => {
    setMobileOpen(false);
    if (id === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      return;
    }
    const doScroll = () => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    if (!isHome) {
      navigate('/');
      setTimeout(doScroll, 200);
    } else {
      setTimeout(doScroll, 80);
    }
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 w-full bg-slate-950/95 backdrop-blur-md border-b border-white/10 shadow-[0_1px_12px_rgba(0,0,0,0.4)]">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo */}
        <button
          onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
          className="flex-shrink-0 flex items-center gap-2.5 font-bold text-lg tracking-tight"
        >
          <span className="flex-shrink-0 w-11 h-11 rounded-full bg-white flex items-center justify-center shadow-md ring-2 ring-white/20">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-7 w-7 object-contain" />
          </span>
          <span className="text-white">
            Larsha <span className="text-blue-400">Tech</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative whitespace-nowrap transition-colors ${
                  isActive
                    ? 'text-white font-semibold'
                    : 'text-white/60 hover:text-white'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-blue-400" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">

          {/* Theme toggle */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className="p-2 rounded-lg text-white/60 hover:text-white hover:bg-white/10 transition-colors"
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Free Diagnosis — sm+ */}
          <Button
            size="sm"
            className="hidden sm:flex bg-pink-600 hover:bg-pink-500 text-white border-0 shadow-md"
            onClick={() => { navigate('/free-diagnosis'); setMobileOpen(false); }}
          >
            Free Diagnosis
          </Button>

          {/* Book Repair — md+ */}
          <Button
            size="sm"
            variant="outline"
            className="hidden md:flex border-white/25 text-white bg-white/8 hover:bg-white/15 hover:border-white/40"
            onClick={() => { navigate('/book-repair'); setMobileOpen(false); }}
          >
            Book Repair
          </Button>

          {/* Careers — xl+ */}
          <Button
            size="sm"
            variant="outline"
            className="hidden xl:flex border-white/25 text-white bg-white/8 hover:bg-white/15 hover:border-white/40"
            onClick={() => { navigate('/careers'); setMobileOpen(false); }}
          >
            Careers
          </Button>

          {/* Call Now */}
          <Button
            size="sm"
            className="bg-white text-slate-900 hover:bg-slate-100 shadow-md"
            onClick={() => window.open('tel:+918088461724')}
          >
            <PhoneCall className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Call Now</span>
          </Button>

          {/* Admin lock — xl+ */}
          <button
            onClick={() => { navigate('/admin'); setMobileOpen(false); }}
            aria-label="Admin login"
            title="Admin login"
            className="hidden xl:flex p-2 rounded-lg text-white/40 hover:text-white/80 hover:bg-white/10 transition-colors"
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Hamburger */}
          <button
            className="lg:hidden p-2 rounded-md text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer — always dark */}
      {mobileOpen && (
        <div className="lg:hidden border-t border-white/10 bg-slate-900 shadow-2xl">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left px-4 py-3 min-h-[44px] flex items-center rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-white bg-white/10 font-semibold'
                      : 'text-white/60 hover:text-white hover:bg-white/8'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <div className="pt-3 border-t border-white/10 mt-2 space-y-2">
              <Button
                className="w-full bg-pink-600 hover:bg-pink-500 text-white"
                onClick={() => { navigate('/free-diagnosis'); setMobileOpen(false); }}
              >
                Free Diagnosis
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-500 text-white"
                onClick={() => { navigate('/book-repair'); setMobileOpen(false); }}
              >
                Book a Repair
              </Button>
              <Button
                variant="outline"
                className="w-full border-violet-400/30 text-violet-300 bg-violet-500/10 hover:bg-violet-500/20"
                onClick={() => { navigate('/careers'); setMobileOpen(false); }}
              >
                View Careers
              </Button>
              <div className="flex gap-2">
                <Button
                  className="flex-1 bg-white text-slate-900 hover:bg-slate-100"
                  onClick={() => { window.open('tel:+918088461724'); setMobileOpen(false); }}
                >
                  <PhoneCall className="w-4 h-4 mr-2" /> Call Now
                </Button>
                <Button
                  variant="outline"
                  className="flex-1 border-green-400/30 text-green-300 bg-green-500/10 hover:bg-green-500/20"
                  onClick={() => { window.open('https://wa.me/918088461724'); setMobileOpen(false); }}
                >
                  <FaWhatsapp className="w-4 h-4 mr-2 text-green-400" /> WhatsApp
                </Button>
              </div>
              <button
                onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-xs text-white/30 hover:text-white/60 py-2 transition-colors"
              >
                <Lock className="w-3 h-3" /> Admin Login
              </button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
