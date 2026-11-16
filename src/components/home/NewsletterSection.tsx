'use client';

import React, { useState } from 'react';
import { ArrowRight, CheckCircle2, BellRing } from 'lucide-react';
import { useToast } from '@/components/ui/Toast';

export const NewsletterSection: React.FC = () => {
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const { showToast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !email.includes('@')) return;

    setIsLoading(true);
    // Simulating subscription API or local subscriber store
    try {
      const existing = JSON.parse(localStorage.getItem('second_story_subscribers') || '[]');
      if (!existing.includes(email)) {
        existing.push(email);
        localStorage.setItem('second_story_subscribers', JSON.stringify(existing));
      }
      setIsSubmitted(true);
      showToast('Welcome to the VIP Drop List! 15% discount code applied.', 'success');
      setEmail('');
    } catch (e) {
      showToast('Subscription failed. Please check your email.', 'error');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <section className="py-20 sm:py-28 bg-charcoal text-cream relative overflow-hidden">
      {/* Decorative grain / lines */}
      <div className="absolute inset-0 opacity-5 pointer-events-none bg-[radial-gradient(#fff_1px,transparent_1px)] [background-size:16px_16px]" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center relative z-10">
        <div className="inline-flex items-center space-x-2 px-3 py-1 bg-cream/10 border border-cream/20 text-cream/80 text-xs font-mono uppercase tracking-widest mb-4">
          <BellRing className="w-3.5 h-3.5 text-olive" />
          <span>Priority Drop Access</span>
        </div>

        <h2 className="font-display font-black text-3xl sm:text-5xl lg:text-6xl uppercase tracking-tighter text-cream leading-tight">
          GOOD FINDS DON'T WAIT.
        </h2>

        <p className="text-sm sm:text-base text-cream/70 max-w-xl mx-auto mt-4 font-sans leading-relaxed">
          Get first access to new drops, rare archive finds, and secret subscriber-only promo codes before items go live on social.
        </p>

        <div className="mt-8 max-w-md mx-auto">
          {isSubmitted ? (
            <div className="p-4 bg-olive/20 border border-olive/50 text-cream font-mono text-xs flex items-center justify-center space-x-2">
              <CheckCircle2 className="w-4 h-4 text-olive" />
              <span>You're in the club! Use code <strong>FIRSTDROP</strong> at checkout.</span>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="email"
                required
                placeholder="Enter your email for drop notifications"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="flex-1 px-4 py-3.5 bg-cream/10 border border-cream/20 text-cream placeholder-cream/40 text-xs font-mono focus:outline-none focus:border-cream"
              />
              <button
                type="submit"
                disabled={isLoading}
                className="px-6 py-3.5 bg-cream text-charcoal hover:bg-soft-white text-xs font-mono font-bold uppercase tracking-widest transition-colors flex items-center justify-center space-x-2 whitespace-nowrap shadow-xl"
              >
                <span>{isLoading ? 'Joining...' : 'Get Drop Access'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}

          <p className="text-[11px] font-mono text-cream/40 mt-3">
            Strictly no spam. Unsubscribe anytime with 1 click.
          </p>
        </div>
      </div>
    </section>
  );
};
