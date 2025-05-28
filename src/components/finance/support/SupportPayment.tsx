import { useCreateFinanceSupportPaymentMutation } from "@/store/slices/finance/FinanceSupportApi";
import { Support } from "@/types/finance/support";
import {
  Button,
  Col,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
const { Option } = Select;

type PropsCreate = {
  paymentOpen: boolean;
  paymentCloes: () => void;
  paymentData?: Support | null; // yangi qo‘shildi
};
const SupportPayment: React.FC<PropsCreate> = ({
  paymentData,
  paymentCloes,
  paymentOpen,
}) => {
  const [api, context] = notification.useNotification();
  const [create, { isLoading }] = useCreateFinanceSupportPaymentMutation();
  const [form] = useForm();
  async function handleSubmit(values: any) {
    const newData = {
      ...values,
      amount: +values.amount,
      currency: { id: paymentData?.currency.id },
      support: { id: paymentData?.id },
    };
    try {
      const resCreate = await create(newData);
      api.success({ message: resCreate.data.message });
      form.resetFields();
      paymentCloes();
    } catch (error) {
      console.error(error);
    }
  }

  return (
    <div>
      {context}
      <Modal
        open={paymentOpen}
        onClose={paymentCloes}
        title="Payment"
        footer={null}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Row gutter={16}>
            <Col span={10}>
              <Form.Item name="method" label="Method">
                <Select placeholder="select method...">
                  <Option value="cash">Cash</Option>
                  <Option value="card">Card</Option>
                  <Option value="bank">Bank</Option>
                </Select>
              </Form.Item>
            </Col>
            <Col span={10}>
              <Form.Item name="amount" label="Cost">
                <Input placeholder="add salary..." type="number" />
              </Form.Item>
            </Col>
            <Col span={4}>
              <Form.Item label=" ">
                <Select disabled value={paymentData?.currency.name}>
                  {paymentData?.currency?.name && (
                    <Option value={paymentData.currency.name}>
                      {paymentData.currency.name}
                    </Option>
                  )}
                </Select>
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={paymentCloes} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit" loading={isLoading}>
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default SupportPayment;
