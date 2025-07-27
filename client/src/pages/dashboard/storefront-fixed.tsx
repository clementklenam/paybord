import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle} from "@/components/ui/alert-dialog";
import {useToast} from "@/components/ui/use-toast";
import {StorefrontCard} from "@/components/storefront/StorefrontCard";
import {StorefrontWizard} from "@/components/storefront/StorefrontWizard";
import {StorefrontService, Storefront, StorefrontCreateData} from "@/services/storefront.service";
import businessService from "@/services/business.service";
import {Filter, Loader2, Plus, Search} from "lucide-react";

export default function StorefrontPage() {
    const { toast } = useToast();
    const storefrontService = new StorefrontService();
    const businessServiceInstance = new businessService();
    
    // State for storefronts
    const [storefronts, setStorefronts] = useState<Storefront[]>([]);
    const [filteredStorefronts, setFilteredStorefronts] = useState<Storefront[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [statusFilter, setStatusFilter] = useState<string | null>(null);
    
    // Pagination state
    const [currentPage, setCurrentPage] = useState(1);
    const [totalStorefronts, setTotalStorefronts] = useState(0);
    const [totalPages, setTotalPages] = useState(1);
    const itemsPerPage = 6;
    
    // Creation wizard state
    const [showCreationWizard, setShowCreationWizard] = useState(false);
    const [isCreating, setIsCreating] = useState(false);
    
    // Delete dialog state
    const [showDeleteDialog, setShowDeleteDialog] = useState(false);
    const [storefrontToDelete, setStorefrontToDelete] = useState<string | null>(null);
    const [isDeleting, setIsDeleting] = useState(false);
    
    // Business state
    const [businesses, setBusinesses] = useState<{ _id: string; businessName: string }[]>([]);
    
    // Fetch storefronts on mount and when page changes
    useEffect(() => {
        fetchStorefronts();
        fetchBusinesses();
    }, [currentPage]);
    
    // Apply filters when search query or status filter changes
    useEffect(() => {
        applyFilters();
    }, [searchQuery, statusFilter, storefronts]);
    
    // Fetch businesses from API
    const fetchBusinesses = async () => {
        try {
            const businessProfile = await businessServiceInstance.getBusinessProfile();
            setBusinesses([{
                _id: businessProfile._id,
                businessName: businessProfile.businessName || 'My Business'
            }]);
        } catch (error) {
            console.error("Error fetching businesses:", error);
            setBusinesses([]);
        }
    };
    
    // Fetch storefronts from API
    const fetchStorefronts = async () => {
        setIsLoading(true);
        try {
            const response = await storefrontService.getStorefronts({
                page: currentPage,
                limit: itemsPerPage
            });
            
            setStorefronts(response.data);
            setTotalStorefronts(response.total);
            setTotalPages(Math.ceil(response.total / itemsPerPage));
        } catch (error) {
            console.error("Error fetching storefronts:", error);
            toast({
                title: "Error",
                description: "Failed to load storefronts. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsLoading(false);
        }
    };
    
    // Apply filters to storefronts
    const applyFilters = () => {
        let filtered = [...storefronts];
        
        // Apply search filter
        if (searchQuery) {
            const query = searchQuery.toLowerCase();
            filtered = filtered.filter(
                store => store.name.toLowerCase().includes(query) || 
                         store.description.toLowerCase().includes(query)
            );
        }
        
        // Apply status filter
        if (statusFilter) {
            filtered = filtered.filter(store => store.status === statusFilter);
        }
        
        setFilteredStorefronts(filtered);
    };
    
    // Handle storefront creation
    const handleCreateStorefront = async (data: StorefrontCreateData) => {
        setIsCreating(true);
        try {
            await storefrontService.createStorefront(data);
            
            toast({
                title: "Success",
                description: "Storefront created successfully!",
                variant: "default"
            });
            
            // Refresh storefronts and exit creation wizard
            await fetchStorefronts();
            setShowCreationWizard(false);
        } catch (error) {
            console.error("Error creating storefront:", error);
            toast({
                title: "Error",
                description: "Failed to create storefront. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsCreating(false);
        }
    };
    
    // Handle storefront deletion
    const confirmDeleteStorefront = (id: string) => {
        setStorefrontToDelete(id);
        setShowDeleteDialog(true);
    };
    
    const handleDeleteStorefront = async () => {
        if (!storefrontToDelete) return;
        
        setIsDeleting(true);
        try {
            await storefrontService.deleteStorefront(storefrontToDelete);
            
            toast({
                title: "Success",
                description: "Storefront deleted successfully!",
                variant: "default"
            });
            
            // Refresh storefronts and close dialog
            await fetchStorefronts();
            setShowDeleteDialog(false);
            setStorefrontToDelete(null);
        } catch (error) {
            console.error("Error deleting storefront:", error);
            toast({
                title: "Error",
                description: "Failed to delete storefront. Please try again.",
                variant: "destructive"
            });
        } finally {
            setIsDeleting(false);
        }
    };
    
    // Handle viewing a storefront
    const handleViewStorefront = (id: string) => {
        const storefront = storefronts.find(s => s.id === id);
        if (storefront) {
            window.open(storefront.url, '_blank');
        }
    };
    
    // Handle editing a storefront
    const handleEditStorefront = (_id: string) => {
        // Navigate to edit page or open edit modal
        toast({
            title: "Coming Soon",
            description: "Storefront editing will be available soon!",
            variant: "default"
        });
    };
    
    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold">Storefronts</h1>
                        <p className="text-gray-500">Create and manage your storefronts</p>
                    </div>
                    {!showCreationWizard && (
                        <Button 
                            onClick={() => setShowCreationWizard(true)}
                            className="w-full md:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Storefront
                        </Button>
                    )}
                </div>
                
                {/* Creation Wizard */}
                {showCreationWizard ? (
                    <StorefrontWizard 
                        onSubmit={handleCreateStorefront}
                        onCancel={() => setShowCreationWizard(false)}
                        isSubmitting={isCreating}
                        businesses={businesses}
                    />
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
                                <Input 
                                    placeholder="Search storefronts..." 
                                    className="pl-9"
                                    value={searchQuery}
                                    onChange={(e) => setSearchQuery(e.target.value)}
                                />
                            </div>
                            <div className="flex gap-2">
                                <Button 
                                    variant={statusFilter === null ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter(null)}
                                >
                                    All
                                </Button>
                                <Button 
                                    variant={statusFilter === 'active' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter('active')}
                                >
                                    Active
                                </Button>
                                <Button 
                                    variant={statusFilter === 'inactive' ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => setStatusFilter('inactive')}
                                >
                                    Inactive
                                </Button>
                            </div>
                        </div>
                    </>
                )}
                
                {/* Storefronts Grid */}
                {!showCreationWizard && (
                    <div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array(6).fill(0).map((_, index) => (
                                    <Card key={index}>
                                        <div className="h-32 bg-gray-100">
                                            <Skeleton className="h-full w-full" />
                                        </div>
                                        <CardHeader>
                                            <Skeleton className="h-6 w-3/4 mb-2" />
                                            <Skeleton className="h-4 w-full" />
                                        </CardHeader>
                                        <CardContent>
                                            <div className="space-y-4">
                                                <div className="grid grid-cols-2 gap-4">
                                                    <Skeleton className="h-8 w-full" />
                                                    <Skeleton className="h-8 w-full" />
                                                </div>
                                                <Skeleton className="h-10 w-full" />
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        ) : filteredStorefronts.length === 0 ? (
                            <Card>
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-gray-100 p-4 mb-4">
                                        <Filter className="h-8 w-8 text-gray-400" />
                                    </div>
                                    <CardTitle className="mb-2">No storefronts found</CardTitle>
                                    <CardDescription className="text-center max-w-md mb-6">
                                        {storefronts.length === 0 
                                            ? "You haven't created any storefronts yet. Create your first storefront to get started."
                                            : "No storefronts match your search criteria. Try adjusting your filters."}
                                    </CardDescription>
                                    {storefronts.length === 0 && (
                                        <Button onClick={() => setShowCreationWizard(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Storefront
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {filteredStorefronts.map((storefront) => (
                                    <StorefrontCard 
                                        key={storefront.id}
                                        storefront={storefront}
                                        onView={handleViewStorefront}
                                        onEdit={handleEditStorefront}
                                        onDelete={confirmDeleteStorefront}
                                    />
                                ))}
                            </div>
                        )}
                    </div>
                )}
                
                {/* Pagination */}
                {!showCreationWizard && storefronts.length > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500">
                            Showing {filteredStorefronts.length} of {totalStorefronts} storefronts
                        </div>
                        <div className="flex gap-2">
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === 1}
                                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                            >
                                Previous
                            </Button>
                            <Button 
                                variant="outline" 
                                size="sm" 
                                disabled={currentPage === totalPages}
                                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                            >
                                Next
                            </Button>
                        </div>
                    </div>
                )}
                
                {/* Delete confirmation dialog */}
                <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
                    <AlertDialogContent>
                        <AlertDialogHeader>
                            <AlertDialogTitle>Are you sure?</AlertDialogTitle>
                            <AlertDialogDescription>
                                This action cannot be undone. This will permanently delete the
                                storefront and all associated data.
                            </AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                                onClick={handleDeleteStorefront}
                                className="bg-red-600 hover:bg-red-700 text-white"
                            >
                                {isDeleting ? (
                                    <>
                                        <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                                        Deleting...
                                    </>
                                ) : (
                                    "Delete"
                                )}
                            </AlertDialogAction>
                        </AlertDialogFooter>
                    </AlertDialogContent>
                </AlertDialog>
            </div>
        </DashboardLayout>
    );
}
