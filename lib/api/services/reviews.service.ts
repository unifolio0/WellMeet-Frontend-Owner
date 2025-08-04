import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface ReviewCustomer {
  id: number;
  name: string;
}

export interface ReviewBooking {
  id: number;
  date: string;
  party: number;
}

export interface Review {
  id: number;
  customer: ReviewCustomer;
  booking: ReviewBooking;
  rating: number;
  comment?: string;
  reply?: {
    content: string;
    createdAt: string;
    updatedAt?: string;
  };
  images?: string[];
  createdAt: string;
}

export interface ReviewsListParams {
  page?: number;
  limit?: number;
  rating?: number;
  hasReply?: boolean;
}

export interface ReviewsListResponse {
  reviews: Review[];
  total: number;
  page: number;
  totalPages: number;
}

export interface ReviewStats {
  avgRating: number;
  totalCount: number;
  distribution: {
    '1': number;
    '2': number;
    '3': number;
    '4': number;
    '5': number;
  };
  replyRate: number;
  recentTrend: 'up' | 'down' | 'stable';
}

export interface AddReplyRequest {
  reply: string;
}

export interface UpdateReplyRequest {
  reply: string;
}

class ReviewsService {
  async getReviews(params?: ReviewsListParams): Promise<ReviewsListResponse> {
    try {
      const response = await axiosInstance.get<ReviewsListResponse>(
        API_ENDPOINTS.REVIEWS.LIST,
        { params }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getReviewStats(): Promise<ReviewStats> {
    try {
      const response = await axiosInstance.get<ReviewStats>(
        API_ENDPOINTS.REVIEWS.STATS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async addReply(id: number, data: AddReplyRequest): Promise<{ review: Review }> {
    try {
      const response = await axiosInstance.post<{ review: Review }>(
        API_ENDPOINTS.REVIEWS.ADD_REPLY(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateReply(id: number, data: UpdateReplyRequest): Promise<{ review: Review }> {
    try {
      const response = await axiosInstance.patch<{ review: Review }>(
        API_ENDPOINTS.REVIEWS.UPDATE_REPLY(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteReply(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.REVIEWS.DELETE_REPLY(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new ReviewsService();