/**
 * Compatibility layer for old imports
 * This file exists to maintain compatibility with code that imports from 'services/api'
 */

import apiDefault from './api/index';
export * from './api/index';
export default apiDefault;
