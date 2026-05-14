import React from 'react';
import { Monitor, PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import UrgencyBanner from '@/components/UrgencyBanner';
import Navbar from '@/components/sections/Navbar';
import Hero from '@/components/sections/Hero';
import BrandStrip from '@/components/sections/BrandStrip';
import WhyUs from '@/components/sections/WhyUs';
import Services from '@/components/sections/Services';
import Pricing from '@/components/sections/Pricing';
import HowWeWork from '@/components/sections/HowWeWork';
import About from '@/components/sections/About';
import FAQ from '@/components/sections/FAQ';
import LeadForm from '@/components/sections/LeadForm';
import Contact from '@/components/sections/Contact';

export default function Home() {
  return (
    <div className="flex flex-col min-h-screen pb-20 md:pb-0">
      <UrgencyBanner />
      <Navbar />

      <main className="flex-1">
        <Hero />
        <BrandStrip />
        <WhyUs />
        <Services />
        <LeadForm />
        <Pricing />
        <HowWeWork />
        <About />
        <FAQ />
        <Contact />
      </main>

      {/* Floating WhatsApp — desktop only */}
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

      {/* Footer */}
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

      {/* Mobile sticky CTA bar */}
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
