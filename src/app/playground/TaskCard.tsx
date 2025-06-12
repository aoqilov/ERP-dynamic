/* eslint-disable @typescript-eslint/no-explicit-any */
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Avatar, Dropdown, MenuProps, Popconfirm, Tooltip } from "antd";
import { FaFlag } from "react-icons/fa";
import { FiMoreVertical } from "react-icons/fi";
import { HiBars3, HiOutlinePencil } from "react-icons/hi2";
import dayjs from "dayjs";
import "../../wscss/components/playground/playtaskcard.scss";
import { GoTrash } from "react-icons/go";
import { useDeletePlaygroundCardMutation } from "@/store/slices/playground/PlaygroundApi";
//
// for dropdown menu

const TaskCard = ({
  id,
  task,
  isOverlay = false,
  color,
  setSelectedTask,
}: {
  id: number; // make id required
  task: any;
  isOverlay?: boolean;
  color?: string;
  setSelectedTask: any;
}) => {
  // mutation for creating or editing a task
  const [deleteCard, { isLoading: isDeleteLoading }] =
    useDeletePlaygroundCardMutation();
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
          onConfirm={() => deleteCard({ id: task.id }).unwrap()}
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

  // dnd-kit sortable
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
    <>
      {/* for card */}
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
            <div className="task-card__title">{task.name}</div>
            <div className="task-card__desc">{task.text_editor}</div>
          </div>

          <HiBars3 className="task-card__menu-icon" {...listeners} />
        </div>

        <div className="task-card__footer">
          <div className="task-card__flag-date">
            <FaFlag color="red" />
            <span>{dayjs(+task.deadline).format("DD.MM.YYYY")}</span>
          </div>
          <span>
            <Dropdown
              menu={{
                items: itemsMore,
                onClick: ({ key }) => {
                  if (key === "edit") {
                    setSelectedTask(task);
                  }
                },
              }}
              trigger={["hover"]}
            >
              <FiMoreVertical className="task-card__more-icon" />
            </Dropdown>
          </span>
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
    </>
  );
};

export default TaskCard;
