import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface ProfileAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Profile {
  id: number;
  name: string;
  email: string;
  phone: string;
  position: string;
  restaurantId: number;
  restaurantName: string;
  profileImage?: string;
  address?: ProfileAddress;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateProfileRequest {
  name?: string;
  email?: string;
  phone?: string;
  position?: string;
  address?: Partial<ProfileAddress>;
}

export interface UploadProfileImageResponse {
  imageUrl: string;
}

class ProfileService {
  async getProfile(): Promise<{ profile: Profile }> {
    try {
      const response = await axiosInstance.get<{ profile: Profile }>(
        API_ENDPOINTS.PROFILE.GET
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateProfile(data: UpdateProfileRequest): Promise<{ profile: Profile }> {
    try {
      const response = await axiosInstance.patch<{ profile: Profile }>(
        API_ENDPOINTS.PROFILE.UPDATE,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async uploadProfileImage(formData: FormData): Promise<UploadProfileImageResponse> {
    try {
      const response = await axiosInstance.post<UploadProfileImageResponse>(
        API_ENDPOINTS.PROFILE.UPLOAD_IMAGE,
        formData,
        {
          headers: {
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteProfileImage(): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.PROFILE.DELETE_IMAGE
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new ProfileService();