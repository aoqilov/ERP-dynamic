import React, { useState } from "react";
import { Button, DatePicker, Input, message, Modal, Form } from "antd";
import { FaPlus } from "react-icons/fa";
import "@/wscss/components/projects/_projectAddModal.scss";
import { useCreateProjectMutation } from "@/store/slices/ProjectsApi";
import dayjs, { Dayjs } from "dayjs";

const ProjectAddModal: React.FC = () => {
  const [messageApi, contextHolder] = message.useMessage();
  // modal open
  const [isModalOpen, setIsModalOpen] = useState(false);
  // rtk
  const [createProject, { isLoading }] = useCreateProjectMutation();

  const [formData, setFormData] = useState({
    name: "",
    start: null,
    deadline: null,
  });

  const [form] = Form.useForm(); // Using Ant Design's Form hook

  const handleSubmit = async () => {
    // Trigger form validation
    form
      .validateFields()
      .then(async () => {
        try {
          const newProject = {
            name: formData.name,
            start: Number(formData.start),
            deadline: Number(formData.deadline),
          };

          // Trigger the mutation to create the project
          await createProject(newProject).unwrap();
          messageApi.success("Project added successfully!");
          form.resetFields();
          setIsModalOpen(false); // Close the modal after successful submission
        } catch (err) {
          messageApi.error("Error creating project. Please try again.");
          console.log(err.message);
        }
      })
      .catch((errorInfo) => {
        console.log("Validation Failed:", errorInfo);
      });
  };

  const showModal = () => {
    setIsModalOpen(true);
  };

  const handleOk = () => {
    handleSubmit();
    if (isLoading) {
      setIsModalOpen(false);
    }
  };

  const handleCancel = () => {
    setIsModalOpen(false);
  };

  // handle onchange
  const handleChange = (field: string, value: string | number) => {
    setFormData((prevData) => ({
      ...prevData,
      [field]: value,
    }));
  };

  // Disable past dates
  const disablePastDates = (currentDate: Dayjs) => {
    return currentDate.isBefore(dayjs(), "day");
  };

  return (
    <>
      {contextHolder}
      <Button
        onClick={showModal}
        icon={<FaPlus />}
        iconPosition="start"
        type="primary"
        style={{ height: 40, borderRadius: 20 }}
      >
        Add project
      </Button>
      <Modal
        width={770}
        open={isModalOpen}
        onOk={handleOk}
        onCancel={handleCancel}
        confirmLoading={isLoading}
      >
        <div className="modal">
          <div className="modal__header">
            <h6 className="header-title">Add project</h6>
            <p className="header-description">Add your project and save</p>
          </div>
          <span className="line-modal"></span>
          <Form
            form={form} // Bind form instance to handle validation
            className="modal__form"
            layout="vertical"
          >
            <div className="form-header">
              <Form.Item
                label="Start Date"
                name="start"
                rules={[
                  { required: true, message: "Start Date is required." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const endDate = getFieldValue("deadline");
                      if (value && endDate && value.isAfter(endDate)) {
                        return Promise.reject(
                          "Start date cannot be after the deadline."
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  onChange={(date) => {
                    if (date) {
                      const timestamp = date.valueOf();
                      handleChange("start", timestamp);
                    }
                  }}
                />
              </Form.Item>

              <Form.Item
                label="Project Name"
                name="name"
                rules={[
                  { required: true, message: "Project Name is required." },
                ]}
              >
                <Input
                  placeholder="Project Name"
                  value={formData.name}
                  onChange={(e) => handleChange("name", e.target.value)}
                />
              </Form.Item>

              <Form.Item
                label="Deadline"
                name="deadline"
                rules={[
                  { required: true, message: "Deadline is required." },
                  ({ getFieldValue }) => ({
                    validator(_, value) {
                      const startDate = getFieldValue("start");
                      if (value && startDate && value.isBefore(startDate)) {
                        return Promise.reject(
                          "Deadline cannot be before the start date."
                        );
                      }
                      return Promise.resolve();
                    },
                  }),
                ]}
              >
                <DatePicker
                  disabledDate={disablePastDates}
                  onChange={(date) => {
                    if (date) {
                      const timestamp = date.valueOf(); // Get timestamp in milliseconds
                      handleChange("deadline", timestamp); // Call handleChange with the timestamp
                    }
                  }}
                />
              </Form.Item>
            </div>
          </Form>
        </div>
      </Modal>
    </>
  );
};

export default ProjectAddModal;
