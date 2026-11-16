'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroSection: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-cream border-b border-charcoal/15">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Left Column: Bold Editorial Typography */}
          <motion.div
            initial={{ opacity: 0, y: 24 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 flex flex-col justify-center space-y-6"
          >
            {/* Tag / Drop alert pill */}
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 self-start text-xs font-mono uppercase tracking-widest text-charcoal/80">
              <span className="w-2 h-2 rounded-full bg-olive animate-pulse" />
              <span>Winter Archive 2024 • Drop Live</span>
            </div>

            {/* Main Editorial Headline */}
            <h1 className="font-display font-black text-4xl sm:text-6xl xl:text-7xl uppercase tracking-tighter text-charcoal leading-[0.95]">
              GOOD STYLE <br />
              <span className="italic font-editorial font-normal text-vintage-brown">
                DESERVES
              </span>{' '}
              A SECOND LIFE.
            </h1>

            {/* Subheadline */}
            <p className="text-base sm:text-lg text-charcoal/70 max-w-xl font-sans leading-relaxed">
              Discover one-of-a-kind vintage pieces, timeless classics, and pre-loved fits that deserve another story. 100% authenticated, sustainably sourced, and individually measured.
            </p>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 pt-2">
              <Link
                href="/shop"
                className="px-8 py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 group shadow-xl"
              >
                <span>SHOP THE COLLECTION</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
              <Link
                href="/shop?condition=Vintage"
                className="px-8 py-4 bg-transparent border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2"
              >
                <span>EXPLORE VINTAGE</span>
              </Link>
            </div>

            {/* Micro badges below CTA */}
            <div className="pt-6 border-t border-charcoal/10 grid grid-cols-3 gap-4 text-charcoal/70">
              <div>
                <span className="font-mono font-bold text-xs sm:text-sm text-charcoal block">1-OF-1</span>
                <span className="text-[11px] font-mono text-charcoal/60">Unique Inventory</span>
              </div>
              <div>
                <span className="font-mono font-bold text-xs sm:text-sm text-charcoal block">AUTHENTIC</span>
                <span className="text-[11px] font-mono text-charcoal/60">Verified Vintage</span>
              </div>
              <div>
                <span className="font-mono font-bold text-xs sm:text-sm text-charcoal block">ECO IMPACT</span>
                <span className="text-[11px] font-mono text-charcoal/60">Zero Fast Fashion</span>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Editorial Visual Composition */}
          <motion.div
            initial={{ opacity: 0, scale: 0.96 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.7, delay: 0.1 }}
            className="lg:col-span-5 relative"
          >
            <div className="relative aspect-[4/5] w-full max-w-md mx-auto overflow-hidden shadow-2xl border border-charcoal/20 bg-light-grey">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial streetwear model wearing vintage thrifted jacket and knit"
                fill
                priority
                className="object-cover object-top hover:scale-105 transition-transform duration-700"
                sizes="(max-width: 768px) 100vw, 500px"
              />

              {/* Editorial Floating Card */}
              <div className="absolute bottom-4 left-4 right-4 p-4 bg-cream/90 backdrop-blur-md border border-charcoal/10 shadow-lg">
                <div className="flex justify-between items-center mb-1">
                  <span className="text-[10px] font-mono uppercase tracking-widest text-charcoal/60">
                    FEATURED ARCHIVE GRAIL
                  </span>
                  <span className="text-[10px] font-mono font-bold text-olive-500 uppercase">
                    AVAILABLE NOW
                  </span>
                </div>
                <h4 className="font-sans font-bold text-xs sm:text-sm uppercase tracking-wide text-charcoal truncate">
                  1998 Carhartt Detroit Duck Canvas Jacket
                </h4>
                <div className="flex justify-between items-center mt-2 text-xs font-mono">
                  <span className="font-bold text-charcoal">₹6,490</span>
                  <span className="text-vintage-rust font-semibold">1 Available</span>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};
