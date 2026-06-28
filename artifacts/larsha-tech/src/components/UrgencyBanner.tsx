import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Zap } from 'lucide-react';

export default function UrgencyBanner() {
  const [dismissed, setDismissed] = useState(() => {
    try {
      const ts = localStorage.getItem('urgency-dismissed-at');
      if (!ts) return false;
      const sevenDays = 7 * 24 * 60 * 60 * 1000;
      return Date.now() - Number(ts) < sevenDays;
    } catch { return false; }
  });

  const dismiss = () => {
    setDismissed(true);
    try { localStorage.setItem('urgency-dismissed-at', String(Date.now())); } catch {}
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
          <div className="container mx-auto px-4 py-2 flex items-center gap-3">
            <Zap className="w-3.5 h-3.5 shrink-0 text-yellow-300" />
            <p className="flex-1 text-xs font-semibold text-center leading-snug">
              <span className="hidden sm:inline">Repair time depends on diagnosis · Free diagnosis for all walk-ins · </span>
              <span className="sm:hidden">Free diagnosis · Limited slots · </span>
              <a
                href="#contact"
                onClick={e => { e.preventDefault(); document.getElementById('get-quote')?.scrollIntoView({ behavior: 'smooth' }); }}
                className="underline underline-offset-2 hover:text-yellow-200 transition-colors whitespace-nowrap"
              >
                Book now →
              </a>
            </p>
            <button onClick={dismiss} aria-label="Dismiss" className="p-1.5 rounded hover:bg-white/20 transition-colors shrink-0">
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
