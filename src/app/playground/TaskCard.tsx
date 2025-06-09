import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Tooltip } from "antd";
import { FaFlag } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { HiBars3 } from "react-icons/hi2";
import dayjs from "dayjs";
import "../../wscss/components/playground/playtaskcard.scss";

const TaskCard = ({
  id,
  task,
  isOverlay = false,
  color,
}: {
  id?: number;
  task: any;
  isOverlay?: boolean;
  color?: string;
}) => {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id });

  const style = {
    transform: CSS.Transform.toString(transform),
    border: isOverlay ? "none" : `2px solid ${color || "#ccc"}`,
    transition,
  };

  return (
    <div
      ref={!isOverlay ? setNodeRef : null}
      style={style}
      {...(!isOverlay ? attributes : {})}
      className={`task-card  ${isDragging ? "dragging" : ""} ${
        isOverlay ? "overlay" : ""
      }`}
    >
      <div className="task-card__header">
        <div>
          <div
            className="task-card__title"
            onClick={() => console.log("bosildi")}
          >
            {task.name}
          </div>
          <div className="task-card__desc">{task.text_editor}</div>
        </div>

        <HiBars3 className="task-card__menu-icon" {...listeners} />
      </div>

      <div className="task-card__footer">
        <div className="task-card__flag-date">
          <FaFlag color="red" />
          <span>{dayjs(+task.deadline).format("DD.MM.YYYY")}</span>
        </div>
        <FiMoreVertical className="task-card__more-icon" />
      </div>

      <Avatar.Group className="task-card__avatars">
        {task.employees.map((employee: any) => {
          const fullName = employee.fullname;
          const nameParts = fullName.trim().split(" ");
          const initials =
            nameParts.length >= 2
              ? nameParts[0][0].toUpperCase() + nameParts[1][0].toUpperCase()
              : nameParts[0][0].toUpperCase();

          return (
            <Tooltip title={fullName} key={employee.id}>
              <Avatar className="task-card__avatar">{initials}</Avatar>
            </Tooltip>
          );
        })}
      </Avatar.Group>
    </div>
  );
};

export default TaskCard;
