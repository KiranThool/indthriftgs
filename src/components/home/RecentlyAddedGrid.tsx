'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight, Clock } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/shop/ProductCard';

export const RecentlyAddedGrid: React.FC = () => {
  const { products } = useProducts();
  const recentProducts = products.filter((p) => p.is_new_arrival).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-cream/50 border-t border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-charcoal/10">
          <div>
            <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-widest text-olive-500 font-semibold mb-1">
              <Clock className="w-3.5 h-3.5" />
              <span>FRESHLY CURATED DROP</span>
            </div>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tighter text-charcoal">
              RECENTLY ADDED
            </h2>
          </div>
          <Link
            href="/shop?sort=newest"
            className="mt-3 sm:mt-0 font-mono text-xs uppercase tracking-wider text-charcoal hover:text-vintage-brown flex items-center gap-1 group font-bold"
          >
            <span>See All Recent Drops</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {recentProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
