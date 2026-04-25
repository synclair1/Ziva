/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { ShoppingBag, Search, Menu, X, Instagram, Facebook, Twitter, User } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link, NavLink } from 'react-router-dom';
import { useCart } from '../context/CartContext.tsx';
import { useAuth } from '../context/AuthContext.tsx';

export default function Navigation() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { setIsCartOpen, totalItems } = useCart();
  const { user } = useAuth();

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg-light/80 backdrop-blur-md border-b border-border-subtle">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-center h-24">
          {/* Mobile Menu Button */}
          <div className="flex md:hidden">
            <button
              id="mobile-menu-toggle"
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className="p-2 text-primary hover:opacity-60 transition-opacity"
            >
              {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>

          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="text-3xl font-serif tracking-[0.2em] font-light text-primary">ZIVA</Link>
          </div>

          {/* Desktop Nav */}
          <div className="hidden md:flex space-x-12">
            <NavLink
              to="/shop"
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-relaxed-caps font-sans font-medium transition-opacity ${
                  isActive ? 'border-b border-primary pb-1 text-primary' : 'text-primary hover:opacity-60'
                }`
              }
            >
              Shop
            </NavLink>
            <NavLink
              to="/about"
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-relaxed-caps font-sans font-medium transition-opacity ${
                  isActive ? 'border-b border-primary pb-1 text-primary' : 'text-primary hover:opacity-60'
                }`
              }
            >
              About
            </NavLink>
            <NavLink
              to="/contact"
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-relaxed-caps font-sans font-medium transition-opacity ${
                  isActive ? 'border-b border-primary pb-1 text-primary' : 'text-primary hover:opacity-60'
                }`
              }
            >
              Contact
            </NavLink>
            <NavLink
              to="/account"
              className={({ isActive }) =>
                `text-[11px] uppercase tracking-relaxed-caps font-sans font-medium transition-opacity ${
                  isActive ? 'border-b border-primary pb-1 text-primary' : 'text-primary hover:opacity-60'
                }`
              }
            >
              {user ? 'Account' : 'Login'}
            </NavLink>
          </div>

          {/* Icons */}
          <div className="flex items-center space-x-6">
            <button 
              id="search-toggle" 
              onClick={() => alert('Search feature coming soon! Looking for a specific set? Try browsing our Collections.')}
              className="text-primary hover:opacity-60 transition-opacity font-sans text-xs uppercase tracking-widest font-medium"
            >
              Search
            </button>
            <button
              id="cart-toggle"
              onClick={() => setIsCartOpen(true)}
              className="text-primary hover:opacity-60 transition-opacity font-sans text-xs uppercase tracking-widest font-medium relative"
            >
              Bag ({totalItems})
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {isMenuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="md:hidden bg-[#FDFBF7] border-b border-black/5"
          >
            <div className="px-4 pt-2 pb-6 space-y-4 text-center">
              <Link
                to="/shop"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-sans font-medium py-2 text-primary"
              >
                Shop
              </Link>
              <Link
                to="/about"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-sans font-medium py-2 text-primary"
              >
                About
              </Link>
              <Link
                to="/contact"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-sans font-medium py-2 text-primary"
              >
                Contact
              </Link>
              <Link
                to="/account"
                onClick={() => setIsMenuOpen(false)}
                className="block text-sm uppercase tracking-widest font-sans font-medium py-2 text-primary"
              >
                {user ? 'My Account' : 'Sign In'}
              </Link>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}
