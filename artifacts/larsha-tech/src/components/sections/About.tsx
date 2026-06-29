import React from 'react';
import { motion } from 'framer-motion';
import { BadgeCheck } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

const STATS = [
  { label: 'Service Area',  value: '6 Areas'       },
  { label: 'Response Time', value: 'Post Diagnosis'  },
  { label: 'Diagnostics',   value: 'Always Free'    },
  { label: 'Warranty',      value: '30 Days'        },
];

export default function About() {
  return (
    <section id="about" className="py-14 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10 md:gap-14 items-center">

          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.55 }}
            className="flex flex-col items-center md:items-start"
          >
            <div className="relative mb-6">
              <img
                src={`${import.meta.env.BASE_URL}hemanth.jpg`}
                alt="Hemanth K — Founder, Larsha Technologies"
                loading="lazy"
                decoding="async"
                className="w-36 h-36 sm:w-48 sm:h-48 rounded-3xl object-cover shadow-2xl shadow-blue-500/25"
              />
              <div className="absolute -bottom-3 -right-3 bg-card border shadow-md rounded-xl px-3 py-2 flex items-center gap-2">
                <BadgeCheck className="w-4 h-4 text-blue-600 shrink-0" />
                <span className="text-xs font-bold">Verified Tech</span>
              </div>
            </div>

            <h2 className="text-2xl font-black mb-1">Hemanth K</h2>
            <p className="text-primary font-semibold text-sm mb-4">Founder &amp; Tech Lead, Larsha Technologies</p>

            <div className="grid grid-cols-2 gap-3 w-full max-w-xs">
              {STATS.map(({ label, value }) => (
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
            <h3 className="text-2xl sm:text-3xl md:text-4xl font-black mb-5 leading-tight">
              The person behind<br />Larsha Technologies
            </h3>
            <p className="text-muted-foreground leading-relaxed mb-5">
              Hi, I'm Hemanth — a Bangalore-based tech professional who believes everyone deserves
              honest, jargon-free IT support. I started Larsha Technologies to offer real solutions to real
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
  );
}
