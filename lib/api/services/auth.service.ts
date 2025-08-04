import axiosInstance, { setAuthToken, setRefreshToken, clearAuthTokens } from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  refreshToken: string;
  user: {
    id: number;
    name: string;
    email: string;
    restaurantId: number;
    role: string;
  };
}

export interface RefreshTokenRequest {
  refreshToken: string;
}

export interface RefreshTokenResponse {
  token: string;
  refreshToken: string;
}

export interface LogoutResponse {
  message: string;
}

class AuthService {
  async login(data: LoginRequest): Promise<LoginResponse> {
    try {
      const response = await axiosInstance.post<LoginResponse>(
        API_ENDPOINTS.AUTH.LOGIN,
        data
      );
      
      const { token, refreshToken, user } = response.data;
      
      setAuthToken(token);
      setRefreshToken(refreshToken);
      
      localStorage.setItem('user', JSON.stringify(user));
      
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async logout(): Promise<LogoutResponse> {
    try {
      const response = await axiosInstance.post<LogoutResponse>(
        API_ENDPOINTS.AUTH.LOGOUT
      );
      
      clearAuthTokens();
      localStorage.removeItem('user');
      
      return response.data;
    } catch (error) {
      clearAuthTokens();
      localStorage.removeItem('user');
      throw handleApiError(error);
    }
  }

  async refreshToken(refreshToken: string): Promise<RefreshTokenResponse> {
    try {
      const response = await axiosInstance.post<RefreshTokenResponse>(
        API_ENDPOINTS.AUTH.REFRESH,
        { refreshToken }
      );
      
      const { token, refreshToken: newRefreshToken } = response.data;
      
      setAuthToken(token);
      setRefreshToken(newRefreshToken);
      
      return response.data;
    } catch (error) {
      clearAuthTokens();
      localStorage.removeItem('user');
      throw handleApiError(error);
    }
  }

  getUser() {
    const userStr = localStorage.getItem('user');
    return userStr ? JSON.parse(userStr) : null;
  }

  isAuthenticated(): boolean {
    const token = localStorage.getItem('accessToken');
    const user = this.getUser();
    return !!token && !!user;
  }
}

export default new AuthService();