'use client';

import React from 'react';
import { Sparkles, ShieldCheck, HeartHandshake, RefreshCw } from 'lucide-react';

export const WhySecondStory: React.FC = () => {
  const pillars = [
    {
      icon: RefreshCw,
      title: 'Circular Sustainability',
      desc: 'Extending the lifespan of existing garments is the single most powerful action in sustainable fashion. No fresh water depleted, no factory runoff.',
    },
    {
      icon: Sparkles,
      title: 'True One-Of-A-Kind Finds',
      desc: 'Nobody at the function will be wearing your fit. Each thrift drop features unique 80s/90s cuts, single-stitch grails, and rare subcultural pieces.',
    },
    {
      icon: ShieldCheck,
      title: 'Authenticated & Measured',
      desc: 'Every item is physically inspected for condition, washed, disinfected, and measured flat-lay down to the centimeter so you never guess your fit.',
    },
    {
      icon: HeartHandshake,
      title: 'Affordable Designer & Vintage',
      desc: 'Archive designer labels and heritage workwear (Carhartt, Levi’s, Nike, Stüssy) at 50% to 80% below original retail prices.',
    },
  ];

  return (
    <section className="py-20 bg-cream border-t border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown block mb-2 font-semibold">
            THE ARCHIVE MANIFESTO
          </span>
          <h2 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tighter text-charcoal">
            WHY SECOND STORY?
          </h2>
          <p className="text-xs sm:text-sm text-charcoal/70 mt-3 font-sans leading-relaxed">
            Fast fashion makes everyone dress alike. Vintage thrift celebrates who you actually are.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {pillars.map((item, idx) => {
            const Icon = item.icon;
            return (
              <div
                key={item.title}
                className="p-6 bg-soft-white border border-charcoal/10 hover:border-charcoal transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="w-10 h-10 bg-charcoal text-cream flex items-center justify-center mb-5 font-mono text-xs">
                    <Icon className="w-5 h-5 text-cream" />
                  </div>
                  <h3 className="font-display font-bold text-base uppercase tracking-wider text-charcoal mb-2">
                    {item.title}
                  </h3>
                  <p className="text-xs text-charcoal/70 leading-relaxed font-sans">
                    {item.desc}
                  </p>
                </div>
                <div className="pt-4 mt-6 border-t border-charcoal/5 font-mono text-[10px] text-charcoal/40 uppercase tracking-widest">
                  Pillar 0{idx + 1}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};
