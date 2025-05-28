"use client";
import React, { useEffect, useState } from "react";
import { Button, Popconfirm, Table, Tooltip } from "antd";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import { IoIosArrowDown } from "react-icons/io";
import { IoCardOutline } from "react-icons/io5";
import { FaRegCommentDots } from "react-icons/fa6";
import {
  useDeleteFinanceSupportMutation,
  useGetFinanceSupportQuery,
} from "@/store/slices/finance/FinanceSupportApi";
import { Support } from "@/types/finance/support";
import SupportCreateEdit from "@/components/finance/support/SupportCreateEdit";
import SupportPayment from "@/components/finance/support/SupportPayment";
import SupportSms from "@/components/finance/support/SupportSms";

const TableSupport = () => {
  const [createOpen, SetIsCreateOpen] = useState(false);
  const [paymentOpen, SetIsPaymentOpen] = useState(false);
  const [smsOpen, SetIsSmsOpen] = useState(false);
  const [editData, SetEditData] = useState<Support | null>(null);
  const [paymentData, setPaymentData] = useState<Support | null>(null);
  const [smsData, SetIsSmsData] = useState<Support | null>(null);

  useEffect(() => {
    if (editData) {
      SetIsCreateOpen(true);
    }
  }, [editData]);

  useEffect(() => {
    if (paymentData) {
      SetIsPaymentOpen(true);
    }
  }, [paymentData]);

  useEffect(() => {
    if (smsData) {
      SetIsSmsOpen(true);
    }
  }, [smsData]);

  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [deleteMutation, { isLoading: deleteLoading }] =
    useDeleteFinanceSupportMutation();

  const { data, isFetching } = useGetFinanceSupportQuery({
    page: currentPage,
    page_size: pageSize,
  });

  const columnsSupport = [
    {
      title: "Project name",
      dataIndex: "project_name",
      key: "Projectname",
      width: "15%",
    },
    {
      title: "Contact",
      dataIndex: "phone_number",
      key: "Contact",
      width: "15%",
    },
    {
      title: "Pay date",
      dataIndex: "pay_date",
      key: "Paydate",
    },
    {
      title: "Balance",
      dataIndex: "balance",
      key: "Balance",
      render: (item: number) => (
        <p style={{ color: "green", fontWeight: "bold" }}>
          {item.toLocaleString("ru-RU")}
        </p>
      ),
    },
    {
      title: "Pay type	",
      dataIndex: ["currency", "name"],
      key: "date",
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "15%",
      ellipsis: true,
      render: (text: string) => {
        const isEmpty = !text;
        return (
          <Tooltip title={text}>
            <div
              style={{
                whiteSpace: "nowrap",
                overflow: "hidden",
                textOverflow: "ellipsis",
                display: "flex",
                alignItems: "center",
                justifyContent: isEmpty ? "flex-end" : "space-between",
              }}
            >
              {isEmpty ? (
                <>
                  <IoIosArrowDown />
                </>
              ) : (
                <>
                  {text}
                  <IoIosArrowDown />
                </>
              )}
            </div>
          </Tooltip>
        );
      },
    },

    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (item: number, render: Support) => (
        <p>
          {render.cost.toLocaleString()} {render.currency.name}
        </p>
      ),
    },
    {
      title: "Edit",
      key: "edit",
      width: "15%",
      render: (item: Support) => (
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          <div style={{ cursor: "pointer" }} onClick={() => SetEditData(item)}>
            <FaEdit color="blue" />
          </div>
          <div
            style={{ cursor: "pointer" }}
            onClick={() => setPaymentData(item)}
          >
            <IoCardOutline />
          </div>
          <div style={{ cursor: "pointer" }} onClick={() => SetIsSmsData(item)}>
            <FaRegCommentDots />
          </div>
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteMutation({ id: item.id })}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: deleteLoading }}
          >
            <div style={{ cursor: "pointer" }}>
              <FaTrash color="red" />
            </div>
          </Popconfirm>
        </div>
      ),
    },
  ];
  return (
    <div className="income">
      <div className="income__title">
        <div className="title-info">
          <h5 className="info-tit">Support</h5>
          <p className="info-desc">Here you may track financial information</p>
        </div>
        <div className="title-btns">
          <Button
            type="primary"
            icon={<FaPlus />}
            iconPosition="start"
            onClick={() => SetIsCreateOpen(true)}
          >
            Add expense
          </Button>
        </div>
      </div>
      <div className="income__table">
        <Table
          rowKey={"id"}
          columns={columnsSupport}
          dataSource={data?.data}
          loading={isFetching}
          footer={() =>
            data?.per_currency ? (
              <div style={{ display: "flex", justifyContent: "end" }}>
                <div
                  style={{
                    fontWeight: "bold",
                    background: "#739BFF",
                    borderRadius: 8,
                    padding: 10,
                    color: "white",
                    width: 150,
                  }}
                >
                  {data.per_currency.map((item) => (
                    <p key={item.currency}>
                      {item.currency + ": " + item.total_cost}
                    </p>
                  ))}
                </div>
              </div>
            ) : null
          }
          pagination={{
            position: ["bottomRight"],
            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true,
            total: data?.total_pages,
            pageSizeOptions: ["10", "20", "50"],
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>
      <SupportCreateEdit
        createOpen={createOpen}
        createCloes={() => SetIsCreateOpen(false)}
        editData={editData}
      />
      <SupportPayment
        paymentOpen={paymentOpen}
        paymentCloes={() => SetIsPaymentOpen(false)}
        paymentData={paymentData}
      />
      <SupportSms
        smsOpen={smsOpen}
        smsCloes={() => SetIsSmsOpen(false)}
        smsData={smsData}
      />
    </div>
  );
};

export default TableSupport;
