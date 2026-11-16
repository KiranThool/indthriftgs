'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { Heart, ShoppingBag, Trash2, ArrowRight } from 'lucide-react';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';
import { formatINR, calculateDiscount } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';

export default function WishlistPage() {
  const { wishlist, removeFromWishlist, moveToCart, clearWishlist } = useWishlist();
  const { showToast } = useToast();

  const handleMoveToCart = (product: any) => {
    if (product.stock_quantity === 0) {
      showToast('This unique thrift piece is sold out', 'error');
      return;
    }
    moveToCart(product);
    showToast(`Moved "${product.name}" to your bag`, 'success');
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-charcoal/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
              SAVED ARCHIVE GRAILS
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-charcoal">
              YOUR WISHLIST ({wishlist.length})
            </h1>
          </div>
          {wishlist.length > 0 && (
            <button
              onClick={clearWishlist}
              className="text-xs font-mono text-charcoal/60 hover:text-red-600 underline mt-2 sm:mt-0"
            >
              Clear Wishlist
            </button>
          )}
        </div>

        {wishlist.length === 0 ? (
          <div className="py-24 text-center bg-soft-white border border-charcoal/10 p-8 max-w-xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto text-charcoal/40">
              <Heart className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal">
              YOUR WISHLIST IS EMPTY
            </h2>
            <p className="text-xs text-charcoal/60 max-w-sm mx-auto font-sans leading-relaxed">
              Found a vintage piece you love? Tap the heart icon on any product card to save it here before another collector snatches it.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                <span>DISCOVER VINTAGE PIECES</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {wishlist.map((product) => {
              const discount = calculateDiscount(product.original_price, product.price);
              const isSoldOut = product.stock_quantity === 0;

              return (
                <div
                  key={product.id}
                  className="bg-cream/40 border border-charcoal/10 hover:border-charcoal flex flex-col justify-between transition-all duration-300 group"
                >
                  <div className="relative aspect-[3/4] bg-light-grey overflow-hidden">
                    <Link href={`/product/${product.slug}`} className="block relative w-full h-full">
                      <Image
                        src={product.images[0]}
                        alt={product.name}
                        fill
                        className="object-cover group-hover:scale-105 transition-transform duration-500"
                        sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                      />
                    </Link>

                    <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
                      <ConditionBadge condition={product.condition} size="sm" />
                      {product.stock_quantity === 1 && !isSoldOut && (
                        <span className="bg-charcoal text-cream text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-semibold">
                          1-of-1 Piece
                        </span>
                      )}
                      {isSoldOut && (
                        <span className="bg-red-950 text-red-100 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold">
                          Sold Out
                        </span>
                      )}
                    </div>

                    <button
                      onClick={() => removeFromWishlist(product.id)}
                      className="absolute top-2.5 right-2.5 p-1.5 bg-cream/90 hover:bg-cream text-charcoal/60 hover:text-red-500 rounded-full transition-colors"
                      title="Remove from wishlist"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>

                  <div className="p-4 flex flex-col flex-1 justify-between bg-cream/70">
                    <div>
                      <div className="flex justify-between items-center text-[11px] font-mono text-charcoal/60 uppercase mb-1">
                        <span>{product.brand}</span>
                        <span>Size {product.size}</span>
                      </div>
                      <Link
                        href={`/product/${product.slug}`}
                        className="font-sans font-bold text-sm text-charcoal hover:text-vintage-brown transition-colors line-clamp-1"
                      >
                        {product.name}
                      </Link>
                      <div className="flex items-baseline space-x-2 mt-2">
                        <span className="font-mono font-bold text-charcoal">
                          {formatINR(product.price)}
                        </span>
                        {product.original_price > product.price && (
                          <span className="font-mono text-xs text-charcoal/40 line-through">
                            {formatINR(product.original_price)}
                          </span>
                        )}
                        {discount > 0 && (
                          <span className="text-[10px] font-mono text-olive-500 font-bold bg-olive/10 px-1">
                            -{discount}%
                          </span>
                        )}
                      </div>
                    </div>

                    <div className="pt-4 mt-4 border-t border-charcoal/10">
                      <button
                        onClick={() => handleMoveToCart(product)}
                        disabled={isSoldOut}
                        className={`w-full py-2.5 font-mono text-xs uppercase tracking-wider font-bold flex items-center justify-center space-x-2 transition-colors ${
                          isSoldOut
                            ? 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                            : 'bg-charcoal text-cream hover:bg-charcoal/90'
                        }`}
                      >
                        <ShoppingBag className="w-3.5 h-3.5" />
                        <span>{isSoldOut ? 'Sold Out' : 'Move to Bag'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
