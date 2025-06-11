"use client";

import React, { useEffect, useState } from "react";
import {
  DndContext,
  closestCorners,
  DragOverlay,
  PointerSensor,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import { arrayMove } from "@dnd-kit/sortable";
import CanbanColumn from "../CanbanColumn";
import TaskCard from "../TaskCard";
import {
  useChangeOrderOrSectionMutation,
  useGetPlaygroundCardQuery,
  useGetPlaygroundSectionsQuery,
} from "@/store/slices/playground/PlaygroundApi";
import { useParams } from "next/navigation";
import Loading from "@/app/loading";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button } from "antd";
import { FaPlus } from "react-icons/fa";
import { useRouter } from "next/navigation";
import { IoIosArrowBack } from "react-icons/io";
import TaskColumnCreateEdit from "@/components/playground/TaskColumnCreateEdit";

type Task = {
  id: number;
  name: string;
  deadline: string;
  created_date: string;
  priority: string;
  text_editor: string;
  order: number;
  employees: any[];
  created_by: any;
  files: any[];
  passed_time: number;
};

interface Column {
  id: string;
  title: string;
  color?: string; // ← shu qo‘shilsin
  items: Task[];
  setSelectedColumn: (column: any) => void;
  employees?: any[] | undefined;
}

type Columns = {
  [key: string]: Column;
};

export default function CanbanMainPlayground() {
  const [changeOrderOrSection] = useChangeOrderOrSectionMutation();
  const { id } = useParams();
  const router = useRouter();

  const { data: dataTask, isLoading: isLoadingTask } =
    useGetPlaygroundSectionsQuery(id ? { id: Number(id) } : skipToken);

  const { data, isLoading } = useGetPlaygroundCardQuery(
    id ? { id: Number(id) } : skipToken
  );

  const [columns, setColumns] = useState<Columns>({});
  const [activeTask, setActiveTask] = useState<Task | null>(null);

  const sensors = useSensors(useSensor(PointerSensor));
  useEffect(() => {
    if (dataTask?.data) {
      const formatted: Columns = dataTask.data.reduce((acc, section) => {
        acc[section.id.toString()] = {
          id: section.id.toString(),
          name: section.name,
          title: section.name,
          order: section.order,
          color: section.color || "#000",
          items: [...(section.playground_section_tasks || [])].sort(
            (a, b) => a.order - b.order
          ),
        };
        return acc;
      }, {} as Columns);

      setColumns(formatted);
    }
  }, [dataTask]);

  const findColumnByTaskId = (taskId: number): string | undefined => {
    return Object.keys(columns).find((columnId) =>
      columns[columnId].items.some((task) => task.id === taskId)
    );
  };

  const handleDragStart = (event: any) => {
    const taskId = event.active.id;
    const columnId = findColumnByTaskId(taskId);
    if (!columnId) return;

    const task = columns[columnId].items.find((t) => t.id === taskId);
    if (task) setActiveTask(task);
  };

  const handleDragEnd = (event: any) => {
    const { active, over } = event;
    setActiveTask(null);
    if (!over) return;

    const activeId = active.id;
    const overId = over.id;

    const fromColumn = findColumnByTaskId(activeId);
    let toColumn = findColumnByTaskId(overId);

    if (!toColumn && columns[overId]) {
      toColumn = overId;
    }

    if (!fromColumn || !toColumn) return;

    const fromItems = [...(columns[fromColumn]?.items || [])];
    let toItems = [...(columns[toColumn]?.items || [])];

    const fromIndex = fromItems.findIndex((task) => task.id === activeId);
    if (fromIndex === -1) return;

    const [movedTask] = fromItems.splice(fromIndex, 1);

    // **🎯 Bo‘sh ustunga tushgan bo‘lsa, yangi task qo‘shish**
    if (toItems.length === 0) {
      toItems = [];
    }

    let dropIndex = toItems.findIndex((task) => task.id === overId);
    if (dropIndex === -1) {
      dropIndex = toItems.length;
    }

    // **🔄 Yangi column holatini yangilash**
    let newColumns = { ...columns };

    toItems.splice(dropIndex, 0, movedTask);

    newColumns = {
      ...columns,
      [fromColumn]: {
        ...columns[fromColumn],
        items: fromItems,
      },
      [toColumn]: {
        ...columns[toColumn],
        items: toItems,
      },
    };

    console.log("🔄 Yangi column holati:", newColumns);

    setColumns(newColumns);

    // **📤 Serverga to‘g‘ri formatlangan ma’lumot yuborish**
    const payload = Object.values(newColumns).map((column) => ({
      playground_section_id: Number(column.id),
      playground_section_tasks: column.items.map((task, index) => ({
        id: task.id,
        order: index,
      })),
    }));

    changeOrderOrSection({ orders: payload })
      .unwrap()
      .then(() => console.log("✅ Order muvaffaqiyatli yangilandi"))
      .catch((err) =>
        console.error("❌ Serverga order yuborishda xatolik:", err)
      );
  };

  const [open, setOpen] = useState(false);
  const [selectedColumn, setSelectedColumn] = useState<any | null>(null);

  useEffect(() => {
    // Agar selectedColumn bo'lsa, modalni ochamiz
    if (selectedColumn) {
      setOpen(true);
    } else {
      setOpen(false);
    }
  }, [selectedColumn]);
  // for modal

  if (isLoading || isLoadingTask) return <Loading />;

  return (
    <div className="playground">
      <div
        style={{
          padding: "20px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "end",
        }}
      >
        <div className="flex items-center gap-3">
          <div
            onClick={() => router.back()}
            style={{ cursor: "pointer", display: "flex", alignItems: "center" }}
          >
            <IoIosArrowBack className="mr-1 text-lg" />
            Back to main page
          </div>
          <h1 className="text-2xl font-bold" style={{ marginTop: "10px" }}>
            TEST UCHUN
          </h1>
        </div>

        <Button
          type="primary"
          icon={<FaPlus />}
          shape="round"
          onClick={() => setOpen(true)}
        >
          Add section
        </Button>
      </div>
      <TaskColumnCreateEdit
        open={open}
        onCancel={() => {
          setOpen(false);
          setSelectedColumn(null); // clear selected
        }}
        id={Number(id)}
        initialData={selectedColumn}
      />
      <DndContext
        sensors={sensors}
        collisionDetection={closestCorners}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <div
          style={{
            display: "flex",
            gap: "20px",
            padding: "20px",
            overflowX: "auto",
          }}
          className="flex gap-5 p-5 overflow-auto"
        >
          {Object.values(columns).map((column) => (
            <CanbanColumn
              key={column.id}
              column={column}
              items={column.items}
              setSelectedColumn={setSelectedColumn}
              employees={data?.data.employees}
            />
          ))}
        </div>

        <DragOverlay>
          {activeTask ? <TaskCard task={activeTask} /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
