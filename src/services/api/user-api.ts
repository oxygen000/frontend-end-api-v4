import axios from 'axios';
import { apiClient } from './client';
import type {
  MaleUser,
  FemaleUser,
  ChildUser,
  DisabledUser,
  UserResponse,
  UserListResponse,
  CountResponse,
} from './types';

/**
 * User management APIs for different user types
 */

// API functions for male users
export const maleApi = {
  create: async (userData: MaleUser, image?: File): Promise<UserResponse> => {
    try {
      const formData = new FormData();

      // Check for vehicle information and structure it properly
      const vehicleFields = [
        'manufacture_year',
        'vehicle_model',
        'vehicle_color',
        'chassis_number',
        'vehicle_number',
        'license_plate',
        'license_expiration',
      ];

      // Extract and remove vehicle fields from userData to structure them properly
      const userDataCopy = { ...userData } as Record<string, any>; // Type as Record for indexing
      const vehicleInfo: Record<string, any> = {};
      let hasVehicleData = false;

      vehicleFields.forEach((field) => {
        if (field in userDataCopy) {
          vehicleInfo[field] = userDataCopy[field];
          delete userDataCopy[field]; // Remove from original to avoid duplication
          if (userDataCopy[field]) {
            hasVehicleData = true;
          }
        }
      });

      // Add structured vehicle_info to userData if vehicle data exists
      if (hasVehicleData) {
        userDataCopy.vehicle_info = vehicleInfo;
      }

      // Add user data with properly structured vehicle info
      formData.append('user_data', JSON.stringify(userDataCopy));

      // Set category and form_type for male users
      formData.append('category', 'male');
      formData.append('form_type', 'man');

      // Add bypass parameters for face validation
      formData.append('bypass_angle_check', 'true');
      formData.append('train_multiple', 'true');

      // Add individual fields that the backend expects
      formData.append('name', userData.name);
      if (userData.employee_id)
        formData.append('employee_id', userData.employee_id);
      if (userData.job) formData.append('job', userData.job);
      if (userData.job) formData.append('occupation', userData.job);
      if (userData.address) formData.append('address', userData.address);

      // Add vehicle fields individually as well for compatibility
      if (hasVehicleData) {
        Object.entries(vehicleInfo).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
      }

      // Add image if provided
      if (image) {
        // Validate file type
        if (!image.type.startsWith('image/')) {
          throw new Error('Invalid file type. Please upload an image file.');
        }

        // Validate file size (max 1MB)
        if (image.size > 1024 * 1024) {
          throw new Error(
            'File size too large. Please upload an image smaller than 1MB.'
          );
        }

        formData.append('file', image);
      }

      // Use the main registration endpoint instead of /males
      const response = await apiClient.post('/register/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Convert the registration response to UserResponse format
      if (response.data && (response.data.user || response.data.user_id)) {
        return {
          user: response.data.user || {
            id: response.data.user_id,
            name: userData.name,
          },
          success: true,
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error creating male user:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getAll: async (skip = 0, limit = 100): Promise<UserListResponse> => {
    // Route to search with category filter instead of /males endpoint
    const response = await apiClient.get('/search', {
      params: {
        category: 'male',
        skip,
        limit,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};

// API functions for female users
export const femaleApi = {
  create: async (userData: FemaleUser, image?: File): Promise<UserResponse> => {
    try {
      const formData = new FormData();

      // Check for vehicle information and structure it properly
      const vehicleFields = [
        'manufacture_year',
        'vehicle_model',
        'vehicle_color',
        'chassis_number',
        'vehicle_number',
        'license_plate',
        'license_expiration',
      ];

      // Extract and remove vehicle fields from userData to structure them properly
      const userDataCopy = { ...userData } as Record<string, any>; // Type as Record for indexing
      const vehicleInfo: Record<string, any> = {};
      let hasVehicleData = false;

      vehicleFields.forEach((field) => {
        if (field in userDataCopy) {
          vehicleInfo[field] = userDataCopy[field];
          delete userDataCopy[field]; // Remove from original to avoid duplication
          if (userDataCopy[field]) {
            hasVehicleData = true;
          }
        }
      });

      // Add structured vehicle_info to userData if vehicle data exists
      if (hasVehicleData) {
        userDataCopy.vehicle_info = vehicleInfo;
      }

      // Add user data with properly structured vehicle info
      formData.append('user_data', JSON.stringify(userDataCopy));

      // Set category and form_type for female users
      formData.append('category', 'female');
      formData.append('form_type', 'woman');

      // Add bypass parameters for face validation
      formData.append('bypass_angle_check', 'true');
      formData.append('train_multiple', 'true');

      // Add individual fields that the backend expects
      formData.append('name', userData.name);
      if (userData.employee_id)
        formData.append('employee_id', userData.employee_id);
      if (userData.job) formData.append('job', userData.job);
      if (userData.job) formData.append('occupation', userData.job);
      if (userData.address) formData.append('address', userData.address);

      // Add vehicle fields individually as well for compatibility
      if (hasVehicleData) {
        Object.entries(vehicleInfo).forEach(([key, value]) => {
          if (value) {
            formData.append(key, value);
          }
        });
      }

      // Add image if provided
      if (image) {
        // Validate file type
        if (!image.type.startsWith('image/')) {
          throw new Error('Invalid file type. Please upload an image file.');
        }

        // Validate file size (max 1MB)
        if (image.size > 1024 * 1024) {
          throw new Error(
            'File size too large. Please upload an image smaller than 1MB.'
          );
        }

        formData.append('file', image);
      }

      // Use the main registration endpoint instead of /females
      const response = await apiClient.post('/register/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      // Convert the registration response to UserResponse format
      if (response.data && (response.data.user || response.data.user_id)) {
        return {
          user: response.data.user || {
            id: response.data.user_id,
            name: userData.name,
          },
          success: true,
        };
      }

      return response.data;
    } catch (error) {
      console.error('Error creating female user:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getAll: async (skip = 0, limit = 100): Promise<UserListResponse> => {
    // Route to search with category filter instead of /females endpoint
    const response = await apiClient.get('/search', {
      params: {
        category: 'female',
        skip,
        limit,
      },
    });
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get(`/users/${id}`);
    return response.data;
  },
};

// API functions for child users
export const childApi = {
  create: async (userData: ChildUser, image?: File): Promise<UserResponse> => {
    try {
      const formData = new FormData();

      // Add user data
      formData.append('user_data', JSON.stringify(userData));

      // Add image if provided
      if (image) {
        // Validate file type
        if (!image.type.startsWith('image/')) {
          throw new Error('Invalid file type. Please upload an image file.');
        }

        // Validate file size (max 1MB)
        if (image.size > 1024 * 1024) {
          throw new Error(
            'File size too large. Please upload an image smaller than 1MB.'
          );
        }

        formData.append('file', image);
      }

      const response = await apiClient.post('/children', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating child user:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getAll: async (skip = 0, limit = 100): Promise<UserListResponse> => {
    const response = await apiClient.get('/children', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get(`/children/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/children/${id}`);
    return response.data;
  },
};

// API functions for disabled users
export const disabledApi = {
  create: async (
    userData: DisabledUser,
    image?: File
  ): Promise<UserResponse> => {
    try {
      const formData = new FormData();

      // Remove ID if present to prevent conflicts
      if (userData.id) {
        const { id, ...userDataWithoutId } = userData;
        userData = userDataWithoutId as DisabledUser;
      }

      // Add user data
      formData.append('user_data', JSON.stringify(userData));

      // Add image if provided
      if (image) {
        // Validate file type
        if (!image.type.startsWith('image/')) {
          throw new Error('Invalid file type. Please upload an image file.');
        }

        // Validate file size (max 1MB)
        if (image.size > 1024 * 1024) {
          throw new Error(
            'File size too large. Please upload an image smaller than 1MB.'
          );
        }

        formData.append('file', image);
      }

      const response = await apiClient.post('/disabled', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return response.data;
    } catch (error) {
      console.error('Error creating disabled user:', error);
      if (axios.isAxiosError(error)) {
        const errorMessage = error.response?.data?.message || error.message;
        throw new Error(errorMessage);
      }
      throw error;
    }
  },

  getAll: async (skip = 0, limit = 100): Promise<UserListResponse> => {
    const response = await apiClient.get('/disabled', {
      params: { skip, limit },
    });
    return response.data;
  },

  getById: async (id: string): Promise<UserResponse> => {
    const response = await apiClient.get(`/disabled/${id}`);
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/disabled/${id}`);
    return response.data;
  },
};

// Common API functions for user operations
export const commonApi = {
  search: async (
    query: string,
    category?: string
  ): Promise<UserListResponse> => {
    const response = await apiClient.get('/search', {
      params: { query, category },
    });
    return response.data;
  },

  getCount: async (category?: string): Promise<CountResponse> => {
    const response = await apiClient.get('/count', { params: { category } });
    return response.data;
  },

  delete: async (id: string): Promise<any> => {
    const response = await apiClient.delete(`/users/${id}`);
    
    // Enhanced cache clearing with retry mechanism
    const clearCachesWithRetry = async (retries = 3): Promise<void> => {
      try {
        // Clear all search caches to ensure fresh data after delete
        sessionStorage.removeItem('searchData');
        sessionStorage.removeItem('childrenSearchData');
        sessionStorage.removeItem('disabilitiesSearchData');

        // Create a custom event that other components can listen to
        window.dispatchEvent(new CustomEvent('data-updated'));

        // Try to clear server-side cache for immediate freshness
        await apiClient.post(
          '/cache/clear',
          {},
          {
            timeout: 2000, // Short timeout to avoid blocking UI
          }
        );
        console.log('Server cache cleared successfully after delete operation');
      } catch (error) {
        // Retry server cache clearing if it fails
        if (retries > 0) {
          console.warn(`Cache clearing failed, retrying (${retries} attempts left)...`);
          await new Promise(resolve => setTimeout(resolve, 500)); // Small delay
          return clearCachesWithRetry(retries - 1);
        } else {
          // Don't let cache clearing errors stop the flow
          console.warn(
            'Failed to clear server cache after delete, data might be slightly delayed',
            error
          );
        }
      }
    };
    
    // Call the cache clearing function with retries
    await clearCachesWithRetry();
    
    console.log('Cleared all search caches after delete operation');

    return response.data;
  },
};

// Export all user APIs
export const userApi = {
  male: maleApi,
  female: femaleApi,
  child: childApi,
  disabled: disabledApi,
  common: commonApi,
};

export default userApi;
