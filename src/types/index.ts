export type ProductCondition =
  | 'Brand New With Tags'
  | 'Like New'
  | 'Excellent'
  | 'Good'
  | 'Vintage';

export type CategorySlug =
  | 'vintage-tees'
  | 'oversized-shirts'
  | 'denim'
  | 'jackets'
  | 'sweatshirts'
  | 'streetwear'
  | 'sneakers'
  | 'accessories';

export interface Category {
  id: string;
  name: string;
  slug: CategorySlug;
  description: string;
  image: string;
  itemCount: number;
}

export interface Measurements {
  chest?: string;
  length?: string;
  waist?: string;
  inseam?: string;
  shoulders?: string;
  sleeve?: string;
  fitNotes?: string;
}

export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  price: number;
  original_price: number;
  category_id: string;
  category_slug: CategorySlug;
  category_name: string;
  brand: string;
  size: string;
  gender: 'men' | 'women' | 'unisex';
  condition: ProductCondition;
  color: string;
  material: string;
  measurements: Measurements;
  stock_quantity: number;
  is_featured: boolean;
  is_new_arrival: boolean;
  is_trending?: boolean;
  images: string[];
  created_at: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  selectedSize: string;
}

export interface ShippingAddress {
  name: string;
  email: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  postal_code: string;
}

export interface Order {
  id: string;
  order_number: string;
  user_id?: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  shipping_address: ShippingAddress;
  items: {
    product_id: string;
    product_name: string;
    price: number;
    original_price?: number;
    quantity: number;
    image: string;
    size: string;
    condition: ProductCondition;
  }[];
  subtotal: number;
  shipping_fee: number;
  discount_amount: number;
  coupon_code?: string;
  total_amount: number;
  payment_status: 'pending' | 'paid' | 'failed';
  order_status: 'placed' | 'processing' | 'dispatched' | 'delivered' | 'cancelled';
  payment_method: 'razorpay' | 'cod';
  payment_reference?: string;
  tracking_number?: string;
  created_at: string;
}

export interface Coupon {
  code: string;
  discount_percentage: number;
  min_order_value: number;
  description: string;
}

export interface UserProfile {
  id: string;
  email: string;
  full_name: string;
  phone?: string;
  role: 'customer' | 'admin';
  saved_addresses?: ShippingAddress[];
  created_at: string;
}

export interface FilterState {
  category: string;
  gender: string;
  size: string[];
  brand: string[];
  condition: string[];
  color: string[];
  minPrice: number;
  maxPrice: number;
  sortBy: 'featured' | 'newest' | 'price-low-high' | 'price-high-low' | 'discount';
  searchQuery: string;
}
