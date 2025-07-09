import { useParams } from "wouter";
import { useState, useEffect } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { CreditCard, ShoppingBag } from "lucide-react";

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  image: string;
}

export default function StorePreview() {
  const { id } = useParams();
  const [storeData, setStoreData] = useState({
    name: id ? id.replace(/-/g, " ") : "Store",
    description: "Welcome to our store. Browse our products and services.",
    logo: null,
    banner: null,
    primaryColor: "#1e8449",
    accentColor: "#27ae60",
  });

  const [products, setProducts] = useState<Product[]>([
    {
      id: "prod_1",
      name: "Basic Plan",
      description: "Essential features for small businesses",
      price: 49.99,
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod_2",
      name: "Premium Plan",
      description: "Advanced features with priority support",
      price: 99.99,
      image: "/placeholder-product.jpg",
    },
    {
      id: "prod_3",
      name: "Enterprise Solution",
      description: "Complete solution for large enterprises",
      price: 299.99,
      image: "/placeholder-product.jpg",
    },
  ]);

  // Format currency
  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat("en-US", {
      style: "currency",
      currency: "USD",
    }).format(amount);
  };

  useEffect(() => {
    // In a real app, you would fetch store data based on the ID
    console.log(`Loading store with ID: ${id}`);
    document.title = `${storeData.name} | Paymesa Store`;
    
    // Apply store theme colors
    document.documentElement.style.setProperty("--primary-color", storeData.primaryColor);
    document.documentElement.style.setProperty("--accent-color", storeData.accentColor);
    
    return () => {
      // Clean up theme colors when component unmounts
      document.documentElement.style.removeProperty("--primary-color");
      document.documentElement.style.removeProperty("--accent-color");
    };
  }, [id, storeData]);

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Store Header */}
      <div 
        className="w-full h-48 bg-cover bg-center" 
        style={{ 
          backgroundColor: storeData.primaryColor,
          backgroundImage: storeData.banner ? `url(${storeData.banner})` : undefined 
        }}
      >
        <div className="container mx-auto px-4 h-full flex items-end pb-4">
          <div className="flex items-center gap-4">
            <div 
              className="w-20 h-20 rounded-full bg-white flex items-center justify-center overflow-hidden border-4 border-white"
              style={{ backgroundColor: storeData.accentColor }}
            >
              {storeData.logo ? (
                <img src={storeData.logo} alt={storeData.name} className="w-full h-full object-cover" />
              ) : (
                <ShoppingBag className="h-10 w-10 text-white" />
              )}
            </div>
            <div>
              <h1 className="text-2xl font-bold text-white capitalize">{storeData.name}</h1>
              <p className="text-white/80">{storeData.description}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Products Section */}
      <div className="container mx-auto px-4 py-8">
        <h2 className="text-xl font-semibold mb-4">Products & Services</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {products.map((product) => (
            <Card key={product.id} className="overflow-hidden">
              <div className="h-40 bg-gray-100 relative">
                {product.image ? (
                  <img 
                    src={product.image} 
                    alt={product.name} 
                    className="w-full h-full object-cover" 
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center">
                    <ShoppingBag className="h-12 w-12 text-gray-400" />
                  </div>
                )}
                <Badge 
                  className="absolute top-2 right-2" 
                  style={{ backgroundColor: storeData.accentColor }}
                >
                  {formatCurrency(product.price)}
                </Badge>
              </div>
              <CardContent className="p-4">
                <h3 className="font-medium text-lg">{product.name}</h3>
                <p className="text-gray-500 text-sm mt-1">{product.description}</p>
                <Separator className="my-3" />
                <Button 
                  className="w-full mt-2" 
                  style={{ 
                    backgroundColor: storeData.primaryColor,
                    color: "white",
                    borderColor: storeData.primaryColor
                  }}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Buy Now
                </Button>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gray-100 py-6 mt-8">
        <div className="container mx-auto px-4 text-center text-gray-500 text-sm">
          <p>© {new Date().getFullYear()} {storeData.name} | Powered by Paymesa</p>
        </div>
      </footer>
    </div>
  );
}