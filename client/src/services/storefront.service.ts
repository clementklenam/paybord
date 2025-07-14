import axios from 'axios';
import { getAuthHeader } from './auth-header';
import { StorefrontTheme } from '@/types/theme';
import { retryWithBackoff } from '@/utils/api-utils';
import { getThemeById } from '@/data/themePresets';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5002/api';

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
    _id?: string; // MongoDB _id field
    customId?: string; // Added for backend synchronization
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
    theme?: StorefrontTheme; // New theme field
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
    theme?: StorefrontTheme; // New theme field
    socialLinks?: {
        instagram?: string;
        twitter?: string;
        facebook?: string;
    };
    products?: string[] | Product[]; // Array of product IDs or Product objects
    paymentMethods?: string[];
    businessId?: string; // Business ID for the storefront
}

interface ApiResponse<T> {
    success: boolean;
    message?: string;
    data: T;
}

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
            theme: getThemeById('fashion-elegant') || undefined,
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
                    image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070'
                },
                {
                    id: 'prod_3',
                    name: 'Enterprise Plan',
                    description: 'Comprehensive solution for large organizations',
                    price: 199.99,
                    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015'
                }
            ],
            socialLinks: {
                instagram: 'premium_shop',
                twitter: 'premium_shop',
                facebook: 'premium.shop'
            },
            paymentMethods: ['card', 'bank_transfer'],
            status: 'active',
            businessId: 'bus_1'
        },
        {
            id: 'sf_2',
            name: 'Tech Gadgets',
            description: 'Latest technology and gadgets at competitive prices',
            url: 'https://tech-gadgets.paymesa.com',
            createdAt: '2023-10-05T08:15:00Z',
            updatedAt: '2023-11-20T11:45:00Z',
            visits: 2340,
            sales: 156,
            banner: 'https://images.unsplash.com/photo-1550009158-9ebf69173e03?q=80&w=2101',
            logo: 'https://images.unsplash.com/photo-1535303311164-664fc9ec6532?q=80&w=1974',
            primaryColor: '#2980b9',
            accentColor: '#3498db',
            theme: getThemeById('electronics-tech') || undefined,
            products: [
                {
                    id: 'prod_4',
                    name: 'Smart Watch',
                    description: 'Track your fitness and stay connected',
                    price: 129.99,
                    image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964'
                },
                {
                    id: 'prod_5',
                    name: 'Wireless Earbuds',
                    description: 'Premium sound quality with noise cancellation',
                    price: 89.99,
                    image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932'
                }
            ],
            socialLinks: {
                instagram: 'tech_gadgets',
                twitter: 'tech_gadgets',
                facebook: 'tech.gadgets'
            },
            paymentMethods: ['card', 'mobile_money'],
            status: 'active',
            businessId: 'bus_1'
        },
        {
            id: 'sf_3',
            name: 'Fitness Store',
            description: 'Everything you need for your fitness journey',
            url: 'https://fitness-store.paymesa.com',
            createdAt: '2023-09-12T15:40:00Z',
            visits: 980,
            sales: 42,
            banner: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=2070',
            logo: 'https://images.unsplash.com/photo-1517162418377-2b7e3e7399d8?q=80&w=1965',
            primaryColor: '#c0392b',
            accentColor: '#e74c3c',
            theme: getThemeById('sports-energetic') || undefined,
            products: [
                {
                    id: 'prod_6',
                    name: 'Yoga Mat',
                    description: 'Non-slip, eco-friendly yoga mat',
                    price: 39.99,
                    image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1974'
                },
                {
                    id: 'prod_7',
                    name: 'Resistance Bands Set',
                    description: 'Set of 5 resistance bands for home workouts',
                    price: 29.99,
                    image: 'https://images.unsplash.com/photo-1598550476439-6847785fcea6?q=80&w=2070'
                },
                {
                    id: 'prod_8',
                    name: 'Protein Powder',
                    description: 'Premium whey protein for muscle recovery',
                    price: 54.99,
                    image: 'https://images.unsplash.com/photo-1579722821273-0f6c1b5d28b0?q=80&w=1974'
                }
            ],
            socialLinks: {
                instagram: 'fitness_store',
                twitter: 'fitness_store'
            },
            paymentMethods: ['card', 'bank_transfer', 'mobile_money'],
            status: 'active',
            businessId: 'bus_1'
        }
    ];

    // Apply filters
    let filteredStorefronts = [...demoStorefronts];

    // Apply search filter
    if (filters.search) {
        const searchTerm = filters.search.toLowerCase();
        filteredStorefronts = filteredStorefronts.filter(
            sf => sf.name.toLowerCase().includes(searchTerm) ||
                sf.description.toLowerCase().includes(searchTerm)
        );
    }

    // Apply status filter
    if (filters.status) {
        filteredStorefronts = filteredStorefronts.filter(sf => sf.status === filters.status);
    }

    // Apply sorting
    if (filters?.sortBy) {
        const sortField = filters.sortBy as keyof Storefront;
        const sortOrder = filters.sortOrder === 'desc' ? -1 : 1;

        filteredStorefronts.sort((a, b) => {
            const aValue = a[sortField];
            const bValue = b[sortField];

            if (aValue == null || bValue == null) return 0;
            if (aValue < bValue) return -1 * sortOrder;
            if (aValue > bValue) return 1 * sortOrder;
            return 0;
        });
    }

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedStorefronts = filteredStorefronts.slice(startIndex, endIndex);

    return {
        data: paginatedStorefronts,
        total: filteredStorefronts.length,
        pages: Math.ceil(filteredStorefronts.length / limit),
        page,
        limit
    };
};

// Generate a single demo storefront
const generateDemoStorefront = (id: string): Storefront => {
    const products = [
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
            image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070'
        },
        {
            id: 'prod_3',
            name: 'Enterprise Plan',
            description: 'Comprehensive solution for large organizations',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015'
        }
    ];

    return {
        id: id,
        name: 'Demo Storefront',
        description: 'A demonstration storefront for testing purposes',
        url: `https://demo-${id}.paymesa.com`,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        visits: Math.floor(Math.random() * 1000) + 100,
        sales: Math.floor(Math.random() * 100) + 10,
        banner: null,
        logo: null,
        primaryColor: '#1e8449',
        accentColor: '#27ae60',
        theme: getThemeById('general-professional') || undefined,
        products: products,
        socialLinks: {
            instagram: 'paymesa',
            twitter: 'paymesa',
            facebook: 'paymesa'
        },
        paymentMethods: ['card', 'bank_transfer', 'mobile_money'],
        status: 'active',
        businessId: 'demo_business_id'
    };
};

export class StorefrontService {
    // Cache for storefront data to prevent duplicate API calls
    private static storefrontCache = new Map<string, { data: Storefront; timestamp: number }>();
    private static readonly CACHE_DURATION = 5 * 60 * 1000; // 5 minutes

    private static getCachedStorefront(id: string): Storefront | null {
        const cached = this.storefrontCache.get(id);
        if (cached && (Date.now() - cached.timestamp) < this.CACHE_DURATION) {
            return cached.data;
        }
        return null;
    }

    private static setCachedStorefront(id: string, storefront: Storefront): void {
        this.storefrontCache.set(id, { data: storefront, timestamp: Date.now() });
    }

    /**
     * Helper method to save a user-created storefront to localStorage
     */
    private saveUserStorefront(storefront: Storefront): void {
        try {
            // Get existing storefronts from localStorage
            const storefrontsJSON = localStorage.getItem('user_storefronts');
            let storefronts: Storefront[] = [];

            if (storefrontsJSON) {
                storefronts = JSON.parse(storefrontsJSON);
            }

            // Check if this storefront already exists
            const existingIndex = storefronts.findIndex(sf => sf.id === storefront.id);

            if (existingIndex >= 0) {
                // Update existing storefront
                storefronts[existingIndex] = storefront;
            } else {
                // Add new storefront
                storefronts.push(storefront);
            }

            // Save back to localStorage
            localStorage.setItem('user_storefronts', JSON.stringify(storefronts));
            console.log('Saved storefront to localStorage:', storefront.id);
        } catch (e) {
            console.error('Error saving storefront to localStorage:', e);
        }
    }

    /**
     * Sync localStorage storefronts with API
     * This method checks if localStorage storefronts exist in the API and removes them if they don't
     */
    private async syncLocalStorefronts(): Promise<void> {
        try {
            const userStorefrontsJSON = localStorage.getItem('user_storefronts');
            if (!userStorefrontsJSON) return;

            const localStorefronts: Storefront[] = JSON.parse(userStorefrontsJSON);
            const validStorefronts: Storefront[] = [];

            for (const localStorefront of localStorefronts) {
                try {
                    // Try to fetch the storefront from API to see if it exists
                    const apiStorefront = await this.getStorefrontById(localStorefront.id);
                    if (apiStorefront) {
                        // Storefront exists in API, keep it in localStorage
                        validStorefronts.push(localStorefront);
                    }
                } catch (error) {
                    // Storefront doesn't exist in API, remove it from localStorage
                    console.log(`Removing invalid storefront from localStorage: ${localStorefront.id}`);
                }
            }

            // Update localStorage with only valid storefronts
            localStorage.setItem('user_storefronts', JSON.stringify(validStorefronts));
            console.log(`Synced localStorage: ${validStorefronts.length} valid storefronts`);
        } catch (error) {
            console.error('Error syncing localStorage storefronts:', error);
        }
    }

    /**
     * Get all storefronts with optional filters
     */
    async getStorefronts(filters: StorefrontFilters = {}): Promise<StorefrontListResponse> {
        try {
            // Build query parameters
            const queryParams = new URLSearchParams();
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.status) queryParams.append('status', filters.status);
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);

            const queryString = queryParams.toString() ? `?${queryParams.toString()}` : '';
            const response = await axios.get(`${API_URL}/storefronts${queryString}`, {
                headers: getAuthHeader()
            });

            console.log('API Response:', response.data);

            // Handle the API response structure
            const apiData = response.data as ApiResponse<Storefront[]>;
            let storefronts: Storefront[] = [];
            let total = 0;
            let pages = 1;
            let page = 1;
            let limit = filters.limit || 6;

            if (apiData.success && apiData.data) {
                // API returned success with data
                storefronts = apiData.data;
                total = (apiData as any).total || 0;
                pages = (apiData as any).pages || 1;
                page = (apiData as any).page || 1;
                limit = (apiData as any).limit || 6;
            } else if (apiData.data) {
                // API returned data directly (without success wrapper)
                storefronts = apiData.data;
                total = (apiData as any).total || 0;
                pages = (apiData as any).pages || 1;
                page = (apiData as any).page || 1;
                limit = (apiData as any).limit || 6;
            } else {
                // Fallback to empty data
                storefronts = [];
                total = 0;
                pages = 1;
                page = 1;
                limit = 6;
            }

            // Ensure all storefronts have proper IDs
            const processedStorefronts = storefronts.map((storefront: any) => {
                const processed = { ...storefront };
                if (!processed.id && processed._id) {
                    processed.id = processed._id;
                }
                // Ensure required fields have defaults
                processed.status = processed.status || 'draft';
                processed.visits = processed.visits || 0;
                processed.sales = processed.sales || 0;
                processed.products = processed.products || [];
                processed.paymentMethods = processed.paymentMethods || ['card', 'bank_transfer'];
                

                
                return processed;
            });

            console.log('Processed storefronts:', processedStorefronts);

            return {
                data: processedStorefronts,
                total,
                pages,
                page,
                limit
            };
        } catch (error) {
            console.error('Error fetching storefronts:', error);
            
            // Return empty response on error
            return {
                data: [],
                total: 0,
                pages: 1,
                page: 1,
                limit: filters.limit || 6
            };
        }
    }

    /**
     * Get a storefront by ID
     */
    async getStorefrontById(id: string): Promise<Storefront> {
        // Check cache first
        const cached = StorefrontService.getCachedStorefront(id);
        if (cached) {
            console.log('Returning cached storefront:', id);
            return cached;
        }

        // Only use localStorage if demo mode is enabled
        const demoMode = localStorage.getItem('paymesa_demo_mode') === 'true';
        if (demoMode) {
            // Existing demo mode logic (if any)
            const userStorefronts = localStorage.getItem('user_storefronts');
            if (userStorefronts) {
                try {
                    const storefronts = JSON.parse(userStorefronts);
                    const userStorefront = storefronts.find((sf: Storefront) => sf.id === id || sf._id === id);
                    if (userStorefront) {
                        if (!userStorefront.id && userStorefront._id) {
                            userStorefront.id = userStorefront._id;
                        }
                        return userStorefront;
                    }
                } catch (e) {
                    console.error('Error parsing user storefronts from localStorage:', e);
                }
            }
        }
        
        // Use retry utility for rate limiting
        const storefront = await retryWithBackoff(async () => {
            const response = await axios.get<ApiResponse<Storefront>>(`${API_URL}/storefronts/${id}`, {
                headers: getAuthHeader(),
                validateStatus: (status) => status < 500, // Don't throw on 4xx errors
                timeout: 10000 // 10 second timeout
            });
            
            if (response.status === 404) {
                throw new Error('Storefront not found');
            }
            
            if (response.status >= 400) {
                throw new Error(response.data?.message || 'Failed to fetch storefront');
            }
            
            let storefront = response.data.data;
            if (storefront && typeof storefront === 'object') {
                if (!storefront.id && storefront._id) {
                    storefront.id = storefront._id;
                } else if (!storefront.id) {
                    storefront.id = id;
                }
                return storefront;
            }
            throw new Error('Invalid storefront data received from server');
        }, 3, 1000); // 3 retries, 1 second base delay

        // Cache the result
        StorefrontService.setCachedStorefront(id, storefront);
        return storefront;
    }

    /**
     * Create a new storefront
     */
    async createStorefront(data: StorefrontCreateData): Promise<Storefront> {
        try {
            console.log('StorefrontService.createStorefront called with data:', data);
            
            // Transform the data to match backend expectations
            const requestData = {
                business: data.businessId, // Backend expects 'business' field
                name: data.name,
                description: data.description,
                logo: data.logo,
                banner: data.banner,
                primaryColor: data.primaryColor,
                accentColor: data.accentColor,
                socialLinks: data.socialLinks,
                products: data.products,
                paymentMethods: data.paymentMethods,
                // Note: theme field is excluded as backend doesn't support it yet
            };

            console.log('Request data being sent to API:', requestData);
            console.log('API URL:', `${API_URL}/storefronts`);
            console.log('Auth headers:', getAuthHeader());

            const response = await axios.post<ApiResponse<Storefront>>(`${API_URL}/storefronts`, requestData, {
                timeout: 30000, // Increase timeout to 30 seconds
                headers: {
                    'Content-Type': 'application/json',
                    ...getAuthHeader()
                },
            });

            console.log('API response:', response.data);

            if (!response.data.success) {
                throw new Error(response.data.message || 'Failed to create storefront');
            }

            // Ensure the storefront has a valid ID
            const storefront = response.data.data;
            if (!storefront.id && storefront._id) {
                storefront.id = storefront._id;
            } else if (!storefront.id) {
                // Generate a client-side ID if none is provided
                storefront.id = `sf_local_${Date.now()}`;
                console.warn('Created storefront without ID, using generated ID:', storefront.id);
            }

            // Add the theme back to the storefront object for frontend use
            if (data.theme) {
                storefront.theme = data.theme;
            }

            // Save to localStorage for persistence
            this.saveUserStorefront(storefront);

            console.log('Final storefront object:', storefront);
            return storefront;
        } catch (error: any) {
            console.error('Error in createStorefront:', error);
            console.error('Error response:', error.response?.data);
            console.error('Error status:', error.response?.status);

            if (error?.code === 'ECONNABORTED') {
                throw new Error('Request timed out. Please try again.');
            }

            if (error?.response?.data?.message) {
                throw new Error(error.response.data.message);
            }

            throw new Error(
                error?.message ||
                'Failed to create storefront'
            );
        }
    }

    /**
     * Add products to a storefront
     * @param id - The ID of the storefront to add products to
     * @param productIds - Array of product IDs to add to the storefront
     * @returns The updated storefront with the added products
     */
    async addProductsToStorefront(id: string, productIds: string[]): Promise<Storefront> {
        try {
            console.log(`Adding ${productIds.length} products to storefront ${id}`);
            const response = await axios.post<ApiResponse<Storefront>>(
                `${API_URL}/storefronts/${id}/products`,
                { productIds },
                {
                    headers: getAuthHeader(),
                    validateStatus: (status) => status < 500 // Don't throw on 4xx errors
                }
            );

            console.log('Products added to storefront:', response.data);

            let result = response.data.data;
            // Ensure the storefront has an id field
            if (!result.id && result._id) {
                result.id = result._id;
            } else if (!result.id) {
                result.id = id; // Fallback to the provided ID
            }

            return result;
        } catch (error) {
            console.error('Error in addProductsToStorefront:', error);
            throw error;
        }
    }

    /**
     * Remove products from a storefront
     */
    async removeProductsFromStorefront(id: string, productIds: string[]): Promise<Storefront> {
        try {
            const response = await axios.delete<ApiResponse<Storefront>>(
                `${API_URL}/storefronts/${id}/products`,
                {
                    headers: getAuthHeader(),
                    data: { productIds }
                } as any
            );
            return response.data.data;
        } catch (error) {
            console.error(`Error removing products from storefront with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update the status of a storefront
     */
    async updateStorefrontStatus(id: string, status: 'active' | 'inactive' | 'draft'): Promise<Storefront> {
        try {
            const response = await axios.patch<ApiResponse<Storefront>>(`${API_URL}/storefronts/${id}/status`, { status }, {
                headers: getAuthHeader()
            });
            return response.data.data;
        } catch (error) {
            console.error(`Error updating status of storefront with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Get analytics for a storefront
     */
    async getStorefrontAnalytics(id: string): Promise<any> {
        try {
            const response = await axios.get(`${API_URL}/storefronts/${id}/analytics`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching analytics for storefront with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Delete a storefront
     * @param id - The ID of the storefront to delete
     * @returns The deleted storefront
     */
    async deleteStorefront(id: string): Promise<void> {
        // First try to delete from localStorage in case it's a local storefront
        try {
            const storefrontsJSON = localStorage.getItem('user_storefronts');
            if (storefrontsJSON) {
                const storefronts = JSON.parse(storefrontsJSON);
                const updatedStorefronts = storefronts.filter((sf: Storefront) => sf.id !== id && sf._id !== id);
                localStorage.setItem('user_storefronts', JSON.stringify(updatedStorefronts));
                console.log('Removed storefront from localStorage:', id);
            }
        } catch (e) {
            console.error('Error removing storefront from localStorage:', e);
        }

        // Try to delete from the API
        try {
            // First try to get the storefront to ensure we have the correct ID format
            try {
                const storefront = await this.getStorefrontById(id);
                // If we found the storefront, use the MongoDB _id for deletion
                if (storefront && storefront._id) {
                    id = storefront._id;
                }
            } catch (err) {
                // If we can't find the storefront, continue with the original ID
                console.log('Could not retrieve storefront before deletion, using provided ID:', id);
            }
            
            // Use the API_URL to ensure correct endpoint for deletion
            await axios.delete(`${API_URL}/storefronts/${id}`, {
                headers: getAuthHeader(),
                validateStatus: (status) => status < 500 // Don't throw on 4xx errors like 404
            });
            
            console.log('Storefront deleted successfully from API:', id);
        } catch (error: any) {
            // If it's a 404 error, the storefront doesn't exist on the server
            // In this case, we can still consider this a "success" since the end result is the same
            if (error.response?.status === 404) {
                console.warn(`Storefront with ID ${id} not found on server, but was removed from local state`);
                return;
            }
            
            console.error('Error deleting storefront:', error);
            throw new Error(
                error.response?.data?.message ||
                error.message ||
                'Failed to delete storefront'
            );
        }
    }
}
