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
  const [scrolled, setScrolled] = useState(false);
  const [activeSection, setActiveSection] = useState('home');
  const { isDark, toggle: toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

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
    if (id === 'home') {
      navigate('/');
      window.scrollTo({ top: 0, behavior: 'smooth' });
      setMobileOpen(false);
      return;
    }
    if (!isHome) {
      navigate('/');
      setTimeout(() => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' }), 150);
    } else {
      document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    }
    setMobileOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-slate-950 border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4">

        {/* Logo — flex-shrink-0 prevents it from being squeezed */}
        <button
          onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')}
          className="flex-shrink-0 flex items-center gap-2 font-bold text-lg tracking-tight"
        >
          <span className="flex-shrink-0 w-9 h-9 rounded-full bg-white flex items-center justify-center shadow-sm">
            <img src={`${import.meta.env.BASE_URL}logo.svg`} alt="" className="h-6 w-6 object-contain" />
          </span>
          <span className={scrolled ? 'text-foreground' : 'text-white'}>
            Larsha <span className="text-primary">Tech</span>
          </span>
        </button>

        {/* Desktop nav — only at lg (1024px+) so buttons have room below that */}
        <nav className="hidden lg:flex items-center gap-4 xl:gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ label, id }) => {
            const isActive = activeSection === id;
            return (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className={`relative whitespace-nowrap transition-colors hover:text-primary ${
                  isActive
                    ? 'text-primary font-semibold'
                    : scrolled ? 'text-muted-foreground' : 'text-white/80'
                }`}
              >
                {label}
                {isActive && (
                  <span className="absolute -bottom-1 left-0 right-0 h-0.5 rounded-full bg-primary" />
                )}
              </button>
            );
          })}
        </nav>

        {/* Actions — graduated visibility by breakpoint */}
        <div className="flex items-center gap-1.5 xl:gap-2 flex-shrink-0">

          {/* Theme toggle — always visible */}
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {isDark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          {/* Free Diagnosis — sm (640px+): primary CTA, always near */}
          <Button
            size="sm"
            className={`hidden sm:flex bg-pink-600 hover:bg-pink-700 text-white border-0`}
            onClick={() => { navigate('/free-diagnosis'); setMobileOpen(false); }}
          >
            Free Diagnosis
          </Button>

          {/* Book Repair — md (768px+) */}
          <Button
            size="sm"
            variant="outline"
            className={`hidden md:flex ${scrolled ? '' : 'border-white/30 text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => { navigate('/book-repair'); setMobileOpen(false); }}
          >
            Book Repair
          </Button>

          {/* Careers — xl (1280px+) */}
          <Button
            size="sm"
            variant="outline"
            className={`hidden xl:flex ${scrolled ? '' : 'border-white/30 text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => { navigate('/careers'); setMobileOpen(false); }}
          >
            Careers
          </Button>

          {/* Call Now — always visible; icon-only on mobile, full label on sm+ */}
          <Button
            size="sm"
            onClick={() => window.open('tel:+918088461724')}
            className={scrolled ? '' : 'bg-white text-slate-900 hover:bg-white/90'}
          >
            <PhoneCall className="w-4 h-4 sm:mr-2" />
            <span className="hidden sm:inline">Call Now</span>
          </Button>

          {/* Admin lock — xl (1280px+) */}
          <button
            onClick={() => { navigate('/admin'); setMobileOpen(false); }}
            aria-label="Admin login"
            title="Admin login"
            className={`hidden xl:flex p-2 rounded-lg transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted' : 'text-white/50 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>

          {/* Hamburger — lg:hidden (below 1024px) */}
          <button
            className={`lg:hidden p-2 rounded-md transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
            }`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile / tablet drawer — lg:hidden */}
      {mobileOpen && (
        <div className="lg:hidden border-t bg-background shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, id }) => {
              const isActive = activeSection === id;
              return (
                <button
                  key={id}
                  onClick={() => scrollTo(id)}
                  className={`text-left px-4 py-3 min-h-[44px] flex items-center rounded-lg text-sm font-medium transition-colors ${
                    isActive
                      ? 'text-primary bg-primary/10 font-semibold'
                      : 'text-muted-foreground hover:text-primary hover:bg-muted'
                  }`}
                >
                  {label}
                </button>
              );
            })}
            <div className="pt-2 border-t mt-2 space-y-2">
              <Button
                className="w-full bg-pink-600 hover:bg-pink-700 text-white"
                onClick={() => { navigate('/free-diagnosis'); setMobileOpen(false); }}
              >
                Free Diagnosis
              </Button>
              <Button
                className="w-full bg-blue-600 hover:bg-blue-700 text-white"
                onClick={() => { navigate('/book-repair'); setMobileOpen(false); }}
              >
                Book a Repair
              </Button>
              <Button
                variant="outline"
                className="w-full border-violet-200 dark:border-violet-800 text-violet-700 dark:text-violet-400 hover:bg-violet-50 dark:hover:bg-violet-950/30"
                onClick={() => { navigate('/careers'); setMobileOpen(false); }}
              >
                View Careers
              </Button>
              <div className="flex gap-2">
                <Button className="flex-1" onClick={() => { window.open('tel:+918088461724'); setMobileOpen(false); }}>
                  <PhoneCall className="w-4 h-4 mr-2" /> Call Now
                </Button>
                <Button variant="outline" className="flex-1" onClick={() => { window.open('https://wa.me/918088461724'); setMobileOpen(false); }}>
                  <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
                </Button>
              </div>
              <button
                onClick={() => { navigate('/admin'); setMobileOpen(false); }}
                className="w-full flex items-center justify-center gap-2 text-xs text-muted-foreground hover:text-foreground py-2 transition-colors"
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
