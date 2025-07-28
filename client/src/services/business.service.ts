import { api, API_URL } from './api';
import {Business, BusinessRegistrationData, VerificationDocument} from '../types/business';

export default class BusinessService {
    // Cache for business profile checks
    private static hasBusinessCache: { exists: boolean; timestamp: number } | null = null;
    
    /**
     * Update the business cache
     * @param exists Whether the business exists
     */
    static updateBusinessCache(exists: boolean): void {
        BusinessService.hasBusinessCache = { exists, timestamp: Date.now() };
    }
    
    /**
     * Register a new business
     * @param data Business registration data
     */
    async registerBusiness(data: BusinessRegistrationData): Promise<{ success: boolean; business: Business }> {
        const response = await api.post('/business/register', data);
        // Update cache after successful registration using the public method
        BusinessService.updateBusinessCache(true);
        return response.data as { success: boolean; business: Business };
    }

    /**
     * Get business profile
     */
    async getBusinessProfile(): Promise<Business> {
        // Add a small delay to prevent rate limiting
        await new Promise(resolve => setTimeout(resolve, 100));
        
        const response = await api.get('/business/profile');
        return response.data as Business;
    }

    /**
     * Update business profile
     * @param data Business data to update
     */
    async updateBusinessProfile(data: Partial<BusinessRegistrationData>): Promise<{ success: boolean; business: Business }> {
        const response = await api.put('/business/profile', data);
        return response.data as { success: boolean; business: Business };
    }

    /**
     * Upload verification document
     * @param documentType Type of document
     * @param file Document file
     */
    async uploadVerificationDocument(
        documentType: string,
        file: File
    ): Promise<{ success: boolean; document: VerificationDocument }> {
        try {
            console.log('Uploading document:', { documentType, fileName: file.name });
            
            // Create form data for the file
            const formData = new FormData();
            formData.append('document', file);
            
            // Use a more direct approach with fetch instead of axios
            const token = localStorage.getItem('token');
            // Include the documentType in the URL path
            const apiUrl = `${API_URL}/business/upload-document/${encodeURIComponent(documentType)}`;
            
            console.log(`Sending request to: ${apiUrl}`);
            
            const response = await fetch(apiUrl, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    // Don't set Content-Type header when using FormData, browser will set it with boundary
                },
                body: formData
            });
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || 'Failed to upload document');
            }
            
            const data = await response.json();
            return data as { success: boolean; document: VerificationDocument };
        } catch (error) {
            if (error instanceof Error) {
                console.error('Error uploading document:', error.message);
            } else {
                console.error('Error uploading document:', error);
            }
            throw error;
        }
    }

    /**
     * Check business verification status
     */
    async checkVerificationStatus(): Promise<{
        verificationStatus: string;
        documents: VerificationDocument[]
    }> {
        const response = await api.get('/business/verification-status');
        return response.data as {
            verificationStatus: string;
            documents: VerificationDocument[]
        };
    }

    /**
     * Check if business exists for current user
     */
    async hasRegisteredBusiness(): Promise<boolean> {
        // Check cache first (valid for 5 minutes)
        const cacheValidTime = 5 * 60 * 1000; // 5 minutes in milliseconds
        if (BusinessService.hasBusinessCache && 
            (Date.now() - BusinessService.hasBusinessCache.timestamp) < cacheValidTime) {
            return BusinessService.hasBusinessCache.exists;
        }
        
        // Use native fetch instead of axios to avoid console errors
        try {
            // Get the token from localStorage
            const token = localStorage.getItem('token');
            if (!token) return false;
            
            // Add a small delay to prevent rate limiting
            await new Promise(resolve => setTimeout(resolve, 200));
            
            // Make a silent fetch request
            const response = await fetch(`${API_URL}/business/profile`, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            });
            
            // Check if business exists
            const exists = response.ok;
            
            // Update cache
            BusinessService.hasBusinessCache = { exists, timestamp: Date.now() };
            return exists;
        } catch (error) {
            // Silently fail and return false
            BusinessService.hasBusinessCache = { exists: false, timestamp: Date.now() };
            return false;
        }
    }
}

/**
 * Fetch all businesses for the current user
 */
export async function getBusinessesForUser(): Promise<Business[]> {
    const response = await api.get('/business'); // Adjust endpoint if needed
    // Expecting response.data.data to be an array of businesses
    const responseData = response.data as { data?: Business[] } | Business[];
    if ('data' in responseData && responseData.data) {
        return responseData.data;
    }
    return responseData as Business[];
}
