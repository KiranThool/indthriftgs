'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, Plus, Check } from 'lucide-react';
import { Product } from '@/types';
import { formatINR, calculateDiscount } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';

interface ProductCardProps {
  product: Product;
  priority?: boolean;
}

export const ProductCard: React.FC<ProductCardProps> = ({ product, priority = false }) => {
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const [isHovered, setIsHovered] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const discount = calculateDiscount(product.original_price, product.price);
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock_quantity === 0;

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (isSoldOut) {
      showToast('This unique thrift piece is sold out', 'error');
      return;
    }

    setIsAdding(true);
    const added = addToCart(product);

    if (added) {
      showToast(`Added "${product.name}" to your bag`, 'success');
    } else {
      showToast('Maximum available inventory already in your bag', 'error');
    }

    setTimeout(() => setIsAdding(false), 800);
  };

  const handleWishlistToggle = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product);
    if (!isWishlisted) {
      showToast(`Added to your saved wishlist`, 'success');
    } else {
      showToast(`Removed from wishlist`, 'info');
    }
  };

  return (
    <div
      className="group flex flex-col relative bg-cream/40 border border-charcoal/10 hover:border-charcoal transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Product Image Frame */}
      <Link href={`/product/${product.slug}`} className="block relative aspect-[3/4] overflow-hidden bg-light-grey">
        {/* Main image */}
        <Image
          src={product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900'}
          alt={product.name}
          fill
          priority={priority}
          sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
          className={`object-cover object-center transition-transform duration-700 ease-out group-hover:scale-105 ${
            isSoldOut ? 'grayscale opacity-60' : ''
          }`}
        />

        {/* Secondary image on hover if available */}
        {product.images[1] && (
          <Image
            src={product.images[1]}
            alt={`${product.name} alternate view`}
            fill
            sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
            className={`object-cover object-center absolute inset-0 transition-opacity duration-500 ease-in-out ${
              isHovered && !isSoldOut ? 'opacity-100' : 'opacity-0'
            }`}
          />
        )}

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col items-start gap-1.5 z-10">
          <ConditionBadge condition={product.condition} size="sm" />
          {product.stock_quantity === 1 && !isSoldOut && (
            <span className="bg-charcoal text-cream text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-semibold">
              1-of-1 Piece
            </span>
          )}
          {isSoldOut && (
            <span className="bg-red-950 text-red-200 text-[10px] font-mono px-2.5 py-0.5 uppercase tracking-widest font-bold">
              Sold Out
            </span>
          )}
        </div>

        {/* Wishlist Button */}
        <button
          onClick={handleWishlistToggle}
          className={`absolute top-2.5 right-2.5 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 backdrop-blur-sm ${
            isWishlisted
              ? 'bg-charcoal text-red-400'
              : 'bg-cream/80 text-charcoal hover:bg-cream hover:text-red-500'
          }`}
          aria-label={isWishlisted ? 'Remove from wishlist' : 'Add to wishlist'}
        >
          <Heart className={`w-4 h-4 ${isWishlisted ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Add Button Overlay (Desktop on Hover / Always accessible on mobile) */}
        {!isSoldOut && (
          <div className="absolute bottom-0 inset-x-0 p-3 bg-gradient-to-t from-charcoal/80 via-charcoal/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200 hidden sm:flex">
            <button
              onClick={handleQuickAdd}
              disabled={isAdding}
              className="w-full py-2.5 bg-cream text-charcoal hover:bg-soft-white text-xs font-mono font-bold uppercase tracking-widest flex items-center justify-center space-x-1.5 transition-colors shadow-lg"
            >
              {isAdding ? (
                <>
                  <Check className="w-4 h-4 text-olive" />
                  <span>Added</span>
                </>
              ) : (
                <>
                  <Plus className="w-4 h-4" />
                  <span>Quick Add</span>
                </>
              )}
            </button>
          </div>
        )}
      </Link>

      {/* Product Details Section */}
      <div className="p-4 flex flex-col flex-1 justify-between bg-cream/70">
        <div>
          {/* Brand & Size */}
          <div className="flex items-center justify-between text-[11px] font-mono text-charcoal/60 uppercase tracking-wider mb-1">
            <span className="font-semibold text-charcoal/80 truncate pr-2">{product.brand}</span>
            <span className="bg-charcoal/5 px-1.5 py-0.5 border border-charcoal/10 font-medium">
              Size {product.size}
            </span>
          </div>

          {/* Product Name */}
          <Link href={`/product/${product.slug}`} className="block group-hover:text-vintage-brown transition-colors">
            <h3 className="font-sans font-bold text-sm text-charcoal tracking-normal leading-snug line-clamp-2">
              {product.name}
            </h3>
          </Link>
        </div>

        {/* Pricing Row */}
        <div className="pt-3 mt-3 border-t border-charcoal/10 flex items-baseline justify-between">
          <div className="flex items-baseline space-x-2">
            <span className="text-sm sm:text-base font-bold font-mono text-charcoal">
              {formatINR(product.price)}
            </span>
            {product.original_price > product.price && (
              <span className="text-xs text-charcoal/40 line-through font-mono">
                {formatINR(product.original_price)}
              </span>
            )}
          </div>

          {discount > 0 && (
            <span className="text-[11px] font-mono font-bold text-olive-500 bg-olive/10 px-1.5 py-0.5">
              -{discount}%
            </span>
          )}
        </div>

        {/* Mobile Quick Add Button */}
        {!isSoldOut && (
          <button
            onClick={handleQuickAdd}
            disabled={isAdding}
            className="sm:hidden mt-3 w-full py-2 bg-charcoal text-cream text-[11px] font-mono font-bold uppercase tracking-wider flex items-center justify-center space-x-1"
          >
            {isAdding ? <Check className="w-3.5 h-3.5" /> : <Plus className="w-3.5 h-3.5" />}
            <span>{isAdding ? 'Added' : 'Add to Bag'}</span>
          </button>
        )}
      </div>
    </div>
  );
};
