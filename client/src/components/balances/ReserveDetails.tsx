import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { AlertCircle, HelpCircle, ArrowUpRight, Clock, Calendar, Info, ShieldCheck } from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface ReserveDetailsProps {
  reserveData: {
    amount: number;
    currency: string;
    lastUpdated: string;
    reason: string;
  };
  currency: string;
}

function ReserveDetails({ reserveData, currency }: ReserveDetailsProps) {
  const [activeTab, setActiveTab] = useState("overview");
  
  // Mock reserve release schedule
  const releaseSchedule = [
    { id: "rel_1", amount: 500.00, currency: "USD", releaseDate: "2025-05-20T00:00:00Z", status: "scheduled" },
    { id: "rel_2", amount: 500.00, currency: "USD", releaseDate: "2025-05-27T00:00:00Z", status: "scheduled" },
    { id: "rel_3", amount: 500.00, currency: "USD", releaseDate: "2025-06-03T00:00:00Z", status: "scheduled" },
  ];
  
  // Mock reserve history
  const reserveHistory = [
    { id: "res_1", amount: 1500.00, currency: "USD", createdDate: "2025-05-05T00:00:00Z", reason: "Dispute reserve", status: "active" },
    { id: "res_2", amount: 1000.00, currency: "USD", createdDate: "2025-04-10T00:00:00Z", reason: "New account", status: "released", releasedDate: "2025-05-01T00:00:00Z" },
    { id: "res_3", amount: 750.00, currency: "USD", createdDate: "2025-03-15T00:00:00Z", reason: "High-risk transaction", status: "released", releasedDate: "2025-04-15T00:00:00Z" },
  ];
  
  // Mock dispute data
  const disputeData = [
    { id: "dp_1", amount: 499.99, currency: "USD", createdDate: "2025-05-06T14:10:05Z", status: "needs_response", dueDate: "2025-05-16T14:10:05Z", customerName: "Alex Wilson" },
  ];
  
  const getStatusBadge = (status: string) => {
    switch (status) {
      case "active":
        return <Badge className="bg-blue-100 text-blue-800">Active</Badge>;
      case "released":
        return <Badge className="bg-emerald-100 text-emerald-800">Released</Badge>;
      case "scheduled":
        return <Badge className="bg-amber-100 text-amber-800">Scheduled</Badge>;
      case "needs_response":
        return <Badge className="bg-rose-100 text-rose-800">Needs Response</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };
  
  return (
    <div className="space-y-8">
      {/* Reserve Overview Card */}
      <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Current Reserve</CardTitle>
            <CardDescription>
              Funds temporarily held as security for potential disputes and chargebacks
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <ShieldCheck className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reserved Amount</p>
                    <p className="text-2xl font-bold">
                      {formatCurrency(reserveData.amount, currency)}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <Info className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Reserve Reason</p>
                    <p className="text-lg font-semibold">
                      {reserveData.reason}
                    </p>
                  </div>
                </div>
                
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <Calendar className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Next Release</p>
                    <p className="text-lg font-semibold">
                      {new Date(releaseSchedule[0].releaseDate).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4 md:w-1/3">
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span>Reserve progress</span>
                    <span className="font-medium">33% complete</span>
                  </div>
                  <Progress value={33} className="h-2" />
                </div>
                
                <Button variant="outline" className="w-full">
                  View Release Schedule
                </Button>
                
                <Button variant="outline" className="w-full flex items-center justify-center gap-2">
                  <HelpCircle className="h-4 w-4" />
                  <span>Learn About Reserves</span>
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>
      
      {/* Reserve Details Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full sm:w-auto grid-cols-3 h-10 mb-8">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="schedule">Release Schedule</TabsTrigger>
          <TabsTrigger value="history">Reserve History</TabsTrigger>
        </TabsList>
        
        <TabsContent value="overview">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">About Your Reserve</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="bg-blue-50 p-4 rounded-lg border border-blue-100">
                  <div className="flex items-start gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-blue-800">What is a reserve?</p>
                      <p className="text-sm text-blue-700 mt-1">
                        A reserve is a portion of your funds that is held temporarily to cover potential disputes, chargebacks, or other risks. The reserve is gradually released according to a schedule.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">Why do I have a reserve?</h3>
                  <p className="text-sm text-gray-600">
                    Your account has a reserve due to:
                  </p>
                  <ul className="text-sm text-gray-600 space-y-2 list-disc pl-5">
                    <li>Recent dispute activity</li>
                    <li>High-risk industry or transaction types</li>
                    <li>Limited processing history</li>
                  </ul>
                </div>
                
                <div className="space-y-3">
                  <h3 className="font-medium">How reserves are released</h3>
                  <p className="text-sm text-gray-600">
                    Your reserve is being released in 3 equal installments over the next 3 weeks. Each release will add funds to your available balance automatically.
                  </p>
                </div>
              </CardContent>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle className="text-lg font-semibold">Disputes Requiring Action</CardTitle>
              </CardHeader>
              <CardContent>
                {disputeData.length > 0 ? (
                  <div className="space-y-4">
                    {disputeData.map((dispute) => (
                      <div key={dispute.id} className="p-4 rounded-lg border border-rose-200 bg-rose-50">
                        <div className="flex items-start justify-between">
                          <div>
                            <div className="flex items-center gap-2">
                              <Badge className="bg-rose-100 text-rose-800">
                                Needs Response
                              </Badge>
                              <p className="text-sm text-gray-500">
                                Due by {new Date(dispute.dueDate).toLocaleDateString('en-US', {
                                  month: 'short',
                                  day: 'numeric'
                                })}
                              </p>
                            </div>
                            <p className="font-medium mt-2">
                              {formatCurrency(dispute.amount, dispute.currency)} dispute from {dispute.customerName}
                            </p>
                            <p className="text-sm text-gray-500 mt-1">
                              Dispute ID: {dispute.id}
                            </p>
                          </div>
                          <Button size="sm" className="bg-rose-600 hover:bg-rose-700">
                            Respond Now
                          </Button>
                        </div>
                      </div>
                    ))}
                    
                    <div className="text-sm text-gray-600 mt-2">
                      <p>
                        Responding to disputes promptly can help reduce your reserve amount and release schedule.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div className="flex flex-col items-center justify-center py-8 text-center">
                    <div className="p-3 bg-emerald-100 rounded-full mb-3">
                      <ShieldCheck className="h-6 w-6 text-emerald-600" />
                    </div>
                    <p className="font-medium">No disputes requiring action</p>
                    <p className="text-sm text-gray-500 mt-1">
                      You have no pending disputes that need your attention.
                    </p>
                  </div>
                )}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
        
        <TabsContent value="schedule">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Release Schedule</CardTitle>
              <CardDescription>
                Your reserve is being released according to the following schedule
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Release ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Release Date</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Countdown</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {releaseSchedule.map((release) => {
                    const releaseDate = new Date(release.releaseDate);
                    const today = new Date();
                    const diffTime = Math.abs(releaseDate.getTime() - today.getTime());
                    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
                    
                    return (
                      <TableRow key={release.id}>
                        <TableCell className="font-mono text-xs">{release.id}</TableCell>
                        <TableCell className="font-medium">
                          {formatCurrency(release.amount, release.currency)}
                        </TableCell>
                        <TableCell>
                          {releaseDate.toLocaleDateString('en-US', {
                            weekday: 'short',
                            month: 'short',
                            day: 'numeric',
                            year: 'numeric'
                          })}
                        </TableCell>
                        <TableCell>
                          {getStatusBadge(release.status)}
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center gap-1.5">
                            <Clock className="h-4 w-4 text-amber-500" />
                            <span>{diffDays} days remaining</span>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })}
                </TableBody>
              </Table>
              
              <div className="mt-6 space-y-4">
                <div className="bg-amber-50 p-4 rounded-lg border border-amber-100">
                  <div className="flex items-start gap-3">
                    <Info className="h-5 w-5 text-amber-600 mt-0.5" />
                    <div>
                      <p className="font-medium text-amber-800">Release Policy</p>
                      <p className="text-sm text-amber-700 mt-1">
                        Reserve releases are processed automatically on the scheduled date. Funds will become available in your balance immediately after release.
                      </p>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center justify-between">
                  <p className="text-sm text-gray-500">
                    Total amount scheduled for release:
                  </p>
                  <p className="font-medium">
                    {formatCurrency(
                      releaseSchedule.reduce((sum, item) => sum + item.amount, 0),
                      currency
                    )}
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="history">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Reserve History</CardTitle>
              <CardDescription>
                History of reserves applied to your account
              </CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Reserve ID</TableHead>
                    <TableHead>Amount</TableHead>
                    <TableHead>Created Date</TableHead>
                    <TableHead>Reason</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Released Date</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {reserveHistory.map((reserve) => (
                    <TableRow key={reserve.id}>
                      <TableCell className="font-mono text-xs">{reserve.id}</TableCell>
                      <TableCell className="font-medium">
                        {formatCurrency(reserve.amount, reserve.currency)}
                      </TableCell>
                      <TableCell>
                        {new Date(reserve.createdDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </TableCell>
                      <TableCell>{reserve.reason}</TableCell>
                      <TableCell>
                        {getStatusBadge(reserve.status)}
                      </TableCell>
                      <TableCell>
                        {reserve.releasedDate ? new Date(reserve.releasedDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        }) : '—'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
              
              <div className="mt-6">
                <Button variant="outline" className="flex items-center gap-2">
                  <ArrowUpRight className="h-4 w-4" />
                  <span>View Detailed Reports</span>
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
      
      {/* Educational Section */}
      <Card className="bg-gradient-to-br from-blue-50 to-indigo-50 border-0">
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Understanding Reserves</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-blue-100 rounded-full mb-4">
                  <ShieldCheck className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-medium mb-2">Why Reserves Exist</h3>
                <p className="text-sm text-gray-600">
                  Reserves help protect against financial risks like chargebacks and disputes, ensuring the platform remains secure for all users.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-amber-100 rounded-full mb-4">
                  <Clock className="h-6 w-6 text-amber-600" />
                </div>
                <h3 className="font-medium mb-2">How Reserves Work</h3>
                <p className="text-sm text-gray-600">
                  A percentage of your processing volume is temporarily held and released according to a predetermined schedule.
                </p>
              </div>
            </div>
            
            <div className="bg-white p-5 rounded-lg shadow-sm">
              <div className="flex flex-col items-center text-center">
                <div className="p-3 bg-emerald-100 rounded-full mb-4">
                  <ArrowUpRight className="h-6 w-6 text-emerald-600" />
                </div>
                <h3 className="font-medium mb-2">Reducing Your Reserve</h3>
                <p className="text-sm text-gray-600">
                  Maintain a low dispute rate, process consistently, and build a positive payment history to potentially reduce reserve requirements.
                </p>
              </div>
            </div>
          </div>
          
          <div className="mt-6 text-center">
            <Button variant="outline" className="bg-white">
              Learn More About Reserves
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

export default ReserveDetails;
