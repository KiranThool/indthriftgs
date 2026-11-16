'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Trash2, ArrowRight, ShoppingBag, Tag, Sparkles, AlertCircle } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { formatINR } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartDrawerOpen,
    closeCartDrawer,
    removeFromCart,
    updateQuantity,
    subtotal,
    shippingFee,
    discountAmount,
    totalAmount,
    appliedCoupon,
    applyCoupon,
    removeCoupon,
  } = useCart();

  const [couponInput, setCouponInput] = useState('');
  const [couponFeedback, setCouponFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null);

  const freeShippingThreshold = 1999;
  const remainingForFreeShipping = Math.max(0, freeShippingThreshold - subtotal);
  const freeShippingProgress = Math.min(100, Math.round((subtotal / freeShippingThreshold) * 100));

  const handleApplyCoupon = (e: React.FormEvent) => {
    e.preventDefault();
    if (!couponInput.trim()) return;

    const res = applyCoupon(couponInput);
    if (res.success) {
      setCouponFeedback({ type: 'success', message: res.message });
      setCouponInput('');
    } else {
      setCouponFeedback({ type: 'error', message: res.message });
    }
  };

  return (
    <AnimatePresence>
      {isCartDrawerOpen && (
        <div className="fixed inset-0 z-50 overflow-hidden">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeCartDrawer}
            className="absolute inset-0 bg-charcoal/70 backdrop-blur-sm transition-opacity"
          />

          {/* Drawer Panel */}
          <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 28, stiffness: 280 }}
              className="w-screen max-w-md bg-cream border-l border-charcoal/15 flex flex-col shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-charcoal/10 flex items-center justify-between bg-cream">
                <div className="flex items-center space-x-2">
                  <ShoppingBag className="w-5 h-5 text-charcoal" />
                  <span className="font-display font-bold uppercase tracking-wider text-charcoal text-base">
                    Your Wardrobe Bag ({cart.reduce((sum, i) => sum + i.quantity, 0)})
                  </span>
                </div>
                <button
                  onClick={closeCartDrawer}
                  className="p-1.5 text-charcoal/60 hover:text-charcoal hover:bg-charcoal/5 rounded-none transition-colors"
                  aria-label="Close bag"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Free Shipping Progress Indicator */}
              <div className="px-5 py-3 bg-light-grey/60 border-b border-charcoal/10">
                <div className="flex justify-between items-center text-xs font-mono mb-1.5">
                  <span className="text-charcoal/80 flex items-center gap-1">
                    <Sparkles className="w-3.5 h-3.5 text-olive" />
                    {remainingForFreeShipping > 0 ? (
                      <>
                        Add <span className="font-bold text-charcoal">{formatINR(remainingForFreeShipping)}</span> more for <strong>FREE India Shipping</strong>
                      </>
                    ) : (
                      <span className="text-olive font-bold tracking-wider">🎉 YOU UNLOCKED FREE SHIPPING!</span>
                    )}
                  </span>
                  <span className="text-charcoal/60">{freeShippingProgress}%</span>
                </div>
                <div className="w-full h-1.5 bg-charcoal/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-olive transition-all duration-300"
                    style={{ width: `${freeShippingProgress}%` }}
                  />
                </div>
              </div>

              {/* Cart Items List */}
              <div className="flex-1 overflow-y-auto p-5 space-y-4">
                {cart.length === 0 ? (
                  <div className="h-full flex flex-col items-center justify-center text-center py-12">
                    <div className="w-16 h-16 rounded-full bg-charcoal/5 flex items-center justify-center mb-4">
                      <ShoppingBag className="w-8 h-8 text-charcoal/40" />
                    </div>
                    <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-lg mb-2">
                      Your bag is empty
                    </h3>
                    <p className="text-xs text-charcoal/60 max-w-xs mb-6 leading-relaxed">
                      Every piece at Second Story is one-of-a-kind. Don’t wait until another vintage lover claims your fit.
                    </p>
                    <Link
                      href="/shop"
                      onClick={closeCartDrawer}
                      className="px-6 py-3 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-bold uppercase tracking-widest transition-colors flex items-center space-x-2"
                    >
                      <span>Explore Vintage Drops</span>
                      <ArrowRight className="w-4 h-4" />
                    </Link>
                  </div>
                ) : (
                  cart.map((item) => {
                    const isOneOfAKind = item.product.stock_quantity === 1;
                    return (
                      <div
                        key={item.id}
                        className="flex space-x-3.5 p-3 bg-soft-white border border-charcoal/10 relative group"
                      >
                        {/* Image */}
                        <div className="relative w-20 h-24 bg-light-grey flex-shrink-0 overflow-hidden">
                          <Image
                            src={item.product.images[0] || 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?q=80&w=900'}
                            alt={item.product.name}
                            fill
                            className="object-cover"
                            sizes="80px"
                          />
                        </div>

                        {/* Details */}
                        <div className="flex-1 flex flex-col justify-between min-w-0">
                          <div>
                            <div className="flex justify-between items-start">
                              <h4 className="font-sans font-bold text-xs uppercase tracking-wide text-charcoal line-clamp-1 pr-4">
                                {item.product.name}
                              </h4>
                              <button
                                onClick={() => removeFromCart(item.id)}
                                className="text-charcoal/40 hover:text-red-600 transition-colors p-0.5"
                                title="Remove item"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>

                            <div className="flex items-center space-x-2 mt-1 text-[11px] text-charcoal/70">
                              <span className="font-mono bg-charcoal/5 px-1.5 py-0.5">Size: {item.selectedSize}</span>
                              <span className="font-mono text-charcoal/40">•</span>
                              <span className="font-mono text-charcoal/60">{item.product.brand}</span>
                            </div>

                            <div className="mt-1.5 flex items-center space-x-2">
                              <ConditionBadge condition={item.product.condition} size="sm" />
                              {isOneOfAKind && (
                                <span className="text-[10px] font-mono text-vintage-rust uppercase tracking-wider font-semibold">
                                  1-of-1 Piece
                                </span>
                              )}
                            </div>
                          </div>

                          <div className="flex justify-between items-end mt-2 pt-2 border-t border-charcoal/5">
                            {/* Quantity Controls */}
                            <div className="flex items-center border border-charcoal/20">
                              <button
                                onClick={() => updateQuantity(item.id, -1)}
                                className="px-2 py-0.5 text-xs text-charcoal hover:bg-charcoal/10"
                                aria-label="Decrease quantity"
                              >
                                -
                              </button>
                              <span className="px-2 py-0.5 text-xs font-mono font-medium text-charcoal">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQuantity(item.id, 1)}
                                disabled={item.quantity >= item.product.stock_quantity}
                                className={`px-2 py-0.5 text-xs text-charcoal hover:bg-charcoal/10 ${
                                  item.quantity >= item.product.stock_quantity ? 'opacity-30 cursor-not-allowed' : ''
                                }`}
                                aria-label="Increase quantity"
                              >
                                +
                              </button>
                            </div>

                            {/* Price */}
                            <div className="text-right">
                              <span className="text-xs font-bold text-charcoal font-mono">
                                {formatINR(item.product.price * item.quantity)}
                              </span>
                              {item.product.original_price && (
                                <span className="block text-[10px] text-charcoal/50 line-through font-mono">
                                  {formatINR(item.product.original_price * item.quantity)}
                                </span>
                              )}
                            </div>
                          </div>
                        </div>
                      </div>
                    );
                  })
                )}
              </div>

              {/* Drawer Footer with Checkout */}
              {cart.length > 0 && (
                <div className="p-5 bg-soft-white border-t border-charcoal/10 space-y-3">
                  {/* Coupon form */}
                  <form onSubmit={handleApplyCoupon} className="flex gap-2">
                    <div className="relative flex-1">
                      <Tag className="w-3.5 h-3.5 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
                      <input
                        type="text"
                        placeholder="Promo code (e.g. FIRSTDROP)"
                        value={couponInput}
                        onChange={(e) => setCouponInput(e.target.value)}
                        className="w-full pl-9 pr-3 py-2 text-xs border border-charcoal/20 focus:outline-none focus:border-charcoal bg-cream/30 uppercase font-mono"
                      />
                    </div>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal text-cream text-xs font-bold uppercase tracking-wider hover:bg-charcoal/90 transition-colors"
                    >
                      Apply
                    </button>
                  </form>

                  {/* Coupon feedback */}
                  {couponFeedback && (
                    <p
                      className={`text-[11px] ${
                        couponFeedback.type === 'success' ? 'text-olive-500 font-semibold' : 'text-red-600'
                      }`}
                    >
                      {couponFeedback.message}
                    </p>
                  )}

                  {appliedCoupon && (
                    <div className="flex justify-between items-center bg-olive/10 p-2 text-xs font-mono text-olive-500">
                      <span>Applied: {appliedCoupon.code} (-{appliedCoupon.discount_percentage}%)</span>
                      <button onClick={removeCoupon} className="text-charcoal/60 hover:text-charcoal underline text-[10px]">
                        Remove
                      </button>
                    </div>
                  )}

                  {/* Pricing summary */}
                  <div className="space-y-1.5 text-xs font-mono pt-2 border-t border-charcoal/10">
                    <div className="flex justify-between text-charcoal/70">
                      <span>Subtotal</span>
                      <span>{formatINR(subtotal)}</span>
                    </div>

                    {discountAmount > 0 && (
                      <div className="flex justify-between text-olive-500 font-semibold">
                        <span>Discount ({appliedCoupon?.code})</span>
                        <span>-{formatINR(discountAmount)}</span>
                      </div>
                    )}

                    <div className="flex justify-between text-charcoal/70">
                      <span>Shipping (India)</span>
                      <span>{shippingFee === 0 ? <strong className="text-olive">FREE</strong> : formatINR(shippingFee)}</span>
                    </div>

                    <div className="flex justify-between text-sm font-bold text-charcoal pt-2 border-t border-charcoal/20">
                      <span className="uppercase font-display tracking-wider">Total</span>
                      <span>{formatINR(totalAmount)}</span>
                    </div>
                  </div>

                  {/* Proceed to Checkout button */}
                  <Link
                    href="/checkout"
                    onClick={closeCartDrawer}
                    className="w-full py-3.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-bold uppercase tracking-widest text-center transition-all flex items-center justify-center space-x-2 group"
                  >
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>

                  <p className="text-[10px] text-center text-charcoal/50 font-mono">
                    Taxes calculated at checkout • 100% Verified Authentic Vintage
                  </p>
                </div>
              )}
            </motion.div>
          </div>
        </div>
      )}
    </AnimatePresence>
  );
};
