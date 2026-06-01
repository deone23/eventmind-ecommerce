import { axiosInstance } from '../api';
import { ApiResponse, PaginatedResponse } from '../types';
import { API_ENDPOINTS } from '../utils/constants';

// Notification Types
export interface NotificationItem {
  notificationId: string;
  userId: string;
  type: 'ORDER_CONFIRMATION' | 'PAYMENT_SUCCESS' | 'PAYMENT_FAILED' | 'ORDER_SHIPPED' | 'ORDER_DELIVERED' | 'PROMOTIONAL';
  title: string;
  message: string;
  status: 'READ' | 'UNREAD';
  createdAt: string;
  readAt?: string;
}

export interface NotificationPreferences {
  emailEnabled: boolean;
  smsEnabled: boolean;
  pushEnabled: boolean;
  preferences: {
    orderUpdates: boolean;
    paymentUpdates: boolean;
    promotional: boolean;
  };
}

export interface NotificationListResponse {
  notifications: NotificationItem[];
  pagination: {
    currentPage: number;
    pageSize: number;
    totalPages: number;
    totalElements: number;
  };
}

export const notificationService = {
  /**
   * Get user notifications (paginated)
   * GET /api/notifications
   */
  getNotifications: async (
    page: number = 0,
    size: number = 20,
    sortBy: string = 'createdAt',
    sortDirection: 'ASC' | 'DESC' = 'DESC'
  ): Promise<NotificationListResponse> => {
    const response = await axiosInstance.get<ApiResponse<NotificationListResponse>>(
      API_ENDPOINTS.NOTIFICATIONS,
      {
        params: { page, size, sortBy, sortDirection },
      }
    );
    return response.data.data!;
  },

  /**
   * Get notification by ID
   * GET /api/notifications/{id}
   */
  getNotificationById: async (notificationId: string): Promise<NotificationItem> => {
    const response = await axiosInstance.get<ApiResponse<NotificationItem>>(
      API_ENDPOINTS.NOTIFICATIONS + `/${notificationId}`
    );
    return response.data.data!;
  },

  /**
   * Mark notification as read
   * PUT /api/notifications/{id}/read
   */
  markAsRead: async (notificationId: string): Promise<void> => {
    await axiosInstance.put(
      API_ENDPOINTS.MARK_READ.replace(':id', notificationId)
    );
  },

  /**
   * Mark all notifications as read
   * PUT /api/notifications/read-all
   */
  markAllAsRead: async (): Promise<void> => {
    await axiosInstance.put('/api/notifications/read-all');
  },

  /**
   * Get notification preferences
   * GET /api/notifications/preferences
   */
  getPreferences: async (): Promise<NotificationPreferences> => {
    const response = await axiosInstance.get<ApiResponse<NotificationPreferences>>(
      '/api/notifications/preferences'
    );
    return response.data.data!;
  },

  /**
   * Update notification preferences
   * PUT /api/notifications/preferences
   */
  updatePreferences: async (data: NotificationPreferences): Promise<NotificationPreferences> => {
    const response = await axiosInstance.put<ApiResponse<NotificationPreferences>>(
      '/api/notifications/preferences',
      data
    );
    return response.data.data!;
  },

  /**
   * Delete notification
   * DELETE /api/notifications/{id}
   */
  deleteNotification: async (notificationId: string): Promise<void> => {
    await axiosInstance.delete(
      API_ENDPOINTS.NOTIFICATIONS + `/${notificationId}`
    );
  },
};
