import { Customer, Address, PaymentMethod, CustomerListResponse, CustomerFilters } from './customer.service';

// Generate a random customer ID
const generateCustomerId = (): string => {
  return `cus_${Math.random().toString(36).substring(2, 10)}`;
};

// Generate a random date within the last year
const generateRandomDate = (): string => {
  const now = new Date();
  const pastDate = new Date(now.getTime() - Math.random() * 365 * 24 * 60 * 60 * 1000);
  return pastDate.toISOString();
};

// Generate a random phone number
const generatePhoneNumber = (countryCode: string = '+233'): string => {
  return `${countryCode} ${Math.floor(Math.random() * 900000000) + 100000000}`;
};

// List of countries for random selection
const countries = [
  { name: 'Ghana', code: 'GH', currency: 'GHS', phoneCode: '+233' },
  { name: 'Nigeria', code: 'NG', currency: 'NGN', phoneCode: '+234' },
  { name: 'Kenya', code: 'KE', currency: 'KES', phoneCode: '+254' },
  { name: 'South Africa', code: 'ZA', currency: 'ZAR', phoneCode: '+27' },
  { name: 'United States', code: 'US', currency: 'USD', phoneCode: '+1' },
  { name: 'United Kingdom', code: 'GB', currency: 'GBP', phoneCode: '+44' }
];

// List of languages for random selection
const languages = ['English', 'French', 'Spanish', 'Arabic', 'Swahili'];

// List of timezones for random selection
const timezones = ['Africa/Accra', 'Africa/Lagos', 'Africa/Nairobi', 'Africa/Johannesburg', 'America/New_York', 'Europe/London'];

// Generate a random address
const generateAddress = (country?: string): Address => {
  const selectedCountry = country || countries[Math.floor(Math.random() * countries.length)].name;
  
  return {
    line1: `${Math.floor(Math.random() * 1000) + 1} Main St`,
    line2: Math.random() > 0.5 ? `Apt ${Math.floor(Math.random() * 100) + 1}` : undefined,
    city: ['Accra', 'Lagos', 'Nairobi', 'Johannesburg', 'New York', 'London'][Math.floor(Math.random() * 6)],
    state: ['Greater Accra', 'Lagos State', 'Nairobi County', 'Gauteng', 'NY', 'London'][Math.floor(Math.random() * 6)],
    postalCode: `${Math.floor(Math.random() * 90000) + 10000}`,
    country: selectedCountry
  };
};

// Generate a random payment method
const generatePaymentMethod = (): PaymentMethod => {
  const types: Array<'card' | 'bank_account' | 'wallet'> = ['card', 'bank_account', 'wallet'];
  const type = types[Math.floor(Math.random() * types.length)];
  
  let details: any = {};
  
  if (type === 'card') {
    const cardBrands = ['visa', 'mastercard', 'amex'];
    details = {
      brand: cardBrands[Math.floor(Math.random() * cardBrands.length)],
      last4: `${Math.floor(Math.random() * 9000) + 1000}`,
      expMonth: Math.floor(Math.random() * 12) + 1,
      expYear: new Date().getFullYear() + Math.floor(Math.random() * 5) + 1
    };
  } else if (type === 'bank_account') {
    const banks = ['GCB Bank', 'Ecobank', 'Zenith Bank', 'Access Bank', 'Standard Chartered'];
    details = {
      bankName: banks[Math.floor(Math.random() * banks.length)],
      accountNumber: `****${Math.floor(Math.random() * 9000) + 1000}`,
      accountType: Math.random() > 0.5 ? 'checking' : 'savings'
    };
  } else {
    const wallets = ['Mobile Money', 'PayPal', 'Venmo'];
    details = {
      provider: wallets[Math.floor(Math.random() * wallets.length)],
      phoneNumber: generatePhoneNumber(),
      email: `wallet${Math.floor(Math.random() * 1000)}@example.com`
    };
  }
  
  return {
    id: `pm_${Math.random().toString(36).substring(2, 10)}`,
    type,
    details,
    isDefault: Math.random() > 0.7,
    createdAt: generateRandomDate()
  };
};

// Generate a single demo customer
export const generateDemoCustomer = (customData?: Partial<Customer>): Customer => {
  const firstName = ['John', 'Sarah', 'Michael', 'Emily', 'Robert', 'Jennifer', 'David', 'Jessica', 'Daniel', 'Linda'][Math.floor(Math.random() * 10)];
  const lastName = ['Smith', 'Johnson', 'Brown', 'Davis', 'Wilson', 'Lee', 'Taylor', 'Clark', 'Lewis', 'Young'][Math.floor(Math.random() * 10)];
  const name = `${firstName} ${lastName}`;
  const email = `${firstName.toLowerCase()}.${lastName.toLowerCase()}${Math.floor(Math.random() * 100)}@example.com`;
  
  const country = countries[Math.floor(Math.random() * countries.length)];
  const billingAddress = generateAddress(country.name);
  const useShippingAsBilling = Math.random() > 0.3;
  const shippingAddress = useShippingAsBilling ? billingAddress : generateAddress();
  
  // Generate 0-3 payment methods
  const numPaymentMethods = Math.floor(Math.random() * 4);
  const paymentMethods: PaymentMethod[] = [];
  
  for (let i = 0; i < numPaymentMethods; i++) {
    paymentMethods.push(generatePaymentMethod());
  }
  
  // Set one payment method as default if there are any
  if (paymentMethods.length > 0) {
    const defaultIndex = Math.floor(Math.random() * paymentMethods.length);
    paymentMethods.forEach((pm, index) => {
      pm.isDefault = index === defaultIndex;
    });
  }
  
  const customerId = generateCustomerId();
  const createdAt = generateRandomDate();
  
  // Additional customer metadata
  const metadata: Record<string, string> = {
    language: languages[Math.floor(Math.random() * languages.length)],
    timezone: timezones[Math.floor(Math.random() * timezones.length)],
    currency: country.currency,
    taxId: Math.random() > 0.5 ? `TAX${Math.floor(Math.random() * 1000000)}` : ''
  };
  
  return {
    _id: `id_${Math.random().toString(36).substring(2, 10)}`,
    customerId,
    name: customData?.name || name,
    email: customData?.email || email,
    phone: customData?.phone || generatePhoneNumber(country.phoneCode),
    description: customData?.description || `Customer account for ${name}`,
    metadata: customData?.metadata || metadata,
    defaultPaymentMethod: paymentMethods.length > 0 ? 
      paymentMethods.find(pm => pm.isDefault)?.id : undefined,
    paymentMethods,
    billingAddress: customData?.billingAddress || billingAddress,
    shippingAddress: customData?.shippingAddress || shippingAddress,
    createdAt: customData?.createdAt || createdAt,
    updatedAt: customData?.updatedAt || createdAt,
    ...customData
  };
};

// Generate a list of demo customers
export const generateDemoCustomers = (filters: CustomerFilters = {}): CustomerListResponse => {
  // Default pagination
  const page = filters.page || 1;
  const limit = filters.limit || 10;
  
  // Generate 50 customers
  let customers: Customer[] = [];
  for (let i = 0; i < 50; i++) {
    customers.push(generateDemoCustomer());
  }
  
  // Apply search filter if provided
  if (filters.search) {
    const search = filters.search.toLowerCase();
    customers = customers.filter(customer => 
      customer.name.toLowerCase().includes(search) || 
      customer.email.toLowerCase().includes(search) ||
      customer.phone?.toLowerCase().includes(search) ||
      customer.description?.toLowerCase().includes(search)
    );
  }
  
  // Calculate pagination
  const total = customers.length;
  const pages = Math.ceil(total / limit);
  const startIndex = (page - 1) * limit;
  const endIndex = startIndex + limit;
  
  // Return paginated results
  return {
    customers: customers.slice(startIndex, endIndex),
    pagination: {
      total,
      pages,
      page,
      limit
    },
    total,
    pages,
    page,
    limit
  };
};
