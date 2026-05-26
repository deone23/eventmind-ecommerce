export const config = {
  api: {
    baseUrl: import.meta.env.VITE_API_BASE_URL || 'http://localhost:8080',
    userService: import.meta.env.VITE_USER_SERVICE_URL || 'http://localhost:8081',
    productService: import.meta.env.VITE_PRODUCT_SERVICE_URL || 'http://localhost:8082',
    orderService: import.meta.env.VITE_ORDER_SERVICE_URL || 'http://localhost:8083',
    paymentService: import.meta.env.VITE_PAYMENT_SERVICE_URL || 'http://localhost:8084',
    notificationService: import.meta.env.VITE_NOTIFICATION_SERVICE_URL || 'http://localhost:8085',
    kafkaMonitor: import.meta.env.VITE_KAFKA_MONITOR_URL || 'http://localhost:8086',
    incidentService: import.meta.env.VITE_INCIDENT_SERVICE_URL || 'http://localhost:8087',
    aiService: import.meta.env.VITE_AI_SERVICE_URL || 'http://localhost:8088',
  },
  app: {
    name: import.meta.env.VITE_APP_NAME || 'EventMind E-Commerce',
    version: import.meta.env.VITE_APP_VERSION || '1.0.0',
    enableMockData: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  },
  features: {
    enableAI: import.meta.env.VITE_ENABLE_AI_FEATURES === 'true',
    enableKafkaMonitoring: import.meta.env.VITE_ENABLE_KAFKA_MONITORING === 'true',
  },
  pagination: {
    defaultPageSize: 20,
    pageSizeOptions: [10, 20, 50, 100],
  },
  cart: {
    maxQuantityPerItem: 10,
    taxRate: 0.18, // 18% GST
    shippingThreshold: 500, // Free shipping above this amount
    shippingCost: 50,
  },
};
