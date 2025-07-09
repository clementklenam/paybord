import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface DashboardSummary {
    today: {
        grossVolume: {
            amount: number;
            lastUpdated: string;
            trend: number;
        };
        balance: {
            amount: number;
            type: string;
            trend: number;
        };
    };
    overview: {
        grossVolume: {
            total: number;
            previousPeriod: number;
            trend: Array<{ name: string; value: number }>;
            lastUpdated: string;
        };
        netVolume: {
            total: number;
            previousPeriod: number;
            trend: Array<{ name: string; value: number }>;
            lastUpdated: string;
        };
        newCustomers: {
            total: number;
            previousPeriod: number;
            trend: Array<{ name: string; value: number }>;
            lastUpdated: string;
        };
        topCustomers: Array<{ name: string; spend: number }>;
    };
}

export default class DashboardService {
    async getDashboardSummary(timeRange: string = 'last7days'): Promise<DashboardSummary> {
        const response = await axios.get(`${API_URL}/dashboard/summary`, {
            params: { timeRange }
        });
        return response.data;
    }

    async getRevenueStats(timeRange: string = 'last7days'): Promise<{
        data: Array<{ date: string; amount: number }>;
        total: number;
        change: number;
    }> {
        const response = await axios.get(`${API_URL}/dashboard/revenue`, {
            params: { timeRange }
        });
        return response.data;
    }

    async getCustomerStats(timeRange: string = 'last7days'): Promise<{
        data: Array<{ date: string; count: number }>;
        total: number;
        change: number;
    }> {
        const response = await axios.get(`${API_URL}/dashboard/customers`, {
            params: { timeRange }
        });
        return response.data;
    }

    async getTopProducts(timeRange: string = 'last7days', limit: number = 5): Promise<
        Array<{
            id: string;
            name: string;
            sales: number;
            revenue: number;
        }>
    > {
        const response = await axios.get(`${API_URL}/dashboard/top-products`, {
            params: { timeRange, limit }
        });
        return response.data;
    }

    async getTopCustomers(timeRange: string = 'last7days', limit: number = 5): Promise<
        Array<{
            id: string;
            name: string;
            spend: number;
        }>
    > {
        const response = await axios.get(`${API_URL}/dashboard/top-customers`, {
            params: { timeRange, limit }
        });
        return response.data;
    }
}
