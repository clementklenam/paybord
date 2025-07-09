import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { Badge } from "@/components/ui/badge";
import {
  Code,
  Copy,
  EyeIcon,
  EyeOffIcon,
  KeyRound,
  Plus,
  RefreshCw,
  ShieldAlert,
  Terminal,
  Lock,
  Clipboard,
  CheckCircle2,
  AlertTriangle,
  Globe,
  Clock,
  Eye,
  Filter,
  Download
} from "lucide-react";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";

export function ApiKeysPage() {
  const [activeTab, setActiveTab] = useState("api-keys");
  const [showSecretKey, setShowSecretKey] = useState(false);
  const [copiedPublicKey, setCopiedPublicKey] = useState(false);
  const [copiedSecretKey, setCopiedSecretKey] = useState(false);
  const [showTestMode, setShowTestMode] = useState(true);

  // Mock data - in a real app this would come from your API
  const apiKeys = {
    publicKey: "pk_test_abc123def456ghi789jkl",
    secretKey: "sk_test_xyz987uvw654tsr321qpo",
    created: "May 5, 2025",
    lastUsed: "May 9, 2025"
  };

  const webhookEndpoints = [
    {
      id: "wh_123456",
      url: "https://example.com/payment-hooks",
      status: "active",
      events: ["payment.success", "payment.failed", "refund.processed"],
      lastFired: "2 hours ago",
      lastResponse: "200 OK"
    },
    {
      id: "wh_789012",
      url: "https://example.com/subscription-hooks",
      status: "inactive",
      events: ["subscription.created", "subscription.updated", "subscription.cancelled"],
      lastFired: "3 days ago",
      lastResponse: "500 Server Error"
    }
  ];

  const copyToClipboard = (text: string, keyType: 'public' | 'secret') => {
    navigator.clipboard.writeText(text);
    if (keyType === 'public') {
      setCopiedPublicKey(true);
      setTimeout(() => setCopiedPublicKey(false), 2000);
    } else {
      setCopiedSecretKey(true);
      setTimeout(() => setCopiedSecretKey(false), 2000);
    }
  };

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">API & Developers</h1>
          <p className="text-gray-500">
            Manage API keys, webhooks, and developer tools
          </p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 bg-gradient-to-r from-green-500/20 to-yellow-500/20 px-3 py-1.5 rounded-full">
            <div className={`w-3 h-3 rounded-full ${showTestMode ? 'bg-yellow-500' : 'bg-[#1e8449]'}`}></div>
            <span className="text-sm font-medium">
              {showTestMode ? 'Test Mode' : 'Live Mode'}
            </span>
            <Switch
              id="mode-toggle"
              checked={!showTestMode}
              onCheckedChange={(checked) => setShowTestMode(!checked)}
              className="ml-2"
            />
          </div>
        </div>
      </div>

      {/* Mode Banner */}
      {showTestMode && (
        <Alert className="mb-6 border-yellow-500 bg-yellow-50">
          <AlertTriangle className="h-4 w-4 text-yellow-600" />
          <AlertTitle className="font-medium text-yellow-600">Test Mode Active</AlertTitle>
          <AlertDescription className="text-yellow-700">
            You're in test mode. API requests will use test credentials and no real payments will be processed.
          </AlertDescription>
        </Alert>
      )}

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger 
            value="api-keys"
            className={activeTab === "api-keys" ? "text-[#1e8449]" : ""}
          >
            API Keys
          </TabsTrigger>
          <TabsTrigger 
            value="webhooks"
            className={activeTab === "webhooks" ? "text-[#1e8449]" : ""}
          >
            Webhooks
          </TabsTrigger>
          <TabsTrigger 
            value="logs"
            className={activeTab === "logs" ? "text-[#1e8449]" : ""}
          >
            Event Logs
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* API Keys Content */}
      <TabsContent value="api-keys" className="mt-0">
        <div className="grid gap-6">
          <Card className="bg-gradient-to-br from-green-500/5 to-yellow-500/5">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <KeyRound className="h-5 w-5 text-[#1e8449]" /> API Keys
              </CardTitle>
              <CardDescription>
                Your API keys give you access to PayAfric's API. Protect your secret key like a password.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Public Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-500">Public Key</Label>
                  <Badge variant="outline" className="font-normal bg-green-50 text-[#1e8449] border-green-200">
                    {showTestMode ? 'Test' : 'Live'}
                  </Badge>
                </div>
                <div className="flex">
                  <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-l-md px-3 py-2 text-gray-900 font-mono text-sm overflow-hidden">
                    {apiKeys.publicKey}
                  </div>
                  <Button 
                    variant="outline" 
                    className={`rounded-l-none ${copiedPublicKey ? 'bg-green-50 text-green-700 border-green-200' : 'border-gray-200'}`}
                    onClick={() => copyToClipboard(apiKeys.publicKey, 'public')}
                  >
                    {copiedPublicKey ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copiedPublicKey ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Created on {apiKeys.created} • Last used {apiKeys.lastUsed}
                </p>
              </div>

              {/* Secret Key */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label className="text-sm font-medium text-gray-500">Secret Key</Label>
                  <Badge variant="outline" className="font-normal bg-yellow-50 text-yellow-700 border-yellow-200">Restricted</Badge>
                </div>
                <div className="flex">
                  <div className="flex-1 flex items-center bg-gray-50 border border-gray-200 rounded-l-md px-3 py-2 text-gray-900 font-mono text-sm">
                    {showSecretKey 
                      ? apiKeys.secretKey 
                      : '••••••••••••••••••••••••••'}
                  </div>
                  <Button 
                    variant="outline" 
                    className="border-gray-200 border-r-0 rounded-none"
                    onClick={() => setShowSecretKey(!showSecretKey)}
                  >
                    {showSecretKey ? <EyeOffIcon className="h-4 w-4" /> : <EyeIcon className="h-4 w-4" />}
                  </Button>
                  <Button 
                    variant="outline" 
                    className={`rounded-l-none ${copiedSecretKey ? 'bg-green-50 text-green-700 border-green-200' : 'border-gray-200'}`}
                    onClick={() => {
                      copyToClipboard(apiKeys.secretKey, 'secret');
                      setShowSecretKey(true);
                    }}
                  >
                    {copiedSecretKey ? <CheckCircle2 className="h-4 w-4 mr-1" /> : <Copy className="h-4 w-4 mr-1" />}
                    {copiedSecretKey ? 'Copied!' : 'Copy'}
                  </Button>
                </div>
                <p className="text-xs text-gray-500">
                  Created on {apiKeys.created} • Last used {apiKeys.lastUsed}
                </p>
              </div>

              {/* Actions */}
              <div className="flex items-center gap-3 pt-2">
                <Button variant="outline" className="text-red-600 border-red-200 hover:bg-red-50 hover:text-red-700">
                  <RefreshCw className="h-4 w-4 mr-1" /> Rotate Keys
                </Button>
                <Button className="bg-[#1e8449] hover:bg-[#196f3d]">
                  <Terminal className="h-4 w-4 mr-1" /> API Documentation
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Sample API Request */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="h-5 w-5 text-[#1e8449]" /> Sample API Request
              </CardTitle>
              <CardDescription>
                Here's a sample request to get you started with the PayAfric API
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="bg-gray-900 text-gray-50 p-4 rounded-md font-mono text-sm overflow-x-auto">
                <pre>
{`curl https://api.payafric.com/v1/payments \\
  -X POST \\
  -H "Authorization: Bearer ${apiKeys.secretKey}" \\
  -H "Content-Type: application/json" \\
  -d '{
    "amount": 2000,
    "currency": "NGN",
    "payment_method": "mobile_money",
    "description": "Payment for Order #12345",
    "customer": {
      "email": "customer@example.com",
      "name": "John Doe",
      "phone": "+2349012345678"
    },
    "metadata": {
      "order_id": "12345"
    }
  }'`}
                </pre>
              </div>
              <div className="flex justify-end mt-3">
                <Button variant="outline" className="text-sm">
                  <Clipboard className="h-4 w-4 mr-1" /> Copy Code
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Webhooks Content */}
      <TabsContent value="webhooks" className="mt-0">
        <div className="space-y-6">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-medium">Webhook Endpoints</h2>
            <Button className="bg-[#1e8449] hover:bg-[#196f3d]">
              <Plus className="h-4 w-4 mr-1" /> Add Endpoint
            </Button>
          </div>

          {webhookEndpoints.map((webhook) => (
            <Card key={webhook.id} className={`bg-gradient-to-br ${
              webhook.status === 'active' 
                ? 'from-green-500/5 to-green-500/10' 
                : 'from-gray-100 to-gray-200'
            }`}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Globe className={`h-5 w-5 ${webhook.status === 'active' ? 'text-[#1e8449]' : 'text-gray-400'}`} />
                    <CardTitle className="text-base font-medium">{webhook.url}</CardTitle>
                  </div>
                  <Badge className={webhook.status === 'active' 
                    ? 'bg-green-100 text-green-800 hover:bg-green-100'
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-100'
                  }>
                    {webhook.status === 'active' ? 'Active' : 'Inactive'}
                  </Badge>
                </div>
                <CardDescription>
                  ID: {webhook.id} • {webhook.events.length} events
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div className="flex flex-wrap gap-2">
                    {webhook.events.map((event) => (
                      <Badge key={event} variant="outline" className="bg-white">
                        {event}
                      </Badge>
                    ))}
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center gap-1">
                      <Clock className="h-4 w-4" />
                      <span>Last fired: {webhook.lastFired}</span>
                    </div>
                    <div className={`flex items-center gap-1 ${
                      webhook.lastResponse.startsWith('200') 
                        ? 'text-green-600' 
                        : 'text-red-600'
                    }`}>
                      {webhook.lastResponse.startsWith('200') 
                        ? <CheckCircle2 className="h-4 w-4" />
                        : <AlertTriangle className="h-4 w-4" />
                      }
                      <span>Last response: {webhook.lastResponse}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <Button variant="outline" size="sm">
                      Edit
                    </Button>
                    <Button variant="outline" size="sm">
                      Send Test
                    </Button>
                    <Button variant="outline" size="sm" className="text-red-600 hover:bg-red-50 hover:text-red-700">
                      Delete
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}

          <Card className="bg-gradient-to-br from-yellow-50 to-yellow-100 border-yellow-200">
            <CardHeader className="pb-2">
              <div className="flex items-center gap-2">
                <ShieldAlert className="h-5 w-5 text-yellow-700" />
                <CardTitle className="text-base font-medium text-yellow-800">Webhook Signing Secret</CardTitle>
              </div>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-yellow-700 mb-3">
                We sign all webhook events we send to your endpoints using a signing secret. 
                Verify the signature to ensure events are coming from PayAfric.
              </p>
              
              <div className="flex items-center gap-3">
                <Input 
                  type="password" 
                  value="whsec_••••••••••••••••••••••"
                  readOnly
                  className="font-mono bg-white"
                />
                <Button variant="outline" className="bg-white border-yellow-200">
                  <Eye className="h-4 w-4 mr-1" /> Reveal
                </Button>
                <Button className="bg-yellow-600 hover:bg-yellow-700 text-white">
                  <RefreshCw className="h-4 w-4 mr-1" /> Rotate Secret
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>

      {/* Event Logs Content */}
      <TabsContent value="logs" className="mt-0">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5 text-[#1e8449]" /> API Event Logs
              </CardTitle>
              <CardDescription>
                Review all recent API events and webhook deliveries
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-md border">
                <div className="bg-gray-50 p-4 border-b">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Input
                        type="search"
                        placeholder="Search events..."
                        className="h-9 w-64"
                      />
                      <Button variant="outline" size="sm" className="h-9">
                        <Filter className="h-4 w-4 mr-1" /> Filters
                      </Button>
                    </div>
                    <div className="flex items-center gap-2">
                      <Button variant="outline" size="sm" className="h-9">
                        <RefreshCw className="h-4 w-4 mr-1" /> Refresh
                      </Button>
                      <Button variant="outline" size="sm" className="h-9">
                        <Download className="h-4 w-4 mr-1" /> Export
                      </Button>
                    </div>
                  </div>
                </div>
                
                <div className="p-4">
                  <div className="text-center py-10 text-gray-500">
                    <Lock className="w-12 h-12 mx-auto mb-3 text-gray-400" />
                    <h3 className="text-lg font-medium mb-1">API logs will appear here</h3>
                    <p className="max-w-md mx-auto">
                      Make API requests or use the SDK to see logs of your activity. Event logs are only available for the past 30 days.
                    </p>
                    <Button className="mt-4 bg-[#1e8449] hover:bg-[#196f3d]">
                      <Terminal className="h-4 w-4 mr-1" /> View API Documentation
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </TabsContent>
    </DashboardLayout>
  );
}
