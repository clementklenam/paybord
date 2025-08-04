// Currency formatting utility
export const formatCurrency = (amount: number, currency: string = 'USD'): string => {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  }).format(amount);
};

// Get currency symbol
export const getCurrencySymbol = (currency: string = 'USD'): string => {
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: currency,
  });
  
  // Extract symbol from formatted string
  const parts = formatter.formatToParts(0);
  const symbol = parts.find(part => part.type === 'currency')?.value || currency;
  
  return symbol;
};

// Format amount without currency symbol
export const formatAmount = (amount: number): string => {
  return new Intl.NumberFormat('en-US', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};
