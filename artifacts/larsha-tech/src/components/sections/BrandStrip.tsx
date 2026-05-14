import React from 'react';
import {
  SiDell, SiHp, SiLenovo, SiAsus, SiAcer,
  SiHtml, SiCss, SiJavascript, SiPhp, SiMysql, SiLinux, SiReact, SiTailwindcss, SiWordpress,
} from 'react-icons/si';

const BRANDS = [
  { icon: SiDell,   label: 'Dell',   color: '#007DB8' },
  { icon: SiHp,     label: 'HP',     color: '#0096D6' },
  { icon: SiLenovo, label: 'Lenovo', color: '#E2231A' },
  { icon: SiAsus,   label: 'ASUS',   color: '#00AAAD' },
  { icon: SiAcer,   label: 'Acer',   color: '#83B81A' },
];

const TECH = [
  { icon: SiHtml,        label: 'HTML5',      color: '#E34F26' },
  { icon: SiCss,         label: 'CSS3',       color: '#1572B6' },
  { icon: SiJavascript,  label: 'JavaScript', color: '#F7DF1E' },
  { icon: SiReact,       label: 'React',      color: '#61DAFB' },
  { icon: SiPhp,         label: 'PHP',        color: '#777BB4' },
  { icon: SiMysql,       label: 'MySQL',      color: '#4479A1' },
  { icon: SiLinux,       label: 'Linux',      color: '#FCC624' },
  { icon: SiTailwindcss, label: 'Tailwind',   color: '#06B6D4' },
  { icon: SiWordpress,   label: 'WordPress',  color: '#21759B' },
];

type Entry =
  | { kind: 'item'; icon: React.ElementType; label: string; color: string }
  | { kind: 'sep' };

const ITEMS: Entry[] = [
  ...BRANDS.map(b => ({ kind: 'item' as const, ...b })),
  { kind: 'sep' },
  ...TECH.map(t => ({ kind: 'item' as const, ...t })),
  { kind: 'sep' },
];

export default function BrandStrip() {
  return (
    <section className="py-8 border-y bg-muted">
      <p className="text-center text-xs font-bold text-muted-foreground mb-5 uppercase tracking-[0.2em]">
        We repair all major brands &amp; build with modern tech
      </p>
      <div className="overflow-hidden relative">
        <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-muted to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-muted to-transparent z-10 pointer-events-none" />
        <div className="flex animate-marquee w-max gap-8 items-center px-8">
          {[...ITEMS, ...ITEMS].map((entry, i) =>
            entry.kind === 'sep' ? (
              <span key={i} className="w-px h-5 bg-border/60 shrink-0 mx-2" />
            ) : (
              <span key={i} className="flex items-center gap-2 whitespace-nowrap select-none">
                <entry.icon style={{ color: entry.color }} className="w-4 h-4 shrink-0" />
                <span className="text-xs font-bold text-muted-foreground tracking-widest uppercase">{entry.label}</span>
              </span>
            )
          )}
        </div>
      </div>
    </section>
  );
}
