'use client';

import React from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { CheckCircle2, ArrowRight, Package, Droplets, Recycle, Truck, ShieldCheck } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR, calculateSustainabilityImpact } from '@/lib/utils';

export default function OrderSuccessPage() {
  const params = useParams();
  const orderId = params?.id as string;
  const { orders } = useAuth();

  const order = orders.find((o) => o.id === orderId) || orders[0];

  const impact = order ? calculateSustainabilityImpact(order.items.length) : calculateSustainabilityImpact(1);

  return (
    <div className="bg-cream min-h-screen py-12 sm:py-20 border-b border-charcoal/10">
      <div className="max-w-3xl mx-auto px-4 sm:px-6">
        <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-10 shadow-xl space-y-8">
          {/* Header */}
          <div className="text-center space-y-3 pb-8 border-b border-charcoal/10">
            <div className="w-16 h-16 rounded-full bg-olive/15 text-olive flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8" />
            </div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown block font-bold">
              ORDER CONFIRMED & SECURED
            </span>
            <h1 className="font-display font-black text-3xl sm:text-4xl uppercase tracking-tight text-charcoal">
              YOUR FIT HAS FOUND ITS SECOND STORY.
            </h1>
            <p className="text-xs sm:text-sm text-charcoal/70 font-sans max-w-md mx-auto">
              Order confirmation and dispatch tracking details have been sent to{' '}
              <strong className="text-charcoal">{order?.customer_email || 'your email'}</strong>.
            </p>
          </div>

          {/* Environmental Impact of This Order */}
          <div className="p-5 bg-olive-50 border border-olive/30 space-y-3">
            <div className="flex items-center space-x-2 text-xs font-mono font-bold uppercase tracking-wider text-olive-600">
              <Recycle className="w-4 h-4 text-olive" />
              <span>Documented Environmental Impact of Your Choice</span>
            </div>
            <div className="grid grid-cols-2 gap-4 text-xs font-mono">
              <div className="p-3 bg-cream border border-olive/20">
                <span className="text-charcoal/60 block text-[10px] uppercase">Clean Water Saved</span>
                <span className="text-base font-bold text-charcoal">
                  ~{impact.waterSavedLiters.toLocaleString()} Liters
                </span>
              </div>
              <div className="p-3 bg-cream border border-olive/20">
                <span className="text-charcoal/60 block text-[10px] uppercase">Landfill Waste Avoided</span>
                <span className="text-base font-bold text-charcoal">
                  {impact.wasteAvoidedKg} kg
                </span>
              </div>
            </div>
          </div>

          {/* Order Metadata */}
          {order && (
            <div className="space-y-6">
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-cream/40 border border-charcoal/10 text-xs font-mono">
                <div>
                  <span className="text-charcoal/50 block text-[10px] uppercase">Order Number</span>
                  <span className="font-bold text-charcoal">{order.order_number}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block text-[10px] uppercase">Payment</span>
                  <span className="font-bold text-charcoal uppercase">
                    {order.payment_method} ({order.payment_status})
                  </span>
                </div>
                <div>
                  <span className="text-charcoal/50 block text-[10px] uppercase">Status</span>
                  <span className="font-bold text-olive-500 uppercase">{order.order_status}</span>
                </div>
                <div>
                  <span className="text-charcoal/50 block text-[10px] uppercase">Total Paid</span>
                  <span className="font-bold text-charcoal">{formatINR(order.total_amount)}</span>
                </div>
              </div>

              {/* Items Purchased */}
              <div>
                <h3 className="font-mono text-xs font-bold uppercase tracking-wider text-charcoal mb-3">
                  Purchased Archive Pieces ({order.items.length})
                </h3>
                <div className="divide-y divide-charcoal/10 border border-charcoal/10">
                  {order.items.map((item, idx) => (
                    <div key={idx} className="p-3 sm:p-4 flex items-center space-x-4 bg-cream/20">
                      <div className="relative w-14 h-16 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                        <Image
                          src={item.image}
                          alt={item.product_name}
                          fill
                          className="object-cover"
                          sizes="60px"
                        />
                      </div>
                      <div className="flex-1 min-w-0 text-xs font-mono">
                        <h4 className="font-bold text-charcoal truncate">{item.product_name}</h4>
                        <p className="text-charcoal/60 text-[11px] mt-0.5">
                          Size: {item.size} • Qty: {item.quantity} • {item.condition}
                        </p>
                      </div>
                      <div className="text-right text-xs font-mono font-bold text-charcoal">
                        {formatINR(item.price * item.quantity)}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Shipping Address */}
              <div className="p-4 bg-cream/30 border border-charcoal/10 text-xs font-mono text-charcoal/80 space-y-1">
                <span className="font-bold text-charcoal uppercase tracking-wider block mb-1">
                  Delivery Destination:
                </span>
                <p className="font-bold">{order.shipping_address.name}</p>
                <p>{order.shipping_address.street}</p>
                <p>
                  {order.shipping_address.city}, {order.shipping_address.state} - {order.shipping_address.postal_code}
                </p>
                <p>Phone: {order.shipping_address.phone}</p>
              </div>
            </div>
          )}

          {/* Action CTAs */}
          <div className="pt-4 flex flex-col sm:flex-row gap-4">
            <Link
              href="/shop"
              className="flex-1 py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest text-center transition-colors flex items-center justify-center space-x-2"
            >
              <span>Explore More Drops</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              href="/account"
              className="px-6 py-4 border border-charcoal text-charcoal hover:bg-charcoal hover:text-cream text-xs font-mono font-bold uppercase tracking-widest text-center transition-colors"
            >
              View Order History
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
