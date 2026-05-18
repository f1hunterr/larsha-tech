import React from 'react';
import { PhoneCall } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

export default function Contact() {
  return (
    <section id="contact" className="py-14 sm:py-24 relative overflow-hidden bg-slate-950">
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[700px] h-[400px] bg-blue-600/15 rounded-full blur-[100px] pointer-events-none" />
      <div
        className="absolute inset-0 opacity-[0.06] pointer-events-none"
        style={{ backgroundImage: 'radial-gradient(circle, #94a3b8 1px, transparent 1px)', backgroundSize: '28px 28px' }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl mx-auto text-center">
          <p className="text-blue-400 font-bold text-sm uppercase tracking-widest mb-4">Get In Touch</p>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black mb-6 text-white">Ready to get started?</h2>
          <p className="text-slate-400 text-base sm:text-lg mb-8 sm:mb-10 leading-relaxed">
            Whether you need a quick repair or a brand new website, we're here to help.
            Describe your issue and get support fast.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-14">
            <Button
              size="lg"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base bg-white text-slate-900 hover:bg-slate-100 shadow-lg"
              onClick={() => window.open('tel:+918088461724')}
              data-testid="button-cta-call"
            >
              <PhoneCall className="w-5 h-5 mr-3" />
              +91 80884 61724
            </Button>
            <Button
              size="lg"
              variant="outline"
              className="w-full sm:w-auto h-12 sm:h-14 px-6 sm:px-10 text-sm sm:text-base border-white/15 text-white hover:bg-white/10"
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
              { label: 'WhatsApp',      value: 'wa.me/918088461724',      href: 'https://wa.me/918088461724' },
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
  );
}
