"use client";

import React, { Key, useEffect, useState } from "react";
import { Button, notification, Switch, Table } from "antd";
import { FaPlus, FaRegEdit } from "react-icons/fa";

import { JobTitle } from "@/types/Settings";

import {
  useGetAllIncomeQuery,
  usePatchIncomeStatusMutation,
} from "@/store/slices/settingsApi/SttIncome";
import ModalIncome from "@/components/settings/modal/income/ModalIncome";
import ModalIncomeEdit from "@/components/settings/modal/income/ModalIncomeEdit";

const IncomePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<JobTitle | null>(null);

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  const { data: jobData, isLoading } = useGetAllIncomeQuery();
  const [api, contextHolder] = notification.useNotification();
  const [updateStatus, { isLoading: isLoadStatus }] =
    usePatchIncomeStatusMutation();

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "50%",
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      width: "30%",
      filters: [
        {
          text: "Active",
          value: true,
        },
        {
          text: "Not active",
          value: false,
        },
      ],
      onFilter: (value: boolean | Key, record: JobTitle) =>
        record.is_active === value,
      render: (_: boolean, record: JobTitle) => (
        <Switch
          loading={isLoadStatus}
          checked={record.is_active}
          onChange={async (checked) => {
            await updateStatus({ id: record.id, is_active: checked });
            api.success({ message: "Status changed" });
          }}
        />
      ),
    },
    {
      title: <p style={{ textAlign: "center" }}>Action</p>,
      width: "20%",
      render: (_: JobTitle, record: JobTitle) => (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            cursor: "pointer",
            color: "blue",
          }}
        >
          <FaRegEdit size={20} onClick={() => SetOneEditData(record)} />
        </div>
      ),
    },
  ];

  return (
    <div>
      {contextHolder}
      <div className="table">
        <Table
          loading={isLoading}
          columns={columns}
          dataSource={jobData?.data?.map((item) => ({ ...item, key: item.id }))}
          pagination={false}
        />
        <div className="table-add">
          <Button
            onClick={() => setIsOpen(true)}
            type="primary"
            icon={<FaPlus />}
            iconPosition="end"
          >
            Add Job Title
          </Button>
        </div>
        <ModalIncome open={isOpen} cancel={() => setIsOpen(false)} />
        <ModalIncomeEdit
          open={isOpenEdit}
          cancel={() => setIsOpenEdit(false)}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default IncomePage;
