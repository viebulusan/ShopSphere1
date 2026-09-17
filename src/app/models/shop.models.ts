export interface ProductColor {
  name: string;
  hex: string;
}

export interface ProductReview {
  id: string;
  productId: string;
  author: string;
  avatar?: string;
  verifiedBuyer: boolean;
  rating: number;
  date: string;
  title: string;
  comment: string;
  orderNumber?: string;
  tags?: string[];
  photos?: string[];
  helpfulCount?: number;
}

export interface Product {
  id: string;
  title: string;
  subtitle: string;
  price: number;
  originalPrice?: number;
  rating: number;
  reviewsCount: number;
  category: string;
  image: string;
  gallery: string[];
  colors: ProductColor[];
  sizes: string[];
  description: string;
  features: string[];
  inStock: boolean;
  isNew?: boolean;
  isTrending?: boolean;
  badge?: string;
  reviews?: ProductReview[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedColor: ProductColor;
  selectedSize: string;
  quantity: number;
}

export interface Address {
  id: string;
  title: string;
  recipientName: string;
  phone: string;
  street: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault: boolean;
}

export interface PaymentMethod {
  id: string;
  type: 'card' | 'paypal' | 'google_pay';
  cardholderName?: string;
  last4?: string;
  brand?: 'visa' | 'mastercard' | 'amex' | 'paypal';
  expiry?: string;
  isDefault: boolean;
}

export interface OrderTimelineStep {
  title: string;
  date: string;
  completed: boolean;
  current: boolean;
  description: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  date: string;
  status: 'processing' | 'shipped' | 'out_for_delivery' | 'delivered';
  items: CartItem[];
  subtotal: number;
  shipping: number;
  discount: number;
  tax: number;
  total: number;
  address: Address;
  paymentMethod: PaymentMethod;
  estimatedDelivery: string;
  timeline: OrderTimelineStep[];
}

export interface AppNotification {
  id: string;
  title: string;
  message: string;
  time: string;
  read: boolean;
  type: 'order' | 'promo' | 'security';
}

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  avatar: string;
  tier: string;
  memberSince: string;
  phone: string;
}

export type ScreenType = 
  | 'home' 
  | 'discover' 
  | 'product-detail' 
  | 'cart' 
  | 'bag'
  | 'checkout' 
  | 'done' 
  | 'orders' 
  | 'order-details' 
  | 'wishlist' 
  | 'notifications' 
  | 'profile' 
  | 'contact-us'
  | 'settings'
  | 'saved-addresses' 
  | 'add-address' 
  | 'saved-payments' 
  | 'add-payment' 
  | 'login' 
  | 'signup' 
  | 'reset-password' 
  | 'code-verification' 
  | 'network-error';
