import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

export default function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try { return localStorage.getItem('urgency-dismissed') === '1'; }
    catch { return false; }
  });

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('urgency-dismissed', '1'); } catch {}
  };

  return (
    <AnimatePresence>
      {!dismissed && (
        <motion.div
          initial={{ height: 0, opacity: 0 }}
          animate={{ height: 'auto', opacity: 1 }}
          exit={{ height: 0, opacity: 0 }}
          transition={{ duration: 0.25 }}
          className="overflow-hidden bg-gradient-to-r from-blue-600 to-violet-600 text-white"
        >
          <div className="container mx-auto px-4 py-2 flex items-center justify-between gap-4">
            <div className="flex-1" />
            <p className="flex items-center gap-2 text-xs font-semibold text-center">
              <Zap className="w-3.5 h-3.5 shrink-0 text-yellow-300" />
              Same-day repair slots available today · Free diagnosis for all walk-ins · Limited slots
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="underline underline-offset-2 hover:text-yellow-200 transition-colors whitespace-nowrap"
              >
                Book now →
              </a>
            </p>
            <div className="flex-1 flex justify-end">
              <button onClick={dismiss} aria-label="Dismiss" className="p-1 rounded hover:bg-white/20 transition-colors">
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
