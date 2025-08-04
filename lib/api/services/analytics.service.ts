import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export type AnalyticsPeriod = 'week' | 'month' | 'quarter';
export type DataPeriod = 'day' | 'week' | 'month';

export interface DashboardAnalyticsParams {
  period: AnalyticsPeriod;
  startDate?: string;
  endDate?: string;
}

export interface DashboardAnalytics {
  stats: {
    totalBookings: number;
    totalRevenue: number;
    avgBookingValue: number;
    cancelRate: number;
    peakTime: string;
    popularTable: number;
    returningCustomerRate: number;
  };
}

export interface WeeklyDataParams {
  startDate: string;
  endDate: string;
}

export interface WeeklyData {
  day: string;
  date: string;
  reservations: number;
  revenue: number;
  avgPartySize: number;
}

export interface CustomerTypeData {
  name: string;
  value: number;
  percentage: number;
  color: string;
}

export interface TimeSlotData {
  time: string;
  bookings: number;
  percentage: number;
}

export interface RevenueTrendParams {
  period: DataPeriod;
  months?: number;
}

export interface RevenueTrendData {
  date: string;
  revenue: number;
  bookings: number;
  avgValue: number;
}

class AnalyticsService {
  async getDashboardAnalytics(params: DashboardAnalyticsParams): Promise<DashboardAnalytics> {
    try {
      const response = await axiosInstance.get<DashboardAnalytics>(
        API_ENDPOINTS.ANALYTICS.DASHBOARD,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getWeeklyData(params: WeeklyDataParams): Promise<WeeklyData[]> {
    try {
      const response = await axiosInstance.get<WeeklyData[]>(
        API_ENDPOINTS.ANALYTICS.WEEKLY_DATA,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCustomerTypes(): Promise<CustomerTypeData[]> {
    try {
      const response = await axiosInstance.get<CustomerTypeData[]>(
        API_ENDPOINTS.ANALYTICS.CUSTOMER_TYPES
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTimeSlots(): Promise<TimeSlotData[]> {
    try {
      const response = await axiosInstance.get<TimeSlotData[]>(
        API_ENDPOINTS.ANALYTICS.TIME_SLOTS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getRevenueTrend(params: RevenueTrendParams): Promise<RevenueTrendData[]> {
    try {
      const response = await axiosInstance.get<RevenueTrendData[]>(
        API_ENDPOINTS.ANALYTICS.REVENUE_TREND,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new AnalyticsService();