import axios from 'axios';
import { getAuthHeader } from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PaymentMethod {
    id: string;
    type: 'card' | 'bank_account' | 'wallet';
    details: any;
    isDefault: boolean;
    createdAt: string;
}

export interface Address {
    line1?: string;
    line2?: string;
    city?: string;
    state?: string;
    postalCode?: string;
    country?: string;
}

export interface Customer {
    _id: string;
    customerId: string;
    email: string;
    name: string;
    phone?: string;
    description?: string;
    metadata?: Record<string, string>;
    defaultPaymentMethod?: string;
    paymentMethods: PaymentMethod[];
    billingAddress?: Address;
    shippingAddress?: Address;
    createdAt: string;
    updatedAt: string;
}

export interface CustomerListResponse {
    customers: Customer[];
    pagination: {
        total: number;
        pages: number;
        page: number;
        limit: number;
    };
}

export interface CustomerFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: string;
    country?: string;
    dateRange?: {
        startDate?: string;
        endDate?: string;
    };
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export default class CustomerService {
    async getCustomers(filters: CustomerFilters = {}): Promise<CustomerListResponse> {
        const params = new URLSearchParams();

        // Handle basic filters
        if (filters.page) params.append('page', String(filters.page));
        if (filters.limit) params.append('limit', String(filters.limit));
        if (filters.search) params.append('search', filters.search);
        if (filters.status) params.append('status', filters.status);
        if (filters.country) params.append('country', filters.country);
        if (filters.sortBy) params.append('sortBy', filters.sortBy);
        if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
        
        // Handle date range filter
        if (filters.dateRange) {
            if (filters.dateRange.startDate) {
                params.append('startDate', filters.dateRange.startDate);
            }
            if (filters.dateRange.endDate) {
                params.append('endDate', filters.dateRange.endDate);
            }
        }

        const response = await axios.get(`${API_URL}/customers`, { 
            params,
            headers: getAuthHeader()
        });
        return response.data as CustomerListResponse;
    }

    async getCustomerById(id: string): Promise<Customer> {
        const response = await axios.get<Customer>(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async createCustomer(data: {
        email: string;
        name: string;
        phone?: string;
        description?: string;
        metadata?: Record<string, string>;
        billingAddress?: Address;
        shippingAddress?: Address;
    }): Promise<Customer> {
        const response = await axios.post<Customer>(`${API_URL}/customers`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async updateCustomer(id: string, data: {
        email?: string;
        name?: string;
        phone?: string;
        description?: string;
        metadata?: Record<string, string>;
        billingAddress?: Address;
        shippingAddress?: Address;
    }): Promise<Customer> {
        const response = await axios.put<Customer>(`${API_URL}/customers/${id}`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async deleteCustomer(id: string): Promise<{ message: string }> {
        const response = await axios.delete<{ message: string }>(`${API_URL}/customers/${id}`, {
            headers: getAuthHeader()
        });
        return response.data;
    }

    async addPaymentMethod(customerId: string, data: {
        type: 'card' | 'bank_account' | 'wallet';
        details: any;
        isDefault?: boolean;
    }): Promise<{ paymentMethod: PaymentMethod; customer: Customer }> {
        const response = await axios.post<{ paymentMethod: PaymentMethod; customer: Customer }>(`${API_URL}/customers/${customerId}/payment-methods`, data, {
            headers: getAuthHeader()
        });
        return response.data;
    }
    
    async getCustomersByBusiness(businessId: string): Promise<Customer[]> {
        const response = await axios.get<{ customers: Customer[] }>(`${API_URL}/customers/business/${businessId}`, {
            headers: getAuthHeader()
        });
        return response.data.customers;
    }

    // Export customers to CSV
    async exportCustomers(filters: CustomerFilters = {}): Promise<string> {
        try {
            // In real mode, we'll get all customers and generate the CSV client-side
            // This is a fallback until the backend export endpoint is ready
            const allCustomers: Customer[] = [];
            let page = 1;
            let hasMore = true;
            const limit = 100;
            
            // Fetch all customers (paginated)
            while (hasMore) {
                const response = await this.getCustomers({
                    ...filters,
                    page,
                    limit
                });
                
                allCustomers.push(...response.customers);
                
                if (response.customers.length < limit || page >= response.pagination.pages) {
                    hasMore = false;
                } else {
                    page++;
                }
            }
            
            return this.generateCSV(allCustomers);
            
            /* Uncomment when backend export endpoint is ready
            const params = new URLSearchParams();
            
            // Apply all filters
            if (filters.search) params.append('search', filters.search);
            if (filters.status) params.append('status', filters.status);
            if (filters.country) params.append('country', filters.country);
            if (filters.sortBy) params.append('sortBy', filters.sortBy);
            if (filters.sortOrder) params.append('sortOrder', filters.sortOrder);
            
            // Handle date range filter
            if (filters.dateRange) {
                if (filters.dateRange.startDate) {
                    params.append('startDate', filters.dateRange.startDate);
                }
                if (filters.dateRange.endDate) {
                    params.append('endDate', filters.dateRange.endDate);
                }
            }
            
            // Add export flag
            params.append('export', 'true');
            
            const response = await axios.get(`${API_URL}/customers/export`, {
                params,
                headers: {
                    ...getAuthHeader(),
                    'Accept': 'text/csv'
                },
                responseType: 'text'
            });
            
            return response.data;
            */
        } catch (error) {
            console.error('Error exporting customers:', error);
            throw error;
        }
    }
    
    // Generate CSV from customer data
    private generateCSV(customers: Customer[]): string {
        // Define CSV headers
        const headers = [
            'Customer ID',
            'Name',
            'Email',
            'Phone',
            'Description',
            'Created Date',
            'Updated Date',
            'Billing Address',
            'Shipping Address',
            'Timezone',
            'Language',
            'Currency'
        ];
        
        // Convert customers to CSV rows
        const rows = customers.map(customer => {
            const billingAddress = customer.billingAddress ? 
                `${customer.billingAddress.line1}, ${customer.billingAddress.city}, ${customer.billingAddress.country}` : '';
                
            const shippingAddress = customer.shippingAddress ? 
                `${customer.shippingAddress.line1}, ${customer.shippingAddress.city}, ${customer.shippingAddress.country}` : '';
            
            return [
                customer.customerId,
                customer.name,
                customer.email,
                customer.phone || '',
                customer.description || '',
                customer.createdAt,
                customer.updatedAt || '',
                billingAddress,
                shippingAddress,
                customer.metadata?.timezone || '',
                customer.metadata?.language || '',
                customer.metadata?.currency || ''
            ];
        });
        
        // Combine headers and rows
        const csvContent = [
            headers.join(','),
            ...rows.map(row => row.map(cell => `"${String(cell || '').replace(/"/g, '""')}"`).join(','))
        ].join('\n');
        
        return csvContent;
    }
}
