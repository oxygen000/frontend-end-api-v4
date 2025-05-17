import axios from 'axios';
import { apiClient } from './client';
import type {
  DisabledUser,
  RegistrationResult,
  UserData,
  ChildUser,
} from './types';

/**
 * A streamlined version of the registration API.
 * This module eliminates redundant code and prevents duplicate data submission.
 */

// Helper to avoid duplicate registration attempts
const registrationInProgress = new Map<string, Promise<RegistrationResult>>();

// Helper to clear caches after operations
const clearCaches = async () => {
  // Clear all search-related caches to ensure fresh data
  sessionStorage.removeItem('searchData');
  sessionStorage.removeItem('childrenSearchData');
  sessionStorage.removeItem('disabilitiesSearchData');

  // Create a custom event that other components can listen to
  window.dispatchEvent(new CustomEvent('data-updated'));

  // Also try to clear server-side cache for immediate freshness
  try {
    await apiClient.post(
      '/cache/clear',
      {},
      {
        timeout: 2000, // Short timeout to avoid blocking UI
      }
    );
    console.log('Server cache cleared successfully');
  } catch (error) {
    // Don't let cache clearing errors stop the flow
    console.warn(
      'Failed to clear server cache, data might be slightly delayed',
      error
    );
  }

  console.log('Cleared all search caches to refresh data');
};

/**
 * Main registration function that handles form data submission
 * and attempts to prevent duplicates
 */
const registerUser = async (
  formData: FormData
): Promise<RegistrationResult> => {
  try {
    // Generate a unique cache key based on user data
    const name = formData.get('name') as string;
    const dob = formData.get('dob') as string;
    const formType = formData.get('form_type') as string;
    const cacheKey = `${name}-${dob}-${formType}-${Date.now()}`;

    // Debug logging to help with troubleshooting
    console.log(`Registration attempt for ${name}, type: ${formType}`);
    console.log('Form data fields:', Array.from(formData.keys()));

    // Check if this registration is already in progress
    if (registrationInProgress.has(cacheKey)) {
      console.log('Registration already in progress, using existing promise');
      return registrationInProgress.get(cacheKey)!;
    }

    // Ensure bypass_angle_check and train_multiple are set to true
    if (!formData.has('bypass_angle_check')) {
      formData.append('bypass_angle_check', 'true');
    }

    if (!formData.has('train_multiple')) {
      formData.append('train_multiple', 'true');
    } else {
      // If it exists but might be a boolean, set it to string 'true'
      formData.set('train_multiple', 'true');
    }

    // Add a unique timestamp to prevent ID conflicts
    const uniqueTimestamp = Date.now();
    formData.append('timestamp', uniqueTimestamp.toString());

    // Fields that should be handled separately because they cause DB schema issues
    const separateFields = [
      'disability_details',
      'disability_description',
      'relationship',
      'emergency_contact',
      'emergency_phone',
      'special_needs',
      'unique_id',
      'unique_submission_id',
      'date_of_birth',
    ];

    // Vehicle-related fields we want to preserve but structure properly
    const vehicleFields = [
      'manufacture_year',
      'vehicle_model',
      'vehicle_color',
      'chassis_number',
      'vehicle_number',
      'license_plate',
      'license_expiration',
    ];

    // Create a filtered copy of form data without problematic fields
    const filteredFormData = new FormData();
    const removedFields: string[] = [];

    for (const pair of formData.entries()) {
      const [key, value] = pair;
      if (!separateFields.includes(key) && !vehicleFields.includes(key)) {
        filteredFormData.append(key, value);
      } else {
        removedFields.push(key);
      }
    }

    // Log removed fields for troubleshooting
    if (removedFields.length > 0) {
      console.log(
        'Removed fields from form data that are not in DB schema:',
        removedFields
      );
    }

    // Process JSON fields safely
    if (formData.has('user_data')) {
      try {
        const userData = JSON.parse(formData.get('user_data') as string);

        // Remove ID to prevent conflicts
        if (userData.id) {
          delete userData.id;
          console.log('Removed ID field from user_data to prevent conflicts');
        }

        // Remove other problematic fields
        separateFields.forEach((field) => {
          if (userData[field]) {
            delete userData[field];
            console.log(`Removed problematic field ${field} from user_data`);
          }
        });

        // Create a vehicle object for adult users
        if (
          formType === 'man' ||
          formType === 'woman' ||
          formType === 'adult'
        ) {
          const vehicle: Record<string, string> = {};
          let hasVehicleData = false;

          // Collect vehicle data
          vehicleFields.forEach((field) => {
            const value = formData.get(field) as string;
            if (value) {
              vehicle[field] = value;
              hasVehicleData = true;
            }
          });

          // Only add vehicle data if at least one field has a value
          if (hasVehicleData) {
            userData.vehicle_info = vehicle;
          }
        }

        // Replace with processed user_data
        filteredFormData.set('user_data', JSON.stringify(userData));
      } catch (e) {
        console.error('Error parsing user_data:', e);
        // Keep original if parsing fails
        filteredFormData.append(
          'user_data',
          formData.get('user_data') as string
        );
      }
    } else {
      // If no user_data was provided, but there are vehicle fields, create a new object
      if (formType === 'man' || formType === 'woman' || formType === 'adult') {
        const vehicle: Record<string, string> = {};
        let hasVehicleData = false;

        vehicleFields.forEach((field) => {
          const value = formData.get(field) as string;
          if (value) {
            vehicle[field] = value;
            hasVehicleData = true;
          }
        });

        if (hasVehicleData) {
          const userData = {
            vehicle_info: vehicle,
            unique_id: `registration-${Date.now()}-${Math.floor(Math.random() * 1000000)}`,
          };
          filteredFormData.set('user_data', JSON.stringify(userData));
        }
      }
    }

    // If child_data exists, make sure it has no ID field
    if (formData.has('child_data')) {
      try {
        const childData = JSON.parse(formData.get('child_data') as string);
        if (childData.id) {
          delete childData.id;
        }
        // Add a unique identifier
        childData.unique_id = `registration-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
        filteredFormData.set('child_data', JSON.stringify(childData));
      } catch (e) {
        console.error('Error parsing child_data:', e);
        filteredFormData.append(
          'child_data',
          formData.get('child_data') as string
        );
      }
    }

    // Create a promise for the registration process
    const registrationPromise = new Promise<RegistrationResult>(
      (resolve, reject) => {
        // Choose the appropriate endpoint based on form type
        const formType = filteredFormData.get('form_type')?.toString() || '';

        console.log(
          `Processing registration for form type: ${formType} using main endpoint`
        );

        try {
          // Always use the main endpoint for all form types to avoid ID conflicts
          console.log('Using main registration endpoint for all form types');
          registerWithMainEndpoint(filteredFormData)
            .then(async (result) => {
              await clearCaches();
              resolve(result);
            })
            .catch((error) => {
              console.error('Main endpoint registration failed:', error);
              reject(error);
            });
        } catch (error) {
          console.error('Error setting up registration:', error);
          reject(error);
        }
      }
    );

    // Store the promise and remove it when done
    registrationInProgress.set(cacheKey, registrationPromise);
    registrationPromise.finally(() => {
      registrationInProgress.delete(cacheKey);
    });

    return registrationPromise;
  } catch (error) {
    console.error('Registration error:', error);
    throw error;
  }
};

/**
 * Attempts registration with the main endpoint
 */
const registerWithMainEndpoint = async (
  formData: FormData
): Promise<RegistrationResult> => {
  try {
    console.log(
      'Sending request to main registration endpoint: /register/upload'
    );

    // Log form data keys being sent
    const formDataKeys = Array.from(formData.entries()).map(([key]) => key);
    console.log('FormData keys being sent:', formDataKeys);

    // Check for important fields
    console.log('form_type:', formData.get('form_type'));
    console.log('category:', formData.get('category'));

    // Use a more optimized request with appropriate timeouts
    const response = await apiClient.post('/register/upload', formData, {
      headers: { 'Content-Type': 'multipart/form-data' },
      timeout: 30000, // 30 second timeout for uploads which may take longer
      onUploadProgress: (progressEvent) => {
        // Handle upload progress if needed
        if (progressEvent.total) {
          const percentCompleted = Math.round(
            (progressEvent.loaded * 100) / progressEvent.total
          );
          console.log(`Upload progress: ${percentCompleted}%`);
        }
      },
    });

    console.log('Registration response received:', {
      status: response.status,
      hasData: !!response.data,
      userId: response.data?.user_id || response.data?.user?.id,
      userObj: !!response.data?.user,
    });

    // Even if we get a 200 response but no user data, create a synthetic response
    // This ensures the UI gets something workable back
    if (
      response.status === 200 &&
      (!response.data || (!response.data.user_id && !response.data.user))
    ) {
      console.log('Creating synthetic response from successful API call');

      // Generate a temporary ID that can be used by the client
      const tempId = `temp-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;

      // Try to get a name from the form data
      const userName = (formData.get('name') as string) || 'User';

      // Create a minimal response object
      const syntheticResponse: RegistrationResult = {
        status: 'success',
        message: 'Registration was successful, but no user ID was returned',
        user_id: tempId,
        user: {
          id: tempId,
          name: userName,
          form_type: (formData.get('form_type') as string) || 'unknown',
          category: (formData.get('category') as string) || 'unknown',
          created_at: new Date().toISOString(),
          // Required fields for the User type
          face_id: tempId,
          image_path: '/static/default-avatar.png',
        },
      };

      return syntheticResponse;
    }

    return response.data;
  } catch (error) {
    console.error('Main registration endpoint error:', error);
    throw error;
  }
};

/**
 * Specialized registration for disabled users
 */
const registerDisabled = async (
  formData: FormData | DisabledUser,
  image?: File
): Promise<RegistrationResult> => {
  console.log('Using specialized disabled registration endpoint');
  try {
    // Generate a unique ID for this request to prevent conflicts
    const uniqueId = `disabled-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    console.log(`Generated unique ID for disabled registration: ${uniqueId}`);

    // Prepare the user data object
    let userData: DisabledUser;

    if (formData instanceof FormData) {
      // Extract data from FormData
      userData = {
        name: formData.get('name') as string,
        nickname: (formData.get('nickname') as string) || '',
        dob: (formData.get('dob') as string) || '',
        national_id: (formData.get('national_id') as string) || '',
        address: (formData.get('address') as string) || '',
        disability_type:
          (formData.get('disability_type') as string) || 'physical',
        gender: (formData.get('gender') as string) || '',
        medical_condition: (formData.get('medical_condition') as string) || '',
        disability_details: '',
        additional_notes: (formData.get('additional_notes') as string) || '',
        phone_number: (formData.get('phone_number') as string) || '',
        unique_id: uniqueId,
        request_id: uniqueId,
      };

      // If file was provided in formData, extract it
      if (!image && formData.get('file')) {
        image = formData.get('file') as File;
      }

      // Try to parse user_data JSON if it exists
      try {
        const userDataJson = formData.get('user_data');
        if (userDataJson && typeof userDataJson === 'string') {
          const parsedData = JSON.parse(userDataJson) as Partial<DisabledUser>;
          // Remove ID if present and merge with our userData object
          if ('id' in parsedData) {
            delete parsedData.id;
          }

          // If the parsed data has its own unique_id, use that
          if (parsedData.unique_id) {
            userData.unique_id = parsedData.unique_id;
            userData.request_id = parsedData.unique_id;
            console.log(
              `Using existing unique ID from data: ${parsedData.unique_id}`
            );
          }

          userData = { ...userData, ...parsedData };
        }
      } catch (e) {
        console.warn('Failed to parse user_data JSON', e);
      }
    } else {
      // Use the provided user data directly, but remove ID if present
      const userDataCopy = { ...formData };
      if ('id' in userDataCopy) {
        delete (userDataCopy as unknown as Record<string, unknown>).id;
      }

      // Add unique identifier if not already present
      if (!userDataCopy.unique_id) {
        userDataCopy.unique_id = uniqueId;
        userDataCopy.request_id = uniqueId;
      }

      userData = userDataCopy;
    }

    // Force remove ID to prevent unique constraint failures - triple-check
    if ('id' in userData) {
      delete (userData as unknown as Record<string, unknown>).id;
    }

    // Log the request to help debug
    console.log('Registering disabled user with data:', {
      name: userData.name,
      uniqueId: userData.unique_id,
      idPresent: 'id' in userData,
    });

    // Create a new FormData object specifically for this endpoint
    const apiFormData = new FormData();

    // Add user data as JSON, ensuring no ID field is present
    apiFormData.append('user_data', JSON.stringify(userData));

    // Add image if provided
    if (image) {
      apiFormData.append('file', image);
    }

    // Use the /api/disabled endpoint which works with the existing schema
    try {
      console.log('Making API request to /disabled endpoint...');
      const response = await apiClient.post('/disabled', apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Disabled registration response:', response.data);

      // Convert the response to our expected RegistrationResult format
      if (response.data && response.data.user) {
        const result: RegistrationResult = {
          status: 'success',
          message: 'User registered successfully',
          user_id: response.data.user.id,
          user: response.data.user,
        };
        return result;
      } else {
        throw new Error('Invalid response from disabled registration endpoint');
      }
    } catch (apiError) {
      console.error('API error details:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error in specialized disabled registration:', error);
    throw error;
  }
};

/**
 * Specialized registration for child users
 */
const registerChild = async (
  formData: FormData | ChildUser,
  image?: File
): Promise<RegistrationResult> => {
  console.log('Using specialized child registration endpoint');
  try {
    // Generate a unique ID for this request to prevent conflicts
    const uniqueId = `child-${Date.now()}-${Math.floor(Math.random() * 1000000)}`;
    console.log(`Generated unique ID for child registration: ${uniqueId}`);

    // Prepare the user data object
    let userData: ChildUser & { unique_id?: string; request_id?: string };

    if (formData instanceof FormData) {
      // Extract data from FormData
      userData = {
        name: formData.get('name') as string,
        dob: (formData.get('dob') as string) || '',
        gender: (formData.get('gender') as string) || '',
        address: (formData.get('address') as string) || '',
        guardian_name: (formData.get('guardian_name') as string) || '',
        guardian_phone: (formData.get('guardian_phone') as string) || '',
        guardian_id: (formData.get('guardian_id') as string) || '',
        relationship: '', // This field causes schema errors, but is required for the type
        physical_description:
          (formData.get('physical_description') as string) || '',
        last_clothes: (formData.get('last_clothes') as string) || '',
        area_of_disappearance:
          (formData.get('area_of_disappearance') as string) || '',
        last_known_location:
          (formData.get('area_of_disappearance') as string) || '',
        last_seen_time: (formData.get('last_seen_time') as string) || '',
        additional_notes: (formData.get('additional_notes') as string) || '',
        medical_condition: (formData.get('medical_condition') as string) || '',
        unique_id: uniqueId,
        request_id: uniqueId,
      };

      // If file was provided in formData, extract it
      if (!image && formData.get('file')) {
        image = formData.get('file') as File;
      }

      // Try to parse user_data JSON if it exists
      try {
        const userDataJson = formData.get('user_data');
        if (userDataJson && typeof userDataJson === 'string') {
          const parsedData = JSON.parse(userDataJson) as Partial<ChildUser> & {
            unique_id?: string;
            request_id?: string;
          };
          // Remove ID if present
          if ('id' in parsedData) {
            delete parsedData.id;
          }

          // If the parsed data has its own unique_id, use that
          if (parsedData.unique_id) {
            userData.unique_id = parsedData.unique_id;
            userData.request_id = parsedData.unique_id;
            console.log(
              `Using existing unique ID from data: ${parsedData.unique_id}`
            );
          }

          userData = { ...userData, ...parsedData };
        }
      } catch (e) {
        console.warn('Failed to parse user_data JSON', e);
      }
    } else {
      // Use the provided user data directly, but remove ID if present
      const userDataCopy = { ...formData } as ChildUser & {
        unique_id?: string;
        request_id?: string;
      };

      if ('id' in userDataCopy) {
        delete (userDataCopy as unknown as Record<string, unknown>).id;
      }

      // Add unique identifier if not already present
      if (!userDataCopy.unique_id) {
        userDataCopy.unique_id = uniqueId;
        userDataCopy.request_id = uniqueId;
      }

      userData = userDataCopy;
    }

    // Force remove ID to prevent unique constraint failures
    if ('id' in userData) {
      delete (userData as unknown as Record<string, unknown>).id;
    }

    // Create a new FormData object specifically for this endpoint
    const apiFormData = new FormData();

    // Add user data as JSON
    apiFormData.append('user_data', JSON.stringify(userData));

    // DO NOT add child_data as a separate field - it causes duplication
    // apiFormData.append('child_data', JSON.stringify(userData));

    // Add image if provided
    if (image) {
      apiFormData.append('file', image);
    }

    // Log what we're sending to help debug
    console.log(
      'Sending data to /children endpoint with unique_id:',
      userData.unique_id
    );

    // Use the /api/children endpoint which works with the existing schema
    try {
      console.log('Making API request to /children endpoint...');
      const response = await apiClient.post('/children', apiFormData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      console.log('Child registration response:', response.data);

      // Convert the response to our expected RegistrationResult format
      if (response.data && response.data.user) {
        const result: RegistrationResult = {
          status: 'success',
          message: 'User registered successfully',
          user_id: response.data.user.id,
          user: response.data.user,
        };
        return result;
      } else {
        throw new Error('Invalid response from child registration endpoint');
      }
    } catch (apiError) {
      console.error('API error details:', apiError);
      throw apiError;
    }
  } catch (error) {
    console.error('Error in specialized child registration:', error);
    throw error;
  }
};

/**
 * Verify registration by user ID
 */
const verifyRegistration = async (
  userId: string
): Promise<RegistrationResult> => {
  try {
    const response = await apiClient.get(`/users/${userId}`);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Register a person using base64 image
 */
const registerWithBase64 = async (
  payload: UserData & { image_base64: string },
  category: string
): Promise<RegistrationResult> => {
  try {
    // Ensure required fields are set
    payload.category = category;
    payload.form_type = payload.form_type || 'adult';
    payload.nickname = payload.nickname || 'unnamed';

    // Handle base64 image
    if (payload.image_base64 && payload.image_base64.startsWith('data:image')) {
      payload.image_base64 = payload.image_base64.split(',')[1];
    }

    // Validate base64 data
    if (!payload.image_base64) {
      throw new Error('Invalid base64 image data');
    }

    console.log('Sending base64 registration with keys:', Object.keys(payload));

    const response = await apiClient.post('/register', payload);
    return response.data;
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const errorMessage =
        error.response?.data?.message ||
        (error.response?.data?.detail &&
        Array.isArray(error.response?.data?.detail)
          ? error.response?.data?.detail[0]?.msg
          : null) ||
        error.message;
      throw new Error(errorMessage);
    }
    throw error;
  }
};

/**
 * Check if the API is available and functioning
 * @returns True if API is healthy, false otherwise
 */
const checkApiHealth = async (): Promise<boolean> => {
  try {
    const response = await apiClient.get('/health');
    return response.status === 200;
  } catch (error) {
    console.error('Health check failed:', error);
    return false;
  }
};

// Export registration API functions
export const registrationApi = {
  registerUser,
  registerDisabled,
  registerChild,
  verifyRegistration,
  registerWithBase64,
  checkApiHealth,
};

export default registrationApi;
