
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { SITE_CONFIG } from '../config.ts';

export default function Contact() {
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    // Netlify will handle the form submission automatically via the hidden form
  };

  return (
    <main className="bg-bg-light pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="text-center mb-20">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-serif font-light mb-6 text-primary uppercase"
          >
            Get in Touch
          </motion.h1>
          <p className="text-base text-secondary font-sans font-light max-w-lg mx-auto leading-relaxed">
            Have a question about our collections or an existing order? We're here to help you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-20">
          {/* Info Side */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
            className="space-y-12"
          >
            <div className="space-y-8">
              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white border border-border-subtle rounded-full flex items-center justify-center shadow-sm">
                  <Mail className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-2">Email Us</h3>
                  <p className="text-secondary font-sans font-light">info@zivaclothing.com</p>
                  <p className="text-xs text-secondary/40 font-sans mt-1">Response within 24 hours</p>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white border border-border-subtle rounded-full flex items-center justify-center shadow-sm">
                  <MessageCircle className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-2">WhatsApp Support</h3>
                  <p className="text-secondary font-sans font-light">+{SITE_CONFIG.whatsappNumber}</p>
                  <a 
                    href={`https://wa.me/${SITE_CONFIG.whatsappNumber}`} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-xs text-accent font-sans font-bold uppercase tracking-[0.2em] mt-3 inline-block hover:text-primary transition-colors"
                  >
                    Chat Now
                  </a>
                </div>
              </div>

              <div className="flex items-start space-x-6">
                <div className="w-12 h-12 bg-white border border-border-subtle rounded-full flex items-center justify-center shadow-sm">
                  <MapPin className="text-accent" size={20} />
                </div>
                <div>
                  <h3 className="text-sm font-sans font-bold uppercase tracking-widest text-primary mb-2">Studio Location</h3>
                  <p className="text-secondary font-sans font-light">
                    Lahore, Pakistan<br />
                    Available by appointment only
                  </p>
                </div>
              </div>
            </div>

            <div className="pt-12 border-t border-border-subtle">
              <h4 className="text-[10px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-6">Operating Hours</h4>
              <ul className="space-y-3 text-xs font-sans font-medium text-secondary/60">
                <li className="flex justify-between"><span>Mon - Fri</span> <span>10:00 AM - 07:00 PM</span></li>
                <li className="flex justify-between"><span>Saturday</span> <span>11:00 AM - 04:00 PM</span></li>
                <li className="flex justify-between"><span>Sunday</span> <span>Closed</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Form Side */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.4 }}
            className="bg-white p-8 md:p-12 rounded-[40px] shadow-sm border border-border-subtle"
          >
            {submitted ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20">
                <div className="w-20 h-20 bg-green-50 rounded-full flex items-center justify-center mb-6">
                  <Send className="text-green-500" size={32} />
                </div>
                <h3 className="text-2xl font-serif mb-4">Message Sent</h3>
                <p className="text-secondary font-sans font-light max-w-xs mx-auto">
                  Thank you for reaching out. A member of the Ziva team will contact you shortly.
                </p>
                <button 
                  onClick={() => setSubmitted(false)}
                  className="mt-10 text-xs font-sans font-bold uppercase tracking-widest text-accent hover:text-primary underline underline-offset-8"
                >
                  Send another message
                </button>
              </div>
            ) : (
              <form 
                name="contact" 
                method="POST" 
                data-netlify="true" 
                onSubmit={handleSubmit}
                className="space-y-8"
              >
                <input type="hidden" name="form-name" value="contact" />
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40">Full Name</label>
                    <input 
                      required
                      type="text" 
                      name="name" 
                      placeholder="Jane Doe"
                      className="w-full bg-transparent border-b border-border-subtle py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40">Email Address</label>
                    <input 
                      required
                      type="email" 
                      name="email" 
                      placeholder="jane@example.com"
                      className="w-full bg-transparent border-b border-border-subtle py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40">Subject</label>
                  <select 
                    name="subject"
                    className="w-full bg-transparent border-b border-border-subtle py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors appearance-none"
                  >
                    <option>General Inquiry</option>
                    <option>Order Support</option>
                    <option>Wholesale/Collaboration</option>
                    <option>Feedback</option>
                  </select>
                </div>

                <div className="space-y-2">
                  <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40">Message</label>
                  <textarea 
                    required
                    name="message" 
                    rows={4}
                    placeholder="Tell us how we can help..."
                    className="w-full bg-transparent border-b border-border-subtle py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors resize-none"
                  ></textarea>
                </div>

                <button 
                  type="submit"
                  className="w-full bg-primary text-white py-5 font-sans font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-all rounded-full flex items-center justify-center space-x-3 group"
                >
                  <span>Send Message</span>
                  <Send size={14} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                </button>
              </form>
            )}
          </motion.div>
        </div>
      </div>
    </main>
  );
}
