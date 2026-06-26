import React from 'react';
import { motion } from 'framer-motion';
import { Star } from 'lucide-react';
import { FaWhatsapp } from 'react-icons/fa';
import { Button } from '@/components/ui/button';

const REVIEWS = [
  {
    name: 'Priya Nair',
    area: 'Koramangala',
    service: 'Laptop Repair',
    rating: 5,
    text: "My Dell laptop wouldn't turn on and I was panicking before an important presentation. Hemanth came to my office within 2 hours, diagnosed the issue and fixed it on the spot. Absolute lifesaver — and the pricing was very fair.",
    initials: 'PN',
    color: 'bg-blue-500',
  },
  {
    name: 'Rahul Sharma',
    area: 'Indiranagar',
    service: 'Website Development',
    rating: 5,
    text: "Built a beautiful website for my photography studio. Very patient with my constant change requests and delivered exactly what I had in mind. The site loads really fast and looks great on mobile too.",
    initials: 'RS',
    color: 'bg-violet-500',
  },
  {
    name: 'Kavitha Reddy',
    area: 'HSR Layout',
    service: 'Virus Removal',
    rating: 5,
    text: "My laptop was incredibly slow and kept showing random pop-ups. Hemanth removed all the malware, optimized the startup, and it runs like new now. Remote support made it super convenient — done in under an hour.",
    initials: 'KR',
    color: 'bg-green-500',
  },
  {
    name: 'Arjun Menon',
    area: 'Whitefield',
    service: 'SSD Upgrade',
    rating: 5,
    text: "Upgraded my old HDD to an SSD and the difference is night and day. Boot time went from 2 minutes to under 15 seconds. All my data was migrated perfectly. Doorstep service was very professional.",
    initials: 'AM',
    color: 'bg-amber-500',
  },
  {
    name: 'Sneha Joshi',
    area: 'Jayanagar',
    service: 'OS Installation',
    rating: 5,
    text: "Windows was corrupted and I thought I'd lost everything. Got a clean Windows install with all drivers and my data recovered too. Explained everything clearly and didn't charge extra for the data recovery attempt.",
    initials: 'SJ',
    color: 'bg-pink-500',
  },
  {
    name: 'Mohammed Irfan',
    area: 'Hebbal',
    service: 'Website Development',
    rating: 5,
    text: "Needed a simple website for my catering business with a contact form and menu. Delivered in 4 days, exactly as discussed. Very responsive on WhatsApp throughout the project. Highly recommend for small businesses.",
    initials: 'MI',
    color: 'bg-cyan-500',
  },
];

function Stars({ count }: { count: number }) {
  return (
    <div className="flex gap-0.5">
      {Array.from({ length: count }).map((_, i) => (
        <Star key={i} className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
      ))}
    </div>
  );
}

export default function Testimonials() {
  return (
    <section className="py-14 sm:py-24 bg-muted">
      <div className="container mx-auto px-4">

        <div className="text-center max-w-2xl mx-auto mb-14">
          <p className="text-primary font-bold text-sm uppercase tracking-widest mb-3">Customer Reviews</p>
          <h2 className="text-3xl md:text-4xl font-black mb-4">What Our Customers Say</h2>
          <p className="text-muted-foreground text-lg">Real feedback from people we've helped across Bangalore.</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 max-w-6xl mx-auto">
          {REVIEWS.map((r, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: '-60px' }}
              transition={{ delay: i * 0.07, duration: 0.45 }}
              className="bg-card border rounded-2xl p-5 sm:p-6 shadow-sm flex flex-col gap-4"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${r.color} text-white flex items-center justify-center text-sm font-black shrink-0`}>
                    {r.initials}
                  </div>
                  <div>
                    <p className="font-bold text-sm">{r.name}</p>
                    <p className="text-xs text-muted-foreground">{r.area}</p>
                  </div>
                </div>
                <Stars count={r.rating} />
              </div>

              <p className="text-sm text-muted-foreground leading-relaxed flex-1">"{r.text}"</p>

              <div className="pt-1 border-t border-border/50">
                <span className="text-xs font-semibold text-primary bg-primary/8 px-2.5 py-1 rounded-full">
                  {r.service}
                </span>
              </div>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="mt-10 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">Satisfied with our service? Share your experience.</p>
          <Button
            variant="outline"
            onClick={() => window.open('https://wa.me/918088461724?text=Hi%20Hemanth%2C%20I%20wanted%20to%20share%20my%20feedback%20about%20your%20service')}
          >
            <FaWhatsapp className="w-4 h-4 mr-2 text-green-500" />
            Share Your Experience
          </Button>
        </motion.div>

      </div>
    </section>
  );
}
