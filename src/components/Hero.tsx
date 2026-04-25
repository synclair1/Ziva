/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Hero() {
  return (
    <section className="relative h-screen flex flex-col md:flex-row overflow-hidden border-b border-border-subtle">
      {/* Left Content Side */}
      <div className="flex-1 bg-bg-light p-8 md:p-24 flex flex-col justify-center border-r border-border-subtle z-10">
        <motion.div
          initial={{ opacity: 0, x: -50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="max-w-xl"
        >
          <span className="inline-block text-xs uppercase tracking-[0.3em] mb-6 font-sans font-medium text-accent">
            The Heritage Edit
          </span>
          <h1 className="text-6xl md:text-8xl font-serif font-light mb-10 leading-[1.1] text-primary">
            Traditional Craft, <br />
            <span className="italic">Modern Silhouette.</span>
          </h1>
          <p className="text-lg md:text-xl font-sans font-light mb-12 text-secondary leading-relaxed max-w-md">
            Elevating everyday elegance through the fusion of Pakistani lawn craftsmanship and contemporary Western cuts. 
          </p>
          <div className="flex flex-wrap gap-6">
            <Link
              to="/shop"
              className="px-8 py-5 bg-primary text-white font-sans text-[11px] uppercase tracking-widest hover:opacity-90 transition-opacity"
            >
              Shop 2-Piece Sets
            </Link>
            <Link
              to="/shop"
              className="px-8 py-5 border border-primary text-primary font-sans text-[11px] uppercase tracking-widest hover:bg-primary hover:text-white transition-all"
            >
              Explore Lookbook
            </Link>
          </div>
          
          {/* Feature Grid */}
          <div className="mt-20 grid grid-cols-3 gap-8 border-t border-border-subtle pt-10">
            <div className="text-center">
              <div className="text-2xl font-serif mb-2 text-primary">100%</div>
              <div className="text-[10px] uppercase font-sans tracking-widest text-muted">Hand-loomed Lawn</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif mb-2 text-primary">Chic</div>
              <div className="text-[10px] uppercase font-sans tracking-widest text-muted">Western Cuts</div>
            </div>
            <div className="text-center">
              <div className="text-2xl font-serif mb-2 text-primary">Unique</div>
              <div className="text-[10px] uppercase font-sans tracking-widest text-muted">Statement Sleeves</div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Right Visual Side */}
      <div className="flex-1 bg-bg-alt relative">
        <div className="absolute inset-0 flex items-center justify-center p-12 lg:p-24">
          <motion.div 
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.2 }}
            className="relative w-full aspect-[3/4] overflow-hidden shadow-2xl group"
          >
            <img
              src="https://images.unsplash.com/photo-1594231846059-e97be6a66504?auto=format&fit=crop&q=80&w=1200"
              alt="Ziva Brand Concept"
              className="w-full h-full object-cover transition-transform duration-[2s] group-hover:scale-110"
              referrerPolicy="no-referrer"
            />
            {/* Branding Overlay */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none overflow-hidden">
                <span className="text-white/20 uppercase tracking-tighter text-[10vw] font-bold rotate-12 select-none">ZIVA FUSION</span>
            </div>
            
            {/* Floating Card Tip */}
            <div className="absolute bottom-8 left-8 right-8 p-8 bg-white/95 backdrop-blur-md shadow-lg hidden md:block">
              <div className="text-[10px] text-accent uppercase tracking-widest mb-2">Featured Set</div>
              <div className="text-2xl font-serif mb-3 text-primary">Noor Oversized 2-Piece</div>
              <div className="text-sm text-secondary font-sans mb-6 leading-relaxed">Block-printed Khaddar shirt with tailored cigarette pants.</div>
              <div className="flex justify-between items-center border-t border-border-subtle pt-5">
                <span className="font-sans font-medium text-primary">Rs. 8,500</span>
                <Link to="/shop" className="text-[10px] uppercase tracking-widest underline underline-offset-4 text-primary hover:text-accent transition-colors">View Details</Link>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
