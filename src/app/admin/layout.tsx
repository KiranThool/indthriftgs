'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Shirt,
  ShoppingBag,
  Users,
  ArrowLeft,
  ShieldCheck,
  Sparkles,
  ExternalLink,
} from 'lucide-react';
import { useAuth } from '@/context/AuthContext';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, isAdmin, login } = useAuth();

  // If user is not logged in or not admin, show instant demo admin bypass / authentication screen
  if (!user || !isAdmin) {
    return (
      <div className="min-h-screen bg-charcoal text-cream flex items-center justify-center p-6">
        <div className="max-w-md w-full bg-charcoal-200 border border-cream/20 p-8 shadow-2xl space-y-6 text-center">
          <div className="w-14 h-14 bg-cream/10 rounded-full flex items-center justify-center mx-auto text-olive">
            <ShieldCheck className="w-7 h-7" />
          </div>
          <div>
            <span className="font-mono text-xs uppercase tracking-widest text-vintage-sand font-bold block mb-1">
              ROLE-BASED RESTRICTED ACCESS
            </span>
            <h1 className="font-display font-black text-2xl uppercase tracking-tighter text-cream">
              ADMIN STUDIO PORTAL
            </h1>
            <p className="text-xs text-cream/70 font-sans mt-2">
              This area is restricted to Second Story editorial directors & inventory managers.
            </p>
          </div>

          <div className="pt-2 space-y-3">
            <button
              onClick={() => login('admin@secondstory.com', 'admin1234')}
              className="w-full py-3.5 bg-cream text-charcoal hover:bg-soft-white font-mono text-xs font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2"
            >
              <Sparkles className="w-4 h-4 text-olive" />
              <span>Log In as Demo Director</span>
            </button>
            <Link
              href="/"
              className="block text-xs font-mono text-cream/50 hover:text-cream underline pt-2"
            >
              Return to Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  const adminNav = [
    { label: 'Overview', href: '/admin', icon: LayoutDashboard },
    { label: 'Product Catalog', href: '/admin/products', icon: Shirt },
    { label: 'Orders & Fulfillment', href: '/admin/orders', icon: ShoppingBag },
    { label: 'Customers', href: '/admin/customers', icon: Users },
  ];

  return (
    <div className="min-h-screen bg-cream flex flex-col md:flex-row">
      {/* Sidebar Navigation */}
      <aside className="w-full md:w-64 bg-charcoal text-cream border-r border-charcoal/20 flex flex-col justify-between p-6">
        <div className="space-y-8">
          <div>
            <div className="flex items-center space-x-2">
              <span className="font-display font-black text-lg tracking-tight uppercase text-cream">
                SECOND STORY
              </span>
              <span className="bg-olive/30 text-olive-300 font-mono text-[9px] px-1.5 py-0.5 uppercase tracking-wider font-bold">
                STUDIO
              </span>
            </div>
            <p className="font-mono text-[10px] text-cream/50 uppercase tracking-widest mt-0.5">
              Admin & Inventory Studio
            </p>
          </div>

          <nav className="space-y-1.5 font-mono text-xs">
            {adminNav.map((item) => {
              const Icon = item.icon;
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center space-x-3 px-3 py-2.5 transition-colors uppercase tracking-wider ${
                    isActive
                      ? 'bg-cream text-charcoal font-bold'
                      : 'text-cream/70 hover:bg-cream/10 hover:text-cream'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="pt-6 border-t border-cream/10 space-y-3 font-mono text-xs">
          <Link
            href="/"
            className="flex items-center space-x-2 text-cream/70 hover:text-cream transition-colors text-[11px] uppercase tracking-wider"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>View Live Storefront</span>
          </Link>
          <div className="p-2.5 bg-cream/5 border border-cream/10 text-[10px] text-cream/60">
            <span>Signed in as:</span>
            <strong className="block text-cream truncate">{user.email}</strong>
          </div>
        </div>
      </aside>

      {/* Main Content Pane */}
      <main className="flex-1 overflow-y-auto p-6 sm:p-10">{children}</main>
    </div>
  );
}
