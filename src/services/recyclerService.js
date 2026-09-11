import api from './api';

export const recyclerService = {
  async getDashboard() {
    const res = await api.get('/recycler/dashboard');
    return res.data;
  },

  async getProfile() {
    const res = await api.get('/recycler/profile');
    return res.data;
  },

  async updateProfile(profileData) {
    const res = await api.put('/recycler/profile', profileData);
    return res.data;
  }
};

export default recyclerService;
