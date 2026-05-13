import React from 'react';
import { motion, useScroll, useTransform } from 'framer-motion';
import { 
  Monitor, 
  Code, 
  Wrench, 
  Clock, 
  ShieldCheck, 
  Cpu, 
  Globe, 
  HardDrive, 
  Smartphone,
  PhoneCall,
  Mail,
  MapPin,
  CheckCircle2,
  ArrowRight,
  Server,
  Zap,
  Laptop
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';

import repairHeroImg from '../assets/repair-hero.jpg';
import webDevImg from '../assets/web-dev.jpg';

const fadeInUp = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: 'easeOut' } }
};

const staggerContainer = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

export default function Home() {
  const { scrollYProgress } = useScroll();
  const y = useTransform(scrollYProgress, [0, 1], ['0%', '20%']);

  const scrollTo = (id: string) => {
    const el = document.getElementById(id);
    if (el) {
      el.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <div className="flex flex-col min-h-screen">
      {/* Navbar */}
      <header className="sticky top-0 z-50 w-full border-b bg-background/80 backdrop-blur-md">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2 text-primary font-bold text-xl tracking-tight">
            <Monitor className="w-6 h-6" />
            <span className="text-foreground">Larsha <span className="text-primary">Tech</span></span>
          </div>
          <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-muted-foreground">
            <button onClick={() => scrollTo('services')} className="hover:text-primary transition-colors data-[state=active]:text-primary" data-testid="nav-link-services">Services</button>
            <button onClick={() => scrollTo('why-us')} className="hover:text-primary transition-colors" data-testid="nav-link-why-us">Why Us</button>
            <button onClick={() => scrollTo('pricing')} className="hover:text-primary transition-colors" data-testid="nav-link-pricing">Pricing</button>
            <button onClick={() => scrollTo('projects')} className="hover:text-primary transition-colors" data-testid="nav-link-projects">Projects</button>
            <button onClick={() => scrollTo('contact')} className="hover:text-primary transition-colors" data-testid="nav-link-contact">Contact</button>
          </nav>
          <Button onClick={() => window.open('tel:+918088461724')} data-testid="button-nav-call">
            <PhoneCall className="w-4 h-4 mr-2" />
            Call Now
          </Button>
        </div>
      </header>

      <main className="flex-1">
        {/* Hero Section */}
        <section id="hero" className="relative pt-24 pb-32 overflow-hidden bg-gradient-to-b from-primary/5 to-background">
          <div className="container mx-auto px-4 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial="hidden"
                animate="visible"
                variants={staggerContainer}
                className="max-w-2xl"
              >
                <motion.span variants={fadeInUp} className="inline-block py-1.5 px-4 rounded-full bg-primary/10 text-primary font-semibold text-sm mb-6 border border-primary/20">
                  Bangalore's Trusted Tech Partner
                </motion.span>
                <motion.h1 variants={fadeInUp} className="text-5xl md:text-6xl lg:text-7xl font-extrabold tracking-tight mb-6 text-balance text-foreground leading-[1.1]">
                  Fast, Reliable & Affordable <br />
                  <span className="text-primary relative">
                    IT Services
                    <svg className="absolute -bottom-2 left-0 w-full h-3 text-primary/30" viewBox="0 0 100 10" preserveAspectRatio="none">
                      <path d="M0 5 Q 50 10 100 5" stroke="currentColor" strokeWidth="4" fill="transparent" />
                    </svg>
                  </span>
                </motion.h1>
                <motion.p variants={fadeInUp} className="text-xl text-muted-foreground mb-10 text-balance leading-relaxed">
                  Expert computer repair and professional website development. 
                  We bring your devices back to life and your business online with honest pricing.
                </motion.p>
                <motion.div variants={fadeInUp} className="flex flex-col sm:flex-row items-center gap-4">
                  <Button size="lg" className="w-full sm:w-auto text-lg h-14 px-8" onClick={() => scrollTo('services')} data-testid="button-hero-services">
                    Explore Services
                    <ArrowRight className="ml-2 w-5 h-5" />
                  </Button>
                  <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-14 px-8 border-2" onClick={() => window.open('https://wa.me/918088461724')} data-testid="button-hero-whatsapp">
                    <PhoneCall className="w-5 h-5 mr-2 text-green-500" />
                    WhatsApp Us
                  </Button>
                </motion.div>
                
                <motion.div variants={fadeInUp} className="mt-12 flex items-center gap-6 text-sm font-medium text-muted-foreground">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    Same Day Fixes
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-5 h-5 text-primary" />
                    No Hidden Fees
                  </div>
                </motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className="relative hidden lg:block"
              >
                <div className="relative rounded-2xl overflow-hidden shadow-2xl border-4 border-background aspect-[4/3]">
                  <img src={repairHeroImg} alt="Technician repairing laptop" className="object-cover w-full h-full" />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
                  <div className="absolute bottom-6 left-6 right-6 text-white">
                    <div className="flex items-center gap-2 mb-2">
                      <div className="w-3 h-3 rounded-full bg-green-500 animate-pulse"></div>
                      <span className="font-semibold text-sm tracking-wider uppercase">Currently accepting repairs</span>
                    </div>
                  </div>
                </div>
                
                {/* Floating Badge */}
                <motion.div 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.5, duration: 0.5 }}
                  className="absolute -bottom-6 -left-6 bg-background rounded-xl p-4 shadow-xl border flex items-center gap-4"
                >
                  <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                    <Code className="w-6 h-6" />
                  </div>
                  <div>
                    <p className="font-bold text-foreground">Web Design</p>
                    <p className="text-sm text-muted-foreground">Starts at ₹3,000</p>
                  </div>
                </motion.div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Logos/Brands Banner */}
        <section className="py-10 border-y bg-muted/30 overflow-hidden">
          <div className="container mx-auto px-4 text-center">
            <p className="text-sm font-semibold text-muted-foreground mb-6 uppercase tracking-widest">We repair all major brands & build with modern tech</p>
            <div className="flex flex-wrap justify-center items-center gap-x-10 gap-y-6">
              {['Dell', 'HP', 'Lenovo', 'ASUS', 'Acer', 'Windows', 'Linux', 'HTML5', 'JavaScript', 'PHP', 'MySQL'].map((brand) => (
                <span key={brand} className="text-sm font-bold text-muted-foreground/60 hover:text-foreground transition-colors tracking-wide uppercase">{brand}</span>
              ))}
            </div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section id="why-us" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Why Choose Larsha Tech?</h2>
              <p className="text-lg text-muted-foreground">We aren't just another IT company. We are your local, dependable partner for all things tech.</p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
              {[
                { icon: Zap, title: "Quick & Fast", desc: "Same-day service for most repairs and fast turnarounds for websites." },
                { icon: CheckCircle2, title: "Affordable", desc: "Honest pricing with no hidden fees. Quality service that fits your budget." },
                { icon: MapPin, title: "Onsite & Remote", desc: "We come to you, or fix software issues remotely via secure connection." },
                { icon: ShieldCheck, title: "Reliable", desc: "Professional technicians ensuring your data is safe and systems run perfectly." }
              ].map((feature, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, margin: "-100px" }}
                  transition={{ delay: i * 0.1, duration: 0.5 }}
                  className="p-6 rounded-2xl bg-muted/50 border hover:bg-muted transition-colors"
                >
                  <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center text-primary mb-4">
                    <feature.icon className="w-6 h-6" />
                  </div>
                  <h3 className="font-bold text-xl mb-2">{feature.title}</h3>
                  <p className="text-muted-foreground">{feature.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services */}
        <section id="services" className="py-24 bg-muted/30">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Our Core Services</h2>
              <p className="text-lg text-muted-foreground">Comprehensive solutions for both hardware and digital presence.</p>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
              {/* Computer Repair */}
              <motion.div 
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border/50 flex flex-col"
              >
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-blue-500/10 flex items-center justify-center text-blue-600 mb-6">
                    <Wrench className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Computer & Laptop Repair</h3>
                  <p className="text-muted-foreground mb-8 text-lg">From slow laptops to dead motherboards, we diagnose and fix issues quickly to get you back to work.</p>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Slow System Optimization & SSD Upgrades",
                      "OS Installation (Windows, Linux) & Software",
                      "Laptop Not Powering On / Blue Screen Fix",
                      "Virus Removal & Data Recovery",
                      "Thermal Cleaning & Overheating Fix",
                      "Motherboard Basic Diagnostics"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-blue-500 shrink-0 mt-0.5" />
                        <span className="text-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>
                  
                  <div className="flex flex-wrap gap-2 mb-8">
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">Doorstep Service</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">Remote Support</span>
                    <span className="px-3 py-1 bg-muted rounded-full text-xs font-semibold">Workshop Repair</span>
                  </div>
                </div>
                <div className="p-6 bg-blue-50/50 dark:bg-blue-950/20 border-t mt-auto">
                  <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white" size="lg" onClick={() => scrollTo('pricing')} data-testid="button-service-repair">
                    View Repair Pricing
                  </Button>
                </div>
              </motion.div>

              {/* Web Design */}
              <motion.div 
                initial={{ opacity: 0, x: 30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                className="bg-background rounded-3xl overflow-hidden shadow-sm border border-border/50 flex flex-col"
              >
                <div className="p-8 lg:p-10 flex-1">
                  <div className="w-14 h-14 rounded-xl bg-purple-500/10 flex items-center justify-center text-purple-600 mb-6">
                    <Globe className="w-7 h-7" />
                  </div>
                  <h3 className="text-2xl md:text-3xl font-bold mb-4">Website Design & Development</h3>
                  <p className="text-muted-foreground mb-8 text-lg">Professional, fast, and mobile-ready websites to establish your digital presence and grow your business.</p>
                  
                  <ul className="space-y-4 mb-8">
                    {[
                      "Business, Portfolio & Service Websites",
                      "Landing Pages & Personal Branding",
                      "Mobile Responsive & Fast Loading",
                      "SEO Friendly Structure",
                      "Contact Forms & WhatsApp Integration",
                      "Domain & Hosting Setup Support"
                    ].map((item, i) => (
                      <li key={i} className="flex items-start gap-3">
                        <CheckCircle2 className="w-5 h-5 text-purple-500 shrink-0 mt-0.5" />
                        <span className="text-foreground font-medium">{item}</span>
                      </li>
                    ))}
                  </ul>

                  <div className="flex flex-wrap gap-3 items-center mb-8">
                    {['HTML5', 'CSS3', 'JavaScript', 'PHP', 'MySQL'].map((tech) => (
                      <span key={tech} className="px-3 py-1 rounded-full bg-purple-100/60 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 text-xs font-semibold tracking-wide">{tech}</span>
                    ))}
                  </div>
                </div>
                <div className="p-6 bg-purple-50/50 dark:bg-purple-950/20 border-t mt-auto">
                  <Button className="w-full bg-purple-600 hover:bg-purple-700 text-white" size="lg" onClick={() => scrollTo('pricing')} data-testid="button-service-web">
                    View Web Dev Pricing
                  </Button>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Pricing */}
        <section id="pricing" className="py-24 bg-background">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Transparent Pricing</h2>
              <p className="text-lg text-muted-foreground">Honest rates for professional services. No surprises.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12 max-w-5xl mx-auto">
              {/* Repair Pricing */}
              <Card className="border-2 border-muted shadow-sm hover:border-blue-200 transition-colors">
                <CardHeader className="bg-muted/30 pb-8">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Wrench className="w-6 h-6 text-blue-500" />
                    Computer Repair
                  </CardTitle>
                  <CardDescription className="text-base">Affordable fixes to keep you running</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-6">
                    <li className="flex justify-between items-center border-b border-border/50 pb-4">
                      <span className="font-medium text-muted-foreground">Basic Diagnostics/Service</span>
                      <span className="font-bold text-lg">₹500 <span className="text-sm font-normal text-muted-foreground">onwards</span></span>
                    </li>
                    <li className="flex justify-between items-center border-b border-border/50 pb-4">
                      <span className="font-medium text-muted-foreground">OS Installation (Windows/Linux)</span>
                      <span className="font-bold text-lg">₹800</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-border/50 pb-4">
                      <span className="font-medium text-muted-foreground">SSD Upgrade Setup</span>
                      <span className="font-bold text-lg">₹1,000</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <span className="font-medium text-muted-foreground">Full System Service & Cleaning</span>
                      <span className="font-bold text-lg">₹1,500</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button variant="outline" className="w-full h-12 text-blue-600 border-blue-200 hover:bg-blue-50 dark:hover:bg-blue-950" onClick={() => window.open('tel:+918088461724')} data-testid="button-price-repair">
                    Book Repair
                  </Button>
                </CardFooter>
              </Card>

              {/* Web Dev Pricing */}
              <Card className="border-2 border-primary shadow-md relative overflow-hidden">
                <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-4 py-1 text-xs font-bold rounded-bl-lg">
                  POPULAR
                </div>
                <CardHeader className="bg-primary/5 pb-8">
                  <CardTitle className="flex items-center gap-2 text-2xl">
                    <Globe className="w-6 h-6 text-primary" />
                    Web Development
                  </CardTitle>
                  <CardDescription className="text-base">Professional presence online</CardDescription>
                </CardHeader>
                <CardContent className="pt-8">
                  <ul className="space-y-6">
                    <li className="flex justify-between items-center border-b border-border/50 pb-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">Basic Website</span>
                        <span className="text-sm text-muted-foreground">Single Landing Page</span>
                      </div>
                      <span className="font-bold text-lg whitespace-nowrap">₹3k – ₹5k</span>
                    </li>
                    <li className="flex justify-between items-center border-b border-border/50 pb-4">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground text-primary">Business Website</span>
                        <span className="text-sm text-muted-foreground">3-5 Pages, Contact Form</span>
                      </div>
                      <span className="font-bold text-lg whitespace-nowrap text-primary">₹8k – ₹15k</span>
                    </li>
                    <li className="flex justify-between items-center pb-2">
                      <div className="flex flex-col">
                        <span className="font-bold text-foreground">Advanced Website</span>
                        <span className="text-sm text-muted-foreground">Custom Features, CMS</span>
                      </div>
                      <span className="font-bold text-lg whitespace-nowrap">₹20,000+</span>
                    </li>
                  </ul>
                </CardContent>
                <CardFooter>
                  <Button className="w-full h-12" onClick={() => window.open('https://wa.me/918088461724?text=Hi,%20I%20need%20a%20website%20built')} data-testid="button-price-web">
                    Discuss Your Project
                  </Button>
                </CardFooter>
              </Card>
            </div>
          </div>
        </section>

        {/* Projects / Work Showcase */}
        <section id="projects" className="py-24 bg-muted/50 border-t border-b">
          <div className="container mx-auto px-4">
            <div className="text-center max-w-3xl mx-auto mb-16">
              <h2 className="text-3xl md:text-4xl font-bold mb-4">Recent Projects & Fixes</h2>
              <p className="text-lg text-muted-foreground">A snapshot of how we help our clients succeed.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {[
                { title: "SSD Upgrade for Faster Systems", desc: "Revived a 5-year-old Dell laptop to boot in 10 seconds.", icon: HardDrive },
                { title: "Business Website for Local Shop", desc: "A 5-page responsive site driving local foot traffic.", icon: Globe },
                { title: "Windows & Software Setup", desc: "Clean install of Windows 11 with full office suite ready for work.", icon: Monitor },
                { title: "Portfolio Website", desc: "Sleek, fast-loading personal brand site for a freelancer.", icon: Code },
                { title: "Performance Optimization", desc: "Cleared malware and optimized startup for sluggish office PCs.", icon: Zap },
                { title: "Service Landing Page", desc: "High-converting single page with WhatsApp integration.", icon: Smartphone },
              ].map((project, i) => (
                <Card key={i} className="bg-background border-none shadow-sm hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <project.icon className="w-8 h-8 text-primary mb-4" />
                    <h4 className="font-bold text-lg mb-2">{project.title}</h4>
                    <p className="text-muted-foreground text-sm">{project.desc}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section id="contact" className="py-24 relative overflow-hidden bg-foreground text-background">
          <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-primary via-transparent to-transparent"></div>
          <div className="container mx-auto px-4 relative z-10">
            <div className="max-w-4xl mx-auto bg-background/5 p-8 md:p-12 rounded-3xl border border-border/10 backdrop-blur-sm text-center">
              <h2 className="text-3xl md:text-5xl font-bold mb-6 text-white">Ready to get started?</h2>
              <p className="text-xl text-white/70 mb-10 max-w-2xl mx-auto">
                Whether you need a quick repair or a brand new website, we are here to help. 
                Describe your issue and get support fast.
              </p>

              <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-12">
                <Button size="lg" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl bg-white text-foreground hover:bg-gray-100" onClick={() => window.open('tel:+918088461724')} data-testid="button-cta-call">
                  <PhoneCall className="w-5 h-5 mr-3" />
                  +91 80884 61724
                </Button>
                <Button size="lg" variant="outline" className="w-full sm:w-auto text-lg h-16 px-10 rounded-2xl border-white/20 text-white hover:bg-white/10" onClick={() => window.open('https://wa.me/918088461724')} data-testid="button-cta-whatsapp">
                  <Mail className="w-5 h-5 mr-3" />
                  WhatsApp Us
                </Button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-left border-t border-white/10 pt-8 mt-8">
                <div>
                  <div className="text-white/50 text-sm font-medium mb-1 uppercase tracking-wider">Email Us</div>
                  <a href="mailto:support@larshatech.com" className="text-white font-medium hover:text-primary transition-colors">support@larshatech.com</a>
                </div>
                <div>
                  <div className="text-white/50 text-sm font-medium mb-1 uppercase tracking-wider">Location</div>
                  <div className="text-white font-medium">Bangalore, India</div>
                </div>
                <div>
                  <div className="text-white/50 text-sm font-medium mb-1 uppercase tracking-wider">Working Hours</div>
                  <div className="text-white font-medium">Available for Quick Support</div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Floating WhatsApp */}
        <a 
          href="https://wa.me/918088461724" 
          target="_blank" 
          rel="noreferrer"
          className="fixed bottom-6 right-6 w-14 h-14 bg-[#25D366] text-white rounded-full flex items-center justify-center shadow-2xl hover:scale-110 hover:shadow-[#25D366]/20 transition-all z-50 group"
          data-testid="link-floating-whatsapp"
        >
          <PhoneCall className="w-6 h-6 group-hover:animate-pulse" />
          <span className="absolute right-full mr-4 bg-foreground text-background text-xs font-bold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity whitespace-nowrap pointer-events-none">
            Chat with us
          </span>
        </a>
      </main>
      
      {/* Footer */}
      <footer className="bg-background py-8 border-t mt-auto">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="flex items-center gap-2 text-foreground font-bold">
            <Monitor className="w-5 h-5 text-primary" />
            <span>Larsha <span className="text-primary">Tech</span></span>
          </div>
          <p className="text-muted-foreground text-sm text-center md:text-left">
            © {new Date().getFullYear()} Larsha Technologies. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}
