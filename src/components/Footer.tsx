/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Instagram, Facebook, Twitter, Mail } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Footer() {
  return (
    <footer className="bg-bg-light border-t border-border-subtle pt-24 pb-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-16 mb-24">
          <div className="space-y-10">
            <Link to="/" className="text-3xl font-serif tracking-[0.2em] font-light text-primary">ZIVA</Link>
            <p className="text-base font-sans font-light text-secondary leading-relaxed opacity-80 italic">
              "Elevating traditional craftsmanship for the modern woman. Fusion fashion that speaks of heritage and style."
            </p>
            <div className="flex space-x-6 text-muted">
              <Instagram size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Facebook size={18} className="hover:text-primary cursor-pointer transition-colors" />
              <Twitter size={18} className="hover:text-primary cursor-pointer transition-colors" />
            </div>
          </div>

          <div>
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-10">Shop</h4>
            <ul className="space-y-5 text-[13px] font-sans font-medium text-secondary uppercase tracking-widest">
              <li><Link to="/shop" className="hover:text-primary transition-colors">Shop All</Link></li>
              <li><Link to="/contact" className="hover:text-primary transition-colors">Contact Us</Link></li>
              <li><Link to="/" className="hover:text-primary transition-colors">Home</Link></li>
            </ul>
          </div>
        </div>

        <div className="flex flex-col md:flex-row justify-between items-center pt-12 border-t border-border-subtle gap-4">
          <p className="text-[10px] text-muted uppercase tracking-[0.2em] font-sans font-medium">
            &copy; 2026 ZIVA FUSION ATELIER. All rights reserved.
          </p>
          <div className="flex space-x-10 text-[10px] text-muted uppercase tracking-[0.2em] font-sans font-medium">
            <a href="https://instagram.com" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer transition-colors">Instagram</a>
            <a href="https://pinterest.com" target="_blank" rel="noreferrer" className="hover:text-primary cursor-pointer transition-colors">Pinterest</a>
            <Link to="/contact" className="hover:text-primary cursor-pointer transition-colors">Wholesale</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
