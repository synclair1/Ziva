/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { useCart } from '../context/CartContext.tsx';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, Truck, CreditCard, Landmark, ArrowLeft, Loader2 } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';
import { SITE_CONFIG } from '../config.ts';

export default function Checkout() {
  const { cart, totalPrice, clearCart } = useCart();
  const navigate = useNavigate();
  const [step, setStep] = useState(1);
  const [paymentMethod, setPaymentMethod] = useState<'cod' | 'bank' | 'whatsapp'>('cod');
  const [isProcessing, setIsProcessing] = useState(false);

  // Form State
  const [formData, setFormData] = useState({
    email: '',
    firstName: '',
    lastName: '',
    address: '',
    city: '',
    contact: '',
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handlePlaceOrder = async () => {
    if (!formData.email || !formData.firstName || !formData.address || !formData.city || !formData.contact) {
      alert('Please fill in all shipping details.');
      setStep(1);
      return;
    }

    setIsProcessing(true);
    try {
      // Netlify Form Submission
      const netlifyData = new URLSearchParams();
      netlifyData.append("form-name", "orders");
      netlifyData.append("customerName", `${formData.firstName} ${formData.lastName}`);
      netlifyData.append("customerEmail", formData.email);
      netlifyData.append("contact", formData.contact);
      netlifyData.append("address", formData.address);
      netlifyData.append("city", formData.city);
      netlifyData.append("total", `Rs. ${totalPrice.toLocaleString()}`);
      netlifyData.append("items", cart.map(i => `${i.name} (${i.size}) x${i.quantity}`).join(', '));
      netlifyData.append("paymentMethod", paymentMethod === 'cod' ? 'Cash on Delivery' : (paymentMethod === 'bank' ? 'Bank Transfer' : 'WhatsApp Order'));
      netlifyData.append("orderDate", new Date().toLocaleString());

      await fetch("/", {
        method: "POST",
        headers: { "Content-Type": "application/x-www-form-urlencoded" },
        body: netlifyData.toString(),
      });

      if (paymentMethod === 'whatsapp') {
        const message = `Hello ZIVA! I'd like to place an order via WhatsApp.

Order Details:
${cart.map(item => `- ${item.name} (${item.size}) x${item.quantity}`).join('\n')}

Total: Rs. ${totalPrice.toLocaleString()}

Shipping Details:
Name: ${formData.firstName} ${formData.lastName}
Address: ${formData.address}, ${formData.city}
Contact: ${formData.contact}
Email: ${formData.email}`;

        window.open(`https://wa.me/${SITE_CONFIG.whatsappNumber}?text=${encodeURIComponent(message)}`, '_blank');
      }

      setIsProcessing(false);
      setStep(3);
      clearCart();
    } catch (error) {
      console.error('Order creation failed:', error);
      alert('There was an error processing your order. Please try again.');
      setIsProcessing(false);
    }
  };

  if (cart.length === 0 && step !== 3) {
    return (
      <div className="pt-32 pb-24 text-center space-y-8">
        <h1 className="font-serif text-4xl">Your bag is empty</h1>
        <Link to="/shop" className="inline-block px-10 py-5 bg-primary text-white text-xs uppercase tracking-widest font-sans">
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <main className="bg-bg-light pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="grid lg:grid-cols-12 gap-16">
          
          {/* Checkout Steps */}
          <div className="lg:col-span-7">
            <AnimatePresence mode="wait">
              {step === 1 && (
                <motion.div 
                  key="step1"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <h2 className="text-3xl font-serif">Shipping Information</h2>
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="col-span-2">
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">Email Address</label>
                       <input 
                        type="email" name="email" value={formData.email} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">First Name</label>
                       <input 
                        type="text" name="firstName" value={formData.firstName} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">Last Name</label>
                       <input 
                        type="text" name="lastName" value={formData.lastName} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                    <div className="col-span-2">
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">Address</label>
                       <input 
                        type="text" name="address" value={formData.address} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">City</label>
                       <input 
                        type="text" name="city" value={formData.city} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                    <div>
                       <label className="block text-[10px] uppercase tracking-widest text-muted mb-2 font-sans font-bold">Contact Number</label>
                       <input 
                        type="text" name="contact" value={formData.contact} onChange={handleInputChange}
                        className="w-full border-b border-border-subtle py-3 text-sm font-sans focus:outline-none focus:border-primary transition-colors bg-transparent"
                      />
                    </div>
                  </div>
                  <button 
                    onClick={() => setStep(2)}
                    className="w-full py-5 bg-primary text-white text-xs uppercase tracking-[0.2em] font-sans font-bold hover:opacity-90 transition-opacity"
                  >
                    Continue to Payment
                  </button>
                </motion.div>
              )}

              {step === 2 && (
                <motion.div 
                  key="step2"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  className="space-y-12"
                >
                  <div className="flex items-center gap-4">
                    <button onClick={() => setStep(1)} className="p-2 hover:bg-bg-alt rounded-full transition-colors">
                      <ArrowLeft size={18} />
                    </button>
                    <h2 className="text-3xl font-serif">Payment Method</h2>
                  </div>

                    <div className="space-y-4">
                      <button 
                        onClick={() => setPaymentMethod('whatsapp')}
                        className={`w-full p-8 border flex items-center justify-between group transition-all ${
                          paymentMethod === 'whatsapp' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50'
                        }`}
                      >
                        <div className="flex items-center gap-6">
                          <svg className={`w-6 h-6 fill-current ${paymentMethod === 'whatsapp' ? 'text-green-600' : 'text-muted'}`} viewBox="0 0 24 24">
                            <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                          </svg>
                          <div className="text-left">
                            <p className="text-sm font-bold font-sans uppercase tracking-widest">WhatsApp Order</p>
                            <p className="text-xs text-muted font-sans mt-1">Send your order details directly to our WhatsApp.</p>
                          </div>
                        </div>
                        <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'whatsapp' ? 'border-primary' : 'border-muted'}`}>
                          {paymentMethod === 'whatsapp' && <div className="w-2 h-2 rounded-full bg-primary" />}
                        </div>
                      </button>

                      <button 
                        onClick={() => setPaymentMethod('cod')}
                        className={`w-full p-8 border flex items-center justify-between group transition-all ${
                          paymentMethod === 'cod' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50'
                        }`}
                      >
                      <div className="flex items-center gap-6">
                        <Truck className={paymentMethod === 'cod' ? 'text-primary' : 'text-muted'} />
                        <div className="text-left">
                          <p className="text-sm font-bold font-sans uppercase tracking-widest">Cash on Delivery</p>
                          <p className="text-xs text-muted font-sans mt-1">Pay when your order arrives at your doorstep.</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'cod' ? 'border-primary' : 'border-muted'}`}>
                        {paymentMethod === 'cod' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </button>

                    <button 
                      onClick={() => setPaymentMethod('bank')}
                      className={`w-full p-8 border flex items-center justify-between group transition-all ${
                        paymentMethod === 'bank' ? 'border-primary bg-primary/5' : 'border-border-subtle hover:border-primary/50'
                      }`}
                    >
                      <div className="flex items-center gap-6">
                        <Landmark className={paymentMethod === 'bank' ? 'text-primary' : 'text-muted'} />
                        <div className="text-left">
                          <p className="text-sm font-bold font-sans uppercase tracking-widest">Bank Transfer</p>
                          <p className="text-xs text-muted font-sans mt-1">Direct bank transfer for faster processing.</p>
                        </div>
                      </div>
                      <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center ${paymentMethod === 'bank' ? 'border-primary' : 'border-muted'}`}>
                        {paymentMethod === 'bank' && <div className="w-2 h-2 rounded-full bg-primary" />}
                      </div>
                    </button>

                    {paymentMethod === 'bank' && (
                      <motion.div 
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="p-8 bg-bg-alt border border-border-subtle space-y-4"
                      >
                        <h4 className="text-[10px] uppercase tracking-widest font-bold font-sans">Transfer Details</h4>
                        <div className="space-y-2 text-sm font-sans font-light">
                          <p>Bank: <span className="font-bold">Standard Chartered</span></p>
                          <p>Account Name: <span className="font-bold">ZIVA FUSION ATELIER</span></p>
                          <p>Account Number: <span className="font-bold">012-345678-01</span></p>
                          <p className="text-xs text-accent italic mt-4 opacity-80">
                            * Please send a screenshot of the transaction to our WhatsApp or Instagram once complete.
                          </p>
                        </div>
                      </motion.div>
                    )}
                  </div>

                  <button 
                    disabled={isProcessing}
                    onClick={handlePlaceOrder}
                    className="w-full py-5 bg-primary text-white text-xs uppercase tracking-[0.2em] font-sans font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3 disabled:opacity-50"
                  >
                    {isProcessing ? (
                      <>
                        <Loader2 className="animate-spin" size={16} />
                        Processing...
                      </>
                    ) : (
                      'Review and Place Order'
                    )}
                  </button>
                </motion.div>
              )}

              {step === 3 && (
                <motion.div 
                  key="step3"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="space-y-8 text-center py-12"
                >
                  <div className="flex justify-center">
                    <div className="w-20 h-20 bg-primary/10 rounded-full flex items-center justify-center text-primary">
                      <CheckCircle size={40} />
                    </div>
                  </div>
                  <div className="space-y-4">
                    <h2 className="text-4xl font-serif">Order Confirmed</h2>
                    <p className="text-secondary font-sans font-light max-w-sm mx-auto">
                      Thank you for your purchase. We've received your order and will start processing it shortly.
                    </p>
                    <p className="text-sm font-sans font-bold uppercase tracking-widest pt-4">Order ID: #ZIVA-10294</p>
                  </div>
                  <div className="pt-8">
                    <Link to="/" className="inline-block px-12 py-5 bg-primary text-white text-xs uppercase tracking-widest font-sans font-bold hover:opacity-90">
                      Go to Home
                    </Link>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-5 relative">
            <div className="sticky top-32 p-10 bg-bg-alt border border-border-subtle space-y-10">
              <h3 className="text-xl font-serif uppercase tracking-widest">Order Summary</h3>
              
              <div className="space-y-6 max-h-[30vh] overflow-y-auto pr-2 custom-scrollbar">
                {cart.map((item) => (
                  <div key={`${item.id}-${item.size}`} className="flex gap-4">
                    <div className="w-16 aspect-[3/4] bg-bg-light border border-border-subtle overflow-hidden">
                      <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                    </div>
                    <div className="flex-1 flex justify-between">
                      <div>
                        <p className="text-sm font-serif">{item.name}</p>
                        <p className="text-[10px] text-muted uppercase mt-1">Size: {item.size} × {item.quantity}</p>
                      </div>
                      <p className="text-sm font-serif">{item.price}</p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="space-y-4 pt-10 border-t border-border-subtle">
                <div className="flex justify-between text-sm font-sans uppercase tracking-widest text-muted">
                  <span>Subtotal</span>
                  <span>Rs. {totalPrice.toLocaleString()}</span>
                </div>
                <div className="flex justify-between text-sm font-sans uppercase tracking-widest text-muted">
                  <span>Shipping</span>
                  <span>Free</span>
                </div>
                <div className="flex justify-between text-xl font-serif pt-4 border-t border-border-subtle">
                  <span>Total</span>
                  <span className="text-accent">Rs. {totalPrice.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>

        </div>
      </div>
    </main>
  );
}
