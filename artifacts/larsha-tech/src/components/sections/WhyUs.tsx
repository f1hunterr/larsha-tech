import React from 'react';
import { motion } from 'framer-motion';
import { Zap, CheckCircle2, MapPin, ShieldCheck } from 'lucide-react';

const FEATURES = [
  { icon: Zap,          title: 'Quick & Fast',    desc: 'Repair time depends on diagnosis — we give you a clear timeline before we start.',  color: 'text-amber-500',  bg: 'bg-amber-50 dark:bg-amber-950/40',   border: 'border-amber-100 dark:border-amber-900/50'  },
  { icon: CheckCircle2, title: 'Affordable',      desc: 'Honest pricing with no hidden fees. Quality service that fits your budget.',    color: 'text-green-500',  bg: 'bg-green-50 dark:bg-green-950/40',   border: 'border-green-100 dark:border-green-900/50'  },
  { icon: MapPin,       title: 'Onsite & Remote', desc: 'We come to you, or fix software issues remotely via secure connection.',        color: 'text-blue-500',   bg: 'bg-blue-50 dark:bg-blue-950/40',     border: 'border-blue-100 dark:border-blue-900/50'    },
  { icon: ShieldCheck,  title: 'Reliable',        desc: 'Professional technicians ensuring your data is safe and systems run perfectly.', color: 'text-purple-500', bg: 'bg-purple-50 dark:bg-purple-950/40', border: 'border-purple-100 dark:border-purple-900/50'},
];

export default function WhyUs() {
  return (
    <section id="why-us" className="py-14 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Why Larsha Tech</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">We aren't just another IT company</h2>
          <p className="text-muted-foreground text-lg">Your local, dependable partner for everything tech.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {FEATURES.map((f, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-80px' }}
              transition={{ delay: i * 0.1, duration: 0.5 }}
              className="p-4 sm:p-6 rounded-2xl bg-card border shadow-sm hover:shadow-md hover:-translate-y-1 transition-all duration-200"
            >
              <div className={`w-12 h-12 rounded-xl ${f.bg} border ${f.border} flex items-center justify-center ${f.color} mb-5`}>
                <f.icon className="w-6 h-6" />
              </div>
              <h3 className="font-bold text-base sm:text-lg mb-2">{f.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">{f.desc}</p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
