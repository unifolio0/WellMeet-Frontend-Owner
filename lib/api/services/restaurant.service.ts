import axiosInstance from '../axios.instance';
import { API_ENDPOINTS } from '../../config/api.config';
import { handleApiError } from '../error.handler';

export interface RestaurantAddress {
  street: string;
  city: string;
  state: string;
  zipCode: string;
}

export interface Restaurant {
  id: number;
  name: string;
  category: string;
  address: RestaurantAddress;
  phone: string;
  email: string;
  description: string;
  images: string[];
  amenities: string[];
  capacity: number;
  tables: number;
  createdAt: string;
  updatedAt: string;
}

export interface UpdateRestaurantRequest {
  name?: string;
  category?: string;
  address?: Partial<RestaurantAddress>;
  phone?: string;
  email?: string;
  description?: string;
  amenities?: string[];
  capacity?: number;
  tables?: number;
}

export interface UploadImageResponse {
  imageUrl: string;
  id: number;
}

export interface DayOperatingHours {
  open: string;
  close: string;
  isClosed: boolean;
  breakTime?: {
    start: string;
    end: string;
  };
}

export interface OperatingHours {
  monday: DayOperatingHours;
  tuesday: DayOperatingHours;
  wednesday: DayOperatingHours;
  thursday: DayOperatingHours;
  friday: DayOperatingHours;
  saturday: DayOperatingHours;
  sunday: DayOperatingHours;
  holidays: {
    isOpen: boolean;
    hours?: {
      open: string;
      close: string;
    };
  };
}

export interface UpdateOperatingHoursRequest {
  [key: string]: Partial<DayOperatingHours> | {
    isOpen?: boolean;
    hours?: {
      open: string;
      close: string;
    };
  };
}

export interface MenuItem {
  id: number;
  category: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  available: boolean;
  isPopular: boolean;
  isNew: boolean;
  allergens?: string[];
  spicyLevel?: number;
  order: number;
  createdAt: string;
  updatedAt: string;
}

export interface CreateMenuItemRequest {
  category: string;
  name: string;
  description?: string;
  price: number;
  image?: string;
  allergens?: string[];
  spicyLevel?: number;
}

export interface UpdateMenuItemRequest {
  name?: string;
  description?: string;
  price?: number;
  category?: string;
  image?: string;
  allergens?: string[];
  spicyLevel?: number;
  isPopular?: boolean;
  isNew?: boolean;
  order?: number;
}

export interface UpdateMenuAvailabilityRequest {
  available: boolean;
}

class RestaurantService {
  async getInfo(): Promise<{ restaurant: Restaurant }> {
    try {
      const response = await axiosInstance.get<{ restaurant: Restaurant }>(
        API_ENDPOINTS.RESTAURANT.INFO
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateInfo(data: UpdateRestaurantRequest): Promise<{ restaurant: Restaurant }> {
    try {
      const response = await axiosInstance.patch<{ restaurant: Restaurant }>(
        API_ENDPOINTS.RESTAURANT.UPDATE_INFO,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async uploadImage(formData: FormData): Promise<UploadImageResponse> {
    try {
      const response = await axiosInstance.post<UploadImageResponse>(
        API_ENDPOINTS.RESTAURANT.UPLOAD_IMAGE,
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

  async deleteImage(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.RESTAURANT.DELETE_IMAGE(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getOperatingHours(): Promise<{ operatingHours: OperatingHours }> {
    try {
      const response = await axiosInstance.get<{ operatingHours: OperatingHours }>(
        API_ENDPOINTS.RESTAURANT.OPERATING_HOURS
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateOperatingHours(
    data: UpdateOperatingHoursRequest
  ): Promise<{ operatingHours: OperatingHours }> {
    try {
      const response = await axiosInstance.patch<{ operatingHours: OperatingHours }>(
        API_ENDPOINTS.RESTAURANT.UPDATE_OPERATING_HOURS,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async getMenu(): Promise<{ items: MenuItem[] }> {
    try {
      const response = await axiosInstance.get<{ items: MenuItem[] }>(
        API_ENDPOINTS.RESTAURANT.MENU.LIST
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async createMenuItem(data: CreateMenuItemRequest): Promise<{ menuItem: MenuItem }> {
    try {
      const response = await axiosInstance.post<{ menuItem: MenuItem }>(
        API_ENDPOINTS.RESTAURANT.MENU.CREATE,
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateMenuItem(
    id: number,
    data: UpdateMenuItemRequest
  ): Promise<{ menuItem: MenuItem }> {
    try {
      const response = await axiosInstance.patch<{ menuItem: MenuItem }>(
        API_ENDPOINTS.RESTAURANT.MENU.UPDATE(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async deleteMenuItem(id: number): Promise<{ message: string }> {
    try {
      const response = await axiosInstance.delete<{ message: string }>(
        API_ENDPOINTS.RESTAURANT.MENU.DELETE(id)
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }

  async updateMenuItemAvailability(
    id: number,
    data: UpdateMenuAvailabilityRequest
  ): Promise<{ menuItem: MenuItem }> {
    try {
      const response = await axiosInstance.patch<{ menuItem: MenuItem }>(
        API_ENDPOINTS.RESTAURANT.MENU.UPDATE_AVAILABILITY(id),
        data
      );
      return response.data;
    } catch (error) {
      throw handleApiError(error);
    }
  }
}

export default new RestaurantService();