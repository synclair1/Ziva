/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Package, 
  ShoppingBag, 
  Plus, 
  Trash2, 
  CheckCircle, 
  Clock, 
  ExternalLink,
  ChevronDown,
  ChevronUp,
  Loader2,
  Lock,
  LogOut
} from 'lucide-react';
import { getOrders, updateOrderStatus, Order } from '../lib/firebaseService';
import { auth } from '../lib/firebase';
import { signInWithPopup, GoogleAuthProvider, onAuthStateChanged, signOut, User } from 'firebase/auth';

export default function Admin() {
  const [activeTab, setActiveTab] = useState<'orders' | 'products'>('orders');
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);
  const [expandedOrder, setExpandedOrder] = useState<string | null>(null);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      if (currentUser) {
        fetchData();
      } else {
        setLoading(false);
      }
    });

    return () => unsubscribe();
  }, []);

  const fetchData = async () => {
    setLoading(true);
    try {
      // Orders (admin restricted)
      try {
        const o = await getOrders();
        setOrders(o || []);
      } catch (e) {
        console.error("Orders error (Admin Only):", e);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = async () => {
    const provider = new GoogleAuthProvider();
    try {
      await signInWithPopup(auth, provider);
    } catch (error) {
      console.error("Login failed", error);
      alert("Login failed. Please try again.");
    }
  };

  const handleLogout = async () => {
    await signOut(auth);
  };

  const handleStatusUpdate = async (orderId: string, status: string) => {
    try {
      await updateOrderStatus(orderId, status);
      fetchData();
    } catch (error) {
      alert('Error updating status');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  const isAdminUser = user?.email === 'Synclair.samson56@gmail.com';

  if (!user) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#FDFBF7]">
        <div className="max-w-md w-full mx-4 text-center space-y-8 bg-white p-12 rounded-3xl border border-primary/10 shadow-xl">
          <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-primary" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Restricted Access</h1>
            <p className="text-secondary font-sans text-sm font-medium">Please sign in with your authorized Google account to manage the boutique.</p>
          </div>
          <button 
            onClick={handleLogin}
            className="w-full bg-primary text-white py-4 rounded-xl font-sans font-bold uppercase tracking-widest shadow-xl shadow-primary/20 hover:bg-black transition-all flex items-center justify-center gap-3"
          >
            <img src="https://www.gstatic.com/firebasejs/ui/2.0.0/images/auth/google.svg" className="w-5 h-5" alt="Google" />
            Sign in with Google
          </button>
        </div>
      </div>
    );
  }

  if (!isAdminUser) {
    return (
      <div className="min-h-screen pt-32 flex items-center justify-center bg-[#FDFBF7]">
        <div className="max-w-md w-full mx-4 text-center space-y-8 bg-white p-12 rounded-3xl border border-primary/10 shadow-xl">
          <div className="bg-red-50 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-6">
            <Lock className="text-red-500" size={32} />
          </div>
          <div>
            <h1 className="text-3xl font-serif text-primary mb-2">Unauthorized Account</h1>
            <p className="text-secondary font-sans text-sm font-medium mb-4">You are logged in as {user.email}, which does not have management privileges.</p>
            <button 
              onClick={handleLogout}
              className="text-primary font-sans font-bold uppercase tracking-widest text-xs border-b border-primary pb-1"
            >
              Sign Out & Try Another Account
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <main className="bg-[#FDFBF7] pt-32 pb-24 min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <header className="flex flex-col lg:flex-row justify-between items-start lg:items-center mb-12 space-y-6 lg:space-y-0">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <h1 className="text-4xl font-serif text-primary tracking-tight">Management Dashboard</h1>
              <span className="bg-green-100 text-green-700 text-[10px] uppercase font-bold px-2 py-1 rounded-full tracking-widest">Authorized</span>
            </div>
            <p className="text-secondary font-sans text-sm font-medium">
              Logged in as <span className="text-primary font-bold">{user.email}</span>
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex bg-white/50 backdrop-blur-sm p-1 rounded-full border border-primary/5 shadow-sm">
              <button 
                onClick={() => setActiveTab('orders')}
                className={`px-6 py-2 rounded-full text-xs font-sans font-bold transition-all duration-300 uppercase tracking-widest ${activeTab === 'orders' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'}`}
              >
                Orders ({orders.length})
              </button>
              <button 
                onClick={() => setActiveTab('products')}
                className={`px-6 py-2 rounded-full text-xs font-sans font-bold transition-all duration-300 uppercase tracking-widest ${activeTab === 'products' ? 'bg-primary text-white shadow-md' : 'hover:bg-primary/5'}`}
              >
                Inventory ({products.length})
              </button>
            </div>
            <button 
              onClick={handleLogout}
              className="p-3 bg-white rounded-full border border-primary/10 text-secondary hover:text-red-500 hover:border-red-100 transition-all shadow-sm"
              title="Sign Out"
            >
              <LogOut size={20} />
            </button>
          </div>
        </header>

        {activeTab === 'orders' ? (
          <section className="space-y-6">
            {orders.length === 0 ? (
              <div className="bg-white p-20 text-center rounded-2xl border border-primary/5 font-sans opacity-50 uppercase tracking-widest">
                No orders registered yet.
              </div>
            ) : (
              orders.map((order) => (
                <div key={order.id} className="bg-white rounded-2xl border border-primary/10 shadow-sm overflow-hidden transition-all hover:shadow-md">
                  <div 
                    className="p-6 cursor-pointer flex flex-col md:flex-row justify-between items-start md:items-center gap-4"
                    onClick={() => setExpandedOrder(expandedOrder === order.id ? null : order.id)}
                  >
                    <div className="flex items-center gap-4">
                      <div className={`p-3 rounded-full ${order.status === 'pending' ? 'bg-yellow-50 text-yellow-600' : 'bg-green-50 text-green-600'}`}>
                        {order.status === 'pending' ? <Clock size={20} /> : <CheckCircle size={20} />}
                      </div>
                      <div>
                        <h3 className="font-serif text-lg">{order.customerName}</h3>
                        <p className="text-xs text-secondary font-sans font-medium uppercase tracking-wider">{order.customerEmail}</p>
                      </div>
                    </div>

                    <div className="flex flex-col md:items-end">
                      <span className="text-lg font-serif">{order.total.toLocaleString()} PKR</span>
                      <p className="text-[10px] text-secondary font-sans font-bold uppercase tracking-[0.2em]">{new Date(order.createdAt?.toDate?.() || Date.now()).toLocaleDateString()}</p>
                    </div>

                    <div className="flex items-center gap-4 w-full md:w-auto">
                      <select 
                        value={order.status}
                        onChange={(e) => handleStatusUpdate(order.id, e.target.value)}
                        className="bg-accent/5 border-none p-2 rounded-lg text-xs font-sans font-bold uppercase tracking-wider outline-none"
                        onClick={(e) => e.stopPropagation()}
                      >
                        <option value="pending">Pending</option>
                        <option value="completed">Completed</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                      {expandedOrder === order.id ? <ChevronUp size={20}/> : <ChevronDown size={20}/>}
                    </div>
                  </div>

                  <AnimatePresence>
                    {expandedOrder === order.id && (
                      <motion.div 
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="px-6 pb-6 border-t border-primary/5 bg-[#FDFBF7]/30"
                      >
                        <div className="pt-6 grid grid-cols-1 md:grid-cols-2 gap-12">
                          <div>
                            <h4 className="text-[10px] text-secondary font-sans font-bold uppercase tracking-[0.2em] mb-4">Shipping Details</h4>
                            <div className="space-y-2 text-sm font-sans">
                              <p><span className="font-bold">Address:</span> {order.address}</p>
                              <p><span className="font-bold">City:</span> {order.city}</p>
                              <p><span className="font-bold">Contact:</span> {order.contact}</p>
                              <p><span className="font-bold">Payment:</span> {order.paymentMethod}</p>
                            </div>
                          </div>
                          <div>
                            <h4 className="text-[10px] text-secondary font-sans font-bold uppercase tracking-[0.2em] mb-4">Ordered Items</h4>
                            <div className="space-y-3">
                              {order.items.map((item, idx) => (
                                <div key={idx} className="flex justify-between items-center text-sm font-sans border-b border-primary/5 pb-2">
                                  <div>
                                    <p className="font-bold">{item.name}</p>
                                    <p className="text-xs text-secondary">Size: {item.size} × {item.quantity}</p>
                                  </div>
                                  <span>{item.price}</span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))
            )}
          </section>
        ) : (
          <section>
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-[10px] font-sans font-bold uppercase tracking-[0.3em] text-secondary">Inventory Management</h2>
              <div className="bg-accent/10 px-4 py-2 rounded-full flex items-center gap-2">
                <div className="w-1.5 h-1.5 rounded-full bg-accent animate-pulse"></div>
                <span className="text-[9px] font-sans font-bold uppercase tracking-widest text-accent italic">Syncing with Contentful</span>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
              <div className="col-span-full bg-white p-16 rounded-[2.5rem] border border-dashed border-primary/20 text-center space-y-6 shadow-sm">
                <div className="bg-primary/5 w-20 h-20 rounded-full flex items-center justify-center mx-auto mb-2">
                  <ExternalLink className="text-primary" size={32} />
                </div>
                <div>
                  <h3 className="text-3xl font-serif text-primary mb-3">Inventory moved to CMS</h3>
                  <p className="text-secondary font-sans text-sm max-w-lg mx-auto leading-relaxed">
                    To maintain professional editorial control, your product catalog is now managed through Contentful. 
                    Changes made in Contentful will automatically reflect on your website.
                  </p>
                </div>
                <div className="pt-4">
                  <a 
                    href="https://be.contentful.com/" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-3 bg-primary text-white px-10 py-5 rounded-full font-sans font-bold uppercase tracking-[0.2em] hover:bg-black transition-all shadow-xl shadow-primary/10 group"
                  >
                    Open Contentful Dashboard
                    <ChevronRight size={16} className="group-hover:translate-x-1 transition-transform" />
                  </a>
                </div>
              </div>
            </div>
          </section>
        )}
      </div>
    </main>
  );
}
