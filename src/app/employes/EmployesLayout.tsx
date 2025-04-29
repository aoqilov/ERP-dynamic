"use client";
import React, { useEffect, useState } from "react";
import {
  Button,
  Form,
  Input,
  Popconfirm,
  Select,
  Table,
  TablePaginationConfig,
} from "antd";

const { Option } = Select;
import {} from "antd";
import {
  useDeleteEmployeMutation,
  useGetEmployesAllQuery,
} from "@/store/slices/EmployesApi";
import { EmployesType } from "@/types/Employes";
import useFormattedDate from "@/hooks/hookTimeToNum";
import { HiMiniUserCircle } from "react-icons/hi2";
import { FaPlus } from "react-icons/fa6";
import { LiaEdit } from "react-icons/lia";
import { RiDeleteBack2Line } from "react-icons/ri";
import ModalCreateEmployes from "@/components/employes/ModalCreateEmployes";
import ModalUpdate from "@/components/employes/ModalUpdate";
import { useForm } from "antd/es/form/Form";

const EmployesLayout = () => {
  type HeaderInput = {
    page?: number;
    page_size?: number;
    search?: string;
    employes?: string;
    job?: number | string;
  };
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isModalEditOpen, setIsModalEditOpen] = useState(false);
  const [oneEmployerData, setOneEmployerData] = useState<EmployesType | null>(
    null
  );

  const useDebounce = (value: HeaderInput, delay: number) => {
    const [debounced, setDebounced] = useState(value);

    useEffect(() => {
      const handler = setTimeout(() => setDebounced(value), delay);
      return () => clearTimeout(handler);
    }, [value, delay]);

    return debounced;
  };
  const [queryParams, setQueryParams] = useState<HeaderInput>({
    page: 1,
    page_size: 10,
    search: "",
  });
  const handleFormChange = (_: HeaderInput, allValues: HeaderInput) => {
    const newParams: HeaderInput = { ...queryParams };

    if (allValues.job !== undefined) {
      newParams.job = allValues.job || "";
    }

    setQueryParams(newParams);
  };

  const debouncedParams = useDebounce(queryParams, 1000); // 3 sekund delay

  // RTK
  // get
  const {
    data: employers,
    isLoading,
    isFetching,
  } = useGetEmployesAllQuery(debouncedParams);

  const [form] = useForm();

  const handleTableChange = (pagination: TablePaginationConfig) => {
    setQueryParams((prev) => ({
      ...prev,
      page: pagination.current || prev.page,
      page_size: pagination.pageSize || prev.page_size,
    }));
  };

  console.log(employers);
  // delete
  const [deleteEmploye] = useDeleteEmployeMutation();
  //
  // FORM
  const formatCustom = useFormattedDate();

  useEffect(() => {
    if (oneEmployerData) {
      setIsModalEditOpen(true);
    }
  }, [oneEmployerData]);

  if (isLoading) return <p>loading...</p>;
  const columns = [
    {
      title: "Full name",
      dataIndex: "fullname",
      key: "fullname",
      render: (_: EmployesType, record: EmployesType) => (
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HiMiniUserCircle size={35} color="#0C5880" />
          <div>
            <div>{record.fullname}</div>
            <div style={{ color: "#999" }}>{record.phone_number}</div>
          </div>
        </div>
      ),
    },
    {
      title: "Birth date",
      dataIndex: "birth_date",
      key: "birth_date",
      render: (value: string) => formatCustom(value),
    },
    {
      title: "Job title",
      dataIndex: ["job_title", "name"],
      key: "job_title",
    },
    {
      title: "Salary",
      dataIndex: "salary",
      key: "salary",
    },
    {
      title: "Address",
      dataIndex: "address",
      key: "address",
    },
    {
      title: "Company",
      dataIndex: ["company", 0, "name"],
      key: "company",
    },
    {
      title: "Date of join",
      dataIndex: "date_join",
      key: "date_join",
      render: (value: string) => formatCustom(value),
    },
    {
      title: "Edit",
      key: "edit",
      render: (item: EmployesType) => (
        <div className="e_columns-action">
          <div
            onClick={() => {
              setOneEmployerData(item);
            }}
            className="action-icon"
          >
            <LiaEdit size={20} color="#624DE3" />
          </div>
          <Popconfirm
            title="Delete the task"
            description="Are you sure to delete this task?"
            okText="Yes"
            cancelText="No"
            onConfirm={() => deleteEmploye(item.id)}
          >
            <div className="action-icon">
              <RiDeleteBack2Line size={20} color="#B53F42" />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];

  return (
    <div className="employes">
      <div className="employes__header">
        <div className="header-text">CEO</div>
        <p className="header-description">
          Here you may see information about employees
        </p>
        <div className="header-inputs">
          <Form form={form} onValuesChange={handleFormChange}>
            <div className="inputs-role">
              {/* Employes input */}
              <Form.Item
                name="employes"
                className="role-employes"
                style={{ width: 330 }}
              >
                <Input placeholder="Enter employes" />
              </Form.Item>

              {/* Job select */}
              <Form.Item
                name="job"
                className="role-jobs"
                style={{ width: 200 }}
              >
                <Select placeholder="Select job">
                  <Option value={0}>All</Option>
                  <Option value={1}>Backend Developer</Option>
                  <Option value={2}>CEO</Option>
                </Select>
              </Form.Item>

              {/* Company select */}
              <Form.Item name="company" className="role-company">
                <Select placeholder="Select company">
                  <Option value="">All</Option>
                  <Option value="1">Dynamic</Option>
                </Select>
              </Form.Item>
            </div>
          </Form>
          <Button
            onClick={() => setIsModalOpen(true)}
            icon={<FaPlus size={22} />}
            type="primary"
            iconPosition="start"
            className="input-add"
            style={{ padding: 20, borderRadius: 20, fontSize: 18 }}
          >
            Add employer
          </Button>
        </div>
      </div>
      <div className="employes__table">
        <Table
          columns={columns}
          dataSource={employers?.data?.map((item: EmployesType) => ({
            ...item,
            key: item.id, // yoki item._id bo'lishi mumkin
          }))}
          pagination={{
            current: queryParams.page,
            pageSize: queryParams.page_size,
            total: employers?.total_elements,
            showSizeChanger: true,
            pageSizeOptions: ["10", "20", "50"],
          }}
          onChange={handleTableChange}
          loading={isFetching}
        />
        <ModalCreateEmployes
          open={isModalOpen}
          onCancel={() => setIsModalOpen(false)}
        />
        <ModalUpdate
          open={isModalEditOpen}
          onCancel={() => setIsModalEditOpen(false)}
          oneEmploye={oneEmployerData}
        />
      </div>
    </div>
  );
};

export default EmployesLayout;
