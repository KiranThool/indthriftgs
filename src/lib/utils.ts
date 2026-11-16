import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatINR(amount: number): string {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(amount);
}

export function calculateDiscount(originalPrice: number, currentPrice: number): number {
  if (!originalPrice || originalPrice <= currentPrice) return 0;
  return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
}

/**
 * Documented Sustainability Impact Calculations
 * Benchmarks:
 * - Water: ~2,700 Liters of water saved per reworn garment (WRAPS / Ellen MacArthur Foundation cotton production lifecycle data)
 * - Waste: ~1.2 Kilograms of landfill textile waste avoided per pre-loved item
 * - Carbon: ~4.5 Kilograms of CO2e avoided compared to virgin garment manufacture & logistics
 */
export function calculateSustainabilityImpact(itemCount: number) {
  const safeCount = Math.max(1, itemCount);
  return {
    itemsSaved: safeCount,
    waterSavedLiters: safeCount * 2700,
    wasteAvoidedKg: Number((safeCount * 1.2).toFixed(1)),
    carbonAvoidedKg: Number((safeCount * 4.5).toFixed(1)),
  };
}
