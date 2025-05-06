"use client";

import React, { Key, useEffect, useState } from "react";
import { Button, notification, Switch, Table } from "antd";
import { FaPlus, FaRegEdit } from "react-icons/fa";

import { JobTitle } from "@/types/Settings";

import {
  useGetAllPtQuery,
  usePatchPtStatusMutation,
} from "@/store/slices/settingsApi/SttPtApi";
import ModalPt from "@/components/settings/modal/project-type/ModalPt";
import ModalPtEdit from "@/components/settings/modal/project-type/ModalPtEdit";

const ProjectTypePage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<JobTitle | null>(null);
  const { data: jobData, isLoading } = useGetAllPtQuery();

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  const [api, contextHolder] = notification.useNotification();
  const [updateStatus, { isLoading: isLoadStatus }] =
    usePatchPtStatusMutation();

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
            Add Country
          </Button>
        </div>
        <ModalPt open={isOpen} cancel={() => setIsOpen(false)} />
        <ModalPtEdit
          open={isOpenEdit}
          cancel={() => setIsOpenEdit(false)}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default ProjectTypePage;
