import {
  SortableContext,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import TaskCard from "./TaskCard";
import { Button } from "antd";
import { FaPlus } from "react-icons/fa";
import { IoEllipsisVerticalSharp } from "react-icons/io5";

const CanbanColumn = ({ section }) => {
  return (
    <div
      style={{
        display: "flex",
        gap: "10px",
        backgroundColor: "#f0f0f0",
        minWidth: "240px",
      }}
    >
      <div style={{ width: "100%" }}>
        <div
          className="playcolumn__header"
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid gray",
          }}
        >
          <h2
            style={{
              color: section.color,
              fontSize: "14px",
              fontWeight: "600",
              marginBottom: "10px",
            }}
          >
            {section.name}
          </h2>
          <span className="">
            <IoEllipsisVerticalSharp size={20} />
          </span>
        </div>
        <div className="playcolumn__add">
          <Button
            size="small"
            type="default"
            icon={<FaPlus />}
            iconPosition="end"
            block
            style={{ margin: "5px 0" }}
          >
            New task
          </Button>
        </div>

        <SortableContext
          items={section.playground_section_tasks.map((task) => task.id)}
          strategy={verticalListSortingStrategy}
        >
          {section.playground_section_tasks.map((task) => (
            <TaskCard key={task.id} task={task} />
          ))}
        </SortableContext>
      </div>
    </div>
  );
};

export default CanbanColumn;
