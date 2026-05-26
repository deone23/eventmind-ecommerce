export const ROUTES = {
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  CART: '/cart',
  CHECKOUT: '/checkout',
  LOGIN: '/login',
  SIGNUP: '/signup',
  FORGOT_PASSWORD: '/forgot-password',
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  PROFILE: '/profile',
  ADMIN: '/admin',
  ADMIN_PRODUCTS: '/admin/products',
  ADMIN_ORDERS: '/admin/orders',
  ADMIN_INCIDENTS: '/admin/incidents',
  ADMIN_KAFKA: '/admin/kafka',
  EVENTMIND_OPS: '/eventmind-ops',
} as const;

export const API_ENDPOINTS = {
  // Auth
  LOGIN: '/auth/login',
  SIGNUP: '/auth/signup',
  LOGOUT: '/auth/logout',
  REFRESH_TOKEN: '/auth/refresh',
  FORGOT_PASSWORD: '/auth/forgot-password',
  RESET_PASSWORD: '/auth/reset-password',
  
  // User
  USER_PROFILE: '/users/profile',
  UPDATE_PROFILE: '/users/profile',
  
  // Products
  PRODUCTS: '/products',
  PRODUCT_DETAIL: '/products/:id',
  PRODUCT_REVIEWS: '/products/:id/reviews',
  CATEGORIES: '/categories',
  
  // Cart
  CART: '/cart',
  ADD_TO_CART: '/cart/add',
  UPDATE_CART_ITEM: '/cart/update',
  REMOVE_FROM_CART: '/cart/remove',
  CLEAR_CART: '/cart/clear',
  
  // Orders
  ORDERS: '/orders',
  ORDER_DETAIL: '/orders/:id',
  CREATE_ORDER: '/orders/create',
  CANCEL_ORDER: '/orders/:id/cancel',
  
  // Payment
  PAYMENT_METHODS: '/payment/methods',
  PROCESS_PAYMENT: '/payment/process',
  
  // Notifications
  NOTIFICATIONS: '/notifications',
  MARK_READ: '/notifications/:id/read',
  
  // EventMind AI
  KAFKA_EVENTS: '/kafka/events',
  DLQ_MESSAGES: '/kafka/dlq',
  INCIDENTS: '/incidents',
  INCIDENT_DETAIL: '/incidents/:id',
  SERVICE_HEALTH: '/monitoring/health',
  DISTRIBUTED_TRACES: '/monitoring/traces',
  AI_SUGGESTIONS: '/ai/suggestions',
} as const;

export const STORAGE_KEYS = {
  AUTH_TOKEN: 'auth_token',
  REFRESH_TOKEN: 'refresh_token',
  USER: 'user',
  CART: 'cart',
  THEME: 'theme',
  RECENT_SEARCHES: 'recent_searches',
} as const;

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_DETAIL: 'product-detail',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  ORDER_DETAIL: 'order-detail',
  NOTIFICATIONS: 'notifications',
  USER_PROFILE: 'user-profile',
  KAFKA_EVENTS: 'kafka-events',
  DLQ_MESSAGES: 'dlq-messages',
  INCIDENTS: 'incidents',
  SERVICE_HEALTH: 'service-health',
  DISTRIBUTED_TRACES: 'distributed-traces',
} as const;

export const ORDER_STATUS = {
  PENDING: 'pending',
  CONFIRMED: 'confirmed',
  PROCESSING: 'processing',
  SHIPPED: 'shipped',
  DELIVERED: 'delivered',
  CANCELLED: 'cancelled',
} as const;

export const PAYMENT_STATUS = {
  PENDING: 'pending',
  COMPLETED: 'completed',
  FAILED: 'failed',
  REFUNDED: 'refunded',
} as const;

export const INCIDENT_SEVERITY = {
  LOW: 'low',
  MEDIUM: 'medium',
  HIGH: 'high',
  CRITICAL: 'critical',
} as const;

export const SERVICE_STATUS = {
  HEALTHY: 'healthy',
  DEGRADED: 'degraded',
  DOWN: 'down',
} as const;
