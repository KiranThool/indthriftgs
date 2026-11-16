import React from 'react';
import Link from 'next/link';
import { ArrowRight, Compass } from 'lucide-react';

export default function NotFound() {
  return (
    <div className="bg-cream min-h-[75vh] flex items-center justify-center px-4 py-16">
      <div className="max-w-md w-full bg-soft-white border border-charcoal/15 p-8 sm:p-10 shadow-2xl text-center space-y-5">
        <div className="w-14 h-14 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto text-vintage-brown">
          <Compass className="w-7 h-7" />
        </div>

        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-bold block mb-1">
            ERROR 404 • ARCHIVE MISSING
          </span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter text-charcoal">
            PAGE NOT FOUND
          </h1>
          <p className="text-xs text-charcoal/70 font-sans mt-2 leading-relaxed">
            The vintage piece or collection page you are looking for has either moved to another shelf or does not exist.
          </p>
        </div>

        <div className="pt-2">
          <Link
            href="/shop"
            className="w-full py-3.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
          >
            <span>Return to Archive Shop</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </div>
  );
}
