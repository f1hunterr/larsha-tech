import React, { useEffect } from 'react';
import { motion } from 'framer-motion';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from '@/components/ui/accordion';

const FAQS = [
  {
    q: 'Do you come to my home or office?',
    a: "Yes! We offer doorstep service across Bangalore — homes, offices, and shops. We also provide remote support for software issues via secure screen sharing. Just WhatsApp us your location and we'll schedule a visit at a time that suits you.",
  },
  {
    q: 'How long does a repair take?',
    a: "Most software issues, OS installations, and optimizations are completed the same day. Hardware repairs usually take 24–48 hours. We always give you a clear timeline before starting any work — no surprises.",
  },
  {
    q: "What if you can't fix the problem?",
    a: "You pay absolutely nothing. Our free diagnostics promise is simple: if we assess your device and cannot solve the problem, there's no charge. We'd rather be honest than bill you for a failed attempt.",
  },
  {
    q: 'How do I know my data is safe?',
    a: "Data privacy is our top priority. We never access personal files unless required for the repair, and we always recommend taking a backup before any work begins. You're welcome to be present throughout the entire repair if you prefer.",
  },
  {
    q: 'Do you offer a warranty on repairs?',
    a: "Yes — we provide a 30-day service warranty on all repairs. If the same issue recurs within 30 days, we fix it at no additional cost. This reflects our confidence in the quality of our work.",
  },
  {
    q: 'What payment methods do you accept?',
    a: "We accept cash, all UPI apps (GPay, PhonePe, Paytm), and bank transfers. Payment is collected only after the work is completed and you're fully satisfied — not before.",
  },
  {
    q: 'Can you build a website if I have no technical knowledge?',
    a: "Absolutely — that's exactly who we build for. Just share your business idea and what you want the website to do. We handle everything: design, development, domain registration, and hosting setup. No jargon, no technical knowledge needed from your side.",
  },
];

export default function FAQ() {
  useEffect(() => {
    const script = document.createElement('script');
    script.type = 'application/ld+json';
    script.id = 'faq-schema';
    script.textContent = JSON.stringify({
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: FAQS.map(faq => ({
        '@type': 'Question',
        name: faq.q,
        acceptedAnswer: { '@type': 'Answer', text: faq.a },
      })),
    });
    document.head.appendChild(script);
    return () => { document.getElementById('faq-schema')?.remove(); };
  }, []);

  return (
    <section id="faq" className="py-14 sm:py-24 bg-muted">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">FAQ</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Frequently Asked Questions</h2>
          <p className="text-muted-foreground text-lg">Everything you need to know before reaching out.</p>
        </div>

        <Accordion type="single" collapsible className="max-w-3xl mx-auto space-y-3">
          {FAQS.map((faq, i) => (
            <AccordionItem
              key={i}
              value={`faq-${i}`}
              className="border-0 bg-card rounded-xl shadow-sm px-4 sm:px-6 overflow-hidden"
            >
              <AccordionTrigger className="text-sm sm:text-base font-semibold py-4 sm:py-5 hover:no-underline text-left min-h-[44px]">
                {faq.q}
              </AccordionTrigger>
              <AccordionContent className="text-muted-foreground text-sm leading-relaxed pb-4 sm:pb-5">
                {faq.a}
              </AccordionContent>
            </AccordionItem>
          ))}
        </Accordion>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">Still have questions? We're one message away.</p>
          <Button variant="outline" onClick={() => window.open('https://wa.me/918088461724')}>
            <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" />
            Ask on WhatsApp
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
