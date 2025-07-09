import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import BusinessService from '@/services/business.service';
import { CURRENCY_OPTIONS, CurrencyOption } from '@/types/business';

interface CurrencyContextType {
  currency: string;
  currencySymbol: string;
  currencyLogo: string;
  isLoading: boolean;
  error: string | null;
  refreshCurrency: () => Promise<void>;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(undefined);

interface CurrencyProviderProps {
  children: ReactNode;
}

export function CurrencyProvider({ children }: CurrencyProviderProps) {
  const [currency, setCurrency] = useState<string>('GHS'); // Default fallback
  const [currencySymbol, setCurrencySymbol] = useState<string>('₵');
  const [currencyLogo, setCurrencyLogo] = useState<string>('🇬🇭');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const getCurrencyInfo = (currencyCode: string) => {
    const currencyOption = CURRENCY_OPTIONS.find(option => option.value === currencyCode);
    return {
      symbol: currencyOption?.symbol || currencyCode,
      logo: currencyOption?.logo || '🌍'
    };
  };

  const fetchBusinessCurrency = async () => {
    try {
      setIsLoading(true);
      setError(null);
      
      // Add a small delay to prevent rate limiting
      await new Promise(resolve => setTimeout(resolve, 100));
      
      const businessService = new BusinessService();
      const hasBusiness = await businessService.hasRegisteredBusiness();
      
      if (hasBusiness) {
        const businessProfile = await businessService.getBusinessProfile();
        const businessCurrency = businessProfile.currency || 'GHS';
        
        setCurrency(businessCurrency);
        const { symbol, logo } = getCurrencyInfo(businessCurrency);
        setCurrencySymbol(symbol);
        setCurrencyLogo(logo);
        
        console.log('Business currency loaded:', businessCurrency);
      } else {
        // No business registered, use default
        setCurrency('GHS');
        setCurrencySymbol('₵');
        setCurrencyLogo('🇬🇭');
        console.log('No business registered, using default currency: GHS');
      }
    } catch (err: any) {
      console.error('Error fetching business currency:', err);
      setError(err.message || 'Failed to load currency');
      // Fallback to default
      setCurrency('GHS');
      setCurrencySymbol('₵');
      setCurrencyLogo('🇬🇭');
    } finally {
      setIsLoading(false);
    }
  };

  const refreshCurrency = async () => {
    await fetchBusinessCurrency();
  };

  useEffect(() => {
    fetchBusinessCurrency();
  }, []);

  const value: CurrencyContextType = {
    currency,
    currencySymbol,
    currencyLogo,
    isLoading,
    error,
    refreshCurrency
  };

  return (
    <CurrencyContext.Provider value={value}>
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error('useCurrency must be used within a CurrencyProvider');
  }
  return context;
} 