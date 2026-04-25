
import React from 'react';
import { motion } from 'framer-motion';
import { Heart, ShieldCheck, MapPin, Globe } from 'lucide-react';
import { SITE_CONFIG } from '../config.ts';

export default function About() {
  return (
    <main className="bg-bg-light pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Hero Section */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center mb-32">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
          >
            <h1 className="text-5xl md:text-8xl font-serif font-light mb-8 text-primary uppercase leading-tight">
              Crafting <br /> Elegance
            </h1>
            <p className="text-xl text-secondary font-sans font-light leading-relaxed mb-10 max-w-lg">
              {SITE_CONFIG.name} is a contemporary Eastern fusion brand dedicated to the modern woman who values tradition, comfort, and uncompromising style.
            </p>
            <div className="flex items-center space-x-4">
              <div className="w-12 h-[1px] bg-accent"></div>
              <span className="text-xs uppercase tracking-[0.3em] font-sans font-bold text-accent">Established 2024</span>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative aspect-[4/5] rounded-tl-[100px] rounded-br-[100px] overflow-hidden shadow-2xl"
          >
            <img 
              src="https://images.unsplash.com/photo-1594223274512-ad4803739b7c?auto=format&fit=crop&q=80&w=1200" 
              alt="Artisan Craftsmanship" 
              className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-1000"
            />
          </motion.div>
        </div>

        {/* Values Section */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 mb-32">
          <div className="p-8 border border-border-subtle rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <Heart className="text-accent mb-6" size={32} />
            <h3 className="text-xl font-serif mb-4">Artisan Focused</h3>
            <p className="text-sm text-secondary font-light font-sans leading-relaxed">
              We empower local artisans, preserving traditional techniques like hand-block printing and intricate embroidery for a new generation.
            </p>
          </div>
          <div className="p-8 border border-border-subtle rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <ShieldCheck className="text-accent mb-6" size={32} />
            <h3 className="text-xl font-serif mb-4">Ethical Quality</h3>
            <p className="text-sm text-secondary font-light font-sans leading-relaxed">
              Every piece is crafted with ethically sourced fabrics, ensuring longevity and comfort that lasts through seasons.
            </p>
          </div>
          <div className="p-8 border border-border-subtle rounded-3xl bg-white shadow-sm hover:shadow-md transition-shadow">
            <Globe className="text-accent mb-6" size={32} />
            <h3 className="text-xl font-serif mb-4">Modern Vision</h3>
            <p className="text-sm text-secondary font-light font-sans leading-relaxed">
              Bridging the gap between cultural heritage and global fashion trends, creating silhouettes that are truly timeless.
            </p>
          </div>
        </div>

        {/* Story Section */}
        <div className="bg-primary text-white p-12 md:p-24 rounded-[60px] relative overflow-hidden group">
          <div className="relative z-10 max-w-3xl">
            <h2 className="text-3xl md:text-5xl font-serif mb-10 leading-tight">
              "Our mission is to bring the soul of the East to the modern wardrobe, one stitch at a time."
            </h2>
            <div className="flex items-center space-x-6">
              <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-accent">
                <div className="w-full h-full bg-accent flex items-center justify-center font-serif text-xl">Z</div>
              </div>
              <div>
                <p className="text-sm font-sans font-bold uppercase tracking-widest">Ziva Team</p>
                <p className="text-xs font-sans opacity-60">Founding Visionaries</p>
              </div>
            </div>
          </div>
          
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 w-1/2 h-full opacity-10 pointer-events-none transition-transform duration-500 group-hover:scale-110">
            <div className="w-full h-full border-[40px] border-white rounded-full translate-x-1/2 -translate-y-1/4"></div>
          </div>
        </div>
      </div>
    </main>
  );
}
