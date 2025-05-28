"use client";
import {
  useGetDevsEmployerQuery,
  useGetPmEmployerQuery,
} from "@/store/slices/SalesApi/SlCalculator";
import { useGetAllIntegrationQuery } from "@/store/slices/settingsApi/SttIntegrationApi";
import { useGetAllPtQuery } from "@/store/slices/settingsApi/SttPtApi";
import { Button, Form, Input, Select } from "antd";
import { useForm } from "antd/es/form/Form";
import React from "react";
import { FaCalculator } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";

const CalculatorPage = () => {
  const { Option } = Select;
  //
  const [form] = useForm();
  const { data: devs } = useGetDevsEmployerQuery();
  const { data: pm } = useGetPmEmployerQuery();
  const { data: pt } = useGetAllPtQuery();
  const { data: integration } = useGetAllIntegrationQuery();

  return (
    <div className="calculator">
      <div className="calculator__header">
        <div className="header-info">
          <div className="info-title">Calculator</div>
          <p className="info-description">
            Here you may see information about sales
          </p>
        </div>
        <div className="header-btn">
          <Button
            size="large"
            type="default"
            iconPosition="end"
            icon={<LuRefreshCw />}
            onClick={() => form.resetFields()}
          >
            Clear all
          </Button>
          <Button
            size="large"
            type="primary"
            iconPosition="end"
            icon={<FaCalculator />}
            style={{ marginLeft: 30 }}
            onClick={() => form.submit()}
          >
            Calculate
          </Button>
        </div>
      </div>
      <Form
        layout="vertical"
        className="calculator__form"
        form={form}
        onFinish={(values) => {
          console.log("Form values:", values);
          // bu yerda hisob-kitob yoki boshqa logic yozish mumkin
        }}
      >
        <div className="floor-one">
          <Form.Item
            label="Client name"
            name="name"
            style={{ width: 300 }}
            rules={[{ required: true, message: "Please input your !" }]}
          >
            <Input placeholder="sss" size="large" />
          </Form.Item>
          <Form.Item
            name="pm"
            label="PM"
            style={{ width: 300 }}
            rules={[{ required: true, message: "Please input your username!" }]}
          >
            <Select style={{ width: 300 }} size="large" placeholder="select PM">
              {pm?.data?.map(
                (item: { fullname: string; id: number; role: string }) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.fullname}({item.role})
                    </Option>
                  );
                }
              )}
            </Select>
          </Form.Item>
        </div>
        <span className="line"></span>
        <div className="floor-two">
          <Form.Item name="pt" label="Project type">
            <Select
              allowClear
              style={{ width: 250 }}
              size="large"
              placeholder="Select project type"
            >
              {pt?.data?.map((item: { name: string; id: number }) => {
                return (
                  <Option key={item.id} value={item.id}>
                    {item.name}
                  </Option>
                );
              })}
            </Select>
          </Form.Item>

          <Form.Item label="Integration" name={"integration"}>
            <Select
              style={{ width: 250 }}
              size="large"
              placeholder="Select integration"
            >
              {integration?.data?.map(
                (item: { id: number | undefined; name: string }) => {
                  return (
                    <Option key={item.id} value={item.id}>
                      {item.name}
                    </Option>
                  );
                }
              )}
            </Select>
          </Form.Item>

          <Form.Item label="Team" name={"dev"}>
            <div
              className="chdefault"
              style={{ display: "flex", gap: "0px", width: "400px" }}
            >
              <Select
                placeholder="Select team"
                style={{
                  width: "60%",
                  borderRadius: 0,
                }}
                size="large"
              >
                {devs?.data?.map(
                  (item: { fullname: string; role: string; id: number }) => {
                    return (
                      <Option key={item.id} value={item.id}>
                        {item.fullname}({item.role})
                      </Option>
                    );
                  }
                )}
              </Select>
              <Input
                name="deadline"
                placeholder="Days"
                size="large"
                style={{
                  width: "20%",
                  borderRadius: 0,
                  textAlign: "center",
                }}
              />
              <Button
                type="primary"
                size="large"
                style={{
                  width: "20%",
                  borderTopLeftRadius: 0,
                  borderBottomLeftRadius: 0,
                }}
              >
                Add
              </Button>
            </div>
          </Form.Item>
        </div>
        <Form.Item label="Deadline" style={{ width: 200 }}>
          <Input placeholder="Days..." size="large" />
        </Form.Item>
      </Form>
    </div>
  );
};

export default CalculatorPage;
