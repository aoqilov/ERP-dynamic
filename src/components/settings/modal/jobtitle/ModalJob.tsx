import { useCreateJobTitleMutation } from "@/store/slices/settingsApi/SttjobApi";
import { Button, Form, Input, Modal, notification } from "antd";
import React, { useState } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
// Updated succesfully!
const ModalJob: React.FC<Props> = ({ cancel, open }) => {
  const [createJobTitle, { isLoading }] = useCreateJobTitleMutation();
  const [api, contextHolder] = notification.useNotification();
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      return alert("Title is required");
    }

    await createJobTitle({ name: title }); // serverga jo‘natish
    api.success({ message: "Created succesfully!" });
    cancel();
    setTitle(""); // forma tozalash
  };

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Add Job Title"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"40%"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Title"
            rules={[{ required: true }]}
            style={{ width: "300px" }}
          >
            <Input
              placeholder="add job title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={cancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              onClick={handleSubmit}
              loading={isLoading}
            >
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalJob;
