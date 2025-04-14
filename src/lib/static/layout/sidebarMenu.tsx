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
    key: "sub1",
    icon: <HiClipboardDocumentList width={24} />,
    label: <Link href="/projects">Projects</Link>,
  },
  {
    key: "sub2",
    icon: <HiOutlineUsers />,
    label: <Link href="/employes">Employees</Link>,
  },
  {
    key: "sub3",
    icon: <BsTable />,
    label: "Log",
    children: [{ key: "sub3-1", label: <Link href="/">Projects</Link> }],
  },
  {
    key: "sub4",
    icon: <IoSettingsOutline />,
    label: "Settings",
    children: [
      { key: "sub4-1", label: <Link href="/">Job Title</Link> },
      { key: "sub4-2", label: <Link href="/">Currency</Link> },
      { key: "sub4-3", label: <Link href="/">Country</Link> },
      { key: "sub4-4", label: <Link href="/">Project type</Link> },
      { key: "sub4-5", label: <Link href="/">Integration</Link> },
      { key: "sub4-6", label: <Link href="/">Canban status</Link> },
      { key: "sub4-7", label: <Link href="/">Experiance</Link> },
      { key: "sub4-8", label: <Link href="/">Expense Type</Link> },
      { key: "sub4-9", label: <Link href="/">Income Type</Link> },
      { key: "sub4-10", label: <Link href="/">Company wage</Link> },
    ],
  },
  {
    key: "sub5",
    icon: <HiOutlinePresentationChartLine />,
    label: "Sales",
    children: [
      { key: "sub5-1", label: <Link href="/">Calculator</Link> },
      { key: "sub5-2", label: <Link href="/">Canban</Link> },
    ],
  },
  {
    key: "sub6",
    icon: <BsClipboardData />,
    label: "Finance",
    children: [
      { key: "sub6-1", label: <Link href="/">Dashboard</Link> },
      { key: "sub6-2", label: <Link href="/">Expenses</Link> },
      { key: "sub6-3", label: <Link href="/">Income</Link> },
      { key: "sub6-4", label: <Link href="/">Support</Link> },
    ],
  },
  {
    key: "sub7",
    icon: <FaTasks />,
    label: "Task playground",
  },
];

export default sidebarMenu;
