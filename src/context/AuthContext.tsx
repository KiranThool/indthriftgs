'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import { UserProfile, ShippingAddress, Order } from '@/types';
import { supabase, isSupabaseConfigured } from '@/lib/supabase';

interface AuthContextType {
  user: UserProfile | null;
  isLoading: boolean;
  isAdmin: boolean;
  login: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  signup: (email: string, password: string, fullName: string) => Promise<{ success: boolean; error?: string }>;
  logout: () => Promise<void>;
  updateProfile: (data: Partial<UserProfile>) => Promise<void>;
  saveAddress: (address: ShippingAddress) => void;
  orders: Order[];
  addOrderToHistory: (order: Order) => void;
  updateOrderStatusAdmin: (orderId: string, status: Order['order_status'], tracking?: string) => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const AUTH_USER_KEY = 'second_story_auth_user_v1';
const USER_ORDERS_KEY = 'second_story_user_orders_v1';

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<UserProfile | null>(null);
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  // Load active user and orders from local storage or Supabase session
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (isSupabaseConfigured()) {
          const { data: { session } } = await supabase.auth.getSession();
          if (session?.user) {
            const { data: profile } = await supabase
              .from('profiles')
              .select('*')
              .eq('id', session.user.id)
              .single();

            if (profile) {
              setUser({
                id: profile.id,
                email: profile.email,
                full_name: profile.full_name,
                phone: profile.phone,
                role: profile.role || 'customer',
                saved_addresses: [],
                created_at: profile.created_at,
              });
            }
          }
        } else {
          // Local offline fallback user
          const savedUser = localStorage.getItem(AUTH_USER_KEY);
          if (savedUser) {
            setUser(JSON.parse(savedUser));
          }
        }

        const savedOrders = localStorage.getItem(USER_ORDERS_KEY);
        if (savedOrders) {
          setOrders(JSON.parse(savedOrders));
        } else {
          // Initial sample order so order history looks real and rich
          const demoOrders: Order[] = [
            {
              id: 'ord-sample-01',
              order_number: 'SS-90421',
              user_id: 'usr-demo-01',
              customer_name: 'Aarav Mehta',
              customer_email: 'aarav@example.com',
              customer_phone: '+91 98765 43210',
              shipping_address: {
                name: 'Aarav Mehta',
                email: 'aarav@example.com',
                phone: '+91 98765 43210',
                street: 'Flat 402, Vintage Palms, Bandra West',
                city: 'Mumbai',
                state: 'Maharashtra',
                postal_code: '400050',
              },
              items: [
                {
                  product_id: 'prod-002',
                  product_name: "Vintage 1993 Levi's 501 Made in USA Selvedge",
                  price: 3890,
                  original_price: 12000,
                  quantity: 1,
                  image: 'https://images.unsplash.com/photo-1542272604-780c96856592?q=80&w=1000&auto=format&fit=crop',
                  size: '32x32',
                  condition: 'Excellent',
                },
              ],
              subtotal: 3890,
              shipping_fee: 0,
              discount_amount: 389,
              coupon_code: 'SECONDSTORY10',
              total_amount: 3501,
              payment_status: 'paid',
              order_status: 'delivered',
              payment_method: 'razorpay',
              payment_reference: 'pay_SS892301981',
              tracking_number: 'BLUEDART-88291039',
              created_at: '2026-11-04T14:22:00Z',
            },
          ];
          setOrders(demoOrders);
          localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(demoOrders));
        }
      } catch (e) {
        console.error('Error initializing auth:', e);
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signInWithPassword({ email, password });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const { data: profile } = await supabase
            .from('profiles')
            .select('*')
            .eq('id', data.user.id)
            .single();

          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: profile?.full_name || 'Customer',
            phone: profile?.phone,
            role: profile?.role || 'customer',
            created_at: profile?.created_at || new Date().toISOString(),
          };
          setUser(newUser);
          return { success: true };
        }
      }

      // Local / Offline authentication handling
      const isAdminUser = email.toLowerCase().includes('admin');
      const mockUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email: email,
        full_name: isAdminUser ? 'Editorial Director (Admin)' : email.split('@')[0],
        role: isAdminUser ? 'admin' : 'customer',
        saved_addresses: [
          {
            name: isAdminUser ? 'Admin Headquarters' : 'Home Address',
            email: email,
            phone: '+91 98200 12345',
            street: '12 Indiranagar 100ft Road',
            city: 'Bengaluru',
            state: 'Karnataka',
            postal_code: '560038',
          },
        ],
        created_at: new Date().toISOString(),
      };

      setUser(mockUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(mockUser));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Login failed' };
    }
  };

  const signup = async (email: string, password: string, fullName: string) => {
    try {
      if (isSupabaseConfigured()) {
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: { full_name: fullName },
          },
        });
        if (error) return { success: false, error: error.message };
        if (data.user) {
          const newUser: UserProfile = {
            id: data.user.id,
            email: data.user.email || email,
            full_name: fullName,
            role: 'customer',
            created_at: new Date().toISOString(),
          };
          setUser(newUser);
          return { success: true };
        }
      }

      // Local user registration
      const newUser: UserProfile = {
        id: `usr-${Date.now()}`,
        email,
        full_name: fullName,
        role: 'customer',
        saved_addresses: [],
        created_at: new Date().toISOString(),
      };

      setUser(newUser);
      localStorage.setItem(AUTH_USER_KEY, JSON.stringify(newUser));
      return { success: true };
    } catch (e: any) {
      return { success: false, error: e.message || 'Registration failed' };
    }
  };

  const logout = async () => {
    if (isSupabaseConfigured()) {
      await supabase.auth.signOut();
    }
    setUser(null);
    localStorage.removeItem(AUTH_USER_KEY);
  };

  const updateProfile = async (data: Partial<UserProfile>) => {
    if (!user) return;
    const updated = { ...user, ...data };
    setUser(updated);
    localStorage.setItem(AUTH_USER_KEY, JSON.stringify(updated));
  };

  const saveAddress = (address: ShippingAddress) => {
    if (!user) return;
    const existing = user.saved_addresses || [];
    const updatedAddresses = [...existing, address];
    updateProfile({ saved_addresses: updatedAddresses });
  };

  const addOrderToHistory = (order: Order) => {
    setOrders((prev) => {
      const updated = [order, ...prev];
      localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  const updateOrderStatusAdmin = (orderId: string, status: Order['order_status'], tracking?: string) => {
    setOrders((prev) => {
      const updated = prev.map((ord) => {
        if (ord.id === orderId) {
          return {
            ...ord,
            order_status: status,
            tracking_number: tracking !== undefined ? tracking : ord.tracking_number,
          };
        }
        return ord;
      });
      localStorage.setItem(USER_ORDERS_KEY, JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAdmin: user?.role === 'admin',
        login,
        signup,
        logout,
        updateProfile,
        saveAddress,
        orders,
        addOrderToHistory,
        updateOrderStatusAdmin,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
