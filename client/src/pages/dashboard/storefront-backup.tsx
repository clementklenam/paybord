import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Label} from "@/components/ui/label";
import {Tabs, TabsContent, TabsList, TabsTrigger} from "@/components/ui/tabs";
import {Textarea} from "@/components/ui/textarea";
import {Select} from "@/components/ui/select";
import {Switch} from "@/components/ui/switch";
import {Badge} from "@/components/ui/badge";
import {Separator} from "@/components/ui/separator";
import {Settings, ShoppingBag, Palette, Globe, Eye, Check, ImageIcon, Plus, ExternalLink, CreditCard, Smartphone, Copy, ArrowRight} from "lucide-react";

// Define the step interface
interface Step {
    id: number;
    title: string;
    description: string;
    icon: React.ReactNode;
    isCompleted: boolean;
}

// Define the product interface
interface Product {
    id: string;
    name: string;
    description: string;
    price: number;
    image: string;
    isSelected: boolean;
}

// Define the storefront interface
interface Storefront {
    id: string;
    name: string;
    description: string;
    url: string;
    createdAt: string;
    visits: number;
    sales: number;
    banner: string | null;
    logo: string | null;
    primaryColor: string;
    accentColor?: string;
    products?: unknown[];
}

export default function StorefrontPage() {
    // State for the current step
    const [currentStep, setCurrentStep] = useState(1);
    
    // State for showing the creation wizard
    const [showCreationWizard, setShowCreationWizard] = useState(false);
    
    // State for launched storefronts
    const [launchedStorefronts, setLaunchedStorefronts] = useState<Storefront[]>([]);
    
    // Load launched storefronts from localStorage
    useEffect(() => {
        const savedStorefronts = localStorage.getItem('paymesa_launched_storefronts');
        if (savedStorefronts) {
            try {
                const parsedStorefronts = JSON.parse(savedStorefronts);
                setLaunchedStorefronts(parsedStorefronts);
                console.log('Loaded saved storefronts:', parsedStorefronts.length);
            } catch (e) {
                console.error('Error parsing saved storefronts', e);
            }
        }
    }, []);
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
        }
    });

    // Mock products from catalog
    const [products, setProducts] = useState<Product[]>([
        {
            id: "prod_1",
            name: "Basic Plan",
            description: "Essential features for small businesses",
            price: 49.99,
            image: "/placeholder-product.jpg",
            isSelected: false
        },
        {
            id: "prod_2",
            name: "Premium Plan",
            description: "Advanced features with priority support",
            price: 99.99,
            image: "/placeholder-product.jpg",
            isSelected: false
        },
        {
            id: "prod_3",
            name: "Enterprise Solution",
            description: "Complete solution for large enterprises",
            price: 299.99,
            image: "/placeholder-product.jpg",
            isSelected: false
        }
    ]);

    // State for storefront preview URL
    const [previewUrl, setPreviewUrl] = useState("");
    const [isStorefrontLive, setIsStorefrontLive] = useState(false);

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
            isCompleted: products.some(p => p.isSelected)
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

    // Handle image upload
    const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>, type: 'logo' | 'banner') => {
        const file = e.target.files?.[0];
        if (file) {
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
        }
    };

    // Handle product selection
    const handleProductSelection = (productId: string) => {
        setProducts(prev =>
            prev.map(product =>
                product.id === productId
                    ? { ...product, isSelected: !product.isSelected }
                    : product
            )
        );
    };

    // Format currency
    const formatCurrency = (amount: number): string => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'USD',
        }).format(amount);
    };

    // Generate preview URL
    const generatePreviewUrl = () => {
        // In a real app, this would create an actual preview URL
        const url = `http://localhost:5000/store/${storeInfo.name.toLowerCase().replace(/\s+/g, '-')}`;
        setPreviewUrl(url);
        return url;
    };

    // Launch storefront
    const launchStorefront = () => {
        setIsStorefrontLive(true);
        
        // Generate a unique ID for the storefront
        const storefrontId = `store_${Date.now()}`;
        
        // Create the storefront URL
        const storeName = storeInfo.name.toLowerCase().replace(/\s+/g, '-');
        const storefrontUrl = `http://localhost:5000/store/${storeName}`;
        
        // Add to launched storefronts
        const newStorefront = {
            id: storefrontId,
            name: storeInfo.name,
            description: storeInfo.description,
            url: storefrontUrl,
            createdAt: new Date().toISOString(),
            visits: 0,
            sales: 0,
            banner: storeInfo.banner,
            logo: storeInfo.logo,
            primaryColor: storeInfo.primaryColor,
            accentColor: storeInfo.accentColor,
            products: products.filter(p => p.isSelected).map(p => ({
                id: p.id,
                name: p.name,
                description: p.description,
                price: p.price,
                image: p.image
            }))
        };
        
        const updatedStorefronts = [newStorefront, ...launchedStorefronts];
        setLaunchedStorefronts(updatedStorefronts);
        localStorage.setItem('paymesa_launched_storefronts', JSON.stringify(updatedStorefronts));
        
        // Reset the wizard
        setCurrentStep(1);
        setShowCreationWizard(false);
        
        alert("Congratulations! Your storefront is now live.");
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
                                    {products.map((product) => (
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
                                            <h4 className="font-medium">Selected Products: {products.filter(p => p.isSelected).length}</h4>
                                            <p className="text-sm text-gray-500 mt-1">
                                                These products will be displayed on your storefront
                                            </p>
                                        </div>
                                        {products.some(p => p.isSelected) && (
                                            <Badge className="bg-green-100 text-green-800">
                                                {products.filter(p => p.isSelected).length} Selected
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
                                <div className="bg-gray-50 border rounded-lg overflow-hidden">
                                    <div className="p-4 bg-white border-b">
                                        <div className="flex items-center justify-between">
                                            <h3 className="font-medium">Storefront Preview</h3>
                                            <Button variant="outline" size="sm" onClick={() => window.open(generatePreviewUrl(), '_blank')}>
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                <span>Open Preview</span>
                                            </Button>
                                        </div>
                                    </div>
                                    <div className="p-6">
                                        <div className="max-w-3xl mx-auto bg-white rounded-lg shadow-lg overflow-hidden border">
                                            {/* Store Header */}
                                            <div
                                                className="h-32 bg-cover bg-center relative"
                                                style={{
                                                    backgroundColor: storeInfo.primaryColor,
                                                    backgroundImage: storeInfo.banner ? `url(${storeInfo.banner})` : 'none'
                                                }}
                                            >
                                                <div className="absolute inset-0 bg-black/20"></div>
                                                <div className="absolute bottom-0 left-0 right-0 p-4 text-white flex items-end">
                                                    {storeInfo.logo && (
                                                        <div className="h-16 w-16 rounded-full bg-white p-1 mr-3 overflow-hidden">
                                                            <img
                                                                src={storeInfo.logo}
                                                                alt="Logo"
                                                                className="h-full w-full object-contain"
                                                            />
                                                        </div>
                                                    )}
                                                    <div>
                                                        <h2 className="text-xl font-bold">{storeInfo.name || "Your Store Name"}</h2>
                                                        <p className="text-sm opacity-90 line-clamp-1">{storeInfo.description || "Your store description"}</p>
                                                    </div>
                                                </div>
                                            </div>

                                            {/* Featured Products */}
                                            <div className="p-4">
                                                <h3 className="font-medium mb-3">Featured Products</h3>
                                                <div className="grid grid-cols-2 gap-3">
                                                    {products.filter(p => p.isSelected).slice(0, 2).map((product) => (
                                                        <div key={product.id} className="border rounded-md overflow-hidden">
                                                            <div className="h-24 bg-gray-100">
                                                                {product.image && (
                                                                    <img
                                                                        src={product.image}
                                                                        alt={product.name}
                                                                        className="h-full w-full object-cover"
                                                                    />
                                                                )}
                                                            </div>
                                                            <div className="p-2">
                                                                <h4 className="font-medium text-sm">{product.name}</h4>
                                                                <div className="text-sm font-medium mt-1">{formatCurrency(product.price)}</div>
                                                            </div>
                                                        </div>
                                                    ))}
                                                </div>
                                            </div>

                                            {/* Payment Methods */}
                                            <div className="p-4 border-t">
                                                <div className="flex items-center justify-between text-sm text-gray-500">
                                                    <div className="flex items-center gap-2">
                                                        <CreditCard className="h-4 w-4" />
                                                        <span>Credit Card</span>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <Smartphone className="h-4 w-4" />
                                                        <span>Mobile Money</span>
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                <div className="bg-white border rounded-lg p-4">
                                    <h3 className="font-medium mb-3">Storefront URL</h3>
                                    <div className="flex items-center">
                                        <Input
                                            value={previewUrl || generatePreviewUrl()}
                                            readOnly
                                            className="flex-1"
                                        />
                                        <Button variant="outline" className="ml-2" onClick={() => {
                                            navigator.clipboard.writeText(previewUrl);
                                            alert("URL copied to clipboard!");
                                        }}>
                                            <Copy className="h-4 w-4 mr-2" />
                                            <span>Copy</span>
                                        </Button>
                                    </div>
                                </div>

                                <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                                    <div className="flex items-start">
                                        <Check className="h-5 w-5 text-green-500 mt-0.5 mr-3" />
                                        <div>
                                            <h3 className="font-medium text-green-800">Ready to Launch!</h3>
                                            <p className="text-sm text-green-700 mt-1">
                                                Your storefront is ready to go live. Once published, customers can browse and purchase your products.
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-between">
                        {currentStep > 1 && (
                            <Button
                                variant="outline"
                                onClick={() => setCurrentStep(currentStep - 1)}
                            >
                                Back
                            </Button>
                        )}
                        {currentStep < steps.length && (
                            <Button
                                onClick={() => setCurrentStep(currentStep + 1)}
                                disabled={
                                    (currentStep === 1 && (!storeInfo.name || !storeInfo.description)) ||
                                    (currentStep === 2 && !products.some(p => p.isSelected))
                                }
                                className="ml-auto"
                            >
                                Continue
                                <ArrowRight className="h-4 w-4 ml-2" />
                            </Button>
                        )}
                        {currentStep === steps.length && (
                            <Button
                                onClick={launchStorefront}
                                disabled={isStorefrontLive}
                                className="ml-auto bg-green-600 hover:bg-green-700"
                            >
                                {isStorefrontLive ? "Storefront Live" : "Launch Storefront"}
                            </Button>
                        )}
                    </CardFooter>
                </Card>
            </div>
        </DashboardLayout>
    );
}