import { usePatchRegionDataMutation } from "@/store/slices/settingsApi/SttRegionApi";
import { JobTitle } from "@/types/Settings";
import { Button, Form, Input, Modal, notification, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
  oneData: JobTitle | null;
};
const ModalRegionEdit: React.FC<Props> = ({ cancel, open, oneData }) => {
  const [updataEditData, { isLoading }] = usePatchRegionDataMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();
  useEffect(() => {
    if (oneData) {
      form.setFieldsValue({
        ...oneData,
      });
    }
  }, [oneData]);

  async function handleSubmit(values: JobTitle) {
    await updataEditData({ id: oneData?.id, body: values });
    api.success({ message: "Updated successfuly" });
    cancel();
  }

  console.log(oneData);

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Edit Country"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"40%"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
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
              label="Country"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Country" />
            </Form.Item>
          </div>
          <Form.Item label="Status" name="is_active">
            <Switch />
          </Form.Item>
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

export default ModalRegionEdit;
