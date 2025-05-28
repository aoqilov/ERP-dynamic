import React from "react";
import { useDraggable } from "@dnd-kit/core";
import "../../../wscss/components/canban/_canbanColumn.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";
import { ColumnTypeStr, TaskType } from "@/types/SalesCanban";
import dayjs from "dayjs";

type propsCanbana = {
  column: ColumnTypeStr;
  task: TaskType;
};
const TaskCard: React.FC<propsCanbana> = ({ task, column }) => {
  const { project_name, date, cost, currency, sales_agent } = task;

  const { attributes, listeners, setNodeRef, transform } = useDraggable({
    id: task.id,
  });

  const style = {
    transform: transform
      ? `translate(${transform.x}px, ${transform.y}px)`
      : undefined,
    // padding: "10px",
    cursor: "grab",
  };

  return (
    <div ref={setNodeRef} style={style} {...listeners} {...attributes}>
      <div
        style={{ border: `1px solid ${column.color}` }}
        className="project-card"
      >
        <div className="project-card__icons">
          <FaRegEdit className="edit-icon" />
          <RiDeleteBin6Line className="delete-icon" />
        </div>
        <div className="project-card__info">
          <div className="info_raw">
            <span>Project:</span> <p>{project_name}3</p>
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
              Salses <br />
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
