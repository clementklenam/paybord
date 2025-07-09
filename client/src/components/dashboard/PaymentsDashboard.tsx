import { useState } from "react";
import { DashboardLayout } from "./DashboardLayout";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import {
  BarChart,
  ArrowUpRight,
  Download,
  CreditCard,
  DollarSign,
  MoreHorizontal,
  Search,
  Users,
  RefreshCcw,
  Plus,
} from "lucide-react";

// Mock data for the dashboard
const paymentsData = {
  totalVolume: 123456.78,
  successRate: 94.2,
  transactionCount: 1245,
  avgTransactionValue: 99.16,
  recentTransactions: [
    {
      id: "TX-78945-AB",
      date: "2025-05-09",
      customer: "John Doe",
      method: "Mobile Money",
      amount: 245.50,
      status: "success"
    },
    {
      id: "TX-78932-CD",
      date: "2025-05-08",
      customer: "Alice Smith",
      method: "Card",
      amount: 129.99,
      status: "success"
    },
    {
      id: "TX-78912-EF",
      date: "2025-05-08",
      customer: "Robert Johnson",
      method: "Bank Transfer",
      amount: 1499.00,
      status: "processing"
    },
    {
      id: "TX-78905-GH",
      date: "2025-05-07",
      customer: "Emily Brown",
      method: "Mobile Money",
      amount: 75.25,
      status: "success"
    },
    {
      id: "TX-78899-IJ",
      date: "2025-05-07",
      customer: "Michael Wilson",
      method: "Card",
      amount: 350.00,
      status: "failed"
    }
  ],
  paymentMethodBreakdown: [
    { name: "Mobile Money", percentage: 42 },
    { name: "Card Payments", percentage: 35 },
    { name: "Bank Transfers", percentage: 18 },
    { name: "Other", percentage: 5 }
  ],
  regionalDistribution: [
    { name: "Nigeria", percentage: 32 },
    { name: "Kenya", percentage: 24 },
    { name: "South Africa", percentage: 18 },
    { name: "Ghana", percentage: 14 },
    { name: "Other countries", percentage: 12 }
  ]
};

export function PaymentsDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [timeRange, setTimeRange] = useState("30d");

  return (
    <DashboardLayout>
      {/* Header */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-6">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Payments</h1>
          <p className="text-gray-500">
            Manage and track your payment transactions across Africa
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gray-300"
          >
            <RefreshCcw className="h-4 w-4 mr-1" /> Refresh
          </Button>
          <Button
            variant="outline"
            size="sm"
            className="h-9 border-gray-300"
          >
            <Download className="h-4 w-4 mr-1" /> Export
          </Button>
          <Button className="bg-[#1e8449] hover:bg-[#196f3d] h-9">
            <Plus className="h-4 w-4 mr-1" /> New Payment
          </Button>
        </div>
      </div>

      {/* Tabs Navigation */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="mb-6">
        <TabsList className="grid grid-cols-3 w-full max-w-md">
          <TabsTrigger 
            value="overview"
            className={activeTab === "overview" ? "text-gray-900 bg-gray-100" : ""}
          >
            Overview
          </TabsTrigger>
          <TabsTrigger 
            value="transactions"
            className={activeTab === "transactions" ? "text-gray-900 bg-gray-100" : ""}
          >
            Transactions
          </TabsTrigger>
          <TabsTrigger 
            value="settings"
            className={activeTab === "settings" ? "text-gray-900 bg-gray-100" : ""}
          >
            Settings
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {/* Time Period Selection */}
      <div className="flex justify-end mb-6">
        <div className="flex items-center gap-1 bg-gray-100 rounded-md p-0.5">
          <Button 
            variant="ghost" 
            size="sm" 
            className={timeRange === "24h" ? "bg-white text-gray-900" : "text-gray-600"}
            onClick={() => setTimeRange("24h")}
          >
            24h
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={timeRange === "7d" ? "bg-white text-gray-900" : "text-gray-600"}
            onClick={() => setTimeRange("7d")}
          >
            7d
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={timeRange === "30d" ? "bg-white text-gray-900" : "text-gray-600"}
            onClick={() => setTimeRange("30d")}
          >
            30d
          </Button>
          <Button 
            variant="ghost" 
            size="sm" 
            className={timeRange === "90d" ? "bg-white text-gray-900" : "text-gray-600"}
            onClick={() => setTimeRange("90d")}
          >
            90d
          </Button>
        </div>
      </div>

      {/* Overview Stats Cards */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-6">
        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Total Volume
            </CardTitle>
            <DollarSign className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${paymentsData.totalVolume.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +8.7% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Success Rate
            </CardTitle>
            <CreditCard className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{paymentsData.successRate}%</div>
            <div className="mt-3 h-2 w-full bg-gray-100 rounded-full overflow-hidden">
              <div
                className="h-full bg-gray-600 rounded-full"
                style={{ width: `${paymentsData.successRate}%` }}
              ></div>
            </div>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Transaction Count
            </CardTitle>
            <BarChart className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{paymentsData.transactionCount.toLocaleString()}</div>
            <p className="text-xs text-gray-600 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +12.3% from last period
            </p>
          </CardContent>
        </Card>

        <Card className="bg-gradient-to-br from-gray-50/50 to-gray-100/30 hover:from-gray-100/50 hover:to-gray-200/40 transition-all border-gray-200 hover:border-gray-300">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-gray-700">
              Avg. Transaction
            </CardTitle>
            <Users className="h-4 w-4 text-gray-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              ${paymentsData.avgTransactionValue.toLocaleString(undefined, { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
            </div>
            <p className="text-xs text-gray-600 mt-1 flex items-center">
              <ArrowUpRight className="h-3 w-3 mr-1" /> +3.2% from last period
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Distribution Charts */}
      <div className="grid gap-6 md:grid-cols-2 mb-6">
        <Card className="bg-gradient-to-br from-gray-50/5 to-gray-100/5 hover:from-gray-100/10 hover:to-gray-200/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">
              Payment Methods
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {paymentsData.paymentMethodBreakdown.map((method) => (
                  <div key={method.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${
                        method.name === "Mobile Money" ? "bg-gray-600" :
                        method.name === "Card Payments" ? "bg-gray-800" :
                        method.name === "Bank Transfers" ? "bg-gray-400" :
                        "bg-gray-300"
                      }`}></div>
                      <span className="text-sm">{method.name}</span>
                    </div>
                    <span className="text-sm font-medium">{method.percentage}%</span>
                  </div>
                ))}
              </div>
              
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="flex h-full">
                  {paymentsData.paymentMethodBreakdown.map((method) => (
                    <div 
                      key={method.name}
                      className={`h-full ${
                        method.name === "Mobile Money" ? "bg-gray-600" :
                        method.name === "Card Payments" ? "bg-gray-800" :
                        method.name === "Bank Transfers" ? "bg-gray-400" :
                        "bg-gray-300"
                      }`} 
                      style={{ width: `${method.percentage}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card className="bg-gradient-to-br from-gray-50/5 to-gray-100/5 hover:from-gray-100/10 hover:to-gray-200/10 transition-all">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-md font-medium">
              Regional Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="space-y-2">
                {paymentsData.regionalDistribution.map((region) => (
                  <div key={region.name} className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <div className={`h-3 w-3 rounded-full ${
                        region.name === "Nigeria" ? "bg-gray-600" :
                        region.name === "Kenya" ? "bg-gray-800" :
                        region.name === "South Africa" ? "bg-gray-400" :
                        region.name === "Ghana" ? "bg-gray-700" :
                        "bg-gray-300"
                      }`}></div>
                      <span className="text-sm">{region.name}</span>
                    </div>
                    <span className="text-sm font-medium">{region.percentage}%</span>
                  </div>
                ))}
              </div>
              
              <div className="h-2 w-full bg-gray-100 rounded-full overflow-hidden">
                <div className="flex h-full">
                  {paymentsData.regionalDistribution.map((region) => (
                    <div 
                      key={region.name}
                      className={`h-full ${
                        region.name === "Nigeria" ? "bg-gray-600" :
                        region.name === "Kenya" ? "bg-gray-800" :
                        region.name === "South Africa" ? "bg-gray-400" :
                        region.name === "Ghana" ? "bg-gray-700" :
                        "bg-gray-300"
                      }`} 
                      style={{ width: `${region.percentage}%` }}
                    ></div>
                  ))}
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Transactions */}
      <Card className="mb-6">
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div className="flex items-center gap-3">
            <CardTitle className="text-lg font-medium">Recent Transactions</CardTitle>
            <Badge className="bg-[#1e8449]">{paymentsData.recentTransactions.length}</Badge>
          </div>
          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-gray-500" />
              <Input
                type="search"
                placeholder="Search transactions..."
                className="w-56 pl-8 h-9 rounded-lg border-gray-300 focus:border-[#1e8449] focus:ring-[#1e8449] focus:ring-opacity-50"
              />
            </div>
            <Button variant="ghost" className="text-sm text-[#1e8449]">View all</Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="text-left border-b border-gray-200">
                  <th className="pb-3 font-medium text-gray-500">Transaction ID</th>
                  <th className="pb-3 font-medium text-gray-500">Date</th>
                  <th className="pb-3 font-medium text-gray-500">Customer</th>
                  <th className="pb-3 font-medium text-gray-500">Method</th>
                  <th className="pb-3 font-medium text-gray-500">Amount</th>
                  <th className="pb-3 font-medium text-gray-500">Status</th>
                  <th className="pb-3 font-medium text-gray-500"></th>
                </tr>
              </thead>
              <tbody>
                {paymentsData.recentTransactions.map((tx) => (
                  <tr 
                    key={tx.id} 
                    className={`hover:bg-gray-50`}
                  >
                    <td className="py-3 text-gray-900">{tx.id}</td>
                    <td className="py-3 text-gray-900">{tx.date}</td>
                    <td className="py-3 text-gray-900">{tx.customer}</td>
                    <td className="py-3">
                      <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800">
                        {tx.method}
                      </span>
                    </td>
                    <td className="py-3 text-gray-900">${tx.amount.toFixed(2)}</td>
                    <td className="py-3">
                      <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                        tx.status === "success"
                          ? "bg-green-100 text-green-800"
                          : tx.status === "processing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-red-100 text-red-800"
                      }`}>
                        {tx.status === "success"
                          ? "Successful"
                          : tx.status === "processing"
                          ? "Processing"
                          : "Failed"}
                      </span>
                    </td>
                    <td className="py-3">
                      <Button variant="ghost" size="icon">
                        <MoreHorizontal className="h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </DashboardLayout>
  );
}
