import { usePatchJobDataMutation } from "@/store/slices/settingsApi/SttjobApi";
import { JobTitle } from "@/types/Settings";
import { Button, Form, Input, Modal, notification } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
  oneData: JobTitle | null;
};
const ModalWageEdit: React.FC<Props> = ({ cancel, open, oneData }) => {
  const [updataEditData, { isLoading }] = usePatchJobDataMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();
  useEffect(() => {
    if (oneData) {
      form.setFieldsValue({
        ...oneData,
      });
    }
  }, [oneData, form]);

  async function handleSubmit(values: JobTitle) {
    await updataEditData({ id: oneData?.id, body: values });
    api.success({ message: "Updated successfuly" });
    cancel();
  }

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Add Margin"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"50%"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <Form.Item name="name" label="Margin " rules={[{ required: true }]}>
              <Input placeholder="write number" width={"100%"} />
            </Form.Item>
            <Button type="default" style={{ marginTop: 5 }}>
              %
            </Button>
          </div>

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

export default ModalWageEdit;
