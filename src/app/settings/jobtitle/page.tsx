"use client";

import React, { useEffect, useState } from "react";
import { Button, Switch, Table } from "antd";
import { FaPlus, FaRegEdit } from "react-icons/fa";
import {
  useGetAllJobTitlesQuery,
  usePatchJobStatusMutation,
} from "@/store/slices/SettingsApi";
import { JobTitle } from "@/types/Settings";
import ModalJobEdit from "@/components/settings/modal/jobtitle/ModalJobEdit";
import ModalJob from "@/components/settings/modal/jobtitle/ModalJob";

const Jobtitlepage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<JobTitle | null>(null);

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  const { data: jobData, isLoading } = useGetAllJobTitlesQuery();
  const [updateStatus] = usePatchJobStatusMutation();
  console.log(jobData?.data);

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
      render: (item: JobTitle, record: JobTitle) => {
        console.log(item);

        return (
          <Switch
            defaultChecked={record.is_active}
            onChange={(checked) =>
              updateStatus({ id: record.id, is_active: checked })
            }
          />
        );
      },
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
        <ModalJob open={isOpen} cancel={() => setIsOpen(false)} />
        <ModalJobEdit
          open={isOpenEdit}
          cancel={() => setIsOpenEdit(false)}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default Jobtitlepage;
