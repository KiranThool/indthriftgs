import React from 'react';
import { HeroSection } from '@/components/home/HeroSection';
import { CategoryCards } from '@/components/home/CategoryCards';
import { TrendingGrid } from '@/components/home/TrendingGrid';
import { EditorialBanner } from '@/components/home/EditorialBanner';
import { RecentlyAddedGrid } from '@/components/home/RecentlyAddedGrid';
import { SustainabilityCounter } from '@/components/home/SustainabilityCounter';
import { WhySecondStory } from '@/components/home/WhySecondStory';
import { NewsletterSection } from '@/components/home/NewsletterSection';

export default function HomePage() {
  return (
    <div className="flex flex-col min-h-screen">
      {/* 1. Hero Section */}
      <HeroSection />

      {/* 2. Category Section Cards */}
      <CategoryCards />

      {/* 3. Trending Now Product Grid */}
      <TrendingGrid />

      {/* 4. Large Editorial Featured Collection */}
      <EditorialBanner />

      {/* 5. Recently Added Drops */}
      <RecentlyAddedGrid />

      {/* 6. Documented Sustainability Counter */}
      <SustainabilityCounter />

      {/* 7. Why Second Story Brand Pillars */}
      <WhySecondStory />

      {/* 8. VIP Drop Newsletter Section */}
      <NewsletterSection />
    </div>
  );
}
