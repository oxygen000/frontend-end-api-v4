/**
 * This is the main services entry point that exports all service modules
 * Provides backwards compatibility with existing imports after API refactoring
 */

// Export all named exports from the API module
export * from './api';

// Export the default export as 'api' for backwards compatibility
export { default as api } from './api';

// Add any future service exports below

/**
 * Re-export API modules for backwards compatibility with existing imports
 */

export * from './api';
export { default } from './api';
