import { useState, useEffect } from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authService = new AuthService();

export interface Business {
  _id: string;
  name: string;
  description?: string;
  logo?: string;
  industry?: string;
  address?: {
    street?: string;
    city?: string;
    state?: string;
    country?: string;
    postalCode?: string;
  };
  createdAt?: string;
  updatedAt?: string;
  businessName?: string; // Added to support server response format
}

// Temporary mock data to ensure there's always some business to select
// Using valid MongoDB ObjectId format (24 hex characters)
const mockBusinesses: Business[] = [
  {
    _id: '507f1f77bcf86cd799439011',
    name: 'Demo Business',
    description: 'A demo business for testing'
  },
  {
    _id: '507f1f77bcf86cd799439012',
    name: 'Test Company',
    description: 'A test company account'
  }
];

export const useBusinesses = () => {
  const [businesses, setBusinesses] = useState<Business[]>(mockBusinesses);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchBusinesses = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = authService.getCurrentUser()?.token;
        if (!token) {
          setError('Authentication required');
          setIsLoading(false);
          console.log('No authentication token found');
          return;
        }
        
        // First try to get the user's business profile
        try {
          console.log('Fetching user business profile from:', `${API_URL}/business/profile`);
          const profileResponse = await axios.get(`${API_URL}/business/profile`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          
          console.log('User business profile response:', profileResponse.data);
          
          if (profileResponse.data && profileResponse.data._id) {
            // Format the business profile to match the Business interface
            const userBusiness: Business = {
              _id: profileResponse.data._id,
              name: profileResponse.data.businessName || 'My Business',
              description: profileResponse.data.description || 'Your business',
              logo: profileResponse.data.logo,
              industry: profileResponse.data.industry
            };
            
            // Add the user's business at the top of the list
            console.log('Setting business with user business profile first');
            setBusinesses([userBusiness]);
            setIsLoading(false);
            return;
          }
        } catch (profileErr) {
          console.log('No user business profile found, will try generic endpoint');
        }
        
        // If no profile found, try the general business endpoint
        console.log('Fetching businesses from:', `${API_URL}/business`);
        const response = await axios.get(`${API_URL}/business`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        console.log('Businesses response:', response.data);
        
        if (response.data && Array.isArray(response.data.data) && response.data.data.length > 0) {
          // Add real businesses without the mock data
          const realBusinesses = response.data.data;
          setBusinesses(realBusinesses);
        } else {
          // If no real businesses, keep the mock data to ensure UI works
          console.log('No businesses found in API response, using mock data');
        }
      } catch (err: any) {
        console.error('Error fetching businesses:', err);
        setError(err.response?.data?.message || 'Failed to fetch businesses');
        // Keep mock data to ensure UI functionality
      } finally {
        setIsLoading(false);
      }
    };

    fetchBusinesses();
  }, []);

  return { businesses, isLoading, error };
}; 