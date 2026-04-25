
import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext.tsx';
import { getProducts, createProduct, deleteProduct, Product } from '../lib/firebaseService.ts';
import { motion, AnimatePresence } from 'framer-motion';
import { Plus, Trash2, Tag, ShoppingBag, Loader2, ArrowLeft, Image as ImageIcon } from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';

export default function ManageProducts() {
  const { user, loading: authLoading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [isAdding, setIsAdding] = useState(false);
  const [submitLoading, setSubmitLoading] = useState(false);
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    name: '',
    category: '2-Piece Set',
    price: 'Rs. ',
    priceNumber: 0,
    image: '',
    description: '',
    details: '',
    featured: false,
    tag: ''
  });

  useEffect(() => {
    if (!authLoading && !user) {
      navigate('/account');
      return;
    }

    const fetchProducts = async () => {
      const data = await getProducts();
      setProducts(data);
      setLoading(false);
    };
    fetchProducts();
  }, [user, authLoading, navigate]);

  const handleDelete = async (id: string) => {
    if (window.confirm('Are you sure you want to delete this product?')) {
      const success = await deleteProduct(id);
      if (success) {
        setProducts(products.filter(p => p.id !== id));
      }
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitLoading(true);
    
    const productData = {
      ...formData,
      details: formData.details.split('\n').filter(d => d.trim() !== '')
    };

    const docRef = await createProduct(productData);
    if (docRef) {
      const newProduct = { id: docRef.id, ...productData } as Product;
      setProducts([newProduct, ...products]);
      setIsAdding(false);
      setFormData({
        name: '',
        category: '2-Piece Set',
        price: 'Rs. ',
        priceNumber: 0,
        image: '',
        description: '',
        details: '',
        featured: false,
        tag: ''
      });
    }
    setSubmitLoading(false);
  };

  if (authLoading || loading) {
    return (
      <div className="pt-32 pb-20 px-6 flex justify-center items-center min-h-[60vh]">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  return (
    <div className="pt-32 pb-20 px-6 max-w-7xl mx-auto">
      <Link to="/account" className="inline-flex items-center space-x-2 text-xs font-sans font-bold uppercase tracking-widest text-secondary/40 hover:text-primary mb-8 transition-colors">
        <ArrowLeft size={14} />
        <span>Back to Account</span>
      </Link>

      <div className="flex flex-wrap justify-between items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl font-serif mb-2">Manage Catalog</h1>
          <p className="text-sm text-secondary/60 font-sans">Add or remove products from your live store.</p>
        </div>
        <button 
          onClick={() => setIsAdding(!isAdding)}
          className="bg-primary text-white px-8 py-4 font-sans font-bold uppercase tracking-[0.2em] text-[10px] hover:bg-black transition-all rounded-full flex items-center space-x-3 shadow-lg shadow-primary/20"
        >
          {isAdding ? <><Trash2 size={14} /> <span>Cancel</span></> : <><Plus size={14} /> <span>Add New Product</span></>}
        </button>
      </div>

      <AnimatePresence>
        {isAdding && (
          <motion.div 
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className="overflow-hidden mb-16"
          >
            <div className="bg-white border border-secondary/10 rounded-3xl p-8 shadow-sm">
              <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Product Name</label>
                    <input 
                      required
                      type="text" 
                      value={formData.name}
                      onChange={(e) => setFormData({...formData, name: e.target.value})}
                      placeholder="e.g. Silk Autumn Ensemble"
                      className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Category</label>
                      <select 
                        value={formData.category}
                        onChange={(e) => setFormData({...formData, category: e.target.value})}
                        className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                      >
                        <option>2-Piece Set</option>
                        <option>3-Piece Set</option>
                        <option>Casual Fusion</option>
                        <option>Ready-to-Wear</option>
                      </select>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Price Label</label>
                      <input 
                        required
                        type="text" 
                        value={formData.price}
                        onChange={(e) => setFormData({...formData, price: e.target.value})}
                        placeholder="Rs. 12,500"
                        className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Price Amount (Numeric)</label>
                    <input 
                      required
                      type="number" 
                      value={formData.priceNumber}
                      onChange={(e) => setFormData({...formData, priceNumber: parseInt(e.target.value)})}
                      className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Image URL</label>
                    <input 
                      required
                      type="url" 
                      value={formData.image}
                      onChange={(e) => setFormData({...formData, image: e.target.value})}
                      placeholder="Paste image link here"
                      className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors"
                    />
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Description</label>
                    <textarea 
                      required
                      rows={3}
                      value={formData.description}
                      onChange={(e) => setFormData({...formData, description: e.target.value})}
                      className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors resize-none"
                    ></textarea>
                  </div>
                  <div>
                    <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Features (One per line)</label>
                    <textarea 
                      rows={3}
                      value={formData.details}
                      onChange={(e) => setFormData({...formData, details: e.target.value})}
                      placeholder="Premium Silk&#10;Handmade Embroidery&#10;Slim Fit"
                      className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-3 font-sans font-light focus:outline-none focus:border-accent transition-colors resize-none"
                    ></textarea>
                  </div>
                  <div className="flex items-center space-x-6">
                    <label className="flex items-center space-x-3 cursor-pointer">
                      <input 
                        type="checkbox" 
                        checked={formData.featured}
                        onChange={(e) => setFormData({...formData, featured: e.target.checked})}
                        className="rounded border-secondary/20 text-accent focus:ring-accent"
                      />
                      <span className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/60">Featured Product</span>
                    </label>
                    <div className="flex-1">
                      <label className="text-[10px] uppercase tracking-widest font-sans font-bold text-secondary/40 block mb-2">Tag (Optional)</label>
                      <input 
                        type="text" 
                        value={formData.tag}
                        onChange={(e) => setFormData({...formData, tag: e.target.value})}
                        placeholder="NEW"
                        className="w-full bg-secondary/[0.02] border border-secondary/10 rounded-xl px-4 py-2 font-sans font-light text-xs focus:outline-none focus:border-accent transition-colors"
                      />
                    </div>
                  </div>
                  <button 
                    disabled={submitLoading}
                    type="submit"
                    className="w-full bg-accent text-white py-4 font-sans font-bold uppercase tracking-[0.2em] text-xs hover:bg-primary transition-all rounded-xl disabled:opacity-50 flex items-center justify-center space-x-2"
                  >
                    {submitLoading ? <Loader2 size={16} className="animate-spin" /> : <span>Save Product</span>}
                  </button>
                </div>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
        {products.map((product) => (
          <motion.div 
            layout
            key={product.id} 
            className="group bg-white border border-secondary/10 rounded-2xl overflow-hidden hover:shadow-xl transition-all duration-500"
          >
            <div className="relative aspect-[3/4] overflow-hidden">
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" 
              />
              <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center space-x-4">
                <button 
                  onClick={() => handleDelete(product.id)}
                  className="bg-white/90 p-4 rounded-full text-red-500 hover:bg-white transition-colors shadow-lg"
                  title="Delete Product"
                >
                  <Trash2 size={20} />
                </button>
              </div>
              {product.tag && (
                <div className="absolute top-4 left-4 bg-white/90 backdrop-blur px-3 py-1 rounded-full text-[9px] font-sans font-extrabold uppercase tracking-widest text-primary">
                  {product.tag}
                </div>
              )}
            </div>
            <div className="p-5">
              <p className="text-[10px] text-secondary/40 font-sans font-bold uppercase tracking-widest mb-1">{product.category}</p>
              <h3 className="font-serif text-lg mb-2 truncate">{product.name}</h3>
              <p className="font-sans font-bold text-accent">{product.price}</p>
            </div>
          </motion.div>
        ))}
        {products.length === 0 && !isAdding && (
          <div className="col-span-full py-32 text-center border-2 border-dashed border-secondary/10 rounded-3xl">
            <ShoppingBag className="mx-auto mb-4 text-secondary/20" size={40} />
            <h3 className="text-xl font-serif text-secondary/40 mb-2">Your Catalog is Empty</h3>
            <p className="text-sm font-sans text-secondary/30 mb-8">Click "Add New Product" to start building your store.</p>
          </div>
        )}
      </div>
    </div>
  );
}
