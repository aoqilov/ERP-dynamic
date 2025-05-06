"use client";

import React, { useEffect, useState } from "react";
import { Button, notification, Switch, Table } from "antd";
import { FaPlus, FaRegEdit } from "react-icons/fa";

import { CurrencyType } from "@/types/Settings";
import ModalCurrency from "@/components/settings/modal/currency/ModalCurrency";
import ModalCurrencyEdit from "@/components/settings/modal/currency/ModalCurrencyEdit";
import {
  useGetAllCurrencyQuery,
  usePatchCurrencyStatusMutation,
} from "@/store/slices/settingsApi/SttCurrencyApi";

const CurrencyPage = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<CurrencyType | null>(null);

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  const { data: jobData, isLoading } = useGetAllCurrencyQuery();
  const [api, contextHolder] = notification.useNotification();
  const [updateStatus, { isLoading: isLoadStatus }] =
    usePatchCurrencyStatusMutation();

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
      title: "Current Rate",
      dataIndex: "rate",
      key: "rate",
      width: "20%",
      render: (rate: number) => rate.toLocaleString("ru-RU"),
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
        <ModalCurrency open={isOpen} cancel={() => setIsOpen(false)} />
        <ModalCurrencyEdit
          open={isOpenEdit}
          cancel={() => setIsOpenEdit(false)}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default CurrencyPage;
