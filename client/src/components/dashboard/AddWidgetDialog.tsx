import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { TrendingUp, Users, AlertCircle, DollarSign } from "lucide-react";

interface AddWidgetDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onAddWidget: (widgetType: string) => void;
}

interface WidgetOption {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
}

export function AddWidgetDialog({ open, onOpenChange, onAddWidget }: AddWidgetDialogProps) {
  const widgetOptions: WidgetOption[] = [
    {
      id: "grossVolume",
      name: "Gross Volume",
      description: "Track your total gross volume over time",
      icon: <DollarSign className="h-5 w-5" />
    },
    {
      id: "netVolume",
      name: "Net Volume",
      description: "Track your net volume after fees",
      icon: <TrendingUp className="h-5 w-5" />
    },
    {
      id: "newCustomers",
      name: "New Customers",
      description: "Monitor new customer acquisition",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "topCustomers",
      name: "Top Customers",
      description: "See your highest spending customers",
      icon: <Users className="h-5 w-5" />
    },
    {
      id: "failedPayments",
      name: "Failed Payments",
      description: "Track payment failures and issues",
      icon: <AlertCircle className="h-5 w-5" />
    }
  ];

  const handleAddWidget = (widgetType: string) => {
    onAddWidget(widgetType);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>Add Widget</DialogTitle>
        </DialogHeader>
        <div className="grid gap-4 py-4">
          {widgetOptions.map((option) => (
            <div
              key={option.id}
              className="flex items-center p-3 rounded-lg hover:bg-gray-100 cursor-pointer"
              onClick={() => handleAddWidget(option.id)}
            >
              <div className="mr-4 p-2 rounded-full bg-primary/10">
                {option.icon}
              </div>
              <div>
                <h3 className="font-medium">{option.name}</h3>
                <p className="text-sm text-gray-500">{option.description}</p>
              </div>
            </div>
          ))}
        </div>
      </DialogContent>
    </Dialog>
  );
}
