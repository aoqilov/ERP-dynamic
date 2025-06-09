import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Button, Dropdown, MenuProps, Popconfirm } from "antd";
import { FaPlus } from "react-icons/fa";
import { useDroppable } from "@dnd-kit/core";
import React, { useState } from "react";
import { IoMdMore } from "react-icons/io";
import { HiOutlinePencil } from "react-icons/hi2";
import { GoTrash } from "react-icons/go";
import { useDeletePlaygroundSectionMutation } from "@/store/slices/playground/PlaygroundApi";

interface Task {
  id: number;
  // boshqa fieldlar...
}

interface Column {
  id: string;
  title: string;
  items: Task[];
  setSelectedColumn: (column: any) => void;
}

const CanbanColumn: React.FC<Column> = ({
  column,
  items,
  setSelectedColumn,
}) => {
  const [deleteSection, { isLoading: isDeleteLoading }] =
    useDeletePlaygroundSectionMutation();
  const itemsMore: MenuProps["items"] = [
    {
      key: "edit",
      icon: <HiOutlinePencil />,
      label: <div className="flex items-center gap-2"> Edit</div>,
    },
    {
      key: "delete",
      icon: <GoTrash />,
      label: (
        <Popconfirm
          title="Are you sure to delete this column?"
          onConfirm={() => deleteSection({ id: column.id }).unwrap()}
          okText="Yes"
          cancelText="No"
          okButtonProps={{ loading: isDeleteLoading }}
        >
          <div className="flex items-center gap-2 text-red-500 cursor-pointer">
            Delete
          </div>
        </Popconfirm>
      ),
    },
  ];

  const { setNodeRef } = useDroppable({ id: column.id });
  return (
    <div
      ref={setNodeRef}
      style={{
        display: "flex",
        flexDirection: "column",
        gap: "10px",
        backgroundColor: "#fffff9",
        minWidth: "240px",
        padding: "10px",
        borderRadius: "6px",
      }}
    >
      <div
        className="playcolumn__header"
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          borderBottom: "1px solid gray",
          paddingBottom: "6px",
        }}
      >
        <h2
          style={{
            fontSize: "14px",
            fontWeight: "600",
            marginBottom: "0",
            color: column.color || "#000",
          }}
        >
          {column.title}
        </h2>
        <span>
          <Dropdown
            menu={{
              items: itemsMore,
              onClick: ({ key }) => {
                if (key === "edit") {
                  setSelectedColumn(column); // column tanlandi
                }
                if (key === "delete") {
                }
              },
            }}
            trigger={["hover"]}
          >
            <IoMdMore style={{ cursor: "pointer" }} />
          </Dropdown>
        </span>
      </div>

      <Button
        type="default"
        icon={<FaPlus />}
        block
        style={{ margin: "8px 0" }}
      >
        New task
      </Button>

      <SortableContext
        items={column.items.map((task) => task.id)}
        strategy={verticalListSortingStrategy}
      >
        {column.items.length === 0 ? (
          <div
            style={{
              minHeight: "60px",
              border: "2px dashed #ccc",
              borderRadius: "6px",
              padding: "8px",
              textAlign: "center",
              color: "#999",
            }}
          >
            Drop here
          </div>
        ) : (
          column.items.map((task) => (
            <TaskCard
              key={task.id}
              id={task.id}
              task={task}
              color={column.color}
            />
          ))
        )}
      </SortableContext>
    </div>
  );
};

export default CanbanColumn;
