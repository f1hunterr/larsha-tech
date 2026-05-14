import React from 'react';
import { Wrench, Globe, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

const REPAIR_ITEMS = [
  { service: 'OS Installation', range: '₹800 – ₹1,200', note: 'Clean install with all drivers. Bring your license key or we help.' },
  { service: 'SSD Upgrade', range: '₹1,000 – ₹1,500', note: 'Data migration from old drive included. Files and apps stay intact.' },
  { service: 'Full Service & Deep Clean', range: '₹1,500 – ₹2,000', note: 'Internal cleaning, thermal paste, driver updates, startup tuning.' },
];

const WEB_ITEMS = [
  { title: 'Basic', sub: 'Single landing page', price: '₹3,000 – ₹5,000', note: 'Ideal for freelancers & shops. Ready in 3–5 days.', highlight: false },
  { title: 'Business', sub: '3–5 pages, contact form', price: '₹8,000 – ₹15,000', note: 'Most popular. Includes WhatsApp button, maps & SEO basics.', highlight: true },
  { title: 'Advanced', sub: 'Custom features, CMS', price: '₹20,000+', note: 'Custom quote after a free consultation call.', highlight: false },
];

export default function Pricing() {
  return (
    <section id="pricing" className="py-14 sm:py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Pricing</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">Transparent Pricing</h2>
          <p className="text-muted-foreground text-lg">Honest rates. No surprises, ever.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">

          {/* Repair Card */}
          <Card className="border shadow-sm hover:shadow-md transition-shadow">
            <CardHeader className="pb-6">
              <div className="flex items-center gap-3 mb-1">
                <div className="w-10 h-10 rounded-lg bg-blue-50 dark:bg-blue-950/40 border border-blue-100 dark:border-blue-900/50 flex items-center justify-center">
                  <Wrench className="w-5 h-5 text-blue-600 dark:text-blue-400" />
                </div>
                <CardTitle className="text-xl">Computer Repair</CardTitle>
              </div>
              <CardDescription>Affordable fixes to keep you running</CardDescription>
            </CardHeader>
            <CardContent>
              <ul className="space-y-4">
                {REPAIR_ITEMS.map(({ service, range, note }) => (
                  <li key={service} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                    <div className="flex flex-wrap justify-between items-start gap-x-2 mb-1">
                      <span className="text-sm font-semibold">{service}</span>
                      <span className="font-bold text-sm sm:whitespace-nowrap sm:ml-4 text-primary text-right">{range}</span>
                    </div>
                    <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
                  </li>
                ))}
              </ul>
            </CardContent>
            <CardFooter className="flex flex-col gap-3">
              <Button
                variant="outline"
                className="w-full h-11 text-blue-600 border-blue-200 dark:border-blue-800 hover:bg-blue-50 dark:hover:bg-blue-950/40"
                onClick={() => window.open('tel:+918088461724')}
                data-testid="button-price-repair"
              >
                Book Repair
              </Button>
              <p className="text-xs text-center text-muted-foreground flex items-center justify-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5 text-green-500 shrink-0" />
                Free diagnosis always included — no fix, no fee
              </p>
            </CardFooter>
          </Card>

          {/* Web Dev Card — featured */}
          <div className="relative">
            <div className="absolute -inset-0.5 rounded-2xl bg-gradient-to-br from-blue-500 to-violet-600 opacity-60 blur-sm" />
            <Card className="relative border-0 shadow-xl">
              <div className="absolute top-0 right-0 bg-gradient-to-r from-blue-600 to-violet-600 text-white px-4 py-1 text-xs font-bold rounded-bl-xl rounded-tr-xl tracking-wide">
                POPULAR
              </div>
              <CardHeader className="pb-6">
                <div className="flex items-center gap-3 mb-1">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center">
                    <Globe className="w-5 h-5 text-primary" />
                  </div>
                  <CardTitle className="text-xl">Web Development</CardTitle>
                </div>
                <CardDescription>Professional presence online</CardDescription>
              </CardHeader>
              <CardContent>
                <ul className="space-y-4">
                  {WEB_ITEMS.map(({ title, sub, price, note, highlight }) => (
                    <li key={title} className="border-b border-border/50 pb-4 last:border-0 last:pb-0">
                      <div className="flex flex-wrap justify-between items-start gap-x-2 mb-1">
                        <div>
                          <p className={`font-bold text-sm ${highlight ? 'text-primary' : ''}`}>{title}</p>
                          <p className="text-xs text-muted-foreground">{sub}</p>
                        </div>
                        <span className={`font-bold text-sm sm:whitespace-nowrap sm:ml-4 text-right ${highlight ? 'text-primary' : ''}`}>{price}</span>
                      </div>
                      <p className="text-xs text-muted-foreground leading-relaxed">{note}</p>
                    </li>
                  ))}
                </ul>
              </CardContent>
              <CardFooter>
                <Button
                  className="w-full h-11 shadow-sm"
                  onClick={() => window.open('https://wa.me/918088461724?text=Hi%2C%20I%20need%20a%20website%20built')}
                  data-testid="button-price-web"
                >
                  Discuss Your Project
                </Button>
              </CardFooter>
            </Card>
          </div>

        </div>
      </div>
    </section>
  );
}
