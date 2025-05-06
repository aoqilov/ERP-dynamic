"use client";

import React, { useEffect, useState } from "react";
import { Button, ColorPicker, notification, Switch, Table } from "antd";
import { FaPlus, FaRegEdit } from "react-icons/fa";

import { CurrencyType } from "@/types/Settings";

import {
  useGetAllCanbanQuery,
  usePatchCanbanStatusMutation,
} from "@/store/slices/settingsApi/SttCanbanApi";
import ModalCanban from "@/components/settings/modal/canban/ModalCanban";
import ModalCanbanEdit from "@/components/settings/modal/canban/ModalCanbanEdit";

const CanbanPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<CurrencyType | null>(null);
  const { data: jobData, isLoading, refetch } = useGetAllCanbanQuery();

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  useEffect(() => {
    refetch();
  }, [isOpenEdit]);

  const [api, contextHolder] = notification.useNotification();
  const [updateStatus, { isLoading: isLoadStatus }] =
    usePatchCanbanStatusMutation();

  const statusFilters = [
    { text: "Active", value: true },
    { text: "Inactive", value: false },
  ];

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "40%",
    },
    {
      title: "Color",
      dataIndex: "color",
      key: "color",
      width: "20%",
      render: (item: string, record: CurrencyType) => (
        <ColorPicker
          defaultValue={record.color}
          style={{ cursor: "not-allowed" }}
        />
      ),
    },
    {
      title: "Status",
      dataIndex: "is_active",
      key: "status",
      width: "20%",
      filters: statusFilters,
      onFilter: (value: boolean | React.Key, record: CurrencyType) =>
        record.is_active === (value as boolean),
      render: (_: CurrencyType, record: CurrencyType) => (
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
      render: (_: CurrencyType, record: CurrencyType) => (
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
        <ModalCanban open={isOpen} cancel={() => setIsOpen(false)} />
        <ModalCanbanEdit
          key={oneEditData?.id}
          open={isOpenEdit}
          cancel={() => {
            setIsOpenEdit(false);
          }}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default CanbanPage;
