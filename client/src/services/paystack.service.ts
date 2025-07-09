const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export interface PaystackInitializeRequest {
  amount: number;
  email: string;
  currency?: string;
  reference: string;
  callback_url: string;
  metadata?: any;
  paymentLinkId?: string;
  customerInfo?: {
    name?: string;
    phone?: string;
    address?: string;
  };
}

export interface PaystackInitializeResponse {
  success: boolean;
  data: {
    reference: string;
    authorization_url: string;
    access_code: string;
    amount: number;
    currency: string;
  };
}

export interface PaystackVerifyResponse {
  success: boolean;
  data: {
    reference: string;
    status: string;
    amount: number;
    currency: string;
    customer?: any;
    transaction_id: string;
    payment_method: string;
  };
}

export interface Bank {
  id: number;
  name: string;
  code: string;
  active: boolean;
  country: string;
  currency: string;
  type: string;
}

export interface BanksResponse {
  success: boolean;
  data: Bank[];
}

export interface AccountResolutionRequest {
  account_number: string;
  bank_code: string;
}

export interface AccountResolutionResponse {
  success: boolean;
  data: {
    account_number: string;
    account_name: string;
    bank_id: number;
  };
}

class PaystackService {
  /**
   * Initialize a Paystack payment
   */
  async initializePayment(data: PaystackInitializeRequest): Promise<PaystackInitializeResponse> {
    const response = await fetch(`${API_BASE_URL}/paystack/initialize`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to initialize payment');
    }

    return response.json();
  }

  /**
   * Verify a Paystack payment
   */
  async verifyPayment(reference: string): Promise<PaystackVerifyResponse> {
    const response = await fetch(`${API_BASE_URL}/paystack/verify/${reference}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to verify payment');
    }

    return response.json();
  }

  /**
   * Get list of banks for bank transfer
   */
  async getBanks(): Promise<BanksResponse> {
    const response = await fetch(`${API_BASE_URL}/paystack/banks`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to fetch banks');
    }

    return response.json();
  }

  /**
   * Resolve bank account number
   */
  async resolveAccount(data: AccountResolutionRequest): Promise<AccountResolutionResponse> {
    const response = await fetch(`${API_BASE_URL}/paystack/resolve-account`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.message || 'Failed to resolve account');
    }

    return response.json();
  }
}

export const paystackService = new PaystackService(); 