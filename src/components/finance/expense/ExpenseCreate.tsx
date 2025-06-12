import {
  useCreateFinanceExpenseMutation,
  useUpdateFinanceExpenseMutation,
} from "@/store/slices/finance/FinanceExpenseApi";
import { useGetActiveCurrencyQuery } from "@/store/slices/settingsApi/SttCurrencyApi";
import { useGetAllExpenceQuery } from "@/store/slices/settingsApi/SttExpenceApi";
import { Expense, ExpenseSubmitPayload } from "@/types/finance/expense";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import dayjs from "dayjs";
import React, { useEffect } from "react";

type PropsCreate = {
  createOpen: boolean;
  createCloes: () => void;
  editData?: Expense | null; // yangi qo‘shildi
};
const ExpenseCreate: React.FC<PropsCreate> = ({
  createOpen,
  createCloes,
  editData,
}) => {
  // rtk
  const [createMutate, { isLoading }] = useCreateFinanceExpenseMutation();
  const [updateMutate, { isLoading: isLoadingUpdate }] =
    useUpdateFinanceExpenseMutation();

  const { data: forSelectExpense } = useGetAllExpenceQuery();
  const { data: forSelectCurrency } = useGetActiveCurrencyQuery();
  // mutation

  //
  const { Option } = Select;
  const [form] = Form.useForm();
  const [api, context] = notification.useNotification();

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        ...editData,
        date: dayjs(+editData.date),
        expense_types: editData.expense_types.map((e) => e.id),
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async (values: Expense) => {
    const joinDateMs = dayjs(values.date).valueOf();
    const newData: ExpenseSubmitPayload = {
      ...values,
      date: String(joinDateMs),
      cost: +values.cost,
      current_rate: +values.current_rate,
      expense_types: Array.isArray(values.expense_types)
        ? values.expense_types.map((item: any) => ({
            id:
              typeof item === "object" && item !== null
                ? typeof item.id === "number"
                  ? item.id
                  : typeof item.id === "object" &&
                    item.id !== null &&
                    "id" in item.id
                  ? (item.id as any).id
                  : Number(item.id)
                : Number(item),
          }))
        : [{ id: Number(values.expense_types) }],
    };

    try {
      if (editData) {
        const resUp = await updateMutate({
          id: editData.id,
          data: newData,
        }).unwrap();
        api.success({ message: resUp.message });
      } else {
        const resCre = await createMutate(newData).unwrap();
        api.success({ message: resCre.message });
      }
      form.resetFields();
      createCloes();
    } catch (error) {
      console.error(" Error submitting:", error);
    }
  };

  return (
    <div>
      {context}
      <Modal
        width={"80%"}
        open={createOpen}
        footer={null}
        onCancel={createCloes}
        title={editData ? "Edit income" : "Add Add Income"}
        style={{ position: "relative", top: "50px" }}
      >
        <p>Fill in the details for the new expence.</p>
        <div style={{ paddingTop: "50px" }}>
          <Form layout="vertical" onFinish={handleSubmit} form={form}>
            <Row gutter={16}>
              <Col span={8}>
                <Form.Item
                  name="project_name"
                  label="Name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="write full name..." size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="expense_types"
                  label="Income type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select expense type" size="large">
                    {forSelectExpense?.data.map((item) => (
                      <Option key={item.id} value={item.id}>
                        {item.name}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="method"
                  label="Method"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select curency" size="large">
                    <Option value={"cash"}>Cash</Option>
                    <Option value={"card"}>Card</Option>
                    <Option value={"bank"}>Bank</Option>
                  </Select>
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="date"
                  label="Date"
                  rules={[{ required: true }]}
                >
                  <DatePicker
                    style={{ width: "100%" }}
                    format="DD/MM/YYYY"
                    placeholder="DD/MM/YYYY"
                    size="large"
                  />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="comment"
                  label="Comment"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="write full name..." size="large" />
                </Form.Item>
              </Col>

              <Col span={5}>
                <Form.Item
                  name="cost"
                  label="Cost"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Enter amount..."
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }
                  />
                </Form.Item>
              </Col>
              <Col span={3}>
                <Form.Item
                  name="currency"
                  label=" "
                  rules={[{ required: true }]}
                >
                  <Select
                    placeholder="Select currency"
                    size="large"
                    onChange={(selectedName) => {
                      const selectedCurrency = forSelectCurrency?.data.find(
                        (item) => item.name === selectedName
                      );
                      if (selectedCurrency) {
                        form.setFieldsValue({
                          current_rate: selectedCurrency.rate,
                        });
                      }
                    }}
                  >
                    {forSelectCurrency?.data.map((item) => (
                      <Select.Option key={item.id} value={item.name}>
                        {item.name}
                      </Select.Option>
                    ))}
                  </Select>
                </Form.Item>
              </Col>

              <Col span={8}>
                <Form.Item
                  name="current_rate"
                  label="Current currency rate"
                  rules={[{ required: true }]}
                >
                  <InputNumber
                    style={{ width: "100%" }}
                    size="large"
                    placeholder="Enter amount..."
                    formatter={(value) =>
                      `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                    }
                  />
                </Form.Item>
              </Col>
            </Row>
            <Form.Item style={{ textAlign: "right" }}>
              <Button onClick={createCloes} style={{ marginRight: 8 }}>
                Cancel
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                loading={editData ? isLoadingUpdate : isLoading}
              >
                Save
              </Button>
            </Form.Item>
          </Form>
        </div>
      </Modal>
    </div>
  );
};

export default ExpenseCreate;
