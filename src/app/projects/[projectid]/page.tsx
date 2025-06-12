"use client";

import {
  useCreateProjectTodoMutation,
  useGetProjectByIdQuery,
  useGetProjectByTodoQuery,
  useUpdateProjectTodoMutation,
  useUpdateSinglePageMutation,
} from "@/store/slices/ProjectsApi";
import { skipToken } from "@reduxjs/toolkit/query";
import { Button, Form, Input, message } from "antd";
import { useRouter, useParams } from "next/navigation";
import React, { useEffect, useState } from "react";

import { IoIosArrowBack } from "react-icons/io";
import { LuCalendarClock } from "react-icons/lu";
import { MdOutlineCheck } from "react-icons/md";
import ProjectTodoCard from "@/components/projects/ProjectTodoCard";
import "@/wscss/components/projects/projectSingle.scss";
import dayjs from "dayjs";
import { todoType } from "@/types/Project";

const ProjectOnePage = () => {
  const router = useRouter();
  const params = useParams();
  const id =
    typeof params?.projectid === "string" ? params.projectid : undefined;
  const [todoId, setTodoId] = useState(0);
  const [createTodoRequest, { isLoading: isCreating }] =
    useCreateProjectTodoMutation();
  const [messageApi, contextHolder] = message.useMessage();
  const { data: todos } = useGetProjectByTodoQuery(id);
  const [updateSingleProject, { isLoading: isUpdatingProject }] =
    useUpdateSinglePageMutation();

  const {
    data: project,
    isLoading,
    error,
  } = useGetProjectByIdQuery(id ?? skipToken);
  const [update, { isLoading: loadPatching }] = useUpdateProjectTodoMutation();

  const [form] = Form.useForm();
  useEffect(() => {
    const contentElement = document.querySelector(".content");
    if (contentElement) {
      contentElement.classList.add("scroll-content");
    }
    return () => {
      if (contentElement) {
        contentElement.classList.remove("scroll-content");
      }
    };
  }, []);

  useEffect(() => {
    // for form
    if (project?.data) {
      form.setFieldsValue({
        client_name: project.data.client_name,
        client_phone_number: project.data.client_phone_number,
        description: project.data.description,
      });
    }
    //  for body scrool
  }, [project, todos, form]);

  if (isLoading) return <p>Yuklanmoqda pppp...</p>;
  if (error) return <p>Xatolik yuz berdi</p>;
  const { name, deadline, start } = project?.data ?? {};

  async function saveProjectInfo() {
    try {
      const values = await form.validateFields([
        "client_name",
        "client_phone_number",
        "description",
      ]);

      await updateSingleProject({
        id: Number(id),
        ...values,
      }).unwrap();

      messageApi.success("Project info updated successfully");
    } catch (error) {
      console.error("Update error:", error);
      messageApi.error("Failed to update project info");
    }
  }

  function editTodo(id: number): void {
    if (todos?.data) {
      const someTodo = todos?.data.find((item: todoType) => item.id === id);
      form.setFieldsValue({
        todoname: someTodo?.name,
      });
      setTodoId(someTodo.id);
    }
  }
  async function editPatching() {
    try {
      const values = await form.validateFields(["todoname"]); // bu avtomatik error message ko‘rsatadi
      const todoname = values.todoname;

      await update({ id: todoId, name: todoname }).unwrap();
      messageApi.success("Success changed");
      form.resetFields();
      setTodoId(0);
    } catch (error) {
      console.error("Xatolik:", error);
      messageApi.error("wrong");
      // istasangiz errorni foydalanuvchiga ko‘rsatish uchun alert yozish mumkin
    }
  }

  // create
  async function createTodo() {
    try {
      const values = await form.validateFields(["todoname"]);
      const todoname = values.todoname;

      const payload = {
        name: todoname,
      };

      await createTodoRequest({ id: Number(id), newProject: payload }).unwrap();

      messageApi.success("Successfully added");
      form.resetFields(["todoname"]);
    } catch (error) {
      console.error("Xatolik:", error);
      messageApi.error("Xatolik yuz berdi");
    }
  }

  return (
    <div className="single">
      {contextHolder}
      <div className="single__header">
        <div className="header-navigate-icon" onClick={() => router.back()}>
          <IoIosArrowBack /> Back to main page
        </div>
        <div className="header__save-btn">
          <Button
            onClick={saveProjectInfo}
            loading={isUpdatingProject}
            iconPosition="end"
            icon={<MdOutlineCheck />}
            type="primary"
          >
            Save
          </Button>
        </div>
      </div>
      <div className="single__box">
        <div className="box-detail">
          <div className="detail-namebox">
            <h5>{name}</h5>
            <p>Detailed information about project</p>
          </div>
          <div className="detail-chart">17%</div>
          <div className="detail-data">
            {/* start */}
            <div className="time-start">
              <LuCalendarClock size={13} color="rgba(104, 102, 102, 1)" />
              <p className="start-text">
                {dayjs(Number(start)).format("YYYY/MM/DD")}
              </p>
            </div>
            {/* end */}
            <div className="time-start">
              <LuCalendarClock size={13} color="rgba(104, 102, 102, 1)" />
              <p className="start-text">
                {" "}
                {dayjs(Number(deadline)).format("YYYY/MM/DD")}
              </p>
            </div>
          </div>
          <Form layout="vertical" className="detail-form" form={form}>
            <Form.Item label="Client name" name="client_name">
              <Input placeholder="" variant="underlined" />
            </Form.Item>

            <Form.Item label="Client phone number" name="client_phone_number">
              <Input placeholder="" variant="underlined" />
            </Form.Item>

            <Form.Item label="About" name="description">
              <Input placeholder="" variant="underlined" />
            </Form.Item>
          </Form>
        </div>
        <div className="box-todo">
          <div className="todo__header">
            <div className="header-topline"></div>
            <div className="header-text">Additional information</div>
          </div>
          <div className="todo__cards">
            <ProjectTodoCard idTodo={id} editTodo={(id) => editTodo(id)} />
          </div>
          <div className="todo__form">
            <Form className="form-form" form={form}>
              <Form.Item
                className="label"
                name="todoname"
                rules={[
                  {
                    required: true,
                    message: "required",
                  },
                ]}
              >
                <Input placeholder="Title..." width={"70%"} />
              </Form.Item>
            </Form>
            {todoId ? (
              <Button
                type="default"
                loading={loadPatching}
                onClick={editPatching}
              >
                Edit info
              </Button>
            ) : (
              <Button type="default" onClick={createTodo} loading={isCreating}>
                Add info +
              </Button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProjectOnePage;
