import { useCreateCanbanTitleMutation } from "@/store/slices/settingsApi/SttCanbanApi";
import { CurrencyType } from "@/types/Settings";
import { Button, ColorPicker, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
// Updated succesfully!
const ModalCanban: React.FC<Props> = ({ cancel, open }) => {
  const [crateJobMut, { isLoading }] = useCreateCanbanTitleMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();

  const handleSubmit = async (values: CurrencyType) => {
    await crateJobMut({ ...values }); // serverga jo‘natish
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
            <Form.Item name="color" label="Color">
              <ColorPicker
                showText
                style={{ cursor: "pointer" }}
                onChangeComplete={(color) =>
                  form.setFieldValue("color", color.toHexString())
                }
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

export default ModalCanban;
