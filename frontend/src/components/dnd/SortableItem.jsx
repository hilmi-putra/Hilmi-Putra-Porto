import React from 'react';
import { useSortable } from '@dnd-kit/sortable';
import { CSS } from '@dnd-kit/utilities';

export function SortableItem({ id, children, disabled = false, className = '', as = 'div' }) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ 
    id,
    disabled
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: transition || undefined,
    zIndex: isDragging ? 10 : 1,
    opacity: isDragging ? 0 : 1, // Hidden on original spot while dragging, overlaid by DragOverlay
  };

  const Component = as;

  return (
    <Component 
      ref={setNodeRef} 
      style={style} 
      {...attributes} 
      {...listeners}
      className={`touch-none ${isDragging ? 'cursor-grabbing' : 'cursor-grab'} ${className}`}
    >
      {children}
    </Component>
  );
}
