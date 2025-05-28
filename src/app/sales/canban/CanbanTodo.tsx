import React, { useState, useEffect } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent,
  DragOverEvent,
  DragOverlay,
  DragStartEvent,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { useGetCanbanBoardQuery } from "@/store/slices/SalesApi/SlCanbanApi";
import ColumnCanban from "./columnCanban";
import TaskCard from "./taskCanban";
import { ColumnData, TaskType } from "@/types/SalesCanban";

interface ColumnType {
  id: number;
  name: string;
  color: string;
  tasks: number[];
}

interface OrderUpdatePayload {
  taskId: number;
  newOrder: number;
  columnId: number;
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Record<number, ColumnType>>({});
  const [tasks, setTasks] = useState<Record<number, TaskType>>({});
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );
  
  const { data: apiData, isLoading } = useGetCanbanBoardQuery();

  useEffect(() => {
    if (!isLoading && apiData?.data) {
      const data = apiData.data as ColumnData[];

      // Create columns object
      const cols: Record<number, ColumnType> = {};
      const tasksMap: Record<number, TaskType> = {};

      data.forEach((col) => {
        // Create a copy of the array before sorting to avoid mutating read-only data
        const sortedTasks = [...col.canbans].sort((a, b) => a.order - b.order);
        
        cols[col.id] = {
          id: col.id,
          name: col.name,
          color: col.color,
          tasks: sortedTasks.map((item) => item.id),
        };

        // Create tasks map for faster lookup
        sortedTasks.forEach((item) => {
          tasksMap[item.id] = item;
        });
      });

      setColumns(cols);
      setTasks(tasksMap);
    }
  }, [apiData, isLoading]);

  // Function to update task orders - you can implement the backend logic here
  const updateTaskOrder = async (updates: OrderUpdatePayload[]) => {
    // TODO: Implement your backend API call here
    console.log("Order updates to send to backend:", updates);
    
    // Example of what you might call:
    // await updateTaskOrdersAPI(updates);
    
    // For now, just log the updates
    updates.forEach(update => {
      console.log(`Task ${update.taskId} moved to order ${update.newOrder} in column ${update.columnId}`);
    });
  };

  // Helper function to calculate new orders and prepare updates
  const calculateOrderUpdates = (
    columnId: number, 
    taskIds: number[], 
    movedTaskId?: number
  ): OrderUpdatePayload[] => {
    const updates: OrderUpdatePayload[] = [];
    
    taskIds.forEach((taskId, index) => {
      const newOrder = index + 1; // Start orders from 1
      const currentTask = tasks[taskId];
      
      // Only update if order changed or if it's the moved task
      if (!currentTask || currentTask.order !== newOrder || taskId === movedTaskId) {
        updates.push({
          taskId,
          newOrder,
          columnId,
        });
        
        // Update local state
        if (currentTask) {
          setTasks(prev => ({
            ...prev,
            [taskId]: {
              ...prev[taskId],
              order: newOrder,
            }
          }));
        }
      }
    });
    
    return updates;
  };

  const handleDragStart = (event: DragStartEvent) => {
    const { active } = event;
    const activeId = active.id as number;
    setActiveTask(tasks[activeId] || null);
  };

  const handleDragOver = (event: DragOverEvent) => {
    const { active, over } = event;
    
    if (!over) return;

    const activeId = active.id as number;
    const overId = over.id as number;

    // Find source column
    const activeColumn = Object.values(columns).find(col => 
      col.tasks.includes(activeId)
    );
    
    if (!activeColumn) return;

    // Check if dropping on a column directly
    let overColumn = columns[overId];
    
    // If not dropping on column, find column containing the over item
    if (!overColumn) {
      overColumn = Object.values(columns).find(col => 
        col.tasks.includes(overId)
      );
    }

    if (!overColumn || activeColumn.id === overColumn.id) {
      return;
    }

    // Move task between columns
    setColumns(prev => {
      const activeItems = [...prev[activeColumn.id].tasks];
      const overItems = [...prev[overColumn.id].tasks];

      // Remove from source
      const activeIndex = activeItems.indexOf(activeId);
      if (activeIndex !== -1) {
        activeItems.splice(activeIndex, 1);
      }

      // Add to destination at the beginning if dropping on column
      if (columns[overId]) {
        overItems.unshift(activeId);
      } else {
        // Insert at specific position if dropping on another task
        const overIndex = overItems.indexOf(overId);
        overItems.splice(overIndex + 1, 0, activeId);
      }

      return {
        ...prev,
        [activeColumn.id]: {
          ...prev[activeColumn.id],
          tasks: activeItems,
        },
        [overColumn.id]: {
          ...prev[overColumn.id],
          tasks: overItems,
        },
      };
    });
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    
    setActiveTask(null);
    
    if (!over || active.id === over.id) return;

    const activeId = active.id as number;
    const overId = over.id as number;
    let orderUpdates: OrderUpdatePayload[] = [];

    // Find the column containing both items (for reordering within same column)
    const sameColumn = Object.values(columns).find(col => 
      col.tasks.includes(activeId) && col.tasks.includes(overId)
    );

    if (sameColumn) {
      // Reorder within the same column
      setColumns(prev => {
        const items = [...prev[sameColumn.id].tasks];
        const activeIndex = items.indexOf(activeId);
        const overIndex = items.indexOf(overId);

        if (activeIndex !== -1 && overIndex !== -1) {
          items.splice(activeIndex, 1);
          items.splice(overIndex, 0, activeId);
          
          // Calculate order updates for this column
          orderUpdates = calculateOrderUpdates(sameColumn.id, items, activeId);
        }

        return {
          ...prev,
          [sameColumn.id]: {
            ...prev[sameColumn.id],
            tasks: items,
          },
        };
      });
    } else {
      // Handle cross-column moves
      const activeColumn = Object.values(columns).find(col => 
        col.tasks.includes(activeId)
      );
      
      let overColumn = columns[overId];
      if (!overColumn) {
        overColumn = Object.values(columns).find(col => 
          col.tasks.includes(overId)
        );
      }

      if (activeColumn && overColumn) {
        // Calculate updates for both columns
        const sourceUpdates = calculateOrderUpdates(
          activeColumn.id, 
          columns[activeColumn.id].tasks
        );
        const targetUpdates = calculateOrderUpdates(
          overColumn.id, 
          columns[overColumn.id].tasks, 
          activeId
        );
        
        orderUpdates = [...sourceUpdates, ...targetUpdates];
      }
    }

    // Send order updates to backend
    if (orderUpdates.length > 0) {
      updateTaskOrder(orderUpdates);
    }

    console.log('updates', tasks);
    
  };

  if (isLoading) return <p>Loading...</p>;

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragStart={handleDragStart}
      onDragOver={handleDragOver}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: 16, padding: 16 }}>
        {Object.values(columns).map((col) => (
          <SortableContext
            key={col.id}
            items={col.tasks}
            strategy={verticalListSortingStrategy}
          >
            <ColumnCanban
              column={col}
              mainData={apiData?.data}
              tasks={col.tasks.map((taskId) => tasks[taskId]).filter(Boolean)}
            />
          </SortableContext>
        ))}
      </div>
      
      <DragOverlay>
        {activeTask ? (
          <TaskCard 
            task={activeTask} 
            column={Object.values(columns).find(col => 
              col.tasks.includes(activeTask.id)
            )!}
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;