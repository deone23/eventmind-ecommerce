/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_API_BASE_URL: string;
  readonly VITE_USER_SERVICE_URL: string;
  readonly VITE_PRODUCT_SERVICE_URL: string;
  readonly VITE_ORDER_SERVICE_URL: string;
  readonly VITE_PAYMENT_SERVICE_URL: string;
  readonly VITE_NOTIFICATION_SERVICE_URL: string;
  readonly VITE_KAFKA_MONITOR_URL: string;
  readonly VITE_INCIDENT_SERVICE_URL: string;
  readonly VITE_AI_SERVICE_URL: string;
  readonly VITE_APP_NAME: string;
  readonly VITE_APP_VERSION: string;
  readonly VITE_ENABLE_MOCK_DATA: string;
  readonly VITE_ENABLE_AI_FEATURES: string;
  readonly VITE_ENABLE_KAFKA_MONITORING: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
