"use client";
import React, { useEffect, useState } from "react";
import { Button, DatePicker, Popconfirm, Table, Tooltip } from "antd";
import { FaEdit, FaPlus, FaTrash } from "react-icons/fa";
import {
  useDeleteFinanceExpenseMutation,
  useGetFinanceExpenceQuery,
} from "@/store/slices/finance/FinanceExpenseApi";
import dayjs from "dayjs";
import { Expense, ExpenseQueryParams } from "@/types/finance/expense";
import { IoIosArrowDown } from "react-icons/io";
import ExpenseCreate from "@/components/finance/expense/ExpenseCreate";

const TableExpense = () => {
  const { RangePicker } = DatePicker;

  const [createOpen, SetIsCreateOpen] = useState(false);
  const [editData, SetEditData] = useState<Expense | null>(null);
  useEffect(() => {
    if (editData) {
      SetIsCreateOpen(true);
    }
  }, [editData]);
  const [currentPage, setCurrentPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [range, setRange] = useState<[dayjs.Dayjs, dayjs.Dayjs] | null>(null);
  const params: ExpenseQueryParams | Omit<ExpenseQueryParams, "from" | "to"> = {
    page: currentPage,
    page_size: pageSize,
    ...(range && {
      from: range[0].valueOf(),
      to: range[1].valueOf(),
    }),
  };
  const { data, isFetching } = useGetFinanceExpenceQuery(params);
  const [deleteMutation, { isLoading }] = useDeleteFinanceExpenseMutation();
  console.log(data);

  const columns = [
    {
      title: "Expense name",
      dataIndex: "project_name",
      key: "expenseName",
      width: "15%",
    },
    {
      title: "Type",
      key: "type",
      render: (expenseTypes: Expense) => (
        <>
          {expenseTypes.expense_types.map((item) => (
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
    },
    {
      title: "Action",
      key: "edit",
      width: "9%",
      render: (item: Expense) => (
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
      ), // Bu yerga button yoki ikoncha qo‘shishingiz mumkin
    },
  ];
  return (
    <div className="expense">
      <div className="expense__title">
        <div className="title-info">
          <h5 className="info-tit">Expenses</h5>
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
      <div className="expense__table">
        <Table
          rowKey={"id"}
          columns={columns}
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
                  {data.per_currency[0].currency}:
                  {data.per_currency[0].total_cost}
                </div>
              </div>
            ) : null
          }
          pagination={{
            position: ["bottomRight"],
            // ikkala tomonda

            current: currentPage,
            pageSize: pageSize,
            showSizeChanger: true, // bu "10 / page" dropdownni chiqaradi
            pageSizeOptions: ["2", "4", "6"], // allowed page sizes
            total: data?.total_elements, // umumiy sahifalar soni
            onChange: (page, size) => {
              setCurrentPage(page);
              setPageSize(size);
            },
          }}
        />
      </div>
      <ExpenseCreate
        createOpen={createOpen}
        createCloes={() => SetIsCreateOpen(false)}
        editData={editData}
      />
    </div>
  );
};

export default TableExpense;
