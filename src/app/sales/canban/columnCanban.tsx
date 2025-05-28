import React, { useEffect, useState } from "react";
import TaskCard from "./taskCanban";
import { Button } from "antd";
import "../../../wscss/components/canban/_canbanColumn.scss";
import { FaPlus } from "react-icons/fa";
import {
  ColumnTypeStr,
  StatusResponseCanbanItem,
  TaskType,
} from "@/types/SalesCanban";
import ModalTwice from "@/components/sales/canban/ModalTwiceCanban";
import { useDroppable } from "@dnd-kit/core";

type propsCanbana = {
  column: ColumnTypeStr;
  tasks: TaskType[];
  mainData: StatusResponseCanbanItem[] | undefined;
};

const ColumnCanban: React.FC<propsCanbana> = ({ column, tasks, mainData }) => {
  const [activeStatus, setActiveStatus] = useState<number | null>(null);
  const [modalTwiceOpen, setModalTwiceOpen] = useState(false);

  // Make column droppable
  const { setNodeRef, isOver } = useDroppable({
    id: column.id,
  });

  useEffect(() => {
    if (activeStatus) {
      setModalTwiceOpen(true);
    }
  }, [activeStatus]);

  const handleNewCard = () => {
    setActiveStatus(column.id);
  };

  return (
    <div
      ref={setNodeRef}
      className="column"
      style={{
        borderRadius: "8px",
        background: isOver ? "#E6F7FF" : "#F5F5F5",
        transition: "background-color 0.2s ease",
        minHeight: "400px",
        width: "280px", // Fixed width for consistency
        display: "flex",
        flexDirection: "column",
      }}
    >
      <div className="column__title">
        <h3
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: column.color,
            margin: 0,
            padding: "16px",
          }}
        >
          {column.name} ({tasks.length})
        </h3>
      </div>
      <div className="column__border"></div>
      <div className="column__add" style={{ padding: "0 16px 16px" }}>
        <Button
          style={{ width: "100%", color: "#a4a4a4" }}
          type="default"
          icon={<FaPlus />}
          iconPosition="end"
          onClick={handleNewCard}
        >
          New card
        </Button>
      </div>

      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: "10px",
          flex: 1,
          padding: "0 16px 16px",
          overflowY: "auto", // Handle overflow for many tasks
        }}
      >
        {tasks.map((task) => (
          <TaskCard key={task.id} task={task} column={column} />
        ))}
      </div>

      <ModalTwice
        modalTwiceOpen={modalTwiceOpen}
        modalTwiceClose={() => setModalTwiceOpen(false)}
        mainData={mainData}
        activeStatus={activeStatus}
      />
    </div>
  );
};

export default ColumnCanban;
