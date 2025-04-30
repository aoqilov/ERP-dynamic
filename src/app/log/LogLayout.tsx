"use client";

import useDebounce from "@/hooks/useDebounce";
import { useGetLogAllQuery } from "@/store/slices/LogApi";
import { LogType } from "@/types/Logs";
import { Form, Input, Select, Table, TablePaginationConfig } from "antd";
import { useForm } from "antd/es/form/Form";
import dayjs from "dayjs";
const { Option } = Select;
import React, { useState } from "react";
import { LuCalendarClock } from "react-icons/lu";

const LogLayout = () => {
  const [queryParams, setQueryParams] = useState<formValue>({
    page: 1,
    page_size: 10,
    search: "",
    status: "",
  });

  const [form] = useForm();

  type formValue = {
    page?: number;
    page_size?: number;
    search?: string | undefined;
    status?: string | undefined;
    logname?: string;
  };
  const handleFormChange = (_: formValue, allValues: formValue) => {
    setQueryParams((prev) => ({
      ...prev,
      search: allValues.logname,
      status: allValues.status,
    }));
  };

  // 1 sekund debounce
  const debouncedParams = useDebounce(queryParams, 1000);
  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pagination.current || prev.page,
      page_size: pagination.pageSize || prev.page_size,
    }));
  };
  const { data, isFetching } = useGetLogAllQuery(debouncedParams);
  const getColorByStatus = (status: string) => {
    switch (status) {
      case "not started":
        return "#FCE1AF"; // kulrang
      case "inprogress":
        return "#AFD4FC"; // sariq
      case "testing":
        return "#D9B2D9"; // ko‘k
      case "stoped":
        return "#FFB2B2"; // qizil
      case "finished":
        return "#b7eb8f"; // yashil
      case "archived":
        return "#CDCDCD"; // och kulrang
      default:
        return "#ffffff"; // default oq
    }
  };

  const columns = [
    {
      title: "Project name",
      dataIndex: "project.name",
      key: "1",
      render: (_: LogType, record: LogType) => record.project?.name || "",
    },

    {
      title: "Previous status",
      dataIndex: "previous_status",
      key: "2",
      render: (_: LogType, record: LogType) => {
        const status = record.previous_status; // yoki record.project.status bo'lishi mumkin

        return (
          <p
            style={{
              background: getColorByStatus(status),
              padding: "4px",
              borderRadius: "30px",
              textAlign: "center",
            }}
          >
            {record.previous_status}
          </p>
        );
      },
    },
    {
      title: "Changed status",
      dataIndex: "changed_status",
      key: "3",
      render: (_: LogType, record: LogType) => {
        const status = record.changed_status; // yoki record.project.status bo'lishi mumkin

        return (
          <p
            style={{
              background: getColorByStatus(status),
              padding: "4px",
              borderRadius: "30px",
              textAlign: "center",
            }}
          >
            {record.changed_status}
          </p>
        );
      },
    },
    {
      title: "Previous deadline",
      dataIndex: "previous_deadline",
      key: "4",
      render: (item: LogType) => {
        return (
          <div
            className="time-start"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <LuCalendarClock size={13} color="rgba(104, 102, 102, 1)" />
            <p className="start-text">{dayjs(+item).format("DD.MM.YYYY")}</p>
          </div>
        );
      },
    },
    {
      title: "Changed deadline",
      dataIndex: "changed_deadline",
      key: "5",
      render: (item: LogType) => {
        return (
          <div
            className="time-start"
            style={{ display: "flex", alignItems: "center", gap: "5px" }}
          >
            <LuCalendarClock size={13} color="rgba(104, 102, 102, 1)" />
            <p className="start-text">{dayjs(+item).format("DD.MM.YYYY")}</p>
          </div>
        );
      },
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "6",
    },
    {
      title: "Updated by",
      dataIndex: ["updatedBy,fullname"],
      key: "7",
      render: (_: LogType, record: LogType) => record.updatedBy.fullname || "",
    },
  ];
  return (
    <div className="log">
      <div className="log__header">
        <div className="header-text">Project Logs</div>
        <p className="header-description">
          Here you may see information about projects
        </p>
        <div
          className="header-inputs"
          style={{ display: "flex", alignItems: "center" }}
        >
          <Form className="form" form={form} onValuesChange={handleFormChange}>
            <Form.Item
              name="logname"
              className="role-employes"
              style={{ width: 330 }}
            >
              <Input placeholder="Enter employes" />
            </Form.Item>
            <Form.Item
              name="status"
              className="role-jobs"
              style={{ width: 200 }}
            >
              <Select placeholder="Select job">
                <Option value={"not started"}>Not started</Option>
                <Option value={"inprogress"}>In progress</Option>
                <Option value={"testing"}>Testing</Option>
                <Option value={"stoped"}>Stopped</Option>
                <Option value={"finished"}>Finished</Option>
                <Option value={"archived"}>Archived</Option>
              </Select>
            </Form.Item>
          </Form>
        </div>
      </div>
      <div className="log__table">
        <Table
          columns={columns}
          dataSource={data?.data}
          bordered
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.page_size,
            total: data?.total_elements,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={handleTableChange}
          loading={isFetching}
        />
      </div>
    </div>
  );
};

export default LogLayout;
