/**
 * Environment configuration for the frontend application
 * This file reads environment variables set in the .env file
 */

// In Vite, environment variables are accessed via import.meta.env
// and must be prefixed with VITE_
export const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

// Other environment variables can be added here
export const APP_NAME = 'Cute App';
export const APP_VERSION = '1.0.0';

// For debugging
console.log('API_BASE_URL:', API_BASE_URL);
