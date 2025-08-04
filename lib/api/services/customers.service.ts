import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface Customer {
  id: number;
  name: string;
  phone: string;
  email?: string;
  isVip: boolean;
  visitCount: number;
  lastVisit?: string;
  totalSpent: number;
  averagePartySize: number;
  tags?: string[];
  createdAt: string;
}

export interface CustomerDetail extends Customer {
  preferences?: string;
  allergies?: string;
  birthday?: string;
  notes?: string;
  updatedAt: string;
}

export interface CustomersListParams {
  page?: number;
  limit?: number;
  sort?: string;
  isVip?: boolean;
}

export interface CustomersListResponse {
  customers: Customer[];
  total: number;
  page: number;
  totalPages: number;
}

export interface CreateCustomerRequest {
  name: string;
  phone: string;
  email?: string;
  birthday?: string;
  preferences?: string;
  allergies?: string;
  notes?: string;
  tags?: string[];
}

export interface UpdateCustomerRequest {
  name?: string;
  phone?: string;
  email?: string;
  preferences?: string;
  allergies?: string;
  birthday?: string;
  notes?: string;
  tags?: string[];
}

export interface CustomerBooking {
  id: number;
  date: string;
  time: string;
  party: number;
  status: string;
  tableNumber?: number;
  totalAmount?: number;
  createdAt: string;
}

export interface CustomerReview {
  id: number;
  rating: number;
  comment?: string;
  reply?: string;
  createdAt: string;
  bookingId: number;
}

export interface UpdateVipStatusRequest {
  isVip: boolean;
}

class CustomersService {
  async getCustomers(params?: CustomersListParams): Promise<CustomersListResponse> {
    try {
      const response = await axiosInstance.get<CustomersListResponse>(
        API_ENDPOINTS.CUSTOMERS.LIST,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCustomerDetail(id: number): Promise<{ customer: CustomerDetail }> {
    try {
      const response = await axiosInstance.get<{ customer: CustomerDetail }>(
        API_ENDPOINTS.CUSTOMERS.DETAIL(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createCustomer(data: CreateCustomerRequest): Promise<{ customer: CustomerDetail }> {
    try {
      const response = await axiosInstance.post<{ customer: CustomerDetail }>(
        API_ENDPOINTS.CUSTOMERS.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateCustomer(
    id: number,
    data: UpdateCustomerRequest
  ): Promise<{ customer: CustomerDetail }> {
    try {
      const response = await axiosInstance.patch<{ customer: CustomerDetail }>(
        API_ENDPOINTS.CUSTOMERS.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteCustomer(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.CUSTOMERS.DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCustomerBookings(id: number): Promise<{ bookings: CustomerBooking[] }> {
    try {
      const response = await axiosInstance.get<{ bookings: CustomerBooking[] }>(
        API_ENDPOINTS.CUSTOMERS.BOOKINGS(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getCustomerReviews(id: number): Promise<{ reviews: CustomerReview[] }> {
    try {
      const response = await axiosInstance.get<{ reviews: CustomerReview[] }>(
        API_ENDPOINTS.CUSTOMERS.REVIEWS(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateVipStatus(
    id: number,
    data: UpdateVipStatusRequest
  ): Promise<{ customer: CustomerDetail }> {
    try {
      const response = await axiosInstance.patch<{ customer: CustomerDetail }>(
        API_ENDPOINTS.CUSTOMERS.UPDATE_VIP(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new CustomersService();