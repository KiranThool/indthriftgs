'use client';

import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Ruler, AlertCircle } from 'lucide-react';

interface SizeGuideModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SizeGuideModal: React.FC<SizeGuideModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        {/* Backdrop */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
          className="absolute inset-0 bg-charcoal/80 backdrop-blur-sm"
        />

        {/* Modal Container */}
        <motion.div
          initial={{ opacity: 0, scale: 0.96, y: 12 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: 12 }}
          className="relative bg-cream border border-charcoal/15 max-w-2xl w-full p-6 sm:p-8 max-h-[90vh] overflow-y-auto shadow-2xl z-10"
        >
          {/* Header */}
          <div className="flex items-center justify-between pb-4 border-b border-charcoal/10">
            <div className="flex items-center space-x-2">
              <Ruler className="w-5 h-5 text-vintage-brown" />
              <h2 className="text-xl font-display font-bold uppercase tracking-wider text-charcoal">
                Vintage Sizing & Measuring Guide
              </h2>
            </div>
            <button
              onClick={onClose}
              className="p-1 text-charcoal/60 hover:text-charcoal transition-colors"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Important vintage callout */}
          <div className="mt-5 p-4 bg-vintage-sand/50 border-l-2 border-vintage-brown text-sm text-charcoal/90 flex items-start space-x-3">
            <AlertCircle className="w-5 h-5 text-vintage-brown flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold uppercase tracking-wider text-xs text-vintage-brown mb-1">
                Why Vintage Fits Differently
              </p>
              <p className="leading-relaxed">
                Garments from the 80s, 90s, and 2000s shrink, stretch, or were cut with different proportions compared to modern sizing. Always rely on our <strong>exact flat-lay garment measurements</strong> (in inches & cm) in each product description rather than just the tag size.
              </p>
            </div>
          </div>

          {/* How we measure */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal mb-3">
              How We Measure Garments (Flat-Lay)
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
              <div className="p-3 bg-soft-white border border-charcoal/10">
                <span className="font-bold uppercase text-charcoal block mb-1">Pit to Pit (Chest)</span>
                <p className="text-charcoal/70">
                  Measured across the chest from armpit seam to armpit seam with the garment laid flat.
                </p>
              </div>
              <div className="p-3 bg-soft-white border border-charcoal/10">
                <span className="font-bold uppercase text-charcoal block mb-1">Length</span>
                <p className="text-charcoal/70">
                  Measured from the highest point of the shoulder/collar seam straight down to bottom hem.
                </p>
              </div>
              <div className="p-3 bg-soft-white border border-charcoal/10">
                <span className="font-bold uppercase text-charcoal block mb-1">Waist (Pants/Denim)</span>
                <p className="text-charcoal/70">
                  Measured straight across waistband laid flat and doubled (e.g., 16" across = 32" waist).
                </p>
              </div>
              <div className="p-3 bg-soft-white border border-charcoal/10">
                <span className="font-bold uppercase text-charcoal block mb-1">Inseam</span>
                <p className="text-charcoal/70">
                  Measured from inner crotch seam straight down the inside leg to the bottom leg opening.
                </p>
              </div>
            </div>
          </div>

          {/* Tops General Reference Table */}
          <div className="mt-6">
            <h3 className="text-sm font-bold uppercase tracking-widest text-charcoal mb-3">
              Standard Tops Reference Chart
            </h3>
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-charcoal/20 bg-charcoal/5 font-mono uppercase text-charcoal">
                    <th className="p-2.5">Tag Size</th>
                    <th className="p-2.5">Chest (Pit-to-Pit)</th>
                    <th className="p-2.5">Length</th>
                    <th className="p-2.5">Recommended Fit</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-charcoal/10 text-charcoal/80 font-mono">
                  <tr>
                    <td className="p-2.5 font-bold">Small (S)</td>
                    <td className="p-2.5">18 - 19 in (46-48 cm)</td>
                    <td className="p-2.5">25 - 26 in (63-66 cm)</td>
                    <td className="p-2.5">Slim / Fitted</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Medium (M)</td>
                    <td className="p-2.5">20 - 21 in (51-53 cm)</td>
                    <td className="p-2.5">27 - 28 in (68-71 cm)</td>
                    <td className="p-2.5">Standard Fit</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">Large (L)</td>
                    <td className="p-2.5">22 - 23 in (56-58 cm)</td>
                    <td className="p-2.5">28 - 29 in (71-74 cm)</td>
                    <td className="p-2.5">Relaxed Streetwear</td>
                  </tr>
                  <tr>
                    <td className="p-2.5 font-bold">X-Large (XL)</td>
                    <td className="p-2.5">24 - 26 in (61-66 cm)</td>
                    <td className="p-2.5">29 - 31 in (74-79 cm)</td>
                    <td className="p-2.5">Boxy Oversized</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Footer CTA */}
          <div className="mt-6 pt-4 border-t border-charcoal/10 flex justify-end">
            <button
              onClick={onClose}
              className="px-6 py-2.5 bg-charcoal text-cream hover:bg-charcoal/90 text-xs font-bold uppercase tracking-widest transition-colors"
            >
              Got It
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
