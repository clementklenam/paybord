import React, { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Switch } from "@/components/ui/switch";
import { Product, StorefrontCreateData } from "@/services/storefront.service";
import { ArrowRight, Check, Eye, Globe, Loader2, Palette, ShoppingBag, Star } from "lucide-react";
import { ProductService } from "@/services/product.service";
import BusinessService from "@/services/business.service";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from '@/components/ui/use-toast';
import { ThemeSelector } from './ThemeSelector';
import { StorefrontTheme } from '@/types/theme';
import { getThemeById } from '../../data/themePresets';
import { Badge } from "@/components/ui/badge";

interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isCompleted: boolean;
}

interface StorefrontWizardProps {
    onSubmit: (data: StorefrontCreateData) => Promise<any>;
    onCancel: () => void;
    isSubmitting: boolean;
    businesses: { _id: string; businessName: string }[];
}

export function StorefrontWizard({ onSubmit, onCancel, isSubmitting, businesses }: StorefrontWizardProps) {
    // Get current user from auth context
    const { user } = useAuth();
    const { toast } = useToast();

    // State for the current step
    const [currentStep, setCurrentStep] = useState(1);

    // Loading state for products
    const [isLoadingProducts, setIsLoadingProducts] = useState(false);

    // Error state for product loading
    const [productLoadError, setProductLoadError] = useState<string | null>(null);

    // State for selected theme
    const [selectedTheme, setSelectedTheme] = useState<StorefrontTheme | null>(null);

    // Initialize theme on component mount
    useEffect(() => {
        const defaultTheme = getThemeById('general-professional');
        if (defaultTheme) {
            setSelectedTheme(defaultTheme);
        }
    }, []);

    // State for storefront data
    const [storeInfo, setStoreInfo] = useState({
        name: "",
        description: "",
        logo: null as string | null,
        banner: null as string | null,
        primaryColor: "#1e8449",
        accentColor: "#27ae60",
        domain: "",
        socialLinks: {
            instagram: "",
            twitter: "",
            facebook: ""
        },
        paymentMethods: {
            card: true,
            bankTransfer: false,
            mobileMoney: false
        }
    });

    // State for available products
    const [availableProducts, setAvailableProducts] = useState<Product[]>([]);

    // Add a derived state:
    const noBusiness = !user?.businessId && !(user?.business && user.business.length > 0);

    // Add state for selected business
    const [selectedBusinessId, setSelectedBusinessId] = useState<string>(businesses[0]?._id || '');

    // Update colors when theme changes
    useEffect(() => {
        if (selectedTheme) {
            setStoreInfo(prev => ({
                ...prev,
                primaryColor: selectedTheme.colors.primary,
                accentColor: selectedTheme.colors.accent
            }));
        }
    }, [selectedTheme]);

    // Fetch products from the database
    useEffect(() => {
        const fetchProducts = async () => {
            try {
                setIsLoadingProducts(true);
                setProductLoadError(null);
                console.log("Fetching products for StorefrontWizard...");

                // Get business ID from the current user
                let businessId: string | undefined;
                if (user?.businessId) {
                    businessId = user.businessId;
                    console.log("Using businessId from user object:", businessId);
                } else if (user?.business && user.business.length > 0) {
                    businessId = user.business[0]._id;
                    console.log("Using businessId from user.business array:", businessId);
                        } else {
                    setProductLoadError("No business found. Please create a business profile before creating a storefront.");
                    setIsLoadingProducts(false);
                    return;
                }

                // Disable demo mode in localStorage before fetching products
                localStorage.setItem('paymesa_demo_mode', 'false');

                // Fetch products using the business ID
                console.log("Fetching products for business ID:", businessId);
                const productService = new ProductService();

                // Use direct API call to bypass any demo mode logic
                const token = localStorage.getItem('token');
                const headers: Record<string, string> = {};

                if (token) {
                    headers['Authorization'] = `Bearer ${token}`;
                }

                const apiUrl = `${import.meta.env.VITE_API_URL || 'http://localhost:5000/api'}/products?business=${businessId}&active=true&limit=100`;
                console.log("Fetching products from URL:", apiUrl);

                const response = await fetch(apiUrl, {
                    headers: headers as HeadersInit
                });

                if (!response.ok) {
                    throw new Error(`API error: ${response.status}`);
                }

                const data = await response.json();
                console.log("Products fetched:", data);

                if (data.data && data.data.length > 0) {
                    // Map the products to include isSelected property
                    const products = data.data.map((product: unknown) => ({
                        ...product,
                        id: product.id || product._id || product.customId, // Ensure we have an ID
                        isSelected: false
                    }));

                    setAvailableProducts(products);
                    console.log("Products set to state:", products.length);
                } else {
                    console.log("No products found for business ID:", businessId);
                    setProductLoadError("No products found for your business. Please create products first.");
                    setAvailableProducts([]);
                }
            } catch (error) {
                console.error("Error fetching products:", error);
                setProductLoadError("Failed to load products. Please try again later.");
                // If there's an error, set an empty array
                setAvailableProducts([]);
            } finally {
                setIsLoadingProducts(false);
            }
        };

        fetchProducts();
    }, [user]);

    // Generate preview URL
    const generatePreviewUrl = () => {
        const domain = storeInfo.domain || storeInfo.name.toLowerCase().replace(/\s+/g, '-');
        return `https://${domain}.paymesa.com`;
    };

    // Handle product selection
    const handleProductSelection = (productId: string) => {
        setAvailableProducts(prev => prev.map(product =>
            product.id === productId
                ? { ...product, isSelected: !product.isSelected }
                : product
        ));
    };

    // Format currency
    const formatCurrency = (amount: number, currency?: string): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: currency || 'USD',
        }).format(amount);
    };

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        const reader = new FileReader();
        reader.onload = (event) => {
            if (event.target?.result) {
                setStoreInfo(prev => ({
                    ...prev,
                    [type]: event.target?.result as string
                }));
            }
        };
        reader.readAsDataURL(file);
    };

    // Handle form submission
    const handleSubmit = async () => {
        try {
            // Validation: Ensure at least one product is selected
            const selectedProducts = availableProducts.filter(p => p.isSelected);
            if (selectedProducts.length === 0) {
                toast({
                    title: 'Select at least one product',
                    description: 'You must select at least one product to launch your storefront.',
                    variant: 'destructive',
                });
                return;
            }
            console.log('Starting storefront creation...');

            console.log('User object at storefront creation:', user);
            let businessId: string | undefined;
            if (user?.businessId) {
                businessId = user.businessId;
            } else if (user?.business && user.business.length > 0) {
                businessId = user.business[0]._id;
            }
            console.log('Resolved businessId:', businessId);
            if (!businessId) {
                toast({
                    title: 'No Business Found',
                    description: 'You must create a business profile before you can create a storefront.',
                    variant: 'destructive',
                });
                return;
            }

            console.log('Business ID:', businessId);
            console.log('User:', user);

            if (!selectedBusinessId) {
                toast({
                    title: 'No Business Selected',
                    description: 'You must select a business before you can create a storefront.',
                    variant: 'destructive',
                });
                return;
            }

            const storefrontData: StorefrontCreateData = {
                name: storeInfo.name,
                description: storeInfo.description,
                logo: storeInfo.logo,
                banner: storeInfo.banner,
                primaryColor: storeInfo.primaryColor,
                accentColor: storeInfo.accentColor,
                theme: selectedTheme || undefined,
                socialLinks: storeInfo.socialLinks,
                products: selectedProducts.map(p => p.id),
                paymentMethods: Object.entries(storeInfo.paymentMethods)
                    .filter(([_, enabled]) => enabled)
                    .map(([method]) => method),
                businessId: selectedBusinessId
            };

            console.log('Storefront data to be sent:', storefrontData);

            // Call the onSubmit function with the storefront data
            const response = await onSubmit(storefrontData);
            console.log('Full response from onSubmit:', response);

            // Handle both direct storefront object and API response formats
            const createdStorefront = response?.data || response;
            // Defensive: if only _id is present, use it as id
            if (createdStorefront && !createdStorefront.id && createdStorefront._id) {
                createdStorefront.id = createdStorefront._id;
            }
            console.log('Created storefront:', createdStorefront);

            if (!createdStorefront?.id) {
                console.error('Invalid response format:', response);
                throw new Error(response?.message || 'Storefront created but no ID returned');
            }

            console.log('Created storefront:', createdStorefront);
            toast({
                title: 'Success',
                description: 'Storefront created successfully!',
                variant: 'default',
            });

            // Wait briefly before redirecting to allow toast to show
            setTimeout(() => {
                window.location.href = `/storefront/${createdStorefront.id}`;
            }, 500);

        } catch (error: unknown) {
            console.error('Full error object:', error);

            let errorMessage = error.message;
            if (error.code === 'ECONNABORTED') {
                errorMessage = 'Request timed out. The server might be busy. Please try again.';
            } else if (error.response?.data?.message) {
                errorMessage = error.response.data.message;
            }

            toast({
                title: 'Error creating storefront',
                description: errorMessage,
                variant: 'destructive',
            });
        }
    };

    // Define the steps
    const steps: Step[] = [
        {
            id: 1,
            title: "Store Information",
            description: "Basic details about your store",
            icon: <Globe className="h-5 w-5" />,
            isCompleted: !!storeInfo.name && !!storeInfo.description
        },
        {
            id: 2,
            title: "Products",
            description: "Add products to your store",
            icon: <ShoppingBag className="h-5 w-5" />,
            isCompleted: availableProducts.some(p => p.isSelected)
        },
        {
            id: 3,
            title: "Theme & Design",
            description: "Choose your store's theme and layout",
            icon: <Palette className="h-5 w-5" />,
            isCompleted: !!selectedTheme
        },
        {
            id: 4,
            title: "Branding",
            description: "Add your logo and banner",
            icon: <Globe className="h-5 w-5" />,
            isCompleted: true // Optional step
        },
        {
            id: 5,
            title: "Preview & Launch",
            description: "Review and launch your store",
            icon: <Eye className="h-5 w-5" />,
            isCompleted: false
        }
    ];

    return (
        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            {noBusiness && (
                <div className="p-4 bg-red-100 dark:bg-red-900/20 text-red-700 dark:text-red-400 rounded mb-4">
                    <strong>No business found.</strong> You must create a business profile before you can create a storefront.
                </div>
            )}
            <CardContent className="pt-6">
                {/* Steps indicator */}
                <div className="flex items-center justify-between mb-8">
                    {steps.map((step, index) => (
                        <div key={step.id} className="flex items-center">
                            <div
                                className={`flex items-center justify-center w-10 h-10 rounded-full ${currentStep >= step.id
                                    ? "bg-blue-600 text-white"
                                    : "bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500"
                                    }`}
                            >
                                {step.isCompleted ? (
                                    <Check className="h-5 w-5" />
                                ) : (
                                    step.icon
                                )}
                            </div>
                            <div className="ml-3 hidden md:block">
                                <p className="text-sm font-medium text-gray-900 dark:text-gray-100">{step.title}</p>
                                <p className="text-xs text-gray-500 dark:text-gray-400">{step.description}</p>
                            </div>
                            {index < steps.length - 1 && (
                                <div className="w-12 h-1 bg-gray-200 dark:bg-gray-600 mx-2 hidden md:block"></div>
                            )}
                        </div>
                    ))}
                </div>

                {/* Step 1: Store Information */}
                {currentStep === 1 && (
                    <div className="space-y-4">
                        <div>
                            <Label htmlFor="store-name" className="text-gray-900 dark:text-gray-100">Store Name</Label>
                            <Input
                                id="store-name"
                                value={storeInfo.name}
                                onChange={(e) => setStoreInfo(prev => ({ ...prev, name: e.target.value }))}
                                placeholder="Enter your store name"
                                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <Label htmlFor="store-description" className="text-gray-900 dark:text-gray-100">Description</Label>
                            <Textarea
                                id="store-description"
                                value={storeInfo.description}
                                onChange={(e) => setStoreInfo(prev => ({ ...prev, description: e.target.value }))}
                                placeholder="Describe your store"
                                className="mt-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                            />
                        </div>
                        <div>
                            <Label htmlFor="store-domain" className="text-gray-900 dark:text-gray-100">Custom Domain (Optional)</Label>
                            <div className="flex items-center mt-1">
                                <Input
                                    id="store-domain"
                                    value={storeInfo.domain}
                                    onChange={(e) => setStoreInfo(prev => ({ ...prev, domain: e.target.value }))}
                                    placeholder="your-store"
                                    className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                />
                                <span className="ml-2 text-gray-500 dark:text-gray-400">.paymesa.com</span>
                            </div>
                            <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                Leave blank to use your store name as the domain
                            </p>
                        </div>
                    </div>
                )}

                {/* Step 2: Products */}
                {currentStep === 2 && (
                    <div className="space-y-4">
                        <h3 className="text-lg font-medium text-gray-900 dark:text-gray-100">Select Products</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                            Choose the products you want to sell in your storefront
                        </p>

                        {isLoadingProducts ? (
                            <div className="flex justify-center items-center py-10">
                                <Loader2 className="h-8 w-8 animate-spin text-blue-600" />
                                <span className="ml-2 text-gray-900 dark:text-gray-100">Loading products...</span>
                            </div>
                        ) : productLoadError ? (
                            <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <p className="text-red-500 dark:text-red-400">{productLoadError}</p>
                            </div>
                        ) : availableProducts.length === 0 ? (
                            <div className="text-center py-10 border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
                                <p className="text-gray-500 dark:text-gray-400">No products found. Please create products first.</p>
                            </div>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
                                {availableProducts.map((product) => (
                                    <div
                                        key={product.id}
                                        className={`border rounded-lg p-4 cursor-pointer transition-colors ${product.isSelected ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-200 dark:border-gray-700 hover:border-blue-300 dark:hover:border-blue-500"
                                            }`}
                                        onClick={() => handleProductSelection(product.id)}
                                    >
                                        <div className="flex items-start gap-3">
                                            <div className="h-16 w-16 bg-gray-100 dark:bg-gray-700 rounded overflow-hidden flex-shrink-0">
                                                {product.image && (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                )}
                                            </div>
                                            <div className="flex-1">
                                                <div className="flex justify-between">
                                                    <h4 className="font-medium text-gray-900 dark:text-gray-100">{product.name}</h4>
                                                    <div className="font-medium text-blue-600 dark:text-blue-400">
                                                        {formatCurrency(product.price)}
                                                    </div>
                                                </div>
                                                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                                                    {product.description}
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Step 3: Theme & Design */}
                {currentStep === 3 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Theme Selection</h3>
                            <ThemeSelector
                                selectedTheme={selectedTheme}
                                onThemeSelect={(theme) => setSelectedTheme(theme)}
                            />
                        </div>

                        {/* Live Theme Preview */}
                        {selectedTheme && (
                            <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                                <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Live Preview</h3>
                                <div className="space-y-4">
                                    {/* Mock Storefront Header */}
                                    <div 
                                        className="h-16 rounded-lg flex items-center justify-between px-4"
                                        style={{ backgroundColor: selectedTheme.colors.primary }}
                                    >
                                        <div className="flex items-center space-x-3">
                                            <div 
                                                className="w-8 h-8 rounded-full"
                                                style={{ backgroundColor: selectedTheme.colors.accent }}
                                            />
                                            <span 
                                                className="font-medium text-white"
                                                style={{ fontFamily: selectedTheme.typography.headingFont }}
                                            >
                                                {storeInfo.name || 'Your Store'}
                                            </span>
                                        </div>
                                        <div className="flex space-x-2">
                                            <div 
                                                className="w-6 h-6 rounded"
                                                style={{ backgroundColor: selectedTheme.colors.accent }}
                                            />
                                            <div 
                                                className="w-6 h-6 rounded"
                                                style={{ backgroundColor: selectedTheme.colors.accent }}
                                            />
                                        </div>
                                    </div>

                                    {/* Mock Product Grid */}
                                    <div 
                                        className="rounded-lg p-4"
                                        style={{ backgroundColor: selectedTheme.colors.background }}
                                    >
                                        <div 
                                            className="text-lg font-medium mb-3"
                                            style={{ 
                                                color: selectedTheme.colors.text,
                                                fontFamily: selectedTheme.typography.headingFont 
                                            }}
                                        >
                                            Featured Products
                                        </div>
                                        <div 
                                            className={`grid gap-4`}
                                            style={{ 
                                                gridTemplateColumns: `repeat(${selectedTheme.layout.columns}, 1fr)` 
                                            }}
                                        >
                                            {availableProducts.filter(p => p.isSelected).slice(0, selectedTheme.layout.columns).map((product, i) => (
                                                <div 
                                                    key={product.id}
                                                    className="rounded-lg overflow-hidden border"
                                                    style={{ 
                                                        backgroundColor: selectedTheme.colors.surface,
                                                        borderColor: selectedTheme.colors.border
                                                    }}
                                                >
                                                    <div 
                                                        className="h-32 bg-cover bg-center"
                                                        style={{ 
                                                            backgroundImage: `url(${product.image})`,
                                                            backgroundColor: selectedTheme.colors.accent 
                                                        }}
                                                    />
                                                    <div className="p-3">
                                                        <div 
                                                            className="font-medium text-sm mb-1"
                                                            style={{ 
                                                                color: selectedTheme.colors.text,
                                                                fontFamily: selectedTheme.typography.bodyFont 
                                                            }}
                                                        >
                                                            {product.name}
                                                        </div>
                                                        <div 
                                                            className="text-sm"
                                                            style={{ color: selectedTheme.colors.textSecondary }}
                                                        >
                                                            ${product.price.toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                            {/* Fill empty slots with placeholder products */}
                                            {Array.from({ length: Math.max(0, selectedTheme.layout.columns - availableProducts.filter(p => p.isSelected).length) }).map((_, i) => (
                                                <div 
                                                    key={`placeholder-${i}`}
                                                    className="rounded-lg overflow-hidden border"
                                                    style={{ 
                                                        backgroundColor: selectedTheme.colors.surface,
                                                        borderColor: selectedTheme.colors.border
                                                    }}
                                                >
                                                    <div 
                                                        className="h-32"
                                                        style={{ backgroundColor: selectedTheme.colors.accent }}
                                                    />
                                                    <div className="p-3">
                                                        <div 
                                                            className="font-medium text-sm mb-1"
                                                            style={{ 
                                                                color: selectedTheme.colors.text,
                                                                fontFamily: selectedTheme.typography.bodyFont 
                                                            }}
                                                        >
                                                            Product {i + 1}
                                                        </div>
                                                        <div 
                                                            className="text-sm"
                                                            style={{ color: selectedTheme.colors.textSecondary }}
                                                        >
                                                            ${(19.99 * (i + 1)).toFixed(2)}
                                                        </div>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </div>

                                    {/* Theme Info */}
                                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-sm">
                                        <div>
                                            <span className="font-medium">Layout:</span> {selectedTheme.layout.type}
                                        </div>
                                        <div>
                                            <span className="font-medium">Columns:</span> {selectedTheme.layout.columns}
                                        </div>
                                        <div>
                                            <span className="font-medium">Spacing:</span> {selectedTheme.layout.spacing}
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        <div>
                            <h3 className="text-lg font-medium mb-4">Colors</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="primary-color">Primary Color</Label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            id="primary-color"
                                            type="color"
                                            value={storeInfo.primaryColor}
                                            onChange={(e) => setStoreInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                                            className="h-10 w-10 rounded-md border border-gray-300"
                                        />
                                        <Input
                                            value={storeInfo.primaryColor}
                                            onChange={(e) => setStoreInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                                            className="ml-2 flex-1"
                                        />
                                    </div>
                                </div>
                                <div>
                                    <Label htmlFor="accent-color">Accent Color</Label>
                                    <div className="mt-1 flex items-center">
                                        <input
                                            id="accent-color"
                                            type="color"
                                            value={storeInfo.accentColor}
                                            onChange={(e) => setStoreInfo(prev => ({ ...prev, accentColor: e.target.value }))}
                                            className="h-10 w-10 rounded-md border border-gray-300"
                                        />
                                        <Input
                                            value={storeInfo.accentColor}
                                            onChange={(e) => setStoreInfo(prev => ({ ...prev, accentColor: e.target.value }))}
                                            className="ml-2 flex-1"
                                        />
                                    </div>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Social Media</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={storeInfo.socialLinks.instagram}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                instagram: e.target.value
                                            }
                                        }))}
                                        placeholder="@yourusername"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={storeInfo.socialLinks.twitter}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                twitter: e.target.value
                                            }
                                        }))}
                                        placeholder="@yourusername"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        value={storeInfo.socialLinks.facebook}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                facebook: e.target.value
                                            }
                                        }))}
                                        placeholder="yourusername"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 4: Branding */}
                {currentStep === 4 && (
                    <div className="space-y-6">
                        <div>
                            <h3 className="text-lg font-medium mb-4">Store Branding</h3>
                            <p className="text-sm text-gray-600 mb-6">
                                Add your logo and banner to make your storefront more professional and recognizable.
                            </p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                <div>
                                    <Label htmlFor="logo-upload">Logo</Label>
                                    <div className="mt-1 flex items-center">
                                        <div className="h-16 w-16 rounded-full overflow-hidden bg-gray-100 flex items-center justify-center">
                                            {storeInfo.logo ? (
                                                <img
                                                    src={storeInfo.logo}
                                                    alt="Logo preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <span className="text-gray-400 text-xs">No logo</span>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="logo-upload"
                                            className="ml-4 cursor-pointer bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Upload
                                            <input
                                                id="logo-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={(e) => handleImageUpload(e, 'logo')}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: Square image, 200x200px or larger
                                    </p>
                                </div>
                                <div>
                                    <Label htmlFor="banner-upload">Banner</Label>
                                    <div className="mt-1">
                                        <div className="h-24 bg-gray-100 rounded-md overflow-hidden">
                                            {storeInfo.banner ? (
                                                <img
                                                    src={storeInfo.banner}
                                                    alt="Banner preview"
                                                    className="h-full w-full object-cover"
                                                />
                                            ) : (
                                                <div className="h-full w-full flex items-center justify-center">
                                                    <span className="text-gray-400 text-sm">No banner</span>
                                                </div>
                                            )}
                                        </div>
                                        <label
                                            htmlFor="banner-upload"
                                            className="mt-2 cursor-pointer inline-block bg-white py-2 px-3 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 hover:bg-gray-50"
                                        >
                                            Upload
                                            <input
                                                id="banner-upload"
                                                type="file"
                                                accept="image/*"
                                                className="sr-only"
                                                onChange={(e) => handleImageUpload(e, 'banner')}
                                            />
                                        </label>
                                    </div>
                                    <p className="text-xs text-gray-500 mt-1">
                                        Recommended: 1200x400px or larger
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4">Social Media</h3>
                            <div className="space-y-4">
                                <div>
                                    <Label htmlFor="instagram">Instagram</Label>
                                    <Input
                                        id="instagram"
                                        value={storeInfo.socialLinks.instagram}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                instagram: e.target.value
                                            }
                                        }))}
                                        placeholder="@yourusername"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="twitter">Twitter</Label>
                                    <Input
                                        id="twitter"
                                        value={storeInfo.socialLinks.twitter}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                twitter: e.target.value
                                            }
                                        }))}
                                        placeholder="@yourusername"
                                        className="mt-1"
                                    />
                                </div>
                                <div>
                                    <Label htmlFor="facebook">Facebook</Label>
                                    <Input
                                        id="facebook"
                                        value={storeInfo.socialLinks.facebook}
                                        onChange={(e) => setStoreInfo(prev => ({
                                            ...prev,
                                            socialLinks: {
                                                ...prev.socialLinks,
                                                facebook: e.target.value
                                            }
                                        }))}
                                        placeholder="yourusername"
                                        className="mt-1"
                                    />
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Step 5: Preview & Launch */}
                {currentStep === 5 && (
                    <div className="space-y-6">
                        {/* Theme Preview */}
                        {selectedTheme && (
                            <div className="bg-white border rounded-lg p-6">
                                <h3 className="font-medium mb-4">Selected Theme Preview</h3>
                                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                    {/* Theme Image Preview */}
                                    <div>
                                        <h4 className="text-sm font-medium mb-2">Theme: {selectedTheme.name}</h4>
                                        <div className="relative h-48 overflow-hidden rounded-lg border">
                                            <img
                                                src={selectedTheme.preview}
                                                alt={selectedTheme.name}
                                                className="w-full h-full object-cover"
                                            />
                                            {selectedTheme.isPopular && (
                                                <div className="absolute top-2 left-2">
                                                    <Badge className="bg-yellow-500 text-white text-xs">
                                                        <Star className="h-3 w-3 mr-1" />
                                                        Popular
                                                    </Badge>
                                                </div>
                                            )}
                                        </div>
                                        <p className="text-sm text-gray-600 mt-2">{selectedTheme.description}</p>
                                    </div>

                                    {/* Theme Details */}
                                    <div className="space-y-4">
                                        <div>
                                            <h4 className="text-sm font-medium mb-2">Color Palette</h4>
                                            <div className="flex gap-2">
                                                <div 
                                                    className="w-8 h-8 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: selectedTheme.colors.primary }}
                                                    title="Primary"
                                                />
                                                <div 
                                                    className="w-8 h-8 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: selectedTheme.colors.secondary }}
                                                    title="Secondary"
                                                />
                                                <div 
                                                    className="w-8 h-8 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: selectedTheme.colors.accent }}
                                                    title="Accent"
                                                />
                                                <div 
                                                    className="w-8 h-8 rounded-full border border-gray-200"
                                                    style={{ backgroundColor: selectedTheme.colors.background }}
                                                    title="Background"
                                                />
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Layout</h4>
                                            <div className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                                                <p>Type: <span className="capitalize font-medium">{selectedTheme.layout.type}</span></p>
                                                <p>Columns: <span className="font-medium">{selectedTheme.layout.columns}</span></p>
                                                <p>Spacing: <span className="capitalize font-medium">{selectedTheme.layout.spacing}</span></p>
                                            </div>
                                        </div>

                                        <div>
                                            <h4 className="text-sm font-medium mb-2 text-gray-900 dark:text-gray-100">Features</h4>
                                            <div className="flex flex-wrap gap-1">
                                                {selectedTheme.features.map((feature, index) => (
                                                    <Badge key={index} variant="secondary" className="text-xs">
                                                        {feature}
                                                    </Badge>
                                                ))}
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}

                        {/* Store Information Preview */}
                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-6">
                            <h3 className="font-medium mb-4 text-gray-900 dark:text-gray-100">Store Information</h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Store Name</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{storeInfo.name}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Description</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{storeInfo.description}</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Selected Products</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">{availableProducts.filter(p => p.isSelected).length} products</p>
                                </div>
                                <div>
                                    <p className="text-sm text-gray-600 dark:text-gray-400">Payment Methods</p>
                                    <p className="font-medium text-gray-900 dark:text-gray-100">
                                        {Object.entries(storeInfo.paymentMethods)
                                            .filter(([_, enabled]) => enabled)
                                            .map(([method]) => method)
                                            .join(', ')}
                                    </p>
                                </div>
                            </div>
                        </div>

                        <div>
                            <h3 className="text-lg font-medium mb-4 text-gray-900 dark:text-gray-100">Payment Methods</h3>
                            <Tabs defaultValue="payment-methods">
                                <TabsList className="grid w-full grid-cols-1">
                                    <TabsTrigger value="payment-methods">Payment Methods</TabsTrigger>
                                </TabsList>
                                <TabsContent value="payment-methods" className="p-4 border border-gray-200 dark:border-gray-700 rounded-md mt-2 bg-white dark:bg-gray-800">
                                    <div className="space-y-4">
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Credit/Debit Card</div>
                                            </div>
                                            <Switch
                                                checked={storeInfo.paymentMethods.card}
                                                onCheckedChange={(checked) => setStoreInfo(prev => ({
                                                    ...prev,
                                                    paymentMethods: {
                                                        ...prev.paymentMethods,
                                                        card: checked
                                                    }
                                                }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Bank Transfer</div>
                                            </div>
                                            <Switch
                                                checked={storeInfo.paymentMethods.bankTransfer}
                                                onCheckedChange={(checked) => setStoreInfo(prev => ({
                                                    ...prev,
                                                    paymentMethods: {
                                                        ...prev.paymentMethods,
                                                        bankTransfer: checked
                                                    }
                                                }))}
                                            />
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <div className="flex items-center gap-2">
                                                <div className="font-medium text-gray-900 dark:text-gray-100">Mobile Money</div>
                                            </div>
                                            <Switch
                                                checked={storeInfo.paymentMethods.mobileMoney}
                                                onCheckedChange={(checked) => setStoreInfo(prev => ({
                                                    ...prev,
                                                    paymentMethods: {
                                                        ...prev.paymentMethods,
                                                        mobileMoney: checked
                                                    }
                                                }))}
                                            />
                                        </div>
                                    </div>
                                </TabsContent>
                            </Tabs>
                        </div>

                        <div className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
                            <h3 className="font-medium mb-3 text-gray-900 dark:text-gray-100">Storefront URL</h3>
                            <div className="flex items-center">
                                <Input
                                    value={generatePreviewUrl()}
                                    readOnly
                                    className="flex-1 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
                                />
                            </div>
                        </div>

                        <div className="bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800 rounded-lg p-4">
                            <div className="flex items-start">
                                <Check className="h-5 w-5 text-green-500 dark:text-green-400 mt-0.5 mr-3" />
                                <div>
                                    <h3 className="font-medium text-green-800 dark:text-green-200">Ready to Launch!</h3>
                                    <p className="text-sm text-green-700 dark:text-green-300 mt-1">
                                        Your storefront is ready to go live. Once published, customers can browse and purchase your products.
                                    </p>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </CardContent>

            <CardFooter className="flex justify-between border-t border-gray-200 dark:border-gray-700">
                {currentStep > 1 ? (
                    <Button
                        variant="outline"
                        onClick={() => setCurrentStep(currentStep - 1)}
                    >
                        Back
                    </Button>
                ) : (
                    <Button
                        variant="outline"
                        onClick={onCancel}
                    >
                        Cancel
                    </Button>
                )}

                {currentStep < steps.length ? (
                    <Button
                        onClick={() => setCurrentStep(currentStep + 1)}
                        disabled={
                            (currentStep === 1 && (!storeInfo.name || !storeInfo.description)) ||
                            (currentStep === 2 && !availableProducts.some(p => p.isSelected)) ||
                            (currentStep === 3 && !selectedTheme)
                        }
                        className="ml-auto"
                    >
                        Continue
                        <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                ) : (
                    <Button
                        onClick={handleSubmit}
                        disabled={isSubmitting || noBusiness}
                        className="ml-auto bg-green-600 hover:bg-green-700"
                    >
                        {isSubmitting ? <Loader2 className="animate-spin mr-2 h-4 w-4" /> : 'Launch Storefront'}
                    </Button>
                )}
            </CardFooter>

            {/* Add a business selector if more than one business */}
            {businesses.length > 1 && (
                <div className="mb-4">
                    <Label htmlFor="business-select" className="text-gray-900 dark:text-gray-100">Select Business</Label>
                    <select
                        id="business-select"
                        value={selectedBusinessId}
                        onChange={e => setSelectedBusinessId(e.target.value)}
                        className="mt-1 block w-full border border-gray-300 dark:border-gray-600 rounded px-2 py-1 bg-white dark:bg-gray-800 text-gray-900 dark:text-gray-100"
                    >
                        {businesses.map(biz => (
                            <option key={biz._id} value={biz._id}>{biz.businessName}</option>
                        ))}
                    </select>
                </div>
            )}
        </Card>
    );
}
