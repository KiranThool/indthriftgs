'use client';

import React, { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Search, X, ArrowRight, Tag, Clock } from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { formatINR } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const POPULAR_SEARCHES = ['Carhartt Jacket', "Levi's 501", 'Nike Swoosh', 'Mohair Cardigan', 'Nirvana Tee', 'Arc\'teryx'];

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const router = useRouter();
  const { products } = useProducts();
  const [query, setQuery] = useState('');
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      setTimeout(() => inputRef.current?.focus(), 100);
      try {
        const saved = localStorage.getItem('second_story_recent_searches');
        if (saved) setRecentSearches(JSON.parse(saved));
      } catch (e) {}
    }
  }, [isOpen]);

  const saveRecentSearch = (term: string) => {
    try {
      const clean = term.trim();
      if (!clean) return;
      const updated = [clean, ...recentSearches.filter((s) => s.toLowerCase() !== clean.toLowerCase())].slice(0, 5);
      setRecentSearches(updated);
      localStorage.setItem('second_story_recent_searches', JSON.stringify(updated));
    } catch (e) {}
  };

  const filteredProducts = query.trim()
    ? products
        .filter(
          (p) =>
            p.name.toLowerCase().includes(query.toLowerCase()) ||
            p.brand.toLowerCase().includes(query.toLowerCase()) ||
            p.category_name.toLowerCase().includes(query.toLowerCase()) ||
            p.color.toLowerCase().includes(query.toLowerCase())
        )
        .slice(0, 6)
    : [];

  const handleSearchSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!query.trim()) return;
    saveRecentSearch(query);
    onClose();
    router.push(`/shop?q=${encodeURIComponent(query.trim())}`);
  };

  const handleTermClick = (term: string) => {
    saveRecentSearch(term);
    onClose();
    router.push(`/shop?q=${encodeURIComponent(term)}`);
  };

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 overflow-y-auto">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="fixed inset-0 bg-charcoal/80 backdrop-blur-md"
        />

        <div className="min-h-full flex flex-col items-center justify-start pt-16 sm:pt-24 px-4 pb-12 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -20, scale: 0.98 }}
            className="w-full max-w-3xl bg-cream border border-charcoal/20 shadow-2xl overflow-hidden"
          >
            {/* Input Bar */}
            <form
              onSubmit={handleSearchSubmit}
              className="relative flex items-center border-b border-charcoal/15 bg-soft-white p-4"
            >
              <Search className="w-5 h-5 text-charcoal/60 ml-2" />
              <input
                ref={inputRef}
                type="text"
                placeholder="Search vintage fits, brands, categories (e.g. Carhartt, Selvedge)..."
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                className="w-full px-4 py-2 text-base sm:text-lg bg-transparent text-charcoal placeholder-charcoal/40 focus:outline-none font-sans"
              />
              {query && (
                <button
                  type="button"
                  onClick={() => setQuery('')}
                  className="p-1 text-charcoal/40 hover:text-charcoal mr-2"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 text-xs font-mono uppercase tracking-wider text-charcoal/60 hover:text-charcoal border border-charcoal/20 hover:border-charcoal transition-colors"
              >
                ESC
              </button>
            </form>

            <div className="p-6 space-y-6 max-h-[65vh] overflow-y-auto">
              {/* If no query, show suggestions and recent */}
              {!query.trim() && (
                <>
                  {recentSearches.length > 0 && (
                    <div>
                      <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-charcoal/60 mb-3">
                        <Clock className="w-3.5 h-3.5" />
                        <span>Recent Searches</span>
                      </div>
                      <div className="flex flex-wrap gap-2">
                        {recentSearches.map((term) => (
                          <button
                            key={term}
                            onClick={() => handleTermClick(term)}
                            className="px-3 py-1.5 bg-soft-white border border-charcoal/15 text-xs text-charcoal hover:border-charcoal hover:bg-cream transition-colors font-mono"
                          >
                            {term}
                          </button>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <div className="flex items-center space-x-2 text-xs font-mono uppercase tracking-wider text-charcoal/60 mb-3">
                      <Tag className="w-3.5 h-3.5 text-vintage-brown" />
                      <span>Trending Grails & Keywords</span>
                    </div>
                    <div className="flex flex-wrap gap-2">
                      {POPULAR_SEARCHES.map((term) => (
                        <button
                          key={term}
                          onClick={() => handleTermClick(term)}
                          className="px-3 py-1.5 bg-soft-white border border-charcoal/15 text-xs text-charcoal hover:border-charcoal hover:bg-cream transition-colors font-mono"
                        >
                          {term}
                        </button>
                      ))}
                    </div>
                  </div>
                </>
              )}

              {/* Matching Live Results */}
              {query.trim() && (
                <div>
                  <div className="flex justify-between items-center mb-3 pb-2 border-b border-charcoal/10">
                    <span className="text-xs font-mono uppercase tracking-wider text-charcoal/70">
                      Matches for "{query}" ({filteredProducts.length})
                    </span>
                    {filteredProducts.length > 0 && (
                      <button
                        onClick={() => handleSearchSubmit()}
                        className="text-xs font-mono font-bold text-vintage-brown hover:underline flex items-center gap-1"
                      >
                        <span>View all in shop</span>
                        <ArrowRight className="w-3 h-3" />
                      </button>
                    )}
                  </div>

                  {filteredProducts.length === 0 ? (
                    <div className="py-10 text-center space-y-2">
                      <p className="font-display font-bold uppercase text-charcoal text-base">
                        No vintage pieces found for "{query}"
                      </p>
                      <p className="text-xs text-charcoal/60 max-w-sm mx-auto">
                        Thrift drops are constantly evolving. Try searching by broader terms like "Denim", "Jacket", "Tees", or check our Shop All page.
                      </p>
                    </div>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {filteredProducts.map((product) => (
                        <Link
                          key={product.id}
                          href={`/product/${product.slug}`}
                          onClick={onClose}
                          className="flex items-center space-x-3 p-2.5 bg-soft-white border border-charcoal/10 hover:border-charcoal transition-all group"
                        >
                          <div className="relative w-14 h-16 bg-light-grey flex-shrink-0 overflow-hidden">
                            <Image
                              src={product.images[0]}
                              alt={product.name}
                              fill
                              className="object-cover group-hover:scale-105 transition-transform duration-300"
                              sizes="60px"
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-charcoal line-clamp-1 group-hover:text-vintage-brown transition-colors">
                              {product.name}
                            </h4>
                            <p className="text-[11px] text-charcoal/60 font-mono mt-0.5">
                              {product.brand} • Size {product.size}
                            </p>
                            <div className="flex items-center space-x-2 mt-1">
                              <span className="text-xs font-mono font-bold text-charcoal">
                                {formatINR(product.price)}
                              </span>
                              <ConditionBadge condition={product.condition} size="sm" />
                            </div>
                          </div>
                        </Link>
                      ))}
                    </div>
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </AnimatePresence>
  );
};
