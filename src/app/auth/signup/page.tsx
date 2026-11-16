'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/context/AuthContext';
import { useToast } from '@/components/ui/Toast';
import { ArrowRight, Sparkles } from 'lucide-react';

export default function SignupPage() {
  const router = useRouter();
  const { signup } = useAuth();
  const { showToast } = useToast();

  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');

    if (password.length < 6) {
      setErrorMsg('Password must be at least 6 characters');
      return;
    }

    setIsLoading(true);
    const res = await signup(email, password, fullName);
    setIsLoading(false);

    if (res.success) {
      showToast('Account created successfully! Welcome to Second Story.', 'success');
      router.push('/account');
    } else {
      setErrorMsg(res.error || 'Registration failed');
    }
  };

  return (
    <div className="bg-cream min-h-screen py-16 sm:py-24 flex items-center justify-center px-4 sm:px-6">
      <div className="max-w-md w-full bg-soft-white border border-charcoal/15 p-8 sm:p-10 shadow-2xl space-y-6">
        <div className="text-center space-y-2">
          <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 bg-olive/15 text-olive-600 font-mono text-[10px] uppercase tracking-widest">
            <Sparkles className="w-3 h-3 text-olive" />
            <span>Join the Archive</span>
          </div>
          <h1 className="font-display font-black text-3xl uppercase tracking-tighter text-charcoal">
            CREATE ACCOUNT
          </h1>
          <p className="text-xs text-charcoal/60 font-sans">
            Get early drop alerts, save fits to your wishlist, and track orders.
          </p>
        </div>

        {errorMsg && (
          <div className="p-3 bg-red-50 border border-red-200 text-xs font-mono text-red-700">
            {errorMsg}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-4 text-xs font-mono">
          <div>
            <label className="block uppercase text-charcoal/70 mb-1">Full Name</label>
            <input
              type="text"
              required
              placeholder="e.g. Diya Sharma"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
            />
          </div>

          <div>
            <label className="block uppercase text-charcoal/70 mb-1">Email Address</label>
            <input
              type="email"
              required
              placeholder="diya@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full p-3 border border-charcoal/20 bg-cream/20 text-charcoal focus:outline-none focus:border-charcoal font-sans"
            />
          </div>

          <div>
            <label className="block uppercase text-charcoal/70 mb-1">Password (Min 6 Characters)</label>
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
            <span>{isLoading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs font-mono text-charcoal/60 pt-2">
          Already have an account?{' '}
          <Link href="/auth/login" className="text-charcoal font-bold underline">
            Sign In Here
          </Link>
        </div>
      </div>
    </div>
  );
}
