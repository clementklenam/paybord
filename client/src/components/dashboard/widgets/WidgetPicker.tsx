import {Button} from "../../ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "../../ui/dropdown-menu";
import {Plus} from "lucide-react";

export type WidgetType = "payment" | "netVolume" | "customers" | "failed";

interface WidgetOption {
  type: WidgetType;
  label: string;
}

const WIDGET_OPTIONS: WidgetOption[] = [
  { type: "payment", label: "Payments Overview" },
  { type: "netVolume", label: "Net Volume" },
  { type: "customers", label: "New Customers" },
  { type: "failed", label: "Failed Payments" },
];

interface WidgetPickerProps {
  onAddWidget: (type: WidgetType) => void;
  availableWidgets: WidgetType[];
}

function WidgetPicker({ onAddWidget, availableWidgets }: WidgetPickerProps) {
  const filteredOptions = WIDGET_OPTIONS.filter(
    (option) => availableWidgets.includes(option.type)
  );

  if (filteredOptions.length === 0) return null;

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="outline" size="sm" className="gap-2">
          <Plus className="h-4 w-4" />
          Add Widget
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {filteredOptions.map((option) => (
          <DropdownMenuItem
            key={option.type}
            onClick={() => onAddWidget(option.type)}
          >
            {option.label}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}

export default WidgetPicker;
