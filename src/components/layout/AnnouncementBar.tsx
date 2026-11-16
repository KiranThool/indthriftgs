'use client';

import React, { useState, useEffect } from 'react';
import { Sparkles, ArrowRight } from 'lucide-react';
import Link from 'next/link';

export const AnnouncementBar: React.FC = () => {
  const announcements = [
    '“A second life for your next favourite fit.”',
    'FREE SHIPPING ON ALL ORDERS OVER ₹1,999 ACROSS INDIA',
    'USE CODE FIRSTDROP FOR 15% OFF YOUR CURATED VINTAGE PIECE',
    'WEEKLY THRIFT DROP EVERY FRIDAY 8PM IST — RARE ARCHIVE PIECES',
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % announcements.length);
    }, 4500);
    return () => clearInterval(timer);
  }, [announcements.length]);

  return (
    <div className="bg-charcoal text-cream text-[11px] sm:text-xs py-2 px-4 border-b border-charcoal/20 select-none">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <div className="hidden md:flex items-center space-x-2 text-cream/60 font-mono text-[10px] tracking-wider uppercase">
          <Sparkles className="w-3 h-3 text-olive" />
          <span>Curated Sustainability</span>
        </div>

        <div className="flex-1 text-center font-mono font-medium tracking-wider uppercase truncate px-2">
          <span>{announcements[currentIndex]}</span>
        </div>

        <div className="hidden md:flex items-center space-x-3 text-[10px] font-mono tracking-wider">
          <Link
            href="/shop?sort=newest"
            className="text-cream/80 hover:text-cream underline flex items-center gap-1 group"
          >
            <span>VIEW DROP</span>
            <ArrowRight className="w-3 h-3 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </div>
  );
};
