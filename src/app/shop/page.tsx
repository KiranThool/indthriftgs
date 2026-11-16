'use client';

import React, { useState, useMemo, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { FilterState, Product } from '@/types';
import { useProducts } from '@/context/ProductContext';
import { ProductCard } from '@/components/shop/ProductCard';
import { ProductFilters } from '@/components/shop/ProductFilters';
import { SlidersHorizontal, ArrowUpDown, X, Sparkles } from 'lucide-react';
import { AnimatePresence, motion } from 'framer-motion';

function ShopContent() {
  const searchParams = useSearchParams();
  const { products } = useProducts();

  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);

  // Initialize filters from query params if present
  const initialCategory = searchParams.get('category') || '';
  const initialGender = searchParams.get('gender') || '';
  const initialCondition = searchParams.get('condition') ? [searchParams.get('condition')!] : [];
  const initialSort = (searchParams.get('sort') as FilterState['sortBy']) || 'featured';
  const initialSearch = searchParams.get('q') || '';

  const [filters, setFilters] = useState<FilterState>({
    category: initialCategory,
    gender: initialGender,
    size: [],
    brand: [],
    condition: initialCondition,
    color: [],
    minPrice: 0,
    maxPrice: 15000,
    sortBy: initialSort,
    searchQuery: initialSearch,
  });

  // Keep filters in sync if URL search param changes
  useEffect(() => {
    const q = searchParams.get('q') || '';
    const cat = searchParams.get('category') || '';
    const gen = searchParams.get('gender') || '';
    const cond = searchParams.get('condition');
    const sortParam = (searchParams.get('sort') as FilterState['sortBy']) || 'featured';

    setFilters((prev) => ({
      ...prev,
      searchQuery: q,
      category: cat || prev.category,
      gender: gen || prev.gender,
      condition: cond ? [cond] : prev.condition,
      sortBy: sortParam,
    }));
  }, [searchParams]);

  // Extract available brands, sizes, colors from all products
  const availableBrands = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.brand))).sort();
  }, [products]);

  const availableSizes = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.size))).sort();
  }, [products]);

  const availableColors = useMemo(() => {
    return Array.from(new Set(products.map((p) => p.color))).sort();
  }, [products]);

  // Apply filtering and sorting
  const filteredProducts = useMemo(() => {
    let result = [...products];

    // Search query
    if (filters.searchQuery.trim()) {
      const q = filters.searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          p.brand.toLowerCase().includes(q) ||
          p.category_name.toLowerCase().includes(q) ||
          p.description.toLowerCase().includes(q) ||
          p.color.toLowerCase().includes(q)
      );
    }

    // Category
    if (filters.category) {
      result = result.filter((p) => p.category_slug === filters.category);
    }

    // Gender
    if (filters.gender) {
      result = result.filter((p) => p.gender === filters.gender || p.gender === 'unisex');
    }

    // Condition
    if (filters.condition.length > 0) {
      result = result.filter((p) => filters.condition.includes(p.condition));
    }

    // Size
    if (filters.size.length > 0) {
      result = result.filter((p) => filters.size.includes(p.size));
    }

    // Brand
    if (filters.brand.length > 0) {
      result = result.filter((p) => filters.brand.includes(p.brand));
    }

    // Price
    result = result.filter((p) => p.price <= filters.maxPrice && p.price >= filters.minPrice);

    // Sorting
    switch (filters.sortBy) {
      case 'price-low-high':
        result.sort((a, b) => a.price - b.price);
        break;
      case 'price-high-low':
        result.sort((a, b) => b.price - a.price);
        break;
      case 'newest':
        result.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime());
        break;
      case 'discount':
        result.sort((a, b) => {
          const discA = (a.original_price - a.price) / a.original_price;
          const discB = (b.original_price - b.price) / b.original_price;
          return discB - discA;
        });
        break;
      case 'featured':
      default:
        result.sort((a, b) => (b.is_featured ? 1 : 0) - (a.is_featured ? 1 : 0));
        break;
    }

    return result;
  }, [products, filters]);

  const handleResetFilters = () => {
    setFilters({
      category: '',
      gender: '',
      size: [],
      brand: [],
      condition: [],
      color: [],
      minPrice: 0,
      maxPrice: 15000,
      sortBy: 'featured',
      searchQuery: '',
    });
  };

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-12 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Top Header / Breadcrumb */}
        <div className="mb-8 pb-6 border-b border-charcoal/10">
          <div className="flex items-center space-x-2 text-xs font-mono text-charcoal/60 uppercase tracking-widest mb-2">
            <span>Archive Shop</span>
            <span>/</span>
            <span className="text-charcoal font-bold">
              {filters.category ? filters.category.replace('-', ' ') : 'All Collections'}
            </span>
            {filters.searchQuery && (
              <>
                <span>/</span>
                <span className="text-vintage-brown">“{filters.searchQuery}”</span>
              </>
            )}
          </div>

          <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
            <div>
              <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-charcoal">
                SHOP THE ARCHIVE
              </h1>
              <p className="text-xs sm:text-sm text-charcoal/70 font-sans mt-1">
                Authentic vintage grails, rare workwear, and one-of-a-kind streetwear fits.
              </p>
            </div>

            {/* Results count badge */}
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-charcoal bg-charcoal/5 px-3 py-1.5 self-start sm:self-auto border border-charcoal/10">
              {filteredProducts.length} {filteredProducts.length === 1 ? 'Piece Available' : 'Pieces Available'}
            </span>
          </div>
        </div>

        {/* Filter and Sort Toolbar */}
        <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-8 border-b border-charcoal/10 text-xs font-mono">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center space-x-2 px-4 py-2.5 bg-charcoal text-cream font-bold uppercase tracking-wider"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters ({filters.size.length + filters.condition.length + filters.brand.length + (filters.category ? 1 : 0)})</span>
          </button>

          {/* Active Filter Pills (Desktop & Mobile) */}
          <div className="flex flex-wrap items-center gap-2 flex-1">
            {filters.category && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-soft-white border border-charcoal/20 text-charcoal text-[11px] uppercase">
                <span>Cat: {filters.category}</span>
                <button onClick={() => setFilters({ ...filters, category: '' })}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {filters.gender && (
              <span className="inline-flex items-center space-x-1 px-2.5 py-1 bg-soft-white border border-charcoal/20 text-charcoal text-[11px] uppercase">
                <span>Dept: {filters.gender}</span>
                <button onClick={() => setFilters({ ...filters, gender: '' })}>
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            )}
            {filters.condition.map((c) => (
              <span
                key={c}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-soft-white border border-charcoal/20 text-charcoal text-[11px] uppercase"
              >
                <span>{c}</span>
                <button
                  onClick={() =>
                    setFilters({ ...filters, condition: filters.condition.filter((item) => item !== c) })
                  }
                >
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            ))}
            {filters.size.map((s) => (
              <span
                key={s}
                className="inline-flex items-center space-x-1 px-2.5 py-1 bg-soft-white border border-charcoal/20 text-charcoal text-[11px] uppercase"
              >
                <span>Size: {s}</span>
                <button
                  onClick={() =>
                    setFilters({ ...filters, size: filters.size.filter((item) => item !== s) })
                  }
                >
                  <X className="w-3 h-3 hover:text-red-500" />
                </button>
              </span>
            ))}
          </div>

          {/* Sort Dropdown */}
          <div className="flex items-center space-x-2 ml-auto">
            <span className="text-charcoal/60 uppercase tracking-wider text-[11px] hidden sm:inline">
              Sort by:
            </span>
            <div className="relative">
              <select
                value={filters.sortBy}
                onChange={(e) =>
                  setFilters({ ...filters, sortBy: e.target.value as FilterState['sortBy'] })
                }
                className="appearance-none bg-soft-white border border-charcoal/20 px-3 py-2 pr-8 text-xs font-mono uppercase tracking-wider text-charcoal focus:outline-none focus:border-charcoal cursor-pointer"
              >
                <option value="featured">Featured Grails</option>
                <option value="newest">Newest Drop First</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="discount">Biggest Discount %</option>
              </select>
              <ArrowUpDown className="w-3.5 h-3.5 text-charcoal/60 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
            </div>
          </div>
        </div>

        {/* Main Content Layout: Sidebar + Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Desktop Sidebar Filters */}
          <aside className="hidden lg:block lg:col-span-1">
            <div className="sticky top-24 bg-cream p-5 border border-charcoal/15 shadow-sm">
              <ProductFilters
                filters={filters}
                onFilterChange={setFilters}
                onReset={handleResetFilters}
                availableBrands={availableBrands}
                availableSizes={availableSizes}
                availableColors={availableColors}
              />
            </div>
          </aside>

          {/* Product Grid Area */}
          <main className="lg:col-span-3">
            {filteredProducts.length === 0 ? (
              <div className="py-20 px-6 text-center bg-soft-white border border-charcoal/10 space-y-4">
                <div className="w-14 h-14 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto text-charcoal/40">
                  <Sparkles className="w-6 h-6" />
                </div>
                <h3 className="font-display font-bold text-xl uppercase tracking-wider text-charcoal">
                  No matching vintage pieces found
                </h3>
                <p className="text-xs text-charcoal/60 max-w-md mx-auto font-sans leading-relaxed">
                  Try adjusting your filters, clearing your search keywords, or relaxing the price range.
                </p>
                <button
                  onClick={handleResetFilters}
                  className="px-6 py-2.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-colors"
                >
                  Clear All Filters
                </button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4 sm:gap-6">
                {filteredProducts.map((product, idx) => (
                  <ProductCard key={product.id} product={product} priority={idx < 4} />
                ))}
              </div>
            )}
          </main>
        </div>
      </div>

      {/* Mobile Filters Drawer */}
      <AnimatePresence>
        {isMobileFilterOpen && (
          <div className="fixed inset-0 z-50 overflow-hidden lg:hidden">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsMobileFilterOpen(false)}
              className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm"
            />
            <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
              <motion.div
                initial={{ x: '100%' }}
                animate={{ x: 0 }}
                exit={{ x: '100%' }}
                transition={{ type: 'spring', damping: 25, stiffness: 250 }}
                className="w-screen max-w-md bg-cream border-l border-charcoal/20 flex flex-col shadow-2xl overflow-y-auto"
              >
                <ProductFilters
                  filters={filters}
                  onFilterChange={setFilters}
                  onReset={handleResetFilters}
                  availableBrands={availableBrands}
                  availableSizes={availableSizes}
                  availableColors={availableColors}
                  isMobileDrawer
                  onCloseMobileDrawer={() => setIsMobileFilterOpen(false)}
                />
              </motion.div>
            </div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ShopPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-cream flex items-center justify-center p-8">
          <div className="font-mono text-xs uppercase tracking-widest text-charcoal animate-pulse">
            Loading Second Story Archive...
          </div>
        </div>
      }
    >
      <ShopContent />
    </Suspense>
  );
}
