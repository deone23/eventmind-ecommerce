// Common Types
export interface ApiResponse<T = any> {
  success: boolean;
  data?: T;
  message?: string;
  error?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// User Types
export interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone?: string;
}

// Product Types
export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  discount?: number;
  category: string;
  subcategory?: string;
  brand?: string;
  images: string[];
  thumbnail: string;
  rating: number;
  reviewCount: number;
  stock: number;
  inStock: boolean;
  specifications?: Record<string, string>;
  features?: string[];
  tags?: string[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductFilters {
  category?: string;
  subcategory?: string;
  brand?: string;
  minPrice?: number;
  maxPrice?: number;
  rating?: number;
  inStock?: boolean;
  search?: string;
}

export interface ProductSort {
  field: 'price' | 'rating' | 'name' | 'createdAt';
  order: 'asc' | 'desc';
}

// Cart Types
export interface CartItem {
  productId: string;
  product: Product;
  quantity: number;
  addedAt: string;
}

export interface CartState {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
}

// Order Types
export interface ShippingAddress {
  id?: string;
  fullName: string;
  phone: string;
  addressLine1: string;
  addressLine2?: string;
  city: string;
  state: string;
  zipCode: string;
  country: string;
  isDefault?: boolean;
}

export interface PaymentMethod {
  id?: string;
  type: 'card' | 'upi' | 'netbanking' | 'cod';
  cardNumber?: string;
  cardHolder?: string;
  expiryDate?: string;
  upiId?: string;
  isDefault?: boolean;
}

export interface OrderItem {
  productId: string;
  productName: string;
  productImage: string;
  quantity: number;
  price: number;
  total: number;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: ShippingAddress;
  paymentMethod: PaymentMethod;
  status: 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  trackingNumber?: string;
  estimatedDelivery?: string;
  createdAt: string;
  updatedAt: string;
}

export interface OrderStatusTimeline {
  status: string;
  timestamp: string;
  description: string;
}

// Notification Types
export interface Notification {
  id: string;
  type: 'info' | 'success' | 'warning' | 'error';
  title: string;
  message: string;
  read: boolean;
  createdAt: string;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
}

// EventMind AI Types
export interface KafkaEvent {
  id: string;
  topic: string;
  partition: number;
  offset: number;
  key: string;
  value: any;
  timestamp: string;
  headers?: Record<string, string>;
}

export interface DLQMessage {
  id: string;
  originalTopic: string;
  errorReason: string;
  retryCount: number;
  message: KafkaEvent;
  createdAt: string;
}

export interface Incident {
  id: string;
  title: string;
  description: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
  status: 'open' | 'investigating' | 'resolved' | 'closed';
  affectedServices: string[];
  rootCause?: string;
  aiSuggestions?: string[];
  timeline: IncidentTimelineEvent[];
  createdAt: string;
  updatedAt: string;
  resolvedAt?: string;
}

export interface IncidentTimelineEvent {
  id: string;
  timestamp: string;
  event: string;
  description: string;
  actor?: string;
}

export interface ServiceHealth {
  serviceName: string;
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  lastCheck: string;
  metrics?: {
    cpu: number;
    memory: number;
    requests: number;
    errors: number;
  };
}

export interface DistributedTrace {
  traceId: string;
  spanId: string;
  serviceName: string;
  operation: string;
  duration: number;
  timestamp: string;
  status: 'success' | 'error';
  tags?: Record<string, string>;
  logs?: Array<{
    timestamp: string;
    message: string;
  }>;
}

// Review Types
export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  helpful: number;
  verified: boolean;
  images?: string[];
  createdAt: string;
}

// Category Types
export interface Category {
  id: string;
  name: string;
  slug: string;
  icon?: string;
  image?: string;
  description?: string;
  subcategories?: Category[];
}
