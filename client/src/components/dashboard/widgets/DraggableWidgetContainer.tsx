import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  sortableKeyboardCoordinates,
  rectSortingStrategy,
} from "@dnd-kit/sortable";
import { DraggableWidget } from "./DraggableWidget";
import { ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { AddWidgetDialog } from "./AddWidgetDialog";

export interface Widget {
  id: string;
  type: string;
}

export interface DraggableWidgetContainerProps {
  widgets: Widget[];
  onRemoveWidget: (id: string) => void;
  children: (widget: Widget) => ReactNode;
}

export function DraggableWidgetContainer({
  widgets,
  onRemoveWidget,
  children,
}: DraggableWidgetContainerProps) {
  const sensors = useSensors(
    useSensor(PointerSensor),
    useSensor(KeyboardSensor, {
      coordinateGetter: sortableKeyboardCoordinates,
    })
  );

  return (
    <>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-2xl font-semibold tracking-tight">Overview</h2>
        <Button
          variant="outline"
          size="sm"
          className="gap-2"
          onClick={() => {}}
        >
          <Plus className="h-4 w-4" />
          Add
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <DndContext
          sensors={sensors}
          collisionDetection={closestCenter}
          onDragEnd={() => {}}
        >
          <SortableContext items={widgets.map(w => w.id)} strategy={rectSortingStrategy}>
            {widgets.map((widget) => (
              <DraggableWidget
                key={widget.id}
                id={widget.id}
                onRemove={onRemoveWidget}
              >
                {children(widget)}
              </DraggableWidget>
            ))}
          </SortableContext>
        </DndContext>
      </div>

      <AddWidgetDialog
        open={false}
        onClose={() => {}}
        onAddWidget={() => {}}
        existingWidgets={widgets}
      />
    </>
  );
}
