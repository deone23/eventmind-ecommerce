import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';
import { NotificationState, Notification } from '../../types';
import { notificationService, NotificationItem } from '../../services/notificationService';
import { generateId } from '../../utils/helpers';
import toast from 'react-hot-toast';

const initialState: NotificationState = {
  notifications: [],
  unreadCount: 0,
};

// Map backend notification to frontend notification
const mapNotification = (item: NotificationItem): Notification => ({
  id: item.notificationId,
  type: item.type === 'ORDER_CONFIRMATION' || item.type === 'PAYMENT_SUCCESS' ? 'success' :
        item.type === 'PAYMENT_FAILED' ? 'error' : 'info',
  title: item.title,
  message: item.message,
  read: item.status === 'READ',
  createdAt: item.createdAt,
});

// Async Thunks

/**
 * Fetch notifications from backend
 */
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchNotifications',
  async ({ page = 0, size = 20 }: { page?: number; size?: number } = {}, { rejectWithValue }) => {
    try {
      const response = await notificationService.getNotifications(page, size);
      return response;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to fetch notifications');
    }
  }
);

/**
 * Mark notification as read (backend)
 */
export const markNotificationAsRead = createAsyncThunk(
  'notifications/markAsRead',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.markAsRead(notificationId);
      return notificationId;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark as read');
    }
  }
);

/**
 * Mark all notifications as read (backend)
 */
export const markAllNotificationsAsRead = createAsyncThunk(
  'notifications/markAllAsRead',
  async (_, { rejectWithValue }) => {
    try {
      await notificationService.markAllAsRead();
      return;
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || 'Failed to mark all as read');
    }
  }
);

/**
 * Delete notification (backend)
 */
export const deleteNotification = createAsyncThunk(
  'notifications/deleteNotification',
  async (notificationId: string, { rejectWithValue }) => {
    try {
      await notificationService.deleteNotification(notificationId);
      toast.success('Notification deleted');
      return notificationId;
    } catch (error: any) {
      const message = error.response?.data?.message || 'Failed to delete notification';
      toast.error(message);
      return rejectWithValue(message);
    }
  }
);

const notificationSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {
    // Local notification operations (for real-time updates)
    addNotification: (state, action: PayloadAction<Omit<Notification, 'id' | 'read' | 'createdAt'>>) => {
      const notification: Notification = {
        ...action.payload,
        id: generateId(),
        read: false,
        createdAt: new Date().toISOString(),
      };
      state.notifications.unshift(notification);
      state.unreadCount += 1;
    },
    markAsRead: (state, action: PayloadAction<string>) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    },
    markAllAsRead: (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    },
    removeNotification: (state, action: PayloadAction<string>) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.unreadCount = 0;
    },
    setNotifications: (state, action: PayloadAction<Notification[]>) => {
      state.notifications = action.payload;
      state.unreadCount = action.payload.filter(n => !n.read).length;
    },
  },
  extraReducers: (builder) => {
    // Fetch Notifications
    builder.addCase(fetchNotifications.fulfilled, (state, action) => {
      const { notifications } = action.payload;
      state.notifications = notifications.map(mapNotification);
      state.unreadCount = notifications.filter(n => n.status === 'UNREAD').length;
    });

    // Mark As Read
    builder.addCase(markNotificationAsRead.fulfilled, (state, action) => {
      const notification = state.notifications.find(n => n.id === action.payload);
      if (notification && !notification.read) {
        notification.read = true;
        state.unreadCount = Math.max(0, state.unreadCount - 1);
      }
    });

    // Mark All As Read
    builder.addCase(markAllNotificationsAsRead.fulfilled, (state) => {
      state.notifications.forEach(n => n.read = true);
      state.unreadCount = 0;
    });

    // Delete Notification
    builder.addCase(deleteNotification.fulfilled, (state, action) => {
      const index = state.notifications.findIndex(n => n.id === action.payload);
      if (index !== -1) {
        if (!state.notifications[index].read) {
          state.unreadCount = Math.max(0, state.unreadCount - 1);
        }
        state.notifications.splice(index, 1);
      }
    });
  },
});

export const {
  addNotification,
  markAsRead,
  markAllAsRead,
  removeNotification,
  clearNotifications,
  setNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;
