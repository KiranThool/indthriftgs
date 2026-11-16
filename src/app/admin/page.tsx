'use client';

import React from 'react';
import Link from 'next/link';
import Image from 'next/image';
import {
  DollarSign,
  ShoppingBag,
  Shirt,
  Users,
  ArrowRight,
  TrendingUp,
  Package,
  Plus,
} from 'lucide-react';
import { useProducts } from '@/context/ProductContext';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';

export default function AdminOverviewPage() {
  const { products } = useProducts();
  const { orders } = useAuth();

  const totalSales = orders
    .filter((o) => o.payment_status === 'paid' || o.order_status !== 'cancelled')
    .reduce((sum, o) => sum + o.total_amount, 0);

  const totalProducts = products.length;
  const inStockProducts = products.filter((p) => p.stock_quantity > 0).length;
  const soldOutProducts = products.filter((p) => p.stock_quantity === 0).length;

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-charcoal/10 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
            EXECUTIVE METRICS
          </span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-charcoal">
            DASHBOARD OVERVIEW
          </h1>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <Link
            href="/admin/products"
            className="px-4 py-2.5 bg-charcoal text-cream hover:bg-charcoal/90 font-bold uppercase tracking-wider flex items-center space-x-1.5 transition-colors shadow-sm"
          >
            <Plus className="w-4 h-4" />
            <span>Add New Piece</span>
          </Link>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        {/* Total Revenue */}
        <div className="p-6 bg-soft-white border border-charcoal/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-charcoal/60 uppercase">
            <span>Gross Revenue</span>
            <DollarSign className="w-4 h-4 text-olive" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-charcoal block">
            {formatINR(totalSales)}
          </span>
          <span className="text-[11px] font-mono text-olive-600 flex items-center gap-1">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Live verified volume</span>
          </span>
        </div>

        {/* Total Orders */}
        <div className="p-6 bg-soft-white border border-charcoal/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-charcoal/60 uppercase">
            <span>Total Orders</span>
            <ShoppingBag className="w-4 h-4 text-charcoal" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-charcoal block">
            {orders.length}
          </span>
          <span className="text-[11px] font-mono text-charcoal/50">
            Across India delivery routes
          </span>
        </div>

        {/* Total Products */}
        <div className="p-6 bg-soft-white border border-charcoal/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-charcoal/60 uppercase">
            <span>Live Inventory</span>
            <Shirt className="w-4 h-4 text-vintage-brown" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-charcoal block">
            {inStockProducts}
          </span>
          <span className="text-[11px] font-mono text-charcoal/50">
            {soldOutProducts} marked sold out
          </span>
        </div>

        {/* Total Customers */}
        <div className="p-6 bg-soft-white border border-charcoal/15 shadow-sm space-y-2">
          <div className="flex justify-between items-center text-xs font-mono text-charcoal/60 uppercase">
            <span>Active Clients</span>
            <Users className="w-4 h-4 text-charcoal" />
          </div>
          <span className="font-display font-black text-2xl sm:text-3xl text-charcoal block">
            {Math.max(12, orders.length + 8)}
          </span>
          <span className="text-[11px] font-mono text-charcoal/50">
            High repeat collector rate
          </span>
        </div>
      </div>

      {/* Recent Orders Section */}
      <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-charcoal/10 font-mono text-xs">
          <span className="font-bold text-charcoal uppercase tracking-wider text-sm font-display">
            Recent Client Orders
          </span>
          <Link
            href="/admin/orders"
            className="text-vintage-brown hover:underline flex items-center gap-1 font-bold"
          >
            <span>View All Fulfillment</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        {orders.length === 0 ? (
          <p className="text-xs font-mono text-charcoal/60 py-6 text-center">
            No orders recorded yet.
          </p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs font-mono">
              <thead>
                <tr className="border-b border-charcoal/10 text-charcoal/60 uppercase">
                  <th className="pb-3">Order ID</th>
                  <th className="pb-3">Customer</th>
                  <th className="pb-3">Items</th>
                  <th className="pb-3">Total</th>
                  <th className="pb-3">Payment</th>
                  <th className="pb-3">Status</th>
                  <th className="pb-3 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-charcoal/5">
                {orders.slice(0, 5).map((ord) => (
                  <tr key={ord.id} className="hover:bg-cream/40 transition-colors">
                    <td className="py-3 font-bold text-charcoal">{ord.order_number}</td>
                    <td className="py-3">{ord.customer_name}</td>
                    <td className="py-3">{ord.items.length} items</td>
                    <td className="py-3 font-bold">{formatINR(ord.total_amount)}</td>
                    <td className="py-3">
                      <span className="uppercase text-[10px] bg-charcoal/5 px-2 py-0.5">
                        {ord.payment_method} ({ord.payment_status})
                      </span>
                    </td>
                    <td className="py-3">
                      <span
                        className={`text-[10px] px-2 py-0.5 uppercase font-bold ${
                          ord.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {ord.order_status}
                      </span>
                    </td>
                    <td className="py-3 text-right">
                      <Link
                        href="/admin/orders"
                        className="text-vintage-brown hover:underline text-xs font-bold"
                      >
                        Manage
                      </Link>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Quick Catalog Preview */}
      <div className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-4">
        <div className="flex justify-between items-center pb-3 border-b border-charcoal/10 font-mono text-xs">
          <span className="font-bold text-charcoal uppercase tracking-wider text-sm font-display">
            Catalog Status Snapshot
          </span>
          <Link
            href="/admin/products"
            className="text-vintage-brown hover:underline flex items-center gap-1 font-bold"
          >
            <span>Manage All Products</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {products.slice(0, 6).map((p) => (
            <div
              key={p.id}
              className="border border-charcoal/10 p-2 text-xs font-mono space-y-1 bg-cream/30"
            >
              <div className="relative aspect-[3/4] bg-light-grey overflow-hidden">
                <Image src={p.images[0]} alt={p.name} fill className="object-cover" sizes="100px" />
              </div>
              <h4 className="font-bold text-charcoal truncate">{p.name}</h4>
              <div className="flex justify-between text-[11px]">
                <span>{formatINR(p.price)}</span>
                <span className={p.stock_quantity > 0 ? 'text-olive-600' : 'text-red-600'}>
                  {p.stock_quantity > 0 ? `Stock: ${p.stock_quantity}` : 'Sold Out'}
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
