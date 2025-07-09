import { useState, useEffect, useRef, ChangeEvent } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import { useToast } from "@/components/ui/use-toast";
import { Skeleton } from "@/components/ui/skeleton";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from "@/components/ui/alert-dialog";
import {
    ArrowRight,
    Check,
    ChevronRight,
    Copy,
    CreditCard,
    ExternalLink,
    Eye,
    Globe,
    Image as ImageIcon,
    Palette,
    Plus,
    Settings,
    ShoppingBag,
    Smartphone,
    Edit,
    Trash2,
    Loader2,
    AlertCircle,
    Instagram,
    Twitter,
    Facebook
} from "lucide-react";
import { StorefrontService } from "@/services/storefront.service";
import type { ChangeEvent } from "react";

// Define the step interface
interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isCompleted: boolean;
}

// Define the analytics data interface
interface AnalyticsData {
    visits: { date: string; count: number }[];
    sales: { date: string; count: number; amount: number }[];
    totalVisits: number;
    totalSales: number;
    totalRevenue: number;
}

export default function StorefrontPage() {
    const { toast } = useToast();
    const storefrontService = new StorefrontService();
    const fileInputRef = useRef<HTMLInputElement>(null);
    const bannerInputRef = useRef<HTMLInputElement>(null);
    
    // State for the current step in the creation wizard
    const [currentStep, setCurrentStep] = useState(1);

    // State for showing the creation wizard
    const [showCreationWizard, setShowCreationWizard] = useState(false);
    
    // State for loading states
    const [isLoading, setIsLoading] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    const [isDeleting, setIsDeleting] = useState(false);
    const [isUpdating, setIsUpdating] = useState(false);
    
    // State for confirmation dialogs
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [storefrontToDelete, setStorefrontToDelete] = useState<string | null>(null);

    // State for storefronts
    const [storefronts, setStorefronts] = useState<Storefront[]>([]);
    const [selectedStorefront, setSelectedStorefront] = useState<Storefront | null>(null);
    const [storefrontAnalytics, setStorefrontAnalytics] = useState<AnalyticsData | null>(null);
    
    // State for pagination
    const [currentPage, setCurrentPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [totalStorefronts, setTotalStorefronts] = useState(0);
    
    // State for filters
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<'active' | 'inactive' | 'draft' | ''>('');
    const [sortBy, setSortBy] = useState('createdAt');
    const [sortOrder, setSortOrder] = useState<'asc' | 'desc'>('desc');
    
    // State for storefront data in the creation wizard
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
    const [availableProducts, setAvailableProducts] = useState<Product[]>([
        {
            id: "prod_1",
            name: "Basic Plan",
            description: "Essential features for small businesses",
            price: 49.99,
            image: "https://images.unsplash.com/photo-1586892478025-2b5472316bf4?q=80&w=1974",
            isSelected: false
        },
        {
            id: "prod_2",
            name: "Premium Plan",
            description: "Advanced features with priority support",
            price: 99.99,
            image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?q=80&w=2015",
            isSelected: false
        },
        {
            id: "prod_3",
            name: "Enterprise Solution",
            description: "Complete solution for large enterprises",
            price: 299.99,
            image: "https://images.unsplash.com/photo-1547658719-da2b51169166?q=80&w=2064",
            isSelected: false
        }
    ]);

    // State for storefront preview URL and live status
    const [previewUrl, setPreviewUrl] = useState("");
    const [isStorefrontLive, setIsStorefrontLive] = useState(false);
    
    // Fetch storefronts on component mount and when filters change
    useEffect(() => {
        fetchStorefronts();
    }, [currentPage, searchQuery, statusFilter, sortBy, sortOrder]);
    
    // Fetch storefronts from the API
    const fetchStorefronts = async () => {
        setIsLoading(true);
        try {
            const filters: StorefrontFilters = {
                page: currentPage,
                limit: 10,
                search: searchQuery || undefined,
                status: statusFilter || undefined,
                sortBy: sortBy || undefined,
                sortOrder: sortOrder
            };
            
            const response = await storefrontService.getStorefronts(filters);
            
            setStorefronts(response.storefronts);
            setTotalPages(response.pagination.pages);
            setTotalStorefronts(response.pagination.total);
            
            console.log('Fetched storefronts:', response.storefronts.length);
        } catch (error) {
            console.error('Error fetching storefronts:', error);
            toast({
                title: "Error fetching storefronts",
                description: "There was a problem loading your storefronts. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Fetch a single storefront by ID
    const fetchStorefrontById = async (id: string) => {
        try {
            const storefront = await storefrontService.getStorefrontById(id);
            setSelectedStorefront(storefront);
            
            // Also fetch analytics for this storefront
            fetchStorefrontAnalytics(id);
            
            return storefront;
        } catch (error) {
            console.error(`Error fetching storefront with ID ${id}:`, error);
            toast({
                title: "Error fetching storefront",
                description: "There was a problem loading the storefront details. Please try again.",
                variant: "destructive"
            });
            return null;
        }
    };
    
    // Fetch analytics for a storefront
    const fetchStorefrontAnalytics = async (id: string) => {
        try {
            const analytics = await storefrontService.getStorefrontAnalytics(id);
            setStorefrontAnalytics(analytics);
        } catch (error) {
            console.error(`Error fetching analytics for storefront with ID ${id}:`, error);
            // Don't show toast for analytics errors to avoid overwhelming the user
        }
    };

    // Define the steps
    const steps: Step[] = [
        {
            id: 1,
            title: "Store Information",
            description: "Set up your store details and branding",
            icon: <Settings className="h-5 w-5" />,
            isCompleted: storeInfo.name !== "" && storeInfo.description !== ""
        },
        {
            id: 2,
            title: "Choose Products",
            description: "Select products to display in your storefront",
            icon: <ShoppingBag className="h-5 w-5" />,
            isCompleted: availableProducts.some(p => p.isSelected)
        },
        {
            id: 3,
            title: "Customize Design",
            description: "Personalize the look and feel of your storefront",
            icon: <Palette className="h-5 w-5" />,
            isCompleted: storeInfo.primaryColor !== "" && storeInfo.accentColor !== ""
        },
        {
            id: 4,
            title: "Preview & Launch",
            description: "Review and publish your storefront",
            icon: <Globe className="h-5 w-5" />,
            isCompleted: isStorefrontLive
        }
    ];

    // Handle image upload for the storefront (logo or banner)
    const handleImageUpload = async (e: ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (!file) return;

        // First show a preview immediately for better UX
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
        
        // If we're editing an existing storefront, upload the image to the server
        if (selectedStorefront) {
            try {
                setIsUpdating(true);
                const result = await storefrontService.uploadStorefrontImage(
                    selectedStorefront.id,
                    type,
                    file
                );
                
                // Update the selected storefront with the new image URL
                setSelectedStorefront(prev => prev ? {
                    ...prev,
                    [type]: result.url
                } : null);
                
                toast({
                    title: "Image uploaded",
                    description: `The ${type} has been successfully uploaded.`,
                    variant: "default"
                });
            } catch (error) {
                console.error(`Error uploading ${type}:`, error);
                toast({
                    title: "Upload failed",
                    description: `There was a problem uploading the ${type}. Please try again.`,
                    variant: "destructive"
                });
            } finally {
                setIsUpdating(false);
            }
        }
    };

    // Handle product selection in the creation wizard
    const handleProductSelection = (productId: string) => {
        setAvailableProducts(prev => prev.map(product => 
            product.id === productId 
                ? { ...product, isSelected: !product.isSelected }
                : product
        ));
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Generate preview URL for the storefront
    const generatePreviewUrl = () => {
        const domain = storeInfo.domain || storeInfo.name.toLowerCase().replace(/\s+/g, '-');
        const url = `https://${domain}.paymesa.com`;
        setPreviewUrl(url);
        return url;
    };

    // Launch a new storefront
    const launchStorefront = async () => {
        setIsCreating(true);
        
        try {
            // Get selected products
            const selectedProductIds = availableProducts
                .filter(p => p.isSelected)
                .map(p => p.id);
            
            // Prepare payment methods
            const paymentMethodsList: string[] = [];
            if (storeInfo.paymentMethods.card) paymentMethodsList.push('card');
            if (storeInfo.paymentMethods.bankTransfer) paymentMethodsList.push('bank_transfer');
            if (storeInfo.paymentMethods.mobileMoney) paymentMethodsList.push('mobile_money');
            
            // Create storefront data object
            const storefrontData: StorefrontCreateData = {
                name: storeInfo.name,
                description: storeInfo.description,
                logo: storeInfo.logo,
                banner: storeInfo.banner,
                primaryColor: storeInfo.primaryColor,
                accentColor: storeInfo.accentColor,
                socialLinks: storeInfo.socialLinks,
                products: selectedProductIds,
                paymentMethods: paymentMethodsList
            };
            
            // Create the storefront in the database
            const newStorefront = await storefrontService.createStorefront(storefrontData);
            
            // Update UI
            setIsStorefrontLive(true);
            setShowCreationWizard(false);
            
            // Refresh the storefronts list
            fetchStorefronts();
            
            // Show success message
            toast({
                title: "Storefront launched",
                description: `Your storefront "${storeInfo.name}" has been successfully created and is now live.`,
                variant: "default"
            });
            
            // Reset the form for future use
            resetStorefrontForm();
            
            return newStorefront;
        } catch (error) {
            console.error('Error creating storefront:', error);
            toast({
                title: "Launch failed",
                description: "There was a problem launching your storefront. Please try again.",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsCreating(false);
        }
    };
    
    // Reset the storefront creation form
    const resetStorefrontForm = () => {
        setStoreInfo({
            name: "",
            description: "",
            logo: null,
            banner: null,
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
        
        setAvailableProducts(prev => prev.map(product => ({
            ...product,
            isSelected: false
        })));
        
        setCurrentStep(1);
    };
    
    // Handle deleting a storefront
    const handleDeleteStorefront = async () => {
        if (!storefrontToDelete) return;
        
        setIsDeleting(true);
        try {
            await storefrontService.deleteStorefront(storefrontToDelete);
            
            // Remove from local state
            setStorefronts(prev => prev.filter(sf => sf.id !== storefrontToDelete));
            
            // Reset selected storefront if it was the one deleted
            if (selectedStorefront?.id === storefrontToDelete) {
                setSelectedStorefront(null);
            }
            
            toast({
                title: "Storefront deleted",
                description: "The storefront has been successfully deleted.",
                variant: "default"
            });
        } catch (error) {
            console.error('Error deleting storefront:', error);
            toast({
                title: "Deletion failed",
                description: "There was a problem deleting the storefront. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
            setShowDeleteDialog(false);
            setStorefrontToDelete(null);
        }
    };
    
    // Handle updating a storefront
    const handleUpdateStorefront = async (id: string, data: Partial<StorefrontCreateData>) => {
        setIsUpdating(true);
        try {
            const updatedStorefront = await storefrontService.updateStorefront(id, data);
            
            // Update in local state
            setStorefronts(prev => prev.map(sf => 
                sf.id === id ? updatedStorefront : sf
            ));
            
            // Update selected storefront if it was the one updated
            if (selectedStorefront?.id === id) {
                setSelectedStorefront(updatedStorefront);
            }
            
            toast({
                title: "Storefront updated",
                description: "The storefront has been successfully updated.",
                variant: "default"
            });
            
            return updatedStorefront;
        } catch (error) {
            console.error('Error updating storefront:', error);
            toast({
                title: "Update failed",
                description: "There was a problem updating the storefront. Please try again.",
                variant: "destructive"
            });
            return null;
        } finally {
            setIsUpdating(false);
        }
    };
    
    // Handle updating storefront status (activate/deactivate)
    const handleUpdateStatus = async (id: string, status: 'active' | 'inactive' | 'draft') => {
        try {
            const updatedStorefront = await storefrontService.updateStorefrontStatus(id, status);
            
            // Update in local state
            setStorefronts(prev => prev.map(sf => 
                sf.id === id ? updatedStorefront : sf
            ));
            
            // Update selected storefront if it was the one updated
            if (selectedStorefront?.id === id) {
                setSelectedStorefront(updatedStorefront);
            }
            
            const statusText = status === 'active' ? 'activated' : status === 'inactive' ? 'deactivated' : 'saved as draft';
            
            toast({
                title: "Status updated",
                description: `The storefront has been ${statusText}.`,
                variant: "default"
            });
            
            return updatedStorefront;
        } catch (error) {
            console.error('Error updating storefront status:', error);
            toast({
                title: "Status update failed",
                description: "There was a problem updating the storefront status. Please try again.",
                variant: "destructive"
            });
            return null;
        }
    };
    
    // Handle opening the delete confirmation dialog
    const confirmDelete = (id: string) => {
        setStorefrontToDelete(id);
        setShowDeleteDialog(true);
    };

    return (
        <DashboardLayout>
            <div>
                <div className="flex items-center justify-between mb-6">
                    <div>
                        <h1 className="text-2xl font-semibold text-gray-900">Storefront</h1>
                        <p className="text-sm text-gray-500 mt-1">
                            Create and manage your online storefront
                        </p>
                    </div>
                    {isStorefrontLive && (
                        <div className="flex items-center gap-3">
                            <Badge className="bg-green-100 text-green-800">Live</Badge>
                            <Button size="sm" variant="outline" className="h-9">
                                <Eye className="h-4 w-4 mr-2" />
                                <span>View Store</span>
                            </Button>
                        </div>
                    )}
                </div>

                {/* Steps Progress */}
                <div className="mb-8">
                    <div className="flex items-center justify-between">
                        {steps.map((step, index) => (
                            <div key={step.id} className="flex flex-1 items-center">
                                <div
                                    className={`flex items-center justify-center w-10 h-10 rounded-full border-2 ${currentStep >= step.id
                                        ? "border-green-500 bg-green-50 text-green-600"
                                        : "border-gray-300 bg-white text-gray-400"
                                        } ${step.isCompleted ? "bg-green-500 text-white" : ""}`}
                                    onClick={() => setCurrentStep(step.id)}
                                    style={{ cursor: "pointer" }}
                                >
                                    {step.isCompleted ? (
                                        <Check className="h-5 w-5" />
                                    ) : (
                                        <span>{step.id}</span>
                                    )}
                                </div>
                                <div className="ml-3 flex-1">
                                    <h3 className="text-sm font-medium">{step.title}</h3>
                                    <p className="text-xs text-gray-500 hidden sm:block">{step.description}</p>
                                </div>
                                {index < steps.length - 1 && (
                                    <div className="flex-1 h-0.5 bg-gray-200 mx-2"></div>
                                )}
                            </div>
                        ))}
                    </div>
                </div>

                {/* Step Content */}
                <Card>
                    <CardHeader>
                        <div className="flex justify-between items-center">
                            <div>
                                <CardTitle>{steps[currentStep - 1].title}</CardTitle>
                                <CardDescription>{steps[currentStep - 1].description}</CardDescription>
                            </div>
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => {
                                    setShowCreationWizard(false);
                                    setCurrentStep(1);
                                }}
                            >
                                Cancel
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        {/* Step 1: Store Information */}
                        {currentStep === 1 && (
                            <div className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label htmlFor="store-name">Store Name <span className="text-red-500">*</span></Label>
                                        <Input
                                            id="store-name"
                                            placeholder="My Awesome Store"
                                            value={storeInfo.name}
                                            onChange={(e) => setStoreInfo(prev => ({ ...prev, name: e.target.value }))}
                                        />
                                    </div>
                                    <div className="space-y-2">
                                        <Label htmlFor="store-domain">Custom Domain (Optional)</Label>
                                        <div className="flex">
                                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 text-sm">
                                                https://
                                            </span>
                                            <Input
                                                id="store-domain"
                                                placeholder="mystore.com"
                                                className="rounded-l-none"
                                                value={storeInfo.domain}
                                                onChange={(e) => setStoreInfo(prev => ({ ...prev, domain: e.target.value }))}
                                            />
                                        </div>
                                    </div>
                                </div>
                                <div className="space-y-2">
                                    <Label htmlFor="store-description">Store Description <span className="text-red-500">*</span></Label>
                                    <Textarea
                                        id="store-description"
                                        placeholder="Describe your store and what you offer..."
                                        className="h-24"
                                        value={storeInfo.description}
                                        onChange={(e) => setStoreInfo(prev => ({ ...prev, description: e.target.value }))}
                                    />
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-2">
                                        <Label>Store Logo</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-20 rounded-md border overflow-hidden flex items-center justify-center bg-gray-50">
                                                {storeInfo.logo ? (
                                                    <img
                                                        src={storeInfo.logo}
                                                        alt="Store Logo"
                                                        className="h-full w-full object-contain"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'logo')}
                                            />
                                        </div>
                                    </div>
                                    <div className="space-y-2">
                                        <Label>Store Banner</Label>
                                        <div className="flex items-center gap-4">
                                            <div className="h-20 w-40 rounded-md border overflow-hidden flex items-center justify-center bg-gray-50">
                                                {storeInfo.banner ? (
                                                    <img
                                                        src={storeInfo.banner}
                                                        alt="Store Banner"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <ImageIcon className="h-8 w-8 text-gray-400" />
                                                )}
                                            </div>
                                            <Input
                                                type="file"
                                                accept="image/*"
                                                onChange={(e) => handleImageUpload(e, 'banner')}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Step 2: Choose Products */}
                        {currentStep === 2 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Select Products from Catalog</h3>
                                    <Button variant="outline" size="sm">
                                        <Plus className="h-4 w-4 mr-2" />
                                        <span>Add New Product</span>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                    {availableProducts.map((product) => (
                                        <div
                                            key={product.id}
                                            className={`border rounded-lg overflow-hidden cursor-pointer transition-all ${product.isSelected
                                                ? "border-green-500 ring-2 ring-green-200"
                                                : "border-gray-200 hover:border-gray-300"
                                                }`}
                                            onClick={() => handleProductSelection(product.id)}
                                        >
                                            <div className="h-40 bg-gray-100 relative">
                                                {product.image ? (
                                                    <img
                                                        src={product.image}
                                                        alt={product.name}
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full">
                                                        <ImageIcon className="h-12 w-12 text-gray-400" />
                                                    </div>
                                                )}
                                                {product.isSelected && (
                                                    <div className="absolute top-2 right-2 bg-green-500 text-white rounded-full p-1">
                                                        <Check className="h-4 w-4" />
                                                    </div>
                                                )}
                                            </div>
                                            <div className="p-4">
                                                <h4 className="font-medium">{product.name}</h4>
                                                <p className="text-sm text-gray-500 mt-1 line-clamp-2">{product.description}</p>
                                                <div className="mt-2 font-medium text-lg">{formatCurrency(product.price)}</div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                                <div className="bg-gray-50 p-4 rounded-lg mt-6">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h4 className="font-medium">Selected Products: {availableProducts.filter(p => p.isSelected).length}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                These products will be displayed on your storefront
                                            </p>
                                        </div>
                                        {availableProducts.some(p => p.isSelected) && (
                                            <Badge className="bg-green-100 text-green-800">
                                                {availableProducts.filter(p => p.isSelected).length} Selected
                                            </Badge>
                                        )}
                                    </div>
                                </div>
                            </div>
                        )}
                        {/* Step 3: Customize Design */}
                        {currentStep === 3 && (
                            <div className="space-y-6">
                                <Tabs defaultValue="theme">
                                    <TabsList className="mb-4">
                                        <TabsTrigger value="theme">Theme</TabsTrigger>
                                        <TabsTrigger value="colors">Colors</TabsTrigger>
                                        <TabsTrigger value="layout">Layout</TabsTrigger>
                                    </TabsList>

                                    <TabsContent value="theme">
                                        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                                            <div
                                                className="border rounded-lg overflow-hidden cursor-pointer transition-all border-green-500 ring-2 ring-green-200"
                                            >
                                                <div className="h-40 bg-gray-100 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                        <div className="font-medium">Modern</div>
                                                        <div className="text-xs opacity-80">Clean, minimal design</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white">
                                                    <Badge className="bg-green-100 text-green-800">Active</Badge>
                                                </div>
                                            </div>

                                            <div
                                                className="border rounded-lg overflow-hidden cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                                            >
                                                <div className="h-40 bg-gray-100 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                        <div className="font-medium">Classic</div>
                                                        <div className="text-xs opacity-80">Traditional e-commerce layout</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white">
                                                    <Badge variant="outline">Select</Badge>
                                                </div>
                                            </div>

                                            <div
                                                className="border rounded-lg overflow-hidden cursor-pointer transition-all border-gray-200 hover:border-gray-300"
                                            >
                                                <div className="h-40 bg-gray-100 relative">
                                                    <div className="absolute inset-0 bg-gradient-to-b from-transparent to-gray-900/50"></div>
                                                    <div className="absolute bottom-0 left-0 right-0 p-3 text-white">
                                                        <div className="font-medium">Bold</div>
                                                        <div className="text-xs opacity-80">Eye-catching design</div>
                                                    </div>
                                                </div>
                                                <div className="p-3 bg-white">
                                                    <Badge variant="outline">Select</Badge>
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="colors">
                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                            <div className="space-y-2">
                                                <Label htmlFor="primary-color">Primary Color</Label>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-10 w-10 rounded-md border cursor-pointer"
                                                        style={{ backgroundColor: storeInfo.primaryColor }}
                                                    ></div>
                                                    <Input
                                                        id="primary-color"
                                                        type="color"
                                                        value={storeInfo.primaryColor}
                                                        onChange={(e) => setStoreInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                                                        className="w-16 h-10 p-1"
                                                    />
                                                    <Input
                                                        value={storeInfo.primaryColor}
                                                        onChange={(e) => setStoreInfo(prev => ({ ...prev, primaryColor: e.target.value }))}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>

                                            <div className="space-y-2">
                                                <Label htmlFor="accent-color">Accent Color</Label>
                                                <div className="flex items-center gap-3">
                                                    <div
                                                        className="h-10 w-10 rounded-md border cursor-pointer"
                                                        style={{ backgroundColor: storeInfo.accentColor }}
                                                    ></div>
                                                    <Input
                                                        id="accent-color"
                                                        type="color"
                                                        value={storeInfo.accentColor}
                                                        onChange={(e) => setStoreInfo(prev => ({ ...prev, accentColor: e.target.value }))}
                                                        className="w-16 h-10 p-1"
                                                    />
                                                    <Input
                                                        value={storeInfo.accentColor}
                                                        onChange={(e) => setStoreInfo(prev => ({ ...prev, accentColor: e.target.value }))}
                                                        className="flex-1"
                                                    />
                                                </div>
                                            </div>
                                        </div>

                                        <div className="mt-6 p-4 border rounded-lg">
                                            <h4 className="font-medium mb-3">Color Preview</h4>
                                            <div className="flex flex-wrap gap-4">
                                                <div
                                                    className="h-12 px-4 rounded-md flex items-center justify-center text-white"
                                                    style={{ backgroundColor: storeInfo.primaryColor }}
                                                >
                                                    Primary Button
                                                </div>
                                                <div
                                                    className="h-12 px-4 rounded-md flex items-center justify-center text-white"
                                                    style={{ backgroundColor: storeInfo.accentColor }}
                                                >
                                                    Secondary Button
                                                </div>
                                                <div
                                                    className="h-12 px-4 rounded-md border flex items-center justify-center"
                                                    style={{ color: storeInfo.primaryColor, borderColor: storeInfo.primaryColor }}
                                                >
                                                    Outline Button
                                                </div>
                                                <div
                                                    className="h-6 px-2 rounded-full text-xs flex items-center justify-center text-white"
                                                    style={{ backgroundColor: storeInfo.primaryColor }}
                                                >
                                                    Badge
                                                </div>
                                            </div>
                                        </div>
                                    </TabsContent>

                                    <TabsContent value="layout">
                                        <div className="space-y-4">
                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-base">Show Hero Banner</Label>
                                                    <p className="text-sm text-gray-500">Display a large banner at the top of your store</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-base">Featured Products</Label>
                                                    <p className="text-sm text-gray-500">Highlight selected products at the top</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-base">Show Product Categories</Label>
                                                    <p className="text-sm text-gray-500">Group products by categories</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                            <Separator />

                                            <div className="flex items-center justify-between">
                                                <div>
                                                    <Label className="text-base">Display Social Links</Label>
                                                    <p className="text-sm text-gray-500">Show your social media profiles</p>
                                                </div>
                                                <Switch defaultChecked />
                                            </div>
                                        </div>
                                    </TabsContent>
                                </Tabs>
                            </div>
                        )}
                        {/* Step 4: Preview & Launch */}
                        {currentStep === 4 && (
                            <div className="space-y-6">
                                <div className="flex items-center justify-between mb-4">
                                    <h3 className="text-lg font-medium">Preview and Launch</h3>
                                    <Button variant="outline" size="sm">
                                        <Edit className="h-4 w-4 mr-2" />
                                        <span>Edit Storefront</span>
                                    </Button>
                                </div>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div className="space-y-4">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">Store Preview</h4>
                                            <div className="h-48 w-full rounded-md overflow-hidden">
                                                {previewUrl ? (
                                                    <img
                                                        src={previewUrl}
                                                        alt="Store Preview"
                                                        className="h-full w-full object-cover"
                                                    />
                                                ) : (
                                                    <div className="flex items-center justify-center h-full text-gray-400">
                                                        No preview available
                                                    </div>
                                                )}
                                            </div>
                                            <div className="mt-4 flex items-center gap-2">
                                                <Button variant="outline" size="sm" className="h-9">
                                                    <Eye className="h-4 w-4 mr-2" />
                                                    <span>View Store</span>
                                                </Button>
                                                <Button variant="outline" size="sm" className="h-9">
                                                    <ExternalLink className="h-4 w-4 mr-2" />
                                                    <span>Open in New Tab</span>
                                                </Button>
                                            </div>
                                        </div>
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">Live Status</h4>
                                            <div className="flex items-center gap-2">
                                                <Badge className={`${isStorefrontLive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                    {isStorefrontLive ? "Live" : "Not Live"}
                                                </Badge>
                                                <Button variant="outline" size="sm" className="h-9">
                                                    <Globe className="h-4 w-4 mr-2" />
                                                    <span>View Analytics</span>
                                                </Button>
                                            </div>
                                        </div>
                                    </div>
                                    <div className="space-y-4">
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">Store Details</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-sm text-gray-500">Store Name</Label>
                                                    <p className="font-medium">{storeInfo.name}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">Domain</Label>
                                                    <p className="font-medium">{storeInfo.domain || "Not set"}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">Status</Label>
                                                    <Badge className={`${isStorefrontLive ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}`}>
                                                        {isStorefrontLive ? "Live" : "Draft"}
                                                    </Badge>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">Created At</Label>
                                                    <p className="font-medium">{selectedStorefront?.createdAt ? new Date(selectedStorefront.createdAt).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">Last Updated</Label>
                                                    <p className="font-medium">{selectedStorefront?.updatedAt ? new Date(selectedStorefront.updatedAt).toLocaleDateString() : "N/A"}</p>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">Store Description</h4>
                                            <p className="text-gray-800">{storeInfo.description}</p>
                                        </div>
                                        <div className="bg-gray-100 p-4 rounded-lg">
                                            <h4 className="font-medium mb-3">Branding</h4>
                                            <div className="grid grid-cols-2 gap-3">
                                                <div>
                                                    <Label className="text-sm text-gray-500">Logo</Label>
                                                    <div className="h-10 w-10 rounded-md border overflow-hidden flex items-center justify-center bg-gray-50">
                                                        {storeInfo.logo ? (
                                                            <img
                                                                src={storeInfo.logo}
                                                                alt="Store Logo"
                                                                className="h-full w-full object-contain"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                </div>
                                                <div>
                                                    <Label className="text-sm text-gray-500">Banner</Label>
                                                    <div className="h-10 w-40 rounded-md border overflow-hidden flex items-center justify-center bg-gray-50">
                                                        {storeInfo.banner ? (
                                                            <img
                                                                src={storeInfo.banner}
                                                                alt="Store Banner"
                                                                className="h-full w-full object-cover"
                                                            />
                                                        ) : (
                                                            <ImageIcon className="h-6 w-6 text-gray-400" />
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                                <div className="flex justify-end gap-3">
                                    <Button variant="outline" onClick={() => setCurrentStep(currentStep - 1)}>
                                        Back
                                    </Button>
                                    <Button
                                        onClick={launchStorefront}
                                        disabled={isStorefrontLive}
                                        className="bg-green-600 hover:bg-green-700"
                                    >
                                        {isStorefrontLive ? "Storefront Live" : "Launch Storefront"}
                                    </Button>
                                </div>
                            </div>
                        )}
                    </CardContent>
                </Card>
            </div>
        </DashboardLayout>
    );
}