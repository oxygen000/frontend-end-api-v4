/**
 * Main API module that exports all sub-modules and types
 */
import { apiClient, API_URL } from './client';
import { recognitionApi } from './recognition-api';
import { registrationApi } from './registration-api';
import {
  userApi,
  maleApi,
  femaleApi,
  childApi,
  disabledApi,
  commonApi,
} from './user-api';

// Export individual modules
export { apiClient, API_URL };
export { recognitionApi };
export { registrationApi };
export { userApi, maleApi, femaleApi, childApi, disabledApi, commonApi };

// Re-export all types
export * from './types';

// Create and export a unified API object
const api = {
  client: apiClient,
  recognition: recognitionApi,
  registration: registrationApi,
  users: userApi,
  male: maleApi,
  female: femaleApi,
  child: childApi,
  disabled: disabledApi,
  common: commonApi,
};

export default api;
