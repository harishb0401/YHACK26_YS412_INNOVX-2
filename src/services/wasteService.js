import api from './api';

export const wasteService = {
  async createLot(lotData) {
    const res = await api.post('/waste', lotData);
    return res.data;
  },

  async getMyLots() {
    const res = await api.get('/waste/my');
    return res.data || [];
  },

  async getAvailableLots() {
    const res = await api.get('/waste/available');
    return res.data || [];
  },

  async getLotById(lotId) {
    const res = await api.get(`/waste/${lotId}`);
    return res.data;
  },

  async getLotOffers(lotId) {
    const res = await api.get(`/waste/${lotId}/offers`);
    return res.data || [];
  },

  async cancelLot(lotId) {
    const res = await api.post(`/waste/${lotId}/cancel`);
    return res.data;
  }
};

export default wasteService;
