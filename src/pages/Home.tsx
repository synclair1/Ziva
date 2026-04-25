/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import Hero from '../components/Hero.tsx';
import ProductCard from '../components/ProductCard.tsx';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import { getHomeFeaturedProducts } from '../services/productService.ts';
import { Product } from '../lib/firebaseService.ts';

export default function Home() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getHomeFeaturedProducts().then(products => {
      setFeaturedProducts(products);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, []);
  return (
    <main className="bg-bg-light">
      <Hero />

      {/* Value Proposition */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 border-b border-border-subtle">
        <div className="grid md:grid-cols-3 gap-16">
          <div className="text-center">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-6">The Aesthetic</h4>
            <p className="text-base font-serif font-light leading-relaxed text-secondary italic">
              "A seamless blend of traditional craftsmanship and modern Western silhouettes."
            </p>
          </div>
          <div className="text-center border-x border-border-subtle px-8">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-6">The Craft</h4>
            <p className="text-base font-sans font-light leading-relaxed text-secondary opacity-80">
              Focusing on minimal laces, statement sleeves, and unique necklines. Everyday wearability defined.
            </p>
          </div>
          <div className="text-center">
            <h4 className="text-[11px] uppercase tracking-[0.3em] font-sans font-bold text-accent mb-6">The Fabric</h4>
            <p className="text-base font-sans font-light leading-relaxed text-secondary opacity-80">
              Breathable local lawn, khaddar, and fine organza. Premium textures for the modern woman.
            </p>
          </div>
        </div>
      </section>

      {/* Featured Collection */}
      <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex justify-between items-end mb-16">
          <div>
            <h2 className="text-4xl md:text-6xl font-serif font-light mb-4 text-primary">Featured Collection</h2>
            <p className="text-sm text-muted font-sans font-light uppercase tracking-widest">Handpicked fusion sets for your everyday chic.</p>
          </div>
          <Link to="/shop" className="text-[11px] uppercase tracking-[0.2em] font-sans font-bold border-b border-primary pb-1 text-primary hover:text-accent hover:border-accent transition-all">
            View All
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-12">
          {loading ? (
            <div className="col-span-full py-20 text-center font-sans uppercase tracking-widest opacity-50">
              Loading collection...
            </div>
          ) : featuredProducts.length > 0 ? (
            featuredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
                tag={product.tag}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center font-sans tracking-widest opacity-50">
              Our latest arrivals are coming soon.
            </div>
          )}
        </div>
      </section>

      {/* Editorial Section */}
      <section className="py-24 bg-primary text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <div className="relative aspect-[4/5] overflow-hidden shadow-2xl">
              <img
                src="https://images.unsplash.com/photo-1594231846059-e97be6a66504?auto=format&fit=crop&q=80&w=1000"
                alt="Editorial Look"
                className="w-full h-full object-cover"
                referrerPolicy="no-referrer"
              />
            </div>
            <div className="space-y-10">
              <span className="text-xs uppercase tracking-[0.4em] text-accent font-sans font-bold">Ziva Perspective</span>
              <h2 className="text-5xl md:text-7xl font-serif font-light leading-tight">
                Beyond Tradition, <br />
                <span className="italic">Into the Modern.</span>
              </h2>
              <p className="text-lg font-sans font-light opacity-80 leading-relaxed max-w-xl text-border-subtle">
                We believe that fashion should be a bridge between where we come from and where we are going.
                Our 'Casual Fusion' line takes the intricate handwoven heritage of Pakistan and shapes it into
                vibrant tunics, oversized shirts, and tapered silhouettes.
              </p>
              <div className="pt-6">
                <Link to="/about" className="inline-block px-10 py-5 border border-border-subtle text-white font-sans text-xs uppercase tracking-widest hover:bg-white hover:text-primary transition-all text-center">
                  Read Our Story
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  );
}
