import React, { useState, useEffect } from "react";
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
import { useGetCanbanBoardQuery } from "@/store/slices/SalesApi/SlCanbanApi";
import ColumnCanban from "./columnCanban";
import { ColumnData, TaskType } from "@/types/SalesCanban";

// Tiplar

interface ColumnType {
  id: number;
  name: string;
  color: string;
  tasks: number[];
}

const KanbanBoard: React.FC = () => {
  // State: columns keyed by ID va tasks massiv
  const [columns, setColumns] = useState<Record<number, ColumnType>>({});
  const [tasks, setTasks] = useState<Partial<TaskType>[]>([]);

  const sensors = useSensors(useSensor(PointerSensor));
  const { data: apiData, isLoading } = useGetCanbanBoardQuery();

  // Ma'lumot kelganda state ni to'ldiramiz
  useEffect(() => {
    if (!isLoading && apiData?.data) {
      const data = apiData.data as ColumnData[];

      // Columns obyektini yaratish
      const cols: Record<number, ColumnType> = {};
      data.forEach((col) => {
        cols[col.id] = {
          id: col.id,
          name: col.name,
          color: col.color,
          tasks: col.canbans.map((item) => item.id),
        };
      });
      setColumns(cols);

      // Tasks massivini yaratish
      const allTasks: Partial<TaskType>[] = data.flatMap((col) => {
        return col.canbans.map((item) => ({ ...item }));
      });
      setTasks(allTasks);
    }
  }, [apiData, isLoading]);

  if (isLoading) return <p>Loading...</p>;

  // // Drag tugashi handler
  // const handleDragEnd = ({ active, over }: { active: any; over: any }) => {
  //   if (!over || active.id === over.id) return;

  //   let sourceId: number | null = null;
  //   let destId: number | null = null;

  //   // Har bir columnni tekshirib qaysida ekanini aniqlaymiz
  //   Object.values(columns).forEach((col) => {
  //     if (col.tasks.includes(active.id)) sourceId = col.id;
  //     if (col.tasks.includes(over.id)) destId = col.id;
  //   });

  //   if (sourceId !== null && destId !== null) {
  //     const sourceTasks = [...columns[sourceId].tasks];
  //     const destTasks = [...columns[destId].tasks];

  //     // Source dan o'chirish
  //     sourceTasks.splice(sourceTasks.indexOf(active.id), 1);
  //     // Destination ga joylash
  //     const overIndex = destTasks.indexOf(over.id);
  //     destTasks.splice(overIndex, 0, active.id);

  //     setColumns({
  //       ...columns,
  //       [sourceId]: { ...columns[sourceId], tasks: sourceTasks },
  //       [destId]: { ...columns[destId], tasks: destTasks },
  //     });
  //   }
  // };

  return (
    <DndContext
      sensors={sensors}
      collisionDetection={closestCenter}
      // onDragEnd={handleDragEnd}
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
              tasks={col.tasks.map((taskId) =>
                tasks.find((t) => t.id === taskId)
              )}
            />
          </SortableContext>
        ))}
      </div>
    </DndContext>
  );
};

export default KanbanBoard;
