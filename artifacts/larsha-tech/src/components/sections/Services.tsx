import React from 'react';
import { motion } from 'framer-motion';
import { Wrench, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';

const scrollTo = (id: string) => document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });

export default function Services() {
  return (
    <section id="services" className="py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">What We Do</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Our Core Services</h2>
          <p className="text-muted-foreground text-lg">Comprehensive solutions for hardware and your digital presence.</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Computer Repair */}
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

          {/* Web Development */}
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
  );
}
