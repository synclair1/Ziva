
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { collection, query, where, orderBy, getDocs } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { motion } from 'framer-motion';
import { Package, LogOut, ShoppingBag, Clock, ChevronRight } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

interface Order {
  id: string;
  items: any[];
  total: string;
  status: string;
  createdAt: any;
  orderDate: string;
}

export default function Profile() {
  const { user, logout, login, loading: authLoading } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    if (!authLoading && !user) {
      // Not logged in
      setLoading(false);
      return;
    }

    if (user) {
      const fetchOrders = async () => {
        try {
          const ordersRef = collection(db, 'orders');
          const q = query(
            ordersRef, 
            where('customerEmail', '==', user.email),
            orderBy('createdAt', 'desc')
          );
          const snapshot = await getDocs(q);
          const ordersData = snapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as Order[];
          setOrders(ordersData);
        } catch (error) {
          console.error("Error fetching orders:", error);
        } finally {
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [user, authLoading]);

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  if (authLoading || (user && loading)) {
    return (
      <div className="pt-32 pb-20 px-6 flex justify-center items-center min-h-[60vh]">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto text-center">
        <div className="max-w-md mx-auto py-20 border border-secondary/20 rounded-2xl bg-white shadow-sm">
          <ShoppingBag className="mx-auto mb-6 text-secondary/30" size={48} />
          <h1 className="text-3xl font-serif mb-4">View Your Orders</h1>
          <p className="text-secondary/60 mb-10 font-sans">Login to view your order history and track your packages.</p>
          <button 
            onClick={login}
            className="bg-primary text-white px-10 py-4 font-sans font-bold uppercase tracking-[0.2em] text-xs hover:bg-black transition-all rounded-full"
          >
            Sign In with Google
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-12">
        {/* Sidebar */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-secondary/10 rounded-2xl p-8 shadow-sm">
            <div className="flex items-center space-x-4 mb-10">
              {user.photoURL ? (
                <img src={user.photoURL} alt={user.displayName || ''} className="w-16 h-16 rounded-full border-2 border-accent" />
              ) : (
                <div className="w-16 h-16 rounded-full bg-accent flex items-center justify-center text-white text-2xl font-serif">
                  {user.displayName?.charAt(0) || user.email?.charAt(0).toUpperCase()}
                </div>
              )}
              <div className="overflow-hidden">
                <h2 className="font-serif text-xl truncate">{user.displayName || 'User'}</h2>
                <p className="text-xs text-secondary/50 font-sans truncate">{user.email}</p>
              </div>
            </div>

            <nav className="space-y-2">
              <button className="w-full flex items-center justify-between p-4 bg-accent/10 border border-accent/20 rounded-xl text-primary font-sans font-bold text-xs uppercase tracking-widest transition-all">
                <span className="flex items-center space-x-3">
                  <Package size={16} />
                  <span>My Orders</span>
                </span>
                <ChevronRight size={14} />
              </button>
              
              <button 
                onClick={handleLogout}
                className="w-full flex items-center space-x-3 p-4 text-secondary/60 hover:text-red-500 font-sans font-bold text-xs uppercase tracking-widest transition-all"
              >
                <LogOut size={16} />
                <span>Sign Out</span>
              </button>

              <div className="pt-6 mt-6 border-t border-secondary/5">
                <p className="px-4 mb-4 text-[10px] uppercase tracking-[0.2em] text-secondary/40 font-bold font-sans">Management</p>
                <button 
                  onClick={() => navigate('/admin-dashboard')}
                  className="w-full flex items-center justify-between p-4 bg-primary text-white rounded-xl font-sans font-bold text-xs uppercase tracking-widest shadow-lg shadow-primary/20 hover:scale-[1.02] transition-all"
                >
                  <span className="flex items-center space-x-3">
                    <ShoppingBag size={16} />
                    <span>Manage Catalog</span>
                  </span>
                  <ChevronRight size={14} />
                </button>
              </div>
            </nav>
          </div>
        </div>

        {/* Content */}
        <div className="lg:col-span-3">
          <div className="mb-10 flex justify-between items-end">
            <div>
              <h1 className="text-4xl font-serif mb-2">Order History</h1>
              <p className="text-sm text-secondary/60 font-sans">Manage and track your recent orders.</p>
            </div>
            <div className="text-right">
              <span className="text-xs font-sans font-bold text-accent uppercase tracking-widest">{orders.length} Total Orders</span>
            </div>
          </div>

          {loading ? (
            <div className="py-20 text-center animate-pulse text-secondary/40 font-sans text-xs uppercase tracking-widest italic">
              Loading your history...
            </div>
          ) : orders.length === 0 ? (
            <div className="py-32 bg-white border border-dashed border-secondary/30 rounded-3xl text-center">
              <Clock className="mx-auto mb-6 text-secondary/20" size={48} />
              <h3 className="text-xl font-serif mb-3 text-secondary/40">No orders yet</h3>
              <p className="text-sm text-secondary/30 font-sans mb-8">Your shopping journey starts here.</p>
              <button 
                onClick={() => navigate('/shop')}
                className="text-accent hover:text-primary font-sans font-bold text-xs uppercase tracking-widest underline decoration-accent/30 underline-offset-8"
              >
                Start Shopping
              </button>
            </div>
          ) : (
            <div className="space-y-6">
              {orders.map((order) => (
                <motion.div 
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  key={order.id} 
                  className="bg-white border border-secondary/10 rounded-2xl overflow-hidden hover:shadow-md transition-shadow"
                >
                  <div className="p-6 border-b border-secondary/5 flex flex-wrap justify-between items-center bg-secondary/[0.02]">
                    <div className="flex space-x-8">
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-1">Order ID</p>
                        <p className="font-mono text-xs text-secondary/80">#{order.id.slice(-8).toUpperCase()}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-1">Date</p>
                        <p className="font-sans text-xs text-secondary/80">{order.orderDate || 'Recent'}</p>
                      </div>
                      <div>
                        <p className="text-[10px] uppercase tracking-widest text-secondary/40 font-bold mb-1">Total</p>
                        <p className="font-sans text-xs font-bold text-primary">{order.total}</p>
                      </div>
                    </div>
                    <div>
                      <span className={`inline-block px-4 py-1.5 rounded-full text-[10px] font-sans font-bold uppercase tracking-wider ${
                        order.status === 'completed' ? 'bg-green-100 text-green-700' : 
                        order.status === 'shipping' ? 'bg-blue-100 text-blue-700' : 
                        'bg-accent/10 text-primary'
                      }`}>
                        {order.status || 'Pending'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="p-6">
                    <div className="space-y-4">
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex justify-between items-center">
                          <div className="flex items-center space-x-4">
                            <div className="w-12 h-16 bg-accent/10 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                              {item.image ? (
                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                              ) : (
                                <Package className="text-accent/30" size={20} />
                              )}
                            </div>
                            <div>
                              <p className="text-sm font-sans font-medium text-secondary/80">{item.name}</p>
                              <p className="text-[10px] text-secondary/40 font-sans uppercase tracking-widest">{item.size} × {item.quantity}</p>
                            </div>
                          </div>
                          <div className="text-right">
                            <p className="text-xs font-sans font-bold text-secondary/60">Rs. {(item.priceNumber * item.quantity).toLocaleString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
