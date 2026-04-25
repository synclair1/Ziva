/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ChevronRight, Share2, ShoppingBag, Loader2 } from 'lucide-react';
import { useCart } from '../context/CartContext.tsx';
import { getSingleProduct } from '../services/productService.ts';
import { Product } from '../lib/firebaseService.ts';

export default function ProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [selectedSize, setSelectedSize] = useState<string | null>(null);
  const { addToCart } = useCart();

  useEffect(() => {
    if (id) {
      setLoading(true);
      getSingleProduct(id).then(fetchedProduct => {
        setProduct(fetchedProduct);
        setLoading(false);
      }).catch(err => {
        console.error(err);
        setLoading(false);
      });
    }
  }, [id]);

  const handleAddToCart = () => {
    if (!product) return;
    if (!selectedSize) {
      alert('Please select a size before adding to bag.');
      return;
    }
    addToCart({
      id: product.id,
      name: product.name,
      price: product.price,
      priceNumber: product.priceNumber,
      image: product.image,
      size: selectedSize,
      quantity: 1
    });
  };

  if (loading) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex items-center justify-center">
        <Loader2 className="animate-spin text-primary" size={32} />
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen pt-32 pb-24 flex flex-col items-center justify-center space-y-6">
        <h2 className="text-3xl font-serif">Article not found</h2>
        <Link to="/shop" className="text-xs uppercase tracking-widest font-sans border-b border-primary pb-1">Return to Shop</Link>
      </div>
    );
  }

  return (
    <main className="bg-bg-light pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-3 text-[10px] uppercase tracking-[0.2em] text-muted mb-16 font-sans font-medium">
          <Link to="/" className="hover:text-primary transition-colors">Home</Link>
          <ChevronRight size={10} />
          <Link to="/shop" className="hover:text-primary transition-colors">Shop</Link>
          <ChevronRight size={10} />
          <span className="text-primary">{product.name}</span>
        </div>

        <div className="grid lg:grid-cols-2 gap-20">
          {/* Images */}
          <div className="space-y-6">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }}
              className="aspect-[3/4] overflow-hidden bg-bg-alt shadow-sm border border-border-subtle"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </motion.div>
            <div className="grid grid-cols-2 gap-6">
              <div className="aspect-square bg-bg-alt border border-border-subtle shadow-sm"></div>
              <div className="aspect-square bg-bg-alt border border-border-subtle shadow-sm"></div>
            </div>
          </div>

          {/* Info */}
          <div className="space-y-12">
            <div>
              <span className="inline-block text-[11px] text-accent uppercase tracking-[0.3em] font-sans font-bold mb-4">{product.category}</span>
              <h1 className="text-5xl md:text-6xl font-serif font-light mb-6 text-primary leading-tight">{product.name}</h1>
              <p className="text-2xl font-serif text-accent">{product.price}</p>
            </div>

            <div className="space-y-8">
              <p className="text-lg font-sans font-light text-secondary leading-relaxed">
                {product.description}
              </p>
            </div>

            <div className="space-y-6">
              <div className="flex justify-between items-center text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-primary">
                <span>Select Size</span>
                <button className="text-accent underline underline-offset-4">Size Guide</button>
              </div>
              <div className="flex flex-wrap gap-4">
                {['XS', 'S', 'M', 'L', 'XL'].map(size => (
                  <button 
                    key={size} 
                    onClick={() => setSelectedSize(size)}
                    className={`w-14 h-14 border flex items-center justify-center text-xs font-sans font-bold transition-all ${
                      selectedSize === size 
                        ? 'border-primary bg-primary text-white' 
                        : 'border-border-subtle hover:border-primary text-secondary'
                    }`}
                  >
                    {size}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex flex-col gap-4">
              <button 
                onClick={handleAddToCart}
                className="w-full bg-primary text-white py-6 text-xs uppercase tracking-[0.2em] font-sans font-bold hover:opacity-90 transition-opacity flex items-center justify-center gap-3"
              >
                <ShoppingBag size={14} />
                Add to Bag
              </button>
              
              <a 
                href={`https://wa.me/1234567890?text=${encodeURIComponent(`Hello ZIVA! I'd like to order the ${product.name} (${product.price}).`)}`}
                target="_blank"
                rel="noopener noreferrer"
                className="w-full bg-green-600 text-white py-6 text-xs uppercase tracking-[0.2em] font-sans font-bold hover:bg-green-700 transition-colors flex items-center justify-center gap-3"
              >
                <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
                  <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                </svg>
                Order via WhatsApp
              </a>
            </div>

            <div className="pt-12 border-t border-border-subtle space-y-10">
              <div>
                <h4 className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold text-primary mb-6">Details</h4>
                <ul className="grid grid-cols-2 gap-y-4 text-sm font-sans font-light text-secondary">
                  {product.details.map((detail, index) => (
                    <li key={index} className="flex items-center space-x-3">
                      <span className="w-1.5 h-1.5 rounded-full bg-accent"></span>
                      <span>{detail}</span>
                    </li>
                  ))}
                </ul>
              </div>
              <div className="flex justify-between items-center text-[10px] uppercase tracking-[0.2em] text-muted font-sans font-medium">
                <span>SKU: {product.sku}</span>
                <button className="flex items-center space-x-2 hover:text-primary transition-colors">
                  <Share2 size={12} />
                  <span>Share</span>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
