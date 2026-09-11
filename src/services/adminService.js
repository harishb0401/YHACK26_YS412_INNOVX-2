import api from './api';

export const adminService = {
  async getDashboardStats() {
    const res = await api.get('/admin/dashboard');
    return res.data;
  },

  async getCollectors() {
    const res = await api.get('/admin/collectors');
    return res.data || [];
  },

  async getRecyclers() {
    const res = await api.get('/admin/recyclers');
    return res.data || [];
  },

  async getVerifications() {
    const res = await api.get('/admin/verifications');
    return res.data || { pendingRecyclers: [], flaggedOffers: [] };
  },

  async verifyRecycler(recyclerId) {
    const res = await api.post(`/admin/recyclers/${recyclerId}/verify`);
    return res.data;
  },

  async rejectRecycler(recyclerId, reason = '') {
    const res = await api.post(`/admin/recyclers/${recyclerId}/reject`, { reason });
    return res.data;
  },

  async cancelOffer(offerId) {
    const res = await api.post(`/admin/offers/${offerId}/cancel`);
    return res.data;
  }
};

export default adminService;
