import { Card } from "@/components/ui/card";
import { AlertCircle } from "lucide-react";

export function FailedPaymentsWidget() {
  return (
    <Card className="p-6">
      <div className="flex flex-col space-y-4">
        <div className="flex items-start justify-between">
          <div>
            <h3 className="text-sm font-medium text-muted-foreground">Failed payments</h3>
            <div className="mt-4 flex items-center gap-2 text-muted-foreground">
              <AlertCircle className="h-4 w-4" />
              <p className="text-sm">No failed payments in selected time period. It can take up to 24 hours for this data to be updated.</p>
            </div>
          </div>
        </div>
      </div>
    </Card>
  );
}
