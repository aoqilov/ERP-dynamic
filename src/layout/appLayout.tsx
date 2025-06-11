"use client";
import { usePathname, useRouter } from "next/navigation";
import React, { ReactNode, useEffect, useState } from "react";
import { Layout, Spin, Flex, Button, Menu, MenuProps, Popconfirm } from "antd";
import {
  LoadingOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
} from "@ant-design/icons";
import { store } from "@/store/store";
import { Provider } from "react-redux";
import sidebarMenu from "@/lib/static/layout/sidebarMenu";
import Image from "next/image";
import dayjs from "dayjs";
import { MdLogout } from "react-icons/md";

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

    const isExpired = expiration && dayjs().isAfter(dayjs(expiration));

    if (isExpired) {
      localStorage.clear();
      router.push("/auth/login");
      return;
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
  //
  const handleMenuClick = () => {
    localStorage.clear();
    router.push("/auth/login");
  };
  const menuItemsBottom: MenuProps["items"] = [
    {
      key: "logout",
      icon: <MdLogout color="red" size={25} />,
      label: (
        <Popconfirm
          title="Are you sure you want to log out?"
          okText="Yes"
          cancelText="No"
          onConfirm={handleMenuClick}
        >
          <p style={{ color: "red", fontWeight: "500", fontSize: 16 }}>
            Log out
          </p>
        </Popconfirm>
      ),
    },
  ];

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
            alt="user"
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
          <div
            style={{
              display: "flex",
              justifyContent: "space-between",
              flexDirection: "column",
              height: "100%",
            }}
          >
            <Menu
              className="sidebar__menu"
              mode="inline"
              items={sidebarMenu}
              selectedKeys={[pathname]}
              defaultOpenKeys={openKeys}
            />
            <div
              style={{ borderTop: "1px solid #e8e8e8", marginBottom: "10px" }}
            >
              <Menu
                mode="inline"
                items={menuItemsBottom}
                className="mb-4 border-0"
              />
            </div>
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
