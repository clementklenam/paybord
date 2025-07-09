import api from './api';
import { AuthResponse, SignupData, LoginData, OtpVerificationData, KycData } from '../types/auth';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export default class AuthService {
  private setToken(token: string) {
    localStorage.setItem('token', token);
    // The token will be automatically added to requests by our api interceptor
  }

  async signup(data: SignupData): Promise<AuthResponse> {
    const response = await api.post('/auth/register', {
      firstName: data.firstName,
      lastName: data.lastName,
      email: data.email,
      password: data.password,
      username: data.username
    });

    if (response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }

  async login(data: LoginData): Promise<AuthResponse> {
    const response = await api.post('/auth/login', {
      email: data.email,
      password: data.password
    });

    if (response.data.token) {
      this.setToken(response.data.token);
      localStorage.setItem('user', JSON.stringify(response.data));
    }

    return response.data;
  }

  async verifyOtp(data: OtpVerificationData): Promise<{ success: boolean }> {
    const response = await api.post('/auth/verify-otp', data);
    return response.data;
  }

  async resendOtp(type: 'email' | 'phone'): Promise<{ success: boolean }> {
    const response = await api.post('/auth/resend-otp', { type });
    return response.data;
  }

  async submitKyc(data: KycData): Promise<{ success: boolean; message: string }> {
    const formData = new FormData();
    Object.entries(data).forEach(([key, value]) => {
      if (value instanceof File) {
        formData.append(key, value);
      } else {
        formData.append(key, String(value));
      }
    });

    const response = await api.post('/auth/kyc', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  }

  async checkKycStatus(): Promise<{ status: string; message: string }> {
    const response = await api.get('/auth/kyc/status');
    return response.data;
  }

  async getUserProfile(): Promise<AuthResponse> {
    const response = await api.get('/auth/profile');
    return response.data;
  }

  logout() {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    // The token will be automatically removed from requests by our api interceptor
  }

  getCurrentUser(): AuthResponse | null {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      return { token, user: JSON.parse(user) };
    }
    return null;
  }

  isAuthenticated(): boolean {
    return !!this.getCurrentUser();
  }
}
