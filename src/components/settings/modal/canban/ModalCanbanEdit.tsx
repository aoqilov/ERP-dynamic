import { usePatchCanbanDataMutation } from "@/store/slices/settingsApi/SttCanbanApi";
import { CurrencyType } from "@/types/Settings";
import {
  Button,
  ColorPicker,
  Form,
  Input,
  Modal,
  notification,
  Switch,
} from "antd";
import { useForm } from "antd/es/form/Form";
import React, { useEffect } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
  oneData: CurrencyType | null;
};
const ModalCanbanEdit: React.FC<Props> = ({ cancel, open, oneData }) => {
  const [updataEditData, { isLoading }] = usePatchCanbanDataMutation();
  const [api, contextHolder] = notification.useNotification();
  const [form] = useForm();
  useEffect(() => {
    if (oneData) {
      form.setFieldsValue({
        ...oneData,
      });
    }
  }, [oneData, form]);

  async function handleSubmit(values: CurrencyType) {
    await updataEditData({ id: oneData?.id, body: values });
    api.success({ message: "Updated successfuly" });
    cancel();
  }

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Edit Currency Title"
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
              label="Currency"
              rules={[{ required: true }]}
              style={{ flex: 1 }}
            >
              <Input placeholder="Currency" />
            </Form.Item>
            <Form.Item name="color" label="Color">
              <Form.Item noStyle shouldUpdate>
                {({ getFieldValue, setFieldValue }) => (
                  <ColorPicker
                    value={getFieldValue("color")}
                    onChangeComplete={(color) =>
                      setFieldValue("color", color.toHexString())
                    }
                    showText
                    style={{ cursor: "pointer" }}
                  />
                )}
              </Form.Item>
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

export default ModalCanbanEdit;
