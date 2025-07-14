import axios from 'axios';
import { getAuthHeader } from './auth-header';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface Product {
    _id?: string;
    id?: string;
    customId?: string;
    name: string;
    description: string;
    price: number;
    image: string;
    category?: string;
    currency?: string;
    active?: boolean;
    status?: string;
    metadata?: Record<string, string>;
    business?: string;
    businessId?: string;
    createdAt?: string;
    updatedAt?: string;
    isSelected?: boolean;
    // Additional fields for compatibility with existing code
    billingPeriod?: 'monthly' | 'yearly' | 'one-time' | null;
    pricingType?: string;
    amount?: number;
    created?: string;
    updated?: string;
}

export interface ProductFilters {
    page?: number;
    limit?: number;
    search?: string;
    category?: string;
    active?: boolean;
    sortBy?: string;
    sortOrder?: 'asc' | 'desc';
    businessId?: string;
}

export interface ProductListResponse {
    data: Product[];
    total: number;
    pages: number;
    page: number;
    limit: number;
}

export interface ProductCreateData {
    businessId: string;
    name: string;
    description: string;
    price: number;
    image?: string;
    imageUrl?: string; // For compatibility with existing code
    category?: string;
    currency?: string;
    metadata?: Record<string, string>;
    status?: string;
    billingPeriod?: 'monthly' | 'yearly' | 'one-time' | null;
}

// Generate demo data for products
const generateDemoProducts = (filters: ProductFilters = {}): ProductListResponse => {
    const demoProducts: Product[] = [
        {
            id: 'prod_1',
            name: 'Basic Plan',
            description: 'Essential features for small businesses',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-15T10:30:00Z'
        },
        {
            id: 'prod_2',
            name: 'Premium Plan',
            description: 'Advanced features with priority support',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-16T11:20:00Z'
        },
        {
            id: 'prod_3',
            name: 'Enterprise Plan',
            description: 'Comprehensive solution for large organizations',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-17T14:45:00Z'
        },
        {
            id: 'prod_4',
            name: 'Smart Watch',
            description: 'Track your fitness and stay connected',
            price: 129.99,
            image: 'https://images.unsplash.com/photo-1546868871-7041f2a55e12?q=80&w=1964',
            category: 'Electronics',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-18T09:30:00Z'
        },
        {
            id: 'prod_5',
            name: 'Wireless Earbuds',
            description: 'Premium sound quality with noise cancellation',
            price: 89.99,
            image: 'https://images.unsplash.com/photo-1590658268037-6bf12165a8df?q=80&w=1932',
            category: 'Electronics',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-19T16:20:00Z'
        },
        {
            id: 'prod_6',
            name: 'Yoga Mat',
            description: 'Non-slip, eco-friendly yoga mat',
            price: 39.99,
            image: 'https://images.unsplash.com/photo-1592432678016-e910b452f9a2?q=80&w=1974',
            category: 'Fitness',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-20T13:10:00Z'
        }
    ];

    // Apply filters
    let filteredProducts = [...demoProducts];

    if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        filteredProducts = filteredProducts.filter(product =>
            product.name.toLowerCase().includes(searchLower) ||
            product.description.toLowerCase().includes(searchLower)
        );
    }

    if (filters.category) {
        filteredProducts = filteredProducts.filter(product =>
            product.category === filters.category
        );
    }

    if (filters.active !== undefined) {
        filteredProducts = filteredProducts.filter(product =>
            product.active === filters.active
        );
    }

    // Apply sorting
    const sortBy = filters.sortBy || 'createdAt';
    const sortOrder = filters.sortOrder || 'desc';

    filteredProducts.sort((a, b) => {
        if (sortBy === 'price') {
            return sortOrder === 'asc' ? a.price - b.price : b.price - a.price;
        } else if (sortBy === 'name') {
            return sortOrder === 'asc'
                ? a.name.localeCompare(b.name)
                : b.name.localeCompare(a.name);
        } else {
            // Default sort by createdAt
            const dateA = a.createdAt ? new Date(a.createdAt).getTime() : 0;
            const dateB = b.createdAt ? new Date(b.createdAt).getTime() : 0;
            return sortOrder === 'asc' ? dateA - dateB : dateB - dateA;
        }
    });

    // Apply pagination
    const page = filters.page || 1;
    const limit = filters.limit || 10;
    const startIndex = (page - 1) * limit;
    const endIndex = startIndex + limit;
    const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

    return {
        data: paginatedProducts,
        total: filteredProducts.length,
        page,
        limit,
        pages: Math.ceil(filteredProducts.length / limit)
    };
};

export { generateDemoProducts };

// Generate a single demo product
const generateDemoProduct = (id: string): Product => {
    const product = [
        {
            id: 'prod_1',
            name: 'Basic Plan',
            description: 'Essential features for small businesses',
            price: 49.99,
            image: 'https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-15T10:30:00Z'
        },
        {
            id: 'prod_2',
            name: 'Premium Plan',
            description: 'Advanced features with priority support',
            price: 99.99,
            image: 'https://images.unsplash.com/photo-1661956602868-6ae368943878?q=80&w=2070',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-16T11:20:00Z'
        },
        {
            id: 'prod_3',
            name: 'Enterprise Plan',
            description: 'Comprehensive solution for large organizations',
            price: 199.99,
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015',
            category: 'Subscription',
            currency: 'USD',
            active: true,
            businessId: 'bus_1',
            createdAt: '2023-11-17T14:45:00Z'
        }
    ].find(p => p.id === id);

    if (product) {
        return product;
    }

    // Return a default product if ID not found
    return {
        id,
        name: 'Sample Product',
        description: 'This is a sample product description',
        price: 29.99,
        image: `https://picsum.photos/seed/${id}/800/600`,
        category: 'Other',
        currency: 'USD',
        active: true,
        businessId: 'bus_1',
        createdAt: new Date().toISOString()
    };
};

/**
 * Helper method to save a user-created product to localStorage
 */
const saveUserProduct = (product: Product): void => {
    try {
        // Get existing products from localStorage
        const productsJSON = localStorage.getItem('user_products');
        let products: Product[] = [];

        if (productsJSON) {
            products = JSON.parse(productsJSON);
        }

        // Check if this product already exists (check both id and _id fields)
        const existingIndex = products.findIndex(p =>
            (p.id && product.id && p.id === product.id) ||
            (p._id && product._id && p._id === product._id) ||
            (p.customId && product.customId && p.customId === product.customId)
        );

        if (existingIndex >= 0) {
            // Update existing product
            products[existingIndex] = {
                ...products[existingIndex],
                ...product,
                updatedAt: new Date().toISOString()
            };
        } else {
            // Add new product
            products.push({
                ...product,
                createdAt: product.createdAt || new Date().toISOString()
            });
        }

        // Save back to localStorage
        localStorage.setItem('user_products', JSON.stringify(products));
        console.log('Saved product to localStorage:', product.id || product._id);
    } catch (e) {
        console.error('Error saving product to localStorage:', e);
    }
};

export class ProductService {
    /**
     * Get all products with optional filters
     */
    async getProducts(filters: ProductFilters = {}): Promise<ProductListResponse> {
        try {
            const queryParams = new URLSearchParams();
            
            if (filters.page) queryParams.append('page', filters.page.toString());
            if (filters.limit) queryParams.append('limit', filters.limit.toString());
            if (filters.search) queryParams.append('search', filters.search);
            if (filters.category) queryParams.append('category', filters.category);
            if (filters.active !== undefined) queryParams.append('active', filters.active.toString());
            if (filters.sortBy) queryParams.append('sortBy', filters.sortBy);
            if (filters.sortOrder) queryParams.append('sortOrder', filters.sortOrder);
            if (filters.businessId) queryParams.append('business', filters.businessId);

            // Enhanced logging for better debugging
            console.log('===== PRODUCT FETCH: API REQUEST DETAILS =====');
            console.log('URL:', `${API_URL}/products?${queryParams.toString()}`);
            console.log('Method: GET');

            // Get auth token directly from localStorage for maximum reliability
            const token = localStorage.getItem('token');
            const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
            console.log('Auth token available:', !!token);

            try {
                // Make API request with axios
                const response = await axios.get<ProductListResponse>(`${API_URL}/products?${queryParams.toString()}`, {
                    headers: authHeaders
                });

                console.log('===== PRODUCT FETCH: API RESPONSE =====');
                console.log('Status:', response.status);
                console.log('Data:', JSON.stringify(response.data, null, 2));

                return response.data;
            } catch (axiosError) {
                console.error('Axios request failed, trying fetch as fallback');

                // If axios fails, try with fetch as a fallback
                const fullUrl = `${API_URL}/products?${queryParams.toString()}`;

                // Create headers with consistent typing
                const headers: Record<string, string> = {
                    'Content-Type': 'application/json'
                };

                // Only add Authorization if token exists
                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }


                const fetchResponse = await fetch(fullUrl, {
                    method: 'GET',
                    headers
                });

                if (!fetchResponse.ok) {
                    const errorText = await fetchResponse.text();
                    console.error('API error response:', errorText);
                    throw new Error(`API error: ${fetchResponse.status} - ${errorText}`);
                }

                const responseData = await fetchResponse.json() as ProductListResponse;
                console.log('Fetch response data:', JSON.stringify(responseData, null, 2));

                return responseData;
            }
        } catch (error: any) {
            console.error('PRODUCT FETCH ERROR:', error);

            if (error.response) {
                console.error('PRODUCT FETCH: API error response status:', error.response.status);
                console.error('PRODUCT FETCH: API error response data:', error.response.data);
            } else if (error.request) {
                console.error('PRODUCT FETCH: No response received from API');
            } else {
                console.error('PRODUCT FETCH: Error setting up request:', error.message);
            }

            // Try to get user products as a last resort
            try {
                console.log('PRODUCT FETCH: Falling back to localStorage products');
                const userProductsJSON = localStorage.getItem('user_products');
                if (userProductsJSON) {
                    const userProducts = JSON.parse(userProductsJSON);
                    console.log('PRODUCT FETCH: Found', userProducts.length, 'products in localStorage');

                    if (userProducts.length > 0) {
                        // Filter products by businessId if provided
                        let filteredProducts = filters.businessId
                            ? userProducts.filter((p: Product) => p.businessId === filters.businessId || p.business === filters.businessId)
                            : userProducts;

                        // Apply search filter if provided
                        if (filters.search) {
                            const query = filters.search.toLowerCase();
                            filteredProducts = filteredProducts.filter((p: Product) =>
                                p.name.toLowerCase().includes(query) ||
                                (p.description && p.description.toLowerCase().includes(query))
                            );
                        }

                        // Sort products
                        const sortBy = filters.sortBy || 'createdAt';
                        const sortOrder = filters.sortOrder || 'desc';

                        filteredProducts.sort((a: Product, b: Product) => {
                            const aValue = a[sortBy as keyof Product];
                            const bValue = b[sortBy as keyof Product];

                            if (sortOrder === 'asc') {
                                return (aValue ?? '') > (bValue ?? '') ? 1 : -1;
                            } else {
                                return (aValue ?? '') < (bValue ?? '') ? 1 : -1;
                            }
                        });

                        // Apply pagination
                        const page = filters.page || 1;
                        const limit = filters.limit || 10;
                        const startIndex = (page - 1) * limit;
                        const endIndex = startIndex + limit;
                        const paginatedProducts = filteredProducts.slice(startIndex, endIndex);

                        console.log('PRODUCT FETCH: Returning', paginatedProducts.length, 'products from localStorage');

                        return {
                            data: paginatedProducts,
                            total: filteredProducts.length,
                            pages: Math.ceil(filteredProducts.length / limit),
                            page: page,
                            limit: limit
                        };
                    }
                }
            } catch (e) {
                console.error('PRODUCT FETCH: Final fallback failed:', e);
            }

            // If all else fails, return empty result
            return {
                data: [],
                total: 0,
                pages: 1,
                page: filters.page || 1,
                limit: filters.limit || 10
            };
        }
    }

    /**
     * Get a product by ID
     */
    async getProductById(id: string): Promise<Product> {
        // First try to get user-created products from localStorage
        const userProducts = localStorage.getItem('user_products');
        if (userProducts) {
            try {
                const products = JSON.parse(userProducts);
                const userProduct = products.find((p: Product) => p.id === id);
                if (userProduct) {
                    console.log('Found user-created product:', userProduct);
                    return userProduct;
                }
            } catch (e) {
                console.error('Error parsing user products from localStorage:', e);
            }
        }

        // If no user-created product was found and demo mode is enabled, return demo data

        // Otherwise, try to fetch from the API
        try {
            const response = await axios.get<Product>(`${API_URL}/products/${id}`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error(`Error fetching product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Create a new product
     */
    async createProduct(data: ProductCreateData): Promise<Product> {
        console.log('===== PRODUCT SERVICE: createProduct called with data =====');
        console.log(JSON.stringify(data, null, 2));

        try {
            // Generate a customId for the product
            const customId = `prod_${Date.now()}`;

            // Format the data according to the backend model structure
            const productData = {
                business: data.businessId, // Backend expects 'business', not 'businessId'
                name: data.name,
                description: data.description || '',
                price: typeof data.price === 'string' ? parseFloat(data.price) : data.price, // Ensure price is a number
                image: data.image || data.imageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(data.name)}`,
                category: data.category || 'Other',
                currency: data.currency || 'USD',
                customId,
                active: true,
                metadata: data.metadata || {}
            };

            console.log('===== PRODUCT CREATION: API REQUEST DETAILS =====');
            console.log('URL:', `${API_URL}/products`);
            console.log('Method: POST');

            // Get auth token directly from localStorage for maximum reliability
            const token = localStorage.getItem('token');
            const authHeaders = token ? { 'Authorization': `Bearer ${token}` } : {};
            console.log('Auth token available:', !!token);

            console.log('Data:', JSON.stringify(productData, null, 2));

            // Try to create the product via API
            console.log('Sending API request...');
            const response = await axios.post<Product>(`${API_URL}/products`, productData, {
                headers: authHeaders
            });

            console.log('===== PRODUCT CREATION: API RESPONSE =====');
            console.log('Status:', response.status);
            console.log('Data:', JSON.stringify(response.data, null, 2));

            const createdProduct = response.data;
            saveUserProduct(createdProduct);

            return createdProduct;
        } catch (error: any) {
            console.error('===== PRODUCT CREATION ERROR =====');
            console.error('Error object:', error);

            if (error.response) {
                console.error('API error response status:', error.response.status);
                console.error('API error response data:', error.response.data);
            } else if (error.request) {
                console.error('No response received from API');
                console.error('Request details:', error.request);
            } else {
                console.error('Error setting up request:', error.message);
            }

            // If the API call fails, create a local-only product
            console.log('Creating local-only product due to API error');

            // Generate a new ID for the local product
            const localId = `prod_local_${Date.now()}`;

            // Create a new product with the provided data
            const localProduct: Product = {
                id: localId,
                customId: localId, // Store the custom ID for backend synchronization
                name: data.name,
                description: data.description || '',
                price: data.price,
                image: data.image || data.imageUrl || `https://via.placeholder.com/800x600?text=${encodeURIComponent(data.name)}`,
                category: data.category || 'Other',
                currency: data.currency || 'USD',
                active: true,
                businessId: data.businessId,
                createdAt: new Date().toISOString()
            };

            // Save the local product to localStorage
            saveUserProduct(localProduct);

            return localProduct; // Return local product instead of throwing error
        }
    }

    /**
     * Update a product
     */
    async updateProduct(id: string, data: Partial<ProductCreateData>): Promise<Product> {
        try {
            const response = await axios.put<Product>(`${API_URL}/products/${id}`, data, {
                headers: getAuthHeader()
            });

            // Save the updated product to localStorage to maintain consistency
            saveUserProduct(response.data);

            return response.data;
        } catch (error) {
            console.error(`Error updating product with ID ${id}:`, error);

            // If API update fails, try to update the local version
            try {
                // Get existing products from localStorage
                const productsJSON = localStorage.getItem('user_products');
                if (productsJSON) {
                    const products: Product[] = JSON.parse(productsJSON);
                    const existingIndex = products.findIndex(p => p.id === id);

                    if (existingIndex >= 0) {
                        // Update the local product with new data
                        const updatedProduct = {
                            ...products[existingIndex],
                            ...data,
                            updatedAt: new Date().toISOString()
                        };

                        products[existingIndex] = updatedProduct as Product;
                        localStorage.setItem('user_products', JSON.stringify(products));

                        console.log('Updated product in localStorage due to API error');
                        return updatedProduct as Product;
                    }
                }
            } catch (localError) {
                console.error('Error updating product in localStorage:', localError);
            }

            throw error;
        }
    }

    /**
     * Delete a product
     */
    async deleteProduct(id: string): Promise<void> {
        try {
            await axios.delete(`${API_URL}/products/${id}`, {
                headers: getAuthHeader()
            });

            // Also remove from localStorage
            try {
                const productsJSON = localStorage.getItem('user_products');
                if (productsJSON) {
                    const products: Product[] = JSON.parse(productsJSON);
                    const filteredProducts = products.filter(p => p.id !== id);
                    localStorage.setItem('user_products', JSON.stringify(filteredProducts));
                }
            } catch (localError) {
                console.error('Error removing product from localStorage:', localError);
            }
        } catch (error) {
            console.error(`Error deleting product with ID ${id}:`, error);
            throw error;
        }
    }

    /**
     * Update product status (active/inactive)
     */
    async updateProductStatus(id: string, active: boolean): Promise<Product> {
        try {
            const response = await axios.patch<Product>(`${API_URL}/products/${id}/status`, { active }, {
                headers: getAuthHeader()
            });

            // Save the updated product to localStorage to maintain consistency
            saveUserProduct(response.data);

            return response.data;
        } catch (error) {
            console.error(`Error updating product status with ID ${id}:`, error);

            // If API update fails, try to update the local version
            try {
                const productsJSON = localStorage.getItem('user_products');
                if (productsJSON) {
                    const products: Product[] = JSON.parse(productsJSON);
                    const existingIndex = products.findIndex(p => p.id === id);

                    if (existingIndex >= 0) {
                        const updatedProduct = {
                            ...products[existingIndex],
                            active,
                            updatedAt: new Date().toISOString()
                        };

                        products[existingIndex] = updatedProduct as Product;
                        localStorage.setItem('user_products', JSON.stringify(products));

                        console.log('Updated product status in localStorage due to API error');
                        return updatedProduct as Product;
                    }
                }
            } catch (localError) {
                console.error('Error updating product status in localStorage:', localError);
            }

            throw error;
        }
    }

    /**
     * Get product categories
     */
    async getProductCategories(): Promise<string[]> {
        try {
            const response = await axios.get<string[]>(`${API_URL}/products/categories`, {
                headers: getAuthHeader()
            });
            return response.data;
        } catch (error) {
            console.error('Error fetching product categories:', error);
            // Return default categories if API fails
            return ['Subscription', 'Electronics', 'Fitness', 'Software', 'Services', 'Other'];
        }
    }
}
