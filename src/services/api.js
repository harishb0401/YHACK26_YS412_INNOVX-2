/**
 * Eco-Link Centralized Frontend API Client
 * Connects React strictly to the Node.js/Express REST backend.
 * Never connects directly to Supabase with sensitive service keys.
 */

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Retrieves the stored JWT token
 */
function getAuthToken() {
  try {
    return localStorage.getItem('ecolink_auth_token') || null;
  } catch (e) {
    return null;
  }
}

/**
 * Universal request wrapper
 */
async function request(endpoint, options = {}) {
  const url = `${API_BASE_URL}${endpoint.startsWith('/') ? endpoint : `/${endpoint}`}`;
  const token = getAuthToken();

  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const config = {
    ...options,
    headers
  };

  try {
    const response = await fetch(url, config);

    // Handle 401 Unauthorized (session expired or invalid)
    if (response.status === 401 && !endpoint.includes('/auth/login') && !endpoint.includes('/auth/register')) {
      // Clear expired local session
      localStorage.removeItem('ecolink_auth_token');
      localStorage.removeItem('ecolink_user');
      // Dispatch custom event so app can react if needed
      window.dispatchEvent(new Event('ecolink_unauthorized'));
    }

    const data = await response.json().catch(() => ({}));

    if (!response.ok) {
      const errorMsg = data?.message || `Request failed with status ${response.status}`;
      const err = new Error(errorMsg);
      err.status = response.status;
      err.data = data;
      throw err;
    }

    return data;
  } catch (err) {
    // If the Express server is offline or unreachable
    if (err.name === 'TypeError' && err.message.includes('fetch')) {
      const serverErr = new Error('Eco-Link API server is unreachable. Please ensure the backend is running at ' + API_BASE_URL);
      serverErr.status = 503;
      throw serverErr;
    }
    throw err;
  }
}

export const api = {
  get: (endpoint, options = {}) => request(endpoint, { method: 'GET', ...options }),
  post: (endpoint, body, options = {}) => request(endpoint, { method: 'POST', body: JSON.stringify(body), ...options }),
  put: (endpoint, body, options = {}) => request(endpoint, { method: 'PUT', body: JSON.stringify(body), ...options }),
  delete: (endpoint, options = {}) => request(endpoint, { method: 'DELETE', ...options })
};

export default api;
