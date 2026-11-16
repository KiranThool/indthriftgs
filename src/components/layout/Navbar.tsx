'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Search, ShoppingBag, Heart, User, Menu, X, ShieldCheck } from 'lucide-react';
import { useCart } from '@/context/CartContext';
import { useWishlist } from '@/context/WishlistContext';
import { useAuth } from '@/context/AuthContext';
import { SearchModal } from './SearchModal';

export const Navbar: React.FC = () => {
  const pathname = usePathname();
  const { totalItems, openCartDrawer } = useCart();
  const { wishlist } = useWishlist();
  const { user, isAdmin } = useAuth();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile menu on route changes
  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [pathname]);

  const navLinks = [
    { label: 'Shop All', href: '/shop' },
    { label: 'Men', href: '/shop?gender=men' },
    { label: 'Women', href: '/shop?gender=women' },
    { label: 'Vintage', href: '/shop?condition=Vintage' },
    { label: 'Streetwear', href: '/category/streetwear' },
    { label: 'Accessories', href: '/category/accessories' },
    { label: 'About', href: '/about' },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-40 w-full transition-all duration-200 ${
          isScrolled
            ? 'bg-cream/95 backdrop-blur-md shadow-sm border-b border-charcoal/10 py-3'
            : 'bg-cream border-b border-charcoal/10 py-4 sm:py-5'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between">
            {/* Mobile Hamburger */}
            <div className="flex items-center lg:hidden">
              <button
                onClick={() => setIsMobileMenuOpen((prev) => !prev)}
                className="p-1.5 text-charcoal hover:text-charcoal/70 transition-colors"
                aria-label="Toggle navigation menu"
              >
                {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
              </button>
            </div>

            {/* Brand Logo */}
            <div className="flex items-center">
              <Link href="/" className="group flex flex-col">
                <span className="font-display font-black text-xl sm:text-2xl tracking-tighter text-charcoal uppercase leading-none">
                  SECOND STORY
                </span>
                <span className="font-mono text-[9px] sm:text-[10px] tracking-widest text-charcoal/60 uppercase mt-0.5 group-hover:text-vintage-brown transition-colors">
                  Pre-loved. Re-loved. Reworn.
                </span>
              </Link>
            </div>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-7">
              {navLinks.map((link) => {
                const isActive = pathname === link.href || (link.href !== '/' && pathname.startsWith(link.href));
                return (
                  <Link
                    key={link.label}
                    href={link.href}
                    className={`text-xs font-mono uppercase tracking-wider transition-colors relative py-1 ${
                      isActive ? 'text-charcoal font-bold' : 'text-charcoal/70 hover:text-charcoal'
                    }`}
                  >
                    {link.label}
                    {isActive && (
                      <span className="absolute bottom-0 left-0 right-0 h-[2px] bg-charcoal" />
                    )}
                  </Link>
                );
              })}
            </nav>

            {/* Right Action Icons */}
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Search Icon */}
              <button
                onClick={() => setIsSearchOpen(true)}
                className="p-1.5 text-charcoal hover:text-vintage-brown transition-colors"
                aria-label="Search products"
              >
                <Search className="w-5 h-5" />
              </button>

              {/* Wishlist Icon */}
              <Link
                href="/wishlist"
                className="p-1.5 text-charcoal hover:text-vintage-brown transition-colors relative"
                aria-label="View wishlist"
              >
                <Heart className="w-5 h-5" />
                {wishlist.length > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-olive text-cream font-mono text-[10px] flex items-center justify-center font-bold">
                    {wishlist.length}
                  </span>
                )}
              </Link>

              {/* Account Icon */}
              <Link
                href={user ? '/account' : '/auth/login'}
                className="p-1.5 text-charcoal hover:text-vintage-brown transition-colors relative flex items-center gap-1.5"
                aria-label="Account"
                title={user ? `Signed in as ${user.full_name}` : 'Sign in'}
              >
                <User className="w-5 h-5" />
                {isAdmin && (
                  <span className="hidden xl:inline-flex items-center gap-1 text-[10px] font-mono bg-charcoal text-cream px-1.5 py-0.5 uppercase tracking-wider font-semibold">
                    <ShieldCheck className="w-3 h-3 text-olive" />
                    Admin
                  </span>
                )}
              </Link>

              {/* Admin Portal Direct Link for Admins */}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="hidden md:inline-flex text-[11px] font-mono uppercase tracking-wider px-2 py-1 bg-charcoal text-cream hover:bg-charcoal/90 transition-colors"
                >
                  Dashboard
                </Link>
              )}

              {/* Shopping Bag Icon */}
              <button
                onClick={openCartDrawer}
                className="p-1.5 text-charcoal hover:text-vintage-brown transition-colors relative flex items-center"
                aria-label="Open cart"
              >
                <ShoppingBag className="w-5 h-5" />
                {totalItems > 0 && (
                  <span className="absolute -top-0.5 -right-0.5 w-4 h-4 rounded-full bg-charcoal text-cream font-mono text-[10px] flex items-center justify-center font-bold">
                    {totalItems}
                  </span>
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Mobile Navigation Drawer */}
        {isMobileMenuOpen && (
          <div className="lg:hidden border-t border-charcoal/10 bg-cream mt-3 px-6 py-6 space-y-4 animate-fade-in shadow-lg">
            <nav className="flex flex-col space-y-3">
              {navLinks.map((link) => (
                <Link
                  key={link.label}
                  href={link.href}
                  className="text-sm font-mono uppercase tracking-wider text-charcoal py-1.5 border-b border-charcoal/5 hover:text-vintage-brown transition-colors"
                >
                  {link.label}
                </Link>
              ))}
              {isAdmin && (
                <Link
                  href="/admin"
                  className="text-sm font-mono uppercase tracking-wider text-olive-500 font-bold py-1.5 border-b border-charcoal/5 flex items-center gap-2"
                >
                  <ShieldCheck className="w-4 h-4" />
                  Admin Studio Dashboard
                </Link>
              )}
            </nav>
            <div className="pt-2 text-xs font-mono text-charcoal/60">
              <p>Tagline: "Pre-loved. Re-loved. Reworn."</p>
              <p className="mt-1">Hand-picked authentic vintage & streetwear.</p>
            </div>
          </div>
        )}
      </header>

      {/* Global Search Modal */}
      <SearchModal isOpen={isSearchOpen} onClose={() => setIsSearchOpen(false)} />
    </>
  );
};
