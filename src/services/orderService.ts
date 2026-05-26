import { orderServiceApi } from '../api';
import { Order, PaginatedResponse, ApiResponse, ShippingAddress, PaymentMethod } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

export const orderService = {
  getOrders: async (page: number = 1, pageSize: number = 10): Promise<PaginatedResponse<Order>> => {
    const response = await orderServiceApi.get<ApiResponse<PaginatedResponse<Order>>>(
      API_ENDPOINTS.ORDERS,
      { params: { page, pageSize } }
    );
    return response.data.data!;
  },

  getOrderById: async (id: string): Promise<Order> => {
    const response = await orderServiceApi.get<ApiResponse<Order>>(
      API_ENDPOINTS.ORDER_DETAIL.replace(':id', id)
    );
    return response.data.data!;
  },

  createOrder: async (data: {
    items: Array<{ productId: string; quantity: number; price: number }>;
    shippingAddress: ShippingAddress;
    paymentMethod: PaymentMethod;
    subtotal: number;
    tax: number;
    shipping: number;
    total: number;
  }): Promise<Order> => {
    const response = await orderServiceApi.post<ApiResponse<Order>>(
      API_ENDPOINTS.CREATE_ORDER,
      data
    );
    return response.data.data!;
  },

  cancelOrder: async (id: string): Promise<Order> => {
    const response = await orderServiceApi.post<ApiResponse<Order>>(
      API_ENDPOINTS.CANCEL_ORDER.replace(':id', id)
    );
    return response.data.data!;
  },
};
