'use client';

import React from 'react';
import { FilterState, ProductCondition } from '@/types';
import { CATEGORIES } from '@/data/categories';
import { X, RotateCcw, SlidersHorizontal } from 'lucide-react';
import { formatINR } from '@/lib/utils';

interface ProductFiltersProps {
  filters: FilterState;
  onFilterChange: (newFilters: FilterState) => void;
  onReset: () => void;
  availableBrands: string[];
  availableSizes: string[];
  availableColors: string[];
  isMobileDrawer?: boolean;
  onCloseMobileDrawer?: () => void;
}

const CONDITIONS: ProductCondition[] = [
  'Brand New With Tags',
  'Like New',
  'Excellent',
  'Good',
  'Vintage',
];

export const ProductFilters: React.FC<ProductFiltersProps> = ({
  filters,
  onFilterChange,
  onReset,
  availableBrands,
  availableSizes,
  availableColors,
  isMobileDrawer = false,
  onCloseMobileDrawer,
}) => {
  const toggleArrayFilter = (key: 'size' | 'brand' | 'condition' | 'color', val: string) => {
    const current = filters[key];
    const exists = current.includes(val);
    const updated = exists ? current.filter((item) => item !== val) : [...current, val];
    onFilterChange({ ...filters, [key]: updated });
  };

  const handleCategoryChange = (slug: string) => {
    onFilterChange({
      ...filters,
      category: filters.category === slug ? '' : slug,
    });
  };

  const handleGenderChange = (gender: string) => {
    onFilterChange({
      ...filters,
      gender: filters.gender === gender ? '' : gender,
    });
  };

  const hasActiveFilters =
    filters.category !== '' ||
    filters.gender !== '' ||
    filters.size.length > 0 ||
    filters.brand.length > 0 ||
    filters.condition.length > 0 ||
    filters.color.length > 0 ||
    filters.minPrice > 0 ||
    filters.maxPrice < 15000 ||
    filters.searchQuery !== '';

  return (
    <div className={`space-y-6 ${isMobileDrawer ? 'p-6' : ''}`}>
      {/* Drawer Header on Mobile */}
      {isMobileDrawer && (
        <div className="flex items-center justify-between pb-4 border-b border-charcoal/10">
          <div className="flex items-center space-x-2">
            <SlidersHorizontal className="w-4 h-4 text-charcoal" />
            <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm">
              Filters & Refinements
            </h3>
          </div>
          <button
            onClick={onCloseMobileDrawer}
            className="p-1 text-charcoal/60 hover:text-charcoal"
            aria-label="Close filters"
          >
            <X className="w-5 h-5" />
          </button>
        </div>
      )}

      {/* Filter Reset & Active Count */}
      <div className="flex items-center justify-between pb-3 border-b border-charcoal/10">
        <span className="font-mono text-xs uppercase tracking-wider text-charcoal font-bold">
          Refine Results
        </span>
        {hasActiveFilters && (
          <button
            onClick={onReset}
            className="flex items-center space-x-1 text-[11px] font-mono text-vintage-brown hover:underline"
          >
            <RotateCcw className="w-3 h-3" />
            <span>Reset All</span>
          </button>
        )}
      </div>

      {/* Gender / Department Filter */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
          Department
        </h4>
        <div className="grid grid-cols-3 gap-1.5 font-mono text-xs">
          {['all', 'men', 'women'].map((g) => {
            const isSelected = g === 'all' ? filters.gender === '' : filters.gender === g;
            return (
              <button
                key={g}
                onClick={() => handleGenderChange(g === 'all' ? '' : g)}
                className={`py-1.5 px-2 text-center border uppercase transition-colors text-[11px] ${
                  isSelected
                    ? 'bg-charcoal text-cream border-charcoal font-bold'
                    : 'bg-soft-white text-charcoal border-charcoal/15 hover:border-charcoal'
                }`}
              >
                {g}
              </button>
            );
          })}
        </div>
      </div>

      {/* Category Filter */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
          Category
        </h4>
        <div className="space-y-1 max-h-48 overflow-y-auto pr-1">
          {CATEGORIES.map((cat) => {
            const isSelected = filters.category === cat.slug;
            return (
              <button
                key={cat.id}
                onClick={() => handleCategoryChange(cat.slug)}
                className={`w-full text-left px-2.5 py-1.5 text-xs font-mono flex items-center justify-between transition-colors ${
                  isSelected
                    ? 'bg-charcoal text-cream font-bold'
                    : 'text-charcoal/80 hover:bg-charcoal/5 hover:text-charcoal'
                }`}
              >
                <span>{cat.name}</span>
                <span className={`text-[10px] ${isSelected ? 'text-cream/70' : 'text-charcoal/40'}`}>
                  {cat.itemCount}
                </span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Condition Filter */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
          Garment Condition
        </h4>
        <div className="space-y-1.5">
          {CONDITIONS.map((cond) => {
            const checked = filters.condition.includes(cond);
            return (
              <label
                key={cond}
                className="flex items-center space-x-2 text-xs font-mono text-charcoal/80 hover:text-charcoal cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayFilter('condition', cond)}
                  className="rounded-none border-charcoal/30 text-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className={checked ? 'font-bold text-charcoal' : ''}>{cond}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Size Filter */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
          Size
        </h4>
        <div className="flex flex-wrap gap-1.5">
          {availableSizes.map((sz) => {
            const isSelected = filters.size.includes(sz);
            return (
              <button
                key={sz}
                onClick={() => toggleArrayFilter('size', sz)}
                className={`px-2.5 py-1 text-xs font-mono border transition-colors ${
                  isSelected
                    ? 'bg-charcoal text-cream border-charcoal font-bold'
                    : 'bg-soft-white text-charcoal border-charcoal/15 hover:border-charcoal'
                }`}
              >
                {sz}
              </button>
            );
          })}
        </div>
      </div>

      {/* Price Range Slider */}
      <div>
        <div className="flex justify-between items-center mb-2">
          <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal">
            Max Price
          </h4>
          <span className="font-mono text-xs font-bold text-vintage-brown">
            {formatINR(filters.maxPrice)}
          </span>
        </div>
        <input
          type="range"
          min="1000"
          max="15000"
          step="500"
          value={filters.maxPrice}
          onChange={(e) => onFilterChange({ ...filters, maxPrice: Number(e.target.value) })}
          className="w-full accent-charcoal cursor-pointer"
        />
        <div className="flex justify-between text-[10px] font-mono text-charcoal/50 mt-1">
          <span>₹1,000</span>
          <span>₹15,000+</span>
        </div>
      </div>

      {/* Brand Filter */}
      <div>
        <h4 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2.5">
          Brand / Archive Label
        </h4>
        <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
          {availableBrands.map((brand) => {
            const checked = filters.brand.includes(brand);
            return (
              <label
                key={brand}
                className="flex items-center space-x-2 text-xs font-mono text-charcoal/80 hover:text-charcoal cursor-pointer select-none"
              >
                <input
                  type="checkbox"
                  checked={checked}
                  onChange={() => toggleArrayFilter('brand', brand)}
                  className="rounded-none border-charcoal/30 text-charcoal focus:ring-0 focus:ring-offset-0 cursor-pointer"
                />
                <span className={checked ? 'font-bold text-charcoal' : ''}>{brand}</span>
              </label>
            );
          })}
        </div>
      </div>

      {/* Mobile Drawer Bottom Apply CTA */}
      {isMobileDrawer && (
        <div className="pt-4 border-t border-charcoal/10 sticky bottom-0 bg-cream">
          <button
            onClick={onCloseMobileDrawer}
            className="w-full py-3 bg-charcoal text-cream font-mono font-bold text-xs uppercase tracking-widest hover:bg-charcoal/90 transition-colors"
          >
            Show Matching Pieces
          </button>
        </div>
      )}
    </div>
  );
};
