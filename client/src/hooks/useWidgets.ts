import {useState} from "react";
import {arrayMove} from "@dnd-kit/sortable";

export interface Widget {
  id: string;
  type: string;
}

const useWidgets = (initialWidgets: Widget[]) => {
  const [widgets, setWidgets] = useState<Widget[]>(initialWidgets);
  const [isAddingWidget, setIsAddingWidget] = useState(false);

  const handleDragEnd = (event: unknown) => {
    const { active, over } = event;

    if (active.id !== over.id) {
      setWidgets((items) => {
        const oldIndex = items.findIndex((item) => item.id === active.id);
        const newIndex = items.findIndex((item) => item.id === over.id);
        return arrayMove(items, oldIndex, newIndex);
      });
    }
  };

  const handleAddWidget = (type: string) => {
    const id = `${type}-${Date.now()}`;
    setWidgets([...widgets, { id, type }]);
  };

  const handleRemoveWidget = (id: string) => {
    setWidgets(widgets.filter(widget => widget.id !== id));
  };

  return {
    widgets,
    isAddingWidget,
    setIsAddingWidget,
    handleDragEnd,
    handleAddWidget,
    handleRemoveWidget
  };
};

export default useWidgets;
