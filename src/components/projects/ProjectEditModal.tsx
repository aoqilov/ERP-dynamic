import { DatePicker, Form, Input, message, Modal, Select } from "antd";
import "@/wscss/components/projects/_projectAddModal.scss";
import { useEffect } from "react";
import { useUpdateProjectMutation } from "@/store/slices/ProjectsApi";
import { ProjectType } from "@/types/Project";
import dayjs from "dayjs";

const { TextArea } = Input;

interface PropsProjects {
  editData: ProjectType;
  open: boolean;
  onClose: () => void;
}

const ProjectEditModal: React.FC<PropsProjects> = ({
  editData,
  open,
  onClose,
}) => {
  const [messageApi, contextHolder] = message.useMessage();

  const [form] = Form.useForm();

  useEffect(() => {
    // Setting the form fields with proper validation for deadline
    form.setFieldsValue({
      name: editData.name,
      deadline: editData.deadline ? dayjs(Number(editData.deadline)) : null,
      status: editData.status,
      comment: "",
    });
  }, [editData]);

  const [updateProject, { isLoading }] = useUpdateProjectMutation();

  const handleOk = async () => {
    try {
      const values = await form.validateFields();
      // Convert deadline to timestamp if it exists
      const deadlineTimestamp = values.deadline?.valueOf();
      const putobj = {
        comment: values.comment,
        deadline: deadlineTimestamp,
        name: values.name,
        start: Number(editData.start),
        status: values.status,
      };
      messageApi.success("successful update");

      await updateProject({ id: editData.id, ...putobj }).unwrap();

      form.resetFields();
      onClose();
    } catch (errorInfo) {
      messageApi.error("validation faield:" + errorInfo);
    }
  };

  return (
    <>
      {contextHolder}
      <Modal
        width={770}
        open={open}
        onOk={handleOk}
        onCancel={onClose}
        confirmLoading={isLoading}
        okText="Update"
      >
        <div className="modal">
          <div className="modal__header">
            <h6 className="header-title">Edit Project</h6>
            <p className="header-description">Edit your project and save</p>
          </div>
          <span className="line-modal"></span>
          <Form className="modal__form" layout="vertical" form={form}>
            <div className="form-header">
              <Form.Item
                label="Project Name"
                name="name"
                rules={[
                  { required: true, message: "Please enter the project name" },
                ]}
              >
                <Input placeholder="Enter project name" />
              </Form.Item>

              <Form.Item
                label="Change Deadline"
                name="deadline"
                rules={[
                  { required: true, message: "Please select a deadline" },
                ]}
              >
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="Select deadline"
                />
              </Form.Item>

              <Form.Item
                label="Status"
                name="status"
                rules={[{ required: true, message: "Please select a status" }]}
              >
                <Select
                  placeholder="Select project status"
                  options={[
                    { value: "notstarted", label: "Not started" },
                    { value: "inprogress", label: "In progress" },
                    { value: "testing", label: "Testing" },
                    { value: "stoped", label: "Stopped" },
                    { value: "finished", label: "Finished" },
                    { value: "archived", label: "Archived" },
                  ]}
                />
              </Form.Item>
            </div>

            <div className="form-body">
              <Form.Item
                label="Add Comment"
                name="comment"
                rules={[{ required: true, message: "Please add a comment" }]}
              >
                <TextArea
                  showCount
                  maxLength={100}
                  placeholder="Add your comment"
                  style={{ height: 120, resize: "none" }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ProjectEditModal;
