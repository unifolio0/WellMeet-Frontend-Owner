import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export type BookingStatus = 'pending' | 'confirmed' | 'completed' | 'cancelled';

export interface BookingCustomer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  isVip: boolean;
  visitCount?: number;
  lastVisit?: string;
  preferences?: string;
  allergies?: string;
}

export interface Booking {
  id: number;
  customer: BookingCustomer;
  date: string;
  time: string;
  party: number;
  status: BookingStatus;
  tableNumber?: number;
  note?: string;
  createdAt: string;
  updatedAt: string;
}

export interface BookingDetail extends Booking {
  specialRequests?: string;
  orderHistory?: Array<{
    menuItem: string;
    quantity: number;
    price: number;
  }>;
  totalAmount?: number;
  deposit?: number;
  createdBy?: string;
}

export interface BookingsListParams {
  date?: string;
  status?: BookingStatus;
  page?: number;
  limit?: number;
}

export interface BookingsListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  totalPages: number;
}

export interface UpdateBookingStatusRequest {
  status: BookingStatus;
  reason?: string;
}

export interface UpdateBookingRequest {
  time?: string;
  party?: number;
  tableNumber?: number;
  note?: string;
}

export interface SearchBookingsParams {
  q: string;
}

class BookingsService {
  async getBookings(params?: BookingsListParams): Promise<BookingsListResponse> {
    try {
      const response = await axiosInstance.get<BookingsListResponse>(
        API_ENDPOINTS.BOOKINGS.LIST,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getBookingDetail(id: number): Promise<{ booking: BookingDetail }> {
    try {
      const response = await axiosInstance.get<{ booking: BookingDetail }>(
        API_ENDPOINTS.BOOKINGS.DETAIL(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateBookingStatus(
    id: number,
    data: UpdateBookingStatusRequest
  ): Promise<{ booking: BookingDetail }> {
    try {
      const response = await axiosInstance.patch<{ booking: BookingDetail }>(
        API_ENDPOINTS.BOOKINGS.UPDATE_STATUS(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateBooking(
    id: number,
    data: UpdateBookingRequest
  ): Promise<{ booking: BookingDetail }> {
    try {
      const response = await axiosInstance.patch<{ booking: BookingDetail }>(
        API_ENDPOINTS.BOOKINGS.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteBooking(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.BOOKINGS.DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async searchBookings(params: SearchBookingsParams): Promise<{ bookings: Booking[] }> {
    try {
      const response = await axiosInstance.get<{ bookings: Booking[] }>(
        API_ENDPOINTS.BOOKINGS.SEARCH,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new BookingsService();