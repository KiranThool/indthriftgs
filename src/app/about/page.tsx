'use client';

import React from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ArrowRight, Sparkles, Droplets, Recycle, ShieldCheck } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="bg-cream min-h-screen border-b border-charcoal/10">
      {/* Editorial Hero Banner */}
      <section className="relative py-20 sm:py-32 border-b border-charcoal/15 overflow-hidden">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl space-y-6">
            <div className="inline-flex items-center space-x-2 px-3 py-1 bg-charcoal/5 border border-charcoal/10 text-xs font-mono uppercase tracking-widest text-charcoal/80">
              <Sparkles className="w-3.5 h-3.5 text-vintage-brown" />
              <span>SECOND STORY ARCHIVE MANIFESTO</span>
            </div>

            <h1 className="font-display font-black text-4xl sm:text-6xl lg:text-7xl uppercase tracking-tighter text-charcoal leading-[0.95]">
              FASHION HAS STORIES. <br />
              <span className="italic font-editorial font-normal text-vintage-brown">
                WE GIVE THEM
              </span>{' '}
              ANOTHER CHAPTER.
            </h1>

            <p className="text-base sm:text-xl text-charcoal/80 font-sans leading-relaxed">
              We reject the 52-micro-season landfill cycle of disposable fast fashion. Second Story exists to curate, preserve, and pass on iconic garments that have character, history, and decades of life left in their threads.
            </p>
          </div>
        </div>
      </section>

      {/* Editorial Split Section with High-Fashion Imagery */}
      <section className="py-16 sm:py-24 border-b border-charcoal/10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
            <div className="lg:col-span-6 relative aspect-[4/5] bg-light-grey border border-charcoal/15 overflow-hidden shadow-2xl">
              <Image
                src="https://images.unsplash.com/photo-1509631179647-0177331693ae?q=80&w=1200&auto=format&fit=crop"
                alt="Editorial model wearing vintage streetwear"
                fill
                className="object-cover"
                sizes="(max-width: 1024px) 100vw, 600px"
              />
            </div>

            <div className="lg:col-span-6 space-y-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-olive-500 font-bold block mb-2">
                  OUR PHILOSOPHY
                </span>
                <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-charcoal">
                  INDIVIDUALITY OVER TREND HOMOGENEITY
                </h2>
              </div>

              <div className="space-y-4 text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">
                <p>
                  When you step into an average mall clothing store, tens of thousands of people across three continents are buying that exact same shirt on that exact same afternoon. It was manufactured with virgin synthetic blends destined for a dump within eighteen months.
                </p>
                <p>
                  At <strong>Second Story</strong>, every single item in our catalog is an individual piece of culture. Whether it’s a 1993 USA-made Levi’s 501, a broken-in Carhartt Detroit canvas jacket, or a Japanese silk camp shirt—each piece carries authentic fades, individual patina, and a pedigree that cannot be replicated.
                </p>
              </div>

              {/* 4 Pillars Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-charcoal/10">
                <div className="p-4 bg-soft-white border border-charcoal/10">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal mb-1">
                    Fashion Is Individual
                  </h4>
                  <p className="text-[11px] text-charcoal/70">
                    No matching fits at the gig. You wear pieces nobody else can buy on demand.
                  </p>
                </div>
                <div className="p-4 bg-soft-white border border-charcoal/10">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal mb-1">
                    Great Clothes Deserve Life
                  </h4>
                  <p className="text-[11px] text-charcoal/70">
                    Heritage cotton, real selvedge, and heavy brass zippers outlive disposable trends.
                  </p>
                </div>
                <div className="p-4 bg-soft-white border border-charcoal/10">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal mb-1">
                    Sustainable & Stylish
                  </h4>
                  <p className="text-[11px] text-charcoal/70">
                    You don’t have to sacrifice streetwear aesthetics to protect the planet.
                  </p>
                </div>
                <div className="p-4 bg-soft-white border border-charcoal/10">
                  <h4 className="font-mono font-bold text-xs uppercase tracking-wider text-charcoal mb-1">
                    Every Piece Has History
                  </h4>
                  <p className="text-[11px] text-charcoal/70">
                    Tour dates, wash wear, factory tags—authentic subcultural storytelling.
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Sustainable Impact Callout */}
      <section className="py-20 bg-charcoal text-cream border-b border-charcoal/20">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cream/10 border border-cream/20 text-xs font-mono uppercase tracking-widest text-olive">
            <Recycle className="w-3.5 h-3.5" />
            <span>Circularity in Motion</span>
          </div>

          <h2 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter">
            “THE MOST SUSTAINABLE GARMENT IS THE ONE ALREADY IN CIRCULATION.”
          </h2>

          <p className="text-xs sm:text-sm text-cream/70 max-w-xl mx-auto font-sans leading-relaxed">
            By choosing pre-loved and vintage streetwear, our community avoids millions of liters of virgin cotton irrigation, stops toxic textile dyes from entering waterways, and keeps iconic pieces alive.
          </p>

          <div className="pt-4">
            <Link
              href="/shop"
              className="inline-flex items-center space-x-2 px-8 py-4 bg-cream text-charcoal hover:bg-soft-white font-mono text-xs font-bold uppercase tracking-widest transition-colors shadow-2xl"
            >
              <span>Explore The Archive Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
