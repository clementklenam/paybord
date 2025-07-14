import axios from 'axios';
import AuthService from './auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authService = new AuthService();

export interface PaymentLink {
  _id?: string;
  linkId?: string;
  title: string;
  description?: string;
  amount: number;
  currency: string;
  imageUrl?: string;
  paymentMethodTypes?: string[];
  businessId: string;
  requiredFields?: {
    customerName?: boolean;
    customerEmail?: boolean;
    customerPhone?: boolean;
    shippingAddress?: boolean;
  };
  status?: 'active' | 'inactive' | 'expired';
  url?: string;
  analytics?: {
    clicks: number;
    views: number;
    conversions: number;
  };
  createdAt?: string;
  updatedAt?: string;
}

class PaymentLinkService {
  /**
   * Create a new payment link
   */
  async createPaymentLink(paymentLinkData: PaymentLink): Promise<PaymentLink> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.post(
        `${API_URL}/payment-links`,
        paymentLinkData,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return (response.data as any).data as PaymentLink;
    } catch (error: any) {
      console.error('Error creating payment link:', error);
      throw error.response?.data || error.message || 'Error creating payment link';
    }
  }

  /**
   * Get all payment links with pagination
   */
  async getPaymentLinks(page = 1, limit = 10, status?: string): Promise<{
    data: PaymentLink[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      totalPages: number;
    };
  }> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      let url = `${API_URL}/payment-links?page=${page}&limit=${limit}`;
      if (status) {
        url += `&status=${status}`;
      }

      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return (response.data as any) as {
        data: PaymentLink[];
        pagination: {
          page: number;
          limit: number;
          total: number;
          totalPages: number;
        };
      };
    } catch (error: any) {
      console.error('Error fetching payment links:', error);
      throw error.response?.data || error.message || 'Error fetching payment links';
    }
  }

  /**
   * Get a payment link by ID
   */
  async getPaymentLink(id: string): Promise<PaymentLink> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.get(`${API_URL}/payment-links/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      return (response.data as any).data as PaymentLink;
    } catch (error: any) {
      console.error('Error fetching payment link:', error);
      throw error.response?.data || error.message || 'Error fetching payment link';
    }
  }

  /**
   * Update a payment link
   */
  async updatePaymentLink(id: string, updates: Partial<PaymentLink>): Promise<PaymentLink> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      const response = await axios.put(
        `${API_URL}/payment-links/${id}`,
        updates,
        {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      return (response.data as any).data as PaymentLink;
    } catch (error: any) {
      console.error('Error updating payment link:', error);
      throw error.response?.data || error.message || 'Error updating payment link';
    }
  }

  /**
   * Delete a payment link
   */
  async deletePaymentLink(id: string): Promise<void> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        throw new Error('No authentication token found');
      }

      await axios.delete(`${API_URL}/payment-links/${id}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    } catch (error: any) {
      console.error('Error deleting payment link:', error);
      throw error.response?.data || error.message || 'Error deleting payment link';
    }
  }

  /**
   * Get a public payment link by ID (no authentication required)
   */
  async getPublicPaymentLink(linkId: string): Promise<PaymentLink> {
    try {
      // Extract just the ID part if it's a full URL or contains the pl_ prefix
      let id = linkId;
      
      // Handle different URL formats
      if (linkId.includes('/payment-link/')) {
        id = linkId.split('/payment-link/')[1];
      } else if (linkId.includes('/payment/')) {
        id = linkId.split('/payment/')[1];
      } else if (linkId.includes('pl_')) {
        id = linkId;
      } else {
        id = `pl_${linkId}`;
      }
      
      const response = await axios.get(`${API_URL}/payment-links/public/${id}`);
      return (response.data as any).data as PaymentLink;
    } catch (error: any) {
      console.error('Error fetching public payment link:', error);
      throw error.response?.data || error.message || 'Error fetching public payment link';
    }
  }

  /**
   * Track a click on a payment link
   */
  async trackLinkClick(linkId: string): Promise<void> {
    try {
      await axios.get(`${API_URL}/payment-links/${linkId}/track-view`);
    } catch (error: any) {
      console.error('Error tracking link click:', error);
      // Don't throw here, just log - we don't want to interrupt the user flow
    }
  }
}

export const paymentLinkService = new PaymentLinkService(); 