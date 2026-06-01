import { axiosInstance } from '../api';
import { ApiResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

// Payment Types
export interface PaymentDetails {
  cardNumber: string;
  cardHolderName: string;
  expiryMonth: string;
  expiryYear: string;
  cvv: string;
}

export interface ProcessPaymentRequest {
  orderId: string;
  amount: number;
  currency: string;
  paymentMethod: 'CREDIT_CARD' | 'DEBIT_CARD' | 'PAYPAL';
  paymentDetails: PaymentDetails;
}

export interface PaymentResponse {
  paymentId: string;
  orderId: string;
  transactionId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  currency: string;
  paymentMethod: string;
  cardLast4?: string;
  processedAt: string;
  gatewayResponse?: {
    authorizationCode?: string;
    gatewayTransactionId?: string;
    errorCode?: string;
    errorMessage?: string;
  };
}

export interface RefundRequest {
  amount: number;
  reason: string;
}

export interface RefundResponse {
  refundId: string;
  paymentId: string;
  orderId: string;
  status: 'PENDING' | 'COMPLETED' | 'FAILED';
  amount: number;
  currency: string;
  reason: string;
  initiatedAt: string;
  estimatedCompletionDate?: string;
}

export interface PaymentHistoryResponse {
  paymentId: string;
  orderId: string;
  userId: string;
  status: 'SUCCESS' | 'FAILED' | 'PENDING';
  amount: number;
  currency: string;
  paymentMethod: string;
  cardLast4?: string;
  transactions: Array<{
    transactionId: string;
    type: 'CHARGE' | 'REFUND';
    status: string;
    amount: number;
    processedAt: string;
    gatewayTransactionId: string;
  }>;
  createdAt: string;
  processedAt?: string;
}

export const paymentService = {
  /**
   * Process payment for an order
   * POST /api/payments/process
   */
  processPayment: async (data: ProcessPaymentRequest): Promise<PaymentResponse> => {
    const response = await axiosInstance.post<ApiResponse<PaymentResponse>>(
      API_ENDPOINTS.PROCESS_PAYMENT,
      data
    );
    return response.data.data!;
  },

  /**
   * Get payment details by ID
   * GET /api/payments/{paymentId}
   */
  getPayment: async (paymentId: string): Promise<PaymentHistoryResponse> => {
    const response = await axiosInstance.get<ApiResponse<PaymentHistoryResponse>>(
      `/api/payments/${paymentId}`
    );
    return response.data.data!;
  },

  /**
   * Initiate refund for a payment
   * POST /api/payments/{paymentId}/refund
   */
  initiateRefund: async (paymentId: string, data: RefundRequest): Promise<RefundResponse> => {
    const response = await axiosInstance.post<ApiResponse<RefundResponse>>(
      `/api/payments/${paymentId}/refund`,
      data
    );
    return response.data.data!;
  },

  /**
   * Get payment methods for user
   * GET /api/payment/methods
   */
  getPaymentMethods: async (): Promise<any[]> => {
    const response = await axiosInstance.get<ApiResponse<any[]>>(
      API_ENDPOINTS.PAYMENT_METHODS
    );
    return response.data.data!;
  },
};
