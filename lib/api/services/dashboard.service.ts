import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface TodayStats {
  todayBookings: number;
  confirmedBookings: number;
  pendingBookings: number;
  expectedRevenue: number;
}

export interface Customer {
  id: number;
  name: string;
  phone: string;
  isVip: boolean;
}

export interface RecentBooking {
  id: number;
  customer: Customer;
  time: string;
  party: number;
  status: 'pending' | 'confirmed' | 'completed' | 'cancelled';
  special: string | null;
  tableNumber: number | null;
}

export interface KpiItem {
  value: number;
  change: number;
}

export interface KpiData {
  bookingCount: KpiItem;
  revenue: KpiItem;
  avgPartySize: KpiItem;
  satisfactionScore: KpiItem;
}

export interface TimeSlot {
  time: string;
  reservations: number;
  capacity: number;
  available: boolean;
}

export interface RecentBookingsParams {
  limit?: number;
}

export interface TimeSlotsParams {
  date: string;
}

class DashboardService {
  async getTodayStats(): Promise<TodayStats> {
    try {
      const response = await axiosInstance.get<TodayStats>(
        API_ENDPOINTS.DASHBOARD.TODAY_STATS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getRecentBookings(params?: RecentBookingsParams): Promise<RecentBooking[]> {
    try {
      const response = await axiosInstance.get<RecentBooking[]>(
        API_ENDPOINTS.DASHBOARD.RECENT_BOOKINGS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getKpi(): Promise<KpiData> {
    try {
      const response = await axiosInstance.get<KpiData>(
        API_ENDPOINTS.DASHBOARD.KPI
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getTimeSlots(params: TimeSlotsParams): Promise<TimeSlot[]> {
    try {
      const response = await axiosInstance.get<TimeSlot[]>(
        API_ENDPOINTS.DASHBOARD.TIME_SLOTS,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new DashboardService();