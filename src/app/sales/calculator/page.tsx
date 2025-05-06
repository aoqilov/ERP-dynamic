"use client";
import { Button, Form, Input, Select } from "antd";
import React from "react";
import { FaCalculator } from "react-icons/fa";
import { LuRefreshCw } from "react-icons/lu";
const { Option } = Select;

const CalculatorPage = () => {
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
          >
            Clear all
          </Button>
          <Button
            size="large"
            type="primary"
            iconPosition="end"
            icon={<FaCalculator />}
            style={{ marginLeft: 30 }}
          >
            Calculate
          </Button>
        </div>
      </div>
      <Form layout="vertical" className="calculator__form">
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
            <Select
              style={{ width: 300 }}
              size="large"
              placeholder="select PM"
              options={[
                { value: "", label: "All" },
                { value: "not started", label: "Not started" },
                { value: "inprogress", label: "In progress" },
                { value: "testing", label: "Testing" },
                { value: "stoped", label: "Stopped" },
                { value: "finished", label: "Finished" },
                { value: "archived", label: "Archived" },
              ]}
            ></Select>
          </Form.Item>
        </div>
        <span className="line"></span>
        <div className="floor-two">
          <Form.Item label="Project type">
            <Select
              mode="multiple"
              allowClear
              style={{ width: 250 }}
              size="large"
              placeholder="Select project type"
              options={[
                { value: "", label: "All" },
                { value: "not started", label: "Not started" },
                { value: "inprogress", label: "In progress" },
                { value: "testing", label: "Testing" },
                { value: "stoped", label: "Stopped" },
                { value: "finished", label: "Finished" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Integration">
            <Select
              mode="multiple"
              allowClear
              style={{ width: 250 }}
              size="large"
              placeholder="Select integration"
              options={[
                { value: "", label: "All" },
                { value: "not started", label: "Not started" },
                { value: "inprogress", label: "In progress" },
                { value: "testing", label: "Testing" },
                { value: "stoped", label: "Stopped" },
                { value: "finished", label: "Finished" },
                { value: "archived", label: "Archived" },
              ]}
            />
          </Form.Item>

          <Form.Item label="Team">
            <div
              className="chdefault"
              style={{ display: "flex", gap: "0px", width: "400px" }}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Select team"
                style={{
                  width: "60%",
                  borderRadius: 0,
                }}
                size="large"
              >
                <Option value="team1">Team 1</Option>
                <Option value="team2">Team 2</Option>
              </Select>
              <Input
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
