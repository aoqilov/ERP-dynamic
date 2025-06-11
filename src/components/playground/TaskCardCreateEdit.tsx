import {
  Modal,
  Form,
  Input,
  DatePicker,
  Select,
  Switch,
  Upload,
  Button,
  Row,
  Col,
  notification,
} from "antd";
import { UploadOutlined } from "@ant-design/icons";
import { useState, useEffect } from "react";
import dayjs from "dayjs";
import {
  useCreatePlaygroundCardMutation,
  usePatchPlaygroundCardMutation,
} from "@/store/slices/playground/PlaygroundApi";

const { TextArea } = Input;

const TaskCardCreateEdit = ({
  open,
  oncancel,
  task,
  employees,
  colId,
  selectedTask,
}: {
  task?: any;
  open: boolean;
  oncancel: () => void;
  employees?: any[];
  colId: string | number;
  selectedTask?: any;
}) => {
  const [createCardMut, { isLoading: isCreateCardLoading }] =
    useCreatePlaygroundCardMutation();

  const [updateCardMut, { isLoading: isUpdateLoading }] =
    usePatchPlaygroundCardMutation(); // Update uchun ham shu mutation ishlatiladi

  const [api, contextHolder] = notification.useNotification();

  const [form] = Form.useForm();
  const [telegram, setTelegram] = useState(true);

  // ✅ Edit holatda formani to‘ldirish
  console.log("Selected Task:", selectedTask);

  useEffect(() => {
    if (selectedTask) {
      form.setFieldsValue({
        name: selectedTask.name,
        deadline: selectedTask.deadline
          ? dayjs(Number(selectedTask.deadline))
          : null,
        priority: selectedTask.priority,
        text_editor: selectedTask.text_editor,
        creators: selectedTask.employees?.map((e: any) => e.id),
        // files formda oldindan to‘ldirilmaydi
      });
      setTelegram(true); // yoki selectedTask.tg_message_available agar bo‘lsa
    } else {
      form.resetFields();
      setTelegram(true);
    }
  }, [selectedTask, form]);
  console.log(colId);
  const handleFinish = async (values: any) => {
    const payload = {
      name: values.name,
      deadline: String(values.deadline?.valueOf()),
      priority: values.priority,
      text_editor: values.text_editor,
      tg_message_available: false,
      order: 1,
      project: { id: 1 },
      playground_section: { id: colId ? +colId : colId },
      employees: values.creators?.map((id: number) => ({ id })),
      files:
        values.files?.fileList?.map((file: any) => file.originFileObj) || [],
    };
    try {
      let res;

      if (selectedTask) {
        // Edit mode
        res = await updateCardMut({
          id: selectedTask.id,
          data: payload,
        }).unwrap();

        if (res.status === 200) {
          api.success({ message: "card yangilandi!" });
        }
      } else {
        // Create mode
        res = await createCardMut(payload).unwrap();

        if (res.status === 201) {
          api.success({ message: "card yaratildi!" });
          form.resetFields();
          oncancel();
        }
      }

      // Muvaffaqiyatli amalga oshgandan keyin
    } catch (error) {
      console.error("Xatolik:", error);
      api.error({
        message: selectedTask
          ? "Playground yangilashda xatolik"
          : "Playground yaratishda xatolik",
      });
    }
  };

  return (
    <Modal
      title={selectedTask ? "Edit Task" : "Add new project"}
      open={open}
      onCancel={() => {
        oncancel();
        form.resetFields();
      }}
      footer={null}
      width={800}
      style={{ top: 20 }}
    >
      {contextHolder}
      <p style={{ marginBottom: 20 }}>
        {selectedTask
          ? "Update task information below."
          : "Here you may add new canban."}
      </p>

      <Form
        form={form}
        layout="vertical"
        onFinish={handleFinish}
        initialValues={{ telegram: true }}
      >
        <Row gutter={16}>
          <Col span={8}>
            <Form.Item
              label="Name"
              name="name"
              rules={[{ required: true, message: "Please enter name" }]}
            >
              <Input placeholder="Write name..." />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Deadline"
              name="deadline"
              rules={[{ required: true, message: "Please select deadline" }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                disabledDate={(current) =>
                  current && current < dayjs().startOf("day")
                }
              />
            </Form.Item>
          </Col>

          <Col span={8}>
            <Form.Item
              label="Priority"
              name="priority"
              rules={[{ required: true, message: "Please select priority" }]}
            >
              <Select placeholder="Select priority...">
                <Select.Option value="low">Low</Select.Option>
                <Select.Option value="medium">Medium</Select.Option>
                <Select.Option value="high">High</Select.Option>
              </Select>
            </Form.Item>
          </Col>
        </Row>

        <Row gutter={16}>
          <Col span={18}>
            <Form.Item
              label="Add creators"
              name="creators"
              rules={[{ required: true, message: "Please select creators" }]}
            >
              <Select mode="multiple" placeholder="Select users">
                {employees?.map((employee) => (
                  <Select.Option key={employee.id} value={employee.id}>
                    {employee.fullname} ({employee.job_title.name})
                  </Select.Option>
                ))}
              </Select>
            </Form.Item>
          </Col>

          <Col span={6}>
            <Form.Item label="Telegram">
              <Switch checked={telegram} onChange={setTelegram} />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item
          label="Description"
          name="text_editor"
          rules={[{ required: true, message: "Please enter description" }]}
        >
          <TextArea rows={3} placeholder="Enter details..." />
        </Form.Item>

        <Form.Item label="Upload" name="files">
          <Upload beforeUpload={() => false} multiple>
            <Button icon={<UploadOutlined />}>Upload</Button>
          </Upload>
        </Form.Item>

        <Form.Item style={{ textAlign: "right" }}>
          <Button onClick={oncancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button
            type="primary"
            htmlType="submit"
            loading={selectedTask ? isUpdateLoading : isCreateCardLoading}
          >
            {selectedTask ? "Update" : "Save"}
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default TaskCardCreateEdit;
