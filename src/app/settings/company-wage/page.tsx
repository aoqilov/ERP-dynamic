"use client";

import React, { useEffect, useState } from "react";

import { JobTitle } from "@/types/Settings";

import { Table } from "antd";
import { FaRegEdit } from "react-icons/fa";
import ModalWageEdit from "@/components/settings/modal/wage/ModalWageEdit";
import { useGetAllWageQuery } from "@/store/slices/settingsApi/SttMarginApi";

const WagePage = () => {
  const [isOpenEdit, setIsOpenEdit] = useState(false);
  const [oneEditData, SetOneEditData] = useState<JobTitle | null>(null);

  useEffect(() => {
    if (oneEditData) {
      setIsOpenEdit(true);
    }
  }, [oneEditData]);

  const { data: jobData, isLoading } = useGetAllWageQuery();

  const columns = [
    {
      title: "Title",
      dataIndex: "name",
      key: "name",
      width: "50%",
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

        <ModalWageEdit
          open={isOpenEdit}
          cancel={() => setIsOpenEdit(false)}
          oneData={oneEditData}
        />
      </div>
    </div>
  );
};

export default WagePage;
