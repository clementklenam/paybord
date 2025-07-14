export interface User {
  _id: string;
  firstName: string;
  lastName: string;
  email: string;
  username?: string;
  role?: string;
  apiKey?: string;
  businessId?: string;
  business?: Array<{_id: string, businessName: string}>;
}

export interface AuthResponse {
  user: User;
  token: string;
  apiKey?: string;
  secretKey?: string;
}

export interface SignupData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  username?: string;
}

export interface LoginData {
  email: string;
  password: string;
}

export interface OtpVerificationData {
  type: 'email' | 'phone';
  otp: string;
}

export interface KycData {
  firstName: string;
  lastName: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  idType: string;
  idNumber: string;
  idDocument: File | null;
  proofOfAddress: File | null;
}
