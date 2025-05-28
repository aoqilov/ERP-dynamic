"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { Layout, Spin, Flex } from "antd";
import { LoadingOutlined } from "@ant-design/icons";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import sidebarMenu from "@/lib/static/layout/sidebarMenu";
import Image from "next/image";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { Button, Menu } from "antd";
import dayjs from "dayjs";

const { Sider, Content } = Layout;

interface AppLayoutProps {
  children: ReactNode;
}

const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();
  const router = useRouter();
  const [collapsed, setCollapsed] = useState(false);
  const [isMounted, setIsMounted] = useState(false);
  const [authorized, setAuthorized] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem("token");
    const expiration = localStorage.getItem("token_expiration");

    const isLoginPage = pathname.startsWith("/auth/login");

    if (expiration) {
      const now = dayjs();
      const expirationDate = dayjs(expiration);

      if (expirationDate.isBefore(now)) {
        localStorage.clear();
        router.push("/auth/login");
        return;
      }
    }

    if (!token && !isLoginPage) {
      router.push("/auth/login");
    } else if (token && isLoginPage) {
      router.push("/projects");
    } else {
      setAuthorized(true);
    }

    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 300);

    return () => clearTimeout(timer);
  }, [pathname, router]);

  if (!isMounted || !authorized) {
    return (
      <div className="page-loading">
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />} />
        </Flex>
      </div>
    );
  }

  const rootKey = pathname.split("/")[1];
  const openKeys = rootKey ? [rootKey] : [];

  const userDataString = localStorage.getItem("userData");
  const userData = userDataString ? JSON.parse(userDataString) : null;

  return (
    <Layout className="layout" style={{ height: "100vh", overflowY: "unset" }}>
      <header className="header">
        <div className="header__logo">
          <Button
            type="text"
            className="logo-colapsed"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{ fontSize: "24px", width: 30, height: 40 }}
          />
          <Image
            src="https://test.erp.dynamicsoft.uz/static/media/logo.8e3ad7260923ae78ee557cb474b0a830.svg"
            alt="logo"
            width={157}
            height={28}
          />
        </div>
        <div className="header__user">
          <Image
            src="https://test.erp.dynamicsoft.uz/static/media/user.d6cdb573af00fde2b9ea789ebf0c5003.svg"
            alt="sd"
            width={40}
            height={40}
          />
          <div className="user-info">
            <div className="info-name">{userData?.fullname}</div>
            <div className="info-degrees">
              <p className="type">{userData?.role}</p>
              <p className="level">{userData?.status ? "LEAD" : ""}</p>
            </div>
          </div>
        </div>
      </header>
      <Layout>
        <Sider
          className="sidebar"
          theme="light"
          trigger={null}
          collapsible
          width={collapsed ? 300 : 240}
          collapsed={collapsed}
          style={{ overflowY: "auto" }}
        >
          <Menu
            className="sidebar__menu"
            mode="inline"
            items={sidebarMenu}
            selectedKeys={[pathname]}
            defaultOpenKeys={openKeys}
          />
        </Sider>
        <Provider store={store}>
          <Content className="content">{children}</Content>
        </Provider>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
