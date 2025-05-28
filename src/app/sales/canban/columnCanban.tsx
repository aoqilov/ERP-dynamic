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

type propsCanbana = {
  column: ColumnTypeStr;
  tasks: TaskType[] | undefined;
  mainData: StatusResponseCanbanItem[] | undefined;
};
const ColumnCanban: React.FC<propsCanbana> = ({ column, tasks, mainData }) => {
  const [activeStatus, setActiveStatus] = useState<number | null>(null);
  const [modalTwiceOpen, setModalTwiceOpen] = useState(false);

  //
  useEffect(() => {
    if (activeStatus) {
      setModalTwiceOpen(true);
    }
  }, [activeStatus]);

  return (
    <div
      className="column"
      style={{
        borderRadius: "8px",
        background: "#F5F5F5",
      }}
    >
      <div className="column__title">
        <h3
          style={{
            fontSize: 14,
            fontWeight: 400,
            color: column.color,
            width: "240px",
          }}
        >
          {column.name}
        </h3>
      </div>
      <div className="column__border"></div>
      <div className="column__add">
        <Button
          style={{ width: "100%", color: "#a4a4a4" }}
          type="default"
          icon={<FaPlus />}
          iconPosition="end"
          onClick={() => mainData?.map(() => setActiveStatus(column.id))}
        >
          New card
        </Button>
      </div>

      <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
        {tasks?.map((task: TaskType) => (
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
