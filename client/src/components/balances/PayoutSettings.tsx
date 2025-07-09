import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Separator } from "@/components/ui/separator";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import {
  Calendar, DollarSign, Bank as BankIcon, CreditCard, ChevronRight
} from "lucide-react";
import { formatCurrency } from "@/lib/utils";

interface PayoutSettingsProps {
  payoutData: {
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
  balanceData: any; // Using any to avoid unused variable warnings
  currency: string;
}

export function PayoutSettings({ payoutData, balanceData, currency }: PayoutSettingsProps) {
  const [payoutFrequency, setPayoutFrequency] = useState("automatic");
  const [payoutThreshold, setPayoutThreshold] = useState("1000");
  const [payoutDay, setPayoutDay] = useState("monday");
  const [autoPayouts, setAutoPayouts] = useState(true);
  const [instantPayouts, setInstantPayouts] = useState(false);

  // Mock payout history data
  const payoutHistory = [
    { id: "po_1K2MkiP", amount: 8750.25, currency: "USD", date: "2025-05-01T10:15:30Z", status: "completed", destination: "Bank account (•••• 1234)" },
    { id: "po_1J9LkiQ", amount: 6320.80, currency: "USD", date: "2025-04-15T09:30:20Z", status: "completed", destination: "Bank account (•••• 1234)" },
    { id: "po_1I8JkiR", amount: 4150.50, currency: "USD", date: "2025-04-01T11:45:10Z", status: "completed", destination: "Bank account (•••• 1234)" },
    { id: "po_1H7IkiS", amount: 9250.75, currency: "USD", date: "2025-03-15T08:20:45Z", status: "completed", destination: "Bank account (•••• 1234)" },
  ];

  // Mock payout methods
  const payoutMethods = [
    { id: "pm_1234", type: "bank_account", last4: "1234", bankName: "Chase", isDefault: true },
    { id: "pm_5678", type: "card", last4: "5678", brand: "Visa", isDefault: false },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case "completed":
        return <Badge className="bg-emerald-100 text-emerald-800">Completed</Badge>;
      case "pending":
        return <Badge className="bg-amber-100 text-amber-800">Pending</Badge>;
      case "failed":
        return <Badge className="bg-rose-100 text-rose-800">Failed</Badge>;
      default:
        return <Badge className="bg-gray-100 text-gray-800">{status}</Badge>;
    }
  };

  return (
    <div className="space-y-8">
      {/* Next Payout Card */}
      <Card className="bg-white border-0 shadow-sm hover:shadow-md transition-all duration-200 overflow-hidden">
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 to-transparent" />
          <CardHeader>
            <CardTitle className="text-lg font-semibold">Next Scheduled Payout</CardTitle>
            <CardDescription>Your next automatic payout is scheduled for:</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-6">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-full">
                    <Calendar className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Date</p>
                    <p className="text-lg font-semibold">
                      {new Date(payoutData.scheduled.date).toLocaleDateString('en-US', {
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-emerald-100 rounded-full">
                    <DollarSign className="h-6 w-6 text-emerald-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Amount</p>
                    <p className="text-lg font-semibold">
                      {formatCurrency(payoutData.scheduled.amount, currency)}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-full">
                    <BankIcon className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-500">Destination</p>
                    <p className="text-lg font-semibold">
                      Bank account (•••• 1234)
                    </p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <Button className="w-full bg-blue-600 hover:bg-blue-700">
                  Instant Payout Now
                </Button>
                <Button variant="outline" className="w-full">
                  Modify Schedule
                </Button>
                <Button variant="outline" className="w-full">
                  Skip This Payout
                </Button>
              </div>
            </div>
          </CardContent>
        </div>
      </Card>

      {/* Payout Settings */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Payout Settings</CardTitle>
              <CardDescription>Configure how and when you receive your funds</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="space-y-4">
                <h3 className="text-sm font-medium">Payout Schedule</h3>
                <RadioGroup value={payoutFrequency} onValueChange={setPayoutFrequency} className="space-y-3">
                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="automatic" id="automatic" />
                    <div className="space-y-1">
                      <Label htmlFor="automatic" className="font-medium">Automatic (Recommended)</Label>
                      <p className="text-sm text-gray-500">
                        Automatically receive payouts when your balance reaches the threshold
                      </p>

                      {payoutFrequency === "automatic" && (
                        <div className="mt-3 space-y-3">
                          <div className="flex items-center gap-3">
                            <Label className="w-32 text-sm">Threshold:</Label>
                            <div className="flex-1 relative">
                              <DollarSign className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-500" />
                              <Input
                                value={payoutThreshold}
                                onChange={(e) => setPayoutThreshold(e.target.value)}
                                className="pl-9"
                              />
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="daily" id="daily" />
                    <div className="space-y-1">
                      <Label htmlFor="daily" className="font-medium">Daily</Label>
                      <p className="text-sm text-gray-500">
                        Receive payouts every day at the end of the day
                      </p>
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="weekly" id="weekly" />
                    <div className="space-y-1">
                      <Label htmlFor="weekly" className="font-medium">Weekly</Label>
                      <p className="text-sm text-gray-500">
                        Receive payouts once a week
                      </p>

                      {payoutFrequency === "weekly" && (
                        <div className="mt-3">
                          <Select value={payoutDay} onValueChange={setPayoutDay}>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select day" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="monday">Monday</SelectItem>
                              <SelectItem value="tuesday">Tuesday</SelectItem>
                              <SelectItem value="wednesday">Wednesday</SelectItem>
                              <SelectItem value="thursday">Thursday</SelectItem>
                              <SelectItem value="friday">Friday</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="monthly" id="monthly" />
                    <div className="space-y-1">
                      <Label htmlFor="monthly" className="font-medium">Monthly</Label>
                      <p className="text-sm text-gray-500">
                        Receive payouts once a month
                      </p>

                      {payoutFrequency === "monthly" && (
                        <div className="mt-3">
                          <Select>
                            <SelectTrigger className="w-full">
                              <SelectValue placeholder="Select day of month" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="1">1st of month</SelectItem>
                              <SelectItem value="15">15th of month</SelectItem>
                              <SelectItem value="last">Last day of month</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="flex items-start space-x-3">
                    <RadioGroupItem value="manual" id="manual" />
                    <div className="space-y-1">
                      <Label htmlFor="manual" className="font-medium">Manual</Label>
                      <p className="text-sm text-gray-500">
                        Only receive payouts when you manually request them
                      </p>
                    </div>
                  </div>
                </RadioGroup>
              </div>

              <Separator />

              <div className="space-y-4">
                <h3 className="text-sm font-medium">Additional Options</h3>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Automatic Payouts</Label>
                    <p className="text-sm text-gray-500">
                      Enable automatic payouts based on your schedule
                    </p>
                  </div>
                  <Switch
                    checked={autoPayouts}
                    onCheckedChange={setAutoPayouts}
                  />
                </div>

                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label className="font-medium">Instant Payouts</Label>
                    <p className="text-sm text-gray-500">
                      Enable instant payouts for a 1% fee (max $5)
                    </p>
                  </div>
                  <Switch
                    checked={instantPayouts}
                    onCheckedChange={setInstantPayouts}
                  />
                </div>
              </div>

              <div className="pt-4">
                <Button>Save Settings</Button>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <Card>
            <CardHeader>
              <CardTitle className="text-lg font-semibold">Payout Methods</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {payoutMethods.map((method) => (
                <div
                  key={method.id}
                  className={`p-4 rounded-lg border ${method.isDefault ? 'border-blue-200 bg-blue-50' : 'border-gray-200'}`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      {method.type === "bank_account" ? (
                        <BankIcon className="h-5 w-5 text-blue-600" />
                      ) : (
                        <CreditCard className="h-5 w-5 text-purple-600" />
                      )}
                      <div>
                        <p className="font-medium">
                          {method.type === "bank_account" ? method.bankName : method.brand}
                        </p>
                        <p className="text-sm text-gray-500">
                          •••• {method.last4}
                        </p>
                        {method.isDefault && (
                          <Badge variant="outline" className="mt-1 text-blue-600 border-blue-200">
                            Default
                          </Badge>
                        )}
                      </div>
                    </div>
                    <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                      <ChevronRight className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}

              <Button variant="outline" className="w-full">
                Add Payment Method
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>

      {/* Payout History */}
      <Card>
        <CardHeader>
          <CardTitle className="text-lg font-semibold">Payout History</CardTitle>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Payout ID</TableHead>
                <TableHead>Amount</TableHead>
                <TableHead>Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead>Destination</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {payoutHistory.map((payout) => (
                <TableRow key={payout.id}>
                  <TableCell className="font-mono text-xs">{payout.id}</TableCell>
                  <TableCell className="font-medium">
                    {formatCurrency(payout.amount, payout.currency)}
                  </TableCell>
                  <TableCell>
                    {new Date(payout.date).toLocaleDateString('en-US', {
                      month: 'short',
                      day: 'numeric',
                      year: 'numeric'
                    })}
                  </TableCell>
                  <TableCell>
                    {getStatusBadge(payout.status)}
                  </TableCell>
                  <TableCell>{payout.destination}</TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm">
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
