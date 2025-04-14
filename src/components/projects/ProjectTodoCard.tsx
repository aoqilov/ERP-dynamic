// ProjectTodoCard.tsx
"use client";
import React from "react";
import "@/wscss/components/projects/_projectTodoCard.scss";
import { FaRegEdit } from "react-icons/fa";
import { FiDelete } from "react-icons/fi";

import { todoType } from "@/types/Project";
import {
  useDeleteProjectTodoMutation,
  useGetProjectByTodoQuery,
  useUpdateProjectTodoMutation,
} from "@/store/slices/ProjectsApi";
import { message, Popconfirm } from "antd";

type propsTodoCard = {
  idTodo: string | undefined;
  editTodo: (id: number) => void;
};
const ProjectTodoCard: React.FC<propsTodoCard> = ({ idTodo, editTodo }) => {
  const [messageApi, contextHolder] = message.useMessage();

  const { data: todos, isLoading, isError } = useGetProjectByTodoQuery(idTodo);
  const [updateChecked] = useUpdateProjectTodoMutation();
  const [deleteTodo, { isLoading: isDeleting }] =
    useDeleteProjectTodoMutation();

  const handleCheckboxChange = async (
    e: React.ChangeEvent<HTMLInputElement>,
    item: todoType
  ) => {
    const newChecked = e.target.checked;
    try {
      await updateChecked({
        id: item.id,
        is_checked: newChecked,
        // Agar boshqa fieldlar ham kerak bo'lsa qo'shishingiz mumkin
      }).unwrap();
      messageApi.success("Checkbox yangilandi");
    } catch (error) {
      messageApi.error("Yangilashda xatolik yuz berdi");
      console.error("Xatolik:", error);
    }
  };
  const handleDelete = async (id: number) => {
    try {
      await deleteTodo(id).unwrap();
      messageApi.success("Muvaffaqiyatli o‘chirildi");
    } catch (error) {
      console.error("O‘chirishda xatolik:", error);
      messageApi.error("Xatolik yuz berdi");
    }
  };

  console.log(todos?.data);
  if (isLoading) {
    return <p>todoo loading</p>;
  }
  if (isError) {
    console.error("err");
  }
  return (
    <div>
      {contextHolder}

      {todos?.data?.length > 0 ? (
        todos?.data.map((item: todoType) => (
          <div className="todo-card" key={item.id}>
            <div className={`card-checkbox ${item.is_checked ? "active" : ""}`}>
              <input
                type="checkbox"
                className="checkbox-input"
                checked={item.is_checked}
                onChange={(e) => handleCheckboxChange(e, item)}
              />
              {item.name}
            </div>
            <div className="card-btns">
              <FaRegEdit
                className="btn-edit"
                onClick={() => editTodo(item.id)}
              />
              <Popconfirm
                title="Are you sure delete this list ?"
                description="Some descriptions"
                okText="Yes"
                cancelText="No"
                onConfirm={() => handleDelete(item.id)}
                okButtonProps={{ loading: isDeleting }}
              >
                <FiDelete className="btn-edit" />
              </Popconfirm>
            </div>
          </div>
        ))
      ) : (
        <div className="nodata">Any information left?</div>
      )}
    </div>
  );
};

export default ProjectTodoCard;
