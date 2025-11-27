/**
 * Application configuration
 * Uses Vite environment variables
 */

// Backend API URL
// In development: uses proxy to localhost:8000
// In production: hardcoded to Render backend URL
const PRODUCTION_API_URL = 'https://farp-backend.onrender.com/api/v1';

let apiUrl;

if (import.meta.env.DEV) {
  // Development: use proxy
  apiUrl = '/api/v1';
  console.log('🔧 Development mode: using Vite proxy');
} else if (import.meta.env.VITE_API_URL) {
  // Production with env var set
  apiUrl = import.meta.env.VITE_API_URL;
  console.log('🔧 Production mode: using VITE_API_URL env var');
} else {
  // Production fallback: use hardcoded URL
  apiUrl = PRODUCTION_API_URL;
  console.log('🔧 Production mode: using hardcoded backend URL');
}

console.log('🔍 CONFIG DEBUG:', {
  'import.meta.env.VITE_API_URL': import.meta.env.VITE_API_URL,
  'import.meta.env.PROD': import.meta.env.PROD,
  'import.meta.env.DEV': import.meta.env.DEV,
  'apiUrl (final)': apiUrl
});

export const API_URL = apiUrl;

console.log('✅ Final API_URL:', API_URL);

export const config = {
  apiUrl: API_URL,
  isDevelopment: import.meta.env.DEV,
  isProduction: import.meta.env.PROD
};

export default config;