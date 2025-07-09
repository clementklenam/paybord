import api from './api';
import { getAuthHeader } from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isSelected?: boolean;
}

export interface Storefront {
    id: string;
    name: string;
    description: string;
    url: string;
    createdAt: string;
    updatedAt?: string;
    visits: number;
    sales: number;
    banner: string | null;
    logo: string | null;
    primaryColor: string;
    accentColor?: string;
    products: Product[];
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        facebook?: string;
    };
    paymentMethods?: string[];
    status: 'active' | 'inactive' | 'draft';
    businessId: string;
}

export interface StorefrontFilters {
    page?: number;
    limit?: number;
    search?: string;
    status?: 'active' | 'inactive' | 'draft';
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
}

export interface StorefrontListResponse {
    data: Storefront[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}

export interface StorefrontCreateData {
    name: string;
    description: string;
    logo?: string | null;
    banner?: string | null;
    primaryColor?: string;
    accentColor?: string;
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        facebook?: string;
    };
    products?: string[]; // Array of product IDs
    paymentMethods?: string[];
}

// Add demo mode check function
const isDemoMode = (): boolean => {
    return import.meta.env.VITE_DEMO_MODE === 'true' || false;
};

// Generate demo data for storefronts
const generateDemoStorefronts = (filters: StorefrontFilters = {}): StorefrontListResponse => {
    const demoStorefronts: Storefront[] = [
        {
            id: 'sf_1',
            name: 'Premium Shop',
            description: 'High-quality products for discerning customers',
            url: 'https://premium-shop.paymesa.com',
            createdAt: '2023-11-15T10:30:00Z',
            updatedAt: '2023-12-01T14:20:00Z',
            visits: 1250,
            sales: 78,
            banner: 'https://images.unsplash.com/photo-1607082348824-0a96f2a4b9da?q=80&w=2070',
            logo: 'https://images.unsplash.com/photo-1599305445671-ac291c95aaa9?q=80&w=2069',
            primaryColor: '#1e8449',
            accentColor: '#27ae60',
            products: [
                {
                    id: 'prod_1',
                    name: 'Basic Plan',
                    description: 'Essential features for small businesses',
                    price: 49.99,
                    image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974'
                },
                {
                    id: 'prod_2',
                    name: 'Premium Plan',
                    description: 'Advanced features with priority support',
                    price: 99.99,
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015'
                }
            ],
            socialLinks: {
                instagram: 'premium_shop',
                twitter: 'premium_shop',
                facebook: 'premiumshop'
            },
            paymentMethods: ['card', 'bank_transfer'],
            status: 'active',
            businessId: 'bus_1'
        },
        {
            id: 'sf_2',
            name: 'Digital Services',
            description: 'Professional digital services for modern businesses',
            url: 'https://digital-services.paymesa.com',
            createdAt: '2023-10-05T08:15:00Z',
            updatedAt: '2023-11-20T11:45:00Z',
            visits: 3420,
            sales: 156,
            banner: 'https://images.unsplash.com/photo-1581291518633-83b4ebd1d83e?q=80&w=2070',
            logo: 'https://images.unsplash.com/photo-1618761714954-0b8cd0026356?q=80&w=1170',
            primaryColor: '#2980b9',
            accentColor: '#3498db',
            products: [
                {
                    id: 'prod_3',
                    name: 'Enterprise Solution',
                    description: 'Complete solution for large enterprises',
                    price: 299.99,
                    image: 'https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064'
                }
            ],
            socialLinks: {
                instagram: 'digital_services',
                twitter: 'digital_services',
                facebook: 'digitalservices'
            },
            paymentMethods: ['card', 'bank_transfer', 'mobile_money'],
            status: 'active',
            businessId: 'bus_1'
        },
        {
            id: 'sf_3',
            name: 'Creative Studio',
            description: 'Creative solutions for modern brands',
            url: 'https://creative-studio.paymesa.com',
            createdAt: '2023-09-12T14:20:00Z',
            updatedAt: '2023-10-30T09:15:00Z',
            visits: 1850,
            sales: 42,
            banner: 'https://images.unsplash.com/photo-1497215728101-856f4ea42174?q=80&w=2070',
            logo: 'https://images.unsplash.com/photo-1567446537708-ac4aa75c9c28?q=80&w=1974',
            primaryColor: '#8e44ad',
            accentColor: '#9b59b6',
            products: [
                {
                    id: 'prod_4',
                    name: 'Logo Design',
                    description: 'Professional logo design service',
                    price: 149.99,
                    image: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?q=80&w=2070'
                },
                {
                    id: 'prod_5',
                    name: 'Brand Identity',
                    description: 'Complete brand identity package',
                    price: 499.99,
                    image: 'https://images.unsplash.com/photo-1434030216411-0b793f4b4173?q=80&w=2070'
                }
            ],
            socialLinks: {
                instagram: 'creative_studio',
                twitter: 'creative_studio',
                facebook: 'creativestudio'
            },
            paymentMethods: ['card'],
            status: 'inactive',
            businessId: 'bus_1'
        }
    ];
    
    // Apply filters
    let filteredStorefronts = [...demoStorefronts];
    
    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredStorefronts = filteredStorefronts.filter(sf => 
            sf.name.toLowerCase().includes(searchTerm) || 
            sf.description.toLowerCase().includes(searchTerm)
        );
    }
    
    // Apply status filter
    if (filters.status) {
        filteredStorefronts = filteredStorefronts.filter(sf => sf.status === filters.status);
    }
    
    // Apply sorting if specified
    if (filters.sortBy) {
        filteredStorefronts.sort((a, b) => {
            const aValue = a[filters.sortBy as keyof Storefront];
            const bValue = b[filters.sortBy as keyof Storefront];
            
            if (filters.sortOrder === 'desc') {
                return String(aValue) > String(bValue) ? -1 : String(aValue) < String(bValue) ? 1 : 0;
            }
            
            return String(aValue) < String(bValue) ? -1 : String(aValue) > String(bValue) ? 1 : 0;
        });
    }
    
    // Apply pagination
    const currentPage = filters.page || 1;
    const pageSize = filters.limit || 10;
    const totalPages = Math.ceil(filteredStorefronts.length / pageSize);
    const startIndex = (currentPage - 1) * pageSize;
    const endIndex = startIndex + pageSize;
    const paginatedStorefronts = filteredStorefronts.slice(startIndex, endIndex);
    
    return {
        data: paginatedStorefronts,
        total: filteredStorefronts.length,
        pages: totalPages,
        page: currentPage,
        limit: pageSize
    };
};

// Generate a single demo storefront
const generateDemoStorefront = (id: string): Storefront => {
    const demoStorefronts = generateDemoStorefronts().data;
    const storefront = demoStorefronts.find(sf => sf.id === id);
    
    if (storefront) {
        return storefront;
    }
    
    // Return a default storefront if ID not found
    return {
        id,
        name: 'New Storefront',
        description: 'A new storefront created for demonstration',
        url: `https://new-storefront-${id}.paymesa.com`,
        createdAt: new Date().toISOString(),
        visits: 0,
        sales: 0,
        banner: null,
        logo: null,
        primaryColor: '#1e8449',
        accentColor: '#27ae60',
        products: [],
        socialLinks: {},
        paymentMethods: ['card'],
        status: 'draft',
        businessId: 'bus_1'
    };
};

// Storefront service class
export class StorefrontService {
    /**
     * Get all storefronts with optional filtering
     */
    async getStorefronts(filters: StorefrontFilters = {}): Promise<StorefrontListResponse> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefronts');
            return generateDemoStorefronts(filters);
        }
        
        try {
            const queryParams = new URLSearchParams();
            
            // Add filters to query params
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
            
            const response = await api.get(`${API_URL}/storefronts?${queryParams.toString()}`, {
                headers: getAuthHeader()
            });
            
            return response.data;
        } catch (error) {
            console.error('Error fetching storefronts:', error);
            throw error;
        }
    }
    
    /**
     * Get a storefront by ID
     */
    async getStorefrontById(id: string): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront details');
            return generateDemoStorefront(id);
        }
        
        try {
            const response = await api.get(`${API_URL}/storefronts/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Create a new storefront
     */
    async createStorefront(data: StorefrontCreateData): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront creation');
            
            const newId = `sf_${Date.now()}`;
            const domain = data.name.toLowerCase().replace(/\s+/g, '-');
            
            // Convert product IDs to product objects
            const products: Product[] = (data.products || []).map(productId => ({
                id: productId,
                name: `Product ${productId}`,
                description: 'Product description',
                price: 99.99,
                image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974'
            }));
            
            return {
                id: newId,
                name: data.name,
                description: data.description,
                url: `https://${domain}.paymesa.com`,
                createdAt: new Date().toISOString(),
                visits: 0,
                sales: 0,
                banner: data.banner || null,
                logo: data.logo || null,
                primaryColor: data.primaryColor || '#1e8449',
                accentColor: data.accentColor,
                products: products,
                socialLinks: data.socialLinks || {},
                paymentMethods: data.paymentMethods || ['card'],
                status: 'active',
                businessId: 'bus_demo'
            };
        }
        
        try {
            const response = await api.post(`${API_URL}/storefronts`, data, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error creating storefront:', error);
            throw error;
        }
    }
    
    /**
     * Update an existing storefront
     */
    async updateStorefront(id: string, data: Partial<StorefrontCreateData>): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront update');
            
            const existingStorefront = generateDemoStorefront(id);
            
            // Convert product IDs to product objects if provided
            let products = existingStorefront.products;
            if (data.products) {
                products = data.products.map(productId => ({
                    id: productId,
                    name: `Product ${productId}`,
                    description: 'Product description',
                    price: 99.99,
                    image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974'
                }));
            }
            
            return {
                ...existingStorefront,
                name: data.name || existingStorefront.name,
                description: data.description || existingStorefront.description,
                logo: data.logo !== undefined ? data.logo : existingStorefront.logo,
                banner: data.banner !== undefined ? data.banner : existingStorefront.banner,
                primaryColor: data.primaryColor || existingStorefront.primaryColor,
                accentColor: data.accentColor || existingStorefront.accentColor,
                socialLinks: data.socialLinks || existingStorefront.socialLinks,
                products: products,
                paymentMethods: data.paymentMethods || existingStorefront.paymentMethods,
                updatedAt: new Date().toISOString()
            };
        }
        
        try {
            const response = await api.put(`${API_URL}/storefronts/${id}`, data, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Delete a storefront
     */
    async deleteStorefront(id: string): Promise<{ success: boolean; message: string }> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront deletion');
            
            return {
                success: true,
                message: `Storefront with ID ${id} has been deleted successfully`
            };
        }
        
        try {
            const response = await api.delete(`${API_URL}/storefronts/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error deleting storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Add products to a storefront
     */
    async addProductsToStorefront(id: string, productIds: string[]): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for adding products to storefront');
            
            const existingStorefront = generateDemoStorefront(id);
            
            // Add new products
            const existingProductIds = existingStorefront.products.map(p => p.id);
            const newProductIds = productIds.filter(pid => !existingProductIds.includes(pid));
            
            const newProducts: Product[] = newProductIds.map(pid => ({
                id: pid,
                name: `Product ${pid}`,
                description: 'Product description',
                price: Math.floor(Math.random() * 10000) / 100,
                image: `https://picsum.photos/seed/${pid}/300/200`
            }));
            
            return {
                ...existingStorefront,
                products: [
                    ...existingStorefront.products,
                    ...newProducts
                ],
                updatedAt: new Date().toISOString()
            };
        }
        
        try {
            const response = await api.post(`${API_URL}/storefronts/${id}/products`, {
                productIds
            }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error adding products to storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Remove products from a storefront
     */
    async removeProductsFromStorefront(id: string, productIds: string[]): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for removing products from storefront');
            
            const existingStorefront = generateDemoStorefront(id);
            
            // Filter out the products to remove
            const updatedProducts = existingStorefront.products.filter(
                product => !productIds.includes(product.id)
            );
            
            return {
                ...existingStorefront,
                products: updatedProducts,
                updatedAt: new Date().toISOString()
            };
        }
        
        try {
            const response = await api.delete(`${API_URL}/storefronts/${id}/products`, {
                headers: getAuthHeader(),
                data: { productIds }
            });
            return response.data;
        } catch (error) {
            console.error(`Error removing products from storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Update storefront status (activate/deactivate)
     */
    async updateStorefrontStatus(id: string, status: 'active' | 'inactive' | 'draft'): Promise<Storefront> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for updating storefront status');
            
            const existingStorefront = generateDemoStorefront(id);
            
            return {
                ...existingStorefront,
                status,
                updatedAt: new Date().toISOString()
            };
        }
        
        try {
            const response = await api.patch(`${API_URL}/storefronts/${id}/status`, { status }, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error updating status for storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Upload an image for a storefront (logo or banner)
     */
    async uploadStorefrontImage(
        id: string, 
        imageType: 'logo' | 'banner', 
        file: File
    ): Promise<{ url: string }> {
        // If demo mode is enabled, simulate image upload
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront image upload');
            
            // Create a fake URL for the uploaded image
            return { 
                url: URL.createObjectURL(file)
            };
        }
        
        try {
            // Create form data for the file
            const formData = new FormData();
            formData.append('image', file);
            formData.append('type', imageType);
            
            const response = await api.post(`${API_URL}/storefronts/${id}/upload-image`, formData, {
                headers: {
                    ...getAuthHeader(),
                    'Content-Type': 'multipart/form-data'
                }
            });
            
            return response.data;
        } catch (error) {
            console.error(`Error uploading ${imageType} for storefront with ID ${id}:`, error);
            throw error;
        }
    }
    
    /**
     * Get storefront analytics
     */
    async getStorefrontAnalytics(id: string, period: 'day' | 'week' | 'month' | 'year' = 'month'): Promise<{
        visits: { date: string; count: number }[];
        sales: { date: string; count: number; amount: number }[];
        totalVisits: number;
        totalSales: number;
        totalRevenue: number;
    }> {
        // If demo mode is enabled, return client-side generated demo data
        if (isDemoMode()) {
            console.log('Using client-side demo data for storefront analytics');
            
            // Generate dates for the last 30 days
            const dates = Array.from({ length: 30 }, (_, i) => {
                const date = new Date();
                date.setDate(date.getDate() - i);
                return date.toISOString().split('T')[0];
            }).reverse();
            
            // Generate random data for visits and sales
            const visits = dates.map(date => ({
                date,
                count: Math.floor(Math.random() * 100) + 10
            }));
            
            const sales = dates.map(date => ({
                date,
                count: Math.floor(Math.random() * 20) + 1,
                amount: (Math.floor(Math.random() * 2000) + 100) / 100
            }));
            
            const totalVisits = visits.reduce((sum, item) => sum + item.count, 0);
            const totalSales = sales.reduce((sum, item) => sum + item.count, 0);
            const totalRevenue = sales.reduce((sum, item) => sum + item.amount, 0);
            
            return {
                visits,
                sales,
                totalVisits,
                totalSales,
                totalRevenue
            };
        }
        
        try {
            const response = await api.get(`${API_URL}/storefronts/${id}/analytics`, {
                params: { period },
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching analytics for storefront with ID ${id}:`, error);
            throw error;
        }
    }
}

// Export a singleton instance
export const storefrontService = new StorefrontService();

// Export default for backward compatibility
export default storefrontService;