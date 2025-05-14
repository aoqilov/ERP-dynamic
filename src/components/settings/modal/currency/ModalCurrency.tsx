import { useCreateCurrencyTitleMutation } from "@/store/slices/settingsApi/SttCurrencyApi";
import { CurrencyType } from "@/types/Settings";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
// Updated succesfully!
const ModalCurrency: React.FC<Props> = ({ cancel, open }) => {
  const [crateJobMut, { isLoading }] = useCreateCurrencyTitleMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();

  const handleSubmit = async (values: CurrencyType) => {
    await crateJobMut({ ...values, rate: +values.rate }); // serverga jo‘natish
    api.success({ message: "Created succesfully!" });
    cancel();
  };

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Add Job Title"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"50%"}
      >
        <Form layout="vertical" form={form} onFinish={handleSubmit}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              gap: "20px",
            }}
          >
            <Form.Item
              name="name"
              label="Currency"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Currency" />
            </Form.Item>
            <Form.Item
              name="rate"
              label="Current Rate"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="add current rate.."
                formatter={(value) =>
                  `${value}`.replace(/\B(?=(\d{3})+(?!\d))/g, " ")
                }
                // parser={(value) => value?.replace(/\s*/g, "")}
              />
            </Form.Item>
          </div>

          {/* footer */}
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={cancel} style={{ marginRight: 8 }}>
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

export default ModalCurrency;
