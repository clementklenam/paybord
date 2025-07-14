import {useState, useEffect} from "react";
import {DashboardLayout} from "@/components/dashboard/DashboardLayout";
import {Card, CardContent, CardDescription, CardHeader, CardTitle} from "@/components/ui/card";
import {Button} from "@/components/ui/button";
import {Input} from "@/components/ui/input";
import {Skeleton} from "@/components/ui/skeleton";
import {useToast} from "@/components/ui/use-toast";
import {StorefrontCard} from "@/components/storefront/StorefrontCard";
import {StorefrontWizard} from "@/components/storefront/StorefrontWizard";
import {Storefront, StorefrontCreateData, StorefrontService} from "@/services/storefront.service";
import {Filter, Loader2, Plus, Search} from "lucide-react";
import {getBusinessesForUser} from '@/services/business.service';

export default function StorefrontPage() {
    const { toast } = useToast();
    const storefrontService = new StorefrontService();

    // State for storefronts
    const [storefronts, setStorefronts] = useState<Storefront[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);
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

    // Businesses state
    const [businesses, setBusinesses] = useState<{ _id: string; businessName: string }[]>([]);
    const [businessesLoading, setBusinessesLoading] = useState(true);
    const [businessesError, setBusinessesError] = useState<string | null>(null);

    // Fetch storefronts on mount and when page changes
    useEffect(() => {
        fetchStorefronts();
    }, [currentPage]);

    // Fetch businesses on mount
    useEffect(() => {
        async function fetchBusinesses() {
            setBusinessesLoading(true);
            try {
                const result = await getBusinessesForUser();
                setBusinesses(result);
            } catch (err: unknown) {
                setBusinessesError('Failed to load businesses.');
            } finally {
                setBusinessesLoading(false);
            }
        }
        fetchBusinesses();
    }, []);

    // Enhanced fetchBusinesses with auto-retry logic
    const fetchBusinesses = async (retries = 3) => {
        setBusinessesLoading(true);
        try {
            const result = await getBusinessesForUser();
            if (Array.isArray(result) && result.length === 0 && retries > 0) {
                // Wait 1 second and retry
                setTimeout(() => fetchBusinesses(retries - 1), 1000);
                return;
            }
            setBusinesses(result);
            setBusinessesError(null);
        } catch (err) {
            setBusinessesError('Failed to load businesses.');
        } finally {
            setBusinessesLoading(false);
        }
    };

    // Fetch storefronts from API with server-side filtering and pagination
    const fetchStorefronts = async () => {
        setIsLoading(true);
        setError(null);
        try {
            console.log('Fetching storefronts with filters:', {
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                status: (statusFilter === 'active' || statusFilter === 'inactive' || statusFilter === 'draft') ? statusFilter : undefined
            });

            const response = await storefrontService.getStorefronts({
                page: currentPage,
                limit: itemsPerPage,
                search: searchQuery || undefined,
                status: (statusFilter === 'active' || statusFilter === 'inactive' || statusFilter === 'draft') ? statusFilter : undefined
            });

            console.log('Storefront service response:', response);

            if (response && Array.isArray(response.data)) {
                setStorefronts(response.data);
                setTotalStorefronts(response.total || 0);
                setTotalPages(response.pages || 1);
                console.log('Storefronts set successfully:', response.data);
            } else if (response && response.data && response.data.length === 0) {
                setStorefronts([]);
                setTotalStorefronts(0);
                setTotalPages(1);
                console.log('No storefronts found.');
            } else {
                // Do not clear the list unless it's a real error
                console.error('Invalid response format:', response);
                setError('Failed to load storefronts. Please try again.');
                toast({
                    title: 'Error',
                    description: 'Failed to load storefronts. Please try again.',
                    variant: 'destructive'
                });
            }
            // Debug: log the current storefronts state
            setTimeout(() => {
                console.log('Current storefronts state:', storefronts);
            }, 100);
        } catch (error) {
            console.error('Error fetching storefronts:', error);
            setError('Failed to load storefronts. Please try again.');
            toast({
                title: 'Error',
                description: 'Failed to load storefronts. Please try again.',
                variant: 'destructive'
            });
        } finally {
            setIsLoading(false);
        }
    };

    // Fetch storefronts whenever currentPage, searchQuery, or statusFilter changes
    useEffect(() => {
        fetchStorefronts();
    }, [currentPage, searchQuery, statusFilter]);

    // Calculate pagination display range
    const startIdx = (currentPage - 1) * itemsPerPage + 1;
    const endIdx = Math.min(currentPage * itemsPerPage, totalStorefronts);

    // Handle storefront creation
    const handleCreateStorefront = async (data: StorefrontCreateData) => {
        setIsCreating(true);
        try {
            // Create the storefront and get the response
            await storefrontService.createStorefront(data);
                toast({
                    title: "Success",
                    description: "Storefront created successfully!",
                    variant: "default"
                });
            setShowCreationWizard(false);
            // Always refetch from backend after creation
            fetchStorefronts();
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

    // When opening the creation wizard, always fetch latest businesses
    const handleOpenCreationWizard = async () => {
        await fetchBusinesses();
        setShowCreationWizard(true);
    };

    // Handle deleting a storefront
    const handleDeleteStorefront = async (id: string) => {
        try {
            if (!id) {
                throw new Error('Invalid storefront ID');
            }
            const confirmed = window.confirm('Are you sure you want to delete this storefront?');
            if (!confirmed) return;
            await storefrontService.deleteStorefront(id);
                toast({
                    title: 'Success',
                    description: 'Storefront deleted successfully',
                    variant: 'default',
                });
            // Always refetch from backend after deletion
            fetchStorefronts();
        } catch (error: unknown) {
            console.error('Error deleting storefront:', error);
            toast({
                title: 'Error',
                description: error.message || 'Failed to delete storefront',
                variant: 'destructive',
            });
        }
    };

    // Handle viewing a storefront
    const handleViewStorefront = (id: string) => {
        const storefront = storefronts.find(s => s.id === id);
        if (storefront) {
            // Use the frontend route for the storefront
            window.open(`/storefront/${id}`, '_blank');
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

    // Optionally, show a loading or error state if businesses are loading or failed
    if (businessesLoading) return <div>Loading businesses...</div>;
    if (businessesError) return <div>{businessesError}</div>;

    return (
        <DashboardLayout>
            <div className="flex flex-col gap-6">
                {/* Header */}
                <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                    <div>
                        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Storefronts</h1>
                        <p className="text-gray-500 dark:text-gray-400">Create and manage your storefronts</p>
                    </div>
                    {!showCreationWizard && (
                        <Button
                            onClick={handleOpenCreationWizard}
                            className="w-full md:w-auto"
                        >
                            <Plus className="h-4 w-4 mr-2" />
                            Create Storefront
                        </Button>
                    )}
                </div>

                {/* Creation Wizard */}
                {showCreationWizard ? (
                    businesses.length === 0 ? (
                        <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700 max-w-lg mx-auto mt-8">
                            <CardContent className="flex flex-col items-center justify-center py-12">
                                <div className="rounded-full bg-yellow-100 dark:bg-yellow-900/20 p-4 mb-4">
                                    <Filter className="h-8 w-8 text-yellow-400 dark:text-yellow-500" />
                                </div>
                                <CardTitle className="mb-2 text-gray-900 dark:text-gray-100">No business found</CardTitle>
                                <CardDescription className="text-center max-w-md mb-6 text-gray-500 dark:text-gray-400">
                                    You must create a business profile before you can create a storefront.<br />
                                    If you just registered, please wait a moment and retry.
                                </CardDescription>
                                <Button onClick={fetchBusinesses} disabled={businessesLoading}>
                                    {businessesLoading ? <Loader2 className="h-4 w-4 mr-2 animate-spin" /> : <Filter className="h-4 w-4 mr-2" />}
                                    Retry
                                </Button>
                                <Button variant="outline" className="mt-2" onClick={() => setShowCreationWizard(false)}>
                                    Cancel
                                </Button>
                            </CardContent>
                        </Card>
                    ) : (
                        <StorefrontWizard
                            onSubmit={handleCreateStorefront}
                            onCancel={() => setShowCreationWizard(false)}
                            isSubmitting={isCreating}
                            businesses={businesses}
                        />
                    )
                ) : (
                    <>
                        {/* Filters */}
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400 dark:text-gray-500" />
                                <Input
                                    placeholder="Search storefronts..."
                                    className="pl-9 bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-gray-100"
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
                {!showCreationWizard && totalStorefronts > 0 && (
                    <div>
                        {isLoading ? (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {Array(6).fill(0).map((_, index) => (
                                    <Card key={index} className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                        <div className="h-32 bg-gray-100 dark:bg-gray-700">
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
                        ) : error ? (
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-red-100 dark:bg-red-900/20 p-4 mb-4">
                                        <Filter className="h-8 w-8 text-red-400 dark:text-red-500" />
                                    </div>
                                    <CardTitle className="mb-2 text-gray-900 dark:text-gray-100">Error loading storefronts</CardTitle>
                                    <CardDescription className="text-center max-w-md mb-6 text-gray-500 dark:text-gray-400">
                                        {error}
                                    </CardDescription>
                                    <Button onClick={fetchStorefronts}>
                                        Try Again
                                    </Button>
                                </CardContent>
                            </Card>
                        ) : storefronts.length === 0 ? (
                            <Card className="bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
                                <CardContent className="flex flex-col items-center justify-center py-12">
                                    <div className="rounded-full bg-gray-100 dark:bg-gray-700 p-4 mb-4">
                                        <Filter className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                                    </div>
                                    <CardTitle className="mb-2 text-gray-900 dark:text-gray-100">No storefronts found</CardTitle>
                                    <CardDescription className="text-center max-w-md mb-6 text-gray-500 dark:text-gray-400">
                                        {(storefronts && storefronts.length === 0)
                                            ? "You haven't created any storefronts yet. Create your first storefront to get started."
                                            : "No storefronts match your search criteria. Try adjusting your filters."}
                                    </CardDescription>
                                    {(storefronts && storefronts.length === 0) && (
                                        <Button onClick={() => setShowCreationWizard(true)}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create Storefront
                                        </Button>
                                    )}
                                </CardContent>
                            </Card>
                        ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                                {storefronts.map(storefront => (
                                        <StorefrontCard
                                        key={storefront.id || storefront._id || `temp-${Math.random().toString(36).substr(2, 9)}`}
                                            storefront={storefront}
                                            onView={handleViewStorefront}
                                            onEdit={handleEditStorefront}
                                            onDelete={handleDeleteStorefront}
                                        />
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Pagination */}
                {!showCreationWizard && totalStorefronts > 0 && (
                    <div className="flex items-center justify-between mt-4">
                        <div className="text-sm text-gray-500 dark:text-gray-400">
                            Showing {startIdx}-{endIdx} of {totalStorefronts} storefronts
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
            </div>
        </DashboardLayout>
    );
}
