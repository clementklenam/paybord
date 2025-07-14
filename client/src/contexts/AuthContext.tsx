import React, { createContext, useContext, useState, useEffect } from 'react';
import {User, KycData, LoginData, SignupData} from '@/types/auth';
import AuthService from '@/services/auth.service';

interface AuthContextType {
  user: User | null;
  signup: (data: SignupData) => Promise<void>;
  signin: (data: LoginData) => Promise<void>;
  signout: () => void;
  error: string | null;
  clearError: () => void;
  submitKyc: (data: KycData) => Promise<void>;
  isKycSubmitted: boolean;
  loading: boolean;
  verifyOtp: (params: { type: 'email' | 'phone'; otp: string }) => Promise<void>;
  resendOtp: (type: 'email' | 'phone') => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isKycSubmitted, setIsKycSubmitted] = useState(false);
  const [loading, setLoading] = useState(true);

  const authService = new AuthService();

  useEffect(() => {
    // Check if user is already logged in
    const currentUser = authService.getCurrentUser();
    if (currentUser && currentUser.user) {
      setUser(currentUser.user as User);
      // Set axios default header with the token
      if (currentUser.token) {
        authService.setToken(currentUser.token);
      }
    }
    setLoading(false);
  }, []);

  const signup = async (data: SignupData) => {
    try {
      setLoading(true);
      const response = await authService.signup(data);
      setUser(response.user as User);
      setIsKycSubmitted(false); // New users need to submit KYC
    } catch (err: unknown) {
      const errorMessage = err.response?.data?.error || 'Failed to create account';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signin = async (data: LoginData) => {
    try {
      setLoading(true);
      const response = await authService.login(data);
      setUser(response.user as User);

      // In a real app, you would check KYC status from the backend
      setIsKycSubmitted(true); // Assuming existing users have completed KYC
    } catch (err: unknown) {
      const errorMessage = err.response?.data?.error || 'Invalid email or password';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const signout = () => {
    authService.logout();
    setUser(null);
    setIsKycSubmitted(false);
  };

  const clearError = () => {
    setError(null);
  };

  const submitKyc = async (data: KycData) => {
    try {
      setLoading(true);
      await authService.submitKyc(data);
      setIsKycSubmitted(true);
    } catch (err: unknown) {
      const errorMessage = err.response?.data?.error || 'Failed to submit KYC';
      setError(errorMessage);
      throw err;
    } finally {
      setLoading(false);
    }
  };

  const verifyOtp = async ({ type, otp }: { type: 'email' | 'phone'; otp: string }) => {
    // TODO: Implement OTP verification logic
  };

  const resendOtp = async (type: 'email' | 'phone') => {
    // TODO: Implement resend OTP logic
  };

  const value = {
    user,
    signup,
    signin,
    signout,
    error,
    clearError,
    submitKyc,
    isKycSubmitted,
    loading,
    verifyOtp,
    resendOtp
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
