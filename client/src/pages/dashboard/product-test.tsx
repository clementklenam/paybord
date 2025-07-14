import { useState, useEffect } from "react";
import { DashboardLayout } from "@/components/dashboard/DashboardLayout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useAuth } from "@/contexts/AuthContext";

export default function ProductTestPage() {
  const { user } = useAuth();
  const [result, setResult] = useState<string>("");
  const [loading, setLoading] = useState<boolean>(false);
  const [token, setToken] = useState<string>("");
  const [manualBusinessId, setManualBusinessId] = useState<string>("68226b39653af0df3da731e9"); // Esthers Bakery Shop

  useEffect(() => {
    // Get token from localStorage
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
    }
  }, []);

  const testCreateProduct = async () => {
    try {
      setLoading(true);
      setResult("Testing product creation...");

      // Always use the correct business ID for Esthers Bakery Shop
      // This is the key fix - we're using the business ID, not the user ID
      let businessId = "68226b39653af0df3da731e9";
      
      // If user manually entered a different ID, use that instead
      if (manualBusinessId && manualBusinessId.trim() !== "") {
        businessId = manualBusinessId;
        console.log('Using manually entered business ID:', businessId);
      } else {
        console.log('Using default business ID for Esthers Bakery Shop:', businessId);
      }
      
      if (!businessId) {
        setResult("Error: No business ID available. Please enter a business ID manually below.");
        setLoading(false);
        return;
      }

      // Create test product data
      const productData = {
        business: businessId, // This is the key field - must match what backend expects
        name: "Test Product",
        description: "This is a test product created via the API test",
        price: 19.99,
        image: "https://via.placeholder.com/800x600?text=Test+Product",
        category: "Test",
        currency: "USD",
        customId: `test_${Date.now()}`,
        metadata: {}
      };
      
      console.log('Sending product data with business ID:', businessId);
      console.log("API URL:", "http://localhost:5000/api/products");
      console.log("Request data:", JSON.stringify(productData, null, 2));
      console.log("Token available:", !!token);

      // Make direct fetch call to API
      console.log('Making API request with the following data:', {
        url: "http://localhost:5000/api/products",
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: productData
      });
      
      const response = await fetch("http://localhost:5000/api/products", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token}`
        },
        body: JSON.stringify(productData)
      });

      // Handle response
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { text: responseText };
      }

      // Update result
      setResult(
        `Status: ${response.status}\n\nResponse: ${JSON.stringify(
          responseData,
          null,
          2
        )}`
      );

      // If successful, try to fetch products
      if (response.ok) {
        await testGetProducts();
      }
    } catch (error: unknown) {
      setResult(`Error: ${error.message}`);
      console.error("Test error:", error);
    } finally {
      setLoading(false);
    }
  };

  const testGetProducts = async () => {
    try {
      setResult(prev => prev + "\n\nTesting product retrieval...");

      // Make direct fetch call to API
      const response = await fetch("http://localhost:5000/api/products", {
        method: "GET",
        headers: {
          "Authorization": `Bearer ${token}`
        }
      });

      // Handle response
      const responseText = await response.text();
      let responseData;
      try {
        responseData = JSON.parse(responseText);
      } catch (e) {
        responseData = { text: responseText };
      }

      // Update result
      setResult(
        prev => `${prev}\n\nGet Products Status: ${response.status}\n\nProducts Response: ${JSON.stringify(
          responseData,
          null,
          2
        )}`
      );
    } catch (error: unknown) {
      setResult(prev => `${prev}\n\nGet Products Error: ${error.message}`);
      console.error("Test error:", error);
    }
  };

  return (
    <DashboardLayout>
      <div className="container mx-auto py-6">
        <h1 className="text-2xl font-bold mb-6">Product API Test</h1>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>Authentication Status</CardTitle>
          </CardHeader>
          <CardContent>
            <p>User: {user ? user.email : "Not logged in"}</p>
            <p>Token Available: {token ? "Yes" : "No"}</p>
            {token && (
              <p>Token Preview: {token.substring(0, 15)}...{token.substring(token.length - 5)}</p>
            )}
          </CardContent>
        </Card>
        
        <Card className="mb-6">
          <CardHeader>
            <CardTitle>API Test</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Business ID (required for product creation)
              </label>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={manualBusinessId}
                  onChange={(e) => setManualBusinessId(e.target.value)}
                  placeholder="Enter business ID"
                  className="flex-1 px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                />
              </div>
              <p className="text-xs text-gray-500 mt-1">
                {user?._id ? `User ID detected: ${user._id}` : "No user ID detected"}
              </p>
              <p className="text-xs text-gray-500 mt-1">
                <strong>Note:</strong> Your business ID is different from your user ID. Use 68226b39653af0df3da731e9 for Esthers Bakery Shop.
              </p>
            </div>
            
            <Button 
              onClick={testCreateProduct} 
              disabled={loading}
              className="mb-4"
            >
              {loading ? "Testing..." : "Test Create Product"}
            </Button>
            
            <div className="mt-4">
              <h3 className="font-bold mb-2">Result:</h3>
              <pre className="bg-gray-100 p-4 rounded whitespace-pre-wrap overflow-auto max-h-96">
                {result || "No test run yet"}
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </DashboardLayout>
  );
}
