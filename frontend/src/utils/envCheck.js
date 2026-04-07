// Environment Variables Check
console.log('🔍 Environment Check:');
console.log('🔍 Mode:', import.meta.env.MODE);
console.log('🔍 Dev:', import.meta.env.DEV);
console.log('🔍 Prod:', import.meta.env.PROD);
console.log('🔍 API URL:', import.meta.env.VITE_API_URL);
console.log('🔍 Socket URL:', import.meta.env.VITE_SOCKET_URL);
console.log('🔍 App Name:', import.meta.env.VITE_APP_NAME);
console.log('🔍 All env vars:', import.meta.env);

// Check if we're in production and API URL is set
if (import.meta.env.PROD && !import.meta.env.VITE_API_URL) {
  console.error('❌ CRITICAL: VITE_API_URL not set in production!');
}

// Check if API URL is accessible
if (import.meta.env.VITE_API_URL) {
  console.log('✅ API URL is configured');
} else {
  console.warn('⚠️ API URL not configured, using fallback');
}