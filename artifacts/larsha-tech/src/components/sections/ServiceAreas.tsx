import React from 'react';
import { MapPin } from 'lucide-react';
import { motion } from 'framer-motion';

const AREAS = [
  'Hennur', 'Koramangala', 'Indiranagar', 'Domlur',
  'Kalyan Nagar', 'Kammanahalli',
];

export default function ServiceAreas() {
  return (
    <section className="py-14 sm:py-20 bg-background">
      <div className="container mx-auto px-4">

        <div className="text-center mb-10">
          <div className="inline-flex items-center gap-2 bg-blue-50 dark:bg-blue-950/40 text-blue-600 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full mb-4">
            <MapPin className="w-3.5 h-3.5" /> Current Service Areas
          </div>
          <h2 className="text-2xl sm:text-3xl font-black text-foreground mb-3">
            We Come to You
          </h2>
          <p className="text-muted-foreground text-sm sm:text-base max-w-xl mx-auto">
            Doorstep laptop &amp; computer repair in these areas. Not on the list? Call us — we'll figure it out.
          </p>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 12 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.4 }}
          className="flex flex-wrap justify-center gap-2 max-w-4xl mx-auto"
        >
          {AREAS.map((area) => (
            <span
              key={area}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full border border-input bg-card text-sm text-foreground hover:border-primary/50 hover:bg-primary/5 transition-colors"
            >
              <MapPin className="w-3 h-3 text-blue-500 shrink-0" />
              {area}
            </span>
          ))}
        </motion.div>

        <p className="text-center text-xs text-muted-foreground mt-6">
          +Surrounding areas · Doorstep visits available · Remote support anywhere in India
        </p>

      </div>
    </section>
  );
}
