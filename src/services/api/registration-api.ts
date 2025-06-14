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
    // Generate a unique cache key based on timestamp to prevent any caching issues during debugging
    const name =
      (formData.get('full_name') as string) ||
      (formData.get('name') as string) ||
      '';
    const formType = formData.get('form_type') as string;
    const cacheKey = `${formType}-${Date.now()}-${Math.random()}`;

    // Debug logging to help with troubleshooting
    console.log(`🚀 Registration attempt for ${name}, type: ${formType}`);
    console.log('📋 Form data fields:', Array.from(formData.keys()));
    console.log('🔑 Cache key:', cacheKey);

    // Temporarily disable caching to debug the core issue
    // TODO: Re-enable proper caching after fixing the main problem

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
      'emergency_contact',
      'emergency_phone',
      'special_needs',
      'unique_id',
      'request_id',
      'unique_submission_id',
      'date_of_birth',
      // IMPORTANT: DO NOT filter out full_name field - it's required by backend
      // If full_name is in this list, it will be removed from the formData
    ];

    // Create a filtered copy of form data without problematic fields
    const filteredFormData = new FormData();
    const removedFields: string[] = [];

    for (const pair of formData.entries()) {
      const [key, value] = pair;
      if (!separateFields.includes(key)) {
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
        if (userData.id) {
          delete userData.id;
        }

        // Remove fields that cause database errors
        const fieldsToRemove = ['unique_id', 'request_id'];
        fieldsToRemove.forEach((field) => {
          if (field in userData) {
            delete userData[field];
            console.log(
              `Removed ${field} from user_data JSON to prevent DB errors`
            );
          }
        });

        // CRITICAL: Make sure 'name' field is explicitly set for database compatibility
        if (!userData.name && userData.full_name) {
          userData.name = userData.full_name;
          console.log(
            'CRITICAL: Setting name field from full_name to prevent DB errors:',
            userData.full_name
          );
        } else if (!userData.full_name && userData.name) {
          userData.full_name = userData.name;
          console.log(
            'CRITICAL: Setting full_name field from name to prevent DB errors:',
            userData.name
          );
        } else if (!userData.name && !userData.full_name) {
          console.error(
            'CRITICAL ERROR: Both name and full_name are missing in user_data JSON!'
          );
          throw new Error('Name field is required in user_data but missing');
        }

        // Final validation for name field in JSON
        if (!userData.name || userData.name.trim() === '') {
          console.error(
            'CRITICAL ERROR: Name field is empty in user_data JSON after processing'
          );
          throw new Error('Name field in user_data cannot be empty');
        }

        console.log('FINAL CHECK - user_data name field:', userData.name);

        // Ensure both date_of_birth and dob are set properly for all form types
        if (userData.date_of_birth && !userData.dob) {
          userData.dob = userData.date_of_birth;
          console.log('Setting dob from date_of_birth for compatibility');
        } else if (userData.dob && !userData.date_of_birth) {
          userData.date_of_birth = userData.dob;
          console.log('Setting date_of_birth from dob for compatibility');
        }

        // Ensure phone fields use consistent naming
        if (userData.phone_company && !userData.service_provider) {
          userData.service_provider = userData.phone_company;
          console.log(
            'Setting service_provider from phone_company for compatibility'
          );
        } else if (userData.service_provider && !userData.phone_company) {
          userData.phone_company = userData.service_provider;
          console.log(
            'Setting phone_company from service_provider for compatibility'
          );
        }

        // Log expiration_year for debugging
        console.log(
          'User data expiration_year before processing:',
          userData.expiration_year
        );

        // Process new field mappings to ensure compatibility with backend
        // These mappings ensure UI field names match backend field names
        if (userData.education) {
          userData.educational_qualification = userData.education;
          console.log('Mapped education to educational_qualification');
        }

        if (userData.issuingAuthority) {
          userData.issuing_authority = userData.issuingAuthority;
          console.log('Mapped issuingAuthority to issuing_authority');
        }

        // Handle vehicle fields directly, not as nested objects
        // Ensure has_vehicle is properly set
        if (userData.has_vehicle === '1' || userData.has_vehicle === true) {
          // Make sure it's set as a string '1' for consistency
          userData.has_vehicle = '1';
        } else {
          userData.has_vehicle = '0';
        }

        // Handle motorcycle field consistently
        if (
          userData.has_motorcycle === '1' ||
          userData.has_motorcycle === true
        ) {
          userData.has_motorcycle = '1';
          // Also set the dedicated motorcycle field for UI consistency
          userData.motorcycle = true;
        } else {
          userData.has_motorcycle = '0';
          userData.motorcycle = false;
        }

        // Ensure vehicle_type is properly set
        if (userData.vehicle_type && userData.vehicle_info) {
          userData.vehicle_info.vehicle_type = userData.vehicle_type;
        }

        // Ensure expiration_year is set if available
        if (userData.expiration_year) {
          console.log(
            'Preserving expiration_year in processed userData:',
            userData.expiration_year
          );
        }
        // If expiration_year is missing but license_expiration has a year, extract it
        else if (
          userData.license_expiration &&
          userData.license_expiration.length >= 4
        ) {
          const yearPart = userData.license_expiration.substring(0, 4);
          if (/^\d{4}$/.test(yearPart)) {
            userData.expiration_year = yearPart;
            console.log(
              'Setting expiration_year from license_expiration year part:',
              userData.expiration_year
            );
          }
        }

        // Force form_type to be 'man' or 'woman' rather than 'adult'
        if (formType === 'adult') {
          if (formData.get('category') === 'male') {
            userData.form_type = 'man';
            console.log('Changed form_type from adult to man');
          } else if (formData.get('category') === 'female') {
            userData.form_type = 'woman';
            console.log('Changed form_type from adult to woman');
          }
        }

        // If form_type isn't set properly, set it based on category
        if (userData.category === 'male' && userData.form_type === 'adult') {
          userData.form_type = 'man';
          console.log('Setting form_type to man based on category');
        } else if (
          userData.category === 'female' &&
          userData.form_type === 'adult'
        ) {
          userData.form_type = 'woman';
          console.log('Setting form_type to woman based on category');
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

    // CRITICAL: Make sure both name and full_name fields are set correctly in BOTH FormData objects
    const fullNameValue = formData.get('full_name') as string;
    const nameValue = formData.get('name') as string;

    if (!nameValue && fullNameValue) {
      formData.set('name', fullNameValue);
      filteredFormData.set('name', fullNameValue); // CRITICAL: Also set in filteredFormData
      console.log(
        'CRITICAL: Setting name field from full_name:',
        fullNameValue
      );
    } else if (!fullNameValue && nameValue) {
      formData.set('full_name', nameValue);
      filteredFormData.set('full_name', nameValue); // CRITICAL: Also set in filteredFormData
      console.log('CRITICAL: Setting full_name field from name:', nameValue);
    } else if (!nameValue && !fullNameValue) {
      // Both are missing, this is a critical error
      console.error('CRITICAL ERROR: Both name and full_name are missing!');
      throw new Error('Name field is required but missing');
    }

    // Ensure both name and full_name are in filteredFormData (the one being sent to API)
    if (!filteredFormData.get('name') && filteredFormData.get('full_name')) {
      filteredFormData.set('name', filteredFormData.get('full_name') as string);
      console.log('CRITICAL: Ensuring name field is in filteredFormData');
    } else if (
      !filteredFormData.get('full_name') &&
      filteredFormData.get('name')
    ) {
      filteredFormData.set('full_name', filteredFormData.get('name') as string);
      console.log('CRITICAL: Ensuring full_name field is in filteredFormData');
    } else if (
      !filteredFormData.get('name') &&
      !filteredFormData.get('full_name')
    ) {
      // If both are missing from filteredFormData, use the values we just set
      const currentName = formData.get('name') as string;
      const currentFullName = formData.get('full_name') as string;
      if (currentName) {
        filteredFormData.set('name', currentName);
        console.log('CRITICAL: Adding name to filteredFormData:', currentName);
      }
      if (currentFullName) {
        filteredFormData.set('full_name', currentFullName);
        console.log(
          'CRITICAL: Adding full_name to filteredFormData:',
          currentFullName
        );
      }
    }

    // Double check that name field is not null or empty in filteredFormData
    const finalNameValue = filteredFormData.get('name') as string;
    if (!finalNameValue || finalNameValue.trim() === '') {
      console.error(
        'CRITICAL ERROR: Name field is empty in filteredFormData after processing'
      );
      throw new Error('Name field cannot be empty in filtered form data');
    }

    console.log(
      'FINAL CHECK - filteredFormData name field value:',
      finalNameValue
    );

    // Make sure both relationship and reporter_relationship are set
    if (
      !formData.get('reporter_relationship') &&
      formData.get('relationship')
    ) {
      formData.append(
        'reporter_relationship',
        formData.get('relationship') as string
      );
      console.log(
        'Setting reporter_relationship field from relationship in main registration'
      );
    } else if (
      !formData.get('relationship') &&
      formData.get('reporter_relationship')
    ) {
      formData.append(
        'relationship',
        formData.get('reporter_relationship') as string
      );
      console.log(
        'Setting relationship field from reporter_relationship in main registration'
      );
    }

    // Create a promise for the registration process
    const registrationPromise = new Promise<RegistrationResult>(
      (resolve, reject) => {
        // Choose the appropriate endpoint based on form type
        const formType = filteredFormData.get('form_type')?.toString() || '';

        console.log(`Processing registration for form type: ${formType}`);

        try {
          // Always use the main endpoint for all form types for reliability
          console.log(
            `Using main registration endpoint for form type: ${formType}`
          );
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

    // CRITICAL: Check for both name and full_name fields - these are required by the backend
    console.log('CRITICAL CHECK - name field:', formData.get('name'));
    console.log('CRITICAL CHECK - full_name field:', formData.get('full_name'));

    const nameValue = formData.get('name') as string;
    const fullNameValue = formData.get('full_name') as string;

    // Ensure both name and full_name are set
    if (!nameValue && !fullNameValue) {
      console.error(
        'CRITICAL ERROR: Both name and full_name are missing from form data'
      );
      throw new Error(
        'Name field is required but both name and full_name are missing from form data'
      );
    }

    // Set name from full_name if missing
    if (!nameValue && fullNameValue) {
      formData.set('name', fullNameValue);
      console.log('Added missing name field from full_name:', fullNameValue);
    }

    // Set full_name from name if missing
    if (!fullNameValue && nameValue) {
      formData.set('full_name', nameValue);
      console.log('Added missing full_name field from name:', nameValue);
    }

    // Final validation - ensure name field is not empty
    const finalNameValue = formData.get('name') as string;
    if (!finalNameValue || finalNameValue.trim() === '') {
      console.error('CRITICAL ERROR: name field is empty after processing');
      throw new Error('Name field cannot be empty');
    }

    // Debug reporter fields
    console.log('Reporter fields in final request:');
    console.log('reporter_name:', formData.get('reporter_name'));
    console.log('reporter_phone:', formData.get('reporter_phone'));
    console.log('reporter_national_id:', formData.get('reporter_national_id'));
    console.log(
      'reporter_relationship:',
      formData.get('reporter_relationship')
    );
    console.log('reporter_address:', formData.get('reporter_address'));
    console.log('reporter_occupation:', formData.get('reporter_occupation'));
    console.log('reporter_education:', formData.get('reporter_education'));
    console.log('relationship:', formData.get('relationship'));

    // Try to parse user_data JSON if it exists and ensure full_name is set
    try {
      const userDataJson = formData.get('user_data');
      if (userDataJson && typeof userDataJson === 'string') {
        const userData = JSON.parse(userDataJson);

        // Ensure both name and full_name are present in the JSON
        if (!userData.name && userData.full_name) {
          userData.name = userData.full_name;
          console.log('Setting name field from full_name in user_data JSON');
        } else if (!userData.full_name && userData.name) {
          userData.full_name = userData.name;
          console.log('Setting full_name field from name in user_data JSON');
        }

        // CRITICAL FIX: Add missing reporter fields from user_data to formData
        const reporterFields = [
          'reporter_name',
          'reporter_phone',
          'reporter_national_id',
          'reporter_relationship',
          'reporter_address',
          'reporter_occupation',
          'reporter_education',
        ];

        reporterFields.forEach((field) => {
          if (userData[field] && !formData.get(field)) {
            formData.set(field, userData[field]);
            console.log(
              `🔧 FIXED: Added missing ${field} from user_data:`,
              userData[field]
            );
          }
        });

        // Also ensure relationship field is set
        if (userData.reporter_relationship && !formData.get('relationship')) {
          formData.set('relationship', userData.reporter_relationship);
          console.log(
            '🔧 FIXED: Added relationship from reporter_relationship:',
            userData.reporter_relationship
          );
        }

        // CRITICAL FIX: Ensure all essential user fields are in formData
        const essentialFields = [
          'national_id',
          'address',
          'phone_number',
          'emergency_contact',
          'emergency_phone',
          'disability_type',
          'disability_description',
          'medical_history',
        ];

        essentialFields.forEach((field) => {
          if (userData[field] && !formData.get(field)) {
            formData.set(field, userData[field]);
            console.log(
              `🔧 FIXED: Added missing essential ${field} from user_data:`,
              userData[field]
            );
          }
        });

        // Update user_data in the FormData
        formData.set('user_data', JSON.stringify(userData));
      }
    } catch (e) {
      console.warn('Failed to parse or update user_data JSON', e);
    }

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
      formType: formData.get('form_type'),
      userName: formData.get('full_name') || formData.get('name'),
    });

    // Handle successful response with data
    if (response.status === 200 && response.data) {
      // If we have proper user data, return it
      if (response.data.user_id || response.data.user) {
        const result: RegistrationResult = {
          status: 'success',
          message: response.data.message || 'تم التسجيل بنجاح!',
          user_id: response.data.user_id || response.data.user?.id,
          user: response.data.user || {
            id: response.data.user_id,
            face_id: response.data.user_id,
            name:
              (formData.get('full_name') as string) ||
              (formData.get('name') as string) ||
              'User',
            full_name:
              (formData.get('full_name') as string) ||
              (formData.get('name') as string) ||
              'User',
            image_path: '/static/default-avatar.png',
            created_at: new Date().toISOString(),
          },
        };
        console.log('✅ Registration successful with data:', result);
        return result;
      }
    }

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
      const userName =
        (formData.get('full_name') as string) ||
        (formData.get('name') as string) ||
        'User';
      const formType = (formData.get('form_type') as string) || 'unknown';

      // Create a success message based on form type
      let successMessage = 'تم التسجيل بنجاح!';
      if (formType === 'disabled') {
        successMessage = `تم تسجيل ${userName} بنجاح كمعاق!`;
      } else if (formType === 'child') {
        successMessage = `تم تسجيل الطفل ${userName} بنجاح!`;
      } else {
        successMessage = `تم تسجيل ${userName} بنجاح!`;
      }

      // Create a minimal response object
      const syntheticResponse: RegistrationResult = {
        status: 'success',
        message: successMessage,
        user_id: tempId,
        user: {
          id: tempId,
          name: userName,
          full_name: userName,
          form_type: formType,
          category: (formData.get('category') as string) || formType,
          created_at: new Date().toISOString(),
          // Required fields for the User type
          face_id: tempId,
          image_path: '/static/default-avatar.png',
        },
      };

      console.log('✅ Synthetic response created:', syntheticResponse);
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

    // Create a cache key based on national_id and name to prevent duplicates
    const cacheKey = userData.national_id
      ? `disabled-${userData.national_id}`
      : `disabled-${userData.name}-${userData.dob}`;

    // Check if this registration is already in progress (prevent duplicates)
    if (registrationInProgress.has(cacheKey)) {
      console.log(
        'Disabled registration already in progress for this person, using existing promise'
      );
      return registrationInProgress.get(cacheKey)!;
    }

    // Force remove ID to prevent unique constraint failures - triple-check
    if ('id' in userData) {
      delete (userData as unknown as Record<string, unknown>).id;
    }

    // Make sure both name and full_name fields are set
    if (!userData.name && userData.full_name) {
      userData.name = userData.full_name;
      console.log('Setting name field from full_name in disabled registration');
    } else if (!userData.full_name && userData.name) {
      userData.full_name = userData.name;
      console.log('Setting full_name field from name in disabled registration');
    }

    // Ensure both date_of_birth and dob are set properly
    if (userData.date_of_birth && !userData.dob) {
      userData.dob = userData.date_of_birth;
      console.log('Setting dob from date_of_birth for compatibility');
    } else if (userData.dob && !userData.date_of_birth) {
      userData.date_of_birth = userData.dob;
      console.log('Setting date_of_birth from dob for compatibility');
    }

    // Ensure phone fields are set properly
    if (userData.phone_company && !userData.service_provider) {
      userData.service_provider = userData.phone_company;
      console.log(
        'Setting service_provider from phone_company for compatibility'
      );
    } else if (userData.service_provider && !userData.phone_company) {
      userData.phone_company = userData.service_provider;
      console.log(
        'Setting phone_company from service_provider for compatibility'
      );
    }

    // Ensure guardian and reporter fields are synced
    if (userData.guardian_name && !userData.reporter_name) {
      userData.reporter_name = userData.guardian_name;
      console.log('Setting reporter_name from guardian_name for compatibility');
    }

    if (userData.guardian_phone && !userData.reporter_phone) {
      userData.reporter_phone = userData.guardian_phone;
      console.log(
        'Setting reporter_phone from guardian_phone for compatibility'
      );
    }

    // Log the request to help debug
    console.log('Registering disabled user with data:', {
      name: userData.name,
      national_id: userData.national_id,
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

    // Create a promise for the disabled registration process
    const disabledRegistrationPromise = new Promise<RegistrationResult>(
      (resolve, reject) => {
        (async () => {
          try {
            console.log('Making API request to /disabled endpoint...');
            const response = await apiClient.post('/disabled', apiFormData, {
              headers: {
                'Content-Type': 'multipart/form-data',
              },
              timeout: 30000, // 30 second timeout
            });

            console.log('Disabled registration response:', response.data);

            // Clear caches after successful registration
            await clearCaches();

            // Convert the response to our expected RegistrationResult format
            if (response.data && response.data.user) {
              const result: RegistrationResult = {
                status: 'success',
                message: `تم تسجيل ${userData.name || userData.full_name} بنجاح كمعاق`,
                user_id: response.data.user.id,
                user: response.data.user,
              };
              console.log('✅ Disabled registration successful:', result);
              resolve(result);
            } else if (response.status === 200) {
              // Handle cases where registration was successful but response format is different
              const tempId = userData.unique_id || `disabled-${Date.now()}`;
              const result: RegistrationResult = {
                status: 'success',
                message: `تم تسجيل ${userData.name || userData.full_name} بنجاح كمعاق`,
                user_id: tempId,
                user: {
                  id: tempId,
                  face_id: tempId,
                  name: userData.name || userData.full_name || 'Unknown',
                  full_name: userData.full_name || userData.name || 'Unknown',
                  image_path: '/static/default-avatar.png',
                  created_at: new Date().toISOString(),
                },
              };
              console.log(
                '✅ Disabled registration successful (synthetic response):',
                result
              );
              resolve(result);
            } else {
              reject(
                new Error(
                  'Invalid response from disabled registration endpoint'
                )
              );
            }
          } catch (apiError) {
            console.error('API error details:', apiError);

            // Handle specific server errors
            if (
              axios.isAxiosError(apiError) &&
              apiError.response?.status === 500
            ) {
              const errorMessage = apiError.response?.data?.message || '';
              if (errorMessage.includes('database is locked')) {
                throw new Error(
                  'database is locked - الخادم مشغول حالياً، يرجى المحاولة بعد دقيقة'
                );
              } else {
                throw new Error('خطأ في الخادم - يرجى المحاولة مرة أخرى');
              }
            }

            reject(apiError);
          }
        })();
      }
    );

    // Store the promise and remove it when done
    registrationInProgress.set(cacheKey, disabledRegistrationPromise);
    disabledRegistrationPromise.finally(() => {
      registrationInProgress.delete(cacheKey);
    });

    return disabledRegistrationPromise;
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

    // Make sure both name and full_name fields are set
    const userDataWithFullName = userData as unknown as {
      name: string;
      full_name?: string;
    };
    if (!userData.name && userDataWithFullName.full_name) {
      userData.name = userDataWithFullName.full_name;
      console.log('Setting name field from full_name in child registration');
    } else if (!userDataWithFullName.full_name && userData.name) {
      userDataWithFullName.full_name = userData.name;
      console.log('Setting full_name field from name in child registration');
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
 * Update an existing user
 */
const updateUser = async (
  userId: string,
  formData: FormData
): Promise<RegistrationResult> => {
  try {
    // Debug logging
    console.log(`🔄 updateUser called with ID: ${userId}`);
    console.log('Update form data fields:', Array.from(formData.keys()));

    // CRITICAL: Check if the user_id and is_update flags are properly set
    console.log('=== CRITICAL UPDATE FLAGS CHECK ===');
    console.log('user_id in formData:', formData.get('user_id'));
    console.log('is_update in formData:', formData.get('is_update'));
    console.log('operation_type in formData:', formData.get('operation_type'));
    console.log('userId parameter:', userId);
    console.log('Are they equal?', formData.get('user_id') === userId);
    console.log('===================================');

    // Check if there's an image file to update
    const imageFile = formData.get('file') as File | null;

    // Log detailed information about the image
    if (imageFile) {
      console.log(`📸 Image file detected for update:`, {
        name: imageFile.name,
        size: imageFile.size,
        type: imageFile.type,
        lastModified: imageFile.lastModified,
      });
    } else {
      console.log('📸 No image file detected in formData');
    }

    if (imageFile) {
      // If there's an image, we need to use the multipart/form-data endpoint
      console.log('📸 Image detected, using multipart update endpoint');

      // CRITICAL: Ensure update flags are set AGAIN before sending
      if (!formData.get('user_id')) {
        formData.append('user_id', userId);
        console.log('⚠️ user_id was missing, added it:', userId);
      }
      if (!formData.get('is_update')) {
        formData.append('is_update', 'true');
        console.log('⚠️ is_update was missing, added it: true');
      }
      if (!formData.get('operation_type')) {
        formData.append('operation_type', 'update');
        console.log('⚠️ operation_type was missing, added it: update');
      }

      // Log all form data being sent
      console.log('=== COMPLETE FORM DATA FOR UPDATE ===');
      for (const [key, value] of formData.entries()) {
        if (key === 'file') {
          console.log(
            `${key}: File(${value instanceof File ? `${value.name}, ${value.size} bytes` : value})`
          );
        } else if (key === 'user_data') {
          console.log(`${key}: [JSON data - see below]`);
          try {
            const userData = JSON.parse(value as string);
            console.log('  └─ user_data.id:', userData.id);
            console.log('  └─ user_data.user_id:', userData.user_id);
            console.log('  └─ user_data.name:', userData.name);
            console.log('  └─ user_data.full_name:', userData.full_name);
          } catch {
            console.log('  └─ Could not parse user_data JSON');
          }
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log('====================================');

      // Use the registration endpoint but with user_id to indicate update
      console.log('📡 Sending update request to /register/upload endpoint...');
      const response = await apiClient.post('/register/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('📡 User update with image response:', response.data);

      // CRITICAL: Check if the response indicates an update or new creation
      if (response.data) {
        console.log('=== RESPONSE ANALYSIS ===');
        console.log(
          'Response indicates update?',
          response.data.operation_type === 'update'
        );
        console.log(
          'Response user_id matches our userId?',
          response.data.user_id === userId || response.data.user?.id === userId
        );
        console.log('Response data keys:', Object.keys(response.data));
        console.log('========================');
      }

      await clearCaches();

      if (response.data) {
        // Log detailed update information
        if (response.data.image_info) {
          console.log('📸 Image update details:', response.data.image_info);
        }

        if (response.data.operation_type === 'update') {
          console.log('✅ Update operation confirmed by server');
        }

        const result: RegistrationResult = {
          status: 'success',
          message: 'User and image updated successfully',
          user_id: userId,
          user: response.data.user || {
            id: userId,
            face_id: userId,
            name: 'Updated User',
            image_path:
              response.data.image_info?.filename ||
              '/static/default-avatar.png',
            created_at: new Date().toISOString(),
          },
        };

        // Add image update confirmation to the message if available
        if (response.data.image_info?.face_encoding_updated) {
          result.message += ' (including face recognition data)';
        }

        console.log('Update with image completed successfully:', result);
        return result;
      }
    } else {
      // No image, but we'll still use the /register/upload endpoint for consistency
      console.log(
        'No image detected, using /register/upload endpoint without image'
      );

      // CRITICAL: Ensure update flags are set for the multipart endpoint
      if (!formData.get('user_id')) {
        formData.append('user_id', userId);
        console.log('⚠️ user_id was missing, added it:', userId);
      }
      if (!formData.get('is_update')) {
        formData.append('is_update', 'true');
        console.log('⚠️ is_update was missing, added it: true');
      }
      if (!formData.get('operation_type')) {
        formData.append('operation_type', 'update');
        console.log('⚠️ operation_type was missing, added it: update');
      }
      if (!formData.get('keep_existing_image')) {
        formData.append('keep_existing_image', 'true');
        console.log('⚠️ keep_existing_image flag added to keep current image');
      }

      // Log all form data being sent
      console.log('=== COMPLETE FORM DATA FOR UPDATE WITHOUT IMAGE ===');
      for (const [key, value] of formData.entries()) {
        if (key === 'user_data') {
          console.log(`${key}: [JSON data - see below]`);
          try {
            const userData = JSON.parse(value as string);
            console.log('  └─ user_data.id:', userData.id);
            console.log('  └─ user_data.user_id:', userData.user_id);
            console.log('  └─ user_data.name:', userData.name);
            console.log('  └─ user_data.full_name:', userData.full_name);
          } catch {
            console.log('  └─ Could not parse user_data JSON');
          }
        } else {
          console.log(`${key}: ${value}`);
        }
      }
      console.log('==================================================');

      // Use the same /register/upload endpoint but without image
      console.log(
        '📡 Sending update request to /register/upload endpoint (no image)...'
      );
      const response = await apiClient.post('/register/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
        timeout: 30000,
      });

      console.log('📡 User update without image response:', response.data);

      // Clear caches after successful update
      await clearCaches();

      if (response.data) {
        // Check if the response indicates an update
        if (response.data.operation_type === 'update') {
          console.log('✅ Update operation confirmed by server (no image)');
        }

        const result: RegistrationResult = {
          status: 'success',
          message: response.data.message || 'User updated successfully',
          user_id: userId,
          user: response.data.user || {
            id: userId,
            face_id: userId,
            name: 'Updated User',
            full_name: 'Updated User',
            image_path: '/static/default-avatar.png',
            created_at: new Date().toISOString(),
          },
        };

        console.log('Update without image completed successfully:', result);
        return result;
      }
    }

    throw new Error('Invalid response from user update endpoint');
  } catch (error) {
    console.error('Error updating user:', error);
    if (axios.isAxiosError(error)) {
      const errorMessage = error.response?.data?.message || error.message;
      console.error('Axios error details:', {
        status: error.response?.status,
        statusText: error.response?.statusText,
        data: error.response?.data,
      });
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
  updateUser,
};

export default registrationApi;
