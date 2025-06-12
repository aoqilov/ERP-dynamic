import {
  useCreateFinanceIncomeMutation,
  useGetFinanceIncomeSalesQuery,
  useUpdateFinanceIncomeMutation,
} from "@/store/slices/finance/FinanceIncomeApi";
import { useGetActiveCurrencyQuery } from "@/store/slices/settingsApi/SttCurrencyApi";
import { useGetAllExpenceQuery } from "@/store/slices/settingsApi/SttExpenceApi";
import { Income, IncomeSubmitPayload } from "@/types/finance/income";
import { SalesAgent } from "@/types/SalesCanban";
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
  editData?: Income | null; // yangi qo‘shildi
};
const IncomeCreate: React.FC<PropsCreate> = ({
  createOpen,
  createCloes,
  editData,
}) => {
  // rtk
  const [createMutate, { isLoading }] = useCreateFinanceIncomeMutation();
  const [updateMutate, { isLoading: isLoadingUpdate }] =
    useUpdateFinanceIncomeMutation();
  const { data: forSelectSales } = useGetFinanceIncomeSalesQuery();
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
        income_types: editData.income_types.map((e) => e.id),
        sales_agent: editData.sales_agent.fullname,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async (values: Income) => {
    const joinDateMs = dayjs(values.date).valueOf();
    const newData: IncomeSubmitPayload = {
      ...values,
      date: String(joinDateMs),
      cost: +values.cost,
      current_rate: +values.current_rate,
      sales_agent: {
        id:
          typeof values.sales_agent === "object" && values.sales_agent !== null
            ? Number(values.sales_agent.id)
            : Number(values.sales_agent),
      },
      income_types: Array.isArray(values.income_types)
        ? values.income_types.map((item) =>
            typeof item === "object" && item !== null
              ? { id: typeof item.id === "number" ? item.id : Number(item.id) }
              : { id: Number(item) }
          )
        : [{ id: Number(values.income_types) }],
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
                  name="income_types"
                  label="Income type"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select income type" size="large">
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
                  name="sales_agent"
                  label="Sales agent"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="select sales agent" size="large">
                    {forSelectSales?.data.map((item: SalesAgent) => (
                      <Option key={item.id} value={item.id}>
                        {item.fullname}(sales)
                      </Option>
                    ))}
                  </Select>
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
                  name="comment"
                  label="Comment"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="write full name..." size="large" />
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

export default IncomeCreate;
