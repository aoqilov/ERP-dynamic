import {
  useCreateFinanceSupportMutation,
  useUpdateFinanceSupportMutation,
} from "@/store/slices/finance/FinanceSupportApi";
import { useGetActiveCurrencyQuery } from "@/store/slices/settingsApi/SttCurrencyApi";
import { Support } from "@/types/finance/support";
import {
  Button,
  Col,
  Form,
  Input,
  InputNumber,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import React, { useEffect } from "react";

type PropsCreate = {
  createOpen: boolean;
  createCloes: () => void;
  editData?: Support | null; // yangi qo‘shildi
};
const SupportCreateEdit: React.FC<PropsCreate> = ({
  createOpen,
  createCloes,
  editData,
}) => {
  // rtk
  const [createMutate, { isLoading }] = useCreateFinanceSupportMutation();
  const [updateMutate, { isLoading: isLoadingUpdate }] =
    useUpdateFinanceSupportMutation();
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
        currency: editData.currency.name,
        // date: dayjs(+editData.date),
        // income_types: editData.income_types.map((e) => e.id),
        // sales_agent: editData.sales_agent.fullname,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  const handleSubmit = async (values: Support) => {
    const newData: Support = {
      ...values,
      currency: { id: Number(values.currency) },
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
        width={"60%"}
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
                  label="Project name"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="write name..." size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="phone_number"
                  label="Phone number"
                  rules={[{ required: true }]}
                >
                  <Input placeholder="write phone number..." size="large" />
                </Form.Item>
              </Col>
              <Col span={8}>
                <Form.Item
                  name="pay_date"
                  label="Pay date"
                  rules={[{ required: true }]}
                >
                  <Select placeholder="write phone number..." size="large">
                    <Option value={1}>1</Option>
                    <Option value={2}>2</Option>
                    <Option value={3}>3</Option>
                    <Option value={4}>4</Option>
                    <Option value={5}>5</Option>
                    <Option value={6}>6</Option>
                    <Option value={7}>7</Option>
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
                      <Select.Option key={item.id} value={item.id}>
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

export default SupportCreateEdit;
