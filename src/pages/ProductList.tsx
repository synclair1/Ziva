/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import ProductCard from '../components/ProductCard.tsx';
import { getAllProducts } from '../services/productService.ts';
import { Product } from '../lib/firebaseService.ts';

export default function ProductList() {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');

  useEffect(() => {
    setLoading(true);
    // Note: The mapping of filter to actual category name in Firestore
    const categoryMap: { [key: string]: string } = {
      '2pc': '2-Piece Set',
      '3pc': '3-Piece Set',
      'casual': 'Casual Fusion',
    };
    
    const categoryName = categoryMap[filter];
    getAllProducts(categoryName).then(fetchedProducts => {
      setProducts(fetchedProducts);
      setLoading(false);
    }).catch(err => {
      console.error(err);
      setLoading(false);
    });
  }, [filter]);

  const filteredProducts = products;

  return (
    <main className="bg-bg-light pt-32 pb-24">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-20 gap-8">
          <div>
            <h1 className="text-5xl md:text-7xl font-serif font-light mb-6 text-primary">All Collections</h1>
            <p className="text-base text-secondary font-sans font-light max-w-lg leading-relaxed">
              Explore our curation of 2-piece and 3-piece fusion sets, designed for the modern lifestyle.
            </p>
          </div>

          <div className="flex space-x-10 text-[11px] uppercase tracking-relaxed-caps font-sans font-bold border-b border-border-subtle pb-3">
            <button 
              onClick={() => setFilter('all')}
              className={`transition-opacity ${filter === 'all' ? 'text-primary border-b border-primary' : 'text-muted hover:text-primary'}`}
            >
              All
            </button>
            <button 
              onClick={() => setFilter('2pc')}
              className={`transition-opacity ${filter === '2pc' ? 'text-primary border-b border-primary' : 'text-muted hover:text-primary'}`}
            >
              2-Piece Sets
            </button>
            <button 
              onClick={() => setFilter('3pc')}
              className={`transition-opacity ${filter === '3pc' ? 'text-primary border-b border-primary' : 'text-muted hover:text-primary'}`}
            >
              3-Piece Sets
            </button>
            <button 
              onClick={() => setFilter('casual')}
              className={`transition-opacity ${filter === 'casual' ? 'text-primary border-b border-primary' : 'text-muted hover:text-primary'}`}
            >
              Casual Fusion
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-12 gap-y-20">
          {loading ? (
             <div className="col-span-full py-20 text-center font-sans tracking-widest opacity-50 uppercase">
              Refreshing inventory...
            </div>
          ) : filteredProducts.length > 0 ? (
            filteredProducts.map((product) => (
              <ProductCard 
                key={product.id} 
                id={product.id} 
                name={product.name}
                category={product.category}
                price={product.price}
                image={product.image}
              />
            ))
          ) : (
            <div className="col-span-full py-20 text-center font-sans tracking-widest opacity-50 uppercase">
              No articles found in this category.
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
