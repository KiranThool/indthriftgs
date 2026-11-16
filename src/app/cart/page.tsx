'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  Trash2,
  ArrowRight,
  ShoppingBag,
  Sparkles,
  Tag,
  ShieldCheck,
  Truck,
  RotateCcw,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';

export default function CartPage() {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    clearCart,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponCode, setCouponCode] = useState('');
  const [couponMessage, setCouponMessage] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponCode.trim()) return;
    const res = applyCoupon(couponCode);
    if (res.success) {
      setCouponMessage({ type: 'success', text: res.message });
      setCouponCode('');
    } else {
      setCouponMessage({ type: 'error', text: res.message });
    }
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between pb-6 mb-8 border-b border-charcoal/10">
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
              YOUR ARCHIVE SELECTION
            </span>
            <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-charcoal">
              SHOPPING BAG
            </h1>
          </div>
          {cart.length > 0 && (
            <button
              onClick={clearCart}
              className="text-xs font-mono text-charcoal/60 hover:text-red-600 underline mt-2 sm:mt-0"
            >
              Clear Entire Bag
            </button>
          )}
        </div>

        {cart.length === 0 ? (
          <div className="py-24 text-center bg-soft-white border border-charcoal/10 p-8 max-w-2xl mx-auto space-y-4">
            <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mx-auto text-charcoal/40">
              <ShoppingBag className="w-8 h-8" />
            </div>
            <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal">
              YOUR BAG IS CURRENTLY EMPTY
            </h2>
            <p className="text-xs sm:text-sm text-charcoal/70 max-w-sm mx-auto font-sans leading-relaxed">
              Every piece at Second Story is one-of-a-kind. When it's gone, it's gone. Discover our latest vintage and streetwear arrivals.
            </p>
            <div className="pt-2">
              <Link
                href="/shop"
                className="inline-flex items-center space-x-2 px-8 py-3.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-colors shadow-lg"
              >
                <span>EXPLORE ARCHIVE DROPS</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
            {/* Cart Items List (8 Cols) */}
            <div className="lg:col-span-8 space-y-4">
              {/* Free Shipping Tracker */}
              <div className="p-4 bg-soft-white border border-charcoal/10 space-y-2">
                <div className="flex justify-between items-center text-xs font-mono">
                  <span className="text-charcoal flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4 text-olive" />
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <span className="font-bold text-vintage-brown">{formatINR(remainingForFreeShipping)}</span> more for <strong>FREE India Shipping</strong>
                      </>
                    ) : (
                      <span className="text-olive font-bold tracking-wider">🎉 CONGRATS! YOU UNLOCKED FREE SHIPPING</span>
                    )}
                  </span>
                  <span className="text-charcoal/60">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-2 bg-charcoal/10 overflow-hidden">
                  <div
                    className="h-full bg-olive transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Items Table */}
              <div className="divide-y divide-charcoal/10 border border-charcoal/10 bg-soft-white">
                {cart.map((item) => {
                  const isOneOfAKind = item.product.stock_quantity === 1;
                  return (
                    <div key={item.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6">
                      {/* Image */}
                      <div className="relative w-24 h-32 sm:w-28 sm:h-36 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                        <Image
                          src={item.product.images[0]}
                          alt={item.product.name}
                          fill
                          className="object-cover"
                          sizes="120px"
                        />
                      </div>

                      {/* Content */}
                      <div className="flex-1 flex flex-col justify-between">
                        <div>
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="text-[11px] font-mono text-charcoal/60 uppercase tracking-widest block">
                                {item.product.brand}
                              </span>
                              <Link
                                href={`/product/${item.product.slug}`}
                                className="font-sans font-bold text-sm sm:text-base text-charcoal uppercase tracking-tight hover:text-vintage-brown transition-colors line-clamp-1"
                              >
                                {item.product.name}
                              </Link>
                            </div>
                            <button
                              onClick={() => removeFromCart(item.id)}
                              className="text-charcoal/40 hover:text-red-600 transition-colors p-1"
                              aria-label="Remove item"
                            >
                              <Trash2 className="w-4 h-4" />
                            </button>
                          </div>

                          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs font-mono text-charcoal/70">
                            <span className="bg-charcoal/5 px-2 py-0.5 border border-charcoal/10">
                              Size: <strong>{item.selectedSize}</strong>
                            </span>
                            <ConditionBadge condition={item.product.condition} size="sm" />
                            {isOneOfAKind && (
                              <span className="text-vintage-rust font-bold uppercase tracking-wider text-[11px]">
                                1-of-1 Piece
                              </span>
                            )}
                          </div>
                        </div>

                        {/* Quantity and Price */}
                        <div className="flex justify-between items-end pt-4 mt-4 border-t border-charcoal/5">
                          <div className="flex items-center space-x-3">
                            <span className="text-xs font-mono text-charcoal/60">Qty:</span>
                            <div className="flex items-center border border-charcoal/20">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2.5 py-1 text-xs text-charcoal hover:bg-charcoal/10"
                              >
                                -
                              </button>
                              <span className="px-3 py-1 text-xs font-mono font-bold text-charcoal">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                                className={`px-2.5 py-1 text-xs text-charcoal hover:bg-charcoal/10 ${
                                  item.quantity >= item.product.stock_quantity
                                    ? 'opacity-30 cursor-not-allowed'
                                    : ''
                                }`}
                              >
                                +
                              </button>
                            </div>
                            {item.quantity >= item.product.stock_quantity && (
                              <span className="text-[10px] font-mono text-charcoal/50">
                                (Max available stock reached)
                              </span>
                            )}
                          </div>

                          <div className="text-right">
                            <span className="text-base font-bold font-mono text-charcoal">
                              {formatINR(item.product.price * item.quantity)}
                            </span>
                            {item.product.original_price && (
                              <span className="block text-xs text-charcoal/40 line-through font-mono">
                                {formatINR(item.product.original_price * item.quantity)}
                              </span>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Continue Shopping Link */}
              <div className="pt-2 flex justify-between items-center text-xs font-mono">
                <Link
                  href="/shop"
                  className="text-charcoal hover:underline flex items-center space-x-1"
                >
                  <span>← Continue Exploring Drops</span>
                </Link>
                <span className="text-charcoal/60">
                  {cart.length} unique pieces in your selection
                </span>
              </div>
            </div>

            {/* Order Summary Box (4 Cols) */}
            <div className="lg:col-span-4 space-y-6">
              <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-5">
                <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-base pb-3 border-b border-charcoal/10">
                  ORDER SUMMARY
                </h2>

                {/* Promo Code Input */}
                <form onSubmit={handleApplyCoupon} className="space-y-2">
                  <div className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="PROMO CODE"
                        value={couponCode}
                        onChange={(e) => setCouponCode(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-charcoal/20 focus:outline-none focus:border-charcoal bg-cream/30 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal text-cream text-xs font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-colors"
                    >
                      Apply
                    </button>
                  </div>
                  {couponMessage && (
                    <p
                      className={`text-[11px] ${
                        couponMessage.type === 'success'
                          ? 'text-olive-500 font-semibold'
                          : 'text-red-600'
                      }`}
                    >
                      {couponMessage.text}
                    </p>
                  )}
                  {appliedCoupon && (
                    <div className="flex justify-between items-center bg-olive/10 p-2 text-xs font-mono text-olive-500">
                      <span>Applied: {appliedCoupon.code} (-{appliedCoupon.discount_percentage}%)</span>
                      <button
                        onClick={removeCoupon}
                        className="text-charcoal/60 hover:text-charcoal underline text-[10px]"
                      >
                        Remove
                      </button>
                    </div>
                  )}
                </form>

                {/* Price Calculations */}
                <div className="space-y-2.5 text-xs font-mono pt-3 border-t border-charcoal/10">
                  <div className="flex justify-between text-charcoal/80">
                    <span>Subtotal</span>
                    <span>{formatINR(subtotal)}</span>
                  </div>

                  {discountAmount > 0 && (
                    <div className="flex justify-between text-olive-500 font-semibold">
                      <span>Discount ({appliedCoupon?.code})</span>
                      <span>-{formatINR(discountAmount)}</span>
                    </div>
                  )}

                  <div className="flex justify-between text-charcoal/80">
                    <span>Estimated Shipping (India)</span>
                    <span>
                      {shippingFee === 0 ? (
                        <strong className="text-olive">FREE</strong>
                      ) : (
                        formatINR(shippingFee)
                      )}
                    </span>
                  </div>

                  <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-charcoal/20">
                    <span className="uppercase font-display tracking-wider">Estimated Total</span>
                    <span>{formatINR(totalAmount)}</span>
                  </div>
                </div>

                {/* Checkout CTA */}
                <Link
                  href="/checkout"
                  className="w-full py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center space-x-2 shadow-xl group"
                >
                  <span>Proceed to Checkout</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </Link>

                {/* Trust Badges */}
                <div className="pt-4 border-t border-charcoal/10 space-y-2 text-[11px] font-mono text-charcoal/60">
                  <div className="flex items-center space-x-2">
                    <ShieldCheck className="w-4 h-4 text-charcoal" />
                    <span>Safe & Encrypted 256-bit Checkout</span>
                  </div>
                  <div className="flex items-center space-x-2">
                    <Truck className="w-4 h-4 text-charcoal" />
                    <span>Dispatched in 24 hours with BlueDart</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
