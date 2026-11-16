'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import {
  ShoppingBag,
  Truck,
  CheckCircle2,
  AlertCircle,
  ExternalLink,
  Search,
  Filter,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Order } from '@/types';
import { formatINR } from '@/lib/utils';

export default function AdminOrdersPage() {
  const { orders, updateOrderStatusAdmin } = useAuth();
  const { showToast } = useToast();

  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [editingTrackingId, setEditingTrackingId] = useState<string | null>(null);
  const [trackingInputValue, setTrackingInputValue] = useState('');

  const handleStatusChange = (orderId: string, newStatus: Order['order_status']) => {
    updateOrderStatusAdmin(orderId, newStatus);
    showToast(`Order status updated to "${newStatus}"`, 'success');
  };

  const handleSaveTracking = (orderId: string) => {
    updateOrderStatusAdmin(orderId, undefined as any, trackingInputValue);
    setEditingTrackingId(null);
    showToast('Courier tracking number updated', 'success');
  };

  const filteredOrders = orders.filter((o) => {
    const matchesSearch =
      o.order_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      o.customer_email.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesStatus = statusFilter ? o.order_status === statusFilter : true;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-6 border-b border-charcoal/10 gap-4">
        <div>
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
            LOGISTICS & FULFILLMENT
          </span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tight text-charcoal">
            CLIENT ORDERS ({orders.length})
          </h1>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs">
          <span className="text-charcoal/60">
            Total Revenue: <strong className="text-charcoal">{formatINR(orders.reduce((sum, o) => sum + o.total_amount, 0))}</strong>
          </span>
        </div>
      </div>

      {/* Filter and Search */}
      <div className="bg-soft-white border border-charcoal/15 p-4 flex flex-col sm:flex-row items-center gap-3">
        <div className="relative flex-1 w-full">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search by order ID, customer name, email..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-charcoal/20 focus:outline-none focus:border-charcoal bg-cream/20"
          />
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="w-full sm:w-auto px-3 py-2 text-xs font-mono border border-charcoal/20 bg-cream/20 focus:outline-none"
        >
          <option value="">All Statuses</option>
          <option value="placed">Placed</option>
          <option value="processing">Processing</option>
          <option value="dispatched">Dispatched</option>
          <option value="delivered">Delivered</option>
          <option value="cancelled">Cancelled</option>
        </select>
      </div>

      {/* Orders List */}
      <div className="space-y-4">
        {filteredOrders.length === 0 ? (
          <div className="p-12 text-center bg-soft-white border border-charcoal/15 text-xs font-mono text-charcoal/60">
            No orders match the current filter.
          </div>
        ) : (
          filteredOrders.map((ord) => (
            <div
              key={ord.id}
              className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-4 font-mono text-xs"
            >
              {/* Order Meta Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-charcoal/10 gap-2">
                <div className="flex items-center space-x-3">
                  <span className="font-bold text-sm text-charcoal">{ord.order_number}</span>
                  <span className="text-charcoal/50">•</span>
                  <span className="text-charcoal/60">
                    {new Date(ord.created_at).toLocaleString('en-IN', {
                      dateStyle: 'medium',
                      timeStyle: 'short',
                    })}
                  </span>
                </div>

                <div className="flex items-center space-x-4">
                  {/* Status Dropdown */}
                  <div className="flex items-center space-x-2">
                    <span className="text-[10px] text-charcoal/60 uppercase">Status:</span>
                    <select
                      value={ord.order_status}
                      onChange={(e) =>
                        handleStatusChange(ord.id, e.target.value as Order['order_status'])
                      }
                      className="px-2 py-1 text-xs border border-charcoal/20 bg-cream font-bold uppercase focus:outline-none"
                    >
                      <option value="placed">Placed</option>
                      <option value="processing">Processing</option>
                      <option value="dispatched">Dispatched</option>
                      <option value="delivered">Delivered</option>
                      <option value="cancelled">Cancelled</option>
                    </select>
                  </div>

                  <span className="font-bold text-sm text-charcoal">
                    {formatINR(ord.total_amount)}
                  </span>
                </div>
              </div>

              {/* Order Items */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {ord.items.map((item, idx) => (
                  <div
                    key={idx}
                    className="p-2.5 bg-cream/30 border border-charcoal/10 flex items-center space-x-3"
                  >
                    <div className="relative w-12 h-14 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                      <Image src={item.image} alt={item.product_name} fill className="object-cover" sizes="48px" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h5 className="font-bold text-charcoal line-clamp-1">{item.product_name}</h5>
                      <p className="text-[10px] text-charcoal/60 mt-0.5">
                        Size: {item.size} • Qty: {item.quantity}
                      </p>
                      <span className="text-xs font-bold text-charcoal">
                        {formatINR(item.price * item.quantity)}
                      </span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Shipping Address and Payment Info */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-3 border-t border-charcoal/10 text-[11px] text-charcoal/80">
                <div className="space-y-1">
                  <span className="font-bold uppercase text-charcoal block">Customer Details:</span>
                  <p className="font-semibold text-charcoal">{ord.customer_name} ({ord.customer_email})</p>
                  <p>{ord.shipping_address.street}</p>
                  <p>
                    {ord.shipping_address.city}, {ord.shipping_address.state} - {ord.shipping_address.postal_code}
                  </p>
                  <p>Phone: {ord.shipping_address.phone}</p>
                </div>

                <div className="space-y-2">
                  <span className="font-bold uppercase text-charcoal block">Payment & Logistics:</span>
                  <p>
                    Method: <strong className="uppercase">{ord.payment_method}</strong> ({ord.payment_status})
                  </p>
                  <p className="text-charcoal/60">Ref: {ord.payment_reference || 'N/A'}</p>

                  {/* Tracking Edit */}
                  <div className="pt-1">
                    {editingTrackingId === ord.id ? (
                      <div className="flex gap-2">
                        <input
                          type="text"
                          placeholder="Courier AWB Tracking Number"
                          value={trackingInputValue}
                          onChange={(e) => setTrackingInputValue(e.target.value)}
                          className="flex-1 p-1 text-xs border border-charcoal/20 bg-cream"
                        />
                        <button
                          onClick={() => handleSaveTracking(ord.id)}
                          className="px-3 py-1 bg-charcoal text-cream text-[10px] uppercase font-bold"
                        >
                          Save
                        </button>
                        <button
                          onClick={() => setEditingTrackingId(null)}
                          className="px-2 py-1 border border-charcoal/20 text-[10px]"
                        >
                          Cancel
                        </button>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Truck className="w-3.5 h-3.5 text-olive" />
                        <span>Tracking: <strong>{ord.tracking_number || 'Pending'}</strong></span>
                        <button
                          onClick={() => {
                            setEditingTrackingId(ord.id);
                            setTrackingInputValue(ord.tracking_number || '');
                          }}
                          className="text-[10px] text-vintage-brown hover:underline font-bold"
                        >
                          Edit
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
