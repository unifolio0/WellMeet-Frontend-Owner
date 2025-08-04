import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface TwoFactorRequest {
  enabled: boolean;
  method?: 'sms' | 'email' | 'app';
}

export interface TwoFactorSettings {
  twoFactorEnabled: boolean;
  method?: string;
  qrCode?: string;
  secret?: string;
}

export interface Session {
  id: string;
  device: string;
  browser: string;
  ipAddress: string;
  location?: string;
  lastActive: string;
  isCurrent: boolean;
}

export interface LoginHistoryItem {
  id: number;
  timestamp: string;
  ipAddress: string;
  location?: string;
  device: string;
  browser: string;
  success: boolean;
  failureReason?: string;
}

export interface LoginHistoryParams {
  page?: number;
  limit?: number;
}

export interface LoginHistoryResponse {
  history: LoginHistoryItem[];
  total: number;
  page: number;
  totalPages: number;
}

export interface DeleteAccountRequest {
  password: string;
  reason?: string;
  feedback?: string;
}

class AccountService {
  async changePassword(data: ChangePasswordRequest): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.patch<{ message: string }>(
        API_ENDPOINTS.ACCOUNT.CHANGE_PASSWORD,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateTwoFactor(data: TwoFactorRequest): Promise<{ settings: TwoFactorSettings }> {
    try {
      const response = await axiosInstance.patch<{ settings: TwoFactorSettings }>(
        API_ENDPOINTS.ACCOUNT.TWO_FACTOR,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getSessions(): Promise<{ sessions: Session[] }> {
    try {
      const response = await axiosInstance.get<{ sessions: Session[] }>(
        API_ENDPOINTS.ACCOUNT.SESSIONS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async terminateSession(id: string): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.ACCOUNT.TERMINATE_SESSION(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async terminateOtherSessions(): Promise<{ message: string; terminatedCount: number }> {
    try {
      const response = await axiosInstance.delete<{ message: string; terminatedCount: number }>(
        API_ENDPOINTS.ACCOUNT.TERMINATE_OTHER_SESSIONS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getLoginHistory(params?: LoginHistoryParams): Promise<LoginHistoryResponse> {
    try {
      const response = await axiosInstance.get<LoginHistoryResponse>(
        API_ENDPOINTS.ACCOUNT.LOGIN_HISTORY,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteAccount(data: DeleteAccountRequest): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.ACCOUNT.DELETE_ACCOUNT,
        { data }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new AccountService();