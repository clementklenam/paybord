import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowUpRight, TrendingUp, TrendingDown, Clock, AlertCircle, DollarSign, Calendar } from "lucide-react";
import { formatCurrency } from "@/lib/utils";
import { useState } from "react";

interface BalanceOverviewProps {
  balanceData: {
    available: {
      amount: number;
      currency: string;
      lastUpdated: string;
      trend: number;
    };
    pending: {
      amount: number;
      currency: string;
      lastUpdated: string;
      trend: number;
    };
    reserved: {
      amount: number;
      currency: string;
      lastUpdated: string;
      reason: string;
    };
    payouts: {
      scheduled: {
        amount: number;
        currency: string;
        date: string;
      };
      lastPayout: {
        amount: number;
        currency: string;
        date: string;
        status: string;
      };
    };
  };
  currency: string;
}

export function BalanceOverview({ balanceData, currency }: BalanceOverviewProps) {
  const totalBalance = balanceData.available.amount + balanceData.pending.amount + balanceData.reserved.amount;
  const availablePercentage = (balanceData.available.amount / totalBalance) * 100;
  const pendingPercentage = (balanceData.pending.amount / totalBalance) * 100;
  const reservedPercentage = (balanceData.reserved.amount / totalBalance) * 100;
  
  // Format dates
  const nextPayoutDate = new Date(balanceData.payouts.scheduled.date);
  const lastPayoutDate = new Date(balanceData.payouts.lastPayout.date);
  
  return (
    <div className="space-y-8">
      {/* Main Balance Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Available Balance */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-50/50 to-transparent" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                Available Balance
                <div className="ml-2 px-2 py-0.5 bg-emerald-50 rounded-full">
                  <span className="text-xs font-medium text-emerald-600">
                    {balanceData.available.trend > 0 ? "+" : ""}{balanceData.available.trend}%
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(balanceData.available.amount, currency)}
                  </h2>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500">
                    Last updated: {new Date(balanceData.available.lastUpdated).toLocaleString()}
                  </span>
                  {balanceData.available.trend > 0 ? (
                    <TrendingUp className="h-4 w-4 text-emerald-500" />
                  ) : (
                    <TrendingDown className="h-4 w-4 text-rose-500" />
                  )}
                </div>
                
                <Button variant="outline" className="w-full mt-4 text-emerald-600 border-emerald-200 hover:bg-emerald-50">
                  Withdraw Funds
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
        
        {/* Pending Balance */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-amber-50/50 to-transparent" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                Pending Balance
                <div className="ml-2 px-2 py-0.5 bg-amber-50 rounded-full">
                  <span className="text-xs font-medium text-amber-600">
                    Processing
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(balanceData.pending.amount, currency)}
                  </h2>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <Clock className="h-4 w-4 mr-1 text-amber-500" />
                    Estimated availability: 2-5 business days
                  </span>
                </div>
                
                <Button variant="outline" className="w-full mt-4 text-amber-600 border-amber-200 hover:bg-amber-50">
                  View Pending Transactions
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
        
        {/* Reserved Balance */}
        <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
          <div className="relative">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-500 flex items-center">
                Reserved Balance
                <div className="ml-2 px-2 py-0.5 bg-blue-50 rounded-full">
                  <span className="text-xs font-medium text-blue-600">
                    {balanceData.reserved.reason}
                  </span>
                </div>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-baseline">
                  <h2 className="text-3xl font-bold text-gray-900">
                    {formatCurrency(balanceData.reserved.amount, currency)}
                  </h2>
                </div>
                
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-500 flex items-center">
                    <AlertCircle className="h-4 w-4 mr-1 text-blue-500" />
                    Funds held as security reserve
                  </span>
                </div>
                
                <Button variant="outline" className="w-full mt-4 text-blue-600 border-blue-200 hover:bg-blue-50">
                  Learn About Reserves
                </Button>
              </div>
            </CardContent>
          </div>
        </Card>
      </div>
      
      {/* Balance Distribution */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Balance Distribution</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-6">
            <div className="h-4 w-full bg-gray-100 rounded-full overflow-hidden">
              <div className="flex h-full">
                <div 
                  className="bg-emerald-500 h-full" 
                  style={{ width: `${availablePercentage}%` }}
                />
                <div 
                  className="bg-amber-500 h-full" 
                  style={{ width: `${pendingPercentage}%` }}
                />
                <div 
                  className="bg-blue-500 h-full" 
                  style={{ width: `${reservedPercentage}%` }}
                />
              </div>
            </div>
            
            <div className="grid grid-cols-3 gap-4">
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-emerald-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Available</p>
                  <p className="text-sm text-gray-500">{availablePercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-amber-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Pending</p>
                  <p className="text-sm text-gray-500">{pendingPercentage.toFixed(1)}%</p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <div className="w-3 h-3 bg-blue-500 rounded-full" />
                <div>
                  <p className="text-sm font-medium">Reserved</p>
                  <p className="text-sm text-gray-500">{reservedPercentage.toFixed(1)}%</p>
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
      
      {/* Payout Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Next Scheduled Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(balanceData.payouts.scheduled.amount, currency)}
                </p>
                <div className="flex items-center mt-2 text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{nextPayoutDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                Modify Schedule
              </Button>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Last Payout</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-2xl font-bold">
                  {formatCurrency(balanceData.payouts.lastPayout.amount, currency)}
                </p>
                <div className="flex items-center mt-2 text-gray-500">
                  <Calendar className="h-4 w-4 mr-2" />
                  <span>{lastPayoutDate.toLocaleDateString('en-US', { 
                    weekday: 'long',
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}</span>
                </div>
                <div className="mt-1">
                  <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-emerald-100 text-emerald-800">
                    {balanceData.payouts.lastPayout.status}
                  </span>
                </div>
              </div>
              <Button variant="outline" size="sm">
                View Details
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
      
      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Quick Actions</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
              <DollarSign className="h-6 w-6 text-emerald-500" />
              <span>Initiate Payout</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
              <Calendar className="h-6 w-6 text-blue-500" />
              <span>Schedule Payouts</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
              <ArrowUpRight className="h-6 w-6 text-purple-500" />
              <span>View Statements</span>
            </Button>
            <Button variant="outline" className="h-auto py-6 flex flex-col items-center justify-center gap-3">
              <AlertCircle className="h-6 w-6 text-amber-500" />
              <span>Manage Reserves</span>
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
