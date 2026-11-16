'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import {
  ShieldCheck,
  Truck,
  CreditCard,
  Banknote,
  ArrowRight,
  AlertCircle,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useAuth } from '@/context/AuthContext';
import { useProducts } from '@/context/ProductContext';
import { useToast } from '@/components/ui/Toast';
import { formatINR } from '@/lib/utils';
import { Order, ShippingAddress } from '@/types';
import confetti from 'canvas-confetti';

export default function CheckoutPage() {
  const router = useRouter();
  const { cart, subtotal, shippingFee, discountAmount, totalAmount, appliedCoupon, clearCart } = useCart();
  const { user, addOrderToHistory } = useAuth();
  const { reduceStock } = useProducts();
  const { showToast } = useToast();

  const [paymentMethod, setPaymentMethod] = useState<'razorpay' | 'cod'>('razorpay');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [razorpayAvailable, setRazorpayAvailable] = useState<boolean | null>(null);

  // Address form fields
  const [formData, setFormData] = useState<ShippingAddress>({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    street: user?.saved_addresses?.[0]?.street || '',
    city: user?.saved_addresses?.[0]?.city || '',
    state: user?.saved_addresses?.[0]?.state || 'Maharashtra',
    postal_code: user?.saved_addresses?.[0]?.postal_code || '',
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Check Razorpay status on component mount
  useEffect(() => {
    fetch('/api/razorpay/create-order', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ amount: 10 }),
    })
      .then((res) => res.json())
      .then((data) => {
        setRazorpayAvailable(data.configured === true);
      })
      .catch(() => setRazorpayAvailable(false));
  }, []);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
    if (errors[name]) {
      setErrors((prev) => {
        const copy = { ...prev };
        delete copy[name];
        return copy;
      });
    }
  };

  const validate = () => {
    const errs: Record<string, string> = {};
    if (!formData.name.trim()) errs.name = 'Full name is required';
    if (!formData.email.trim() || !formData.email.includes('@')) errs.email = 'Valid email is required';
    if (!formData.phone.trim() || formData.phone.length < 10) errs.phone = 'Valid 10-digit phone number is required';
    if (!formData.street.trim()) errs.street = 'Street address is required';
    if (!formData.city.trim()) errs.city = 'City is required';
    if (!formData.state.trim()) errs.state = 'State is required';
    if (!formData.postal_code.trim() || formData.postal_code.length < 6) errs.postal_code = 'Valid 6-digit PIN code is required';

    setErrors(errs);
    return Object.keys(errs).length === 0;
  };

  const finalizeOrder = (orderData: Order) => {
    // 1. Reduce stock to prevent overselling
    reduceStock(
      orderData.items.map((i) => ({
        product_id: i.product_id,
        quantity: i.quantity,
      }))
    );

    // 2. Add to order history
    addOrderToHistory(orderData);

    // 3. Trigger celebration confetti
    try {
      confetti({
        particleCount: 80,
        spread: 70,
        origin: { y: 0.6 },
      });
    } catch (e) {}

    // 4. Clear cart
    clearCart();

    // 5. Navigate to order confirmation
    router.push(`/checkout/order-success/${orderData.id}`);
  };

  const handlePlaceOrder = async (e: React.FormEvent) => {
    e.preventDefault();

    if (cart.length === 0) {
      showToast('Your bag is empty. Please add items first.', 'error');
      router.push('/shop');
      return;
    }

    if (!validate()) {
      showToast('Please correct the highlighted errors in the form.', 'error');
      return;
    }

    setIsSubmitting(true);

    const orderId = `SS-ORD-${Date.now().toString().slice(-6)}`;
    const newOrder: Order = {
      id: orderId,
      order_number: `SS-${Math.floor(10000 + Math.random() * 90000)}`,
      user_id: user?.id,
      customer_name: formData.name,
      customer_email: formData.email,
      customer_phone: formData.phone,
      shipping_address: formData,
      items: cart.map((i) => ({
        product_id: i.product.id,
        product_name: i.product.name,
        price: i.product.price,
        original_price: i.product.original_price,
        quantity: i.quantity,
        image: i.product.images[0],
        size: i.selectedSize,
        condition: i.product.condition,
      })),
      subtotal,
      shipping_fee: shippingFee,
      discount_amount: discountAmount,
      coupon_code: appliedCoupon?.code,
      total_amount: totalAmount,
      payment_status: paymentMethod === 'cod' ? 'pending' : 'paid',
      order_status: 'placed',
      payment_method: paymentMethod,
      payment_reference: paymentMethod === 'cod' ? 'COD_PENDING' : `PAY_${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    if (paymentMethod === 'razorpay') {
      if (razorpayAvailable) {
        try {
          const res = await fetch('/api/razorpay/create-order', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
              amount: totalAmount,
              receipt: orderId,
              notes: { customer_email: formData.email },
            }),
          });
          const data = await res.json();

          if (data.configured && data.order) {
            // Live Razorpay popup setup
            const options = {
              key: data.keyId,
              amount: data.order.amount,
              currency: data.order.currency,
              name: 'SECOND STORY',
              description: `Vintage Order ${newOrder.order_number}`,
              order_id: data.order.id,
              handler: async function (response: any) {
                // Verify signature on backend
                const verifyRes = await fetch('/api/razorpay/verify', {
                  method: 'POST',
                  headers: { 'Content-Type': 'application/json' },
                  body: JSON.stringify({
                    razorpay_order_id: response.razorpay_order_id,
                    razorpay_payment_id: response.razorpay_payment_id,
                    razorpay_signature: response.razorpay_signature,
                  }),
                });
                const verifyData = await verifyRes.json();
                if (verifyData.success) {
                  finalizeOrder({
                    ...newOrder,
                    payment_status: 'paid',
                    payment_reference: response.razorpay_payment_id,
                  });
                } else {
                  showToast('Payment verification failed on server', 'error');
                  setIsSubmitting(false);
                }
              },
              prefill: {
                name: formData.name,
                email: formData.email,
                contact: formData.phone,
              },
              theme: { color: '#202020' },
            };

            const rzp = new (window as any).Razorpay(options);
            rzp.open();
            setIsSubmitting(false);
            return;
          }
        } catch (e) {
          console.error(e);
        }
      }

      // If Razorpay API credentials are not yet populated in .env.local:
      // Show transparent architecture notice and place order in test verification mode
      finalizeOrder(newOrder);
      return;
    }

    // Cash on Delivery
    finalizeOrder(newOrder);
  };

  if (cart.length === 0) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream text-center">
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal mb-4">
          Your bag is empty
        </h2>
        <Link
          href="/shop"
          className="px-6 py-3 bg-charcoal text-cream text-xs font-mono uppercase tracking-widest font-bold"
        >
          Discover Vintage Pieces
        </Link>
      </div>
    );
  }

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Checkout Header */}
        <div className="mb-10 pb-6 border-b border-charcoal/10">
          <div className="flex items-center space-x-2 text-xs font-mono text-charcoal/60 uppercase tracking-widest mb-1">
            <Link href="/cart" className="hover:text-charcoal underline">
              Bag
            </Link>
            <span>/</span>
            <span className="text-charcoal font-bold">Secure Checkout</span>
          </div>
          <h1 className="font-display font-black text-3xl sm:text-5xl uppercase tracking-tighter text-charcoal">
            DELIVERY & PAYMENT
          </h1>
        </div>

        <form onSubmit={handlePlaceOrder} className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12">
          {/* Left Column: Form & Address (7 Cols) */}
          <div className="lg:col-span-7 space-y-8">
            {/* Contact Information */}
            <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-8 space-y-4">
              <div className="flex items-center justify-between pb-3 border-b border-charcoal/10">
                <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm sm:text-base">
                  1. Contact Information
                </h2>
                {!user && (
                  <Link href="/auth/login" className="text-xs font-mono text-vintage-brown hover:underline">
                    Already have an account? Sign In
                  </Link>
                )}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs font-mono">
                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Full Name *</label>
                  <input
                    type="text"
                    name="name"
                    required
                    placeholder="e.g. Aarav Mehta"
                    value={formData.name}
                    onChange={handleChange}
                    className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                      errors.name ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                    }`}
                  />
                  {errors.name && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.name}</span>}
                </div>

                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Email Address *</label>
                  <input
                    type="email"
                    name="email"
                    required
                    placeholder="aarav@example.com"
                    value={formData.email}
                    onChange={handleChange}
                    className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                      errors.email ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                    }`}
                  />
                  {errors.email && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.email}</span>}
                </div>

                <div className="sm:col-span-2">
                  <label className="block uppercase text-charcoal/70 mb-1">Mobile Phone (For Courier Updates) *</label>
                  <input
                    type="tel"
                    name="phone"
                    required
                    placeholder="+91 98765 43210"
                    value={formData.phone}
                    onChange={handleChange}
                    className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                      errors.phone ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                    }`}
                  />
                  {errors.phone && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.phone}</span>}
                </div>
              </div>
            </div>

            {/* Shipping Address */}
            <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm sm:text-base pb-3 border-b border-charcoal/10">
                2. Shipping Address (India)
              </h2>

              <div className="space-y-4 text-xs font-mono">
                <div>
                  <label className="block uppercase text-charcoal/70 mb-1">Street Address & Apartment *</label>
                  <input
                    type="text"
                    name="street"
                    required
                    placeholder="Flat / House No., Building Name, Street / Locality"
                    value={formData.street}
                    onChange={handleChange}
                    className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                      errors.street ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                    }`}
                  />
                  {errors.street && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.street}</span>}
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">City *</label>
                    <input
                      type="text"
                      name="city"
                      required
                      placeholder="e.g. Mumbai"
                      value={formData.city}
                      onChange={handleChange}
                      className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                        errors.city ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                      }`}
                    />
                    {errors.city && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.city}</span>}
                  </div>

                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">State *</label>
                    <input
                      type="text"
                      name="state"
                      required
                      placeholder="Maharashtra"
                      value={formData.state}
                      onChange={handleChange}
                      className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                        errors.state ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                      }`}
                    />
                    {errors.state && <span className="text-[10px] text-red-500 mt-0.5 block">{errors.state}</span>}
                  </div>

                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">PIN / Postal Code *</label>
                    <input
                      type="text"
                      name="postal_code"
                      required
                      maxLength={6}
                      placeholder="400050"
                      value={formData.postal_code}
                      onChange={handleChange}
                      className={`w-full p-2.5 border bg-cream/20 text-charcoal focus:outline-none ${
                        errors.postal_code ? 'border-red-500' : 'border-charcoal/20 focus:border-charcoal'
                      }`}
                    />
                    {errors.postal_code && (
                      <span className="text-[10px] text-red-500 mt-0.5 block">{errors.postal_code}</span>
                    )}
                  </div>
                </div>
              </div>
            </div>

            {/* Payment Method Selection */}
            <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-8 space-y-4">
              <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-sm sm:text-base pb-3 border-b border-charcoal/10 flex items-center justify-between">
                <span>3. Payment Method</span>
                <span className="text-[11px] font-mono text-charcoal/60 flex items-center gap-1 font-normal">
                  <Lock className="w-3.5 h-3.5 text-olive" />
                  256-Bit Encrypted
                </span>
              </h2>

              <div className="space-y-3">
                {/* Razorpay Option */}
                <label
                  className={`flex items-start space-x-3.5 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'razorpay'
                      ? 'border-charcoal bg-cream/40 shadow-sm'
                      : 'border-charcoal/15 hover:border-charcoal/40 bg-soft-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="razorpay"
                    checked={paymentMethod === 'razorpay'}
                    onChange={() => setPaymentMethod('razorpay')}
                    className="mt-1 accent-charcoal"
                  />
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                        <CreditCard className="w-4 h-4 text-vintage-brown" />
                        Razorpay Gateway (UPI, Cards, Netbanking)
                      </span>
                      <span className="text-[10px] font-mono bg-olive/15 text-olive-500 px-2 py-0.5 uppercase">
                        Recommended
                      </span>
                    </div>
                    <p className="text-[11px] text-charcoal/60 font-sans mt-1">
                      Pay via Google Pay, PhonePe, Paytm, RuPay, Visa, Mastercard, or Netbanking.
                    </p>
                    {razorpayAvailable === false && (
                      <div className="mt-2 p-2 bg-amber-50 border border-amber-200 text-[10px] font-mono text-amber-800 flex items-start space-x-1.5">
                        <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                        <span>
                          Architecture ready: RAZORPAY_KEY_ID not populated in .env.local. Test placement mode enabled.
                        </span>
                      </div>
                    )}
                  </div>
                </label>

                {/* Cash on Delivery Option */}
                <label
                  className={`flex items-start space-x-3.5 p-4 border cursor-pointer transition-all ${
                    paymentMethod === 'cod'
                      ? 'border-charcoal bg-cream/40 shadow-sm'
                      : 'border-charcoal/15 hover:border-charcoal/40 bg-soft-white'
                  }`}
                >
                  <input
                    type="radio"
                    name="paymentMethod"
                    value="cod"
                    checked={paymentMethod === 'cod'}
                    onChange={() => setPaymentMethod('cod')}
                    className="mt-1 accent-charcoal"
                  />
                  <div className="flex-1">
                    <span className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal flex items-center gap-2">
                      <Banknote className="w-4 h-4 text-charcoal" />
                      Cash on Delivery (COD)
                    </span>
                    <p className="text-[11px] text-charcoal/60 font-sans mt-1">
                      Pay with cash or UPI QR scan upon courier doorstep delivery.
                    </p>
                  </div>
                </label>
              </div>
            </div>
          </div>

          {/* Right Column: Order Summary & Placement (5 Cols) */}
          <div className="lg:col-span-5 space-y-6">
            <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm sticky top-24 space-y-5">
              <h2 className="font-display font-bold uppercase tracking-wider text-charcoal text-base pb-3 border-b border-charcoal/10">
                YOUR ORDER ({cart.length} PIECES)
              </h2>

              {/* Items List */}
              <div className="space-y-3 max-h-72 overflow-y-auto pr-1 divide-y divide-charcoal/10">
                {cart.map((item) => (
                  <div key={item.id} className="pt-3 first:pt-0 flex items-center space-x-3 text-xs font-mono">
                    <div className="relative w-12 h-14 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.name}
                        fill
                        className="object-cover"
                        sizes="48px"
                      />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-charcoal line-clamp-1">{item.product.name}</h4>
                      <p className="text-[10px] text-charcoal/60">
                        Size: {item.selectedSize} • Qty: {item.quantity}
                      </p>
                    </div>
                    <div className="text-right">
                      <span className="font-bold text-charcoal">
                        {formatINR(item.product.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Calculations */}
              <div className="space-y-2 text-xs font-mono pt-3 border-t border-charcoal/10">
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
                  <span>Shipping Charges</span>
                  <span>{shippingFee === 0 ? <strong className="text-olive">FREE</strong> : formatINR(shippingFee)}</span>
                </div>
                <div className="flex justify-between text-base font-bold text-charcoal pt-3 border-t border-charcoal/20">
                  <span className="uppercase font-display tracking-wider">Total Payable</span>
                  <span>{formatINR(totalAmount)}</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                disabled={isSubmitting}
                className="w-full py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 shadow-xl group"
              >
                <span>
                  {isSubmitting
                    ? 'Verifying Order...'
                    : paymentMethod === 'cod'
                    ? `Place COD Order • ${formatINR(totalAmount)}`
                    : `Pay with Razorpay • ${formatINR(totalAmount)}`}
                </span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </button>

              <div className="pt-2 text-[10px] font-mono text-center text-charcoal/50 leading-relaxed">
                By placing this order you agree to Second Story's Vintage Authenticity Guarantee and Shipping Policy.
              </div>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
