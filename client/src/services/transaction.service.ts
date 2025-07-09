import axios from 'axios';
import { getAuthHeader } from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const API_KEY = import.meta.env.VITE_API_KEY;
console.log('VITE_API_KEY in transaction.service.ts:', API_KEY);

export interface Transaction {
    id: string;
    status: 'succeeded' | 'success' | 'failed' | 'pending' | 'refunded';
    date?: string;
    created?: string;
    createdAt?: string;
    description: string;
    customer: string;
    email: string;
    paymentMethod: string;
    amount: number;
    currency: string;
    fee: number;
    failureReason?: string;
    refundReason?: string;
    cardBrand?: string;
    last4?: string;
    bankName?: string;
    provider?: string;
    phoneNumber?: string;
}

export interface TransactionListResponse {
    data: Transaction[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export interface TransactionFilters {
    status?: string[];
    paymentMethod?: string[];
    amountMin?: number;
    amountMax?: number;
    customer?: string;
    dateFrom?: string;
    dateTo?: string;
    page?: number;
    limit?: number;
    search?: string;
}

export default class TransactionService {
    async getTransactions(filters: TransactionFilters = {}): Promise<TransactionListResponse> {
        // Fetch real data from the API
        const params = new URLSearchParams();

        // Add all filters to params
        Object.entries(filters).forEach(([key, value]) => {
            if (Array.isArray(value)) {
                value.forEach(v => params.append(key, v));
            } else if (value !== undefined && value !== null) {
                params.append(key, String(value));
            }
        });

        const response = await axios.get(`${API_URL}/payments`, { 
            params,
            headers: {
                ...getAuthHeader(),
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async getTransactionById(id: string): Promise<Transaction> {
        // Fetch real data from the API
        const response = await axios.get(`${API_URL}/payments/intent/${id}`, {
            headers: {
                ...getAuthHeader(),
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async refundTransaction(id: string, amount?: number): Promise<Transaction> {
        const data = amount ? { amount } : {};
        const response = await axios.post(`${API_URL}/payments/intent/${id}/refund`, data, {
            headers: {
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async createPaymentIntent(data: {
        amount: number;
        currency?: string;
        customerId?: string;
        description?: string;
        metadata?: Record<string, string>;
    }): Promise<Transaction> {
        const response = await axios.post(`${API_URL}/payments/intent`, data, {
            headers: {
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async confirmPaymentIntent(id: string, paymentMethod: string): Promise<Transaction> {
        const response = await axios.post(`${API_URL}/payments/intent/${id}/confirm`, { paymentMethod }, {
            headers: {
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async cancelPaymentIntent(id: string): Promise<Transaction> {
        const response = await axios.post(`${API_URL}/payments/intent/${id}/cancel`, {}, {
            headers: {
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }

    async recordTransaction(data: {
        amount: number;
        currency?: string;
        customerName: string;
        customerEmail?: string;
        customerPhone?: string;
        status: 'success' | 'failed' | 'pending';
        provider?: string;
        businessId?: string;
        paymentLinkId?: string;
        paymentMethod?: string;
        paymentType?: string;
    }): Promise<Transaction> {
        const response = await axios.post(`${API_URL}/payments`, data, {
            headers: {
                ...getAuthHeader(),
                ...(API_KEY ? { 'x-api-key': API_KEY } : {})
            }
        });
        return response.data;
    }
}
