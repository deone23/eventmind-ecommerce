import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig } from 'axios';
import { config } from '../utils/config';
import { STORAGE_KEYS } from '../utils/constants';
import toast from 'react-hot-toast';

// Create axios instance
const axiosInstance: AxiosInstance = axios.create({
  baseURL: config.api.baseUrl,
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosInstance.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    const token = localStorage.getItem(STORAGE_KEYS.AUTH_TOKEN);
    
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

// Response interceptor
axiosInstance.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean };

    // Handle 401 Unauthorized
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
        
        if (refreshToken) {
          const response = await axios.post(`${config.api.baseUrl}/auth/refresh`, {
            refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem(STORAGE_KEYS.AUTH_TOKEN, token);

          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }

          return axiosInstance(originalRequest);
        }
      } catch (refreshError) {
        // Refresh token failed, logout user
        localStorage.removeItem(STORAGE_KEYS.AUTH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
        localStorage.removeItem(STORAGE_KEYS.USER);
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }

    // Handle other errors
    const errorMessage = (error as any).response?.data?.message || (error as any).message || 'An error occurred';
    
    // Don't show toast for certain endpoints (like silent background requests)
    if (!originalRequest.url?.includes('/silent')) {
      toast.error(errorMessage);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;

// Create service-specific instances
export const createServiceInstance = (baseURL: string): AxiosInstance => {
  const instance = axios.create({
    baseURL,
    timeout: 30000,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Apply same interceptors
  instance.interceptors.request.use(axiosInstance.interceptors.request.handlers[0].fulfilled);
  instance.interceptors.response.use(
    axiosInstance.interceptors.response.handlers[0].fulfilled,
    axiosInstance.interceptors.response.handlers[0].rejected
  );

  return instance;
};

// Service instances
export const userServiceApi = createServiceInstance(config.api.userService);
export const productServiceApi = createServiceInstance(config.api.productService);
export const orderServiceApi = createServiceInstance(config.api.orderService);
export const paymentServiceApi = createServiceInstance(config.api.paymentService);
export const notificationServiceApi = createServiceInstance(config.api.notificationService);
export const kafkaMonitorApi = createServiceInstance(config.api.kafkaMonitor);
export const incidentServiceApi = createServiceInstance(config.api.incidentService);
export const aiServiceApi = createServiceInstance(config.api.aiService);
