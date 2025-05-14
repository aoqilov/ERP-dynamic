import React, { useState } from "react";
import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import Column from "./columnCanban"; // Bu yerda columnCanban komponenti bo‘lad
import { canbanData } from "./canbanData";

const initialColumns = canbanData.map((column) => ({
  id: column.id,
  name: column.name,
  color: column.color,
  tasks: column.canbans.map((canban) => canban.id), // canbanlardan id larni olish
}));

const initialTasks = canbanData.flatMap((column) =>
  column.canbans.map((canban) => ({
    id: canban.id,
    content: canban.project_name, // yoki boshqa kerakli ma'lumot
  }))
);

function KanbanBoard() {
  const [columns, setColumns] = useState(initialColumns);
  const [tasks, setTasks] = useState(initialTasks);

  const sensors = useSensors(useSensor(PointerSensor));

  // handleDragEnd: Taskni ko'chirish va ustunlarni yangilash
  const handleDragEnd = (event) => {
    const { active, over } = event;
    if (!over) return;
    if (active.id === over.id) return;

    // Tasklar joylashgan ustunlar ID sini topamiz
    let sourceColumnId, destinationColumnId;

    for (let colId in columns) {
      if (columns[colId].tasks.includes(active.id)) {
        sourceColumnId = colId;
      }
      if (columns[colId].tasks.includes(over.id)) {
        destinationColumnId = colId;
      }
    }

    // Agar bir ustundagi ichida joylashuv o‘zgargan bo‘lsa
    if (sourceColumnId && destinationColumnId) {
      const sourceTasks = [...columns[sourceColumnId].tasks];
      const destinationTasks = [...columns[destinationColumnId].tasks];

      // O‘chir task
      const draggedTaskIndex = sourceTasks.indexOf(active.id);
      sourceTasks.splice(draggedTaskIndex, 1);

      // Qo‘sh task
      const overIndex = destinationTasks.indexOf(over.id);
      destinationTasks.splice(overIndex, 0, active.id);

      setColumns({
        ...columns,
        [sourceColumnId]: {
          ...columns[sourceColumnId],
          tasks: sourceTasks,
        },
        [destinationColumnId]: {
          ...columns[destinationColumnId],
          tasks: destinationTasks,
        },
      });
    }
  };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      onDragEnd={handleDragEnd}
    >
      <div style={{ display: "flex", gap: "16px", padding: "16px" }}>
        {columns.map((column) => (
          <SortableContext
            key={column.id}
            items={column.tasks}
            strategy={verticalListSortingStrategy}
          >
            <Column
              column={column}
              tasks={column.tasks.map((taskId) =>
                tasks.find((task) => task.id === taskId)
              )}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
}

export default KanbanBoard;
