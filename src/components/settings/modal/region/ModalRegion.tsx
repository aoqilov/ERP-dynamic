import { useCreateRegionTitleMutation } from "@/store/slices/settingsApi/SttRegionApi";
import { Button, Form, Input, Modal, notification } from "antd";
import React, { useState } from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
// Updated succesfully!
const ModalRegion: React.FC<Props> = ({ cancel, open }) => {
  const [createRegionTitle, { isLoading }] = useCreateRegionTitleMutation();
  const [api, contextHolder] = notification.useNotification();
  const [title, setTitle] = useState("");

  const handleSubmit = async () => {
    if (!title.trim()) {
      return alert("Title is required");
    }

    await createRegionTitle({ name: title }); // serverga jo‘natish
    api.success({ message: "Created succesfully!" });
    cancel();
    setTitle(""); // forma tozalash
  };

  return (
    <div className="modal">
      {contextHolder}
      <Modal
        title="Add Country Title"
        open={open}
        onCancel={cancel}
        footer={null}
        width={"40%"}
      >
        <Form layout="vertical">
          <Form.Item
            label="Country name"
            rules={[{ required: true }]}
            style={{ width: "300px" }}
          >
            <Input
              placeholder="country"
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

export default ModalRegion;
