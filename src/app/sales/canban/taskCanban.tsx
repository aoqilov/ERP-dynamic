import React from "react";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import "../../../wscss/components/canban/_canbanColumn.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { ColumnTypeStr, TaskType } from "@/types/SalesCanban";
import dayjs from "dayjs";

type propsCanbana = {
  column: ColumnTypeStr;
  task: TaskType;
  isDragOverlay?: boolean;
};

const TaskCard: React.FC<propsCanbana> = ({ task, column, isDragOverlay }) => {
  const { project_name, date, cost, currency, sales_agent } = task;

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({
    id: task.id,
    disabled: isDragOverlay, // Disable sorting for overlay
  });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition: isDragging ? "none" : transition, // Remove transition during drag
    cursor: isDragging ? "grabbing" : "grab",
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 1000 : 1,
  };

  // Don't apply transform or transitions to drag overlay
  const overlayStyle = isDragOverlay
    ? {
        cursor: "grabbing",
        transform: "rotate(5deg)", // Slight rotation for visual feedback
        boxShadow: "0 8px 20px rgba(0,0,0,0.3)",
      }
    : style;

  return (
    <div
      ref={!isDragOverlay ? setNodeRef : undefined}
      style={overlayStyle}
      {...(!isDragOverlay ? listeners : {})}
      {...(!isDragOverlay ? attributes : {})}
    >
      <div
        style={{
          border: `1px solid ${column.color}`,
          background: "white",
          borderRadius: "8px",
          userSelect: "none", // Prevent text selection during drag
        }}
        className="project-card"
      >
        <div className="project-card__icons">
          <FaRegEdit className="edit-icon" />
          <RiDeleteBin6Line className="delete-icon" />
        </div>
        <div className="project-card__info">
          <div className="info_raw">
            <span>Project:</span> <p>{project_name}</p>
          </div>
          <div className="info_raw">
            <span>Created on:</span>{" "}
            <p>{dayjs(+date).format("DD.MM.YYYY HH:mm")}</p>
          </div>
          <div className="info_raw">
            <span>Cost:</span>{" "}
            <p>
              {cost} <strong>{currency.name}</strong>
            </p>
          </div>
          <div className="info_raw">
            <span>
              Sales <br />
              agent:
            </span>{" "}
            <p>
              {sales_agent.fullname.split(" ").map((word, index) => (
                <React.Fragment key={index}>
                  {word}
                  {index !== sales_agent.fullname.split(" ").length - 1 && (
                    <br />
                  )}
                </React.Fragment>
              ))}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TaskCard;
