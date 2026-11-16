'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { CATEGORIES } from '@/data/categories';
import { ArrowUpRight } from 'lucide-react';

export const CategoryCards: React.FC = () => {
  return (
    <section className="py-16 sm:py-20 bg-cream border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-10 pb-4 border-b border-charcoal/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown block mb-1">
              CURATED ARCHIVES
            </span>
            <h2 className="font-display font-black text-2xl sm:text-4xl uppercase tracking-tighter text-charcoal">
              EXPLORE BY CATEGORY
            </h2>
          </div>
          <p className="text-xs sm:text-sm font-sans text-charcoal/70 max-w-sm mt-2 md:mt-0 leading-relaxed">
            Hand-sourced vintage apparel categorized for effortless style hunting.
          </p>
        </div>

        {/* Categories Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
          {CATEGORIES.map((cat, idx) => (
            <Link
              key={cat.id}
              href={`/category/${cat.slug}`}
              className="group relative block aspect-[4/5] overflow-hidden bg-light-grey border border-charcoal/10 hover:border-charcoal transition-all duration-300"
            >
              {/* Image */}
              <Image
                src={cat.image}
                alt={cat.name}
                fill
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 25vw, 300px"
                className="object-cover object-center group-hover:scale-108 transition-transform duration-700 ease-out"
              />

              {/* Gradient Scrim */}
              <div className="absolute inset-0 bg-gradient-to-t from-charcoal/90 via-charcoal/30 to-transparent group-hover:from-charcoal/95 transition-colors duration-300" />

              {/* Card Label and Content */}
              <div className="absolute inset-0 p-4 sm:p-5 flex flex-col justify-between text-cream z-10">
                <div className="flex justify-between items-start">
                  <span className="font-mono text-[10px] sm:text-xs text-cream/70 tracking-widest uppercase">
                    0{idx + 1}
                  </span>
                  <div className="w-7 h-7 rounded-full bg-cream/10 backdrop-blur-sm border border-cream/20 flex items-center justify-center group-hover:bg-cream group-hover:text-charcoal transition-colors">
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </div>
                </div>

                <div>
                  <h3 className="font-display font-bold text-sm sm:text-lg uppercase tracking-wider text-cream group-hover:translate-x-1 transition-transform duration-300">
                    {cat.name}
                  </h3>
                  <span className="font-mono text-[10px] sm:text-xs text-cream/60 uppercase tracking-widest mt-1 block">
                    {cat.itemCount} Unique Finds
                  </span>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </section>
  );
};
