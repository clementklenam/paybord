import {useState, useEffect} from 'react';
import axios from 'axios';
import AuthService from '../services/auth.service';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';
const authService = new AuthService();

export interface Product {
  _id: string;
  name: string;
  description?: string;
  price: number;
  currency: string;
  imageUrl?: string;
  businessId: string;
  category?: string;
  status?: 'active' | 'inactive' | 'draft';
  createdAt?: string;
  updatedAt?: string;
}

export const useProducts = () => {
  const [products, setProducts] = useState<Product[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      setError(null);
      try {
        const token = authService.getCurrentUser()?.token;
        if (!token) {
          setError('Authentication required');
          setIsLoading(false);
          return;
        }
        
        const response = await axios.get(`${API_URL}/products`, {
          headers: {
            Authorization: `Bearer ${token}`
          }
        });
        
        setProducts(response.data.data || []);
      } catch (err: unknown) {
        console.error('Error fetching products:', err);
        setError(err.response?.data?.message || 'Failed to fetch products');
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, []);

  return { products, isLoading, error };
}; 