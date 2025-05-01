import { Button, Form, Input, Modal } from "antd";
import React from "react";

type Props = {
  open: boolean;
  cancel: () => void;
};
const ModalJob: React.FC<Props> = ({ cancel, open }) => {
  return (
    <div className="modal">
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
            <Input placeholder="add job title" />
          </Form.Item>
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={cancel} style={{ marginRight: 8 }}>
              Cancel
            </Button>
            <Button type="primary" htmlType="submit">
              Save
            </Button>
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
};

export default ModalJob;
