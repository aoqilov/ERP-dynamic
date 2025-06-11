"use client";

import { Button, Form, Input, message } from "antd";
import Image from "next/image";
import React from "react";
import { UserOutlined } from "@ant-design/icons";
import { GoKey } from "react-icons/go";
import { useLoginMutation } from "@/store/slices/AuthApi";
import { useRouter } from "next/navigation";
import dayjs from "dayjs";

const LoginPage = () => {
  const [messageApi, contextHolder] = message.useMessage();
  const [form] = Form.useForm();
  const router = useRouter();

  const [login, { isLoading }] = useLoginMutation();

  type loginType = {
    username: string;
    password: string;
  };

  const handleSubmit = async (values: loginType) => {
    try {
      const res = await login({
        username: values.username,
        password: values.password,
      }).unwrap();
      if (!isLoading) {
        localStorage.setItem("token", JSON.stringify(res?.data.token));
        localStorage.setItem("userData", JSON.stringify(res?.data));

        // 7 kunlik token yaroqlilik muddati
        const dateOnly = dayjs().add(7, "day").format("YYYY-MM-DD,HH:mm");
        localStorage.setItem("token_expiration", JSON.stringify(dateOnly));

        messageApi.success("LOGIN SUCCESS");
        router.push("/projects");
      }
      console.log(res);
    } catch (err) {
      console.log(err);
      messageApi.error("LOGIN ERROR");
    }
  };

  return (
    <div className="login">
      {contextHolder}

      <div className="login__logo">
        <Image
          src="https://test.erp.dynamicsoft.uz/static/media/header-logo.d55c27884493e8f7814b55fe7b3fe951.svg"
          alt="logo"
          width={500}
          height={200}
          className="logo-image"
        />
        <Image
          src="https://test.erp.dynamicsoft.uz/static/media/back-line.6ec1d923e7e1fd2f94d803746f5418a6.svg"
          alt="line"
          width={360}
          height={200}
          className="logo-line"
        />
      </div>

      <div className="login__form">
        <h4 className="form-header">Log In to Your Account</h4>
        <Form
          form={form}
          layout="vertical"
          className="form-box"
          onFinish={handleSubmit}
        >
          <Form.Item
            label="Username"
            name="username"
            rules={[{ required: true, message: "Username is required" }]}
          >
            <Input
              style={{ borderRadius: 20 }}
              size="large"
              prefix={<UserOutlined />}
              placeholder="Your username..."
            />
          </Form.Item>

          <Form.Item
            label="Password"
            name="password"
            rules={[
              { required: true, message: "Password is required" },
              {
                validator: (_, value) => {
                  if (!value) return Promise.resolve();

                  const isValidLength = value.length >= 8;
                  const hasUpperCase = /[A-Z]/.test(value);
                  const hasAtSymbol = /@/.test(value);

                  if (!isValidLength) {
                    return Promise.reject(
                      "Password must be at least 8 characters"
                    );
                  }
                  if (!hasUpperCase) {
                    return Promise.reject(
                      "Password must contain at least one uppercase letter"
                    );
                  }
                  if (!hasAtSymbol) {
                    return Promise.reject("Password must contain '@' symbol");
                  }

                  return Promise.resolve();
                },
              },
            ]}
          >
            <Input.Password
              style={{ borderRadius: 20 }}
              size="large"
              prefix={<GoKey />}
              placeholder="Your password..."
            />
          </Form.Item>

          <Button
            htmlType="submit"
            size="large"
            type="primary"
            loading={isLoading}
          >
            Log in to Account
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default LoginPage;
