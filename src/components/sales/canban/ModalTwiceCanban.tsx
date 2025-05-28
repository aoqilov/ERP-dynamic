"use client";
import {
  CanbanItem,
  SalesAgent,
  StatusResponseCanbanItem,
} from "@/types/SalesCanban";
import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Modal,
  notification,
  Row,
  Select,
} from "antd";
import { useForm } from "antd/es/form/Form";
import TextArea from "antd/es/input/TextArea";
import React, { useEffect, useState } from "react";
import "@/wscss/components/canban/_modalTwice.scss";
import { useGetActiveCurrencyQuery } from "@/store/slices/settingsApi/SttCurrencyApi";
import { useGetFinanceIncomeSalesQuery } from "@/store/slices/finance/FinanceIncomeApi";
import dayjs from "dayjs";
import {
  useCreateCanbanBoardMutation,
  useUpdateCanbanBoardMutation,
} from "@/store/slices/SalesApi/SlCanbanApi";

type PropsModalTwice = {
  editData?: CanbanItem;
  modalTwiceOpen: boolean;
  modalTwiceClose: () => void;
  mainData: StatusResponseCanbanItem[] | undefined;
  activeStatus: number | null;
};

const ModalTwiceCanban: React.FC<PropsModalTwice> = ({
  modalTwiceOpen,
  modalTwiceClose,
  mainData,
  activeStatus,
  editData,
}) => {
  const { Option } = Select;
  const { data: activeCurrency } = useGetActiveCurrencyQuery();
  const { data: forSelectSales } = useGetFinanceIncomeSalesQuery();

  const [form] = useForm();
  //
  const [activeId, setActiveId] = useState<number | null>(null);
  const [api, context] = notification.useNotification();

  const [createCanban, { isLoading }] = useCreateCanbanBoardMutation();
  const [updateCanban] = useUpdateCanbanBoardMutation();
  useEffect(() => {
    if (activeStatus) {
      setActiveId(activeStatus); // Prop orqali kelgan id ni set qilamiz
    }
  }, [activeStatus]);

  useEffect(() => {
    if (editData) {
      form.setFieldsValue({
        ...editData,
        canban_status: { id: activeId },
        sales_agent: { id: editData.sales_agent },
        currency: { id: editData.currency },
        date: +editData.da,
        cost: +editData.cost,
      });
    } else {
      form.resetFields();
    }
  }, [editData, form]);

  async function handleSubmit(values: any) {
    const joinDateMs = dayjs(values.date).valueOf();
    const newData = {
      ...values,
      canban_status: { id: activeId },
      sales_agent: { id: values.sales_agent },
      currency: { id: values.currency },
      date: joinDateMs.toString(),
      cost: +values.cost,
    };
    try {
      if (editData) {
        const resUp = await updateCanban({
          id: editData.id,
          data: newData,
        }).unwrap();
        api.success({ message: resUp.message });
        modalTwiceClose();
      } else {
        const resCre = await createCanban(newData).unwrap();
        api.success({ message: resCre.message });
        modalTwiceClose();
      }
    } catch (err) {
      console.error(err);
    }
  }

  return (
    <div className="modalTwice">
      {context}
      <Modal
        className="modalTwice__modal"
        title="Add new project"
        open={modalTwiceOpen}
        width={"60%"}
        onCancel={modalTwiceClose}
        footer={null}
      >
        <p>Here you may add new canban.</p>
        <Form
          form={form}
          layout="vertical"
          className="modalTwice__form"
          onFinish={handleSubmit}
        >
          <Row gutter={16} style={{ margin: "20px 0px" }}>
            {mainData?.map((item) => {
              const isActive = activeId === item.id;

              return (
                <Col key={item.id}>
                  <Button
                    type="default"
                    onClick={() => setActiveId(item.id)}
                    style={{
                      backgroundColor: isActive ? item.color : "transparent",
                      color: isActive ? "#fff" : item.color,
                      border: `1px solid ${item.color}`,
                      fontWeight: isActive ? "bold" : "normal",
                    }}
                  >
                    {item.name}
                  </Button>
                </Col>
              );
            })}
          </Row>
          <Row gutter={16}>
            <Col span={8}>
              <Form.Item label="Project Name" name={"project_name"}>
                <Input size="large" placeholder="write name..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item name="date" label="Date" rules={[{ required: true }]}>
                <DatePicker
                  style={{ width: "100%" }}
                  format="DD/MM/YYYY"
                  placeholder="DD/MM/YYYY"
                  size="large"
                />
              </Form.Item>
            </Col>

            <Col span={5}>
              <Form.Item label="Cost" name={"cost"}>
                <Input size="large" placeholder="add salary..." />
              </Form.Item>
            </Col>
            <Col span={3}>
              <Form.Item name="currency" label=" " rules={[{ required: true }]}>
                <Select
                  placeholder="Select currency"
                  size="large"
                  onChange={(selectedName) => {
                    const selectedCurrency = activeCurrency?.data.find(
                      (item) => item.id === selectedName
                    );
                    if (selectedCurrency) {
                      form.setFieldsValue({
                        current_rate: selectedCurrency.rate,
                      });
                    }
                  }}
                >
                  {activeCurrency?.data.map((item) => (
                    <Select.Option key={item.id} value={item.id}>
                      {item.name}
                    </Select.Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Project Name" name={"phone_number"}>
                <Input size="large" placeholder="write number..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item label="Client name" name={"client_name"}>
                <Input size="large" placeholder="write name..." />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="sales_agent"
                label="Sales agent"
                rules={[{ required: true }]}
              >
                <Select placeholder="select sales agent" size="large">
                  {forSelectSales?.data.map((item: SalesAgent) => (
                    <Option key={item.id} value={item.id}>
                      {item.fullname}(sales)
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={24}>
              <Form.Item label="Description" name={"description"}>
                <TextArea placeholder="description" />
              </Form.Item>
            </Col>
          </Row>
          <Form.Item style={{ textAlign: "right" }}>
            <Button onClick={modalTwiceClose} style={{ marginRight: 8 }}>
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

export default ModalTwiceCanban;
