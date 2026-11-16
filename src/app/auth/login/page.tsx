'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { Lock, ArrowRight, ShieldCheck, User } from 'lucide-react';

export default function LoginPage() {
  const router = useRouter();
  const { login } = useAuth();
  const { showToast } = useToast();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setIsLoading(true);

    const res = await login(email, password);
    setIsLoading(false);

    if (res.success) {
      showToast('Welcome back to Second Story!', 'success');
      if (email.toLowerCase().includes('admin')) {
        router.push('/admin');
      } else {
        router.push('/account');
      }
    } else {
      setErrorMsg(res.error || 'Login failed. Please check credentials.');
    }
  };

  const handleDemoAdmin = () => {
    setEmail('admin@secondstory.com');
    setPassword('admin1234');
  };

  const handleDemoCustomer = () => {
    setEmail('aarav@example.com');
    setPassword('customer123');
  };

  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-soft-white border border-charcoal/15 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <span className="font-mono text-xs uppercase tracking-widest text-vintage-brown font-semibold block">
            CLIENT & ARCHIVE PORTAL
          </span>
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter text-charcoal">
            SIGN IN
          </h1>
          <p className="text-xs text-charcoal/60 font-sans">
            Access your order history, saved addresses, and wishlist grails.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs font-mono text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block uppercase text-charcoal/70 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="you@domain.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
            />
          </div>

          <div>
            <div className="flex justify-between items-center mb-1">
              <label className="uppercase text-charcoal/70">Password</label>
              <button
                type="button"
                onClick={() => showToast('Password reset instructions sent to your email.', 'info')}
                className="text-[11px] text-vintage-brown hover:underline"
              >
                Forgot Password?
              </button>
            </div>
            <input
              type="password"
              required
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
            />
          </div>

          <button
            type="submit"
            disabled={isLoading}
            className="w-full py-4 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-mono font-bold uppercase tracking-widest transition-all duration-200 flex items-center justify-center space-x-2 shadow-lg"
          >
            <span>{isLoading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Demo Fast Login Pills for Convenience */}
        <div className="pt-4 border-t border-charcoal/10 space-y-2">
          <span className="font-mono text-[10px] text-charcoal/50 uppercase tracking-widest block text-center">
            One-Click Demo Credentials:
          </span>
          <div className="grid grid-cols-2 gap-2 text-xs font-mono">
            <button
              type="button"
              onClick={handleDemoCustomer}
              className="p-2 border border-charcoal/15 bg-cream/40 hover:bg-cream text-charcoal text-center flex items-center justify-center space-x-1"
            >
              <User className="w-3.5 h-3.5 text-vintage-brown" />
              <span>Customer Demo</span>
            </button>
            <button
              type="button"
              onClick={handleDemoAdmin}
              className="p-2 border border-charcoal/15 bg-cream/40 hover:bg-cream text-charcoal text-center flex items-center justify-center space-x-1"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-olive" />
              <span>Admin Studio</span>
            </button>
          </div>
        </div>

        <div className="text-center text-xs font-mono text-charcoal/60 pt-2">
          New to Second Story?{' '}
          <Link href="/auth/signup" className="text-charcoal font-bold underline">
            Create an Account
          </Link>
        </div>
      </div>
    </div>
  );
}
