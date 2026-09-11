import api from './api';

const TOKEN_KEY = 'ecolink_auth_token';
const USER_KEY = 'ecolink_user';

export const authService = {
  /**
   * Log in user
   */
  async login(identifier, password, role = null) {
    const payload = {
      identifier: identifier.trim(),
      password,
      role
    };

    const response = await api.post('/auth/login', payload);

    if (response?.success && response?.data?.token) {
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error(response?.message || 'Login failed');
  },

  /**
   * Register new user (Collector or Recycler)
   */
  async register(registrationData) {
    const response = await api.post('/auth/register', registrationData);

    if (response?.success && response?.data?.token) {
      const { token, user } = response.data;
      localStorage.setItem(TOKEN_KEY, token);
      localStorage.setItem(USER_KEY, JSON.stringify(user));
      return user;
    }

    throw new Error(response?.message || 'Registration failed');
  },

  /**
   * Retrieve cached user object synchronously
   */
  getCurrentUser() {
    try {
      const userStr = localStorage.getItem(USER_KEY);
      return userStr ? JSON.parse(userStr) : null;
    } catch (e) {
      return null;
    }
  },

  /**
   * Fetch authenticated user identity from backend
   */
  async fetchCurrentUser() {
    const token = localStorage.getItem(TOKEN_KEY);
    if (!token) return null;

    try {
      const response = await api.get('/auth/me');
      if (response?.success && response?.data?.user) {
        const user = response.data.user;
        localStorage.setItem(USER_KEY, JSON.stringify(user));
        return user;
      }
    } catch (err) {
      console.warn('Could not verify session with server:', err.message);
      this.clearSession();
    }
    return null;
  },

  /**
   * Log out user and purge storage
   */
  async logout() {
    try {
      await api.post('/auth/logout');
    } catch (e) {
      // Ignore network errors on logout
    } finally {
      this.clearSession();
    }
  },

  /**
   * Clear local storage session
   */
  clearSession() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
  },

  /**
   * Check if token exists
   */
  isAuthenticated() {
    return Boolean(localStorage.getItem(TOKEN_KEY));
  },

  /**
   * Get raw token string
   */
  getToken() {
    return localStorage.getItem(TOKEN_KEY);
  }
};

export default authService;
