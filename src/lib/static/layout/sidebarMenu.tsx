import { MenuProps } from "antd"; // Use Ant Design's types
import Link from "next/link";
import {
  HiClipboardDocumentList,
  HiOutlineUsers,
  HiOutlinePresentationChartLine,
} from "react-icons/hi2";
import { BsTable } from "react-icons/bs";
import { IoSettingsOutline } from "react-icons/io5";
import { BsClipboardData } from "react-icons/bs";
import { FaTasks } from "react-icons/fa";

const sidebarMenu: MenuProps["items"] = [
  {
    key: "/projects",
    icon: <HiClipboardDocumentList width={24} />,
    label: <Link href="/projects">Projects</Link>,
  },
  {
    key: "/employes",
    icon: <HiOutlineUsers />,
    label: <Link href="/employes">Employees</Link>,
  },
  {
    key: "log",
    icon: <BsTable />,
    label: "Log",
    children: [
      {
        key: "/log",
        label: <Link href="/log">Projects</Link>,
      },
    ],
  },
  {
    key: "settings",
    icon: <IoSettingsOutline />,
    label: "Settings",
    children: [
      {
        key: "/settings/jobtitle",
        label: <Link href="/settings/jobtitle">Job Title</Link>,
      },
      {
        key: "/settings/currency",
        label: <Link href="/settings/currency">Currency</Link>,
      },
      {
        key: "/settings/country",
        label: <Link href="/settings/country">Country</Link>,
      },
      {
        key: "/settings/project-type",
        label: <Link href="/settings/project-type">Project type</Link>,
      },
      {
        key: "/settings/integration",
        label: <Link href="/settings/integration">Integration</Link>,
      },
      {
        key: "/settings/canbantype",
        label: <Link href="/settings/canbantype">Canban status</Link>,
      },
      {
        key: "/settings/experience",
        label: <Link href="/settings/experience">Experience</Link>,
      },
      {
        key: "/settings/expense",
        label: <Link href="/settings/expense">Expense Type</Link>,
      },
      {
        key: "/settings/income",
        label: <Link href="/settings/income">Income Type</Link>,
      },
      {
        key: "/settings/company-wage",
        label: <Link href="/settings/company-wage">Company wage</Link>,
      },
    ],
  },
  {
    key: "sales",
    icon: <HiOutlinePresentationChartLine />,
    label: "Sales",
    children: [
      {
        key: "/sales/calculator",
        label: <Link href="/sales/calculator">Calculator</Link>,
      },
      {
        key: "/sales/canban",
        label: <Link href="/sales/canban">Canban</Link>,
      },
    ],
  },
  {
    key: "finance",
    icon: <BsClipboardData />,
    label: "Finance",
    children: [
      {
        key: "/finance/dashboard",
        label: <Link href="/finance/dashboard">Dashboard</Link>,
      },
      {
        key: "/finance/expense",
        label: <Link href="/finance/expense">Expenses</Link>,
      },
      {
        key: "/finance/income",
        label: <Link href="/finance/income">Income</Link>,
      },
      {
        key: "/finance/support",
        label: <Link href="/finance/support">Support</Link>,
      },
    ],
  },
  {
    key: "/playground",
    icon: <FaTasks />,
    label: <Link href="/playground">Task playground</Link>,
  },
];

export default sidebarMenu;
