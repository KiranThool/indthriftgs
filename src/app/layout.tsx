import type { Metadata } from 'next';
import './globals.css';
import { AnnouncementBar } from '@/components/layout/AnnouncementBar';
import { Navbar } from '@/components/layout/Navbar';
import { Footer } from '@/components/layout/Footer';
import { CartDrawer } from '@/components/cart/CartDrawer';
import { CartProvider } from '@/context/CartContext';
import { WishlistProvider } from '@/context/WishlistContext';
import { AuthProvider } from '@/context/AuthContext';
import { ProductProvider } from '@/context/ProductContext';
import { ToastProvider } from '@/components/ui/Toast';

export const metadata: Metadata = {
  title: 'SECOND STORY | Curated Vintage & Streetwear Archive',
  description:
    'Pre-loved. Re-loved. Reworn. Discover authentic 80s & 90s vintage, rare selvedge denim, archive workwear, and one-of-a-kind streetwear fits.',
  keywords: [
    'thrift store India',
    'vintage clothing India',
    'pre-loved fashion',
    'vintage tees',
    'carhartt vintage',
    'levis 501 vintage',
    'sustainable streetwear',
    'second story thrift',
  ],
  authors: [{ name: 'SECOND STORY Archive' }],
  metadataBase: new URL('https://secondstory.in'),
  openGraph: {
    title: 'SECOND STORY | Vintage Fashion & Streetwear Archive',
    description: 'Good style deserves a second life. One-of-a-kind vintage grails and verified pre-loved fashion.',
    url: 'https://secondstory.in',
    siteName: 'SECOND STORY',
    locale: 'en_IN',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'SECOND STORY | Curated Vintage Archive',
    description: 'Pre-loved. Re-loved. Reworn. Premium vintage streetwear from Bengaluru.',
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col antialiased bg-cream text-charcoal">
        <ProductProvider>
          <AuthProvider>
            <CartProvider>
              <WishlistProvider>
                <ToastProvider>
                  <AnnouncementBar />
                  <Navbar />
                  <main className="flex-1">{children}</main>
                  <CartDrawer />
                  <Footer />
                </ToastProvider>
              </WishlistProvider>
            </CartProvider>
          </AuthProvider>
        </ProductProvider>
      </body>
    </html>
  );
}
