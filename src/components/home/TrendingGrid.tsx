'use client';

import React from 'react';
import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/shop/ProductCard';

export const TrendingGrid: React.FC = () => {
  const { products } = useProducts();
  const trendingProducts = products.filter((p) => p.is_trending).slice(0, 4);

  return (
    <section className="py-16 sm:py-24 bg-cream">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-10 pb-4 border-b border-charcoal/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-rust font-semibold block mb-1">
              CURRENT COMMUNITY GRAILS
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tighter text-charcoal">
              TRENDING NOW
            </h2>
          </div>
          <Link
            href="/shop"
            className="mt-3 sm:mt-0 font-mono text-xs uppercase tracking-wider text-charcoal hover:text-vintage-brown flex items-center gap-1 group font-bold"
          >
            <span>View All Pieces</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
          {trendingProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </section>
  );
};
