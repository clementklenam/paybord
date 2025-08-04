import axios from 'axios';
import {getAuthHeader} from './auth-header';
import { API_URL } from './api';

export interface Subscription {
  _id?: string;
  customer: string | any;
  product: string | any;
  price: number;
  currency: string;
  interval: 'day' | 'week' | 'month' | 'year';
  status?: string;
  startDate?: string;
  endDate?: string;
  nextBillingDate?: string;
  // Paystack-specific fields
  paystackSubscriptionId?: string;
  paystackCustomerId?: string;
  paystackPlanId?: string;
  paymentMethodId?: string;
  trialEnd?: string;
  currentPeriodStart?: string;
  currentPeriodEnd?: string;
  // Invoice fields
  invoiceId?: string;
  invoiceStatus?: 'draft' | 'sent' | 'paid' | 'overdue' | 'cancelled';
  invoiceSentAt?: string;
  invoiceDueDate?: string;
  paymentLink?: string;
  paystackPaymentUrl?: string;
  metadata?: Record<string, any>;
  createdAt?: string;
  updatedAt?: string;
}

export class SubscriptionService {
  async createSubscription(data: Partial<Subscription>): Promise<Subscription> {
    const response = await axios.post<{success: boolean, subscription: Subscription, message: string}>(`${API_URL}/paystack-subscriptions`, data, {
      headers: getAuthHeader()
    });
    return response.data.subscription;
  }

  async listSubscriptions(customer?: string): Promise<Subscription[]> {
    const params = customer ? { customer } : undefined;
    const response = await axios.get<{success: boolean, subscriptions: Subscription[], count: number}>(`${API_URL}/paystack-subscriptions`, {
      headers: getAuthHeader(),
      params
    });
    return response.data.subscriptions;
  }

  async getSubscription(id: string): Promise<Subscription> {
    const response = await axios.get<{success: boolean, subscription: Subscription}>(`${API_URL}/paystack-subscriptions/${id}`, {
      headers: getAuthHeader()
    });
    return response.data.subscription;
  }

  async sendInvoice(subscriptionId: string): Promise<{paymentLink: string, paystackUrl?: string}> {
    const response = await axios.post<{success: boolean, paymentLink: string, paystackUrl?: string, subscription: Subscription, message: string}>(`${API_URL}/paystack-subscriptions/${subscriptionId}/send-invoice`, {}, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  async getPaymentStatus(subscriptionId: string): Promise<{isPaid: boolean, paymentLink?: string}> {
    const response = await axios.get<{success: boolean, subscription: Subscription, paymentLink?: string, isPaid: boolean}>(`${API_URL}/paystack-subscriptions/${subscriptionId}/payment-status`, {
      headers: getAuthHeader()
    });
    return response.data;
  }

  async cancelSubscription(id: string): Promise<Subscription> {
    const response = await axios.put<{success: boolean, subscription: Subscription, message: string}>(`${API_URL}/paystack-subscriptions/${id}/cancel`, {}, {
      headers: getAuthHeader()
    });
    return response.data.subscription;
  }
}

export default new SubscriptionService(); 