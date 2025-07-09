import axios from 'axios';
import { getAuthHeader } from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Subscription {
  _id?: string;
  customer: string;
  product: string;
  price: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  status?: string;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export class SubscriptionService {
  async createSubscription(data: Partial<Subscription>): Promise<Subscription> {
    const response = await axios.post(`${API_URL}/subscriptions`, data, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  async listSubscriptions(customer?: string): Promise<Subscription[]> {
    const params = customer ? { customer } : undefined;
    const response = await axios.get(`${API_URL}/subscriptions`, {
      headers: getAuthHeader(),
      params
    });
    return response.data;
  }

  async getSubscription(id: string): Promise<Subscription> {
    const response = await axios.get(`${API_URL}/subscriptions/${id}`, {
      headers: getAuthHeader()
    });
    return response.data;
  }
}

export default new SubscriptionService(); 