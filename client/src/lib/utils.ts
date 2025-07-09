import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatCurrency(amount: number, currency: string = "GHS"): string {
  // Handle different currencies with appropriate locales
  const currencyConfigs: { [key: string]: { locale: string; currency: string } } = {
    'GHS': { locale: 'en-GH', currency: 'GHS' },
    'NGN': { locale: 'en-NG', currency: 'NGN' },
    'KES': { locale: 'en-KE', currency: 'KES' },
    'ZAR': { locale: 'en-ZA', currency: 'ZAR' },
    'EGP': { locale: 'en-EG', currency: 'EGP' },
    'MAD': { locale: 'en-MA', currency: 'MAD' },
    'USD': { locale: 'en-US', currency: 'USD' },
    'EUR': { locale: 'en-EU', currency: 'EUR' },
    'GBP': { locale: 'en-GB', currency: 'GBP' },
    'XOF': { locale: 'en-SN', currency: 'XOF' },
    'XAF': { locale: 'en-CM', currency: 'XAF' }
  };

  const config = currencyConfigs[currency] || { locale: 'en-US', currency: currency };
  
  try {
    return new Intl.NumberFormat(config.locale, {
      style: 'currency',
      currency: config.currency,
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(amount);
  } catch (error) {
    // Fallback for unsupported currencies
    console.warn(`Currency ${currency} not supported, using fallback formatting`);
    return `${currency} ${amount.toFixed(2)}`;
  }
}
