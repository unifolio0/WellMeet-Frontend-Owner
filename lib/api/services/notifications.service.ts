import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface Notification {
  id: number;
  type: string;
  title: string;
  message: string;
  data?: {
    bookingId?: number;
    reviewId?: number;
    customerId?: number;
  };
  isRead: boolean;
  createdAt: string;
}

export interface NotificationsListParams {
  type?: 'booking' | 'review' | 'system' | 'marketing';
  unreadOnly?: boolean;
  page?: number;
  limit?: number;
}

export interface NotificationsListResponse {
  notifications: Notification[];
  unreadCount: number;
  total: number;
  page: number;
  totalPages: number;
}

export interface NotificationSettings {
  booking: {
    new: boolean;
    cancelled: boolean;
    modified: boolean;
  };
  review: {
    new: boolean;
    lowRating: boolean;
  };
  system: {
    updates: boolean;
    maintenance: boolean;
  };
  marketing: {
    promotions: boolean;
    newsletter: boolean;
  };
  channels: {
    email: boolean;
    sms: boolean;
    push: boolean;
  };
}

export interface UpdateNotificationSettingsRequest {
  booking?: {
    new?: boolean;
    cancelled?: boolean;
    modified?: boolean;
  };
  review?: {
    new?: boolean;
    lowRating?: boolean;
  };
  system?: {
    updates?: boolean;
    maintenance?: boolean;
  };
  marketing?: {
    promotions?: boolean;
    newsletter?: boolean;
  };
  channels?: {
    email?: boolean;
    sms?: boolean;
    push?: boolean;
  };
}

class NotificationsService {
  async getNotifications(params?: NotificationsListParams): Promise<NotificationsListResponse> {
    try {
      const response = await axiosInstance.get<NotificationsListResponse>(
        API_ENDPOINTS.NOTIFICATIONS.LIST,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async markAsRead(id: number): Promise<{ notification: Notification }> {
    try {
      const response = await axiosInstance.patch<{ notification: Notification }>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_READ(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async markAllAsRead(): Promise<{ message: string; updatedCount: number }> {
    try {
      const response = await axiosInstance.patch<{ message: string; updatedCount: number }>(
        API_ENDPOINTS.NOTIFICATIONS.MARK_ALL_READ
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteNotification(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.NOTIFICATIONS.DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSettings(): Promise<{ settings: NotificationSettings }> {
    try {
      const response = await axiosInstance.get<{ settings: NotificationSettings }>(
        API_ENDPOINTS.NOTIFICATIONS.SETTINGS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateSettings(data: UpdateNotificationSettingsRequest): Promise<{ settings: NotificationSettings }> {
    try {
      const response = await axiosInstance.patch<{ settings: NotificationSettings }>(
        API_ENDPOINTS.NOTIFICATIONS.UPDATE_SETTINGS,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new NotificationsService();