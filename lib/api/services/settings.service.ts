import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface BookingPolicy {
  maxPartySize: number;
  minPartySize: number;
  advanceBookingDays: number;
  cancellationHours: number;
  depositRequired: boolean;
  depositAmount?: number;
  depositPolicy?: string;
  noShowPenalty?: number;
  specialRequestsAllowed: boolean;
  bookingInterval: number;
  maxBookingsPerDay: number;
  blackoutDates: string[];
}

export interface UpdateBookingPolicyRequest {
  maxPartySize?: number;
  minPartySize?: number;
  advanceBookingDays?: number;
  cancellationHours?: number;
  depositRequired?: boolean;
  depositAmount?: number;
  depositPolicy?: string;
  noShowPenalty?: number;
  specialRequestsAllowed?: boolean;
  bookingInterval?: number;
  maxBookingsPerDay?: number;
  blackoutDates?: string[];
}

export interface AccessLog {
  id: number;
  userId: number;
  userName: string;
  action: string;
  resource: string;
  details?: any;
  ipAddress: string;
  timestamp: string;
}

export interface AccessLogsParams {
  page?: number;
  limit?: number;
  userId?: number;
  action?: string;
}

export interface AccessLogsResponse {
  logs: AccessLog[];
  total: number;
  page: number;
  totalPages: number;
}

export interface Integration {
  pos: {
    connected: boolean;
    provider?: string;
    lastSync?: string;
  };
  payment: {
    connected: boolean;
    provider?: string;
    methods: string[];
  };
  delivery: {
    connected: boolean;
    platforms: string[];
  };
  marketing: {
    connected: boolean;
    provider?: string;
  };
  accounting: {
    connected: boolean;
    provider?: string;
  };
}

export interface ConnectIntegrationRequest {
  provider: string;
  apiKey?: string;
  apiSecret?: string;
  webhookUrl?: string;
  config?: {
    [key: string]: any;
  };
}

export interface ConnectIntegrationResponse {
  status: 'connected' | 'pending' | 'failed';
  message?: string;
  requiresAction?: {
    type: string;
    url?: string;
    instructions?: string;
  };
}

export interface TestIntegrationResponse {
  success: boolean;
  message: string;
  details?: {
    latency: number;
    version?: string;
    features?: string[];
  };
}

class SettingsService {
  async getBookingPolicy(): Promise<{ policy: BookingPolicy }> {
    try {
      const response = await axiosInstance.get<{ policy: BookingPolicy }>(
        API_ENDPOINTS.SETTINGS.BOOKING_POLICY
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateBookingPolicy(data: UpdateBookingPolicyRequest): Promise<{ policy: BookingPolicy }> {
    try {
      const response = await axiosInstance.patch<{ policy: BookingPolicy }>(
        API_ENDPOINTS.SETTINGS.UPDATE_BOOKING_POLICY,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getAccessLogs(params?: AccessLogsParams): Promise<AccessLogsResponse> {
    try {
      const response = await axiosInstance.get<AccessLogsResponse>(
        API_ENDPOINTS.SETTINGS.ACCESS_LOGS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getIntegrations(): Promise<{ integrations: Integration }> {
    try {
      const response = await axiosInstance.get<{ integrations: Integration }>(
        API_ENDPOINTS.SETTINGS.INTEGRATIONS.LIST
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async connectIntegration(
    service: string,
    data: ConnectIntegrationRequest
  ): Promise<ConnectIntegrationResponse> {
    try {
      const response = await axiosInstance.post<ConnectIntegrationResponse>(
        API_ENDPOINTS.SETTINGS.INTEGRATIONS.CONNECT(service),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async disconnectIntegration(service: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.SETTINGS.INTEGRATIONS.DISCONNECT(service)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async testIntegration(service: string): Promise<TestIntegrationResponse> {
    try {
      const response = await axiosInstance.post<TestIntegrationResponse>(
        API_ENDPOINTS.SETTINGS.INTEGRATIONS.TEST(service)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new SettingsService();