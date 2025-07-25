import axios from 'axios';
import {getAuthHeader} from './auth-header';

// For Vite-based React apps, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service for fetching and managing balance data
 */
class BalanceService {
  /**
   * Get balance and payout information
   * @returns {Promise<unknown>} Balance and payout data
   */
  async getBalanceAndPayout(): Promise<unknown> {
    try {
      // Fetch real data from the API - use authenticated endpoint
      console.log('Fetching balance data from:', `${API_URL}/analytics/balance-and-payout`);
      console.log('Auth headers:', getAuthHeader());
      
      const response = await axios.get(`${API_URL}/analytics/balance-and-payout`, {
        headers: getAuthHeader()
      });
      
      console.log('Balance data received:', response.data);
      return response.data;
    } catch (error: unknown) {
      console.error('Error fetching balance and payout:', error);
      if (error && typeof error === 'object' && 'response' in error) {
        console.error('Error details:', (error as any).response?.data || 'No response data');
      }
      if (error instanceof Error) {
        // You can access error.message or other Error properties here
      }
      throw error;
    }
  }

  /**
   * Initiate a manual payout
   * @param {number} amount - Amount to payout
   * @returns {Promise<unknown>} Payout result
   */
  async initiatePayout(amount: number): Promise<unknown> {
    try {
      const response = await axios.post(`${API_URL}/payouts/initiate`, {
        amount
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error initiating payout:', error);
      throw error;
    }
  }

  /**
   * Schedule a future payout
   * @param {number} amount - Amount to payout
   * @param {string} date - Date for the scheduled payout
   * @returns {Promise<unknown>} Scheduled payout result
   */
  async schedulePayout(amount: number, date: string): Promise<unknown> {
    try {
      const response = await axios.post(`${API_URL}/payouts/schedule`, {
        amount,
        scheduledDate: date
      }, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error scheduling payout:', error);
      throw error;
    }
  }

  /**
   * Get payout history
   * @param {string} timeRange - Time range for the data
   * @returns {Promise<unknown>} Payout history data
   */
  async getPayoutHistory(timeRange: string = 'last30days'): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/payouts/history`, {
        headers: getAuthHeader(),
        params: { timeRange }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching payout history:', error);
      throw error;
    }
  }

  /**
   * Get detailed balance information including reserved funds, pending balance, and currency
   * @returns {Promise<unknown>} Detailed balance information
   */
  async getDetailedBalance(): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/detailed-balance`, {
        headers: getAuthHeader()
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching detailed balance:', error);
      throw error;
    }
  }

  /**
   * Export balance and transaction data
   * @param {string} format - Export format (csv, pdf)
   * @param {string} timeRange - Time range for the data
   * @returns {Promise<unknown>} Export data
   */
  async exportData(format: string = 'csv', timeRange: string = 'last30days'): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/export`, {
        headers: getAuthHeader(),
        params: { format, timeRange },
        responseType: 'blob'
      });
      return response.data;
    } catch (error) {
      console.error('Error exporting data:', error);
      throw error;
    }
  }
}

export default new BalanceService();
