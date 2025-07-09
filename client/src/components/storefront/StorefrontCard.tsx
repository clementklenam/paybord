import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { useToast } from "@/components/ui/use-toast";
import { Storefront } from "@/services/storefront.service";
import { Copy, Edit, Eye, Image as ImageIcon, Trash2 } from "lucide-react";

interface StorefrontCardProps {
    storefront: Storefront;
    onView: (id: string) => void;
    onEdit: (id: string) => void;
    onDelete: (id: string) => void;
}

export function StorefrontCard({ storefront, onView, onEdit, onDelete }: StorefrontCardProps) {
    const { toast } = useToast();
    

    
    // Ensure we have a valid storefront ID
    const storefrontId = storefront.id || storefront._id || '';

    return (
        <Card className="overflow-hidden bg-white dark:bg-gray-800 border-gray-200 dark:border-gray-700">
            <div className="relative h-32 bg-gray-100 dark:bg-gray-700">
                {storefront.banner ? (
                    <img
                        src={storefront.banner}
                        alt={`${storefront.name} banner`}
                        className="w-full h-full object-cover"
                        onError={(e) => {
                            console.error('Failed to load banner image:', storefront.banner);
                            e.currentTarget.style.display = 'none';
                        }}
                    />
                ) : (
                    <div className="flex items-center justify-center h-full">
                        <ImageIcon className="h-8 w-8 text-gray-400 dark:text-gray-500" />
                    </div>
                )}
                {storefront.logo && (
                    <div className="absolute -bottom-6 left-4 w-12 h-12 rounded-full bg-white dark:bg-gray-800 shadow-md overflow-hidden border-2 border-white dark:border-gray-700">
                        <img
                            src={storefront.logo}
                            alt={`${storefront.name} logo`}
                            className="w-full h-full object-cover"
                            onError={(e) => {
                                console.error('Failed to load logo image:', storefront.logo);
                                e.currentTarget.style.display = 'none';
                            }}
                        />
                    </div>
                )}
            </div>
            <CardHeader className="pt-8">
                <div className="flex justify-between items-start">
                    <div>
                        <CardTitle className="text-gray-900 dark:text-gray-100">{storefront.name}</CardTitle>
                        <CardDescription className="mt-1 text-gray-500 dark:text-gray-400">
                            {storefront.description && storefront.description.length > 60
                                ? `${storefront.description.substring(0, 60)}...`
                                : storefront.description || 'No description'}
                        </CardDescription>
                    </div>
                    <Badge className={
                        storefront.status === 'active' ? "bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400 hover:bg-green-200 dark:hover:bg-green-900/30" :
                            storefront.status === 'inactive' ? "bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/30" :
                                "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                    }>
                        {storefront.status === 'active' ? 'Active' :
                            storefront.status === 'inactive' ? 'Inactive' : 'Draft'}
                    </Badge>
                </div>
            </CardHeader>
            <CardContent>
                <div className="grid grid-cols-2 gap-4 text-sm">
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Visits</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{(storefront.visits || 0).toLocaleString()}</p>
                    </div>
                    <div>
                        <p className="text-gray-500 dark:text-gray-400">Sales</p>
                        <p className="font-medium text-gray-900 dark:text-gray-100">{(storefront.sales || 0).toLocaleString()}</p>
                    </div>
                </div>
                <div className="mt-4 text-sm">
                    <p className="text-gray-500 dark:text-gray-400">URL</p>
                    <div className="flex items-center mt-1">
                        <p className="font-medium text-blue-600 dark:text-blue-400 truncate mr-2">
                            {storefrontId ? `${window.location.origin}/storefront/${storefrontId}` : 'URL not available yet'}
                        </p>
                        {storefrontId && (
                            <Button
                                variant="ghost"
                                size="icon"
                                className="h-6 w-6 hover:bg-gray-100 dark:hover:bg-gray-700"
                                onClick={() => {
                                    navigator.clipboard.writeText(`${window.location.origin}/storefront/${storefrontId}`);
                                    toast({
                                        title: "URL copied",
                                        description: "Storefront URL copied to clipboard",
                                        variant: "default"
                                    });
                                }}
                            >
                                <Copy className="h-3 w-3" />
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
            <CardFooter className="border-t border-gray-200 dark:border-gray-700 pt-4 flex justify-between">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => storefrontId && window.open(`/storefront/${storefrontId}`, '_blank')}
                    disabled={!storefrontId}
                >
                    <Eye className="h-4 w-4 mr-2" />
                    View
                </Button>
                <div className="flex gap-2">
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => storefrontId && onEdit(storefrontId)}
                        disabled={!storefrontId}
                    >
                        <Edit className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="outline"
                        size="sm"
                        onClick={() => storefrontId && onDelete(storefrontId)}
                        disabled={!storefrontId}
                    >
                        <Trash2 className="h-4 w-4 text-red-500 dark:text-red-400" />
                    </Button>
                </div>
            </CardFooter>
        </Card>
    );
}
