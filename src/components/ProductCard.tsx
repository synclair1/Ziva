/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

interface ProductCardProps {
  id: string;
  name: string;
  category: string;
  price: string;
  image: string;
  tag?: string;
  key?: React.Key;
}

export default function ProductCard({ id, name, category, price, image, tag }: ProductCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      className="group"
    >
      <Link to={`/product/${id}`} className="block relative overflow-hidden bg-bg-alt aspect-[3/4]">
        {/* Product Image */}
        <img
          src={image}
          alt={name}
          className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
          referrerPolicy="no-referrer"
        />

        {/* Tag */}
        {tag && (
          <span className="absolute top-4 left-4 bg-white/90 backdrop-blur-sm text-[10px] uppercase tracking-widest px-3 py-1 font-sans font-medium text-accent">
            {tag}
          </span>
        )}
      </Link>

      <div className="mt-5 flex justify-between items-start">
        <div>
          <h3 className="text-lg font-serif text-primary group-hover:text-accent transition-colors">{name}</h3>
          <p className="text-[10px] text-muted uppercase tracking-widest mt-1 font-sans font-medium">{category}</p>
        </div>
        <p className="text-base font-serif text-secondary">{price}</p>
      </div>
    </motion.div>
  );
}
