import axios from 'axios';
import {getAuthHeader} from './auth-header';

// For Vite-based React apps, use import.meta.env instead of process.env
const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

/**
 * Service for fetching business analytics data
 */
class AnalyticsService {
  /**
   * Get dashboard overview data
   * @param {string} timeRange - Time range for the data (today, yesterday, last7days, last30days, thisMonth, lastMonth)
   * @returns {Promise<unknown>} Dashboard overview data
   */
  async getDashboardOverview(timeRange: string = 'last7days'): Promise<unknown> {
    try {
      // Fetch real data from the API
      const response = await axios.get(`${API_URL}/analytics/dashboard-overview`, {
        headers: {
          ...getAuthHeader(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0',
          'X-Request-ID': `${Date.now()}-${Math.random().toString(36).substring(7)}`,
          'X-Force-Fresh': 'true'
        },
        params: { 
          timeRange,
          _t: Date.now(), // Add timestamp to prevent caching
          _r: Math.random() // Add random number for additional cache busting
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching dashboard overview:', error);
      throw error;
    }
  }

  /**
   * Get gross volume data
   * @param {string} timeRange - Time range for the data
   * @returns {Promise<unknown>} Gross volume data
   */
  async getGrossVolume(timeRange: string = 'last7days'): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/gross-volume`, {
        headers: {
          ...getAuthHeader(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { 
          timeRange,
          _t: Date.now(),
          _r: Math.random()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching gross volume:', error);
      throw error;
    }
  }

  /**
   * Get balance and next payout information
   * @returns {Promise<unknown>} Balance and payout data
   */
  async getBalanceAndPayout(): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/balance-and-payout`, {
        headers: {
          ...getAuthHeader(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: {
          _t: Date.now(),
          _r: Math.random()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching balance and payout:', error);
      throw error;
    }
  }

  /**
   * Get top customers by spend
   * @param {string} timeRange - Time range for the data
   * @param {number} limit - Maximum number of customers to return
   * @returns {Promise<unknown>} Top customers data
   */
  async getTopCustomers(timeRange: string = 'last30days', limit: number = 5): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/top-customers`, {
        headers: {
          ...getAuthHeader(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { 
          timeRange, 
          limit,
          _t: Date.now(),
          _r: Math.random()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching top customers:', error);
      throw error;
    }
  }

  /**
   * Get failed payments data
   * @param {string} timeRange - Time range for the data
   * @returns {Promise<unknown>} Failed payments data
   */
  async getFailedPayments(timeRange: string = 'last7days'): Promise<unknown> {
    try {
      const response = await axios.get(`${API_URL}/analytics/failed-payments`, {
        headers: {
          ...getAuthHeader(),
          'Cache-Control': 'no-cache, no-store, must-revalidate',
          'Pragma': 'no-cache',
          'Expires': '0'
        },
        params: { 
          timeRange,
          _t: Date.now(),
          _r: Math.random()
        }
      });
      return response.data;
    } catch (error) {
      console.error('Error fetching failed payments:', error);
      throw error;
    }
  }
}

export default new AnalyticsService();

export interface PaymentAnalytics {
  grossVolume: {
    amount: number;
    growth?: number;
    previousAmount: number;
    chart: Array<{ name: string; value: number }>;
  };
  netVolume: {
    amount: number;
    growth?: number;
    previousAmount: number;
    chart: Array<{ name: string; value: number }>;
  };
  newCustomers: {
    count: number;
    growth?: number;
    previousCount: number;
    chart: Array<{ name: string; value: number }>;
  };
  failedPayments: {
    count: number;
    amount: number;
  };
  topCustomers: Array<{
    name: string;
    email: string;
    spend: number;
    transactions: number;
  }>;
  totalTransactions: number;
  averageOrderValue: number;
  timeRange: string;
  lastUpdated: string;
}

export interface ProductAnalytics {
  products: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    category: string;
    image?: string;
    sales: number;
    revenue: number;
    transactions: number;
    averageOrderValue: number;
  }>;
  totalProducts: number;
  totalRevenue: number;
  averagePrice: number;
  topProducts: Array<{
    id: string;
    name: string;
    description?: string;
    price: number;
    currency: string;
    category: string;
    image?: string;
    sales: number;
    revenue: number;
    transactions: number;
    averageOrderValue: number;
  }>;
  productCategories: Array<{
    name: string;
    products: number;
    sales: number;
    revenue: number;
    averageRevenue: number;
  }>;
  timeRange: string;
  lastUpdated: string;
}

export interface PaymentAnalyticsResponse {
  success: boolean;
  data: PaymentAnalytics;
}

export interface ProductAnalyticsResponse {
  success: boolean;
  data: ProductAnalytics;
}

export interface CustomerAnalytics {
  totalCustomers: number;
  newCustomers: number;
  returningCustomers: number;
  averageCustomerValue: number;
  customerRetentionRate: number;
  topCustomers: Array<{
    email: string;
    name: string;
    totalSpend: number;
    transactionCount: number;
    averageOrderValue: number;
    firstPaymentDate: string;
    lastPaymentDate: string;
    isNewCustomer: boolean;
    isReturningCustomer: boolean;
    rank: number;
  }>;
  customerSegments: Array<{
    name: string;
    count: number;
    percentage: number;
    color: string;
  }>;
  customerGrowth: Array<{
    date: string;
    customers: number;
    revenue: number;
  }>;
  timeRange: string;
  lastUpdated: string;
}

export interface CustomerAnalyticsResponse {
  success: boolean;
  data: CustomerAnalytics;
}

/**
 * Get real payment analytics for storefront payments
 */
export async function getPaymentAnalytics(timeRange: string = 'last7days'): Promise<PaymentAnalyticsResponse> {
  try {
    const authHeader = getAuthHeader();
    console.log('Auth header:', authHeader);
    console.log('Token exists:', !!localStorage.getItem('token'));
    
    const response = await axios.get<PaymentAnalyticsResponse>(`${API_URL}/analytics/payment-analytics?timeRange=${timeRange}`, {
      headers: {
        ...authHeader,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      params: {
        _t: Date.now(), // Add timestamp to prevent caching
        _r: Math.random() // Add random number for additional cache busting
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching payment analytics:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
}

/**
 * Get product analytics data
 */
export async function getProductAnalytics(timeRange: string = 'last30days'): Promise<ProductAnalyticsResponse> {
  try {
    const authHeader = getAuthHeader();
    console.log('Fetching product analytics for timeRange:', timeRange);
    
    const response = await axios.get<ProductAnalyticsResponse>(`${API_URL}/analytics/product-analytics?timeRange=${timeRange}`, {
      headers: {
        ...authHeader,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      params: {
        _t: Date.now(), // Add timestamp to prevent caching
        _r: Math.random() // Add random number for additional cache busting
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching product analytics:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
}

/**
 * Get customer analytics data
 */
export async function getCustomerAnalytics(timeRange: string = 'last30days'): Promise<CustomerAnalyticsResponse> {
  try {
    const authHeader = getAuthHeader();
    console.log('Fetching customer analytics for timeRange:', timeRange);
    
    const response = await axios.get<CustomerAnalyticsResponse>(`${API_URL}/analytics/customer-analytics?timeRange=${timeRange}`, {
      headers: {
        ...authHeader,
        'Cache-Control': 'no-cache, no-store, must-revalidate',
        'Pragma': 'no-cache',
        'Expires': '0'
      },
      params: {
        _t: Date.now(), // Add timestamp to prevent caching
        _r: Math.random() // Add random number for additional cache busting
      }
    });
    return response.data;
  } catch (error: unknown) {
    console.error('Error fetching customer analytics:', error);
    console.error('Error response:', error.response?.data);
    throw error;
  }
}
