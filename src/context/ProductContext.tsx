'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { Product } from '@/types';
import { INITIAL_PRODUCTS } from '@/data/mockProducts';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface ProductContextType {
  products: Product[];
  getProductBySlug: (slug: string) => Product | undefined;
  getProductById: (id: string) => Product | undefined;
  addProduct: (newProduct: Omit<Product, 'id' | 'created_at'>) => Product;
  updateProduct: (id: string, updates: Partial<Product>) => boolean;
  deleteProduct: (id: string) => boolean;
  reduceStock: (items: { product_id: string; quantity: number }[]) => void;
  resetToInitial: () => void;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

const PRODUCTS_STORAGE_KEY = 'second_story_products_v1';

export const ProductProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(INITIAL_PRODUCTS);
  const [isInitialized, setIsInitialized] = useState(false);

  useEffect(() => {
    const loadProducts = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data, error } = await supabase
            .from('products')
            .select('*')
            .order('created_at', { ascending: false });

          if (!error && data && data.length > 0) {
            setProducts(data as Product[]);
            setIsInitialized(true);
            return;
          }
        }

        // Local storage check
        const saved = localStorage.getItem(PRODUCTS_STORAGE_KEY);
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setProducts(parsed);
          }
        } else {
          localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
        }
      } catch (e) {
        console.error('Failed to load products:', e);
      } finally {
        setIsInitialized(true);
      }
    };

    loadProducts();
  }, []);

  useEffect(() => {
    if (isInitialized) {
      try {
        localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(products));
      } catch (e) {
        console.error('Failed to save products:', e);
      }
    }
  }, [products, isInitialized]);

  const getProductBySlug = (slug: string) => {
    return products.find((p) => p.slug === slug);
  };

  const getProductById = (id: string) => {
    return products.find((p) => p.id === id);
  };

  const addProduct = (productData: Omit<Product, 'id' | 'created_at'>): Product => {
    const newProduct: Product = {
      ...productData,
      id: `prod-${Date.now()}`,
      created_at: new Date().toISOString(),
    };

    setProducts((prev) => [newProduct, ...prev]);
    return newProduct;
  };

  const updateProduct = (id: string, updates: Partial<Product>): boolean => {
    let updated = false;
    setProducts((prev) =>
      prev.map((p) => {
        if (p.id === id) {
          updated = true;
          return { ...p, ...updates };
        }
        return p;
      })
    );
    return updated;
  };

  const deleteProduct = (id: string): boolean => {
    let deleted = false;
    setProducts((prev) => {
      const filtered = prev.filter((p) => p.id !== id);
      if (filtered.length !== prev.length) deleted = true;
      return filtered;
    });
    return deleted;
  };

  const reduceStock = (items: { product_id: string; quantity: number }[]) => {
    setProducts((prev) =>
      prev.map((p) => {
        const matchingItem = items.find((item) => item.product_id === p.id);
        if (matchingItem) {
          const newQty = Math.max(0, p.stock_quantity - matchingItem.quantity);
          return { ...p, stock_quantity: newQty };
        }
        return p;
      })
    );
  };

  const resetToInitial = () => {
    setProducts(INITIAL_PRODUCTS);
    localStorage.setItem(PRODUCTS_STORAGE_KEY, JSON.stringify(INITIAL_PRODUCTS));
  };

  return (
    <ProductContext.Provider
      value={{
        products,
        getProductBySlug,
        getProductById,
        addProduct,
        updateProduct,
        deleteProduct,
        reduceStock,
        resetToInitial,
      }}
    >
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within a ProductProvider');
  }
  return context;
};
