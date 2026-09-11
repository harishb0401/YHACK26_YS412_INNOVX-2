import api from './api';

export const transactionService = {
  async getMyTransactions() {
    const res = await api.get('/transactions/my');
    return res.data || [];
  },

  async getTransactionById(transactionId) {
    const res = await api.get(`/transactions/${transactionId}`);
    return res.data;
  },

  async getAllTransactions() {
    const res = await api.get('/admin/transactions');
    return res.data || [];
  }
};

export default transactionService;
