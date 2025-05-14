"use client";
import { usePathname } from "next/navigation";

import React, { ReactNode, useEffect, useState } from "react";
import { MenuFoldOutlined, MenuUnfoldOutlined } from "@ant-design/icons";
import { LoadingOutlined } from "@ant-design/icons";

import { Button, Flex, Layout, Menu, Spin, theme } from "antd";
import { Provider } from "react-redux";
import { store } from "@/store/store";
import sidebarMenu from "@/lib/static/layout/sidebarMenu";
import Image from "next/image";

// import { MdLogout } from "react-icons/md";

const { Sider, Content } = Layout;
interface AppLayoutProps {
  children: ReactNode;
}
const AppLayout: React.FC<AppLayoutProps> = ({ children }) => {
  const pathname = usePathname();

  const [collapsed, setCollapsed] = useState(false);
  const {
    token: {},
  } = theme.useToken();
  const [isMounted, setIsMounted] = useState(false);

  useEffect(() => {
    // sahifa to‘liq yuklanganda isMounted true bo‘ladi
    const timer = setTimeout(() => {
      setIsMounted(true);
    }, 500); // istasangiz 100 yoki 0 ham qilsa bo‘ladi
    return () => clearTimeout(timer);
  }, []);

  if (!isMounted) {
    return (
      <div className="page-loading">
        <Flex align="center" gap="middle">
          <Spin indicator={<LoadingOutlined spin style={{ fontSize: 48 }} />} />
        </Flex>
      </div>
    );
  }

  // openKeys uchun birinchi segmentni olamiz (masalan: /settings/jobtitle => settings)
  const rootKey = pathname.split("/")[1];
  const openKeys = rootKey ? [rootKey] : [];

  return (
    <Layout className="layout" style={{ height: "100vh", overflowY: "unset" }}>
      <header className="header">
        <div className="header__logo">
          <Button
            type="text"
            className="logo-colapsed"
            icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
            onClick={() => setCollapsed(!collapsed)}
            style={{
              fontSize: "24px",
              width: 30,
              height: 40,
            }}
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
            <div className="info-name">testboy testovich</div>
            <div className="info-degrees">
              <p className="type">Frontend</p>
              <p className="level">junoir</p>
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
          width={collapsed == true ? 300 : 240}
          // width={collapsed ? 300 : 50}
          collapsed={collapsed}
          style={{ overflowY: "auto" }}
        >
          <div className="demo-logo-vertical">
            <Menu
              className="sidebar__menu"
              mode="inline"
              items={sidebarMenu}
              selectedKeys={[pathname]} // aktiv link
              defaultOpenKeys={openKeys} // submenu ochiq bo‘ladi
            />
            {/* <Button
              iconPosition="start"
              icon={<MdLogout size={24} />}
              type="text"
              danger
              className="logout"
            >
              Logout
            </Button> */}
          </div>
        </Sider>
        <Provider store={store}>
          <Content className="content">{children}</Content>
        </Provider>
      </Layout>
    </Layout>
  );
};

export default AppLayout;
