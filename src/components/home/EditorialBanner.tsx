'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { ArrowRight, Sparkles } from 'lucide-react';

export const EditorialBanner: React.FC = () => {
  return (
    <section className="relative overflow-hidden bg-charcoal text-cream py-24 sm:py-32">
      {/* Editorial High-Resolution Background */}
      <div className="absolute inset-0 z-0">
        <Image
          src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?q=80&w=2000&auto=format&fit=crop"
          alt="Vintage editorial archive collection moodboard"
          fill
          className="object-cover object-center opacity-30 mix-blend-luminosity scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-charcoal via-charcoal/85 to-transparent" />
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="max-w-2xl space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cream/10 border border-cream/20 text-cream/90 text-xs font-mono uppercase tracking-widest">
            <Sparkles className="w-3.5 h-3.5 text-olive" />
            <span>Limited Archive Curation</span>
          </div>

          <h2 className="font-display font-black text-4xl sm:text-6xl uppercase tracking-tighter text-cream leading-[0.95]">
            RARE FINDS. <br />
            <span className="italic font-editorial font-normal text-vintage-sand">
              ONE-OF-A-KIND.
            </span>
          </h2>

          <p className="text-sm sm:text-base text-cream/80 font-sans leading-relaxed">
            No mass production. No cookie-cutter seasonal fast fashion. Every piece in the Second Story archive has lived through eras, gathered authentic character, and is waiting to tell its next story with you.
          </p>

          <div className="pt-2 flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
            <Link
              href="/shop?condition=Vintage"
              className="px-8 py-4 bg-cream text-charcoal hover:bg-soft-white text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 group shadow-2xl"
            >
              <span>EXPLORE THE ARCHIVE</span>
              <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
            </Link>
            <Link
              href="/about"
              className="px-8 py-4 bg-transparent border border-cream/30 text-cream hover:border-cream text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center"
            >
              <span>READ OUR STORY</span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  );
};
