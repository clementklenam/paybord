export interface Business {
    _id: string;
    user: string;
    businessName: string;
    businessType: BusinessType;
    registrationNumber?: string;
    taxId?: string;
    industry: string;
    website?: string;
    email: string;
    phone: string;
    address: Address;
    complianceInfo?: ComplianceInfo;
    bankingInfo: BankingInfo;
    mobileMoneyInfo?: MobileMoneyInfo;
    verificationStatus: VerificationStatus;
    verificationDocuments: VerificationDocument[];
    merchantId: string;
    status: BusinessStatus;
    currency?: string;
    createdAt: string;
    updatedAt: string;
}

export type BusinessType = 'sole_proprietorship' | 'partnership' | 'limited_liability' | 'corporation' | 'non_profit' | 'other';

export type VerificationStatus = 'unverified' | 'pending' | 'verified' | 'rejected';

export type BusinessStatus = 'active' | 'inactive' | 'suspended';

export type PciDssLevel = 'level_1' | 'level_2' | 'level_3' | 'level_4' | 'not_applicable';

export type DocumentType = 'business_registration' | 'tax_certificate' | 'utility_bill' | 'director_id' | 'bank_statement' | 'other';

export type DocumentStatus = 'pending' | 'approved' | 'rejected';

export interface Address {
    street: string;
    city: string;
    state: string;
    postalCode?: string;
    country: string;
}

export interface ComplianceInfo {
    pciDssCompliant: boolean;
    pciDssLevel: PciDssLevel;
    dataSecurityOfficer?: {
        name?: string;
        email?: string;
        phone?: string;
    };
    dataProtectionPolicy?: {
        exists: boolean;
        lastUpdated?: string;
    };
}

export interface BankingInfo {
    bankName: string;
    accountNumber: string;
    accountName: string;
    swiftCode?: string;
    routingNumber?: string;
}

export interface MobileMoneyInfo {
    provider?: string;
    accountNumber?: string;
    accountName?: string;
}

export interface VerificationDocument {
    _id?: string;
    documentType: DocumentType;
    documentUrl: string;
    uploadDate: string;
    status: DocumentStatus;
    rejectionReason?: string;
}

export interface BusinessRegistrationData {
    businessName: string;
    businessType: BusinessType;
    registrationNumber?: string;
    taxId?: string;
    industry: string;
    website?: string;
    email: string;
    phone: string;
    address: Address;
    complianceInfo?: ComplianceInfo;
    bankingInfo: BankingInfo;
    mobileMoneyInfo?: MobileMoneyInfo;
    currency?: string;
}

export interface IndustryOption {
    value: string;
    label: string;
    description?: string;
}

export const INDUSTRY_OPTIONS: IndustryOption[] = [
    { value: 'retail', label: 'Retail' },
    { value: 'ecommerce', label: 'E-commerce' },
    { value: 'food_beverage', label: 'Food & Beverage' },
    { value: 'travel_hospitality', label: 'Travel & Hospitality' },
    { value: 'healthcare', label: 'Healthcare' },
    { value: 'education', label: 'Education' },
    { value: 'financial_services', label: 'Financial Services' },
    { value: 'professional_services', label: 'Professional Services' },
    { value: 'technology', label: 'Technology' },
    { value: 'manufacturing', label: 'Manufacturing' },
    { value: 'transportation', label: 'Transportation & Logistics' },
    { value: 'real_estate', label: 'Real Estate' },
    { value: 'agriculture', label: 'Agriculture' },
    { value: 'energy', label: 'Energy & Utilities' },
    { value: 'entertainment', label: 'Entertainment & Media' },
    { value: 'non_profit', label: 'Non-profit & NGO' },
    { value: 'other', label: 'Other' }
];

export const BUSINESS_TYPE_OPTIONS = [
    { value: 'sole_proprietorship', label: 'Sole Proprietorship' },
    { value: 'partnership', label: 'Partnership' },
    { value: 'limited_liability', label: 'Limited Liability Company (LLC)' },
    { value: 'corporation', label: 'Corporation' },
    { value: 'non_profit', label: 'Non-profit Organization' },
    { value: 'other', label: 'Other' }
];

export const AFRICAN_COUNTRIES = [
    { value: 'nigeria', label: 'Nigeria' },
    { value: 'ghana', label: 'Ghana' },
    { value: 'kenya', label: 'Kenya' },
    { value: 'south_africa', label: 'South Africa' },
    { value: 'egypt', label: 'Egypt' },
    { value: 'morocco', label: 'Morocco' },
    { value: 'tanzania', label: 'Tanzania' },
    { value: 'ethiopia', label: 'Ethiopia' },
    { value: 'uganda', label: 'Uganda' },
    { value: 'algeria', label: 'Algeria' },
    { value: 'cameroon', label: 'Cameroon' },
    { value: 'cote_divoire', label: 'Côte d\'Ivoire' },
    { value: 'senegal', label: 'Senegal' },
    { value: 'rwanda', label: 'Rwanda' },
    { value: 'zambia', label: 'Zambia' },
    { value: 'zimbabwe', label: 'Zimbabwe' },
    { value: 'botswana', label: 'Botswana' },
    { value: 'mauritius', label: 'Mauritius' },
    { value: 'namibia', label: 'Namibia' },
    { value: 'mozambique', label: 'Mozambique' }
];

export const MOBILE_MONEY_PROVIDERS = [
    { value: 'mtn_mobile_money', label: 'MTN Mobile Money' },
    { value: 'airtel_money', label: 'Airtel Money' },
    { value: 'vodafone_cash', label: 'Vodafone Cash' },
    { value: 'orange_money', label: 'Orange Money' },
    { value: 'mpesa', label: 'M-Pesa' },
    { value: 'ecocash', label: 'EcoCash' },
    { value: 'tigo_cash', label: 'Tigo Cash' },
    { value: 'moov_money', label: 'Moov Money' },
    { value: 'other', label: 'Other' }
];

export interface CurrencyOption {
    value: string;
    label: string;
    symbol: string;
    logo: string;
}

export const CURRENCY_OPTIONS: CurrencyOption[] = [
    { value: 'USD', label: 'US Dollar', symbol: '$', logo: '🇺🇸' },
    { value: 'EUR', label: 'Euro', symbol: '€', logo: '🇪🇺' },
    { value: 'GBP', label: 'British Pound', symbol: '£', logo: '🇬🇧' },
    { value: 'NGN', label: 'Nigerian Naira', symbol: '₦', logo: '🇳🇬' },
    { value: 'GHS', label: 'Ghanaian Cedi', symbol: '₵', logo: '🇬🇭' },
    { value: 'KES', label: 'Kenyan Shilling', symbol: 'KSh', logo: '🇰🇪' },
    { value: 'ZAR', label: 'South African Rand', symbol: 'R', logo: '🇿🇦' },
    { value: 'EGP', label: 'Egyptian Pound', symbol: 'E£', logo: '🇪🇬' },
    { value: 'MAD', label: 'Moroccan Dirham', symbol: 'DH', logo: '🇲🇦' },
    { value: 'XOF', label: 'West African CFA franc', symbol: 'CFA', logo: '🇸🇳' },
    { value: 'XAF', label: 'Central African CFA franc', symbol: 'FCFA', logo: '🇨🇲' }
];
