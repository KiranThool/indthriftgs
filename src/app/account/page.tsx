'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';
import {
  User,
  Package,
  MapPin,
  Heart,
  LogOut,
  ShieldCheck,
  ExternalLink,
  Plus,
  Clock,
  Truck,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { useWishlist } from '@/context/WishlistContext';
import { useToast } from '@/components/ui/Toast';
import { formatINR } from '@/lib/utils';
import { ShippingAddress } from '@/types';

export default function AccountPage() {
  const router = useRouter();
  const { user, logout, orders, saveAddress, isAdmin } = useAuth();
  const { wishlist } = useWishlist();
  const { showToast } = useToast();

  const [activeTab, setActiveTab] = useState<'orders' | 'addresses' | 'profile'>('orders');
  const [showAddressModal, setShowAddressModal] = useState(false);
  const [newAddress, setNewAddress] = useState<ShippingAddress>({
    name: user?.full_name || '',
    email: user?.email || '',
    phone: '',
    street: '',
    city: '',
    state: '',
    postal_code: '',
  });

  if (!user) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 bg-cream text-center">
        <div className="w-16 h-16 bg-charcoal/5 rounded-full flex items-center justify-center mb-4 text-charcoal/40">
          <User className="w-8 h-8" />
        </div>
        <h2 className="font-display font-black text-2xl uppercase tracking-wider text-charcoal mb-2">
          PLEASE SIGN IN TO VIEW YOUR ACCOUNT
        </h2>
        <p className="text-xs text-charcoal/60 mb-6 max-w-sm font-sans">
          Track your vintage shipments, manage saved shipping addresses, and access your exclusive wishlist.
        </p>
        <Link
          href="/auth/login"
          className="px-8 py-3.5 bg-charcoal text-cream text-xs font-mono uppercase tracking-widest font-bold"
        >
          Sign In to Your Account
        </Link>
      </div>
    );
  }

  const handleLogout = async () => {
    await logout();
    showToast('Signed out successfully', 'info');
    router.push('/');
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city || !newAddress.postal_code) {
      showToast('Please fill all address fields', 'error');
      return;
    }
    saveAddress(newAddress);
    setShowAddressModal(false);
    showToast('New address saved to your profile', 'success');
  };

  return (
    <div className="bg-cream min-h-screen py-10 sm:py-16 border-b border-charcoal/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Profile Header Bar */}
        <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-8 mb-8 shadow-sm flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="flex items-center space-x-4">
            <div className="w-14 h-14 bg-charcoal text-cream flex items-center justify-center font-display font-black text-xl uppercase">
              {user.full_name?.charAt(0) || 'U'}
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h1 className="font-display font-bold text-xl uppercase tracking-wide text-charcoal">
                  {user.full_name}
                </h1>
                {isAdmin && (
                  <span className="inline-flex items-center gap-1 bg-olive/20 text-olive-500 text-[10px] font-mono px-2 py-0.5 uppercase tracking-wider font-bold">
                    <ShieldCheck className="w-3 h-3 text-olive" />
                    Admin
                  </span>
                )}
              </div>
              <p className="font-mono text-xs text-charcoal/60 mt-0.5">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center space-x-3">
            {isAdmin && (
              <Link
                href="/admin"
                className="px-4 py-2.5 bg-olive text-cream text-xs font-mono font-bold uppercase tracking-wider hover:bg-olive/90 transition-colors flex items-center gap-1.5"
              >
                <ShieldCheck className="w-4 h-4" />
                <span>Admin Studio</span>
              </Link>
            )}
            <button
              onClick={handleLogout}
              className="px-4 py-2.5 border border-charcoal/20 text-charcoal hover:border-charcoal text-xs font-mono uppercase tracking-wider flex items-center space-x-1.5 transition-colors"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs */}
        <div className="flex border-b border-charcoal/10 mb-8 font-mono text-xs">
          <button
            onClick={() => setActiveTab('orders')}
            className={`py-3 px-5 uppercase tracking-wider font-bold transition-all relative ${
              activeTab === 'orders'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Orders & Shipments ({orders.length})
          </button>
          <button
            onClick={() => setActiveTab('addresses')}
            className={`py-3 px-5 uppercase tracking-wider font-bold transition-all relative ${
              activeTab === 'addresses'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Saved Addresses
          </button>
          <button
            onClick={() => setActiveTab('profile')}
            className={`py-3 px-5 uppercase tracking-wider font-bold transition-all relative ${
              activeTab === 'profile'
                ? 'text-charcoal border-b-2 border-charcoal'
                : 'text-charcoal/60 hover:text-charcoal'
            }`}
          >
            Profile Settings
          </button>
          <Link
            href="/wishlist"
            className="py-3 px-5 uppercase tracking-wider text-charcoal/60 hover:text-charcoal ml-auto hidden sm:flex items-center space-x-1"
          >
            <Heart className="w-3.5 h-3.5" />
            <span>Wishlist ({wishlist.length})</span>
          </Link>
        </div>

        {/* Tab 1: Orders */}
        {activeTab === 'orders' && (
          <div className="space-y-6">
            {orders.length === 0 ? (
              <div className="py-16 text-center bg-soft-white border border-charcoal/10 p-8 space-y-3">
                <Package className="w-10 h-10 text-charcoal/30 mx-auto" />
                <h3 className="font-display font-bold text-lg uppercase tracking-wider text-charcoal">
                  No orders placed yet
                </h3>
                <p className="text-xs text-charcoal/60 max-w-sm mx-auto font-sans">
                  Ready to discover your next favourite fit? Explore our authenticated vintage collection.
                </p>
                <Link
                  href="/shop"
                  className="inline-block px-6 py-2.5 bg-charcoal text-cream text-xs font-mono font-bold uppercase tracking-widest mt-2"
                >
                  Shop The Archive
                </Link>
              </div>
            ) : (
              orders.map((order) => (
                <div
                  key={order.id}
                  className="bg-soft-white border border-charcoal/15 p-6 shadow-sm space-y-4"
                >
                  {/* Order header row */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-4 border-b border-charcoal/10 gap-2 text-xs font-mono">
                    <div>
                      <span className="font-bold text-charcoal text-sm">{order.order_number}</span>
                      <span className="text-charcoal/50 ml-3">
                        Placed on {new Date(order.created_at).toLocaleDateString('en-IN', { dateStyle: 'medium' })}
                      </span>
                    </div>

                    <div className="flex items-center space-x-3">
                      <span
                        className={`px-2.5 py-1 uppercase tracking-wider font-bold text-[10px] ${
                          order.order_status === 'delivered'
                            ? 'bg-emerald-100 text-emerald-800'
                            : order.order_status === 'dispatched'
                            ? 'bg-blue-100 text-blue-800'
                            : 'bg-amber-100 text-amber-800'
                        }`}
                      >
                        {order.order_status}
                      </span>
                      <span className="font-bold text-charcoal">{formatINR(order.total_amount)}</span>
                    </div>
                  </div>

                  {/* Order Items */}
                  <div className="divide-y divide-charcoal/5">
                    {order.items.map((item, idx) => (
                      <div key={idx} className="py-3 flex items-center justify-between text-xs font-mono">
                        <div className="flex items-center space-x-3">
                          <div className="relative w-12 h-14 bg-light-grey flex-shrink-0 overflow-hidden border border-charcoal/10">
                            <Image
                              src={item.image}
                              alt={item.product_name}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                          </div>
                          <div>
                            <h4 className="font-bold text-charcoal">{item.product_name}</h4>
                            <p className="text-charcoal/60 text-[11px]">
                              Size: {item.size} • Qty: {item.quantity} • {item.condition}
                            </p>
                          </div>
                        </div>
                        <span className="font-bold text-charcoal">
                          {formatINR(item.price * item.quantity)}
                        </span>
                      </div>
                    ))}
                  </div>

                  {/* Order Footer & Tracking info */}
                  <div className="pt-3 border-t border-charcoal/10 flex flex-col sm:flex-row justify-between sm:items-center gap-2 text-xs font-mono text-charcoal/70">
                    <div className="flex items-center space-x-2">
                      <Truck className="w-4 h-4 text-olive" />
                      <span>
                        Tracking:{' '}
                        <strong>
                          {order.tracking_number || 'Preparing courier dispatch with BlueDart'}
                        </strong>
                      </span>
                    </div>

                    <div className="text-[11px]">
                      Destination: {order.shipping_address.city}, {order.shipping_address.state}
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* Tab 2: Saved Addresses */}
        {activeTab === 'addresses' && (
          <div className="space-y-6">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-base">
                Your Shipping Destinations
              </h3>
              <button
                onClick={() => setShowAddressModal(true)}
                className="px-4 py-2 bg-charcoal text-cream text-xs font-mono uppercase tracking-wider font-bold flex items-center space-x-1"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>Add Address</span>
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {(user.saved_addresses || []).map((addr, idx) => (
                <div
                  key={idx}
                  className="bg-soft-white border border-charcoal/15 p-5 relative shadow-sm text-xs font-mono space-y-1.5"
                >
                  <div className="flex justify-between items-start mb-2">
                    <span className="font-bold uppercase text-charcoal tracking-wider">
                      {addr.name}
                    </span>
                    <span className="text-[10px] bg-charcoal/5 px-2 py-0.5 uppercase">Saved</span>
                  </div>
                  <p className="text-charcoal/80">{addr.street}</p>
                  <p className="text-charcoal/80">
                    {addr.city}, {addr.state} - {addr.postal_code}
                  </p>
                  <p className="text-charcoal/60 pt-1">Phone: {addr.phone}</p>
                </div>
              ))}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
              <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-charcoal/70 backdrop-blur-sm">
                <form
                  onSubmit={handleAddAddress}
                  className="bg-cream border border-charcoal/20 max-w-md w-full p-6 shadow-2xl space-y-4 text-xs font-mono"
                >
                  <h3 className="font-display font-bold uppercase text-base text-charcoal">
                    Add New Address
                  </h3>
                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">Address Label</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Home, Studio, Office"
                      value={newAddress.name}
                      onChange={(e) => setNewAddress({ ...newAddress, name: e.target.value })}
                      className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">Street Address</label>
                    <input
                      type="text"
                      required
                      placeholder="Building, Street, Landmark"
                      value={newAddress.street}
                      onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                      className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-3">
                    <div>
                      <label className="block uppercase text-charcoal/70 mb-1">City</label>
                      <input
                        type="text"
                        required
                        placeholder="Mumbai"
                        value={newAddress.city}
                        onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                        className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                      />
                    </div>
                    <div>
                      <label className="block uppercase text-charcoal/70 mb-1">PIN Code</label>
                      <input
                        type="text"
                        required
                        placeholder="400050"
                        value={newAddress.postal_code}
                        onChange={(e) =>
                          setNewAddress({ ...newAddress, postal_code: e.target.value })
                        }
                        className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                      />
                    </div>
                  </div>
                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">State</label>
                    <input
                      type="text"
                      required
                      placeholder="Maharashtra"
                      value={newAddress.state}
                      onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                      className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                    />
                  </div>
                  <div>
                    <label className="block uppercase text-charcoal/70 mb-1">Phone</label>
                    <input
                      type="tel"
                      required
                      placeholder="+91 98765 43210"
                      value={newAddress.phone}
                      onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                      className="w-full p-2.5 border border-charcoal/20 bg-soft-white"
                    />
                  </div>
                  <div className="flex justify-end space-x-2 pt-2">
                    <button
                      type="button"
                      onClick={() => setShowAddressModal(false)}
                      className="px-4 py-2 border border-charcoal/20 text-charcoal"
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="px-4 py-2 bg-charcoal text-cream font-bold uppercase"
                    >
                      Save Address
                    </button>
                  </div>
                </form>
              </div>
            )}
          </div>
        )}

        {/* Tab 3: Profile Settings */}
        {activeTab === 'profile' && (
          <div className="bg-soft-white border border-charcoal/15 p-6 sm:p-8 max-w-xl space-y-4 text-xs font-mono">
            <h3 className="font-display font-bold uppercase tracking-wider text-charcoal text-base pb-3 border-b border-charcoal/10">
              Account Credentials & Preferences
            </h3>
            <div>
              <span className="text-charcoal/50 uppercase block text-[10px]">Full Name</span>
              <span className="font-bold text-charcoal text-sm">{user.full_name}</span>
            </div>
            <div>
              <span className="text-charcoal/50 uppercase block text-[10px]">Email Address</span>
              <span className="font-bold text-charcoal text-sm">{user.email}</span>
            </div>
            <div>
              <span className="text-charcoal/50 uppercase block text-[10px]">Role / Access Level</span>
              <span className="font-bold text-charcoal uppercase">{user.role}</span>
            </div>
            <div className="pt-4 border-t border-charcoal/10">
              <button
                onClick={() => showToast('Profile details updated', 'success')}
                className="px-5 py-2.5 bg-charcoal text-cream uppercase font-bold tracking-wider"
              >
                Update Profile
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
