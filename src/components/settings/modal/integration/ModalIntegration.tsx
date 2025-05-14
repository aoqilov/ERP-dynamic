import { useCreateIntegrationTitleMutation } from "@/store/slices/settingsApi/SttIntegrationApi";
import { CurrencyType } from "@/types/Settings";
import { Button, Form, Input, InputNumber, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
// Updated succesfully!
const ModalIntegration: React.FC<Props> = ({ cancel, open }) => {
  const [crateJobMut, { isLoading }] = useCreateIntegrationTitleMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();

  const handleSubmit = async (values: CurrencyType) => {
    await crateJobMut({ ...values, surcharge: +values.surcharge }); // serverga jo‘natish
    api.success({ message: "Created succesfully!" });
    cancel();
  };

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Add Integration"
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
              label="Title"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Integration" />
            </Form.Item>
            <Form.Item
              name="surcharge"
              label="Number %"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <InputNumber
                style={{ width: "100%" }}
                placeholder="Write number.."
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

export default ModalIntegration;
