'use client';

import React, { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Image from 'next/image';
import Link from 'next/link';
import {
  Heart,
  ShoppingBag,
  Ruler,
  ShieldCheck,
  Truck,
  RotateCcw,
  Sparkles,
  ArrowRight,
  Check,
  AlertCircle,
  Share2,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';
import { formatINR, calculateDiscount, calculateSustainabilityImpact } from '@/lib/utils';
import { ConditionBadge } from '@/components/product/ConditionBadge';
import { SizeGuideModal } from '@/components/product/SizeGuideModal';
import { ProductCard } from '@/components/shop/ProductCard';

export default function ProductDetailPage() {
  const params = useParams();
  const router = useRouter();
  const slug = params?.slug as string;

  const { products, getProductBySlug } = useProducts();
  const { addToCart } = useCart();
  const { toggleWishlist, isInWishlist } = useWishlist();
  const { showToast } = useToast();

  const product = getProductBySlug(slug);

  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdding, setIsAdding] = useState(false);
  const [recentlyViewed, setRecentlyViewed] = useState<string[]>([]);

  // Track recently viewed products in localStorage
  useEffect(() => {
    if (product) {
      try {
        const stored = JSON.parse(localStorage.getItem('second_story_recently_viewed') || '[]');
        const updated = [product.id, ...stored.filter((id: string) => id !== product.id)].slice(0, 6);
        localStorage.setItem('second_story_recently_viewed', JSON.stringify(updated));
        setRecentlyViewed(updated);
      } catch (e) {}
    }
  }, [product]);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream text-center">
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal mb-4">
          Archive Piece Not Found
        </h2>
        <p className="text-xs text-charcoal/60 mb-6 max-w-sm">
          This piece may have already been claimed by another vintage collector or the URL is incorrect.
        </p>
        <Link
          href="/shop"
          className="px-6 py-3 bg-charcoal text-cream text-xs font-mono uppercase tracking-widest font-bold"
        >
          Return to Shop
        </Link>
      </div>
    );
  }

  const discount = calculateDiscount(product.original_price, product.price);
  const isWishlisted = isInWishlist(product.id);
  const isSoldOut = product.stock_quantity === 0;
  const isOneOfAKind = product.stock_quantity === 1;

  // Impact calculation for this specific garment
  const garmentImpact = calculateSustainabilityImpact(1);

  // Related products from same category or brand
  const relatedProducts = products
    .filter((p) => p.id !== product.id && (p.category_slug === product.category_slug || p.brand === product.brand))
    .slice(0, 4);

  // Recently viewed products
  const viewedProducts = products
    .filter((p) => p.id !== product.id && recentlyViewed.includes(p.id))
    .slice(0, 4);

  const handleAddToCart = () => {
    if (isSoldOut) {
      showToast('This unique thrift piece is sold out', 'error');
      return;
    }
    setIsAdding(true);
    const added = addToCart(product, product.size);
    if (added) {
      showToast(`Added "${product.name}" to your bag`, 'success');
    } else {
      showToast('Item is already in your bag (only 1 available)', 'error');
    }
    setTimeout(() => setIsAdding(false), 800);
  };

  const handleBuyNow = () => {
    if (isSoldOut) {
      showToast('This unique thrift piece is sold out', 'error');
      return;
    }
    const added = addToCart(product, product.size);
    if (added || true) {
      router.push('/checkout');
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${product.name} | SECOND STORY Vintage`,
          url: window.location.href,
        });
      } catch (e) {}
    } else {
      navigator.clipboard.writeText(window.location.href);
      showToast('Link copied to clipboard!', 'info');
    }
  };

  return (
    <div className="bg-cream min-h-screen py-8 sm:py-12 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Breadcrumb */}
        <div className="mb-6 flex items-center space-x-2 text-xs font-mono text-charcoal/60 uppercase tracking-widest">
          <Link href="/shop" className="hover:text-charcoal">
            Archive
          </Link>
          <span>/</span>
          <Link href={`/category/${product.category_slug}`} className="hover:text-charcoal">
            {product.category_name}
          </Link>
          <span>/</span>
          <span className="text-charcoal font-bold truncate max-w-xs">{product.brand}</span>
        </div>

        {/* Product Details Hero Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 pb-16 border-b border-charcoal/10">
          {/* Left Column: Image Gallery (7 Cols) */}
          <div className="lg:col-span-7 space-y-4">
            {/* Primary Main Image Frame */}
            <div className="relative aspect-[4/5] bg-light-grey border border-charcoal/15 overflow-hidden shadow-sm group">
              <Image
                src={product.images[activeImageIndex] || product.images[0]}
                alt={`${product.name} detail shot`}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center"
              />

              {/* Floating Badges */}
              <div className="absolute top-4 left-4 flex flex-col gap-2 z-10">
                <ConditionBadge condition={product.condition} size="md" />
                {isOneOfAKind && !isSoldOut && (
                  <span className="bg-charcoal text-cream text-[11px] font-mono px-3 py-1 uppercase tracking-wider font-semibold shadow-md">
                    1-of-1 Piece • Only 1 Available
                  </span>
                )}
                {isSoldOut && (
                  <span className="bg-red-950 text-red-100 text-xs font-mono px-3 py-1 uppercase tracking-wider font-bold">
                    Sold Out
                  </span>
                )}
              </div>

              {/* Quick Share */}
              <button
                onClick={handleShare}
                className="absolute top-4 right-4 p-2 bg-cream/80 hover:bg-cream text-charcoal rounded-full backdrop-blur-sm transition-colors"
                aria-label="Share product"
              >
                <Share2 className="w-4 h-4" />
              </button>
            </div>

            {/* Thumbnail Navigation */}
            {product.images.length > 1 && (
              <div className="grid grid-cols-4 sm:grid-cols-6 gap-3">
                {product.images.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveImageIndex(idx)}
                    className={`relative aspect-[3/4] border transition-all overflow-hidden bg-light-grey ${
                      activeImageIndex === idx
                        ? 'border-charcoal ring-2 ring-charcoal/20 scale-[1.02]'
                        : 'border-charcoal/15 opacity-70 hover:opacity-100'
                    }`}
                  >
                    <Image
                      src={img}
                      alt={`${product.name} thumbnail ${idx + 1}`}
                      fill
                      sizes="120px"
                      className="object-cover"
                    />
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Right Column: Product Info & Actions (5 Cols) */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
            <div className="space-y-4">
              {/* Brand and Season */}
              <div className="flex items-center justify-between font-mono text-xs text-charcoal/70 uppercase tracking-widest pb-2 border-b border-charcoal/10">
                <span className="font-bold text-charcoal">{product.brand}</span>
                <span>{product.gender.toUpperCase()} COLLECTION</span>
              </div>

              {/* Product Title */}
              <h1 className="font-display font-black text-2xl sm:text-3xl lg:text-4xl uppercase tracking-tighter text-charcoal leading-tight">
                {product.name}
              </h1>

              {/* Price & Discount Bar */}
              <div className="flex items-baseline space-x-3 pt-1">
                <span className="font-mono font-black text-2xl sm:text-3xl text-charcoal">
                  {formatINR(product.price)}
                </span>
                {product.original_price > product.price && (
                  <span className="font-mono text-sm sm:text-base text-charcoal/40 line-through">
                    {formatINR(product.original_price)}
                  </span>
                )}
                {discount > 0 && (
                  <span className="font-mono text-xs font-bold bg-olive/15 text-olive-500 px-2 py-0.5 uppercase tracking-wider">
                    Save {discount}%
                  </span>
                )}
              </div>

              {/* 1-of-1 Thrift Callout Banner */}
              <div className="p-3 bg-vintage-sand/50 border border-vintage-brown/30 flex items-center justify-between text-xs font-mono">
                <div className="flex items-center space-x-2 text-charcoal">
                  <Sparkles className="w-4 h-4 text-vintage-brown flex-shrink-0" />
                  <span>
                    <strong>Authentic Vintage Piece:</strong> Individually sourced and ready to ship.
                  </span>
                </div>
                {isOneOfAKind && (
                  <span className="text-vintage-rust font-bold uppercase tracking-wider whitespace-nowrap pl-2">
                    Only 1
                  </span>
                )}
              </div>

              {/* Sizing & Measurements Selection */}
              <div className="pt-2">
                <div className="flex items-center justify-between mb-2">
                  <span className="font-mono text-xs uppercase tracking-wider text-charcoal font-bold">
                    Garment Size: <span className="text-vintage-brown">{product.size}</span>
                  </span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center space-x-1 text-xs font-mono text-charcoal/70 hover:text-charcoal underline"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>Size & Measurement Guide</span>
                  </button>
                </div>

                <div className="flex items-center space-x-2">
                  <div className="px-4 py-2 border-2 border-charcoal bg-charcoal text-cream font-mono text-xs font-bold uppercase tracking-wider">
                    {product.size}
                  </div>
                  <span className="text-xs font-mono text-charcoal/60">
                    (Fits according to measurements below)
                  </span>
                </div>
              </div>

              {/* CTAs: Add to Bag, Buy Now, Wishlist */}
              <div className="space-y-2.5 pt-4">
                <div className="grid grid-cols-5 gap-2">
                  <button
                    onClick={handleAddToCart}
                    disabled={isSoldOut || isAdding}
                    className={`col-span-4 py-4 font-mono font-bold text-xs uppercase tracking-widest transition-all flex items-center justify-center space-x-2 shadow-xl ${
                      isSoldOut
                        ? 'bg-charcoal/20 text-charcoal/40 cursor-not-allowed'
                        : 'bg-charcoal text-cream hover:bg-charcoal/90'
                    }`}
                  >
                    {isAdding ? (
                      <>
                        <Check className="w-4 h-4 text-olive" />
                        <span>Added to Bag</span>
                      </>
                    ) : isSoldOut ? (
                      <span>Sold Out</span>
                    ) : (
                      <>
                        <ShoppingBag className="w-4 h-4" />
                        <span>Add to Bag • {formatINR(product.price)}</span>
                      </>
                    )}
                  </button>

                  <button
                    onClick={() => {
                      toggleWishlist(product);
                      showToast(isWishlisted ? 'Removed from wishlist' : 'Saved to wishlist', 'info');
                    }}
                    className={`col-span-1 border flex items-center justify-center transition-colors ${
                      isWishlisted
                        ? 'border-red-400 bg-red-50 text-red-500'
                        : 'border-charcoal/20 bg-soft-white text-charcoal hover:border-charcoal'
                    }`}
                    aria-label="Wishlist toggle"
                  >
                    <Heart className={`w-5 h-5 ${isWishlisted ? 'fill-current' : ''}`} />
                  </button>
                </div>

                {!isSoldOut && (
                  <button
                    onClick={handleBuyNow}
                    className="w-full py-3.5 bg-vintage-brown text-cream hover:bg-vintage-brown/90 font-mono font-bold text-xs uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
                  >
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Description */}
              <div className="pt-6 border-t border-charcoal/10">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2">
                  Archive Description & Story
                </h3>
                <p className="text-xs sm:text-sm text-charcoal/80 font-sans leading-relaxed">
                  {product.description}
                </p>
              </div>

              {/* Flat-Lay Exact Measurements Table */}
              <div className="pt-4 border-t border-charcoal/10">
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-2 flex items-center gap-1.5">
                  <Ruler className="w-3.5 h-3.5 text-vintage-brown" />
                  <span>Exact Flat-Lay Measurements</span>
                </h3>
                <div className="grid grid-cols-2 gap-2 text-xs font-mono bg-soft-white p-3 border border-charcoal/10">
                  {product.measurements.chest && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">PIT-TO-PIT (CHEST):</span>
                      <span className="text-charcoal font-bold">{product.measurements.chest}</span>
                    </div>
                  )}
                  {product.measurements.length && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">TOTAL LENGTH:</span>
                      <span className="text-charcoal font-bold">{product.measurements.length}</span>
                    </div>
                  )}
                  {product.measurements.waist && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">WAIST:</span>
                      <span className="text-charcoal font-bold">{product.measurements.waist}</span>
                    </div>
                  )}
                  {product.measurements.inseam && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">INSEAM:</span>
                      <span className="text-charcoal font-bold">{product.measurements.inseam}</span>
                    </div>
                  )}
                  {product.measurements.shoulders && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">SHOULDERS:</span>
                      <span className="text-charcoal font-bold">{product.measurements.shoulders}</span>
                    </div>
                  )}
                  {product.measurements.sleeve && (
                    <div>
                      <span className="text-charcoal/50 block text-[10px]">SLEEVE:</span>
                      <span className="text-charcoal font-bold">{product.measurements.sleeve}</span>
                    </div>
                  )}
                </div>
                {product.measurements.fitNotes && (
                  <p className="text-[11px] font-mono text-charcoal/60 mt-2">
                    Fit note: {product.measurements.fitNotes}
                  </p>
                )}
              </div>

              {/* Material & Garment Details */}
              <div className="pt-4 border-t border-charcoal/10 space-y-1.5 text-xs font-mono text-charcoal/70">
                <div>
                  <span className="font-bold text-charcoal">Material:</span> {product.material}
                </div>
                <div>
                  <span className="font-bold text-charcoal">Color:</span> {product.color}
                </div>
                <div>
                  <span className="font-bold text-charcoal">Condition Grade:</span> {product.condition}
                </div>
              </div>

              {/* Sustainability impact badge for buying this piece */}
              <div className="p-3 bg-olive/10 border border-olive/30 text-xs font-mono text-charcoal space-y-1">
                <span className="font-bold text-olive-500 uppercase tracking-wider block">
                  Your Impact with this garment
                </span>
                <p className="text-[11px] text-charcoal/70">
                  By rewearing this piece, you save ~{garmentImpact.waterSavedLiters.toLocaleString()}L of clean water and prevent {garmentImpact.wasteAvoidedKg}kg of textile waste from reaching landfills.
                </p>
              </div>

              {/* Shipping & Trust Guarantees */}
              <div className="grid grid-cols-2 gap-3 pt-4 border-t border-charcoal/10 text-[11px] font-mono text-charcoal/70">
                <div className="flex items-center space-x-2">
                  <Truck className="w-4 h-4 text-charcoal" />
                  <span>Free shipping above ₹1,999</span>
                </div>
                <div className="flex items-center space-x-2">
                  <ShieldCheck className="w-4 h-4 text-charcoal" />
                  <span>100% Verified Authentic</span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Related Products Section */}
        {relatedProducts.length > 0 && (
          <div className="pt-16 pb-12 border-b border-charcoal/10">
            <div className="flex justify-between items-end mb-8">
              <div>
                <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
                  CURATED RECOMMENDATIONS
                </span>
                <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-charcoal">
                  SIMILAR ARCHIVE PIECES
                </h2>
              </div>
              <Link
                href={`/category/${product.category_slug}`}
                className="text-xs font-mono uppercase tracking-wider text-charcoal hover:underline"
              >
                View Category
              </Link>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {relatedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}

        {/* Recently Viewed Section */}
        {viewedProducts.length > 0 && (
          <div className="pt-16">
            <h2 className="font-display font-black text-2xl uppercase tracking-tighter text-charcoal mb-8">
              RECENTLY VIEWED
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
              {viewedProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Sizing Modal */}
      <SizeGuideModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
}
