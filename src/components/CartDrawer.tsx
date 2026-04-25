/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Minus, Plus, ShoppingBag } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { Link } from 'react-router-dom';

export default function CartDrawer() {
  const { cart, isCartOpen, setIsCartOpen, removeFromCart, updateQuantity, totalPrice, totalItems } = useCart();

  return (
    <AnimatePresence>
      {isCartOpen && (
        <>
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsCartOpen(false)}
            className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[60]"
          />

          {/* Drawer */}
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-bg-light shadow-2xl z-[70] flex flex-col"
          >
            <div className="p-8 border-b border-border-subtle flex justify-between items-center">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-primary" />
                <h2 className="text-xl font-serif font-light uppercase tracking-widest">Your Bag ({totalItems})</h2>
              </div>
              <button onClick={() => setIsCartOpen(false)} className="p-2 hover:opacity-60 transition-opacity">
                <X size={24} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-8 space-y-8">
              {cart.length === 0 ? (
                <div className="h-full flex flex-col items-center justify-center space-y-6 opacity-60">
                  <p className="font-sans font-light text-secondary">Your bag is empty.</p>
                  <button 
                    onClick={() => setIsCartOpen(false)}
                    className="text-[10px] uppercase tracking-widest font-bold border-b border-primary pb-1"
                  >
                    Start Shopping
                  </button>
                </div>
              ) : (
                cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-6">
                    <div className="w-24 aspect-[3/4] bg-bg-alt overflow-hidden border border-border-subtle">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex flex-col justify-between py-1">
                      <div>
                        <div className="flex justify-between items-start">
                          <h3 className="font-serif text-lg leading-tight">{item.name}</h3>
                          <button 
                            onClick={() => removeFromCart(item.id, item.size)}
                            className="text-[10px] text-muted hover:text-accent uppercase tracking-widest font-bold"
                          >
                            Remove
                          </button>
                        </div>
                        <p className="text-[10px] text-accent uppercase font-sans font-bold tracking-widest mt-1">
                          Size: {item.size}
                        </p>
                      </div>
                      
                      <div className="flex justify-between items-end">
                        <div className="flex items-center border border-border-subtle">
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity - 1)}
                            className="p-2 hover:bg-bg-alt transition-colors"
                          >
                            <Minus size={12} />
                          </button>
                          <span className="w-8 text-center text-xs font-sans font-medium">{item.quantity}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.size, item.quantity + 1)}
                            className="p-2 hover:bg-bg-alt transition-colors"
                          >
                            <Plus size={12} />
                          </button>
                        </div>
                        <p className="text-sm font-serif">{item.price}</p>
                      </div>
                    </div>
                  </div>
                ))
              )}
            </div>

            {cart.length > 0 && (
              <div className="p-8 border-t border-border-subtle bg-bg-alt/50 space-y-6">
                <div className="flex justify-between items-center font-serif text-xl">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <p className="text-[10px] text-muted uppercase tracking-widest text-center font-sans">
                  Taxes and shipping calculated at checkout
                </p>
                <Link
                  to="/checkout"
                  onClick={() => setIsCartOpen(false)}
                  className="block w-full py-5 bg-primary text-white text-center text-xs uppercase tracking-widest font-sans font-bold hover:opacity-90 transition-opacity"
                >
                  Proceed to Checkout
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
