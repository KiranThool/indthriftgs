'use client';

import React, { useState } from 'react';
import { Users, Mail, Phone, ShoppingBag, Search } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { formatINR } from '@/lib/utils';

export default function AdminCustomersPage() {
  const { orders } = useAuth();
  const [search, setSearch] = useState('');

  // Extract unique customers from orders and registered accounts
  const customersMap = new Map<string, {
    name: string;
    email: string;
    phone: string;
    totalOrders: number;
    totalSpent: number;
    lastOrderDate: string;
  }>();

  orders.forEach((ord) => {
    const key = ord.customer_email.toLowerCase();
    if (!customersMap.has(key)) {
      customersMap.set(key, {
        name: ord.customer_name,
        email: ord.customer_email,
        phone: ord.customer_phone || ord.shipping_address.phone,
        totalOrders: 1,
        totalSpent: ord.total_amount,
        lastOrderDate: ord.created_at,
      });
    } else {
      const existing = customersMap.get(key)!;
      existing.totalOrders += 1;
      existing.totalSpent += ord.total_amount;
      if (new Date(ord.created_at) > new Date(existing.lastOrderDate)) {
        existing.lastOrderDate = ord.created_at;
      }
    }
  });

  // Add demo sample collectors if list is small
  if (customersMap.size < 4) {
    customersMap.set('riya.k@example.com', {
      name: 'Riya Kapoor',
      email: 'riya.k@example.com',
      phone: '+91 98111 22334',
      totalOrders: 3,
      totalSpent: 14280,
      lastOrderDate: '2026-11-08T12:00:00Z',
    });
    customersMap.set('kabir.v@example.com', {
      name: 'Kabir Verma',
      email: 'kabir.v@example.com',
      phone: '+91 97222 33445',
      totalOrders: 2,
      totalSpent: 8780,
      lastOrderDate: '2026-11-12T16:20:00Z',
    });
  }

  const customersList = Array.from(customersMap.values()).filter(
    (c) =>
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-6 border-b border-charcoal/10">
        <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block mb-1">
          COMMUNITY & VIP ARCHIVE CLIENTS
        </span>
        <h1 className="font-display font-black text-3xl uppercase tracking-tight text-charcoal">
          REGISTERED CLIENT DIRECTORY ({customersList.length})
        </h1>
      </div>

      {/* Search Bar */}
      <div className="bg-soft-white border border-charcoal/15 p-4">
        <div className="relative">
          <Search className="w-4 h-4 text-charcoal/40 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Search collector by name or email..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs font-mono border border-charcoal/20 focus:outline-none focus:border-charcoal bg-cream/20"
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-soft-white border border-charcoal/15 shadow-sm overflow-x-auto">
        <table className="w-full text-left text-xs font-mono">
          <thead>
            <tr className="border-b border-charcoal/15 bg-charcoal/5 uppercase text-charcoal/70">
              <th className="p-3.5">Client Profile</th>
              <th className="p-3.5">Contact Details</th>
              <th className="p-3.5">Orders Placed</th>
              <th className="p-3.5">Lifetime Value</th>
              <th className="p-3.5">Last Activity</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-charcoal/10">
            {customersList.map((client) => (
              <tr key={client.email} className="hover:bg-cream/40 transition-colors">
                <td className="p-3.5">
                  <div className="flex items-center space-x-3">
                    <div className="w-8 h-8 rounded-full bg-charcoal text-cream font-bold flex items-center justify-center uppercase">
                      {client.name.charAt(0)}
                    </div>
                    <div>
                      <span className="font-bold text-charcoal text-sm block">{client.name}</span>
                      <span className="text-[10px] text-olive-500 font-semibold uppercase">
                        Verified Buyer
                      </span>
                    </div>
                  </div>
                </td>
                <td className="p-3.5">
                  <div className="text-charcoal/80 flex items-center gap-1.5">
                    <Mail className="w-3.5 h-3.5 text-charcoal/40" />
                    <span>{client.email}</span>
                  </div>
                  <div className="text-charcoal/60 text-[11px] flex items-center gap-1.5 mt-0.5">
                    <Phone className="w-3.5 h-3.5 text-charcoal/40" />
                    <span>{client.phone}</span>
                  </div>
                </td>
                <td className="p-3.5 font-bold">
                  {client.totalOrders} {client.totalOrders === 1 ? 'order' : 'orders'}
                </td>
                <td className="p-3.5 font-bold text-charcoal">
                  {formatINR(client.totalSpent)}
                </td>
                <td className="p-3.5 text-charcoal/60">
                  {new Date(client.lastOrderDate).toLocaleDateString('en-IN', {
                    dateStyle: 'medium',
                  })}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
