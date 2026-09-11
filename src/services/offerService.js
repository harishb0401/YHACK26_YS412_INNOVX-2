import api from './api';

export const offerService = {
  async submitOffer(offerData) {
    const res = await api.post('/offers', offerData);
    return res.data;
  },

  async getMyOffers() {
    const res = await api.get('/offers/my');
    return res.data || [];
  },

  async acceptOffer(offerId) {
    const res = await api.post(`/offers/${offerId}/accept`);
    return res.data;
  }
};

export default offerService;
