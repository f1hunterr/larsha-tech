import React, { useState, useEffect } from 'react';
import { useLocation } from 'wouter';
import { PhoneCall, Menu, X, Sun, Moon, Lock } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { useTheme } from '@/hooks/useTheme';
import { Button } from '@/components/ui/button';

const NAV_LINKS = [
  { label: 'Services',  id: 'services'   },
  { label: 'Pricing',   id: 'pricing'    },
  { label: 'Get Quote', id: 'get-quote'  },
  { label: 'About',     id: 'about'      },
  { label: 'FAQ',       id: 'faq'        },
  { label: 'Contact',   id: 'contact'    },
];

export default function Navbar() {
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const { isDark, toggle: toggleTheme } = useTheme();
  const [location, navigate] = useLocation();
  const isHome = location === '/';

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
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
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => isHome ? window.scrollTo({ top: 0, behavior: 'smooth' }) : navigate('/')} className="flex items-center gap-2 font-bold text-lg sm:text-xl tracking-tight">
          <img src={`${import.meta.env.BASE_URL}logo.png`} alt="" className="h-9 w-auto object-contain" />
          <span className={scrolled ? 'text-foreground' : 'text-white'}>
            Larsha <span className="text-primary">Tech</span>
          </span>
        </button>

        {/* Desktop nav */}
        <nav className="hidden md:flex items-center gap-6 text-sm font-medium">
          {NAV_LINKS.map(({ label, id }) => (
            <button
              key={id}
              onClick={() => scrollTo(id)}
              className={`transition-colors hover:text-primary ${scrolled ? 'text-muted-foreground' : 'text-white/80'}`}
            >
              {label}
            </button>
          ))}
        </nav>

        {/* Actions */}
        <div className="flex items-center gap-2">
          <button
            onClick={toggleTheme}
            aria-label="Toggle theme"
            className={`p-2.5 rounded-lg transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Button
            variant="outline"
            className={`hidden sm:flex ${scrolled ? '' : 'border-white/30 text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => { navigate('/careers'); setMobileOpen(false); }}
          >
            Careers
          </Button>
          <Button
            variant="outline"
            className={`hidden sm:flex ${scrolled ? '' : 'border-white/30 text-white bg-white/10 hover:bg-white/20'}`}
            onClick={() => { navigate('/book-repair'); setMobileOpen(false); }}
          >
            Book Repair
          </Button>
          <Button
            onClick={() => window.open('tel:+918088461724')}
            className={scrolled ? '' : 'bg-white text-slate-900 hover:bg-white/90'}
          >
            <PhoneCall className="w-4 h-4 mr-2" /> Call Now
          </Button>
          <button
            onClick={() => { navigate('/admin'); setMobileOpen(false); }}
            aria-label="Admin login"
            title="Admin login"
            className={`hidden sm:flex p-2.5 rounded-lg transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted' : 'text-white/50 hover:text-white/80 hover:bg-white/10'
            }`}
          >
            <Lock className="w-4 h-4" />
          </button>

          <button
            className={`md:hidden p-2.5 rounded-md transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground' : 'text-white/80 hover:text-white'
            }`}
            onClick={() => setMobileOpen(v => !v)}
            aria-label="Toggle menu"
          >
            {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile drawer */}
      {mobileOpen && (
        <div className="md:hidden border-t bg-background shadow-lg">
          <nav className="container mx-auto px-4 py-4 flex flex-col gap-1">
            {NAV_LINKS.map(({ label, id }) => (
              <button
                key={id}
                onClick={() => scrollTo(id)}
                className="text-left px-4 py-3 min-h-[44px] flex items-center rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="pt-2 border-t mt-2 space-y-2">
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
