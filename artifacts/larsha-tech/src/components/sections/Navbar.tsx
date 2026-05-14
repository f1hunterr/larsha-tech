import React, { useState, useEffect } from 'react';
import { Monitor, PhoneCall, Menu, X, Sun, Moon } from 'lucide-react';
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

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMobileOpen(false);
  };

  return (
    <header className={`sticky top-0 z-50 w-full transition-all duration-300 ${
      scrolled ? 'bg-background/95 backdrop-blur-md border-b shadow-sm' : 'bg-slate-950 border-b border-transparent'
    }`}>
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">

        {/* Logo */}
        <button onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })} className="flex items-center gap-2 font-bold text-xl tracking-tight">
          <Monitor className="w-6 h-6 text-primary" />
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
            className={`p-2 rounded-lg transition-colors ${
              scrolled ? 'text-muted-foreground hover:text-foreground hover:bg-muted' : 'text-white/70 hover:text-white hover:bg-white/10'
            }`}
          >
            {isDark ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </button>

          <Button
            onClick={() => window.open('tel:+918088461724')}
            className={scrolled ? '' : 'bg-white text-slate-900 hover:bg-white/90'}
          >
            <PhoneCall className="w-4 h-4 mr-2" /> Call Now
          </Button>

          <button
            className={`md:hidden p-2 rounded-md transition-colors ${
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
                className="text-left px-3 py-3 rounded-lg text-sm font-medium text-muted-foreground hover:text-primary hover:bg-muted transition-colors"
              >
                {label}
              </button>
            ))}
            <div className="pt-2 border-t mt-2 flex gap-2">
              <Button className="flex-1" onClick={() => { window.open('tel:+918088461724'); setMobileOpen(false); }}>
                <PhoneCall className="w-4 h-4 mr-2" /> Call Now
              </Button>
              <Button variant="outline" className="flex-1" onClick={() => { window.open('https://wa.me/918088461724'); setMobileOpen(false); }}>
                <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" /> WhatsApp
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
