import { usePatchJobDataMutation } from "@/store/slices/SettingsApi";
import { JobTitle } from "@/types/Settings";
import { Button, Form, Input, Modal, Switch } from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
  oneData: JobTitle | null;
};
const ModalJobEdit: React.FC<Props> = ({ cancel, open, oneData }) => {
  const [updataEditData, { isLoading }] = usePatchJobDataMutation();
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
    cancel();
  }

  console.log(oneData);

  return (
    <div className="modal">
      <Modal
        title="Edit Job Title"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"40%"}
      >
        <Form form={form} layout="vertical" onFinish={handleSubmit}>
          <Form.Item
            label="Title"
            name="name"
            rules={[{ required: true }]}
            style={{ width: "300px" }}
          >
            <Input placeholder="add job title" />
          </Form.Item>
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

export default ModalJobEdit;
