import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/components/ui/use-toast";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import {
    Card,
    CardContent,
    CardDescription,
    CardFooter,
    CardHeader,
    CardTitle
} from "@/components/ui/card";
import { Checkbox } from "@/components/ui/checkbox";
import { Textarea } from "@/components/ui/textarea";
import {
    BusinessRegistrationData,
    BusinessType,
    BUSINESS_TYPE_OPTIONS,
    INDUSTRY_OPTIONS,
    AFRICAN_COUNTRIES,
    MOBILE_MONEY_PROVIDERS,
    CURRENCY_OPTIONS
} from "@/types/business";
import BusinessService from "@/services/business.service";
import { Check, ChevronRight, Building2, CreditCard, Shield, Upload, Landmark } from "lucide-react";

const initialFormData: BusinessRegistrationData = {
    businessName: "",
    businessType: "sole_proprietorship",
    industry: "",
    email: "",
    phone: "",
    address: {
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "nigeria"
    },
    bankingInfo: {
        bankName: "",
        accountNumber: "",
        accountName: "",
        swiftCode: "",
        routingNumber: ""
    },
    currency: "USD"
};

type Step = {
    id: string;
    title: string;
    description: string;
    icon: React.ReactNode;
};

const steps: Step[] = [
    {
        id: "business-info",
        title: "Business Information",
        description: "Basic details about your business",
        icon: <Building2 className="h-5 w-5" />
    },
    {
        id: "address",
        title: "Business Address",
        description: "Where your business is located",
        icon: <Landmark className="h-5 w-5" />
    },
    {
        id: "banking",
        title: "Banking Details",
        description: "How you'll receive payments",
        icon: <CreditCard className="h-5 w-5" />
    },
    {
        id: "compliance",
        title: "Compliance",
        description: "PCI DSS compliance information",
        icon: <Shield className="h-5 w-5" />
    },
    {
        id: "verification",
        title: "Verification",
        description: "Upload verification documents",
        icon: <Upload className="h-5 w-5" />
    }
];

interface BusinessRegistrationFormProps {
    onSuccess?: () => void;
}

export function BusinessRegistrationForm({ onSuccess }: BusinessRegistrationFormProps = {}) {
    const [currentStep, setCurrentStep] = useState(0);
    const [formData, setFormData] = useState<BusinessRegistrationData>(initialFormData);
    const [isSubmitting, setIsSubmitting] = useState(false);
    const [documents, setDocuments] = useState<{
        businessRegistration?: File;
        taxCertificate?: File;
        utilityBill?: File;
        directorId?: File;
    }>({});

    const { toast } = useToast();
    const businessService = new BusinessService();

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        const { name, value } = e.target;

        // Handle nested objects
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof BusinessRegistrationData],
                    [child]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleSelectChange = (value: string, name: string) => {
        // Handle nested objects
        if (name.includes('.')) {
            const [parent, child] = name.split('.');
            setFormData((prev) => ({
                ...prev,
                [parent]: {
                    ...prev[parent as keyof BusinessRegistrationData],
                    [child]: value
                }
            }));
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: value
            }));
        }
    };

    const handleCheckboxChange = (checked: boolean, name: string) => {
        // Handle nested objects
        if (name.includes('.')) {
            const parts = name.split('.');
            if (parts.length === 2) {
                const [parent, child] = parts;
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof BusinessRegistrationData],
                        [child]: checked
                    }
                }));
            } else if (parts.length === 3) {
                const [parent, child, grandchild] = parts;
                setFormData((prev) => ({
                    ...prev,
                    [parent]: {
                        ...prev[parent as keyof BusinessRegistrationData],
                        [child]: {
                            ...((prev[parent as keyof BusinessRegistrationData] as any)[child]),
                            [grandchild]: checked
                        }
                    }
                }));
            }
        } else {
            setFormData((prev) => ({
                ...prev,
                [name]: checked
            }));
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, files } = e.target;
        if (files && files.length > 0) {
            setDocuments((prev) => ({
                ...prev,
                [name]: files[0]
            }));
        }
    };

    const nextStep = () => {
        if (currentStep < steps.length - 1) {
            setCurrentStep(currentStep + 1);
        }
    };

    const prevStep = () => {
        if (currentStep > 0) {
            setCurrentStep(currentStep - 1);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsSubmitting(true);

        // Validate form data before submission
        const missingFields = [];
        
        // Check required fields based on backend validation
        if (!formData.businessName) missingFields.push('Business Name');
        if (!formData.businessType) missingFields.push('Business Type');
        if (!formData.industry) missingFields.push('Industry');
        if (!formData.email) missingFields.push('Email');
        if (!formData.phone) missingFields.push('Phone');
        
        // Address validation
        if (!formData.address.street) missingFields.push('Street Address');
        if (!formData.address.city) missingFields.push('City');
        if (!formData.address.state) missingFields.push('State/Province');
        if (!formData.address.country) missingFields.push('Country');
        
        // Banking info validation
        if (!formData.bankingInfo.bankName) missingFields.push('Bank Name');
        if (!formData.bankingInfo.accountNumber) missingFields.push('Account Number');
        if (!formData.bankingInfo.accountName) missingFields.push('Account Name');
        
        // If missing fields, show error and return
        if (missingFields.length > 0) {
            console.error('Missing required fields:', missingFields);
            toast({
                title: "Missing required fields",
                description: `Please fill in the following fields: ${missingFields.join(', ')}`,
                variant: "destructive",
            });
            setIsSubmitting(false);
            return;
        }
        
        console.log('Submitting form data:', JSON.stringify(formData, null, 2));
        
        // Define formattedData outside the try block so it's accessible in the catch block
        let formattedData;
        
        try {
            // First, validate all required fields based on backend validation rules
            const requiredFields = [
                { field: 'businessName', label: 'Business Name' },
                { field: 'businessType', label: 'Business Type' },
                { field: 'industry', label: 'Industry' },
                { field: 'email', label: 'Email' },
                { field: 'phone', label: 'Phone' },
                { field: 'address.street', label: 'Street Address' },
                { field: 'address.city', label: 'City' },
                { field: 'address.state', label: 'State/Province' },
                { field: 'address.country', label: 'Country' },
                { field: 'bankingInfo.bankName', label: 'Bank Name' },
                { field: 'bankingInfo.accountNumber', label: 'Account Number' },
                { field: 'bankingInfo.accountName', label: 'Account Name' }
            ];
            
            const missingFields: string[] = [];
            
            // Check each required field
            requiredFields.forEach(({ field, label }) => {
                // Handle nested fields (e.g., address.street)
                if (field.includes('.')) {
                    const [parent, child] = field.split('.');
                    if (!formData[parent as keyof BusinessRegistrationData] || 
                        !(formData[parent as keyof BusinessRegistrationData] as any)[child]) {
                        missingFields.push(label);
                    }
                } else if (!formData[field as keyof BusinessRegistrationData]) {
                    missingFields.push(label);
                }
            });
            
            // If missing fields, show error and return
            if (missingFields.length > 0) {
                console.error('Missing required fields:', missingFields);
                toast({
                    title: "Missing required fields",
                    description: `Please fill in the following fields: ${missingFields.join(', ')}`,
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            
            // Validate email format
            const emailRegex = /^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/;
            if (!emailRegex.test(formData.email)) {
                toast({
                    title: "Invalid email format",
                    description: "Please enter a valid email address",
                    variant: "destructive",
                });
                setIsSubmitting(false);
                return;
            }
            
            console.log('About to submit business registration data');
            
            // Format the data to match the backend expectations exactly
            formattedData = {
                businessName: formData.businessName,
                businessType: formData.businessType,
                industry: formData.industry,
                email: formData.email,
                phone: formData.phone,
                address: {
                    street: formData.address.street,
                    city: formData.address.city,
                    state: formData.address.state,
                    postalCode: formData.address.postalCode || '',
                    country: formData.address.country
                },
                bankingInfo: {
                    bankName: formData.bankingInfo.bankName,
                    accountNumber: formData.bankingInfo.accountNumber,
                    accountName: formData.bankingInfo.accountName,
                    swiftCode: formData.bankingInfo.swiftCode || '',
                    routingNumber: formData.bankingInfo.routingNumber || ''
                }
            };
            
            // Only add optional fields if they have values
            if (formData.registrationNumber) {
                formattedData.registrationNumber = formData.registrationNumber;
            }
            
            if (formData.taxId) {
                formattedData.taxId = formData.taxId;
            }
            
            if (formData.website) {
                formattedData.website = formData.website;
            }
            
            if (formData.mobileMoneyInfo) {
                formattedData.mobileMoneyInfo = formData.mobileMoneyInfo;
            }
            
            if (formData.complianceInfo) {
                formattedData.complianceInfo = formData.complianceInfo;
            }
            
            if (formData.currency) {
                formattedData.currency = formData.currency;
            }
            
            console.log('Formatted data for submission:', JSON.stringify(formattedData, null, 2));
            
            // Register business with formatted data
            const response = await businessService.registerBusiness(formattedData);
            console.log('Business registration successful:', response);

            // Upload verification documents if available
            if (response.success) {
                const uploadPromises = [];

                if (documents.businessRegistration) {
                    uploadPromises.push(
                        businessService.uploadVerificationDocument(
                            'business_registration',
                            documents.businessRegistration
                        )
                    );
                }

                if (documents.taxCertificate) {
                    uploadPromises.push(
                        businessService.uploadVerificationDocument(
                            'tax_certificate',
                            documents.taxCertificate
                        )
                    );
                }

                if (documents.utilityBill) {
                    uploadPromises.push(
                        businessService.uploadVerificationDocument(
                            'utility_bill',
                            documents.utilityBill
                        )
                    );
                }

                if (documents.directorId) {
                    uploadPromises.push(
                        businessService.uploadVerificationDocument(
                            'director_id',
                            documents.directorId
                        )
                    );
                }

                // Wait for all document uploads to complete
                if (uploadPromises.length > 0) {
                    await Promise.all(uploadPromises);
                    console.log('All documents uploaded successfully');
                }
                
                // Update the business cache to force a refresh of the business data
                BusinessService.updateBusinessCache(true);
                
                // Store the business name in localStorage temporarily to ensure it's available
                // immediately on the dashboard even if there's a delay in API response
                localStorage.setItem('tempBusinessName', formData.businessName);
                
                // Show success toast
                toast({
                    title: "Business registered successfully",
                    description: `${formData.businessName} has been registered with Paymesa.`,
                    variant: "default",
                });

                // Call onSuccess callback if provided
                if (onSuccess) {
                    onSuccess();
                }
                
                // Force a page reload to refresh the dashboard with the new business name
                // Use a slightly longer delay to allow the backend to process the registration
                setTimeout(() => {
                    window.location.href = '/dashboard';
                }, 2000); // Longer delay to allow the backend to process the registration
            }
        } catch (error: any) {
            console.error('Business registration error:', error);
            
            // Extract detailed error information from the response if available
            let errorMessage = "An error occurred during registration";
            
            if (error.response) {
                console.log('Error response status:', error.response.status);
                console.log('Error response data:', JSON.stringify(error.response.data, null, 2));
                console.log('Request data that was sent:', JSON.stringify(formattedData, null, 2));
                
                if (error.response.data.error) {
                    errorMessage = error.response.data.error;
                } else if (error.response.data.errors && Array.isArray(error.response.data.errors)) {
                    // Format validation errors from express-validator
                    const validationErrors = error.response.data.errors.map((err: any) => `${err.param}: ${err.msg}`).join(', ');
                    errorMessage = `Validation failed: ${validationErrors}`;
                }
            } else if (error.message) {
                errorMessage = error.message;
            }
            
            toast({
                title: "Registration failed",
                description: errorMessage,
                variant: "destructive",
            });
            
            // Reset form only on error
            setFormData(initialFormData);
            setCurrentStep(0);
            setDocuments({});
        } finally {
            setIsSubmitting(false);
        }
    };

    const renderBusinessInfoStep = () => {
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="businessName">Business Name *</Label>
                        <Input
                            id="businessName"
                            name="businessName"
                            value={formData.businessName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="businessType">Business Type *</Label>
                        <Select
                            value={formData.businessType}
                            onValueChange={(value) => handleSelectChange(value, 'businessType')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select business type" />
                            </SelectTrigger>
                            <SelectContent>
                                {BUSINESS_TYPE_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="industry">Industry *</Label>
                        <Select
                            value={formData.industry}
                            onValueChange={(value) => handleSelectChange(value, 'industry')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select industry" />
                            </SelectTrigger>
                            <SelectContent>
                                {INDUSTRY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                    <div>
                        <Label htmlFor="currency">Preferred Currency *</Label>
                        <Select
                            value={formData.currency}
                            onValueChange={(value) => handleSelectChange(value, 'currency')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.logo} {option.label} ({option.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="registrationNumber">Registration Number</Label>
                        <Input
                            id="registrationNumber"
                            name="registrationNumber"
                            value={formData.registrationNumber || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="taxId">Tax ID</Label>
                        <Input
                            id="taxId"
                            name="taxId"
                            value={formData.taxId || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="website">Website</Label>
                        <Input
                            id="website"
                            name="website"
                            value={formData.website || ''}
                            onChange={handleInputChange}
                            placeholder="https://"
                        />
                    </div>
                    <div>
                        <Label htmlFor="email">Business Email *</Label>
                        <Input
                            id="email"
                            name="email"
                            type="email"
                            value={formData.email}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="phone">Business Phone *</Label>
                        <Input
                            id="phone"
                            name="phone"
                            type="tel"
                            value={formData.phone}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="currency">Preferred Currency *</Label>
                        <Select
                            value={formData.currency}
                            onValueChange={(value) => handleSelectChange(value, 'currency')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select currency" />
                            </SelectTrigger>
                            <SelectContent>
                                {CURRENCY_OPTIONS.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.logo} {option.label} ({option.symbol})
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
        );
    };

    const renderAddressStep = () => {
        return (
            <>
                <div className="grid grid-cols-1 gap-4 mb-4">
                    <div>
                        <Label htmlFor="address.street">Street Address *</Label>
                        <Input
                            id="address.street"
                            name="address.street"
                            value={formData.address.street}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="address.city">City *</Label>
                        <Input
                            id="address.city"
                            name="address.city"
                            value={formData.address.city}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="address.state">State/Province *</Label>
                        <Input
                            id="address.state"
                            name="address.state"
                            value={formData.address.state}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="address.postalCode">Postal Code</Label>
                        <Input
                            id="address.postalCode"
                            name="address.postalCode"
                            value={formData.address.postalCode || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                    <div>
                        <Label htmlFor="address.country">Country *</Label>
                        <Select
                            value={formData.address.country}
                            onValueChange={(value) => handleSelectChange(value, 'address.country')}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select country" />
                            </SelectTrigger>
                            <SelectContent>
                                {AFRICAN_COUNTRIES.map((option) => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                </div>
            </>
        );
    };

    const renderBankingStep = () => {
        return (
            <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="bankingInfo.bankName">Bank Name *</Label>
                        <Input
                            id="bankingInfo.bankName"
                            name="bankingInfo.bankName"
                            value={formData.bankingInfo.bankName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="bankingInfo.accountName">Account Name *</Label>
                        <Input
                            id="bankingInfo.accountName"
                            name="bankingInfo.accountName"
                            value={formData.bankingInfo.accountName}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="bankingInfo.accountNumber">Account Number *</Label>
                        <Input
                            id="bankingInfo.accountNumber"
                            name="bankingInfo.accountNumber"
                            value={formData.bankingInfo.accountNumber}
                            onChange={handleInputChange}
                            required
                        />
                    </div>
                    <div>
                        <Label htmlFor="bankingInfo.swiftCode">Swift Code</Label>
                        <Input
                            id="bankingInfo.swiftCode"
                            name="bankingInfo.swiftCode"
                            value={formData.bankingInfo.swiftCode || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div>
                        <Label htmlFor="bankingInfo.routingNumber">Routing Number</Label>
                        <Input
                            id="bankingInfo.routingNumber"
                            name="bankingInfo.routingNumber"
                            value={formData.bankingInfo.routingNumber || ''}
                            onChange={handleInputChange}
                        />
                    </div>
                </div>

                <div className="mt-6">
                    <h3 className="text-lg font-medium mb-2">Mobile Money (Optional)</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="mobileMoneyInfo.provider">Provider</Label>
                            <Select
                                value={formData.mobileMoneyInfo?.provider || ''}
                                onValueChange={(value) => handleSelectChange(value, 'mobileMoneyInfo.provider')}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select provider" />
                                </SelectTrigger>
                                <SelectContent>
                                    {MOBILE_MONEY_PROVIDERS.map((option) => (
                                        <SelectItem key={option.value} value={option.value}>
                                            {option.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                        </div>
                        <div>
                            <Label htmlFor="mobileMoneyInfo.accountNumber">Account Number</Label>
                            <Input
                                id="mobileMoneyInfo.accountNumber"
                                name="mobileMoneyInfo.accountNumber"
                                value={formData.mobileMoneyInfo?.accountNumber || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                        <div>
                            <Label htmlFor="mobileMoneyInfo.accountName">Account Name</Label>
                            <Input
                                id="mobileMoneyInfo.accountName"
                                name="mobileMoneyInfo.accountName"
                                value={formData.mobileMoneyInfo?.accountName || ''}
                                onChange={handleInputChange}
                            />
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderComplianceStep = () => {
        return (
            <>
                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">PCI DSS Compliance</h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="complianceInfo.pciDssCompliant"
                                checked={formData.complianceInfo?.pciDssCompliant || false}
                                onCheckedChange={(checked) =>
                                    handleCheckboxChange(checked as boolean, 'complianceInfo.pciDssCompliant')
                                }
                            />
                            <Label htmlFor="complianceInfo.pciDssCompliant">
                                My business is PCI DSS compliant
                            </Label>
                        </div>
                    </div>

                    {formData.complianceInfo?.pciDssCompliant && (
                        <div className="grid grid-cols-1 gap-4 mb-4">
                            <div>
                                <Label htmlFor="complianceInfo.pciDssLevel">PCI DSS Level</Label>
                                <Select
                                    value={formData.complianceInfo?.pciDssLevel || 'level_4'}
                                    onValueChange={(value) => handleSelectChange(value, 'complianceInfo.pciDssLevel')}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select PCI DSS level" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="level_1">Level 1</SelectItem>
                                        <SelectItem value="level_2">Level 2</SelectItem>
                                        <SelectItem value="level_3">Level 3</SelectItem>
                                        <SelectItem value="level_4">Level 4</SelectItem>
                                        <SelectItem value="not_applicable">Not Applicable</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    )}
                </div>

                <div className="mb-6">
                    <h3 className="text-lg font-medium mb-2">Data Protection Policy</h3>
                    <div className="grid grid-cols-1 gap-4 mb-4">
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="complianceInfo.dataProtectionPolicy.exists"
                                checked={formData.complianceInfo?.dataProtectionPolicy?.exists || false}
                                onCheckedChange={(checked) =>
                                    handleCheckboxChange(checked as boolean, 'complianceInfo.dataProtectionPolicy.exists')
                                }
                            />
                            <Label htmlFor="complianceInfo.dataProtectionPolicy.exists">
                                My business has a data protection policy
                            </Label>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderVerificationStep = () => {
        return (
            <>
                <div className="mb-6">
                    <p className="text-sm text-gray-600 mb-4">
                        Please upload the following documents to verify your business. All documents should be in PDF, JPG, or PNG format.
                    </p>

                    <div className="grid grid-cols-1 gap-6">
                        <div>
                            <Label htmlFor="businessRegistration" className="block mb-2">
                                Business Registration Certificate *
                            </Label>
                            <Input
                                id="businessRegistration"
                                name="businessRegistration"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                                required
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Certificate of Incorporation, Business Registration, or equivalent document
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="taxCertificate" className="block mb-2">
                                Tax Certificate
                            </Label>
                            <Input
                                id="taxCertificate"
                                name="taxCertificate"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Tax Identification Certificate or equivalent document
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="utilityBill" className="block mb-2">
                                Proof of Address
                            </Label>
                            <Input
                                id="utilityBill"
                                name="utilityBill"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Recent utility bill, bank statement, or official document showing business address
                            </p>
                        </div>

                        <div>
                            <Label htmlFor="directorId" className="block mb-2">
                                Director/Owner ID
                            </Label>
                            <Input
                                id="directorId"
                                name="directorId"
                                type="file"
                                onChange={handleFileChange}
                                accept=".pdf,.jpg,.jpeg,.png"
                            />
                            <p className="text-xs text-gray-500 mt-1">
                                Government-issued ID of the business owner or director
                            </p>
                        </div>
                    </div>
                </div>
            </>
        );
    };

    const renderStepIndicator = () => {
        return (
            <div className="flex items-center justify-center space-x-2 mb-8">
                {steps.map((step, index) => (
                    <div key={step.id} className="flex items-center">
                        <div
                            className={`flex items-center justify-center w-8 h-8 rounded-full ${index < currentStep
                                    ? "bg-green-500 text-white"
                                    : index === currentStep
                                        ? "bg-blue-500 text-white"
                                        : "bg-gray-200 text-gray-500"
                                }`}
                        >
                            {index < currentStep ? (
                                <Check className="h-5 w-5" />
                            ) : (
                                <span>{index + 1}</span>
                            )}
                        </div>
                        {index < steps.length - 1 && (
                            <div
                                className={`w-10 h-1 ${index < currentStep ? "bg-green-500" : "bg-gray-200"}`}
                            />
                        )}
                    </div>
                ))}
            </div>
        );
    };

    const renderCurrentStep = () => {
        switch (currentStep) {
            case 0:
                return renderBusinessInfoStep();
            case 1:
                return renderAddressStep();
            case 2:
                return renderBankingStep();
            case 3:
                return renderComplianceStep();
            case 4:
                return renderVerificationStep();
            default:
                return null;
        }
    };

    return (
        <div className="max-w-3xl mx-auto">
            <Card className="shadow-lg">
                <CardHeader>
                    <CardTitle className="text-2xl">Register Your Business</CardTitle>
                    <CardDescription>
                        Complete the form below to register your business with Paymesa
                    </CardDescription>
                </CardHeader>

                <CardContent>
                    <form onSubmit={handleSubmit}>
                        {renderStepIndicator()}

                        <div className="mb-6">
                            <div className="flex items-center mb-4">
                                <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center mr-3">
                                    {steps[currentStep].icon}
                                </div>
                                <div>
                                    <h2 className="text-xl font-semibold">{steps[currentStep].title}</h2>
                                    <p className="text-sm text-gray-500">{steps[currentStep].description}</p>
                                </div>
                            </div>

                            {renderCurrentStep()}
                        </div>

                        <div className="flex justify-between">
                            <Button
                                type="button"
                                variant="outline"
                                onClick={prevStep}
                                disabled={currentStep === 0}
                            >
                                Previous
                            </Button>

                            {currentStep < steps.length - 1 ? (
                                <Button
                                    type="button"
                                    onClick={nextStep}
                                    className="bg-blue-500 hover:bg-blue-600"
                                >
                                    Next
                                    <ChevronRight className="ml-2 h-4 w-4" />
                                </Button>
                            ) : (
                                <Button
                                    type="submit"
                                    className="bg-green-500 hover:bg-green-600"
                                    disabled={isSubmitting}
                                >
                                    {isSubmitting ? (
                                        <>
                                            <div className="h-4 w-4 mr-2 animate-spin rounded-full border-2 border-white border-t-transparent"></div>
                                            Submitting...
                                        </>
                                    ) : (
                                        "Submit Registration"
                                    )}
                                </Button>
                            )}
                        </div>
                    </form>
                </CardContent>

                <CardFooter className="flex justify-center border-t pt-6">
                    <p className="text-xs text-gray-500 text-center max-w-lg">
                        By registering your business, you agree to Paymesa's Terms of Service and Privacy Policy. Your information will be securely stored and processed in accordance with PCI DSS standards.
                    </p>
                </CardFooter>
            </Card>
        </div>
    );
}