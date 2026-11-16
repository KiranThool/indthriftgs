'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ArrowRight, Instagram, CheckCircle2 } from 'lucide-react';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;
    setSubscribed(true);
    setEmail('');
  };

  return (
    <footer className="bg-charcoal text-cream pt-16 pb-12 border-t border-charcoal/20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-10 lg:gap-8 pb-12 border-b border-cream/10">
          {/* Brand Col */}
          <div className="lg:col-span-2 space-y-4">
            <Link href="/" className="inline-block">
              <span className="font-display font-black text-2xl tracking-tighter text-cream uppercase">
                SECOND STORY
              </span>
              <p className="font-mono text-xs text-cream/60 uppercase tracking-widest mt-1">
                “Pre-loved. Re-loved. Reworn.”
              </p>
            </Link>
            <p className="text-xs text-cream/70 max-w-sm leading-relaxed font-sans">
              An independent archive dedicated to sustainable vintage streetwear, rare workwear, and one-of-a-kind pre-loved fits. Giving iconic garments the next chapter they deserve.
            </p>
            <div className="flex items-center space-x-4 pt-2">
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream transition-colors"
                aria-label="Instagram"
              >
                <Instagram className="w-4 h-4" />
              </a>
              <a
                href="https://pinterest.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-9 h-9 border border-cream/20 flex items-center justify-center text-cream/80 hover:text-cream hover:border-cream transition-colors text-xs font-mono font-bold"
                aria-label="Pinterest"
              >
                P
              </a>
            </div>
          </div>

          {/* Shop Links */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-cream font-bold tracking-widest uppercase text-sm mb-4">
              Explore Drops
            </h4>
            <ul className="space-y-2.5 text-cream/70">
              <li>
                <Link href="/shop" className="hover:text-cream transition-colors">
                  Shop All Archive
                </Link>
              </li>
              <li>
                <Link href="/category/vintage-tees" className="hover:text-cream transition-colors">
                  Vintage Tees
                </Link>
              </li>
              <li>
                <Link href="/category/denim" className="hover:text-cream transition-colors">
                  Selvedge Denim
                </Link>
              </li>
              <li>
                <Link href="/category/jackets" className="hover:text-cream transition-colors">
                  Workwear Jackets
                </Link>
              </li>
              <li>
                <Link href="/category/streetwear" className="hover:text-cream transition-colors">
                  Streetwear Grails
                </Link>
              </li>
              <li>
                <Link href="/shop?condition=Vintage" className="hover:text-cream transition-colors">
                  True Vintage (80s/90s)
                </Link>
              </li>
            </ul>
          </div>

          {/* Customer Care */}
          <div className="space-y-3 font-mono text-xs">
            <h4 className="text-cream font-bold tracking-widest uppercase text-sm mb-4">
              Client Care
            </h4>
            <ul className="space-y-2.5 text-cream/70">
              <li>
                <Link href="/about" className="hover:text-cream transition-colors">
                  Our Philosophy
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-cream transition-colors">
                  Contact & Support
                </Link>
              </li>
              <li>
                <Link href="/contact#faq" className="hover:text-cream transition-colors">
                  Frequently Asked Questions
                </Link>
              </li>
              <li>
                <Link href="/contact#shipping" className="hover:text-cream transition-colors">
                  Shipping & Returns
                </Link>
              </li>
              <li>
                <Link href="/account" className="hover:text-cream transition-colors">
                  Track Your Order
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter inside footer */}
          <div className="space-y-3">
            <h4 className="text-cream font-mono font-bold tracking-widest uppercase text-sm mb-4">
              Drop Notifications
            </h4>
            <p className="text-xs text-cream/70 leading-relaxed font-sans">
              Rare thrift items sell out in minutes. Get notified 30 minutes before every weekly drop.
            </p>
            {subscribed ? (
              <div className="p-3 bg-olive/20 border border-olive/40 flex items-center space-x-2 text-xs font-mono text-olive-200">
                <CheckCircle2 className="w-4 h-4 text-olive flex-shrink-0" />
                <span>You're on the priority drop list!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="space-y-2">
                <div className="relative">
                  <input
                    type="email"
                    required
                    placeholder="Enter your email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full px-3.5 py-2.5 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 text-xs font-mono focus:outline-none focus:border-cream"
                  />
                  <button
                    type="submit"
                    aria-label="Subscribe"
                    className="absolute right-1 top-1 bottom-1 px-3 bg-cream text-charcoal hover:bg-cream/90 flex items-center justify-center transition-colors"
                  >
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>
                <span className="text-[10px] text-cream/50 font-mono block">
                  No fast fashion spam. Only rare drops.
                </span>
              </form>
            )}
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-xs font-mono text-cream/50 space-y-4 sm:space-y-0">
          <p>© {new Date().getFullYear()} SECOND STORY. All vintage pieces preserved with care.</p>
          <div className="flex space-x-6 text-[11px]">
            <Link href="/contact" className="hover:text-cream transition-colors">
              Privacy Policy
            </Link>
            <Link href="/contact" className="hover:text-cream transition-colors">
              Terms & Conditions
            </Link>
            <Link href="/contact" className="hover:text-cream transition-colors">
              Authenticity Guarantee
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
};
