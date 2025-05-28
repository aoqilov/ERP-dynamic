"use client";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Popconfirm, Table, Tooltip } from "antd";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import dayjs from "dayjs";
import { IoIosArrowDown } from "react-icons/io";
import {
  useDeleteFinanceIncomeMutation,
  useGetFinanceIncomeQuery,
} from "@/store/slices/finance/FinanceIncomeApi";
import { Income, IncomeQueryParams } from "@/types/finance/income";
import IncomeCreate from "@/components/finance/income/IncomeCreate";

const TableIncome = () => {
  const { RangePicker } = DatePicker;

  const [createOpen, SetIsCreateOpen] = useState(false);
  const [editData, SetEditData] = useState<Income | null>(null);
  useEffect(() => {
    if (editData) {
      SetIsCreateOpen(true);
    }
  }, [editData]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const params: IncomeQueryParams | Omit<IncomeQueryParams, "from" | "to"> = {
    page: currentPage,
    page_size: pageSize,
    ...(range && {
      from: range[0].valueOf(),
      to: range[1].valueOf(),
    }),
  };
  const { data, isFetching } = useGetFinanceIncomeQuery(params);
  const [deleteMutation, { isLoading }] = useDeleteFinanceIncomeMutation();

  const columnsIncome = [
    {
      title: "Expense name",
      dataIndex: "project_name",
      key: "expenseName",
      width: "15%",
    },
    {
      title: "Type",
      key: "type",
      render: (incomeType: Income) => (
        <>
          {incomeType.income_types.map((item) => (
            <div key={item.id}>{item.name}</div>
          ))}
        </>
      ),
    },
    {
      title: "Current rate",
      dataIndex: "current_rate",
      key: "currentRate",
    },
    {
      title: "Sales agent",
      dataIndex: "fullname",
      key: "sagent",
      width: "12%",
      render: (item: number, render: Income) => (
        <React.Fragment key={render.id}>
          <p>{render.sales_agent.fullname}</p>
        </React.Fragment>
      ),
    },
    {
      title: "Date",
      dataIndex: "date",
      key: "date",
      render: (item: number) => <p>{dayjs(+item).format("DD.MM.YYYY")}</p>,
    },
    {
      title: "Comment",
      dataIndex: "comment",
      key: "comment",
      width: "20%",
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
      title: "Method",
      dataIndex: "method",
      key: "method",
    },
    {
      title: "Cost",
      dataIndex: "cost",
      key: "cost",
      render: (item: number, render: Income) => (
        <p>
          {render.cost.toLocaleString()} {render.currency}
        </p>
      ),
    },
    {
      title: "Action",
      key: "edit",
      width: "9%",
      render: (item: Income) => (
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
          <Popconfirm
            title="Are you sure to delete?"
            onConfirm={() => deleteMutation({ id: item.id })}
            okText="Yes"
            cancelText="No"
            okButtonProps={{ loading: isLoading }}
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
          <h5 className="info-tit">Income</h5>
          <p className="info-desc">Here you may track financial information</p>
        </div>
        <div className="title-btns">
          <RangePicker
            value={range}
            onChange={(dates) => setRange(dates)}
            format="DD.MM.YYYY"
          />
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
          columns={columnsIncome}
          loading={isFetching}
          dataSource={data?.data}
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
            pageSizeOptions: ["2", "4", "6"],
            total: data?.total_elements,
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>
      <IncomeCreate
        createOpen={createOpen}
        createCloes={() => SetIsCreateOpen(false)}
        editData={editData}
      />
    </div>
  );
};

export default TableIncome;
