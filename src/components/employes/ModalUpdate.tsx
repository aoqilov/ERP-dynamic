import React, { useEffect } from "react";
import {
  Modal,
  Form,
  Input,
  Select,
  DatePicker,
  Switch,
  Button,
  Row,
  Col,
  notification,
} from "antd";
import { EmployesType } from "@/types/Employes";
import dayjs from "dayjs";
import { useUpdateEmployeMutation } from "@/store/slices/EmployesApi";

const { Option } = Select;

type Props = {
  open: boolean;
  onCancel: () => void;
  oneEmploye: EmployesType | null;
};

const ModalUpdate: React.FC<Props> = ({ open, onCancel, oneEmploye }) => {
  const [updateEmploye, { isLoading }] = useUpdateEmployeMutation();

  //  notification
  const [api, contextHolder] = notification.useNotification();
  const [form] = Form.useForm();

  useEffect(() => {
    if (oneEmploye) {
      form.setFieldsValue({
        ...oneEmploye,
        password: "",
        birth_date: dayjs(+oneEmploye.birth_date),
        date_join: dayjs(+oneEmploye.date_join),
        salary: String(oneEmploye.salary),
        currency: oneEmploye.currency?.id,
        company: oneEmploye.company[0]?.id,
        region: oneEmploye.region?.id,
        job_title: oneEmploye.job_title?.id,
        work_experience: oneEmploye.work_experience?.id,
      });
    } else {
    }
  }, [oneEmploye, form]);

  const handleFinish = async (values: EmployesType) => {
    const birthDateMs = dayjs(values.birth_date).valueOf(); // yoki toDate().getTime()
    const joinDateMs = dayjs(values.date_join).valueOf(); // yoki toDate().getTime()

    const newData: Partial<EmployesType> = {
      ...values,
      password: null,
      salary: Number(values.salary),
      work_experience: { id: +values.work_experience },
      company: { id: +values.company }, // single object with id
      region: { id: +values.region },
      job_title: { id: +values.job_title },
      currency: { id: +values.currency },
      birth_date: birthDateMs,
      date_join: joinDateMs,
      status: "active",
    };

    try {
      await updateEmploye({
        id: oneEmploye?.id, // bu `oneEmploye` ning idsi
        data: newData, // bu siz formdan to'plagan object
      }).unwrap();
      api.success({
        message: "Updated Success",
      });
      onCancel();
      form.resetFields();
    } catch (error) {
      console.error("Xatolik:", error);
    }
  };

  return (
    <Modal
      title="Edit Employee"
      style={{ position: "relative", top: "50px" }}
      open={open}
      onCancel={onCancel}
      footer={null}
      width={"70%"}
      height={"80vh"}
    >
      {contextHolder}
      <p style={{ color: "#888" }}>Fill in the details for the new employee.</p>

      <Form
        form={form}
        style={{ marginTop: "30px" }}
        layout="vertical"
        onFinish={handleFinish}
      >
        <Row gutter={16}>
          <Col span={6}>
            <Form.Item
              name="fullname"
              label="Full Name"
              rules={[{ required: true }]}
            >
              <Input placeholder="write full name..." />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="phone_number"
              label="Phone Number"
              rules={[{ required: true }]}
            >
              <Input placeholder="write phone number..." />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="address"
              label="Address"
              rules={[{ required: true }]}
            >
              <Input placeholder="write street and dsistrict" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="date_join"
              label="Date of Join"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="birth_date"
              label="Birth Date"
              rules={[{ required: true }]}
            >
              <DatePicker
                style={{ width: "100%" }}
                format="DD/MM/YYYY"
                placeholder="DD/MM/YYYY"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="email"
              label="Email"
              rules={[{ required: true, type: "email" }]}
            >
              <Input placeholder="write email" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="telegram"
              label="Telegram"
              rules={[{ required: true }]}
            >
              <Input placeholder="write Telegram @username" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item
              name="salary"
              label="Salary"
              rules={[{ required: true }]}
            >
              <Input placeholder="add salary" type="number" />
            </Form.Item>
          </Col>
          <Col span={3}>
            <Form.Item name="currency" label=" " rules={[{ required: true }]}>
              <Select placeholder="select curency">
                <Option value={1}>UZS</Option>
                <Option value={2}>USD</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="job_title"
              label="Job Title"
              rules={[{ required: true }]}
            >
              <Select placeholder="select title">
                <Option value={1}>CEO</Option>
                <Option value={2}>Developer</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="region"
              label="Choose City"
              rules={[{ required: true }]}
            >
              <Select placeholder="select city">
                <Option value={1}>Toshkent</Option>
                <Option value={2}>Boshqa</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="company"
              label="Company"
              rules={[{ required: true }]}
            >
              <Select placeholder="select company...">
                <Option value={1}>Dynamic</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="work_experience"
              label="Work Experience"
              rules={[{ required: true }]}
            >
              <Select placeholder="select experience">
                <Option value={1}>6 oy</Option> {/* id 1 */}
                <Option value={2}>1 yil</Option> {/* id 2 */}
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="role" label="Role" rules={[{ required: true }]}>
              <Select placeholder="select role">
                <Option value="pm">PM</Option>
                <Option value="ceo">CEO</Option>
                <Option value="hr">HR</Option>
                <Option value="dev">DEV</Option>
                <Option value="sales">SALES</Option>
              </Select>
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true }]}
            >
              <Input placeholder="username" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="password"
              label="Password"
              rules={[{ required: true }]}
            >
              <Input.Password placeholder="password" />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="is_lead" label="Is Lead" valuePropName="checked">
              <Switch />
            </Form.Item>
          </Col>
        </Row>

        <Form.Item style={{ textAlign: "right" }}>
          <Button onClick={onCancel} style={{ marginRight: 8 }}>
            Cancel
          </Button>
          <Button type="primary" htmlType="submit" loading={isLoading}>
            Save
          </Button>
        </Form.Item>
      </Form>
    </Modal>
  );
};

export default ModalUpdate;
