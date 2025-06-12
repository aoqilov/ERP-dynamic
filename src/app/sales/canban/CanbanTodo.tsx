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
import {
  useGetCanbanBoardQuery,
  useUpdateCanbanOrderMutation,
} from "@/store/slices/SalesApi/SlCanbanApi";
import ColumnCanban from "./columnCanban";
import TaskCard from "./taskCanban";
import { ColumnData, TaskType } from "@/types/SalesCanban";

interface ColumnType {
  id: number;
  name: string;
  color: string;
  tasks: number[];
}

const KanbanBoard: React.FC = () => {
  const [columns, setColumns] = useState<Record<number, ColumnType>>({});
  const [tasks, setTasks] = useState<Record<number, TaskType>>({});
  const [activeTask, setActiveTask] = useState<TaskType | null>(null);
  const [isUpdating, setIsUpdating] = useState(false);
  const [lastUpdateTimestamp, setLastUpdateTimestamp] = useState<number>(0);

  const sensors = useSensors(
    useSensor(PointerSensor, {
      activationConstraint: {
        distance: 8,
      },
    })
  );

  const { data: apiData, isLoading, refetch } = useGetCanbanBoardQuery();
  const [updateCanbanOrder] = useUpdateCanbanOrderMutation();

  useEffect(() => {
    if (!isLoading && apiData?.data) {
      const currentTime = Date.now();
      const data = apiData.data as ColumnData[];

      if (isUpdating && currentTime - lastUpdateTimestamp < 3000) {
        return;
      }

      const cols: Record<number, ColumnType> = {};
      const tasksMap: Record<number, TaskType> = {};

      data.forEach((col) => {
        const sortedTasks = [...col.canbans].sort((a, b) => a.order - b.order);

        cols[col.id] = {
          id: col.id,
          name: col.name,
          color: col.color,
          tasks: sortedTasks.map((item) => item.id),
        };

        sortedTasks.forEach((item) => {
          tasksMap[item.id] = item;
        });
      });

      setColumns(cols);
      setTasks(tasksMap);

      if (isUpdating) {
        setIsUpdating(false);
      }
    }
  }, [apiData, isLoading, isUpdating, lastUpdateTimestamp]);

  const buildBackendPayload = (columns: Record<number, ColumnType>) => {
    return {
      orders: Object.values(columns).map((col) => ({
        status: col.id,
        canban: col.tasks.map((taskId, idx) => ({
          id: taskId,
          order: idx,
        })),
      })),
    };
  };

  const updateTaskOrder = async () => {
    setIsUpdating(true);
    setLastUpdateTimestamp(Date.now());

    const payload = buildBackendPayload(columns);

    try {
      const result = await updateCanbanOrder(payload).unwrap();

      const isSuccess =
        result &&
        (result.success === true ||
          result.status === "success" ||
          result.message?.includes("success") ||
          !result.error);

      if (!isSuccess) {
        setIsUpdating(false);
        refetch();
      }
    } catch (error) {
      console.error("Error updating task order:", error);
      setIsUpdating(false);
      refetch();
    }
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
    const activeColumn = Object.values(columns).find((col) =>
      col.tasks.includes(activeId)
    );
    if (!activeColumn) return;
    if (columns[overId] && activeColumn.id === overId) return;
  };

  const handleDragEnd = (event: DragEndEvent) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over || active.id === over.id) return;
    const activeId = active.id as number;
    const overId = over.id as number;

    const sourceCol = Object.values(columns).find((col) =>
      col.tasks.includes(activeId)
    );
    if (!sourceCol) {
      return;
    }

    let destCol: ColumnType | undefined = columns[overId];
    let insertIdx = 0;

    if (!destCol) {
      destCol = Object.values(columns).find((col) =>
        col.tasks.includes(overId)
      );
      if (destCol) {
        insertIdx = destCol.tasks.indexOf(overId) + 1;
      }
    }

    if (!destCol) {
      return;
    }

    if (sourceCol.id === destCol.id) {
      const items = [...sourceCol.tasks];
      const oldIdx = items.indexOf(activeId);
      let newIdx = insertIdx;

      if (columns[overId]) {
        newIdx = 0;
      } else {
        const overIdx = items.indexOf(overId);
        newIdx = overIdx + 1;
      }

      if (oldIdx !== -1) {
        items.splice(oldIdx, 1);
        if (newIdx > oldIdx) newIdx--;
        items.splice(newIdx, 0, activeId);

        setColumns((prev) => ({
          ...prev,
          [sourceCol.id]: { ...prev[sourceCol.id], tasks: items },
        }));
      }
    } else {
      const sourceItems = [...sourceCol.tasks];
      const destItems = [...destCol.tasks];
      const oldIdx = sourceItems.indexOf(activeId);

      if (oldIdx !== -1) {
        sourceItems.splice(oldIdx, 1);
        destItems.splice(insertIdx, 0, activeId);

        setColumns((prev) => ({
          ...prev,
          [sourceCol.id]: { ...prev[sourceCol.id], tasks: sourceItems },
          [destCol.id]: { ...prev[destCol.id], tasks: destItems },
        }));
      }
    }

    setTimeout(updateTaskOrder, 0);
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
            column={
              Object.values(columns).find((col) =>
                col.tasks.includes(activeTask.id)
              )!
            }
            isDragOverlay
          />
        ) : null}
      </DragOverlay>
    </DndContext>
  );
};

export default KanbanBoard;
