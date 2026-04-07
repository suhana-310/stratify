// API Connection Test Utility
export const testApiConnection = async () => {
  const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
  
  console.log('🔍 Testing API connection...');
  console.log('🔍 API URL:', API_URL);
  console.log('🔍 Environment variables:', {
    VITE_API_URL: import.meta.env.VITE_API_URL,
    MODE: import.meta.env.MODE,
    DEV: import.meta.env.DEV,
    PROD: import.meta.env.PROD
  });

  try {
    // Test health endpoint
    console.log('🔍 Testing health endpoint...');
    const healthResponse = await fetch(`${API_URL}/health`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    console.log('🔍 Health response status:', healthResponse.status);
    console.log('🔍 Health response headers:', Object.fromEntries(healthResponse.headers.entries()));
    
    if (healthResponse.ok) {
      const healthData = await healthResponse.json();
      console.log('✅ Health check successful:', healthData);
    } else {
      console.error('❌ Health check failed:', healthResponse.statusText);
      return false;
    }

    // Test login endpoint with OPTIONS request first
    console.log('🔍 Testing CORS preflight...');
    const optionsResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'OPTIONS',
      headers: {
        'Origin': window.location.origin,
        'Access-Control-Request-Method': 'POST',
        'Access-Control-Request-Headers': 'Content-Type',
      },
    });
    
    console.log('🔍 OPTIONS response status:', optionsResponse.status);
    console.log('🔍 OPTIONS response headers:', Object.fromEntries(optionsResponse.headers.entries()));

    // Test actual login
    console.log('🔍 Testing login endpoint...');
    const loginResponse = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        email: 'roshankumarsingh021@gmail.com',
        password: 'Password123'
      }),
    });
    
    console.log('🔍 Login response status:', loginResponse.status);
    console.log('🔍 Login response headers:', Object.fromEntries(loginResponse.headers.entries()));
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      console.log('✅ Login test successful:', { success: loginData.success, hasToken: !!loginData.token });
      return true;
    } else {
      const errorText = await loginResponse.text();
      console.error('❌ Login test failed:', loginResponse.statusText, errorText);
      return false;
    }
    
  } catch (error) {
    console.error('❌ API test failed with error:', error);
    console.error('❌ Error details:', {
      name: error.name,
      message: error.message,
      stack: error.stack
    });
    return false;
  }
};

// Auto-run test in development
if (import.meta.env.DEV) {
  console.log('🔍 Development mode detected, running API test...');
  testApiConnection();
}