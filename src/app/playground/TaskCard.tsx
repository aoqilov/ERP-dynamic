import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar } from "antd";
import { FaFlag } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { HiBars3 } from "react-icons/hi2";
import "./../../wscss/components/playground/playtaskcard.scss";

const TaskCard = ({ task }) => {
  const { attributes, listeners, setNodeRef, transform, transition } =
    useSortable({ id: task.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  return (
    <div
      ref={setNodeRef}
      {...attributes}
      {...listeners}
      style={style}
      className="bg-white rounded p-2 shadow mb-2 border cursor-pointer"
    >
      <div className="task-card" style={{ border: "1px solid #1890ff50" }}>
        <div className="task-card__header">
          <div>
            <div className="task-card__title">gre</div>
            <div className="task-card__desc">edw</div>
          </div>
          <HiBars3 className="task-card__menu-icon" />
        </div>

        <div className="task-card__footer">
          <div className="task-card__flag-date">
            <FaFlag color="red" />
            <span>06.06.2025</span>
          </div>

          <FiMoreVertical className="task-card__more-icon" />
        </div>

        <Avatar.Group className="task-card__avatars">
          <Avatar
            size="small"
            style={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              marginRight: -4, // 👈 zichlashtirish
              border: "2px solid white", // ixtiyoriy
            }}
          >
            R
          </Avatar>
          <Avatar
            style={{
              color: "#f56a00",
              backgroundColor: "#fde3cf",
              marginRight: -4, // 👈 zichlashtirish
              border: "2px solid white", // ixtiyoriy
            }}
            size="small"
          >
            Y
          </Avatar>
        </Avatar.Group>
      </div>
    </div>
  );
};

export default TaskCard;
