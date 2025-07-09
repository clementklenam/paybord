import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { X, GripVertical } from "lucide-react";
import { cn } from "@/lib/utils";

interface DraggableWidgetProps {
  id: string;
  onRemove: (id: string) => void;
  children: React.ReactNode;
}

export function DraggableWidget({ id, onRemove, children }: DraggableWidgetProps) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        "relative group",
        isDragging && "z-50 scale-105 opacity-90 shadow-lg"
      )}
    >
      <button
        {...attributes}
        {...listeners}
        className="absolute -top-2 -left-2 p-1.5 rounded-full bg-background/95 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity cursor-grab active:cursor-grabbing hover:bg-accent"
      >
        <GripVertical className="h-4 w-4 text-muted-foreground" />
      </button>
      
      <button
        onClick={() => onRemove(id)}
        className="absolute -top-2 -right-2 p-1.5 rounded-full bg-background/95 border shadow-sm opacity-0 group-hover:opacity-100 transition-opacity hover:bg-destructive hover:text-destructive-foreground"
      >
        <X className="h-4 w-4" />
      </button>

      <div className={cn(
        "transition-all duration-200",
        isDragging ? "scale-[0.98] opacity-75 border-dashed" : "scale-100 opacity-100"
      )}>
        {children}
      </div>
    </div>
  );
}
