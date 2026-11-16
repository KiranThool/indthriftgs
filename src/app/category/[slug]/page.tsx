'use client';

import React, { useMemo } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/categories';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { ArrowLeft, Sparkles } from 'lucide-react';

export default function CategoryPage() {
  const params = useParams();
  const slug = params?.slug as string;
  const { products } = useProducts();

  const category = CATEGORIES.find((c) => c.slug === slug);

  const categoryProducts = useMemo(() => {
    return products.filter((p) => p.category_slug === slug);
  }, [products, slug]);

  if (!category) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream text-center">
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal mb-4">
          Category Not Found
        </h2>
        <Link
          href="/shop"
          className="px-6 py-3 bg-charcoal text-cream text-xs font-mono uppercase tracking-widest font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-12 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Navigation Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-mono text-charcoal/60 uppercase tracking-widest">
          <Link href="/shop" className="hover:text-charcoal flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>All Categories</span>
          </Link>
          <span>/</span>
          <span className="text-charcoal font-bold">{category.name}</span>
        </div>

        {/* Editorial Category Banner */}
        <div className="relative aspect-[21/9] sm:aspect-[24/8] w-full overflow-hidden mb-12 border border-charcoal/20 bg-charcoal">
          <Image
            src={category.image}
            alt={category.name}
            fill
            priority
            className="object-cover object-center opacity-40 mix-blend-luminosity scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-charcoal via-charcoal/60 to-transparent" />
          <div className="absolute inset-0 p-6 sm:p-10 flex flex-col justify-end text-cream z-10 max-w-2xl">
            <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 bg-cream/20 self-start text-[10px] font-mono uppercase tracking-widest text-cream mb-2">
              <Sparkles className="w-3 h-3 text-olive" />
              <span>Archive Collection</span>
            </div>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-cream">
              {category.name}
            </h1>
            <p className="text-xs sm:text-sm text-cream/80 font-sans mt-2 leading-relaxed">
              {category.description}
            </p>
          </div>
        </div>

        {/* Results Header */}
        <div className="flex justify-between items-center pb-4 mb-8 border-b border-charcoal/10 font-mono text-xs">
          <span className="text-charcoal/70 uppercase tracking-wider">
            Curated pieces in this drop
          </span>
          <span className="font-bold text-charcoal bg-charcoal/5 px-2.5 py-1 border border-charcoal/10">
            {categoryProducts.length} Available
          </span>
        </div>

        {/* Product Grid */}
        {categoryProducts.length === 0 ? (
          <div className="py-20 text-center bg-soft-white border border-charcoal/10 p-8 space-y-4">
            <h3 className="font-display font-bold text-xl uppercase tracking-wider text-charcoal">
              All items in {category.name} have found a home
            </h3>
            <p className="text-xs text-charcoal/60 max-w-md mx-auto font-sans">
              Our thrift inventory moves fast. Check back on our Friday 8PM drop or explore our other archive categories.
            </p>
            <Link
              href="/shop"
              className="inline-block px-6 py-2.5 bg-charcoal text-cream text-xs font-mono font-bold uppercase tracking-widest"
            >
              Browse Other Categories
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
            {categoryProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
