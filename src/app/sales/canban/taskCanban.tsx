import React from "react";
import { useDraggable } from "@dnd-kit/core";
import "../../../wscss/components/canban/_canbanColumn.scss";
import { RiDeleteBin6Line } from "react-icons/ri";
import { FaRegEdit } from "react-icons/fa";

function TaskCard({ task, column }) {
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
            <span>Project:</span> <p>task 3</p>
          </div>
          <div className="info_raw">
            <span>Created on:</span> <p>05.11.2025 00:00</p>
          </div>
          <div className="info_raw">
            <span>Cost:</span>{" "}
            <p>
              1000 <strong>USD</strong>
            </p>
          </div>
          <div className="info_raw">
            <span>
              Salses <br />
              agent:
            </span>{" "}
            <p>
              Muzaffar <br />
              abdusalom
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default TaskCard;
