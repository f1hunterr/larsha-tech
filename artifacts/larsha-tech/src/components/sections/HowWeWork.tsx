import React from 'react';
import { motion } from 'framer-motion';
import { MessageCircle, ClipboardList, Wrench, BadgeCheck, Headphones } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const STEPS = [
  { step: '01', icon: MessageCircle, title: 'Contact Us',       desc: 'Reach out via WhatsApp or call. No technical knowledge needed.',    color: 'text-blue-600 dark:text-blue-400',   bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-100 dark:border-blue-900/50',    ring: 'ring-blue-200 dark:ring-blue-900'   },
  { step: '02', icon: ClipboardList, title: 'Free Diagnosis',   desc: 'We assess the issue at zero cost and give you a clear honest quote.', color: 'text-purple-600 dark:text-purple-400',bg: 'bg-purple-50 dark:bg-purple-950/40',border: 'border-purple-100 dark:border-purple-900/50',ring: 'ring-purple-200 dark:ring-purple-900'},
  { step: '03', icon: Wrench,        title: 'We Fix or Build',  desc: 'Repair or website done with care. You get updates throughout.',      color: 'text-primary',                        bg: 'bg-blue-50 dark:bg-blue-950/40',    border: 'border-blue-100 dark:border-blue-900/50',    ring: 'ring-blue-200 dark:ring-blue-900'   },
  { step: '04', icon: BadgeCheck,    title: "You're Satisfied", desc: "We hand over only when you're happy. Post-service support included.",color: 'text-green-600 dark:text-green-400',  bg: 'bg-green-50 dark:bg-green-950/40',  border: 'border-green-100 dark:border-green-900/50',  ring: 'ring-green-200 dark:ring-green-900' },
];

export default function HowWeWork() {
  return (
    <section id="how-we-work" className="py-14 sm:py-24 bg-muted border-t border-b">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">The Process</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">How We Work</h2>
          <p className="text-muted-foreground text-lg">Simple, transparent, and stress-free — every time.</p>
        </div>

        <div className="relative max-w-5xl mx-auto">
          <div className="hidden lg:block absolute top-[2.75rem] left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-transparent via-border to-transparent" />

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {STEPS.map((item, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: '-60px' }}
                transition={{ delay: i * 0.12, duration: 0.5 }}
                className="relative bg-card rounded-2xl p-4 sm:p-6 border shadow-sm flex flex-col items-center text-center"
              >
                <div className={`relative z-10 w-14 h-14 rounded-full ${item.bg} border ${item.border} ring-4 ${item.ring} flex items-center justify-center ${item.color} mb-5`}>
                  <item.icon className="w-6 h-6" />
                </div>
                <span className="text-xs font-black text-muted-foreground/40 tracking-widest mb-1">{item.step}</span>
                <h3 className="font-bold text-base mb-2">{item.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{item.desc}</p>
              </motion.div>
            ))}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-12 max-w-xl mx-auto bg-card border shadow-sm rounded-2xl p-5 sm:p-7 text-center"
        >
          <Headphones className="w-8 h-8 text-primary mx-auto mb-3" />
          <h3 className="font-black text-xl mb-2">Free Diagnostics — Always</h3>

          <p className="text-muted-foreground text-sm mb-5 leading-relaxed">
            We diagnose your issue at zero cost. No fix, no fee.
            You only pay when you're satisfied with the solution.
          </p>
          <Button
            onClick={() => window.open('https://wa.me/918088461724?text=Hi%2C%20I%20need%20a%20free%20diagnosis')}
            data-testid="button-free-diag"
          >
            <FaWhatsapp className="w-4 h-4 mr-2 text-green-400" />
            Book a Free Diagnosis
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
